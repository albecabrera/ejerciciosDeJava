<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = requireUser();
$pdo = requireDatabase();
$action = (string) ($_GET['action'] ?? 'list');

if ($action === 'list' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $limit = max(1, min(100, (int) ($_GET['limit'] ?? 50)));
    $unreadOnly = ($_GET['unreadOnly'] ?? '') === '1';
    $beforeId = max(0, (int) ($_GET['beforeId'] ?? 0));
    $sql = 'SELECT id, type, title, message, entity_type, entity_id, read_at, created_at FROM notifications WHERE user_id = ?';
    $params = [(int) $user['id']];
    if ($unreadOnly) $sql .= ' AND read_at IS NULL';
    if ($beforeId > 0) {
        $sql .= ' AND id < ?';
        $params[] = $beforeId;
    }
    $sql .= ' ORDER BY id DESC LIMIT ' . $limit;
    $statement = $pdo->prepare($sql);
    $statement->execute($params);
    $count = $pdo->prepare('SELECT COUNT(*) FROM notifications WHERE user_id = ? AND read_at IS NULL');
    $count->execute([(int) $user['id']]);
    apiResponse(['ok' => true, 'unread' => (int) $count->fetchColumn(), 'notifications' => $statement->fetchAll()]);
}

requireMethod('POST');
requireCsrf();
$body = requestJson();

if ($action === 'read') {
    if (!empty($body['all'])) {
        $statement = $pdo->prepare('UPDATE notifications SET read_at = COALESCE(read_at, NOW()) WHERE user_id = ?');
        $statement->execute([(int) $user['id']]);
        apiResponse(['ok' => true, 'updated' => $statement->rowCount()]);
    }
    $ids = $body['ids'] ?? [];
    if (!is_array($ids) || count($ids) < 1 || count($ids) > 100) {
        apiResponse(['ok' => false, 'error' => 'Lista de notificaciones inválida.'], 422);
    }
    $ids = array_values(array_unique(array_filter(array_map('intval', $ids), static fn(int $id): bool => $id > 0)));
    if (!$ids) apiResponse(['ok' => false, 'error' => 'Lista de notificaciones inválida.'], 422);
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $statement = $pdo->prepare("UPDATE notifications SET read_at = COALESCE(read_at, NOW()) WHERE user_id = ? AND id IN ($placeholders)");
    $statement->execute(array_merge([(int) $user['id']], $ids));
    apiResponse(['ok' => true, 'updated' => $statement->rowCount()]);
}

apiResponse(['ok' => false, 'error' => 'Acción de notificaciones desconocida.'], 404);
