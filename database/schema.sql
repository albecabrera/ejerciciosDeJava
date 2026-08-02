CREATE DATABASE IF NOT EXISTS java_werkstatt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE java_werkstatt;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS classes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    join_code CHAR(8) NOT NULL UNIQUE,
    teacher_id INT UNSIGNED NULL,
    archived_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_classes_teacher_archived (teacher_id, archived_at),
    CONSTRAINT fk_classes_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Migración idempotente para instalaciones XAMPP/MariaDB creadas con esquemas anteriores.
ALTER TABLE classes MODIFY teacher_id INT UNSIGNED NULL;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS archived_at DATETIME NULL AFTER teacher_id;

CREATE TABLE IF NOT EXISTS class_members (
    class_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (class_id, user_id),
    CONSTRAINT fk_members_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS progress (
    user_id INT UNSIGNED NOT NULL,
    mission_id VARCHAR(80) NOT NULL,
    answer TEXT NOT NULL,
    attempts SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    correct_attempts SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    hints_used SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    solution_shown TINYINT(1) NOT NULL DEFAULT 0,
    solved_at DATETIME NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, mission_id),
    CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS attempt_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    mission_id VARCHAR(80) NOT NULL,
    phase ENUM('local', 'compile', 'run', 'pedagogic') NOT NULL DEFAULT 'local',
    passed TINYINT(1) NOT NULL DEFAULT 0,
    feedback VARCHAR(500) NOT NULL DEFAULT '',
    diagnostics_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    duration_ms INT UNSIGNED NOT NULL DEFAULT 0,
    answer_excerpt VARCHAR(800) NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_attempt_user_created (user_id, created_at),
    INDEX idx_attempt_mission (mission_id),
    CONSTRAINT fk_attempt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mission_feedback (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    class_id INT UNSIGNED NOT NULL,
    mission_id VARCHAR(80) NOT NULL,
    author_id INT UNSIGNED NOT NULL,
    parent_id BIGINT UNSIGNED NULL,
    message VARCHAR(1200) NOT NULL,
    status ENUM('open', 'resolved') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_feedback_class_mission (class_id, mission_id, created_at),
    INDEX idx_feedback_parent (parent_id),
    CONSTRAINT fk_feedback_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_parent FOREIGN KEY (parent_id) REFERENCES mission_feedback(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS assignments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    class_id INT UNSIGNED NOT NULL,
    mission_id VARCHAR(80) NOT NULL,
    title VARCHAR(160) NOT NULL,
    description VARCHAR(3000) NOT NULL DEFAULT '',
    due_at DATETIME NULL,
    created_by INT UNSIGNED NULL,
    archived_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_assignments_class_status (class_id, archived_at, due_at),
    CONSTRAINT fk_assignments_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignments_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS submissions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT UNSIGNED NOT NULL,
    student_id INT UNSIGNED NOT NULL,
    version_no SMALLINT UNSIGNED NOT NULL,
    source_code MEDIUMTEXT NOT NULL,
    note VARCHAR(1000) NOT NULL DEFAULT '',
    status ENUM('submitted', 'reviewed') NOT NULL DEFAULT 'submitted',
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_submission_version (assignment_id, student_id, version_no),
    INDEX idx_submissions_assignment_student (assignment_id, student_id, submitted_at),
    CONSTRAINT fk_submissions_assignment FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    CONSTRAINT fk_submissions_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS submission_reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    submission_id BIGINT UNSIGNED NOT NULL UNIQUE,
    reviewer_id INT UNSIGNED NULL,
    functionality_score TINYINT UNSIGNED NOT NULL,
    readability_score TINYINT UNSIGNED NOT NULL,
    concept_score TINYINT UNSIGNED NOT NULL,
    explanation_score TINYINT UNSIGNED NOT NULL,
    feedback VARCHAR(3000) NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_submission FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_review_functionality CHECK (functionality_score BETWEEN 0 AND 4),
    CONSTRAINT chk_review_readability CHECK (readability_score BETWEEN 0 AND 4),
    CONSTRAINT chk_review_concept CHECK (concept_score BETWEEN 0 AND 4),
    CONSTRAINT chk_review_explanation CHECK (explanation_score BETWEEN 0 AND 4)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    type VARCHAR(40) NOT NULL,
    title VARCHAR(180) NOT NULL,
    message VARCHAR(600) NOT NULL DEFAULT '',
    entity_type VARCHAR(40) NULL,
    entity_id BIGINT UNSIGNED NULL,
    read_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notifications_user_read (user_id, read_at, created_at),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS teaching_drafts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    class_id INT UNSIGNED NOT NULL,
    author_id INT UNSIGNED NULL,
    title VARCHAR(120) NOT NULL,
    objective VARCHAR(240) NOT NULL,
    criterion VARCHAR(160) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_teaching_drafts_class_created (class_id, created_at),
    CONSTRAINT fk_teaching_drafts_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_teaching_drafts_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS peer_review_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    class_id INT UNSIGNED NOT NULL,
    mission_id VARCHAR(80) NOT NULL,
    requester_id INT UNSIGNED NULL,
    focus VARCHAR(140) NOT NULL,
    status ENUM('pending', 'approved', 'declined') NOT NULL DEFAULT 'pending',
    moderated_by INT UNSIGNED NULL,
    moderated_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_peer_review_class_status (class_id, status, created_at),
    CONSTRAINT fk_peer_review_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_peer_review_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_peer_review_moderator FOREIGN KEY (moderated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
