import { expect, test } from "@playwright/test";

test.describe("Python Studio", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/python.html");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("permite resolver, conserva el feedback y registra progreso", async ({ page }) => {
    const editor = page.locator("#code");
    await expect(page.locator("#taskComment")).toContainText("# Aufgabe:");
    await editor.fill('print("Ada")');
    await page.locator("#check").click();

    await expect(page.locator("#result")).toBeVisible();
    await expect(page.locator("#result")).toContainText("Struktur erfüllt");
    await expect(page.locator("#console")).toContainText("Ada");
    await expect(page.locator("#progress")).toHaveText("1 / 10");

    await page.reload();
    await expect(editor).toHaveValue('print("Ada")');
  });

  test("navega entre misiones, muestra ayuda y permite reiniciar sin revelar solución", async ({ page }) => {
    await page.locator("#missions button").nth(1).click();
    await expect(page.locator("#taskComment")).toContainText("Punktzahl");
    await page.locator("#hint").click();
    await expect(page.locator('[data-panel="help"]')).toBeVisible();

    const editor = page.locator("#code");
    await editor.fill('name = "Mara"\npunkte = 18\nprint(name, punkte)');
    await page.locator("#reset").click();
    await expect(editor).toHaveValue("");
  });

  test("no desborda horizontalmente en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const noOverflow = await page.evaluate(() => document.body.scrollWidth <= window.innerWidth);
    expect(noOverflow).toBeTruthy();
  });

  test("ofrece una traza didáctica transparente y el estado cloud local", async ({ page }) => {
    await page.locator("#code").fill("zahl = 1\nwhile zahl <= 3:\n    zahl += 1");
    await page.locator("#trace").click();
    await expect(page.locator("#console")).toContainText("statisch, kein simuliertes Debugging");
    await expect(page.locator("#cloudStatus")).not.toHaveText("");
  });
});
