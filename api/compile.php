<?php
declare(strict_types=1);

// Educational compiler/runner endpoint. For production, prefer docker sandbox mode.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const MAX_SOURCE_BYTES = 48_000;
const COMPILE_TIMEOUT_SECONDS = 8.0;
const RUN_TIMEOUT_SECONDS = 3.0;
const MAX_COMPILES_PER_MINUTE = 20;
const MAX_OUTPUT_BYTES = 12_000;
const WORKER_POLL_INTERVAL_MICROSECONDS = 20_000;

function respond(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? (PHP_SAPI === 'cli' ? 'POST' : 'GET');
if ($requestMethod !== 'POST') {
    respond(['ok' => false, 'error' => 'Usá POST con JSON.'], 405);
}

session_name('java_werkstatt_session');
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}
rateLimit();

$raw = file_get_contents(PHP_SAPI === 'cli' ? 'php://stdin' : 'php://input') ?: '';
$request = json_decode($raw, true);
if (!is_array($request)) {
    respond(['ok' => false, 'error' => 'El cuerpo debe ser JSON válido.'], 400);
}

$source = $request['source'] ?? null;
$fileName = $request['fileName'] ?? 'Werkstatt.java';
$mode = $request['mode'] ?? 'source';
$shouldRun = !empty($request['run']);
$stdin = is_string($request['stdin'] ?? null) ? mb_substr($request['stdin'], 0, 4000) : '';

if (!is_string($source) || trim($source) === '') {
    respond(['ok' => false, 'error' => 'El código no puede estar vacío.'], 422);
}
if (strlen($source) > MAX_SOURCE_BYTES) {
    respond(['ok' => false, 'error' => 'El código supera el límite educativo de 48 KB.'], 413);
}
if (!is_string($fileName) || !preg_match('/^[A-Za-z_][A-Za-z0-9_]*\.java$/', $fileName)) {
    respond(['ok' => false, 'error' => 'Nombre de archivo Java no válido.'], 422);
}
if (!in_array($mode, ['source', 'snippet', 'member'], true)) {
    respond(['ok' => false, 'error' => 'Modo de compilación no válido.'], 422);
}

$configPath = dirname(__DIR__) . '/config/config.php';
$config = is_file($configPath) ? require $configPath : [];
$javac = getenv('JAVAC_BIN') ?: ($config['compiler']['javac'] ?? 'javac');
$java = getenv('JAVA_BIN') ?: ($config['compiler']['java'] ?? 'java');
$sandboxMode = (string) (getenv('JAVA_SANDBOX_MODE') ?: ($config['compiler']['sandbox'] ?? 'jvm'));
$dockerImage = (string) (getenv('JAVA_SANDBOX_IMAGE') ?: ($config['compiler']['docker_image'] ?? 'eclipse-temurin:21-jre'));
$workerQueue = (string) (getenv('JAVA_SANDBOX_QUEUE') ?: ($config['compiler']['worker_queue'] ?? '/var/lib/java-werkstatt/queue'));

if ($sandboxMode !== 'worker' && !isJavacAvailable($javac)) {
    respond([
        'ok' => false,
        'phase' => 'compile',
        'error' => 'javac no está instalado o no está en PATH. En XAMPP instalá un JDK dentro del contenedor PHP.',
        'diagnostics' => [],
        'rawOutput' => 'No se pudo encontrar javac.',
        'compiler' => basename($javac),
        'mode' => $mode,
    ], 503);
}
if ($shouldRun && !isJavaAvailable($java) && !in_array($sandboxMode, ['docker', 'worker'], true)) {
    respond(['ok' => false, 'phase' => 'run', 'error' => 'java no está instalado o no está en PATH.', 'diagnostics' => []], 503);
}

$mainClass = pathinfo($fileName, PATHINFO_FILENAME);
$compiledSource = $source;
if ($mode === 'snippet') {
    $compiledSource = "import java.util.*;\npublic class WerkstattSnippet {\n    public static void main(String[] args) throws Exception {\n" . indent($source, 8) . "\n    }\n}\n";
    $fileName = 'WerkstattSnippet.java';
    $mainClass = 'WerkstattSnippet';
} elseif ($mode === 'member') {
    $compiledSource = "import java.util.*;\npublic class WerkstattMember {\n" . indent($source, 4) . "\n}\n";
    $fileName = 'WerkstattMember.java';
    $mainClass = 'WerkstattMember';
}

if ($sandboxMode === 'worker') {
    $worker = compileInWorkerSandbox(
        $workerQueue,
        $compiledSource,
        $fileName,
        $mainClass,
        $stdin,
        $shouldRun && $mode !== 'member'
    );
    $phase = (string) ($worker['phase'] ?? 'compile');
    $compileOutput = trim(limitOutput((string) ($worker['compileOutput'] ?? '')));
    $timedOut = !empty($worker['timedOut']);
    $exitCode = (int) ($worker['exitCode'] ?? 1);
    respond([
        'ok' => $exitCode === 0 && !$timedOut,
        'phase' => $phase,
        'diagnostics' => $phase === 'compile' ? parseDiagnostics($compileOutput) : [],
        'rawOutput' => $compileOutput,
        'stdout' => limitOutput((string) ($worker['stdout'] ?? '')),
        'stderr' => limitOutput((string) ($worker['stderr'] ?? '')),
        'exitCode' => $exitCode,
        'timedOut' => $timedOut,
        'durationMs' => (int) ($worker['durationMs'] ?? 0),
        'compileDurationMs' => (int) ($worker['compileDurationMs'] ?? 0),
        'runDurationMs' => (int) ($worker['runDurationMs'] ?? 0),
        'compiler' => 'javac(worker)',
        'runtime' => 'java(worker)',
        'sandbox' => (string) ($worker['sandbox'] ?? 'worker-unavailable'),
        'mode' => $mode,
        'runnable' => $mode !== 'member',
    ]);
}

$workDir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'java-werkstatt-' . bin2hex(random_bytes(8));
$classesDir = $workDir . DIRECTORY_SEPARATOR . 'classes';
if (!mkdir($classesDir, 0700, true)) {
    respond(['ok' => false, 'error' => 'No se pudo crear el espacio temporal.'], 500);
}

$sourcePath = $workDir . DIRECTORY_SEPARATOR . $fileName;
file_put_contents($sourcePath, $compiledSource, LOCK_EX);

$compileCommand = [$javac, '-J-Duser.language=en', '-J-Duser.country=US', '-encoding', 'UTF-8', '-proc:none', '-Xlint:all', '-d', $classesDir, $sourcePath];
$compile = runProcess($compileCommand, $workDir, COMPILE_TIMEOUT_SECONDS);
$compileDurationMs = (int) round($compile['duration'] * 1000);
$compileOutput = trim(limitOutput($compile['stdout'] . "\n" . $compile['stderr']));

if ($compile['timedOut']) {
    removeDirectory($workDir);
    respond(['ok' => false, 'phase' => 'compile', 'error' => 'La compilación superó el límite de 8 segundos.', 'diagnostics' => [], 'rawOutput' => '', 'durationMs' => $compileDurationMs, 'mode' => $mode], 408);
}

if ($compile['exitCode'] !== 0 || !$shouldRun || $mode === 'member') {
    removeDirectory($workDir);
    respond([
        'ok' => $compile['exitCode'] === 0,
        'phase' => 'compile',
        'diagnostics' => parseDiagnostics($compileOutput),
        'rawOutput' => $compileOutput,
        'durationMs' => $compileDurationMs,
        'compiler' => basename($javac),
        'mode' => $mode,
        'runnable' => $mode !== 'member',
    ]);
}

$run = match ($sandboxMode) {
    'docker' => isDockerAvailable()
        ? runInDockerSandbox($dockerImage, $classesDir, $mainClass, $stdin)
        : runInJvmSandbox($java, $classesDir, $mainClass, $stdin),
    default => runInJvmSandbox($java, $classesDir, $mainClass, $stdin),
};
$runDurationMs = (int) round($run['duration'] * 1000);
removeDirectory($workDir);

respond([
    'ok' => $run['exitCode'] === 0 && !$run['timedOut'],
    'phase' => 'run',
    'diagnostics' => [],
    'rawOutput' => $compileOutput,
    'stdout' => limitOutput($run['stdout']),
    'stderr' => limitOutput($run['stderr']),
    'exitCode' => $run['exitCode'],
    'timedOut' => $run['timedOut'],
    'durationMs' => $compileDurationMs + $runDurationMs,
    'compileDurationMs' => $compileDurationMs,
    'runDurationMs' => $runDurationMs,
    'compiler' => basename($javac),
    'runtime' => basename($java),
    'sandbox' => $run['sandbox'],
    'mode' => $mode,
]);

function indent(string $source, int $spaces): string
{
    $prefix = str_repeat(' ', $spaces);
    return implode("\n", array_map(static fn(string $line): string => $prefix . $line, explode("\n", $source)));
}

function runInJvmSandbox(string $java, string $classesDir, string $mainClass, string $stdin): array
{
    $command = [$java, '-Duser.language=en', '-Duser.country=US', '-Dfile.encoding=UTF-8', '-Djava.awt.headless=true', '-Xms16m', '-Xmx64m', '-XX:ActiveProcessorCount=1', '-cp', $classesDir, $mainClass];
    $result = runProcess($command, $classesDir, RUN_TIMEOUT_SECONDS, $stdin);
    $result['sandbox'] = 'jvm-limited';
    return $result;
}

function runInDockerSandbox(string $image, string $classesDir, string $mainClass, string $stdin): array
{
    $command = [
        'docker', 'run', '--rm', '--network', 'none', '--cpus', '0.5', '--memory', '96m', '--pids-limit', '80', '--read-only',
        '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges', '-v', $classesDir . ':/work:ro', '-w', '/work',
        $image, 'java', '-Duser.language=en', '-Duser.country=US', '-Dfile.encoding=UTF-8', '-Xmx64m', '-cp', '/work', $mainClass,
    ];
    $result = runProcess($command, sys_get_temp_dir(), RUN_TIMEOUT_SECONDS + 2.0, $stdin);
    $result['sandbox'] = 'docker-no-network';
    return $result;
}

function compileInWorkerSandbox(
    string $queueRoot,
    string $source,
    string $fileName,
    string $mainClass,
    string $stdin,
    bool $shouldRun
): array
{
    $started = microtime(true);
    $jobId = bin2hex(random_bytes(16));
    $inputDir = rtrim($queueRoot, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'in';
    $outputDir = rtrim($queueRoot, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'out';
    if (!is_dir($inputDir) && !@mkdir($inputDir, 0700, true) && !is_dir($inputDir)) {
        return workerFailure('No se pudo preparar la cola del sandbox worker.', $started);
    }
    if (!is_dir($outputDir) && !@mkdir($outputDir, 0700, true) && !is_dir($outputDir)) {
        return workerFailure('No se pudo preparar la salida del sandbox worker.', $started);
    }
    $jobDir = $inputDir . DIRECTORY_SEPARATOR . $jobId;
    if (!@mkdir($jobDir, 0700, true)) {
        return workerFailure('No se pudo crear el trabajo del sandbox worker.', $started);
    }
    file_put_contents($jobDir . DIRECTORY_SEPARATOR . $fileName, $source, LOCK_EX);
    file_put_contents($jobDir . DIRECTORY_SEPARATOR . 'file-name.txt', $fileName, LOCK_EX);
    file_put_contents($jobDir . DIRECTORY_SEPARATOR . 'main-class.txt', $mainClass, LOCK_EX);
    file_put_contents($jobDir . DIRECTORY_SEPARATOR . 'stdin.bin', $stdin, LOCK_EX);
    file_put_contents($jobDir . DIRECTORY_SEPARATOR . 'run.txt', $shouldRun ? '1' : '0', LOCK_EX);
    file_put_contents($jobDir . DIRECTORY_SEPARATOR . 'READY', '1', LOCK_EX);

    $deadline = microtime(true) + COMPILE_TIMEOUT_SECONDS + ($shouldRun ? RUN_TIMEOUT_SECONDS : 0) + 3.0;
    $resultPath = $outputDir . DIRECTORY_SEPARATOR . $jobId . '.json';
    while (microtime(true) < $deadline) {
        if (is_file($resultPath)) {
            $result = json_decode((string) file_get_contents($resultPath), true);
            if (is_array($result)) {
                foreach (['compileOutput', 'stderr'] as $field) {
                    if (is_string($result[$field] ?? null)) {
                        $result[$field] = str_replace($jobDir . DIRECTORY_SEPARATOR, '', $result[$field]);
                    }
                }
            }
            removeDirectory($jobDir);
            @unlink($resultPath);
            if (is_array($result)) {
                $result['duration'] = microtime(true) - $started;
                $result['sandbox'] = 'worker-no-network';
                return $result;
            }
            break;
        }
        usleep(WORKER_POLL_INTERVAL_MICROSECONDS);
    }
    removeDirectory($jobDir);
    return [
        'phase' => 'worker',
        'exitCode' => 124,
        'stdout' => '',
        'stderr' => 'El sandbox worker no respondió a tiempo.',
        'compileOutput' => '',
        'timedOut' => true,
        'durationMs' => (int) round((microtime(true) - $started) * 1000),
        'sandbox' => 'worker-no-network',
    ];
}

function workerFailure(string $message, float $started): array
{
    return [
        'phase' => 'worker',
        'exitCode' => 1,
        'stdout' => '',
        'stderr' => $message,
        'compileOutput' => '',
        'timedOut' => false,
        'durationMs' => (int) round((microtime(true) - $started) * 1000),
        'sandbox' => 'worker-unavailable',
    ];
}

function runProcess(array $command, string $cwd, float $timeout, string $stdin = '', array $extraEnvironment = []): array
{
    $pipes = [];
    $environment = array_merge($_ENV, ['LC_ALL' => 'C', 'LANG' => 'C'], $extraEnvironment);
    $process = proc_open($command, [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes, $cwd, $environment);
    if (!is_resource($process)) {
        return ['exitCode' => 1, 'stdout' => '', 'stderr' => 'No se pudo iniciar el proceso.', 'timedOut' => false, 'duration' => 0];
    }
    fwrite($pipes[0], $stdin);
    fclose($pipes[0]);
    stream_set_blocking($pipes[1], false);
    stream_set_blocking($pipes[2], false);
    $started = microtime(true);
    $stdout = '';
    $stderr = '';
    $timedOut = false;
    do {
        $stdout .= stream_get_contents($pipes[1]) ?: '';
        $stderr .= stream_get_contents($pipes[2]) ?: '';
        $status = proc_get_status($process);
        if (!$status['running']) break;
        if (microtime(true) - $started > $timeout) {
            $timedOut = true;
            proc_terminate($process);
            usleep(100_000);
            $status = proc_get_status($process);
            if ($status['running']) proc_terminate($process, 9);
            break;
        }
        usleep(20_000);
    } while (strlen($stdout) + strlen($stderr) < MAX_OUTPUT_BYTES * 2);
    $stdout .= stream_get_contents($pipes[1]) ?: '';
    $stderr .= stream_get_contents($pipes[2]) ?: '';
    fclose($pipes[1]);
    fclose($pipes[2]);
    $exitCode = proc_close($process);
    return ['exitCode' => $exitCode, 'stdout' => $stdout, 'stderr' => $stderr, 'timedOut' => $timedOut, 'duration' => microtime(true) - $started];
}

function isJavacAvailable(string $javac): bool
{
    $check = runProcess([$javac, '-version'], sys_get_temp_dir(), 2.0);
    return $check['exitCode'] === 0 && !$check['timedOut'];
}

function isJavaAvailable(string $java): bool
{
    $check = runProcess([$java, '-version'], sys_get_temp_dir(), 2.0);
    return $check['exitCode'] === 0 && !$check['timedOut'];
}

function isDockerAvailable(): bool
{
    $check = runProcess(['docker', 'version', '--format', '{{.Server.Version}}'], sys_get_temp_dir(), 2.0);
    return $check['exitCode'] === 0 && trim($check['stdout']) !== '';
}

function rateLimit(): void
{
    $now = time();
    $bucket = $_SESSION['compile_bucket'] ?? ['minute' => $now, 'count' => 0];
    if (!is_array($bucket) || $now - (int) ($bucket['minute'] ?? 0) >= 60) {
        $bucket = ['minute' => $now, 'count' => 0];
    }
    $bucket['count'] = (int) ($bucket['count'] ?? 0) + 1;
    $_SESSION['compile_bucket'] = $bucket;
    if ($bucket['count'] > MAX_COMPILES_PER_MINUTE) {
        respond(['ok' => false, 'error' => 'Demasiadas compilaciones. Esperá un minuto y volvé a probar.'], 429);
    }
}

function parseDiagnostics(string $output): array
{
    $diagnostics = [];
    foreach (preg_split('/\R/', $output) ?: [] as $line) {
        if (preg_match('/^(.*?\.java):(\d+):\s*(error|warning):\s*(.*)$/i', $line, $matches)) {
            $diagnostics[] = ['file' => basename($matches[1]), 'line' => (int) $matches[2], 'severity' => strtolower($matches[3]), 'message' => trim($matches[4])];
        }
    }
    return $diagnostics;
}

function limitOutput(string $output): string
{
    return strlen($output) <= MAX_OUTPUT_BYTES ? $output : substr($output, 0, MAX_OUTPUT_BYTES) . "\n… salida recortada …";
}

function removeDirectory(string $directory): void
{
    if (!is_dir($directory)) return;
    foreach (scandir($directory) ?: [] as $entry) {
        if ($entry === '.' || $entry === '..') continue;
        $path = $directory . DIRECTORY_SEPARATOR . $entry;
        is_dir($path) ? removeDirectory($path) : @unlink($path);
    }
    @rmdir($directory);
}
