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
  "projectGallery",
  "workbench-hud",
  "mentor-card",
  "49 misiones y 5 proyectos",
  "bugChecklistTitle",
  "styles.css?v=24",
  "js/java-evaluators.js?v=3",
  "game.js?v=23",
].forEach((needle) => assert(html.includes(needle), `missing ${needle}`));

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
  assets: { styles: "v24", evaluators: "v3", game: "v23" },
  compiler: compile.compiler,
  runtime: compile.runtime,
  sandbox: compile.sandbox,
}));
