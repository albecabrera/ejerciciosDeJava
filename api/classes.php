<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = requireUser();
$pdo = requireDatabase();
$action = $_GET['action'] ?? 'list';

if ($action === 'list' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $statement = $pdo->prepare('SELECT c.id, c.name, c.join_code, c.teacher_id, u.name AS teacher_name FROM classes c JOIN users u ON u.id = c.teacher_id LEFT JOIN class_members cm ON cm.class_id = c.id AND cm.user_id = ? WHERE c.teacher_id = ? OR cm.user_id IS NOT NULL ORDER BY c.created_at DESC');
    $statement->execute([(int) $user['id'], (int) $user['id']]);
    apiResponse(['ok' => true, 'classes' => $statement->fetchAll()]);
}

if ($action === 'progress' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($user['role'] !== 'teacher' && $user['role'] !== 'admin') apiResponse(['ok' => false, 'error' => 'Solo docentes pueden ver el progreso de una clase.'], 403);
    $classId = max(0, (int) ($_GET['classId'] ?? 0));
    if ($classId === 0) apiResponse(['ok' => false, 'error' => 'Clase inválida.'], 422);

    $ownershipSql = $user['role'] === 'admin' ? 'c.id = ?' : 'c.id = ? AND c.teacher_id = ?';
    $ownershipParams = $user['role'] === 'admin' ? [$classId] : [$classId, (int) $user['id']];
    $ownerStatement = $pdo->prepare("SELECT c.id, c.name FROM classes c WHERE $ownershipSql LIMIT 1");
    $ownerStatement->execute($ownershipParams);
    $class = $ownerStatement->fetch();
    if (!$class) apiResponse(['ok' => false, 'error' => 'Clase no encontrada o sin permisos.'], 404);

    $statement = $pdo->prepare(
        'SELECT u.id, u.name, u.email,
                COUNT(p.mission_id) AS touched,
                COALESCE(SUM(CASE WHEN p.solved_at IS NOT NULL THEN 1 ELSE 0 END), 0) AS solved,
                COALESCE(SUM(p.attempts), 0) AS attempts,
                COALESCE(SUM(p.correct_attempts), 0) AS correct_attempts,
                COALESCE(SUM(p.hints_used), 0) AS hints_used,
                MAX(p.updated_at) AS last_activity
           FROM class_members cm
           JOIN users u ON u.id = cm.user_id
      LEFT JOIN progress p ON p.user_id = u.id
          WHERE cm.class_id = ?
       GROUP BY u.id, u.name, u.email
       ORDER BY u.name'
    );
    $statement->execute([$classId]);
    apiResponse(['ok' => true, 'class' => $class, 'students' => $statement->fetchAll()]);
}

requireMethod('POST');
requireCsrf();
$body = requestJson();

if ($action === 'create') {
    if ($user['role'] !== 'teacher' && $user['role'] !== 'admin') apiResponse(['ok' => false, 'error' => 'Solo docentes pueden crear clases.'], 403);
    $name = trim((string) ($body['name'] ?? ''));
    if ($name === '' || strlen($name) > 120) apiResponse(['ok' => false, 'error' => 'Nombre de clase inválido.'], 422);
    $code = strtoupper(substr(bin2hex(random_bytes(5)), 0, 8));
    $statement = $pdo->prepare('INSERT INTO classes (name, join_code, teacher_id) VALUES (?, ?, ?)');
    $statement->execute([$name, $code, (int) $user['id']]);
    apiResponse(['ok' => true, 'class' => ['id' => (int) $pdo->lastInsertId(), 'name' => $name, 'join_code' => $code]]);
}

if ($action === 'join') {
    $code = strtoupper(trim((string) ($body['joinCode'] ?? '')));
    $statement = $pdo->prepare('SELECT id FROM classes WHERE join_code = ? LIMIT 1');
    $statement->execute([$code]);
    $class = $statement->fetch();
    if (!$class) apiResponse(['ok' => false, 'error' => 'Código de clase no encontrado.'], 404);
    $statement = $pdo->prepare('INSERT IGNORE INTO class_members (class_id, user_id) VALUES (?, ?)');
    $statement->execute([(int) $class['id'], (int) $user['id']]);
    apiResponse(['ok' => true]);
}

apiResponse(['ok' => false, 'error' => 'Acción de clase desconocida.'], 404);
