import { expect, test } from "@playwright/test";

async function editorValue(page) {
  return page.evaluate(() => window.pythonIdeEditor.getValue());
}
async function focusEditorEnd(page) {
  await page.evaluate(() => window.pythonIdeEditor.focusEnd());
}
// Java-style dashboard ↔ workspace split: el editor y sus herramientas viven
// dentro de #pyWorkspace, oculto hasta hacer clic en "Mission öffnen".
async function openWorkspace(page) {
  await page.locator("#pyOpenMission").click();
  await expect(page.locator("#pyWorkspace")).toBeVisible();
}

async function reloadWithCloudUser(page, { user, feedback = [], notifications = [], unread = 0 } = {}) {
  let read = false;
  await page.route("**/api/*.php*", async (route) => {
    const url = new URL(route.request().url());
    const endpoint = url.pathname.split("/").pop();
    const action = url.searchParams.get("action");
    if (endpoint === "notifications.php" && action === "read") { read = true; await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, updated: notifications.length }) }); return; }
    const payloads = {
      "auth.php": { ok: true, configured: true, user, csrf: "e2e-csrf" },
      "progress.php": { ok: true, progress: [] },
      "classes.php": { ok: true, classes: [{ id: 1, name: "9A" }] },
      "assignments.php": { ok: true, assignments: [] },
      "notifications.php": { ok: true, notifications: read ? notifications.map((item) => ({ ...item, read_at: item.read_at || "2026-01-10T10:05:00Z" })) : notifications, unread: read ? 0 : unread },
      "feedback.php": { ok: true, feedback },
    };
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(payloads[endpoint] || { ok: true }) });
  });
  await page.reload();
}

test.describe("Python Studio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/python.html");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("permite resolver, conserva el feedback y registra progreso", async ({ page }) => {
    await openWorkspace(page);
    await expect.poll(() => editorValue(page)).toMatch(/# Aufgabe:/);
    await focusEditorEnd(page);
    await page.keyboard.type('print("Ada")');
    await page.locator("#check").click();

    await expect(page.locator("#result")).toBeVisible();
    await expect(page.locator("#result")).toContainText("Struktur erfüllt");
    await expect(page.locator("#console")).toContainText("Ada");
    await expect(page.locator("#progress")).toHaveText("1 / 12");

    await page.reload();
    await expect.poll(() => editorValue(page)).toMatch(/# Aufgabe:[\s\S]*print\("Ada"\)/);
  });

  test("navega entre misiones, muestra ayuda y permite reiniciar sin revelar solución", async ({ page }) => {
    await page.locator("#missions button").nth(1).click();
    await expect.poll(() => editorValue(page)).toMatch(/Punktzahl/);
    await page.locator("#hint").click();
    await expect(page.locator('[data-panel="help"]')).toBeVisible();

    await page.evaluate(() => window.pythonIdeEditor.setValue('name = "Mara"\npunkte = 18\nprint(name, punkte)'));
    await page.locator("#reset").click();
    await expect.poll(() => editorValue(page)).toMatch(/# Aufgabe:[\s\S]*Schreibe deine eigene Python-Lösung darunter\.\n\n$/);
  });

  test("ofrece autocompletado estilo PyCharm sin resolver la misión", async ({ page }) => {
    await openWorkspace(page);
    await focusEditorEnd(page);
    await page.keyboard.type("pri", { delay: 20 });
    const tooltip = page.locator(".cm-tooltip-autocomplete");
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText("print");
    // CodeMirror ignora Tab/Enter durante ~75ms tras abrir el tooltip (protección
    // anti aceptación accidental, ver acceptCompletion en @codemirror/autocomplete).
    await page.waitForTimeout(150);
    await page.keyboard.press("Tab");
    await expect.poll(() => editorValue(page)).toMatch(/print\(\)/);

    await page.evaluate(() => window.pythonIdeEditor.setValue(""));
    await focusEditorEnd(page);
    await page.keyboard.type("for", { delay: 20 });
    await expect(tooltip).toBeVisible();
    await page.waitForTimeout(150);
    await page.keyboard.press("Enter");
    await expect.poll(() => editorValue(page)).toMatch(/for item in[\s\S]*print\(item\)/);
  });

  test("marca diagnósticos en línea (lint) además del panel Problems", async ({ page }) => {
    await openWorkspace(page);
    await page.evaluate(() => window.pythonIdeEditor.setValue(""));
    await focusEditorEnd(page);
    await page.keyboard.type("x\t= 1");
    await expect(page.locator("#problems")).toContainText("Verwende vier Leerzeichen statt Tabs");
    await expect.poll(() => page.locator(".cm-lintRange-warning, .cm-lintRange-error").count(), { timeout: 3000 }).toBeGreaterThan(0);
  });

  test("no desborda horizontalmente en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const noOverflow = await page.evaluate(() => document.body.scrollWidth <= window.innerWidth);
    expect(noOverflow).toBeTruthy();
  });

  test("ofrece una traza didáctica transparente y el estado cloud local", async ({ page }) => {
    await openWorkspace(page);
    await focusEditorEnd(page);
    await page.keyboard.type("zahl = 1\nwhile zahl <= 3:\n    zahl += 1");
    await page.locator("#trace").click();
    await expect(page.locator("#console")).toContainText("statisch, kein simuliertes Debugging");
    await expect(page.locator("#cloudStatus")).not.toHaveText("");
  });

  test("cambia de idioma (es/de), traduce misión y contenido dinámico, y persiste", async ({ page }) => {
    await expect(page.locator("#title")).toHaveText("Programmieren als Problemlösen");
    await page.locator('[data-lang="es"]').click();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator("#title")).toHaveText("Programar como resolución de problemas");
    await expect(page.locator("#hint")).toContainText("Pista");
    await expect(page.locator('[data-lang="es"]')).toHaveClass(/active/);

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator("#title")).toHaveText("Programar como resolución de problemas");
  });

  test("no borra la salida real de la consola al cambiar de idioma", async ({ page }) => {
    await openWorkspace(page);
    await focusEditorEnd(page);
    await page.keyboard.type('print("Ada")');
    await page.locator("#check").click();
    await expect(page.locator("#console")).toContainText("Ada");
    const before = await page.locator("#console").innerText();
    await page.locator('[data-lang="es"]').click();
    await expect(page.locator("#console")).toHaveText(before);
  });

  test("tema claro/oscuro es real y persiste entre recargas", async ({ page }) => {
    const before = await page.evaluate(() => document.body.classList.contains("light"));
    await page.locator("#theme").click();
    const after = await page.evaluate(() => document.body.classList.contains("light"));
    expect(after).toBe(!before);
    await page.reload();
    await expect.poll(() => page.evaluate(() => document.body.classList.contains("light"))).toBe(after);
  });

  test("otorga XP al resolver una misión y descuenta XP al usar una pista", async ({ page }) => {
    await expect(page.locator("#xp")).toHaveText("0");
    await openWorkspace(page);
    await focusEditorEnd(page);
    await page.keyboard.type('print("Ada")');
    await page.locator("#check").click();
    await expect(page.locator("#xp")).toHaveText("30");

    await page.locator("#missions button").nth(1).click();
    await page.locator("#hint").click();
    await expect(page.locator("#xp")).toHaveText("25");
  });

  test("incluye los mini-proyectos capstone y valida su estructura", async ({ page }) => {
    await expect(page.locator("#missions button")).toHaveCount(12);
    await page.locator("#missions button").nth(10).click();
    await expect(page.locator("#title")).toHaveText("Mini-Projekt: Vokabeltrainer");
    await focusEditorEnd(page);
    await page.keyboard.type('vokabeln = ["Hund - dog", "Katze - cat"]\nfor wort in vokabeln:\n    print(wort)');
    await page.locator("#check").click();
    await expect(page.locator("#result")).toContainText("Struktur erfüllt");

    await page.locator("#missions button").nth(11).click();
    await expect(page.locator("#title")).toHaveText("Mini-Projekt: Zahlenraten");
    await focusEditorEnd(page);
    await page.keyboard.type('def rate(versuch, zahl):\n    if versuch == zahl:\n        return "richtig"\n    else:\n        return "falsch"');
    await page.locator("#check").click();
    await expect(page.locator("#result")).toContainText("Struktur erfüllt");
  });

  test("muestra el hilo de feedback de la misión y permite enviar un comentario", async ({ page }) => {
    await reloadWithCloudUser(page, {
      user: { id: 5, name: "Mara", role: "student" },
      feedback: [{ id: 1, parent_id: null, message: "¿Cómo imprimo un texto?", status: "open", created_at: "2026-01-10T10:00:00Z", author: "Mara", author_id: 5, role: "student" }],
    });
    await openWorkspace(page);
    await expect(page.locator("#feedbackThread")).toContainText("¿Cómo imprimo un texto?");
    await page.locator('[data-tool="feedback"]').click();
    await page.locator("#feedbackForm textarea").fill("¿Puede darme otra pista?");
    await page.locator("#feedbackForm button[type=submit]").click();
    await expect(page.locator("#result")).toContainText("Feedback gesendet");
  });

  test("muestra notificaciones sin leer con badge y permite marcarlas como leídas", async ({ page }) => {
    await reloadWithCloudUser(page, {
      user: { id: 5, name: "Mara", role: "student" },
      notifications: [{ id: 1, type: "feedback", title: "Neue Antwort", message: "Deine Lehrkraft hat geantwortet.", entity_type: "mission_feedback", entity_id: 1, read_at: null, created_at: "2026-01-10T10:00:00Z" }],
      unread: 1,
    });
    await openWorkspace(page);
    await expect(page.locator("#notifBadge")).toHaveText("1");
    await page.locator('[data-tool="notifications"]').click();
    await expect(page.locator("#notificationList")).toContainText("Neue Antwort");
    await page.locator("#notificationsMarkAll").click();
    await expect(page.locator("#notifBadge")).toBeHidden();
  });

  test("mueve el foco al título de la misión tras navegar, y expone el tablist con teclado", async ({ page }) => {
    await page.locator("#missions button").nth(2).click();
    await expect(page.locator("#title")).toBeFocused();

    await page.keyboard.press("Control+2");
    await expect(page.locator("#panel-problems")).toBeVisible();
    await expect(page.locator('[data-tool="problems"]')).toHaveAttribute("aria-selected", "true");
    await expect(page.locator('[data-tool="console"]')).toHaveAttribute("aria-selected", "false");

    await page.locator('[data-tool="console"]').focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#panel-problems")).toBeVisible();
    await expect(page.locator('[data-tool="problems"]')).toBeFocused();
  });

  test("ofrece los botones de bienvenida estilo Java: abrir misión enfoca el editor", async ({ page }) => {
    await expect(page.locator("#pyOpenMission")).toContainText(/Mission öffnen/);
    await expect(page.locator("#pyDashboard")).toBeVisible();
    await expect(page.locator("#pyWorkspace")).toBeHidden();

    await page.locator("#pyOpenMission").click();
    await expect(page.locator("#pyDashboard")).toBeHidden();
    await expect(page.locator("#pyWorkspace")).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.activeElement?.classList.contains("cm-content") || document.querySelector(".cm-editor")?.classList.contains("cm-focused"))).toBe(true);

    await page.locator("#pyBackOverview").click();
    await expect(page.locator("#pyDashboard")).toBeVisible();
  });

  test("ofrece los botones de bienvenida estilo Java: explorar enfoca la lista de misiones", async ({ page }) => {
    await expect(page.locator("#pyBrowseMissions")).toContainText(/Missionen erkunden/);
    await page.locator("#pyBrowseMissions").click();
    await expect.poll(() => page.evaluate(() => document.activeElement?.closest("#missions") !== null)).toBe(true);
    // el dashboard sigue visible: explorar misiones no abre el workspace.
    await expect(page.locator("#pyDashboard")).toBeVisible();
  });

  test("Pfad ausblenden oculta/muestra la ruta, y Fokusmodus expande el editor con Esc para salir", async ({ page }) => {
    await openWorkspace(page);

    await expect(page.locator("#pyRail")).toBeVisible();
    await page.locator("#pyRailToggle").click();
    await expect(page.locator("#pyRail")).toBeHidden();
    await expect(page.locator("#pyRailToggle")).toContainText(/Pfad anzeigen/);
    await page.locator("#pyRailToggle").click();
    await expect(page.locator("#pyRail")).toBeVisible();

    await page.locator("#pyFocusToggle").click();
    await expect(page.locator("#pyEditorPanel")).toHaveClass(/is-focus-mode/);
    await expect(page.locator("#pyFocusToggle")).toContainText(/Fokusmodus beenden/);
    await focusEditorEnd(page);
    await page.keyboard.type("42");
    await expect.poll(() => editorValue(page)).toMatch(/42$/);

    await page.keyboard.press("Escape");
    await expect(page.locator("#pyEditorPanel")).not.toHaveClass(/is-focus-mode/);
  });

  test("recuerda ruta oculta y modo enfoque entre recargas", async ({ page }) => {
    await openWorkspace(page);
    await page.locator("#pyRailToggle").click();
    await page.locator("#pyFocusToggle").click();
    await expect(page.locator("#pyRail")).toBeHidden();
    await expect(page.locator("#pyEditorPanel")).toHaveClass(/is-focus-mode/);

    await page.reload();
    await expect(page.locator("#pyRail")).toBeHidden();
    await expect(page.locator("#pyEditorPanel")).toHaveClass(/is-focus-mode/);
  });
});
