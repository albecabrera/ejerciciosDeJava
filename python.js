const videos = {
  basics: ["AjdaWAIojvI", "Grundbegriffe beim Programmieren"], variables: ["N8sxN3yhJ8E", "Variablen"],
  input: ["MuB8y8pexJ8", "input()"], if: ["A5O9njRJOrc", "Bedingte Anweisung: if"],
  while: ["b4wACpaTcYk", "while-Schleife"], lists: ["c5rMqOy3KwA", "Listen"],
  for: ["vKeJGjC79Lo", "for-Schleife"], functions: ["eSEm2SvZdQY", "Funktionen: Einführung"],
};

const missions = [
  { id: "python-01-output", stage: "EF I", title: "Programmieren als Problemlösen", objective: "Beschreibe Eingabe, Verarbeitung und Ausgabe.", prompt: "Gib deinen Namen mit print() aus.", video: "basics", rules: [/print\s*\(/] },
  { id: "python-02-variables", stage: "EF I", title: "Variablen und Datentypen", objective: "Modelliere Daten mit passenden Namen und Typen.", prompt: "Speichere einen Namen und eine Punktzahl. Gib beide aus.", video: "variables", rules: [/name\s*=/, /punkte\s*=/, /print\s*\(/] },
  { id: "python-03-input", stage: "EF I", title: "Eingaben verarbeiten", objective: "Trenne Dateneingabe und Umwandlung.", prompt: "Lies ein Alter ein, wandle es in int um und gib nächstes Jahr aus.", video: "input", rules: [/input\s*\(/, /int\s*\(/, /print\s*\(/] },
  { id: "python-04-condition", stage: "EF II", title: "Entscheidungen", objective: "Formuliere Bedingungen eindeutig.", prompt: 'Gib "bestanden" aus, wenn punkte mindestens 50 sind, sonst "noch üben".', video: "if", rules: [/if\s+punkte\s*>=\s*50:/, /else:/, /print/] },
  { id: "python-05-while", stage: "EF II", title: "Schleifen und Invarianten", objective: "Wiederhole kontrolliert und sichere Terminierung.", prompt: "Zähle von 1 bis 3 mit einer while-Schleife.", video: "while", rules: [/while\s+/, /zahl\s*\+=/] },
  { id: "python-06-lists", stage: "EF II", title: "Listen", objective: "Verwalte eine lineare Datenstruktur.", prompt: "Lege drei Sprachen in einer Liste an und gib die Liste aus.", video: "lists", rules: [/\[[\s\S]*\]/, /print\s*\(/] },
  { id: "python-07-for", stage: "EF II", title: "For und range", objective: "Durchlaufe eine Sequenz nachvollziehbar.", prompt: "Gib die Zahlen 0 bis 4 mit for und range aus.", video: "for", rules: [/for\s+\w+\s+in\s+range/, /print/] },
  { id: "python-08-functions", stage: "EF III", title: "Funktionen", objective: "Modularisiere einen wiederkehrenden Ablauf.", prompt: "Schreibe begruessung(name), die eine Begrüßung zurückgibt.", video: "functions", rules: [/def\s+begruessung\s*\(/, /return/] },
  { id: "python-09-tests", stage: "EF III", title: "Testen und Grenzfälle", objective: "Sichere einen Algorithmus mit Beispielen ab.", prompt: "Schreibe ist_volljaehrig(alter), die ab 18 True liefert.", video: "if", rules: [/def\s+ist_volljaehrig/, />=\s*18/, /return/] },
  { id: "python-10-project", stage: "EF III", title: "Mini-Projekt: Notenhelfer", objective: "Verbinde Daten, Schleife und Entscheidung.", prompt: "Erstelle eine Liste mit Punkten und gib für jeden Wert bestanden/nicht bestanden aus.", video: "for", rules: [/for\s+/, /if\s+/, /else:/] },
];

const $ = (selector) => document.querySelector(selector);
const storageKey = "python-studio-state-v2";
const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
const state = {
  current: Number.isInteger(stored.current) ? Math.max(0, Math.min(missions.length - 1, stored.current)) : 0,
  answers: stored.answers && typeof stored.answers === "object" ? stored.answers : {},
  solved: Array.isArray(stored.solved) ? stored.solved.filter((id) => missions.some((mission) => mission.id === id)) : [],
  attempts: Array.isArray(stored.attempts) ? stored.attempts.slice(-50) : [],
  hints: stored.hints && typeof stored.hints === "object" ? stored.hints : {},
};
let cloud = { configured: false, user: null, csrf: "", classes: [], activeClassId: localStorage.getItem("python-studio-class") || "", assignments: [], syncTimer: null };

function mission() { return missions[state.current]; }
function saveLocal() { localStorage.setItem(storageKey, JSON.stringify(state)); }
function starterCode(item = mission()) { return `# Aufgabe: ${item.prompt}
# Schreibe deine eigene Python-Lösung darunter.

`; }
function activeAnswer() {
  const saved = state.answers[mission().id];
  return typeof saved === "string" ? saved : starterCode();
}
function setPanel(name) {
  document.querySelectorAll("[data-tool]").forEach((button) => button.classList.toggle("active", button.dataset.tool === name));
  document.querySelectorAll("[data-panel]").forEach((panel) => { panel.hidden = panel.dataset.panel !== name; });
}
function renderProgress() {
  const percent = Math.round(state.solved.length / missions.length * 100);
  $("#progress").textContent = `${state.solved.length} / ${missions.length}`;
  $("#bar").style.width = `${percent}%`;
  $("#progressText").textContent = `${state.solved.length} von ${missions.length} Missionen gelöst. Python EF legt die Grundlage für Java in Q1/Q2.`;
  $("#commandProgress").textContent = `${percent}%`;
  $("#commandProgressMeta").textContent = `${state.solved.length}/${missions.length} Missionen gelöst`;
  $("#attempts").replaceChildren(...state.attempts.slice(-6).reverse().map((attempt) => {
    const item = document.createElement("li"); item.textContent = attempt; return item;
  }));
}
function renderProblems() {
  const problems = [];
  const source = activeAnswer();
  if (/\t/.test(source)) problems.push("PEP 8: Verwende vier Leerzeichen statt Tabs.");
  if (/\bprint\s*\([^)]*$/.test(source)) problems.push("Klammer bei print() schließen.");
  if (!problems.length) problems.push("Keine lokalen Strukturhinweise.");
  $("#problems").replaceChildren(...problems.map((message) => { const item = document.createElement("li"); item.textContent = message; return item; }));
}
function renderMissions() {
  $("#missions").replaceChildren(...missions.map((item, index) => {
    const button = document.createElement("button");
    button.className = index === state.current ? "active" : "";
    button.innerHTML = `<small>${String(index + 1).padStart(2, "0")}</small> ${item.title}`;
    button.onclick = () => { state.current = index; saveLocal(); render(); };
    return button;
  }));
}
function renderCloud() {
  const signedIn = Boolean(cloud.user);
  $("#cloudStatus").textContent = signedIn ? `Cloud verbunden · ${cloud.user.name}` : (cloud.configured ? "Cloud: nicht angemeldet – lokales Lernen bleibt aktiv." : "Cloud nicht konfiguriert – lokales Lernen bleibt aktiv.");
  $("#cloudClass").disabled = !signedIn;
  $("#cloudClass").replaceChildren(Object.assign(document.createElement("option"), { value: "", textContent: "Klasse auswählen" }), ...cloud.classes.map((item) => Object.assign(document.createElement("option"), { value: item.id, textContent: item.name })));
  $("#cloudClass").value = cloud.activeClassId;
  $("#teacherAssignment").hidden = !(signedIn && ["teacher", "admin"].includes(cloud.user.role) && cloud.activeClassId);
  $("#assignmentList").replaceChildren(...cloud.assignments.map((assignment) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${assignment.title}</strong><span>${assignment.due_at ? ` · ${assignment.due_at}` : ""}</span>`;
    const submit = document.createElement("button"); submit.type = "button"; submit.textContent = "Code abgeben";
    submit.onclick = () => submitAssignment(assignment); item.append(" ", submit); return item;
  }));
  if (signedIn && cloud.activeClassId && !cloud.assignments.length) $("#assignmentList").textContent = "Keine aktiven Aufgaben in dieser Klasse.";
}
function render() {
  const item = mission(); const video = videos[item.video];
  $("#stage").textContent = item.stage; $("#title").textContent = item.title; $("#objective").textContent = item.objective; $("#prompt").textContent = item.prompt;
  $("#commandNextMission").textContent = item.title;
  $("#commandNextMeta").textContent = `${item.stage} · Mission ${String(state.current + 1).padStart(2, "0")}`;
  $("#commandTopic").textContent = item.objective;
  $("#file").textContent = $("#tab").textContent = `mission_${String(state.current + 1).padStart(2, "0")}.py`;
  $("#tree").textContent = `　　${$("#file").textContent}`; $("#video").href = `https://www.youtube.com/watch?v=${video[0]}`; $("#videoTitle").textContent = video[1];
  $("#code").value = activeAnswer(); $("#lines").replaceChildren(...activeAnswer().split("\n").map((_, index) => { const line = document.createElement("li"); line.textContent = index + 1; return line; }));
  $("#helpText").textContent = `Konzept: ${item.objective} Starte mit einer kleinen, überprüfbaren Zeile und prüfe anschließend Einrückung und Ausgabe.`;
  renderMissions(); renderProblems(); renderProgress(); renderCloud();
}
function structurePassed() { return mission().rules.every((rule) => rule.test(activeAnswer())); }
function appendAttempt(passed) {
  state.attempts.push(`${new Date().toLocaleTimeString()} · Mission ${state.current + 1} · ${passed ? "erfüllt" : "noch offen"}`);
  state.attempts = state.attempts.slice(-50); saveLocal(); renderProgress();
}
function feedback(message, kind = "") { $("#result").hidden = false; $("#result").className = `result ${kind}`; $("#result").textContent = message; }
async function runCode() {
  const localPass = structurePassed(); appendAttempt(localPass);
  if (localPass && !state.solved.includes(mission().id)) { state.solved.push(mission().id); saveLocal(); renderProgress(); }
  $("#status").textContent = "Ausführung läuft …"; $("#check").disabled = true;
  try {
    const response = await fetch("api/python.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ source: activeAnswer() }) });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || payload.stderr || "Python konnte nicht ausgeführt werden.");
    $("#console").textContent = `> python ${$("#file").textContent}\n${payload.stdout || "(keine Ausgabe)"}${payload.stderr ? `\n${payload.stderr}` : ""}`;
    feedback(localPass ? "✓ Struktur erfüllt und Code erfolgreich ausgeführt." : "✓ Code läuft. Prüfe noch die Bausteine der Aufgabe.", localPass ? "ok" : "");
  } catch (error) {
    $("#console").textContent = `> Lokale Strukturprüfung: ${localPass ? "bestanden" : "noch offen"}\n> Runtime: ${error.message}\n\nOhne Docker bleibt die Übung offline nutzbar; die tatsächliche Ausführung ist absichtlich nicht lokal freigegeben.`;
    feedback(localPass ? "✓ Struktur erfüllt. Die sichere Python-Runtime ist aktuell nicht erreichbar." : "✕ Noch nicht vollständig. Prüfe Aufgabe, Einrückung und erwartete Bausteine.", localPass ? "" : "bad");
  } finally { $("#status").textContent = "Bereit"; $("#check").disabled = false; queueCloudSync(); }
}
function showTrace() {
  const steps = activeAnswer().split("\n").map((line, index) => {
    const content = line.trim(); if (!content) return null;
    if (/^[A-Za-z_]\w*\s*=/.test(content)) return `Zeile ${index + 1}: Variable wird gesetzt → ${content}`;
    if (/^(if|while|for)\b/.test(content)) return `Zeile ${index + 1}: Kontrollfluss → ${content}`;
    if (/^def\b/.test(content)) return `Zeile ${index + 1}: Funktion wird definiert → ${content}`;
    return `Zeile ${index + 1}: ${content}`;
  }).filter(Boolean);
  $("#console").textContent = `> Didaktische Tracing-Ansicht (statisch, kein simuliertes Debugging)\n${steps.join("\n") || "Schreibe zuerst Code, um eine Tracing-Ansicht zu erhalten."}`;
  setPanel("console");
}
async function cloudRequest(url, options = {}) {
  const response = await fetch(url, options); const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.ok === false) throw new Error(payload.error || "Cloud-Anfrage fehlgeschlagen."); return payload;
}
function queueCloudSync() { if (!cloud.user || !cloud.csrf) return; clearTimeout(cloud.syncTimer); cloud.syncTimer = setTimeout(syncCloudProgress, 500); }
async function syncCloudProgress() {
  const payload = missions.map((item) => ({ missionId: item.id, answer: state.answers[item.id] || "", attempts: state.attempts.filter((attempt) => attempt.includes(`Mission ${missions.indexOf(item) + 1} ·`)).length, correctAttempts: state.solved.includes(item.id) ? 1 : 0, hintsUsed: state.hints[item.id] || 0, solved: state.solved.includes(item.id) }));
  try { await cloudRequest("api/progress.php", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": cloud.csrf }, body: JSON.stringify({ missions: payload }) }); } catch { /* Local-first fallback is intentional. */ }
}
async function loadAssignments() {
  cloud.assignments = [];
  if (!cloud.activeClassId) return renderCloud();
  try { cloud.assignments = (await cloudRequest(`api/assignments.php?action=list&classId=${encodeURIComponent(cloud.activeClassId)}`)).assignments || []; } catch { cloud.assignments = []; }
  renderCloud();
}
async function submitAssignment(assignment) {
  const sourceCode = state.answers[assignment.mission_id] || "";
  try { await cloudRequest("api/submissions.php?action=submit", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": cloud.csrf }, body: JSON.stringify({ assignmentId: Number(assignment.id), sourceCode, note: "Python Studio" }) }); feedback("✓ Code an die Klasse abgegeben.", "ok"); } catch (error) { feedback(error.message, "bad"); }
}
async function initCloud() {
  try {
    const session = await cloudRequest("api/auth.php?action=me"); cloud.configured = session.configured !== false; cloud.user = session.user; cloud.csrf = session.csrf || "";
    if (!cloud.user) return renderCloud();
    const [progress, classes] = await Promise.all([cloudRequest("api/progress.php"), cloudRequest("api/classes.php?action=list")]);
    (progress.progress || []).forEach((row) => { if (missions.some((item) => item.id === row.mission_id)) { if (row.answer) state.answers[row.mission_id] = row.answer; if (row.solved_at && !state.solved.includes(row.mission_id)) state.solved.push(row.mission_id); } });
    cloud.classes = classes.classes || []; if (!cloud.classes.some((item) => String(item.id) === cloud.activeClassId)) cloud.activeClassId = cloud.classes[0] ? String(cloud.classes[0].id) : "";
    saveLocal(); await loadAssignments(); render();
  } catch { cloud.configured = false; renderCloud(); }
}

$("#code").addEventListener("input", () => { state.answers[mission().id] = $("#code").value; saveLocal(); renderProblems(); $("#lines").replaceChildren(...activeAnswer().split("\n").map((_, index) => { const line = document.createElement("li"); line.textContent = index + 1; return line; })); queueCloudSync(); });
$("#check").onclick = runCode;
$("#trace").onclick = showTrace;
$("#hint").onclick = () => { state.hints[mission().id] = (state.hints[mission().id] || 0) + 1; saveLocal(); setPanel("help"); $("#helpText").textContent = `Hinweis: ${mission().prompt.split(". ")[0]}. Baue zuerst den kleinsten passenden Python-Ausdruck.`; queueCloudSync(); };
$("#help").onclick = () => setPanel("help");
$("#reset").onclick = () => { delete state.answers[mission().id]; saveLocal(); $("#result").hidden = true; $("#console").textContent = "Editor zurückgesetzt. Schreibe deine eigene Lösung unter die Kommentare und drücke F5."; render(); $("#code").focus(); $("#code").setSelectionRange($("#code").value.length, $("#code").value.length); };
$("#theme").onclick = () => document.body.classList.toggle("light");
$("#cloudClass").onchange = async (event) => { cloud.activeClassId = event.target.value; localStorage.setItem("python-studio-class", cloud.activeClassId); await loadAssignments(); };
$("#teacherAssignment").onsubmit = async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); try { await cloudRequest("api/assignments.php?action=create", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": cloud.csrf }, body: JSON.stringify({ classId: Number(cloud.activeClassId), missionId: mission().id, title: form.get("title"), dueAt: form.get("dueAt") || null }) }); event.currentTarget.reset(); await loadAssignments(); } catch (error) { feedback(error.message, "bad"); } };
document.querySelectorAll("[data-tool]").forEach((button) => button.onclick = () => setPanel(button.dataset.tool));
document.addEventListener("keydown", (event) => { if (event.key === "F5") { event.preventDefault(); runCode(); } });
render(); initCloud();
