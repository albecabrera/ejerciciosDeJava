<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = requireUser();
$pdo = requireDatabase();
$allowedMissionIds = [
    'types', 'condition', 'loop', 'method', 'arrays', 'class', 'list',
    'debug', 'strings', 'while-input', 'uml-model', 'tests-thinking',
    'inheritance', 'polymorphism', 'stack', 'queue', 'linked-list',
    'recursion', 'linear-search', 'binary-search', 'insertion-sort',
    'efficiency', 'bst', 'graph-bfs', 'dfa', 'grammar', 'parser', 'sql',
    'normalization', 'network', 'caesar', 'privacy', 'von-neumann',
    'concurrency-limits', 'halting-limit', 'hash-map',
];

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
$allowed = array_flip($allowedMissionIds);
$saved = 0;

$pdo->beginTransaction();
try {
    $statement = $pdo->prepare(
        'INSERT INTO progress (user_id, mission_id, answer, attempts, correct_attempts, hints_used, solution_shown, solved_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            answer = VALUES(answer),
            attempts = GREATEST(attempts, VALUES(attempts)),
            correct_attempts = GREATEST(correct_attempts, LEAST(VALUES(correct_attempts), GREATEST(attempts, VALUES(attempts)))),
            hints_used = GREATEST(hints_used, VALUES(hints_used)),
            solution_shown = GREATEST(solution_shown, VALUES(solution_shown)),
            solved_at = CASE
                WHEN solved_at IS NOT NULL THEN solved_at
                WHEN VALUES(solved_at) IS NOT NULL THEN VALUES(solved_at)
                ELSE NULL
            END'
    );
    foreach ($missions as $mission) {
        if (!is_array($mission)) continue;
        $missionId = (string) ($mission['missionId'] ?? '');
        if (!isset($allowed[$missionId])) continue;
        $attempts = max(0, min(9999, (int) ($mission['attempts'] ?? 0)));
        $correctAttempts = max(0, min($attempts, min(9999, (int) ($mission['correctAttempts'] ?? 0))));
        $statement->execute([
            (int) $user['id'],
            $missionId,
            mb_substr((string) ($mission['answer'] ?? ''), 0, 48000),
            $attempts,
            $correctAttempts,
            max(0, min(999, (int) ($mission['hintsUsed'] ?? 0))),
            !empty($mission['solutionShown']) ? 1 : 0,
            !empty($mission['solved']) ? date('Y-m-d H:i:s') : null,
        ]);
        $saved += 1;
    }
    $pdo->commit();
} catch (Throwable $error) {
    $pdo->rollBack();
    throw $error;
}
apiResponse(['ok' => true, 'saved' => $saved]);
