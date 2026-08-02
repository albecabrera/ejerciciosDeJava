<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = requireUser();
$pdo = requireDatabase();
$action = $_GET['action'] ?? 'list';

function uniqueJoinCode(PDO $pdo): string
{
    $check = $pdo->prepare('SELECT 1 FROM classes WHERE join_code = ? LIMIT 1');
    for ($attempt = 0; $attempt < 10; $attempt += 1) {
        $code = strtoupper(substr(bin2hex(random_bytes(5)), 0, 8));
        $check->execute([$code]);
        if (!$check->fetchColumn()) return $code;
    }
    apiResponse(['ok' => false, 'error' => 'No se pudo generar un código de clase único.'], 503);
}

if ($action === 'list' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $statement = $pdo->prepare("SELECT c.id, c.name, c.join_code, c.teacher_id, c.archived_at, COALESCE(u.name, 'Sin docente') AS teacher_name FROM classes c LEFT JOIN users u ON u.id = c.teacher_id LEFT JOIN class_members cm ON cm.class_id = c.id AND cm.user_id = ? WHERE c.teacher_id = ? OR cm.user_id IS NOT NULL ORDER BY c.archived_at IS NULL DESC, c.created_at DESC");
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
                COUNT(DISTINCT CASE WHEN s.id IS NOT NULL THEN assigned.id END) AS touched,
                COUNT(DISTINCT CASE
                    WHEN r.id IS NOT NULL AND r.functionality_score >= 3 AND r.concept_score >= 3 THEN assigned.id
                    ELSE NULL
                END) AS solved,
                COUNT(s.id) AS attempts,
                COALESCE(SUM(CASE
                    WHEN r.id IS NOT NULL AND r.functionality_score >= 3 AND r.concept_score >= 3 THEN 1
                    ELSE 0
                END), 0) AS correct_attempts,
                0 AS hints_used,
                COUNT(s.id) AS history_count,
                COALESCE(SUM(CASE
                    WHEN r.id IS NOT NULL AND (r.functionality_score < 3 OR r.concept_score < 3) THEN 1
                    ELSE 0
                END), 0) AS failed_attempts,
                (
                    SELECT weakest_assignment.mission_id
                      FROM assignments weakest_assignment
                      JOIN submissions weakest_submission
                        ON weakest_submission.assignment_id = weakest_assignment.id
                       AND weakest_submission.student_id = u.id
                      JOIN submission_reviews weakest_review
                        ON weakest_review.submission_id = weakest_submission.id
                     WHERE weakest_assignment.class_id = cm.class_id
                  GROUP BY weakest_assignment.mission_id
                  ORDER BY AVG(
                        weakest_review.functionality_score
                      + weakest_review.readability_score
                      + weakest_review.concept_score
                      + weakest_review.explanation_score
                  ) ASC, MAX(weakest_review.updated_at) DESC
                     LIMIT 1
                ) AS weakest_mission,
                MAX(CASE
                    WHEN r.updated_at IS NOT NULL AND r.updated_at > s.submitted_at THEN r.updated_at
                    ELSE s.submitted_at
                END) AS last_activity
           FROM class_members cm
           JOIN users u ON u.id = cm.user_id
      LEFT JOIN assignments assigned ON assigned.class_id = cm.class_id
      LEFT JOIN submissions s ON s.assignment_id = assigned.id AND s.student_id = u.id
      LEFT JOIN submission_reviews r ON r.submission_id = s.id
          WHERE cm.class_id = ?
       GROUP BY cm.class_id, u.id, u.name, u.email
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
    $code = uniqueJoinCode($pdo);
    $statement = $pdo->prepare('INSERT INTO classes (name, join_code, teacher_id) VALUES (?, ?, ?)');
    $statement->execute([$name, $code, (int) $user['id']]);
    apiResponse(['ok' => true, 'class' => ['id' => (int) $pdo->lastInsertId(), 'name' => $name, 'join_code' => $code]]);
}

if ($action === 'join') {
    $code = strtoupper(trim((string) ($body['joinCode'] ?? '')));
    $statement = $pdo->prepare('SELECT id FROM classes WHERE join_code = ? AND archived_at IS NULL LIMIT 1');
    $statement->execute([$code]);
    $class = $statement->fetch();
    if (!$class) apiResponse(['ok' => false, 'error' => 'Código de clase no encontrado.'], 404);
    $statement = $pdo->prepare('INSERT IGNORE INTO class_members (class_id, user_id) VALUES (?, ?)');
    $statement->execute([(int) $class['id'], (int) $user['id']]);
    apiResponse(['ok' => true]);
}

if ($action === 'archive') {
    $classId = max(0, (int) ($body['classId'] ?? 0));
    $class = requireClassAccessForUser($pdo, $user, $classId, true);
    $archived = !array_key_exists('archived', $body) || !empty($body['archived']);
    $statement = $pdo->prepare('UPDATE classes SET archived_at = ? WHERE id = ?');
    $statement->execute([$archived ? date('Y-m-d H:i:s') : null, $classId]);
    apiResponse(['ok' => true, 'classId' => $classId, 'archived' => $archived, 'name' => $class['name']]);
}

if ($action === 'regenerate-code') {
    $classId = max(0, (int) ($body['classId'] ?? 0));
    $class = requireClassAccessForUser($pdo, $user, $classId, true);
    if ($class['archived_at'] !== null) apiResponse(['ok' => false, 'error' => 'No se puede regenerar el código de una clase archivada.'], 409);
    $code = uniqueJoinCode($pdo);
    $statement = $pdo->prepare('UPDATE classes SET join_code = ? WHERE id = ?');
    $statement->execute([$code, $classId]);
    apiResponse(['ok' => true, 'classId' => $classId, 'join_code' => $code]);
}

if ($action === 'remove-member') {
    $classId = max(0, (int) ($body['classId'] ?? 0));
    $memberId = max(0, (int) ($body['memberId'] ?? 0));
    requireClassAccessForUser($pdo, $user, $classId, true);
    if ($memberId < 1) apiResponse(['ok' => false, 'error' => 'Miembro inválido.'], 422);
    $statement = $pdo->prepare('DELETE FROM class_members WHERE class_id = ? AND user_id = ?');
    $statement->execute([$classId, $memberId]);
    if ($statement->rowCount() === 0) apiResponse(['ok' => false, 'error' => 'El miembro no pertenece a la clase.'], 404);
    apiResponse(['ok' => true, 'classId' => $classId, 'memberId' => $memberId]);
}

apiResponse(['ok' => false, 'error' => 'Acción de clase desconocida.'], 404);
