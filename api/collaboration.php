<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = requireUser();
$pdo = requireDatabase();
$action = (string) ($_GET['action'] ?? 'list');

function collaborationClassId(array $body): int { return max(0, (int) ($body['classId'] ?? $_GET['classId'] ?? 0)); }
function collaborationMissionId(mixed $value): string {
    $id = trim((string) $value);
    if (!isCurrentMissionId($id)) apiResponse(['ok' => false, 'error' => 'Misión inválida.'], 422);
    return $id;
}

if ($action === 'list' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $classId = collaborationClassId([]);
    requireClassAccessForUser($pdo, $user, $classId);
    $drafts = $pdo->prepare('SELECT d.id, d.title, d.objective, d.criterion, d.created_at, u.name AS author FROM teaching_drafts d LEFT JOIN users u ON u.id = d.author_id WHERE d.class_id = ? ORDER BY d.created_at DESC LIMIT 50');
    $drafts->execute([$classId]);
    $reviews = $pdo->prepare('SELECT r.id, r.mission_id, r.focus, r.status, r.created_at, u.name AS requester FROM peer_review_requests r LEFT JOIN users u ON u.id = r.requester_id WHERE r.class_id = ? ORDER BY r.created_at DESC LIMIT 100');
    $reviews->execute([$classId]);
    apiResponse(['ok' => true, 'drafts' => $drafts->fetchAll(), 'peerRequests' => $reviews->fetchAll()]);
}

requireMethod('POST'); requireCsrf(); $body = requestJson(); $classId = collaborationClassId($body);
if ($action === 'create-draft') {
    if (!in_array($user['role'], ['teacher', 'admin'], true)) apiResponse(['ok' => false, 'error' => 'Solo docentes pueden crear borradores.'], 403);
    requireClassAccessForUser($pdo, $user, $classId, true);
    $title = trim((string) ($body['title'] ?? '')); $objective = trim((string) ($body['objective'] ?? '')); $criterion = trim((string) ($body['criterion'] ?? ''));
    if ($title === '' || $objective === '' || $criterion === '' || mb_strlen($title) > 120 || mb_strlen($objective) > 240 || mb_strlen($criterion) > 160) apiResponse(['ok' => false, 'error' => 'Borrador inválido.'], 422);
    $stmt = $pdo->prepare('INSERT INTO teaching_drafts (class_id, author_id, title, objective, criterion) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$classId, (int) $user['id'], $title, $objective, $criterion]);
    apiResponse(['ok' => true, 'id' => (int) $pdo->lastInsertId()], 201);
}
if ($action === 'request-peer-review') {
    requireClassAccessForUser($pdo, $user, $classId);
    $missionId = collaborationMissionId($body['missionId'] ?? ''); $focus = trim((string) ($body['focus'] ?? ''));
    if ($focus === '' || mb_strlen($focus) > 140) apiResponse(['ok' => false, 'error' => 'Foco de revisión inválido.'], 422);
    $stmt = $pdo->prepare('INSERT INTO peer_review_requests (class_id, mission_id, requester_id, focus) VALUES (?, ?, ?, ?)');
    $stmt->execute([$classId, $missionId, (int) $user['id'], $focus]);
    apiResponse(['ok' => true, 'id' => (int) $pdo->lastInsertId()], 201);
}
if ($action === 'moderate-peer-review') {
    if (!in_array($user['role'], ['teacher', 'admin'], true)) apiResponse(['ok' => false, 'error' => 'Solo docentes pueden moderar.'], 403);
    requireClassAccessForUser($pdo, $user, $classId, true);
    $id = max(0, (int) ($body['requestId'] ?? 0)); $status = (string) ($body['status'] ?? '');
    if (!$id || !in_array($status, ['approved', 'declined'], true)) apiResponse(['ok' => false, 'error' => 'Moderación inválida.'], 422);
    $stmt = $pdo->prepare('UPDATE peer_review_requests SET status = ?, moderated_by = ?, moderated_at = NOW() WHERE id = ? AND class_id = ?');
    $stmt->execute([$status, (int) $user['id'], $id, $classId]);
    apiResponse(['ok' => true, 'updated' => $stmt->rowCount()]);
}
apiResponse(['ok' => false, 'error' => 'Acción desconocida.'], 404);
