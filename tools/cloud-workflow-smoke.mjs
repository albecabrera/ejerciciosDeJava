import { execFile } from "node:child_process";
import { randomBytes } from "node:crypto";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const baseUrl = (process.env.JAVA_WERKSTATT_CLOUD_URL
  || process.env.JAVA_WERKSTATT_XAMPP_URL
  || "http://127.0.0.1:8000/").replace(/\/?$/, "/");

class UnavailableError extends Error {}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function cookieValues(headers) {
  if (typeof headers.getSetCookie === "function") return headers.getSetCookie();
  const combined = headers.get("set-cookie");
  return combined ? combined.split(/,(?=[^;,]+=)/) : [];
}

class SessionClient {
  cookie = "";
  csrf = "";

  async request(path, { method = "GET", body, csrf = false } = {}) {
    const headers = { Accept: "application/json" };
    if (this.cookie) headers.Cookie = this.cookie;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (csrf) {
      assert(this.csrf, `Missing CSRF token for ${path}`);
      headers["X-CSRF-Token"] = this.csrf;
    }

    let response;
    try {
      response = await fetch(new URL(path, baseUrl), {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new UnavailableError(`server unavailable at ${baseUrl}`);
    }

    const cookies = cookieValues(response.headers)
      .map((value) => value.split(";", 1)[0])
      .filter(Boolean);
    if (cookies.length) this.cookie = cookies.join("; ");
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) {
      throw new Error(`${path} returned HTTP ${response.status}: ${payload.error || "invalid JSON response"}`);
    }
    if (payload.csrf) this.csrf = String(payload.csrf);
    return payload;
  }

  get(path) {
    return this.request(path);
  }

  post(path, body) {
    return this.request(path, { method: "POST", body, csrf: true });
  }
}

const suffix = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}`;
const teacherEmail = `cloud-teacher-${suffix}@example.invalid`;
const studentEmail = `cloud-student-${suffix}@example.invalid`;
const password = `Jw!${randomBytes(18).toString("base64url")}`;
const className = `Cloud smoke ${suffix}`;
let teacherCreated = false;
let studentCreated = false;
let classId = 0;

async function createTeacher() {
  let result;
  try {
    result = await execFileAsync("php", [
      "tools/create-teacher.php",
      "Cloud Smoke Teacher",
      teacherEmail,
      password,
    ], { maxBuffer: 16_000 });
  } catch {
    throw new UnavailableError("teacher bootstrap failed; verify PHP and config/config.php");
  }
  if (!String(result.stdout).startsWith("Docente creado:")) {
    throw new UnavailableError("teacher bootstrap failed; verify the local database configuration");
  }
  teacherCreated = true;
}

async function cleanupFixtures() {
  if (!teacherCreated && !studentCreated && classId < 1) return;
  const cleanupCode = String.raw`
$configPath = getcwd() . '/config/config.php';
if (!is_file($configPath)) { fwrite(STDERR, 'missing-config'); exit(2); }
$config = require $configPath;
$pdo = new PDO($config['db']['dsn'], $config['db']['user'], $config['db']['password'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$pdo->beginTransaction();
try {
    $deleteClass = $pdo->prepare('DELETE FROM classes WHERE id = ? OR name = ?');
    $deleteClass->execute([(int) getenv('JW_SMOKE_CLASS_ID'), getenv('JW_SMOKE_CLASS_NAME')]);
    $deleteUsers = $pdo->prepare('DELETE FROM users WHERE email IN (?, ?)');
    $deleteUsers->execute([getenv('JW_SMOKE_TEACHER'), getenv('JW_SMOKE_STUDENT')]);
    $pdo->commit();
} catch (Throwable $error) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    fwrite(STDERR, 'cleanup-failed');
    exit(3);
}`;
  try {
    await execFileAsync("php", ["-r", cleanupCode], {
      env: {
        ...process.env,
        JW_SMOKE_CLASS_ID: String(classId),
        JW_SMOKE_CLASS_NAME: className,
        JW_SMOKE_TEACHER: teacherEmail,
        JW_SMOKE_STUDENT: studentEmail,
      },
      maxBuffer: 4_000,
    });
  } catch {
    throw new Error("fixture cleanup failed; remove the unique cloud-smoke records manually");
  }
}

async function verifyWorkflow() {
  const anonymous = new SessionClient();
  const health = await anonymous.get("api/auth.php?action=me");
  if (health.configured !== true) {
    throw new UnavailableError("database is not configured for the local PHP server");
  }

  await createTeacher();

  const teacher = new SessionClient();
  const teacherLogin = await teacher.request("api/auth.php?action=login", {
    method: "POST",
    body: { email: teacherEmail, password },
  });
  assert(teacherLogin.user?.role === "teacher", "teacher login did not return the teacher role");

  const student = new SessionClient();
  const registration = await student.request("api/auth.php?action=register", {
    method: "POST",
    body: { name: "Cloud Smoke Student", email: studentEmail, password },
  });
  studentCreated = true;
  assert(registration.user?.role === "student", "registration did not return the student role");

  const createdClass = await teacher.post("api/classes.php?action=create", { name: className });
  classId = Number(createdClass.class?.id || 0);
  const originalJoinCode = String(createdClass.class?.join_code || "");
  assert(classId > 0 && originalJoinCode, "class creation did not return an id and join code");

  await student.post("api/classes.php?action=join", { joinCode: originalJoinCode });
  const studentClasses = await student.get("api/classes.php?action=list");
  assert(studentClasses.classes?.some((item) => Number(item.id) === classId), "student did not join the class");

  const assignmentResult = await teacher.post("api/assignments.php?action=create", {
    classId,
    missionId: "types",
    title: "Cloud workflow contract",
    description: "Disposable integration fixture",
  });
  const assignmentId = Number(assignmentResult.assignment?.id || 0);
  assert(assignmentId > 0, "assignment creation did not return an id");

  const assignments = await student.get(`api/assignments.php?action=list&classId=${classId}`);
  assert(assignments.assignments?.some((item) => Number(item.id) === assignmentId), "student cannot list the assignment");

  const first = await student.post("api/submissions.php?action=submit", {
    assignmentId,
    sourceCode: "int age = 17;",
    note: "version one",
  });
  const second = await student.post("api/submissions.php?action=submit", {
    assignmentId,
    sourceCode: "int age = 18;\nSystem.out.println(age);",
    note: "version two",
  });
  assert(Number(first.submission?.version_no) === 1, "first submission is not version 1");
  assert(Number(second.submission?.version_no) === 2, "second submission is not version 2");

  const teacherSubmissions = await teacher.get(`api/submissions.php?action=list&assignmentId=${assignmentId}`);
  assert(teacherSubmissions.submissions?.length === 2, "teacher did not receive both submission versions");
  const latestSubmissionId = Number(second.submission?.id || 0);
  await teacher.post("api/submissions.php?action=review", {
    submissionId: latestSubmissionId,
    rubric: { functionality: 4, readability: 3, concept: 4, explanation: 3 },
    feedback: "Automated rubric review",
  });

  const notifications = await student.get("api/notifications.php?action=list");
  const reviewNotification = notifications.notifications?.find((item) => item.type === "submission_reviewed");
  assert(reviewNotification?.id, "student did not receive the review notification");
  await student.post("api/notifications.php?action=read", { ids: [Number(reviewNotification.id)] });
  const notificationsAfterRead = await student.get("api/notifications.php?action=list");
  const readReview = notificationsAfterRead.notifications?.find((item) => Number(item.id) === Number(reviewNotification.id));
  assert(readReview?.read_at, "review notification was not marked as read");

  const regenerated = await teacher.post("api/classes.php?action=regenerate-code", { classId });
  assert(regenerated.join_code && regenerated.join_code !== originalJoinCode, "class join code was not regenerated");

  const teacherExport = await teacher.get("api/account.php?action=export");
  const studentExport = await student.get("api/account.php?action=export");
  assert(teacherExport.account?.email === teacherEmail, "teacher account export is incomplete");
  assert(studentExport.account?.email === studentEmail, "student account export is incomplete");
  assert(studentExport.submissions?.length === 2, "student export does not contain both submissions");
  assert(studentExport.reviewsReceived?.some((item) => Number(item.submission_id) === latestSubmissionId), "student export does not contain the rubric review");

  return { submissions: 2, reviewed: 1, notificationRead: true };
}

let result;
let primaryError;
try {
  result = await verifyWorkflow();
} catch (error) {
  primaryError = error;
} finally {
  try {
    await cleanupFixtures();
  } catch (cleanupError) {
    primaryError = primaryError
      ? new Error(`${primaryError.message}; ${cleanupError.message}`)
      : cleanupError;
  }
}

if (primaryError) {
  const unavailable = primaryError instanceof UnavailableError;
  console.error(`${unavailable ? "cloud-smoke-unavailable" : "cloud-smoke-failed"}: ${primaryError.message}`);
  process.exit(unavailable ? 2 : 1);
}

console.log(JSON.stringify({ ok: true, baseUrl, ...result }));
