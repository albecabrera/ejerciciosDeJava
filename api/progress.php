<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = requireUser();
$pdo = requireDatabase();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $statement = $pdo->prepare('SELECT mission_id, answer, attempts, correct_attempts, hints_used, solution_shown, solved_at, updated_at FROM progress WHERE user_id = ? ORDER BY mission_id');
    $statement->execute([(int) $user['id']]);
    apiResponse(['ok' => true, 'progress' => $statement->fetchAll()]);
}

requireMethod('POST');
requireCsrf();
$body = requestJson();
$missions = $body['missions'] ?? [];
if (!is_array($missions) || count($missions) > 100) apiResponse(['ok' => false, 'error' => 'Formato de progreso inválido.'], 422);

$pdo->beginTransaction();
try {
    $statement = $pdo->prepare(
        'INSERT INTO progress (user_id, mission_id, answer, attempts, correct_attempts, hints_used, solution_shown, solved_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE answer = VALUES(answer), attempts = VALUES(attempts), correct_attempts = VALUES(correct_attempts), hints_used = VALUES(hints_used), solution_shown = VALUES(solution_shown), solved_at = VALUES(solved_at)'
    );
    foreach ($missions as $mission) {
        if (!is_array($mission) || !preg_match('/^[a-z0-9-]{1,80}$/', (string) ($mission['missionId'] ?? ''))) continue;
        $statement->execute([
            (int) $user['id'],
            $mission['missionId'],
            mb_substr((string) ($mission['answer'] ?? ''), 0, 48000),
            max(0, min(9999, (int) ($mission['attempts'] ?? 0))),
            max(0, min(9999, (int) ($mission['correctAttempts'] ?? 0))),
            max(0, min(999, (int) ($mission['hintsUsed'] ?? 0))),
            !empty($mission['solutionShown']) ? 1 : 0,
            !empty($mission['solved']) ? date('Y-m-d H:i:s') : null,
        ]);
    }
    $pdo->commit();
} catch (Throwable $error) {
    $pdo->rollBack();
    throw $error;
}
apiResponse(['ok' => true, 'saved' => count($missions)]);
