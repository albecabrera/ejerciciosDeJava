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
  await page.goto("/index.html?e2e=1");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
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
  await expect(page.locator("#lessonVideoPreview")).toBeVisible();
  await expect(page.locator("#lessonVideoThumbnail")).toHaveAttribute("src", /i\.ytimg\.com\/vi\/C8hLep5UfYg/);
  await page.locator("#lessonVideoPreview").click();
  await expect(video).toBeVisible();
  await expect(page.locator(".lesson-video-card")).toBeVisible();
  await expect(video).toHaveAttribute("src", /C8hLep5UfYg/);
  await page.getByRole("button", { name: /practicar cualquier misión|jede mission frei üben/i }).click();
  await page.locator('#missionList button[data-mission-id="debug"]').click();
  await expect(page.locator("#lessonVideoCard")).toBeVisible();
  await expect(page.locator("#lessonVideoThumbnail")).toHaveAttribute("src", /ipUAR3r7PQM/);
  await page.locator("#lessonVideoPreview").click();
  await expect(video).toHaveAttribute("src", /ipUAR3r7PQM/);
  await page.locator('#missionList button[data-mission-id="graph-bfs"]').click();
  await expect(page.locator("#lessonVideoCard")).toBeVisible();
  await expect(page.locator("#lessonVideoThumbnail")).toHaveAttribute("src", /hR4s2W7Dsss/);
  await page.locator('#missionList button[data-mission-id="project-safe-chat"]').click();
  await expect(page.locator("#lessonVideoCard")).toBeHidden();
  await page.locator('#missionList button[data-mission-id="hash-map"]').click();
  await expect(page.locator("#lessonVideoCard")).toBeVisible();
  await expect(page.locator("#lessonVideoThumbnail")).toHaveAttribute("src", /sNrT2hbilsk/);
  await expect(page.locator("#lessonVideoExternal")).toHaveAttribute("href", /youtube\.com\/watch/);
});

test("shows a premium command center with project shortcuts", async ({ page }) => {
  await expect(page.locator("#commandTitle")).toContainText(/próxima decisión|nächste entscheidung/i);
  await expect(page.locator("#commandNextMission")).toContainText(/variables|variablen/i);
  await expect(page.locator("#commandProgress")).toHaveText("0%");
  await expect(page.locator("#commandProjectName")).toContainText(/mensa/i);
  await page.locator('#projectGallery button[data-project-id="snake-arena"]').click();
  await expect(page.locator("#projectSelect")).toHaveValue("snake-arena");
  await expect(page.locator("#commandProjectName")).toContainText(/snake/i);
});

test("keeps the IDE workbench context close to the editor", async ({ page }) => {
  await expect(page.locator(".workbench-hud")).toBeVisible();
  await expect(page.locator("#workbenchMission")).toHaveText("EF · 01");
  await expect(page.locator("#workbenchFile")).toHaveText("Profile.java");
  await expect(page.locator("#editorPanel > .action-row")).toBeVisible();
  await page.getByRole("button", { name: /practicar cualquier misión|jede mission frei üben/i }).click();
  await page.locator('#projectSteps button[data-mission-id="project-mensa-terminal"]').click();
  await expect(page.locator("#workbenchFile")).toHaveText("MensaTerminal.java");
});

test("shows adaptive mentor guidance based on learner state", async ({ page }) => {
  await expect(page.locator("#mentorAdvice")).toContainText(/empezá|beginne/i);
  await page.locator("#editor").fill("int broken = ;");
  await page.keyboard.press("F5");
  await page.keyboard.press("F5");
  await expect(page.locator("#mentorAdvice")).toContainText(/trazando|manueller/i);
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
  await expect(page.locator("#docsLinks a").first()).toBeVisible();
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
