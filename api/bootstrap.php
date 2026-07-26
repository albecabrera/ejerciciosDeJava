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
