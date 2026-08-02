<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = requireUser();
$pdo = requireDatabase();
$action = (string) ($_GET['action'] ?? 'list');
$classId = max(0, (int) ($_GET['classId'] ?? 0));

function validMissionId(mixed $value): string
{
    $missionId = trim((string) $value);
    if (!preg_match('/^[a-z0-9-]{1,80}$/', $missionId)) {
        apiResponse(['ok' => false, 'error' => 'Misión inválida.'], 422);
    }
    return $missionId;
}

function requireClassAccess(PDO $pdo, array $user, int $classId): array
{
    if ($classId < 1) apiResponse(['ok' => false, 'error' => 'Clase inválida.'], 422);
    if ($user['role'] === 'admin') {
        $statement = $pdo->prepare('SELECT id, teacher_id FROM classes WHERE id = ? LIMIT 1');
        $statement->execute([$classId]);
    } elseif ($user['role'] === 'teacher') {
        $statement = $pdo->prepare('SELECT id, teacher_id FROM classes WHERE id = ? AND teacher_id = ? LIMIT 1');
        $statement->execute([$classId, (int) $user['id']]);
    } else {
        $statement = $pdo->prepare(
            'SELECT c.id, c.teacher_id
               FROM classes c
               JOIN class_members cm ON cm.class_id = c.id
              WHERE c.id = ? AND cm.user_id = ?
              LIMIT 1'
        );
        $statement->execute([$classId, (int) $user['id']]);
    }
    $class = $statement->fetch();
    if (!$class) apiResponse(['ok' => false, 'error' => 'Clase no encontrada o sin permisos.'], 404);
    return $class;
}

function feedbackRow(PDO $pdo, int $id): ?array
{
    $statement = $pdo->prepare(
        'SELECT f.id, f.class_id, f.mission_id, f.parent_id, f.message, f.status,
                f.created_at, f.updated_at, u.id AS author_id, u.name AS author, u.role
           FROM mission_feedback f
           JOIN users u ON u.id = f.author_id
          WHERE f.id = ?
          LIMIT 1'
    );
    $statement->execute([$id]);
    return $statement->fetch() ?: null;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'list') {
    requireClassAccess($pdo, $user, $classId);
    $missionId = validMissionId($_GET['missionId'] ?? '');
    $educator = in_array($user['role'], ['teacher', 'admin'], true);
    $privacyFilter = $educator
        ? ''
        : ' AND (
                (f.parent_id IS NULL AND f.author_id = ?)
                OR (f.parent_id IS NOT NULL AND u.role IN (\'teacher\', \'admin\') AND EXISTS (
                    SELECT 1
                      FROM mission_feedback root
                     WHERE root.id = f.parent_id
                       AND root.parent_id IS NULL
                       AND root.author_id = ?
                       AND root.class_id = f.class_id
                       AND root.mission_id = f.mission_id
                ))
            )';
    $statement = $pdo->prepare(
        'SELECT f.id, f.parent_id, f.message, f.status, f.created_at, f.updated_at,
                u.id AS author_id, u.name AS author, u.role
           FROM mission_feedback f
           JOIN users u ON u.id = f.author_id
          WHERE f.class_id = ? AND f.mission_id = ?' . $privacyFilter . '
          ORDER BY f.created_at ASC, f.id ASC
          LIMIT 200'
    );
    $params = [$classId, $missionId];
    if (!$educator) array_push($params, (int) $user['id'], (int) $user['id']);
    $statement->execute($params);
    apiResponse(['ok' => true, 'feedback' => $statement->fetchAll()]);
}

requireMethod('POST');
requireCsrf();
$body = requestJson();
$classId = max(0, (int) ($body['classId'] ?? $classId));
requireClassAccess($pdo, $user, $classId);

if ($action === 'create') {
    $missionId = validMissionId($body['missionId'] ?? '');
    $message = trim((string) ($body['message'] ?? ''));
    if ($message === '' || mb_strlen($message) > 1200) {
        apiResponse(['ok' => false, 'error' => 'Comentario inválido.'], 422);
    }
    $parentId = max(0, (int) ($body['parentId'] ?? 0));
    $elevated = $user['role'] === 'teacher' || $user['role'] === 'admin';
    if ($parentId > 0 && !$elevated) {
        apiResponse(['ok' => false, 'error' => 'Solo docentes pueden responder.'], 403);
    }
    if ($parentId === 0 && $elevated) {
        apiResponse(['ok' => false, 'error' => 'Docentes y administración responden a comentarios existentes.'], 422);
    }
    if ($parentId > 0) {
        $parent = feedbackRow($pdo, $parentId);
        if (!$parent
            || (int) $parent['class_id'] !== $classId
            || $parent['mission_id'] !== $missionId
            || $parent['parent_id'] !== null) {
            apiResponse(['ok' => false, 'error' => 'Comentario padre inválido.'], 422);
        }
    }
    $statement = $pdo->prepare(
        'INSERT INTO mission_feedback (class_id, mission_id, author_id, parent_id, message)
         VALUES (?, ?, ?, ?, ?)'
    );
    $statement->execute([
        $classId,
        $missionId,
        (int) $user['id'],
        $parentId > 0 ? $parentId : null,
        $message,
    ]);
    apiResponse(['ok' => true, 'feedback' => feedbackRow($pdo, (int) $pdo->lastInsertId())], 201);
}

if ($action === 'status') {
    $feedbackId = max(0, (int) ($body['feedbackId'] ?? 0));
    $status = ($body['status'] ?? '') === 'resolved' ? 'resolved' : (($body['status'] ?? '') === 'open' ? 'open' : '');
    if ($feedbackId < 1 || $status === '') apiResponse(['ok' => false, 'error' => 'Estado inválido.'], 422);
    $feedback = feedbackRow($pdo, $feedbackId);
    if (!$feedback || (int) $feedback['class_id'] !== $classId) {
        apiResponse(['ok' => false, 'error' => 'Comentario no encontrado.'], 404);
    }
    $elevated = $user['role'] === 'teacher' || $user['role'] === 'admin';
    if (!$elevated && (int) $feedback['author_id'] !== (int) $user['id']) {
        apiResponse(['ok' => false, 'error' => 'Sin permisos para cambiar el estado.'], 403);
    }
    $statement = $pdo->prepare('UPDATE mission_feedback SET status = ? WHERE id = ?');
    $statement->execute([$status, $feedbackId]);
    apiResponse(['ok' => true, 'feedback' => feedbackRow($pdo, $feedbackId)]);
}

apiResponse(['ok' => false, 'error' => 'Acción de feedback desconocida.'], 404);
