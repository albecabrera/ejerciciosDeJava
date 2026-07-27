<?php
declare(strict_types=1);

// Queue worker: mount this directory as a shared volume and run the container with --network none.
$queue = getenv('JAVA_WORKER_QUEUE') ?: '/var/lib/java-werkstatt/queue';
$java = getenv('JAVA_BIN') ?: 'java';
$poll = 20000;

foreach (['in', 'out'] as $directory) {
    $path = $queue . DIRECTORY_SEPARATOR . $directory;
    if (!is_dir($path)) mkdir($path, 0700, true);
}

while (true) {
    $jobs = glob($queue . '/in/*/READY') ?: [];
    foreach ($jobs as $ready) processJob(dirname($ready), $queue . '/out', $java);
    usleep($poll);
}

function processJob(string $jobDir, string $outputDir, string $java): void
{
    $claim = $jobDir . '/RUNNING';
    if (!@rename($jobDir . '/READY', $claim)) return;
    $job = json_decode((string) @file_get_contents($jobDir . '/job.json'), true);
    $jobId = basename($jobDir);
    if (!is_array($job) || !preg_match('/^[A-Za-z_$][A-Za-z0-9_$]*$/', (string) ($job['mainClass'] ?? ''))) {
        writeResult($outputDir, $jobId, ['exitCode' => 2, 'stdout' => '', 'stderr' => 'Trabajo inválido.', 'timedOut' => false]);
        removeDirectory($jobDir);
        return;
    }
    $command = [$java, '-Duser.language=en', '-Duser.country=US', '-Dfile.encoding=UTF-8', '-Djava.awt.headless=true', '-Xms16m', '-Xmx64m', '-XX:ActiveProcessorCount=1', '-cp', $jobDir . '/classes', $job['mainClass']];
    $result = runProcess($command, $jobDir, (float) (getenv('JAVA_WORKER_TIMEOUT') ?: 3), (string) ($job['stdin'] ?? ''));
    writeResult($outputDir, $jobId, $result);
    removeDirectory($jobDir);
}

function runProcess(array $command, string $cwd, float $timeout, string $stdin): array
{
    $pipes = [];
    $process = proc_open($command, [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes, $cwd, ['LC_ALL' => 'C', 'LANG' => 'C']);
    if (!is_resource($process)) return ['exitCode' => 1, 'stdout' => '', 'stderr' => 'No se pudo iniciar Java.', 'timedOut' => false];
    fwrite($pipes[0], $stdin); fclose($pipes[0]);
    stream_set_blocking($pipes[1], false); stream_set_blocking($pipes[2], false);
    $started = microtime(true); $stdout = ''; $stderr = ''; $timedOut = false;
    do {
        $stdout .= stream_get_contents($pipes[1]) ?: '';
        $stderr .= stream_get_contents($pipes[2]) ?: '';
        $status = proc_get_status($process);
        if (!$status['running']) break;
        if (microtime(true) - $started > $timeout) {
            $timedOut = true; proc_terminate($process); usleep(100000); proc_terminate($process, 9); break;
        }
        usleep(20000);
    } while (strlen($stdout) + strlen($stderr) < 12000);
    $stdout .= stream_get_contents($pipes[1]) ?: ''; $stderr .= stream_get_contents($pipes[2]) ?: '';
    fclose($pipes[1]); fclose($pipes[2]);
    return ['exitCode' => proc_close($process), 'stdout' => substr($stdout, 0, 12000), 'stderr' => substr($stderr, 0, 12000), 'timedOut' => $timedOut];
}

function writeResult(string $outputDir, string $jobId, array $result): void
{
    file_put_contents($outputDir . '/' . $jobId . '.tmp', json_encode($result, JSON_UNESCAPED_UNICODE), LOCK_EX);
    @rename($outputDir . '/' . $jobId . '.tmp', $outputDir . '/' . $jobId . '.json');
}

function removeDirectory(string $directory): void
{
    if (!is_dir($directory)) return;
    foreach (scandir($directory) ?: [] as $entry) {
        if ($entry === '.' || $entry === '..') continue;
        $path = $directory . '/' . $entry;
        is_dir($path) ? removeDirectory($path) : @unlink($path);
    }
    @rmdir($directory);
}
