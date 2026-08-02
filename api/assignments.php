<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = requireUser();
$pdo = requireDatabase();
$action = (string) ($_GET['action'] ?? 'list');

function assignmentMissionId(mixed $value): string
{
    $missionId = trim((string) $value);
    if (!preg_match('/^[a-z0-9-]{1,80}$/', $missionId) || !isCurrentMissionId($missionId)) {
        apiResponse(['ok' => false, 'error' => 'Misión inválida.'], 422);
    }
    return $missionId;
}

function assignmentDueAt(mixed $value): ?string
{
    $raw = trim((string) $value);
    if ($raw === '') return null;
    if (strlen($raw) > 64) apiResponse(['ok' => false, 'error' => 'Fecha límite inválida.'], 422);
    try {
        $date = new DateTimeImmutable($raw);
    } catch (Throwable) {
        apiResponse(['ok' => false, 'error' => 'Fecha límite inválida.'], 422);
    }
    return $date->format('Y-m-d H:i:s');
}

if ($action === 'list' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $classId = max(0, (int) ($_GET['classId'] ?? 0));
    requireClassAccessForUser($pdo, $user, $classId);
    $includeArchived = ($_GET['includeArchived'] ?? '') === '1';
    $statement = $pdo->prepare(
        'SELECT a.id, a.class_id, a.mission_id, a.title, a.description, a.due_at,
                a.archived_at, a.created_at, a.updated_at, u.name AS creator_name,
                (SELECT COUNT(*) FROM submissions s WHERE s.assignment_id = a.id) AS submission_count,
                (SELECT MAX(s.version_no) FROM submissions s WHERE s.assignment_id = a.id AND s.student_id = ?) AS my_latest_version
           FROM assignments a
      LEFT JOIN users u ON u.id = a.created_by
          WHERE a.class_id = ? AND (? = 1 OR a.archived_at IS NULL)
       ORDER BY a.archived_at IS NULL DESC, a.due_at IS NULL, a.due_at ASC, a.created_at DESC
          LIMIT 200'
    );
    $statement->execute([(int) $user['id'], $classId, $includeArchived ? 1 : 0]);
    apiResponse(['ok' => true, 'assignments' => $statement->fetchAll()]);
}

requireMethod('POST');
requireCsrf();
$body = requestJson();

if ($action === 'create') {
    if (!in_array($user['role'], ['teacher', 'admin'], true)) {
        apiResponse(['ok' => false, 'error' => 'Solo docentes pueden crear tareas.'], 403);
    }
    $classId = max(0, (int) ($body['classId'] ?? 0));
    $class = requireClassAccessForUser($pdo, $user, $classId, true);
    if ($class['archived_at'] !== null) apiResponse(['ok' => false, 'error' => 'La clase está archivada.'], 409);
    $missionId = assignmentMissionId($body['missionId'] ?? '');
    $title = trim((string) ($body['title'] ?? ''));
    $description = trim((string) ($body['description'] ?? ''));
    if ($title === '' || mb_strlen($title) > 160 || mb_strlen($description) > 3000) {
        apiResponse(['ok' => false, 'error' => 'Título o descripción inválidos.'], 422);
    }
    $dueAt = assignmentDueAt($body['dueAt'] ?? null);
    $pdo->beginTransaction();
    try {
        $statement = $pdo->prepare(
            'INSERT INTO assignments (class_id, mission_id, title, description, due_at, created_by) VALUES (?, ?, ?, ?, ?, ?)'
        );
        $statement->execute([$classId, $missionId, $title, $description, $dueAt, (int) $user['id']]);
        $assignmentId = (int) $pdo->lastInsertId();
        $members = $pdo->prepare('SELECT user_id FROM class_members WHERE class_id = ?');
        $members->execute([$classId]);
        foreach ($members->fetchAll() as $member) {
            createNotification(
                $pdo,
                (int) $member['user_id'],
                'assignment_created',
                'Nueva tarea: ' . $title,
                'Tu docente publicó una tarea en ' . $class['name'] . '.',
                'assignment',
                $assignmentId
            );
        }
        $pdo->commit();
    } catch (Throwable $error) {
        $pdo->rollBack();
        throw $error;
    }
    apiResponse(['ok' => true, 'assignment' => ['id' => $assignmentId, 'class_id' => $classId, 'mission_id' => $missionId, 'title' => $title, 'description' => $description, 'due_at' => $dueAt]], 201);
}

if ($action === 'archive') {
    if (!in_array($user['role'], ['teacher', 'admin'], true)) {
        apiResponse(['ok' => false, 'error' => 'Solo docentes pueden archivar tareas.'], 403);
    }
    $assignmentId = max(0, (int) ($body['assignmentId'] ?? 0));
    $statement = $pdo->prepare('SELECT id, class_id FROM assignments WHERE id = ? LIMIT 1');
    $statement->execute([$assignmentId]);
    $assignment = $statement->fetch();
    if (!$assignment) apiResponse(['ok' => false, 'error' => 'Tarea no encontrada.'], 404);
    requireClassAccessForUser($pdo, $user, (int) $assignment['class_id'], true);
    $archived = !array_key_exists('archived', $body) || !empty($body['archived']);
    $update = $pdo->prepare('UPDATE assignments SET archived_at = ? WHERE id = ?');
    $update->execute([$archived ? date('Y-m-d H:i:s') : null, $assignmentId]);
    apiResponse(['ok' => true, 'assignmentId' => $assignmentId, 'archived' => $archived]);
}

apiResponse(['ok' => false, 'error' => 'Acción de tareas desconocida.'], 404);
