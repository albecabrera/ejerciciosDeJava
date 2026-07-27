<?php
declare(strict_types=1);

// Educational compiler endpoint. Run this app only behind a local/trusted PHP server.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

const MAX_SOURCE_BYTES = 48_000;
const PROCESS_TIMEOUT_SECONDS = 8.0;
const MAX_COMPILES_PER_MINUTE = 20;

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
if (!isJavacAvailable($javac)) {
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
$workDir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'java-werkstatt-' . bin2hex(random_bytes(8));
$classesDir = $workDir . DIRECTORY_SEPARATOR . 'classes';
if (!mkdir($classesDir, 0700, true)) {
    respond(['ok' => false, 'error' => 'No se pudo crear el espacio temporal.'], 500);
}

$className = pathinfo($fileName, PATHINFO_FILENAME);
$compiledSource = $source;
if ($mode === 'snippet') {
    $compiledSource = "import java.util.*;\npublic class WerkstattSnippet {\n    public static void main(String[] args) {\n" . indent($source, 8) . "\n    }\n}\n";
    $fileName = 'WerkstattSnippet.java';
} elseif ($mode === 'member') {
    $compiledSource = "import java.util.*;\npublic class WerkstattMember {\n" . indent($source, 4) . "\n}\n";
    $fileName = 'WerkstattMember.java';
}

$sourcePath = $workDir . DIRECTORY_SEPARATOR . $fileName;
file_put_contents($sourcePath, $compiledSource, LOCK_EX);

$command = [$javac, '-J-Duser.language=en', '-J-Duser.country=US', '-encoding', 'UTF-8', '-proc:none', '-Xlint:all', '-d', $classesDir, $sourcePath];
$result = runProcess($command, $workDir, PROCESS_TIMEOUT_SECONDS);
$durationMs = (int) round($result['duration'] * 1000);

removeDirectory($workDir);

if ($result['timedOut']) {
    respond([
        'ok' => false,
        'phase' => 'compile',
        'error' => 'La compilación superó el límite de 8 segundos.',
        'diagnostics' => [],
        'rawOutput' => '',
        'durationMs' => $durationMs,
        'mode' => $mode,
    ], 408);
}

$output = trim($result['stdout'] . "\n" . $result['stderr']);
respond([
    'ok' => $result['exitCode'] === 0,
    'phase' => 'compile',
    'diagnostics' => parseDiagnostics($output),
    'rawOutput' => $output,
    'durationMs' => $durationMs,
    'compiler' => basename($javac),
    'mode' => $mode,
]);

function indent(string $source, int $spaces): string
{
    $prefix = str_repeat(' ', $spaces);
    return implode("\n", array_map(static fn(string $line): string => $prefix . $line, explode("\n", $source)));
}

function runProcess(array $command, string $cwd, float $timeout): array
{
    $pipes = [];
    $environment = array_merge($_ENV, ['LC_ALL' => 'C', 'LANG' => 'C']);
    $process = proc_open($command, [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes, $cwd, $environment);
    if (!is_resource($process)) {
        return ['exitCode' => 1, 'stdout' => '', 'stderr' => 'No se pudo iniciar javac.', 'timedOut' => false, 'duration' => 0];
    }
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
            break;
        }
        usleep(20_000);
    } while (true);
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
