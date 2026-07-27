import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html?e2e=1");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("renders the curriculum and teacher panel", async ({ page }) => {
  await expect(page.locator("#missionList button")).toHaveCount(36);
  await page.getByRole("button", { name: /panel docente|lehrkräfte-panel/i }).click();
  await expect(page.locator("#teacherPanel")).toBeVisible();
  await expect(page.locator("#teacherStats .teacher-stat")).toHaveCount(4);
  await expect(page.locator("#teacherCloudProgress")).toContainText(/clase|klasse/i);
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
  await expect(page.locator("#docsLinks a").first()).toBeVisible();
  await expect(page.locator("#diagnosticsList")).toBeVisible();
  await page.locator("#editor").fill("if (true) {\nSystem.out.println(\"ok\")");
  await expect(page.locator("#diagnosticsList")).toContainText(/línea|zeile/i);
});
