import { test, expect } from "@playwright/test";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

function materializeCompileRequest(request) {
  if (request.mode === "snippet") {
    return {
      fileName: "WerkstattSnippet.java",
      mainClass: "WerkstattSnippet",
      source: `import java.util.*;
public class WerkstattSnippet {
    public static void main(String[] args) throws Exception {
${request.source.split("\n").map((line) => `        ${line}`).join("\n")}
    }
}
`,
    };
  }
  if (request.mode === "member") {
    return {
      fileName: "WerkstattMember.java",
      mainClass: "WerkstattMember",
      source: `import java.util.*;
public class WerkstattMember {
${request.source.split("\n").map((line) => `    ${line}`).join("\n")}
}
`,
    };
  }
  return {
    fileName: request.fileName,
    mainClass: basename(request.fileName, ".java"),
    source: request.source,
  };
}

async function verifyJavaContract(contract) {
  const directory = await mkdtemp(join(tmpdir(), "java-werkstatt-contract-"));
  try {
    const unit = materializeCompileRequest(contract.compileRequest);
    await writeFile(join(directory, unit.fileName), unit.source, "utf8");
    await execFileAsync("javac", ["-encoding", "UTF-8", "-proc:none", unit.fileName], {
      cwd: directory,
      timeout: 15_000,
    });
    if (!contract.compileRequest.run) return { id: contract.id, stdout: "", ran: false };
    const result = await execFileAsync("java", ["-cp", directory, unit.mainClass], {
      cwd: directory,
      timeout: 8_000,
      maxBuffer: 64_000,
    });
    return { id: contract.id, stdout: result.stdout, ran: true };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

async function mapWithConcurrency(values, concurrency, operation) {
  const results = new Array(values.length);
  let nextIndex = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await operation(values[index]);
    }
  }));
  return results;
}

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html?e2e=1&workspace=1");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

async function reloadWithCloudUser(page, user) {
  await page.route("**/api/*.php*", async (route) => {
    const url = new URL(route.request().url());
    const endpoint = url.pathname.split("/").pop();
    const payloads = {
      "auth.php": { ok: true, configured: true, user, csrf: "e2e-csrf" },
      "progress.php": { ok: true, progress: [] },
      "classes.php": { ok: true, classes: [] },
      "notifications.php": { ok: true, notifications: [] },
    };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(payloads[endpoint] || { ok: true }),
    });
  });
  await page.reload();
}

test("moves from the clean dashboard into a focused workspace", async ({ page }) => {
  await page.goto("/index.html?e2e=1");
  await expect(page.locator("#dashboard")).toBeVisible();
  await expect(page.locator("#workspace")).toBeHidden();
  await page.locator("#commandContinueButton").click();
  await expect(page.locator("#dashboard")).toBeHidden();
  await expect(page.locator("#workspace")).toBeVisible();
  await expect(page.locator("#missionTitle")).toBeFocused();
  await page.locator("#dashboardBackButton").click();
  await expect(page.locator("#dashboard")).toBeVisible();
});

test("shows a reduced-motion-safe splash without blocking normal app opening", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("java-werkstatt-onboarding-v1", "done"));
  await page.goto("/index.html", { waitUntil: "domcontentloaded" });

  const splash = page.locator("#appSplash");
  await expect(splash).toBeVisible({ timeout: 500 });
  await expect(page.locator("#appSplashLogo")).toBeVisible();
  await expect(page.locator("#appSplashLogo")).toHaveAccessibleName(/Java Werkstatt/);
  const reducedMotion = await page.locator(".app-splash-steam").first().evaluate((node) => ({
    animation: getComputedStyle(node).animationName,
    transition: getComputedStyle(document.querySelector("#appSplash")).transitionDuration,
  }));
  expect(reducedMotion.animation).toBe("none");
  expect(Number.parseFloat(reducedMotion.transition)).toBeLessThanOrEqual(0.001);

  await expect(splash).toBeHidden({ timeout: 1_000 });
  await expect(page.locator("#dashboard")).toBeVisible();
  await page.locator("#commandContinueButton").click();
  await expect(page.locator("#workspace")).toBeVisible();
});

test("welcomes learners with three calm steps and clear actions", async ({ page }) => {
  await page.goto("/index.html?e2e=1");
  await expect(page.locator(".welcome-greeting")).toContainText(/bienvenido|willkommen/i);
  await expect(page.locator(".welcome-steps li")).toHaveCount(3);
  await expect(page.locator("#commandContinueButton")).toContainText(/abrir misión|mission öffnen/i);
  await page.locator("#exploreProjectsButton").click();
  await expect(page.locator("#projectGallery button:not(:disabled)").first()).toBeFocused();
  await page.locator("#commandContinueButton").click();
  await expect(page.locator("#workspace")).toBeVisible();
});

test("explores projects without smooth motion when the learner requests reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/index.html?e2e=1");
  await page.locator("#projectGallery").evaluate((node) => {
    node.scrollIntoView = (options) => {
      window.__exploreScrollBehavior = options?.behavior || "";
    };
  });
  await page.locator("#exploreProjectsButton").click();
  await expect.poll(() => page.evaluate(() => window.__exploreScrollBehavior)).toBe("auto");
});

test("translates the complete dashboard welcome to German", async ({ page }) => {
  await page.goto("/index.html?e2e=1");
  await page.locator('.language-button[data-language="de"]').click();
  await expect(page.locator(".welcome-greeting")).toHaveText("Willkommen in der Java Werkstatt");
  await expect(page.locator(".welcome-steps")).toHaveAttribute("aria-label", "So startest du");
  await expect(page.locator(".welcome-steps")).toContainText("Mission auswählen");
  await expect(page.locator("#exploreProjectsButton")).toContainText("Projekte erkunden");
});

test("translates the learning tool tab to German", async ({ page }) => {
  await page.goto("/index.html?e2e=1&workspace=1");
  await page.locator('.language-button[data-language="de"]').click();
  await expect(page.locator("#toolLearningTab")).toHaveText("Lernen");
  await page.locator("#toolLearningTab").click();
  await expect(page.locator("#learningLabTitle")).toHaveText("Nachweis, Ablauf und Prozess");
  await expect(page.locator("#toolLearningPanel")).toContainText("Missions-Tests");
  await expect(page.locator("#toolLearningPanel")).toContainText("Schrittweise Ablaufspur");
  await expect(page.locator("#peerReviewFocus")).toHaveAttribute("placeholder", "z. B.: Deckt der Vertrag Grenzfälle ab?");
});

test("uses a non-interactive vector-like Java mark behind the dashboard", async ({ page }) => {
  await page.goto("/index.html?e2e=1");
  const signature = page.locator(".java-signature");
  await expect(signature).toBeVisible();
  await expect(signature).toHaveAttribute("aria-hidden", "true");
  await expect(signature.locator("svg path")).toHaveCount(6);
  await expect(signature.locator(".java-signature-monogram")).toHaveText("J_");
  const decoration = await signature.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      pointerEvents: style.pointerEvents,
      opacity: Number(style.opacity),
    };
  });
  expect(decoration.pointerEvents).toBe("none");
  expect(decoration.opacity).toBeGreaterThan(0);
  expect(decoration.opacity).toBeLessThan(0.25);
});

test("shows the user-provided Java cover with semantic bilingual copy", async ({ page }) => {
  await page.goto("/index.html?e2e=1");
  const cover = page.locator("#welcomeCoverImage");
  await expect(cover).toBeVisible();
  await expect(cover).toHaveAttribute("src", "src/IMG_0198.JPG");
  await expect(cover).toHaveAttribute("alt", /cubos luminosos.*JAVA/i);
  await expect(page.locator(".welcome-cover figcaption")).toContainText("Aprendé programando");
  await expect.poll(() => cover.evaluate((image) => image.naturalWidth)).toBe(1200);
  await page.locator('.language-button[data-language="de"]').click();
  await expect(cover).toHaveAttribute("alt", /Leuchtende Würfel.*JAVA/i);
  await expect(page.locator(".welcome-cover figcaption")).toContainText("Lerne durch Programmieren");
});

test("keeps the welcome cover contained on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/index.html?e2e=1");
  await expect(page.locator(".welcome-cover")).toBeVisible();
  const layout = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    fit: getComputedStyle(document.querySelector("#welcomeCoverImage")).objectFit,
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport);
  expect(layout.body).toBeLessThanOrEqual(layout.viewport);
  expect(layout.fit).toBe("cover");
});

test("shows the brief onboarding once and persists its completion", async ({ page }) => {
  await page.goto("/index.html?e2e=1&onboarding=1");
  await expect(page.locator("#onboardingDialog")).toBeVisible();
  await expect(page.locator("#onboardingDialog")).toHaveAttribute("aria-labelledby", "onboardingTitle");
  await page.locator("#onboardingClose").click();
  await expect(page.locator("#onboardingDialog")).toBeHidden();
  await expect(page.locator("#commandContinueButton")).toBeFocused();
  await page.reload();
  await expect(page.locator("#onboardingDialog")).toBeHidden();
});

test("offers a resume shortcut when the current mission has work", async ({ page }) => {
  await page.locator("#editor").fill("int draft = 1;");
  await page.locator("#dashboardBackButton").click();
  await expect(page.locator("#commandContinueButton")).toContainText(/reanudar misión|mission fortsetzen/i);
  await expect(page.locator("#commandContinueButton")).toHaveAttribute("aria-keyshortcuts", "Alt+R");
  const ctrlPrevented = await page.evaluate(() => {
    const event = new KeyboardEvent("keydown", {
      key: "r",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
    return event.defaultPrevented;
  });
  expect(ctrlPrevented).toBeFalsy();
  await expect(page.locator("#dashboard")).toBeVisible();
  await page.keyboard.press("Alt+r");
  await expect(page.locator("#workspace")).toBeVisible();
  await expect(page.locator("#missionTitle")).toBeFocused();
  await expect(page.locator("#editor")).toHaveValue("int draft = 1;");
});

test("opens and focuses the teacher panel from the dashboard", async ({ page }) => {
  await page.goto("/index.html?e2e=1");
  await page.getByRole("button", { name: /panel docente|lehrkräfte-panel/i }).click();
  await expect(page.locator("#workspace")).toBeVisible();
  await expect(page.locator("#teacherPanel")).toBeVisible();
  await expect(page.locator("#teacherTitle")).toBeFocused();
});

test("opens the workspace before the dashboard skip-link focuses the editor", async ({ page }) => {
  await page.goto("/index.html?e2e=1");
  await page.locator(".skip-link").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#workspace")).toBeVisible();
  await expect(page.locator("#editor")).toBeFocused();
});

test("marks unavailable project routes as locked instead of promising navigation", async ({ page }) => {
  await page.goto("/index.html?e2e=1");
  const locked = page.locator("#projectGallery button:disabled");
  await expect(locked).toHaveCount(4);
  await expect(locked.first()).toContainText(/bloqueado|gesperrt/i);
  await expect(locked.first()).toHaveAttribute("aria-label", /bloqueado|gesperrt/i);
  await expect(page.locator("#projectGallery button:not(:disabled)")).toHaveCount(1);
});

test("reveals resources and one IntelliJ tool window at a time", async ({ page }) => {
  await expect(page.locator("[data-resource-panel]:visible")).toHaveCount(0);
  await page.getByRole("button", { name: /tutorial/i }).click();
  await expect(page.locator("#resourceTutorialPanel")).toBeVisible();
  await page.getByRole("button", { name: /documentación|dokumentation/i }).click();
  await expect(page.locator("#resourceTutorialPanel")).toBeHidden();
  await expect(page.locator("#resourceDocsPanel")).toBeVisible();

  await expect(page.locator("#toolConsolePanel")).toBeVisible();
  await page.getByRole("tab", { name: /problemas|probleme/i }).click();
  await expect(page.locator("#toolConsolePanel")).toBeHidden();
  await expect(page.locator("#toolProblemsPanel")).toBeVisible();
  await page.getByRole("tab", { name: /progreso|fortschritt/i }).click();
  await expect(page.locator("[data-tool-panel]:visible")).toHaveCount(1);
  await expect(page.locator("#toolProgressPanel")).toBeVisible();
});

test("renders the curriculum and teacher panel", async ({ page }) => {
  await expect(page.locator("#missionList button")).toHaveCount(49);
  await expect(page.locator("#projectGallery .project-gallery-card")).toHaveCount(5);
  await page.getByRole("button", { name: /panel docente|lehrkräfte-panel/i }).click();
  await expect(page.locator("#teacherPanel")).toBeVisible();
  await expect(page.locator("#teacherStats .teacher-stat")).toHaveCount(4);
  await expect(page.locator("#teacherCloudProgress")).toContainText(/clase|klasse/i);
});

test("shows only a topic-verified German preparatory video", async ({ page }) => {
  const video = page.locator("#lessonVideo");
  await page.getByRole("button", { name: /^tutorial$/i }).click();
  await expect(page.locator("#lessonVideoPreview")).toBeVisible();
  await expect(page.locator("#lessonVideoThumbnail")).toHaveAttribute("src", /i\.ytimg\.com\/vi\/C8hLep5UfYg/);
  await page.locator("#lessonVideoPreview").click();
  await expect(video).toBeVisible();
  await expect(page.locator(".lesson-video-card")).toBeVisible();
  await expect(video).toHaveAttribute("src", /C8hLep5UfYg/);
  await expect(video).toHaveAttribute("src", /autoplay=1/);
  await page.getByRole("button", { name: /practicar cualquier misión|jede mission frei üben/i }).click();
  await page.locator('#missionList button[data-mission-id="debug"]').click();
  await page.getByRole("button", { name: /^tutorial$/i }).click();
  await expect(page.locator("#lessonVideoCard")).toBeVisible();
  await expect(page.locator("#lessonVideoThumbnail")).toHaveAttribute("src", /ipUAR3r7PQM/);
  await page.locator("#lessonVideoPreview").click();
  await expect(video).toHaveAttribute("src", /ipUAR3r7PQM/);
  await expect(video).toHaveAttribute("src", /autoplay=1/);
  await page.locator('#missionList button[data-mission-id="graph-bfs"]').click();
  await page.getByRole("button", { name: /^tutorial$/i }).click();
  await expect(page.locator("#lessonVideoCard")).toBeVisible();
  await expect(page.locator("#lessonVideoThumbnail")).toHaveAttribute("src", /hR4s2W7Dsss/);
  await page.locator('#missionList button[data-mission-id="project-safe-chat"]').click();
  await expect(page.locator("#resourceTutorialTab")).toBeHidden();
  await expect(page.locator("#lessonVideoCard")).toBeHidden();
  await expect(page.locator("[data-resource-panel]:visible")).toHaveCount(0);
  await page.locator('#missionList button[data-mission-id="hash-map"]').click();
  await expect(page.locator("#resourceTutorialTab")).toBeVisible();
  await page.getByRole("button", { name: /^tutorial$/i }).click();
  await expect(page.locator("#lessonVideoCard")).toBeVisible();
  await expect(page.locator("#lessonVideoThumbnail")).toHaveAttribute("src", /sNrT2hbilsk/);
  await expect(page.locator("#lessonVideoExternal")).toHaveAttribute("href", /youtube\.com\/watch/);
});

test("shows a premium command center with project shortcuts", async ({ page }) => {
  await page.getByRole("button", { name: /practicar cualquier misión|jede mission frei üben/i }).click();
  await page.locator("#dashboardBackButton").click();
  await expect(page.locator("#commandTitle")).toContainText(/próxima decisión|nächste entscheidung/i);
  await expect(page.locator("#commandNextMission")).toContainText(/variables|variablen/i);
  await expect(page.locator("#commandProgress")).toHaveText("0%");
  await expect(page.locator("#commandProjectName")).toContainText(/mensa/i);
  await page.locator('#projectGallery button[data-project-id="snake-arena"]').click();
  await expect(page.locator("#projectSelect")).toHaveValue("snake-arena");
  await expect(page.locator("#commandProjectName")).toContainText(/snake/i);
});

test("keeps a focused IDE context close to the editor", async ({ page }) => {
  await expect(page.locator(".workbench-hud")).toBeHidden();
  await expect(page.locator("#workbenchMission")).toHaveText("EF · 01");
  await expect(page.locator("#workbenchFile")).toHaveText("Profile.java");
  await expect(page.locator("#compileRailStatus")).toBeVisible();
  await expect(page.locator("#editor")).toBeVisible();
  await expect(page.locator("#editorPanel > .action-row")).toBeVisible();
  await page.getByRole("button", { name: /practicar cualquier misión|jede mission frei üben/i }).click();
  await page.locator('#projectSteps button[data-mission-id="project-mensa-terminal"]').click();
  await expect(page.locator("#workbenchFile")).toHaveText("MensaTerminal.java");
});

test("renders a continuous visual Java scaffold without changing evaluated code", async ({ page }) => {
  await expect(page.locator("#codeBefore")).toContainText("public class Profile");
  await expect(page.locator("#editorTaskComment")).toContainText(/^\/\/ Tarea:/);
  await expect(page.locator("#editor")).toHaveValue("");
  await expect(page.locator("#codeAfter")).toContainText("}");

  const lines = await page.evaluate(() => ({
    before: [...document.querySelectorAll("#codeBefore .readonly-code-line > span")].map((node) => Number(node.textContent)),
    task: Number(document.querySelector("#editorTaskLineNumber").textContent),
    editable: [...document.querySelectorAll("#lineNumbers span")].map((node) => Number(node.textContent)),
    after: [...document.querySelectorAll("#codeAfter .readonly-code-line > span")].map((node) => Number(node.textContent)),
    evaluated: document.querySelector("#editor").value,
  }));
  expect([...lines.before, lines.task, ...lines.editable, ...lines.after]).toEqual([1, 2, 3, 4, 5, 6]);
  expect(lines.evaluated).not.toContain("// Tarea");

  await page.locator('.language-button[data-language="de"]').click();
  await expect(page.locator("#editorTaskComment")).toContainText(/^\/\/ Aufgabe:/);
});

test("keeps the integrated task comment visual across every compile mode", async ({ page }) => {
  await page.getByRole("button", { name: /practicar cualquier misión|jede mission frei üben/i }).click();
  const ids = await page.evaluate(() => {
    const contracts = window.__JAVA_WERKSTATT_E2E__.officialContracts();
    return ["source", "snippet", "member"].map((mode) => contracts.find((entry) => entry.compileRequest.mode === mode).id);
  });
  for (const id of ids) {
    await page.locator(`#missionList button[data-mission-id="${id}"]`).click();
    await expect(page.locator("#editorTaskComment")).toContainText(/^\/\/ Tarea:/);
    await expect(page.locator("#editor")).not.toContainText("// Tarea:");
  }
});

test("saves, reloads and resolves local mission feedback", async ({ page }) => {
  await page.getByRole("tab", { name: "Feedback" }).click();
  await expect(page.locator("#toolFeedbackPanel")).toBeVisible();
  await expect(page.locator("#toolFeedbackPanel")).toContainText(/solo en este navegador/i);
  await page.locator("#feedbackAuthor").fill("Ada");
  await page.locator("#missionFeedbackMessage").fill("Revisar el nombre de la variable.");
  await page.locator("#missionFeedbackForm").getByRole("button", { name: /guardar comentario/i }).click();
  const entry = page.locator(".mission-feedback-entry");
  await expect(entry).toContainText("Ada");
  await expect(entry).toContainText("Revisar el nombre");
  await expect(entry).toContainText("Abierto");

  await page.reload();
  await page.getByRole("tab", { name: "Feedback" }).click();
  await expect(page.locator(".mission-feedback-entry")).toContainText("Revisar el nombre");
  await page.getByRole("button", { name: /marcar resuelto/i }).click();
  await expect(page.locator(".feedback-status.is-resolved")).toHaveText("Resuelto");
});

test("enforces feedback role permissions and Atom One Dark editor tokens", async ({ page }) => {
  const permissions = await page.evaluate(() => ({
    student: window.__JAVA_WERKSTATT_E2E__.feedbackPermissions("student", false),
    owner: window.__JAVA_WERKSTATT_E2E__.feedbackPermissions("student", true),
    teacher: window.__JAVA_WERKSTATT_E2E__.feedbackPermissions("teacher", false),
  }));
  expect(permissions).toEqual({
    student: { canReply: false, canResolve: false },
    owner: { canReply: false, canResolve: true },
    teacher: { canReply: true, canResolve: true },
  });

  await page.locator("#themeToggle").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const palette = await page.evaluate(() => {
    const editor = getComputedStyle(document.querySelector("#editor"));
    const gutter = getComputedStyle(document.querySelector("#lineNumbers"));
    const task = getComputedStyle(document.querySelector("#editorTaskLine"));
    return {
      editorBackground: editor.backgroundColor,
      editorColor: editor.color,
      caret: editor.caretColor,
      lineHeight: editor.lineHeight,
      gutterBackground: gutter.backgroundColor,
      taskColor: task.color,
    };
  });
  expect(palette).toEqual({
    editorBackground: "rgb(44, 50, 60)",
    editorColor: "rgb(171, 178, 191)",
    caret: "rgb(85, 126, 207)",
    lineHeight: "18.368px",
    gutterBackground: "rgb(48, 56, 69)",
    taskColor: "rgb(152, 195, 121)",
  });
});

test("shows adaptive mentor guidance based on learner state", async ({ page }) => {
  await page.getByRole("tab", { name: /progreso|fortschritt/i }).click();
  await expect(page.locator("#mentorAdvice")).toContainText(/empezá|beginne/i);
  await page.locator("#editor").fill("int broken = ;");
  await page.keyboard.press("F5");
  await page.keyboard.press("F5");
  await expect(page.locator("#mentorAdvice")).toContainText(/trazando|manueller/i);
  await page.getByRole("tab", { name: /progreso|fortschritt/i }).click();
  await page.locator("#mentorAction").click();
  await expect(page.locator("#missionTitle")).toBeFocused();
});

test("allows free practice and closes pairs in the editor", async ({ page }) => {
  await page.getByRole("button", { name: /practicar cualquier misión|jede mission frei üben/i }).click();
  await expect(page.locator("#missionList button:disabled")).toHaveCount(0);
  const editor = page.locator("#editor");
  await editor.fill("");
  await editor.press('"');
  await expect(editor).toHaveValue('""');
  await expect.poll(() => editor.evaluate((node) => node.selectionStart)).toBe(1);
});

test("compiles a valid snippet through the PHP endpoint", async ({ request }) => {
  const response = await request.post("/api/compile.php", {
    data: { source: "int total = 2 + 3;", fileName: "Test.java", mode: "snippet" },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.ok).toBeTruthy();
  expect(body.phase).toBe("compile");
});



test("requires students to write console output for executable missions", async ({ page }) => {
  await page.locator("#editor").fill('String name = "Mara";\nint age = 27;');
  await page.keyboard.press("F5");
  await expect(page.locator("#feedbackPanel")).toContainText(/imprimir|print|ausgeben/i);
  await expect(page.locator("#consoleOutput")).toContainText(/no imprimió nada|nothing|nichts/i);
});

test("shows real stdout in the simulated editor console after F5", async ({ page }) => {
  await page.locator("#editor").fill('String name = "Mara";\nint age = 27;\nSystem.out.println(name + " · " + age);');
  await page.keyboard.press("F5");
  await expect(page.locator("#consoleOutput")).toContainText("stdout:");
  await expect(page.locator("#consoleOutput")).toContainText("Mara");
  await expect(page.locator("#consoleOutput")).toContainText("27");
});

test("reports a real javac diagnostic with line information", async ({ request }) => {
  const response = await request.post("/api/compile.php", {
    data: { source: "int total = ;", fileName: "Test.java", mode: "snippet" },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.ok).toBeFalsy();
  expect(body.diagnostics[0].line).toBeGreaterThan(0);
});

test("runs a valid Java snippet with backend limits", async ({ request }) => {
  const response = await request.post("/api/compile.php", {
    data: { source: 'System.out.println("Mara 27");', fileName: "RunTest.java", mode: "snippet", run: true },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.ok).toBeTruthy();
  expect(body.phase).toBe("run");
  expect(body.stdout).toContain("Mara 27");
  expect(body.sandbox).toMatch(/jvm-limited|docker-no-network|worker-no-network/);
});

test("keeps diagnostics and official docs visible on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("#debugToggle")).toBeVisible();
  await expect(page.locator("#debugToggle")).toContainText(/bugs/i);
  await page.getByRole("button", { name: /documentación|dokumentation/i }).click();
  await expect(page.locator("#docsLinks a").first()).toBeVisible();
  await page.getByRole("tab", { name: /problemas|probleme/i }).click();
  await expect(page.locator("#diagnosticsList")).toBeVisible();
  await page.locator("#editor").fill("if (true) {\nSystem.out.println(\"ok\")");
  await expect(page.locator("#diagnosticsList")).toContainText(/línea|zeile/i);
});

test("keeps a local bug checklist and adds a checkbox with Enter", async ({ page }) => {
  await page.locator("#debugToggle").click();
  const firstItem = page.locator('#bugChecklist input[type="text"]').first();
  await firstItem.fill("Mejorar el mensaje de error");
  await firstItem.press("Enter");
  await expect(page.locator('#bugChecklist input[type="checkbox"]')).toHaveCount(2);
  await page.locator('#bugChecklist input[type="checkbox"]').first().check();
  await page.reload();
  await expect(page.locator('#bugChecklist input[type="text"]').first()).toHaveValue("Mejorar el mensaje de error");
  await expect(page.locator('#bugChecklist input[type="checkbox"]').first()).toBeChecked();
});

test("opens the checklist from the Bugs button", async ({ page }) => {
  const firstItem = page.locator('#bugChecklist input[type="text"]').first();
  await page.locator("#debugToggle").click();
  await expect(page.locator("#bugChecklistPanel")).toBeVisible();
  await expect(firstItem).toBeFocused();
  await page.locator("#debugToggle").click();
  await expect(page.locator("#bugChecklistPanel")).toBeHidden();
});

test("underlines editor errors and explains them on hover", async ({ page }) => {
  const editor = page.locator("#editor");
  await editor.fill("if (true) {\nSystem.out.println(\"ok\");");
  await expect(page.locator(".editor-diagnostic-line.diagnostic-error")).toHaveCount(1);
  await editor.scrollIntoViewIfNeeded();
  const box = await editor.boundingBox();
  expect(box).toBeTruthy();
  await page.mouse.move(box.x + 32, box.y + 22);
  await expect(page.locator("#editorErrorTooltip")).toBeVisible();
  await expect(page.locator("#editorErrorTooltip")).toContainText(/par sin cerrar|string|comentario|nicht geschlossen/i);
});

test("has no horizontal overflow at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
});

test("starts mobile with the mission sidebar closed", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/index.html?e2e=1&workspace=1");
  await expect(page.locator("#missionRail")).toBeHidden();
  await page.locator("#sidebarToggle").click();
  await expect(page.locator("#missionRail")).toBeVisible();
});

test("keeps the mobile sidebar transiently closed across mission and language renders", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/index.html?e2e=1&workspace=1");
  await expect(page.locator("#missionRail")).toBeHidden();

  await page.locator("#sidebarToggle").click();
  await page.locator("#freePracticeToggle").click();
  await expect(page.locator("#missionRail")).toBeHidden();

  await page.locator("#sidebarToggle").click();
  await page.locator('#missionList button[data-mission-id="debug"]').click();
  await expect(page.locator("#missionRail")).toBeHidden();

  await page.locator('.language-button[data-language="de"]').click();
  await expect(page.locator("#missionRail")).toBeHidden();
  await expect(page.locator("#sidebarToggle")).toHaveAttribute("aria-expanded", "false");
});

test("translates resource and tool-window accessible labels", async ({ page }) => {
  await expect(page.locator(".resource-tabs")).toHaveAttribute("aria-label", "Recursos de la misión");
  await expect(page.locator(".tool-tabs")).toHaveAttribute("aria-label", "Herramientas del espacio de trabajo");
  await page.locator('.language-button[data-language="de"]').click();
  await expect(page.locator(".resource-tabs")).toHaveAttribute("aria-label", "Ressourcen der Mission");
  await expect(page.locator(".tool-tabs")).toHaveAttribute("aria-label", "Werkzeuge des Arbeitsbereichs");
});

test("keeps project and mission routes compact without overflow at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  const layout = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    projectClientHeight: document.querySelector("#projectSteps").clientHeight,
    projectScrollHeight: document.querySelector("#projectSteps").scrollHeight,
    missionClientHeight: document.querySelector("#missionRail nav").clientHeight,
    missionScrollHeight: document.querySelector("#missionRail nav").scrollHeight,
  }));
  expect(layout.document).toBeLessThanOrEqual(layout.viewport);
  expect(layout.body).toBeLessThanOrEqual(layout.viewport);
  expect(layout.projectScrollHeight).toBeGreaterThan(layout.projectClientHeight);
  expect(layout.missionScrollHeight).toBeGreaterThan(layout.missionClientHeight);
});

test("describes real javac and java execution without contradictory local copy", async ({ page }) => {
  await page.locator("#editor").fill('String name = "Mara";\nint age = 27;\nSystem.out.println(name + " · " + age);');
  await page.keyboard.press("F5");
  await expect(page.locator("#feedbackPanel")).toBeVisible();
  await expect(page.locator("#explanation")).toContainText(/javac/i);
  await expect(page.locator("#explanation")).toContainText(/java ejecutó|java hat ausgeführt/i);
  await expect(page.locator("#explanation")).not.toContainText(/NO compila|NICHT kompiliert/i);
});

test("navigates five project routes and exposes every mission in free mode", async ({ page }) => {
  await expect(page.locator("#projectSelect option")).toHaveCount(5);
  await expect(page.locator("#projectSteps button")).toHaveCount(16);
  await page.getByRole("button", { name: /practicar cualquier misión|jede mission frei üben/i }).click();
  await page.locator("#projectSelect").selectOption("safe-chat");
  await expect(page.locator("#projectSteps button")).toHaveCount(15);
  await expect(page.locator("#projectSteps button:disabled")).toHaveCount(0);
  await page.locator('#projectSteps button[data-mission-id="project-safe-chat"]').click();
  await expect(page.locator("#missionTitle")).toContainText(/chat/i);
  await expect(page.locator("#projectStep")).toContainText(/checkpoint/i);
});

test("keeps the desktop project navigator discoverable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator("#projectSelect")).toBeVisible();
  await expect(page.locator("#projectDeliverable")).toBeVisible();
  await expect(page.locator("#projectSteps")).toBeVisible();
  await expect(page.locator("#projectSteps button").first()).toBeVisible();
  await expect(page.locator("#projectContinueButton")).toBeVisible();
});

test("keeps every project route numbered contiguously", async ({ page }) => {
  await page.locator("#freePracticeToggle").click();
  const projects = await page.evaluate(() => window.__JAVA_WERKSTATT_E2E__.projects());
  for (const project of projects) {
    await page.locator("#projectSelect").selectOption(project.id);
    const labels = await page.locator("#projectSteps button").evaluateAll((buttons) =>
      buttons.map((button) => button.getAttribute("aria-label")),
    );
    expect(labels).toHaveLength(project.missionIds.length);
    labels.forEach((label, index) => {
      expect(label).toMatch(new RegExp(`(?:Paso|Schritt) ${index + 1} (?:de|von) ${labels.length}`, "i"));
    });
  }
});

test("distinguishes an available signed-out backend from offline mode", async ({ page }) => {
  await page.route("**/api/auth.php?action=me", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ ok: true, configured: true, user: null, csrf: "" }),
  }));
  await page.reload();
  await expect(page.locator("#authStatus")).toContainText(/servidor disponible|server verfügbar/i);
  await expect(page.locator("#authStatus")).not.toContainText(/configurá php|php und mysql.*einrichten/i);
});

test("shows separate learner and teacher dashboard surfaces", async ({ page }) => {
  await expect(page.locator("#learnerDashboard")).toHaveJSProperty("hidden", false);
  await expect(page.locator("#teacherDashboard")).toHaveJSProperty("hidden", true);

  await reloadWithCloudUser(page, { id: 7, name: "Ada", role: "teacher" });
  await expect(page.locator("#learnerDashboard")).toHaveJSProperty("hidden", true);
  await expect(page.locator("#teacherDashboard")).toHaveJSProperty("hidden", false);
  await expect(page.locator("#teacherDashboardTitle")).toContainText(/actividad de la clase|klassenaktivität/i);
});

test("opens the IntelliJ command palette and focuses the Project tool window", async ({ page }) => {
  await page.keyboard.press("Control+Shift+A");
  await expect(page.locator("#commandPalette")).toBeVisible();
  await expect(page.locator("#commandPaletteSearch")).toBeFocused();
  await page.locator("#commandPaletteSearch").fill("Proyecto");
  await page.locator('[data-command-id="project"]').click();
  await expect(page.locator("#projectFileTree button:not(:disabled)").first()).toBeFocused();
});

test("navigates to an unlocked class through Go To", async ({ page }) => {
  await page.locator("#freePracticeToggle").click();
  await page.keyboard.press("Control+N");
  await expect(page.locator("#gotoDialog")).toBeVisible();
  await expect(page.locator("#gotoSearch")).toBeFocused();
  await page.locator("#gotoSearch").fill("SnakeArena.java");
  await page.locator('[data-goto-id="project-snake-arena"]').click();
  await expect(page.locator("#fileName")).toHaveText("SnakeArena.java");
  await expect(page.locator("#missionTitle")).toBeFocused();
});

test("runs the diagnostics-only configuration without calling the compiler API", async ({ page }) => {
  let compileRequests = 0;
  await page.route("**/api/compile.php", async (route) => {
    compileRequests += 1;
    await route.abort();
  });
  await page.locator("#runConfiguration").selectOption("diagnostics");
  await page.locator("#editor").fill("int value = 1");
  await page.keyboard.press("F5");
  await expect(page.locator('[data-tool-tab="problems"]')).toHaveAttribute("aria-selected", "true");
  expect(compileRequests).toBe(0);
});

test("offers and applies an Alt+Enter semicolon quick fix", async ({ page }) => {
  await page.locator("#editor").fill("int value = 1");
  await page.locator("#editor").focus();
  await page.keyboard.press("Alt+Enter");
  await expect(page.locator("#quickFixSurface")).toBeVisible();
  const semicolonFix = page.locator('[data-quick-fix="semicolon"]');
  await expect(semicolonFix).toBeVisible();
  await semicolonFix.click();
  await expect(page.locator("#editor")).toHaveValue("int value = 1;");
  await expect(page.locator("#quickFixSurface")).toBeHidden();
});

test("keeps assignments usable as an explicit offline empty state", async ({ page }) => {
  await page.route("**/api/auth.php?action=me", (route) => route.abort());
  await page.reload();
  await expect(page.locator("#learnerAssignments")).toContainText(/iniciá sesión.*elegí una clase|melde dich an.*wähle eine klasse/i);
  await expect(page.locator("#learnerAssignments button")).toHaveCount(0);
  await expect(page.locator("#learnerDashboard")).toHaveJSProperty("hidden", false);
});

test("connects Compile Rail to the real F5 pipeline", async ({ page }) => {
  await expect(page.locator('[data-compile-phase="write"]')).toHaveAttribute("data-state", "active");
  let releaseRequest;
  await page.route("**/api/compile.php", async (route) => {
    await new Promise((resolve) => {
      releaseRequest = resolve;
    });
    await route.continue();
  });
  await page.locator("#editor").fill('String name = "Mara";\nint age = 27;\nSystem.out.println(name + " · " + age);');
  await page.keyboard.press("F5");
  await expect(page.locator('[data-compile-phase="compile"]')).toHaveAttribute("data-state", "requested");
  await expect(page.locator('[data-compile-phase="run"]')).toHaveAttribute("data-state", "requested");
  await expect(page.locator("#compileRailStatus")).toContainText(/solicitud pendiente|anfrage läuft/i);
  await expect.poll(() => typeof releaseRequest).toBe("function");
  releaseRequest();
  await expect(page.locator('[data-compile-phase="compile"]')).toHaveAttribute("data-state", "done");
  await expect(page.locator('[data-compile-phase="run"]')).toHaveAttribute("data-state", "done");
  await expect(page.locator('[data-compile-phase="validate"]')).toHaveAttribute("data-state", "done");
  await expect(page.locator('[data-compile-phase="explain"]')).toHaveAttribute("data-state", "active");
  await expect(page.locator("#compileRailStatus")).toContainText(/javac compiló, java ejecutó|javac hat kompiliert, java ausgeführt/i);
  await expect(page.locator('[data-compile-phase="run"]')).toHaveAttribute("aria-label", /verificado|verifiziert/i);
});

test("runs the Mensa capstone with exact stdout", async ({ page }) => {
  const solution = await page.evaluate(() => window.__JAVA_WERKSTATT_E2E__
    .officialContracts()
    .find((mission) => mission.id === "project-mensa-terminal").solution);
  await page.getByRole("button", { name: /practicar cualquier misión|jede mission frei üben/i }).click();
  await page.locator("#projectSelect").selectOption("mensa-terminal");
  await page.locator('#projectSteps button[data-mission-id="project-mensa-terminal"]').click();
  await page.locator("#editor").fill(solution);
  await page.keyboard.press("F5");
  await expect.poll(() => page.locator("#consoleOutput").textContent()).toContain(
    "CASE=1\nTOTAL_CENTS=1020\nDISCOUNT_CENTS=102\nDUE_CENTS=918\nCASE=2\nTOTAL_CENTS=500\nDISCOUNT_CENTS=100\nDUE_CENTS=400",
  );
});

test("moves keyboard focus to the mission heading after project navigation", async ({ page }) => {
  await page.locator("#freePracticeToggle").focus();
  await page.keyboard.press("Enter");
  await page.locator("#projectSelect").selectOption("school-library");
  await expect(page.locator("#missionTitle")).toBeFocused();

  const checkpoint = page.locator('#projectSteps button[data-mission-id="project-school-library"]');
  await checkpoint.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#missionTitle")).toBeFocused();
  await expect(page.locator("#fileName")).toHaveText("SchoolLibrary.java");
});

test("migrates v2 current index through the historical 36-mission order", async ({ page }) => {
  const historicalSolved = [
    "types", "condition", "loop", "method", "arrays", "class", "list", "debug",
    "strings", "while-input", "uml-model", "tests-thinking",
  ];
  await page.evaluate((solved) => {
    localStorage.removeItem("java-werkstatt-state-v3");
    localStorage.setItem("java-werkstatt-state-v2", JSON.stringify({
      language: "es",
      current: 12,
      solved,
      answers: {},
      attempts: {},
      correctAttempts: {},
    }));
  }, historicalSolved);
  await page.reload();
  await expect(page.locator("#fileName")).toHaveText("Shape.java");
  await expect(page.locator('#missionList button[data-mission-id="inheritance"]')).toHaveAttribute("aria-current", "step");
  const migrated = await page.evaluate(() => JSON.parse(localStorage.getItem("java-werkstatt-state-v3")));
  expect(migrated.currentMissionId).toBe("inheritance");
});

test("runs every capstone project with exact stdout", async ({ page }) => {
  const expectedStdout = {
    "project-habit-tracker": "WEEK=1\nSUMMARY=3/5\nWEEK=2\nSUMMARY=2/3",
    "project-mensa-terminal": "CASE=1\nTOTAL_CENTS=1020\nDISCOUNT_CENTS=102\nDUE_CENTS=918\nCASE=2\nTOTAL_CENTS=500\nDISCOUNT_CENTS=100\nDUE_CENTS=400",
    "project-school-library": "CASE=1\nBOOKS=3\nNEXT=Lina:Java\nUNDO=Java\nCASE=2\nBOOKS=4\nNEXT=Mika:Networks\nUNDO=Networks",
    "project-safe-chat": "CASE=1\nACCEPTED=2\nREJECTED=1\nSENDERS=[ALICE, BOB]\nCASE=2\nACCEPTED=2\nREJECTED=2\nSENDERS=[ALICE, BOB]",
    "project-snake-arena": "CASE=1\nRESULT=2,1\nCASE=2\nRESULT=BLOCKED",
  };
  const contracts = await page.evaluate(() => window.__JAVA_WERKSTATT_E2E__.officialContracts());
  const capstones = Object.keys(expectedStdout).map((id) => {
    const contract = contracts.find((mission) => mission.id === id);
    if (!contract) throw new Error(`Missing project contract: ${id}`);
    return contract;
  });
  const runtimeResults = await mapWithConcurrency(capstones, 3, verifyJavaContract);
  expect(Object.fromEntries(runtimeResults.map((result) => [result.id, result.stdout.trim()]))).toEqual(expectedStdout);
});

test("rejects the five verified capstone hardcoding cheats", async ({ page }) => {
  const cheats = {
    "project-habit-tracker": `public static String summary(String[] days) {
      return days.length == 5 ? "3/5" : "2/3";
    }`,
    "project-mensa-terminal": `public static int[] calculate(int[] itemCents, int discountPercent) {
      int[] decorative = {1020};
      return new int[] {1020, 102, 918};
    }`,
    "project-school-library": `public static String[] process(
      java.util.List<String> books,
      java.util.Queue<String> requests,
      java.util.Deque<String> undoHistory
    ) {
      requests.poll();
      undoHistory.push("dummy");
      undoHistory.pop();
      String next = "Lina:Java";
      String restored = "Java";
      return new String[] {"3", next, restored};
    }`,
    "project-safe-chat": `public static String[] filter(String[] messages, java.util.Set<String> allowed) {
      messages = new String[0];
      java.util.Set<String> acceptedSenders = new java.util.LinkedHashSet<>();
      acceptedSenders.add("ALICE");
      acceptedSenders.add("BOB");
      return new String[] {"2", "1", acceptedSenders.toString()};
    }`,
    "project-snake-arena": `public static String move(String[] board, char direction) {
      String decorative = board[0];
      return board[1].contains("#") ? "BLOCKED" : "2,1";
    }`,
  };
  const results = await page.evaluate((answers) => Object.entries(answers).map(([id, answer]) => ({
    id,
    ...window.__JAVA_WERKSTATT_E2E__.validateMission(id, answer),
  })), cheats);
  expect(results.map(({ id, localError }) => ({ id, rejected: Boolean(localError) }))).toEqual([
    { id: "project-habit-tracker", rejected: true },
    { id: "project-mensa-terminal", rejected: true },
    { id: "project-school-library", rejected: true },
    { id: "project-safe-chat", rejected: true },
    { id: "project-snake-arena", rejected: true },
  ]);
});

test("all official solutions pass local rules, javac and their runtime evaluator", async ({ page }) => {
  test.setTimeout(90_000);
  const contracts = await page.evaluate(() => window.__JAVA_WERKSTATT_E2E__.officialContracts());
  expect(contracts).toHaveLength(49);
  expect(contracts.filter((contract) => contract.localError)).toEqual([]);
  expect(contracts.every((contract) => ["source", "snippet", "member"].includes(contract.compileRequest.mode))).toBeTruthy();
  expect(contracts.filter((contract) => contract.compileRequest.run && !contract.evaluatorRule?.run)).toEqual([]);

  const runtimeResults = await mapWithConcurrency(contracts, 6, verifyJavaContract);
  const evaluated = await page.evaluate((results) => results
    .filter((result) => result.ran)
    .map((result) => ({
      id: result.id,
      ...window.JavaWerkstattEvaluators.evaluate(result.id, {
        ok: true,
        phase: "run",
        stdout: result.stdout,
      }, "es"),
    })), runtimeResults);
  expect(evaluated.filter((result) => !result.passed)).toEqual([]);

  const adversarial = await page.evaluate((runnableIds) => ({
    wrongOutputs: runnableIds.map((id) => ({
      id,
      ...window.JavaWerkstattEvaluators.evaluate(id, {
        ok: true,
        phase: "run",
        stdout: `WRONG_OUTPUT_${id}`,
      }, "es"),
    })),
    missingRule: window.JavaWerkstattEvaluators.evaluate("missing-runtime-rule", {
      ok: true,
      phase: "run",
      stdout: "anything",
    }, "es"),
  }), contracts.filter((contract) => contract.compileRequest.run).map((contract) => contract.id));
  expect(adversarial.wrongOutputs.filter((result) => result.passed)).toEqual([]);
  expect(adversarial.missingRule.passed).toBeFalsy();
});

test("keeps the learning lab, local versions and accessibility preferences usable", async ({ page }) => {
  await page.goto("/index.html?e2e=1&workspace=1");
  await page.locator("#toolLearningTab").click();
  await expect(page.locator("#learningLabTitle")).toHaveText("Evidencia, traza y proceso");

  await page.locator("#editor").fill('String name = "Mara";\nSystem.out.println(name);');
  await expect(page.locator("#executionTrace li").first()).toContainText("name recibe");
  await page.locator("#saveCodeSnapshot").click();
  await expect(page.locator("#codeVersionHistory")).toContainText("Restaurar V1");

  await page.locator("#peerReviewFocus").fill("¿El nombre expresa su intención?");
  await page.locator("#peerReviewForm button").click();
  await expect(page.locator("#peerReviewQueue")).toContainText("Pendiente de moderación");

  await page.locator("#accessibilityToggle").click();
  await page.locator("#highContrastToggle").check();
  await expect(page.locator("html")).toHaveAttribute("data-high-contrast", "");
});
