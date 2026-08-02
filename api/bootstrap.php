<?php
declare(strict_types=1);

$configPath = dirname(__DIR__) . '/config/config.php';
$config = is_file($configPath) ? require $configPath : require dirname(__DIR__) . '/config/config.example.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$secure = (bool) ($config['session_secure'] ?? (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'));
session_name('java_werkstatt_session');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $secure,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

function apiResponse(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function requestJson(): array
{
    $stream = PHP_SAPI === 'cli' ? 'php://stdin' : 'php://input';
    $data = json_decode(file_get_contents($stream) ?: '', true);
    return is_array($data) ? $data : [];
}

function database(): ?PDO
{
    static $pdo;
    global $config;
    if ($pdo instanceof PDO) return $pdo;
    try {
        $pdo = new PDO($config['db']['dsn'], $config['db']['user'], $config['db']['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (Throwable) {
        return null;
    }
}

function requireDatabase(): PDO
{
    $pdo = database();
    if (!$pdo) apiResponse(['ok' => false, 'configured' => false, 'error' => 'Base de datos no configurada.'], 503);
    return $pdo;
}

function currentUser(): ?array
{
    return $_SESSION['user'] ?? null;
}

function requireUser(): array
{
    $user = currentUser();
    if (!$user) apiResponse(['ok' => false, 'error' => 'Sesión requerida.'], 401);
    return $user;
}

function csrfToken(): string
{
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}

function requireCsrf(): void
{
    $provided = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!$provided || !hash_equals((string) ($_SESSION['csrf'] ?? ''), $provided)) {
        apiResponse(['ok' => false, 'error' => 'Token CSRF inválido.'], 419);
    }
}

function requireMethod(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== $method) apiResponse(['ok' => false, 'error' => 'Método no permitido.'], 405);
}

function publicUser(array $user): array
{
    return ['id' => (int) $user['id'], 'name' => $user['name'], 'email' => $user['email'], 'role' => $user['role']];
}

function currentMissionIds(): array
{
    return [
        'types', 'condition', 'loop', 'method', 'arrays', 'class', 'list',
        'debug', 'strings', 'while-input', 'uml-model', 'tests-thinking',
        'inheritance', 'polymorphism', 'stack', 'queue', 'linked-list',
        'recursion', 'linear-search', 'binary-search', 'insertion-sort',
        'efficiency', 'bst', 'graph-bfs', 'dfa', 'grammar', 'parser', 'sql',
        'normalization', 'network', 'caesar', 'privacy', 'von-neumann',
        'concurrency-limits', 'halting-limit', 'hash-map',
        'project-mensa-terminal', 'project-school-library', 'project-safe-chat',
        'guessing-game', 'score-level', 'dice-duel', 'snake-step',
        'exception-parse', 'stream-filter', 'combo-counter', 'leaderboard-sort',
        'project-habit-tracker', 'project-snake-arena',
        'python-01-output', 'python-02-variables', 'python-03-input',
        'python-04-condition', 'python-05-while', 'python-06-lists',
        'python-07-for', 'python-08-functions', 'python-09-tests',
        'python-10-project',
    ];
}

function isCurrentMissionId(string $missionId): bool
{
    static $allowed;
    $allowed ??= array_flip(currentMissionIds());
    return isset($allowed[$missionId]);
}

function clientIpAddress(): string
{
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : 'unknown';
}

function enforceRateLimit(string $scope, int $limit, int $windowSeconds): void
{
    global $config;
    $scope = preg_replace('/[^a-z0-9_-]/i', '', $scope) ?: 'request';
    $now = time();
    $sessionKey = 'rate_limit_' . $scope;
    $sessionBucket = $_SESSION[$sessionKey] ?? ['started' => $now, 'count' => 0];
    if (!is_array($sessionBucket) || $now - (int) ($sessionBucket['started'] ?? 0) >= $windowSeconds) {
        $sessionBucket = ['started' => $now, 'count' => 0];
    }
    $sessionBucket['count'] = (int) ($sessionBucket['count'] ?? 0) + 1;
    $_SESSION[$sessionKey] = $sessionBucket;

    $directory = (string) ($config['rate_limit_path'] ?? (sys_get_temp_dir() . '/java-werkstatt-rate-limits'));
    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) {
        apiResponse(['ok' => false, 'error' => 'El control de acceso no está disponible.'], 503);
    }
    $file = rtrim($directory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR
        . hash('sha256', $scope . '|' . clientIpAddress()) . '.json';
    $handle = @fopen($file, 'c+');
    if (!$handle || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) fclose($handle);
        apiResponse(['ok' => false, 'error' => 'El control de acceso no está disponible.'], 503);
    }
    $stored = json_decode(stream_get_contents($handle) ?: '', true);
    if (!is_array($stored) || $now - (int) ($stored['started'] ?? 0) >= $windowSeconds) {
        $stored = ['started' => $now, 'count' => 0];
    }
    $stored['count'] = (int) ($stored['count'] ?? 0) + 1;
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($stored, JSON_UNESCAPED_SLASHES));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    if ($sessionBucket['count'] > $limit || $stored['count'] > $limit) {
        $started = min((int) $sessionBucket['started'], (int) $stored['started']);
        $retryAfter = max(1, $windowSeconds - ($now - $started));
        header('Retry-After: ' . $retryAfter);
        apiResponse(['ok' => false, 'error' => 'Demasiados intentos. Esperá antes de volver a probar.', 'retryAfter' => $retryAfter], 429);
    }
}

function authRateLimit(string $action): void
{
    global $config;
    $defaults = $action === 'register'
        ? ['limit' => 5, 'window_seconds' => 3600]
        : ['limit' => 10, 'window_seconds' => 900];
    $settings = $config['auth_rate_limits'][$action] ?? $defaults;
    enforceRateLimit(
        'auth-' . $action,
        max(1, (int) ($settings['limit'] ?? $defaults['limit'])),
        max(60, (int) ($settings['window_seconds'] ?? $defaults['window_seconds']))
    );
}

function requireClassAccessForUser(PDO $pdo, array $user, int $classId, bool $ownerOnly = false): array
{
    if ($classId < 1) apiResponse(['ok' => false, 'error' => 'Clase inválida.'], 422);
    $userId = (int) $user['id'];
    if ($user['role'] === 'admin') {
        $statement = $pdo->prepare('SELECT id, name, join_code, teacher_id, archived_at FROM classes WHERE id = ? LIMIT 1');
        $statement->execute([$classId]);
    } elseif ($ownerOnly || $user['role'] === 'teacher') {
        $statement = $pdo->prepare('SELECT id, name, join_code, teacher_id, archived_at FROM classes WHERE id = ? AND teacher_id = ? LIMIT 1');
        $statement->execute([$classId, $userId]);
    } else {
        $statement = $pdo->prepare(
            'SELECT c.id, c.name, c.join_code, c.teacher_id, c.archived_at
               FROM classes c
               JOIN class_members cm ON cm.class_id = c.id
              WHERE c.id = ? AND cm.user_id = ?
              LIMIT 1'
        );
        $statement->execute([$classId, $userId]);
    }
    $class = $statement->fetch();
    if (!$class) apiResponse(['ok' => false, 'error' => 'Clase no encontrada o sin permisos.'], 404);
    return $class;
}

function createNotification(
    PDO $pdo,
    int $userId,
    string $type,
    string $title,
    string $message = '',
    ?string $entityType = null,
    ?int $entityId = null
): void {
    $statement = $pdo->prepare(
        'INSERT INTO notifications (user_id, type, title, message, entity_type, entity_id) VALUES (?, ?, ?, ?, ?, ?)'
    );
    $statement->execute([
        $userId,
        mb_substr($type, 0, 40),
        mb_substr($title, 0, 180),
        mb_substr($message, 0, 600),
        $entityType === null ? null : mb_substr($entityType, 0, 40),
        $entityId,
    ]);
}
