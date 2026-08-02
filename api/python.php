<?php
declare(strict_types=1);

// Python runner: Docker-only and fail-closed. Never execute learner code directly in PHP/XAMPP.
require __DIR__ . '/bootstrap.php';

const PYTHON_MAX_SOURCE_BYTES = 48_000;
const PYTHON_MAX_STDIN_BYTES = 4_000;
const PYTHON_MAX_OUTPUT_BYTES = 12_000;
const PYTHON_TIMEOUT_SECONDS = 3.0;

requireMethod('POST');
enforceRateLimit('python-run', 20, 60);
$body = requestJson();
$source = $body['source'] ?? null;
$stdin = $body['stdin'] ?? '';
if (!is_string($source) || trim($source) === '') apiResponse(['ok' => false, 'error' => 'El código Python no puede estar vacío.'], 422);
if (strlen($source) > PYTHON_MAX_SOURCE_BYTES) apiResponse(['ok' => false, 'error' => 'El código supera el límite educativo de 48 KB.'], 413);
if (!is_string($stdin) || strlen($stdin) > PYTHON_MAX_STDIN_BYTES) apiResponse(['ok' => false, 'error' => 'La entrada supera el límite educativo de 4 KB.'], 413);

/** @var array<string, mixed> $config */
global $config;
$pythonConfig = is_array($config['python'] ?? null) ? $config['python'] : [];
$mode = (string) (getenv('PYTHON_SANDBOX_MODE') ?: ($pythonConfig['sandbox'] ?? 'docker'));
$docker = (string) (getenv('DOCKER_BIN') ?: ($pythonConfig['docker_bin'] ?? 'docker'));
$image = (string) (getenv('PYTHON_SANDBOX_IMAGE') ?: ($pythonConfig['docker_image'] ?? 'python:3.12-alpine'));
if ($mode !== 'docker') apiResponse(['ok' => false, 'phase' => 'sandbox', 'sandbox' => 'disabled', 'error' => 'El runner Python requiere el sandbox Docker; no hay fallback local inseguro.'], 503);
if (!pythonDockerAvailable($docker)) apiResponse(['ok' => false, 'phase' => 'sandbox', 'sandbox' => 'docker-unavailable', 'error' => 'El sandbox Python Docker no está disponible.'], 503);

$workDir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'python-studio-' . bin2hex(random_bytes(12));
if (!mkdir($workDir, 0700, true)) apiResponse(['ok' => false, 'error' => 'No se pudo preparar el espacio de ejecución.'], 500);
file_put_contents($workDir . DIRECTORY_SEPARATOR . 'main.py', $source, LOCK_EX);

try {
    $result = pythonRunProcess([
        $docker, 'run', '--rm', '--network', 'none', '--cpus', '0.5', '--memory', '96m', '--pids-limit', '64', '--read-only',
        '--cap-drop', 'ALL', '--security-opt', 'no-new-privileges', '--tmpfs', '/tmp:rw,noexec,nosuid,size=16m',
        '-v', $workDir . ':/work:ro', '-w', '/work', $image, 'python', '-I', '-B', '/work/main.py',
    ], $stdin, PYTHON_TIMEOUT_SECONDS + 2.0);
} finally {
    pythonRemoveDirectory($workDir);
}

apiResponse([
    'ok' => $result['exitCode'] === 0 && !$result['timedOut'],
    'phase' => 'run',
    'stdout' => pythonLimitOutput($result['stdout']),
    'stderr' => pythonLimitOutput($result['stderr']),
    'exitCode' => $result['exitCode'],
    'timedOut' => $result['timedOut'],
    'durationMs' => (int) round($result['duration'] * 1000),
    'runtime' => 'python(docker)',
    'sandbox' => 'docker-no-network',
]);

function pythonDockerAvailable(string $docker): bool
{
    $result = pythonRunProcess([$docker, 'version', '--format', '{{.Server.Version}}'], '', 2.0);
    return $result['exitCode'] === 0 && !$result['timedOut'];
}

function pythonRunProcess(array $command, string $stdin, float $timeout): array
{
    $descriptors = [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']];
    $process = proc_open($command, $descriptors, $pipes, null, ['PATH' => getenv('PATH') ?: '']);
    if (!is_resource($process)) return ['exitCode' => 1, 'stdout' => '', 'stderr' => 'No se pudo iniciar el sandbox.', 'timedOut' => false, 'duration' => 0.0];
    $started = microtime(true);
    fwrite($pipes[0], $stdin);
    fclose($pipes[0]);
    stream_set_blocking($pipes[1], false);
    stream_set_blocking($pipes[2], false);
    $stdout = '';
    $stderr = '';
    $timedOut = false;
    while (true) {
        $stdout .= stream_get_contents($pipes[1]) ?: '';
        $stderr .= stream_get_contents($pipes[2]) ?: '';
        $status = proc_get_status($process);
        if (!$status['running']) break;
        if (microtime(true) - $started > $timeout) {
            $timedOut = true;
            proc_terminate($process, 9);
            break;
        }
        usleep(20_000);
    }
    $stdout .= stream_get_contents($pipes[1]) ?: '';
    $stderr .= stream_get_contents($pipes[2]) ?: '';
    fclose($pipes[1]); fclose($pipes[2]);
    $exitCode = proc_close($process);
    return ['exitCode' => $timedOut ? 124 : $exitCode, 'stdout' => $stdout, 'stderr' => $stderr, 'timedOut' => $timedOut, 'duration' => microtime(true) - $started];
}

function pythonLimitOutput(string $value): string
{
    return strlen($value) <= PYTHON_MAX_OUTPUT_BYTES ? $value : substr($value, 0, PYTHON_MAX_OUTPUT_BYTES) . "\n… salida truncada";
}

function pythonRemoveDirectory(string $path): void
{
    if (!is_dir($path)) return;
    $items = scandir($path) ?: [];
    foreach ($items as $item) if ($item !== '.' && $item !== '..') @unlink($path . DIRECTORY_SEPARATOR . $item);
    @rmdir($path);
}
