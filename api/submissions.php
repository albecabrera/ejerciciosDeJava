<?php
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = requireUser();
$pdo = requireDatabase();
$action = (string) ($_GET['action'] ?? 'list');

function submissionAssignment(PDO $pdo, int $assignmentId): array
{
    if ($assignmentId < 1) apiResponse(['ok' => false, 'error' => 'Tarea inválida.'], 422);
    $statement = $pdo->prepare(
        'SELECT a.id, a.class_id, a.title, a.mission_id, a.due_at, a.archived_at, c.archived_at AS class_archived_at
           FROM assignments a
           JOIN classes c ON c.id = a.class_id
          WHERE a.id = ?
          LIMIT 1'
    );
    $statement->execute([$assignmentId]);
    $assignment = $statement->fetch();
    if (!$assignment) apiResponse(['ok' => false, 'error' => 'Tarea no encontrada.'], 404);
    return $assignment;
}

function rubricScore(array $rubric, string $key): int
{
    if (!array_key_exists($key, $rubric) || filter_var($rubric[$key], FILTER_VALIDATE_INT) === false) {
        apiResponse(['ok' => false, 'error' => 'La rúbrica debe incluir cuatro puntuaciones enteras.'], 422);
    }
    $score = (int) $rubric[$key];
    if ($score < 0 || $score > 4) apiResponse(['ok' => false, 'error' => 'Cada puntuación debe estar entre 0 y 4.'], 422);
    return $score;
}

if ($action === 'list' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $assignmentId = max(0, (int) ($_GET['assignmentId'] ?? 0));
    $assignment = submissionAssignment($pdo, $assignmentId);
    requireClassAccessForUser($pdo, $user, (int) $assignment['class_id']);
    $isEducator = in_array($user['role'], ['teacher', 'admin'], true);
    $studentId = $isEducator ? max(0, (int) ($_GET['studentId'] ?? 0)) : (int) $user['id'];
    $sql =
        'SELECT s.id, s.assignment_id, s.student_id, s.version_no, s.source_code, s.note, s.status, s.submitted_at,
                u.name AS student_name, u.email AS student_email,
                r.functionality_score, r.readability_score, r.concept_score, r.explanation_score,
                r.feedback AS review_feedback, r.created_at AS reviewed_at, reviewer.name AS reviewer_name
           FROM submissions s
           JOIN users u ON u.id = s.student_id
      LEFT JOIN submission_reviews r ON r.submission_id = s.id
      LEFT JOIN users reviewer ON reviewer.id = r.reviewer_id
          WHERE s.assignment_id = ?';
    $params = [$assignmentId];
    if ($studentId > 0) {
        $sql .= ' AND s.student_id = ?';
        $params[] = $studentId;
    }
    $sql .= ' ORDER BY s.submitted_at DESC, s.version_no DESC LIMIT 500';
    $statement = $pdo->prepare($sql);
    $statement->execute($params);
    apiResponse(['ok' => true, 'assignment' => $assignment, 'submissions' => $statement->fetchAll()]);
}

requireMethod('POST');
requireCsrf();
$body = requestJson();

if ($action === 'submit') {
    if ($user['role'] !== 'student') apiResponse(['ok' => false, 'error' => 'Solo alumnos pueden realizar entregas.'], 403);
    $assignmentId = max(0, (int) ($body['assignmentId'] ?? 0));
    $assignment = submissionAssignment($pdo, $assignmentId);
    requireClassAccessForUser($pdo, $user, (int) $assignment['class_id']);
    if ($assignment['archived_at'] !== null || $assignment['class_archived_at'] !== null) {
        apiResponse(['ok' => false, 'error' => 'La tarea o la clase está archivada.'], 409);
    }
    $sourceCode = (string) ($body['sourceCode'] ?? '');
    $note = trim((string) ($body['note'] ?? ''));
    if (trim($sourceCode) === '' || strlen($sourceCode) > 48000 || mb_strlen($note) > 1000) {
        apiResponse(['ok' => false, 'error' => 'Código o nota de entrega inválidos.'], 422);
    }
    $pdo->beginTransaction();
    try {
        $lock = $pdo->prepare('SELECT id FROM assignments WHERE id = ? FOR UPDATE');
        $lock->execute([$assignmentId]);
        $version = $pdo->prepare('SELECT COALESCE(MAX(version_no), 0) + 1 FROM submissions WHERE assignment_id = ? AND student_id = ?');
        $version->execute([$assignmentId, (int) $user['id']]);
        $versionNo = min(65535, (int) $version->fetchColumn());
        $statement = $pdo->prepare(
            'INSERT INTO submissions (assignment_id, student_id, version_no, source_code, note) VALUES (?, ?, ?, ?, ?)'
        );
        $statement->execute([$assignmentId, (int) $user['id'], $versionNo, $sourceCode, $note]);
        $submissionId = (int) $pdo->lastInsertId();
        $pdo->commit();
    } catch (Throwable $error) {
        $pdo->rollBack();
        throw $error;
    }
    $late = $assignment['due_at'] !== null && strtotime((string) $assignment['due_at']) < time();
    apiResponse(['ok' => true, 'submission' => ['id' => $submissionId, 'assignment_id' => $assignmentId, 'version_no' => $versionNo, 'status' => 'submitted', 'late' => $late]], 201);
}

if ($action === 'review') {
    if (!in_array($user['role'], ['teacher', 'admin'], true)) {
        apiResponse(['ok' => false, 'error' => 'Solo docentes pueden revisar entregas.'], 403);
    }
    $submissionId = max(0, (int) ($body['submissionId'] ?? 0));
    $statement = $pdo->prepare(
        'SELECT s.id, s.student_id, s.assignment_id, a.class_id, a.title
           FROM submissions s
           JOIN assignments a ON a.id = s.assignment_id
          WHERE s.id = ? LIMIT 1'
    );
    $statement->execute([$submissionId]);
    $submission = $statement->fetch();
    if (!$submission) apiResponse(['ok' => false, 'error' => 'Entrega no encontrada.'], 404);
    requireClassAccessForUser($pdo, $user, (int) $submission['class_id'], true);
    $rubric = is_array($body['rubric'] ?? null) ? $body['rubric'] : [];
    $functionality = rubricScore($rubric, 'functionality');
    $readability = rubricScore($rubric, 'readability');
    $concept = rubricScore($rubric, 'concept');
    $explanation = rubricScore($rubric, 'explanation');
    $feedback = trim((string) ($body['feedback'] ?? ''));
    if (mb_strlen($feedback) > 3000) apiResponse(['ok' => false, 'error' => 'El feedback es demasiado largo.'], 422);
    $pdo->beginTransaction();
    try {
        $review = $pdo->prepare(
            'INSERT INTO submission_reviews
                (submission_id, reviewer_id, functionality_score, readability_score, concept_score, explanation_score, feedback)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE reviewer_id = VALUES(reviewer_id), functionality_score = VALUES(functionality_score),
                readability_score = VALUES(readability_score), concept_score = VALUES(concept_score),
                explanation_score = VALUES(explanation_score), feedback = VALUES(feedback)'
        );
        $review->execute([$submissionId, (int) $user['id'], $functionality, $readability, $concept, $explanation, $feedback]);
        $update = $pdo->prepare("UPDATE submissions SET status = 'reviewed' WHERE id = ?");
        $update->execute([$submissionId]);
        createNotification(
            $pdo,
            (int) $submission['student_id'],
            'submission_reviewed',
            'Entrega revisada: ' . $submission['title'],
            'Tu docente revisó la entrega y publicó la rúbrica.',
            'submission',
            $submissionId
        );
        $pdo->commit();
    } catch (Throwable $error) {
        $pdo->rollBack();
        throw $error;
    }
    apiResponse(['ok' => true, 'review' => ['submission_id' => $submissionId, 'functionality' => $functionality, 'readability' => $readability, 'concept' => $concept, 'explanation' => $explanation, 'feedback' => $feedback]]);
}

apiResponse(['ok' => false, 'error' => 'Acción de entregas desconocida.'], 404);
