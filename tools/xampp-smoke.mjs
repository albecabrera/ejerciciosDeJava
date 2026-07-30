const baseUrl = (process.env.JAVA_WERKSTATT_XAMPP_URL || "http://127.0.0.1/java-werkstatt/").replace(/\/?$/, "/");

function assert(condition, message) {
  if (!condition) {
    console.error(`xampp-smoke-failed: ${message}`);
    process.exit(1);
  }
}

async function readText(path = "") {
  const response = await fetch(new URL(path, baseUrl));
  assert(response.ok, `${path || baseUrl} returned HTTP ${response.status}`);
  return response.text();
}

async function readJson(path, options = {}) {
  const response = await fetch(new URL(path, baseUrl), options);
  assert(response.ok, `${path} returned HTTP ${response.status}`);
  return response.json();
}

const html = await readText();
[
  "learning-command",
  "workspace-topbar",
  "resource-center",
  "tool-window",
  "projectGallery",
  "mentor-card",
  "49 misiones y 5 proyectos",
  "bugChecklistTitle",
  "styles.css?v=29",
  "js/java-evaluators.js?v=3",
  "game.js?v=29",
].forEach((needle) => assert(html.includes(needle), `missing ${needle}`));

const css = await readText("styles.css?v=29");
[
  "Focused Classroom",
  ".workspace-topbar",
  ".resource-center",
  ".tool-window",
  ".view-workspace .workbench-hud",
].forEach((needle) => assert(css.includes(needle), `focused CSS missing ${needle}`));

const game = await readText("game.js?v=29");
[
  "function setAppView",
  "function activateResourceTab",
  "function activateToolTab",
  "commandProjectLockedAria",
  "resourceTutorialTab.hidden = true",
].forEach((needle) => assert(game.includes(needle), `focused JS missing ${needle}`));

const auth = await readJson("api/auth.php?action=me");
assert(Object.prototype.hasOwnProperty.call(auth, "configured"), "auth endpoint did not return configuration status");

const compile = await readJson("api/compile.php", {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body: JSON.stringify({
    source: 'System.out.println("xampp-phase4-smoke");',
    fileName: "Smoke.java",
    mode: "snippet",
    run: true,
  }),
});
assert(compile.ok === true, `compile endpoint failed: ${compile.error || compile.rawOutput || "unknown"}`);
assert(String(compile.stdout || "").includes("xampp-phase4-smoke"), "compile endpoint did not return expected stdout");
assert(/worker-no-network|docker-no-network|jvm-limited/.test(String(compile.sandbox || "")), "compile endpoint did not report a known sandbox");

console.log(JSON.stringify({
  ok: true,
  baseUrl,
  assets: { styles: "v29", evaluators: "v3", game: "v29" },
  compiler: compile.compiler,
  runtime: compile.runtime,
  sandbox: compile.sandbox,
}));
