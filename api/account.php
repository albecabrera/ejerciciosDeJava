<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = requireUser();
$pdo = requireDatabase();
$action = (string) ($_GET['action'] ?? 'export');

function accountRows(PDO $pdo, string $sql, array $params): array
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);
    return $statement->fetchAll();
}

if ($action === 'export' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = (int) $user['id'];
    $profile = accountRows($pdo, 'SELECT id, name, email, role, created_at FROM users WHERE id = ?', [$userId])[0] ?? null;
    apiResponse([
        'ok' => true,
        'exportedAt' => gmdate('c'),
        'account' => $profile,
        'memberships' => accountRows($pdo, 'SELECT c.id AS class_id, c.name, cm.joined_at FROM class_members cm JOIN classes c ON c.id = cm.class_id WHERE cm.user_id = ? ORDER BY cm.joined_at', [$userId]),
        'ownedClasses' => accountRows($pdo, 'SELECT id, name, archived_at, created_at FROM classes WHERE teacher_id = ? ORDER BY created_at', [$userId]),
        'progress' => accountRows($pdo, 'SELECT mission_id, answer, attempts, correct_attempts, hints_used, solution_shown, solved_at, updated_at FROM progress WHERE user_id = ? ORDER BY mission_id', [$userId]),
        'attempts' => accountRows($pdo, 'SELECT mission_id, phase, passed, feedback, diagnostics_count, duration_ms, answer_excerpt, created_at FROM attempt_events WHERE user_id = ? ORDER BY created_at', [$userId]),
        'feedback' => accountRows($pdo, 'SELECT class_id, mission_id, parent_id, message, status, created_at, updated_at FROM mission_feedback WHERE author_id = ? ORDER BY created_at', [$userId]),
        'assignmentsCreated' => accountRows($pdo, 'SELECT id, class_id, mission_id, title, description, due_at, archived_at, created_at, updated_at FROM assignments WHERE created_by = ? ORDER BY created_at', [$userId]),
        'submissions' => accountRows($pdo, 'SELECT id, assignment_id, version_no, source_code, note, status, submitted_at FROM submissions WHERE student_id = ? ORDER BY submitted_at', [$userId]),
        'reviewsReceived' => accountRows($pdo, 'SELECT r.submission_id, r.functionality_score, r.readability_score, r.concept_score, r.explanation_score, r.feedback, r.created_at, r.updated_at FROM submission_reviews r JOIN submissions s ON s.id = r.submission_id WHERE s.student_id = ? ORDER BY r.created_at', [$userId]),
        'notifications' => accountRows($pdo, 'SELECT type, title, message, entity_type, entity_id, read_at, created_at FROM notifications WHERE user_id = ? ORDER BY created_at', [$userId]),
    ]);
}

requireMethod('POST');
requireCsrf();
$body = requestJson();

if ($action === 'delete') {
    enforceRateLimit('account-delete', 5, 3600);
    $password = (string) ($body['password'] ?? '');
    $confirmation = (string) ($body['confirmation'] ?? '');
    if ($confirmation !== 'DELETE' || $password === '') {
        apiResponse(['ok' => false, 'error' => 'Confirmación y contraseña obligatorias.'], 422);
    }
    $statement = $pdo->prepare('SELECT password_hash, role FROM users WHERE id = ? LIMIT 1');
    $statement->execute([(int) $user['id']]);
    $account = $statement->fetch();
    if (!$account || !password_verify($password, (string) $account['password_hash'])) {
        apiResponse(['ok' => false, 'error' => 'Contraseña incorrecta.'], 401);
    }
    if ($account['role'] === 'admin') {
        $admins = (int) $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
        if ($admins <= 1) apiResponse(['ok' => false, 'error' => 'No se puede eliminar la última cuenta administradora.'], 409);
    }
    $pdo->beginTransaction();
    try {
        // Conserva las clases y sus entregas al borrar una cuenta docente, incluso en esquemas antiguos con FK CASCADE.
        $orphanClasses = $pdo->prepare('UPDATE classes SET teacher_id = NULL, archived_at = COALESCE(archived_at, NOW()) WHERE teacher_id = ?');
        $orphanClasses->execute([(int) $user['id']]);
        $delete = $pdo->prepare('DELETE FROM users WHERE id = ?');
        $delete->execute([(int) $user['id']]);
        $pdo->commit();
    } catch (Throwable $error) {
        $pdo->rollBack();
        throw $error;
    }
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], '', (bool) $params['secure'], (bool) $params['httponly']);
    }
    session_destroy();
    apiResponse(['ok' => true, 'deleted' => true]);
}

apiResponse(['ok' => false, 'error' => 'Acción de cuenta desconocida.'], 404);
