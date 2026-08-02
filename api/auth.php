<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$action = $_GET['action'] ?? '';
if ($action === 'me' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!database()) apiResponse(['ok' => true, 'configured' => false, 'user' => null]);
    $user = currentUser();
    apiResponse(['ok' => true, 'configured' => true, 'user' => $user ? publicUser($user) : null, 'csrf' => csrfToken()]);
}

requireMethod('POST');
$body = requestJson();
if (in_array($action, ['login', 'register'], true)) authRateLimit($action);
$pdo = requireDatabase();

if ($action === 'register') {
    $name = trim((string) ($body['name'] ?? ''));
    $email = strtolower(trim((string) ($body['email'] ?? '')));
    $password = (string) ($body['password'] ?? '');
    if ($name === '' || mb_strlen($name) > 100 || strlen($email) > 190 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8 || strlen($password) > 4096) {
        apiResponse(['ok' => false, 'error' => 'Nombre, email válido y contraseña de 8 caracteres son obligatorios.'], 422);
    }
    try {
        $statement = $pdo->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, \'student\')');
        $statement->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]);
    } catch (PDOException $error) {
        if ($error->getCode() === '23000') apiResponse(['ok' => false, 'error' => 'Ese email ya está registrado.'], 409);
        throw $error;
    }
    $id = (int) $pdo->lastInsertId();
    session_regenerate_id(true);
    $_SESSION['user'] = ['id' => $id, 'name' => $name, 'email' => $email, 'role' => 'student'];
    apiResponse(['ok' => true, 'configured' => true, 'user' => publicUser($_SESSION['user']), 'csrf' => csrfToken()], 201);
}

if ($action === 'login') {
    $email = strtolower(trim((string) ($body['email'] ?? '')));
    $password = (string) ($body['password'] ?? '');
    if (strlen($email) > 190 || strlen($password) > 4096) {
        apiResponse(['ok' => false, 'error' => 'Email o contraseña incorrectos.'], 401);
    }
    $statement = $pdo->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1');
    $statement->execute([$email]);
    $user = $statement->fetch();
    if (!$user || !password_verify($password, $user['password_hash'])) apiResponse(['ok' => false, 'error' => 'Email o contraseña incorrectos.'], 401);
    session_regenerate_id(true);
    unset($user['password_hash']);
    $_SESSION['user'] = $user;
    apiResponse(['ok' => true, 'configured' => true, 'user' => publicUser($user), 'csrf' => csrfToken()]);
}

if ($action === 'logout') {
    requireCsrf();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], '', (bool) $params['secure'], (bool) $params['httponly']);
    }
    session_destroy();
    apiResponse(['ok' => true]);
}

apiResponse(['ok' => false, 'error' => 'Acción de autenticación desconocida.'], 404);
