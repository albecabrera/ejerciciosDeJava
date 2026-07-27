<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = requireUser();
$pdo = requireDatabase();
$action = $_GET['action'] ?? 'list';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($action === 'student') {
        $studentId = max(0, (int) ($_GET['studentId'] ?? $user['id']));
        $classId = max(0, (int) ($_GET['classId'] ?? 0));
        if ($studentId !== (int) $user['id']) {
            if ($user['role'] !== 'teacher' && $user['role'] !== 'admin') apiResponse(['ok' => false, 'error' => 'Sin permisos.'], 403);
            $params = $user['role'] === 'admin' ? [$classId, $studentId] : [$classId, (int) $user['id'], $studentId];
            $sql = $user['role'] === 'admin'
                ? 'SELECT 1 FROM class_members cm JOIN classes c ON c.id = cm.class_id WHERE c.id = ? AND cm.user_id = ? LIMIT 1'
                : 'SELECT 1 FROM class_members cm JOIN classes c ON c.id = cm.class_id WHERE c.id = ? AND c.teacher_id = ? AND cm.user_id = ? LIMIT 1';
            $permission = $pdo->prepare($sql);
            $permission->execute($params);
            if (!$permission->fetch()) apiResponse(['ok' => false, 'error' => 'Alumno no encontrado en tu clase.'], 404);
        }
        $statement = $pdo->prepare('SELECT mission_id, phase, passed, feedback, diagnostics_count, duration_ms, answer_excerpt, created_at FROM attempt_events WHERE user_id = ? ORDER BY created_at DESC LIMIT 100');
        $statement->execute([$studentId]);
        apiResponse(['ok' => true, 'attempts' => $statement->fetchAll()]);
    }
    apiResponse(['ok' => false, 'error' => 'Acción de intentos desconocida.'], 404);
}

requireMethod('POST');
requireCsrf();
$body = requestJson();
$missionId = (string) ($body['missionId'] ?? '');
if (!preg_match('/^[a-z0-9-]{1,80}$/', $missionId)) apiResponse(['ok' => false, 'error' => 'Misión inválida.'], 422);
$statement = $pdo->prepare(
    'INSERT INTO attempt_events (user_id, mission_id, phase, passed, feedback, diagnostics_count, duration_ms, answer_excerpt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
);
$statement->execute([
    (int) $user['id'],
    $missionId,
    in_array(($body['phase'] ?? ''), ['local', 'compile', 'run', 'pedagogic'], true) ? $body['phase'] : 'local',
    !empty($body['passed']) ? 1 : 0,
    mb_substr((string) ($body['feedback'] ?? ''), 0, 500),
    max(0, min(999, (int) ($body['diagnosticsCount'] ?? 0))),
    max(0, min(60000, (int) ($body['durationMs'] ?? 0))),
    mb_substr((string) ($body['answerExcerpt'] ?? ''), 0, 800),
]);
apiResponse(['ok' => true, 'id' => (int) $pdo->lastInsertId()], 201);
