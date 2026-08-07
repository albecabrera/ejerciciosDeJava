import { createIdeEditor } from "./assets/editor/ide-editor.js";

// video[2] = Startsekunde im YouTube-Video (0 = Anfang, bis exakte Timestamps gepflegt sind).
// Die Videotitel bleiben einsprachig (echter Titel des deutschsprachigen Tutorials).
const videos = {
  basics: ["AjdaWAIojvI", "Grundbegriffe beim Programmieren", 0], variables: ["N8sxN3yhJ8E", "Variablen", 0],
  input: ["MuB8y8pexJ8", "input()", 0], if: ["A5O9njRJOrc", "Bedingte Anweisung: if", 0],
  while: ["b4wACpaTcYk", "while-Schleife", 0], lists: ["c5rMqOy3KwA", "Listen", 0],
  for: ["vKeJGjC79Lo", "for-Schleife", 0], functions: ["eSEm2SvZdQY", "Funktionen: Einführung", 0],
};

const missions = [
  { id: "python-01-output", stage: "EF I",
    title: { de: "Programmieren als Problemlösen", es: "Programar como resolución de problemas" },
    objective: { de: "Beschreibe Eingabe, Verarbeitung und Ausgabe.", es: "Describí entrada, procesamiento y salida." },
    prompt: { de: "Gib deinen Namen mit print() aus.", es: "Mostrá tu nombre con print()." },
    video: "basics", rules: [/print\s*\(/] },
  { id: "python-02-variables", stage: "EF I",
    title: { de: "Variablen und Datentypen", es: "Variables y tipos de datos" },
    objective: { de: "Modelliere Daten mit passenden Namen und Typen.", es: "Modelá datos con nombres y tipos adecuados." },
    prompt: { de: "Speichere einen Namen und eine Punktzahl. Gib beide aus.", es: "Guardá un nombre y un puntaje. Mostrá ambos." },
    video: "variables", rules: [/name\s*=/, /punkte\s*=/, /print\s*\(/] },
  { id: "python-03-input", stage: "EF I",
    title: { de: "Eingaben verarbeiten", es: "Procesar entradas" },
    objective: { de: "Trenne Dateneingabe und Umwandlung.", es: "Separá la lectura de datos de la conversión." },
    prompt: { de: "Lies ein Alter ein, wandle es in int um und gib nächstes Jahr aus.", es: "Leé una edad, convertila a int y mostrá el año que viene." },
    video: "input", rules: [/input\s*\(/, /int\s*\(/, /print\s*\(/] },
  { id: "python-04-condition", stage: "EF II",
    title: { de: "Entscheidungen", es: "Decisiones" },
    objective: { de: "Formuliere Bedingungen eindeutig.", es: "Formulá condiciones sin ambigüedad." },
    prompt: { de: 'Gib "bestanden" aus, wenn punkte mindestens 50 sind, sonst "noch üben".', es: 'Mostrá "aprobado" si punkte es al menos 50, si no "seguir practicando".' },
    video: "if", rules: [/if\s+punkte\s*>=\s*50:/, /else:/, /print/] },
  { id: "python-05-while", stage: "EF II",
    title: { de: "Schleifen und Invarianten", es: "Bucles e invariantes" },
    objective: { de: "Wiederhole kontrolliert und sichere Terminierung.", es: "Repetí de forma controlada y asegurá la terminación." },
    prompt: { de: "Zähle von 1 bis 3 mit einer while-Schleife.", es: "Contá del 1 al 3 con un bucle while." },
    video: "while", rules: [/while\s+/, /zahl\s*\+=/] },
  { id: "python-06-lists", stage: "EF II",
    title: { de: "Listen", es: "Listas" },
    objective: { de: "Verwalte eine lineare Datenstruktur.", es: "Gestioná una estructura de datos lineal." },
    prompt: { de: "Lege drei Sprachen in einer Liste an und gib die Liste aus.", es: "Guardá tres idiomas en una lista y mostrá la lista." },
    video: "lists", rules: [/\[[\s\S]*\]/, /print\s*\(/] },
  { id: "python-07-for", stage: "EF II",
    title: { de: "For und range", es: "For y range" },
    objective: { de: "Durchlaufe eine Sequenz nachvollziehbar.", es: "Recorré una secuencia de forma clara." },
    prompt: { de: "Gib die Zahlen 0 bis 4 mit for und range aus.", es: "Mostrá los números del 0 al 4 con for y range." },
    video: "for", rules: [/for\s+\w+\s+in\s+range/, /print/] },
  { id: "python-08-functions", stage: "EF III",
    title: { de: "Funktionen", es: "Funciones" },
    objective: { de: "Modularisiere einen wiederkehrenden Ablauf.", es: "Modularizá un proceso que se repite." },
    prompt: { de: "Schreibe begruessung(name), die eine Begrüßung zurückgibt.", es: "Escribí begruessung(name), que devuelva un saludo." },
    video: "functions", rules: [/def\s+begruessung\s*\(/, /return/] },
  { id: "python-09-tests", stage: "EF III",
    title: { de: "Testen und Grenzfälle", es: "Pruebas y casos límite" },
    objective: { de: "Sichere einen Algorithmus mit Beispielen ab.", es: "Asegurá un algoritmo con ejemplos." },
    prompt: { de: "Schreibe ist_volljaehrig(alter), die ab 18 True liefert.", es: "Escribí ist_volljaehrig(alter), que devuelva True a partir de 18." },
    video: "if", rules: [/def\s+ist_volljaehrig/, />=\s*18/, /return/] },
  { id: "python-10-project", stage: "EF III",
    title: { de: "Mini-Projekt: Notenhelfer", es: "Mini-proyecto: ayudante de notas" },
    objective: { de: "Verbinde Daten, Schleife und Entscheidung.", es: "Combiná datos, bucle y decisión." },
    prompt: { de: "Erstelle eine Liste mit Punkten und gib für jeden Wert bestanden/nicht bestanden aus.", es: "Creá una lista con puntajes y mostrá para cada valor aprobado/no aprobado." },
    video: "for", rules: [/for\s+/, /if\s+/, /else:/] },
  { id: "python-11-capstone-vocab", stage: "EF III",
    title: { de: "Mini-Projekt: Vokabeltrainer", es: "Mini-proyecto: entrenador de vocabulario" },
    objective: { de: "Verbinde Listen und Schleifen zu einem kleinen Lernwerkzeug.", es: "Combiná listas y bucles en una pequeña herramienta de estudio." },
    prompt: { de: "Erstelle eine Liste mit Vokabelpaaren als Strings (z. B. \"Hund - dog\") und gib jede Vokabel mit einer for-Schleife aus.", es: "Creá una lista con pares de vocabulario como strings (por ej. \"perro - dog\") y mostrá cada uno con un bucle for." },
    video: "for", rules: [/\[[\s\S]*\]/, /for\s+\w+\s+in\s+/, /print\s*\(/] },
  { id: "python-12-capstone-guess", stage: "EF III",
    title: { de: "Mini-Projekt: Zahlenraten", es: "Mini-proyecto: adivinar el número" },
    objective: { de: "Verbinde Funktion und Entscheidung zu einem prüfbaren Spielbaustein.", es: "Combiná función y decisión en una pieza de juego verificable." },
    prompt: { de: "Schreibe eine Funktion rate(versuch, zahl), die \"richtig\" zurückgibt, wenn versuch gleich zahl ist, sonst \"falsch\".", es: "Escribí una función rate(versuch, zahl) que devuelva \"richtig\" si versuch es igual a zahl, si no \"falsch\"." },
    video: "if", rules: [/def\s+rate\s*\(/, /if\s+/, /else:/, /return/] },
];

const ui = {
  brandSub: { de: "Python Studio · EF NRW", es: "Python Studio · EF NRW" },
  navJava: { de: "Java lernen", es: "Aprender Java" },
  themeToggle: { de: "Kontrast", es: "Contraste" },
  langGroupLabel: { de: "Sprache", es: "Idioma" },
  railTitleLine2: { de: "von der Idee zum Algorithmus", es: "de la idea al algoritmo" },
  railIntro: { de: "Klasse 11: modellieren, implementieren, testen und erklären.", es: "11.º grado: modelar, implementar, probar y explicar." },
  curriculumHeading: { de: "Kompetenzen NRW", es: "Competencias NRW" },
  curriculumSkills: { de: "Argumentieren · Modellieren · Implementieren · Darstellen", es: "Argumentar · Modelar · Implementar · Representar" },
  missionsAriaLabel: { de: "Python-Missionen", es: "Misiones de Python" },
  crumbLabel: { de: "PYCHARM-INSPIRED · WORKBENCH", es: "INSPIRADO EN PYCHARM · BANCO DE TRABAJO" },
  commandEyebrow: { de: "WERKBANK", es: "BANCO DE TRABAJO" },
  pyWelcomeGreeting: { de: "Willkommen im Python Studio", es: "Bienvenido a Python Studio" },
  pyOpenMission: { de: "Mission öffnen", es: "Abrir misión" },
  pyBrowseMissions: { de: "Missionen erkunden", es: "Explorar misiones" },
  commandTitle: { de: "Dein Python-Pfad ist klar", es: "Tu camino en Python está claro" },
  commandIntro: { de: "EF Klasse 11: erst denken, dann implementieren. Mission, Editor und Nachweis bleiben in einem sichtbaren Lernfluss.", es: "11.º grado: primero pensar, después implementar. Misión, editor y evidencia en un mismo flujo de aprendizaje visible." },
  coverEyebrow: { de: "PYTHON-ARBEITSBEREICH", es: "ESPACIO DE TRABAJO PYTHON" },
  coverHeading: { de: "Lerne durch echte kleine Programme", es: "Aprendé con programas reales y pequeños" },
  coverMeta: { de: "F5 · sicher ausführen · lokal gespeichert", es: "F5 · ejecución segura · guardado local" },
  step1: { de: "Mission auswählen", es: "Elegir misión" },
  step2: { de: "Unter dem Kommentar coden", es: "Programar debajo del comentario" },
  step3: { de: "Konsole und Problems prüfen", es: "Revisar consola y Problems" },
  cardNextLabel: { de: "Nächste Mission", es: "Próxima misión" },
  cardProgressLabel: { de: "Fortschritt", es: "Progreso" },
  cardTopicLabel: { de: "Aktives Thema", es: "Tema activo" },
  topicCardMeta: { de: "Vorbereitung auf Java Q1/Q2", es: "Preparación para Java Q1/Q2" },
  taskLabel: { de: "Aufgabe", es: "Tarea" },
  videoLabel: { de: "Videotutorial", es: "Videotutorial" },
  videoPlayLabel: { de: "Im Editor ansehen", es: "Ver en el editor" },
  videoExternalLabel: { de: "Auf YouTube öffnen", es: "Abrir en YouTube" },
  videoPreviewAria: { de: "Themenvideo im Editor abspielen", es: "Reproducir el video del tema en el editor" },
  footerCheck: { de: "PEP 8 · lokale Strukturprüfung", es: "PEP 8 · comprobación estructural local" },
  hintLabel: { de: "Hinweis", es: "Pista" },
  helpLabel: { de: "Hilfe", es: "Ayuda" },
  resetLabel: { de: "Zurücksetzen", es: "Reiniciar" },
  tabConsole: { de: "Konsole", es: "Consola" },
  tabHelp: { de: "Hilfe", es: "Ayuda" },
  tabProgress: { de: "Fortschritt", es: "Progreso" },
  consoleTitle: { de: "Python-Konsole", es: "Consola de Python" },
  consoleHintInitial: { de: "Drücke F5, um deinen Code sicher auszuführen.", es: "Presioná F5 para ejecutar tu código de forma segura." },
  helpPanelTitle: { de: "Hilfe zur Mission", es: "Ayuda de la misión" },
  docsLinkLabel: { de: "Python-Dokumentation öffnen", es: "Abrir documentación de Python" },
  progressPanelTitle: { de: "Dein Fortschritt", es: "Tu progreso" },
  cloudTitle: { de: "Klassen-Cloud", es: "Nube de la clase" },
  classLabel: { de: "Klasse", es: "Clase" },
  classSelectPlaceholder: { de: "Klasse auswählen", es: "Elegir clase" },
  assignTitle: { de: "Aktuelle Python-Mission zuweisen", es: "Asignar la misión de Python actual" },
  assignTitlePlaceholder: { de: "Titel der Aufgabe", es: "Título de la tarea" },
  assignSubmit: { de: "Zuweisen", es: "Asignar" },
  statusReady: { de: "Bereit", es: "Listo" },
  statusRunning: { de: "Ausführung läuft …", es: "Ejecutando…" },
  helpTextTemplate: { de: "Konzept: {objective} Starte mit einer kleinen, überprüfbaren Zeile und prüfe anschließend Einrückung und Ausgabe.", es: "Concepto: {objective} Empezá con una línea pequeña y verificable, después revisá la indentación y la salida." },
  hintTemplate: { de: "Hinweis: {hint}. Baue zuerst den kleinsten passenden Python-Ausdruck.", es: "Pista: {hint}. Construí primero la expresión Python más pequeña que sirva." },
  resetConsoleMessage: { de: "Editor zurückgesetzt. Schreibe deine eigene Lösung unter die Kommentare und drücke F5.", es: "Editor reiniciado. Escribí tu propia solución debajo de los comentarios y presioná F5." },
  feedbackLocalOk: { de: "✓ Struktur erfüllt und Code erfolgreich ausgeführt.", es: "✓ Estructura correcta y código ejecutado con éxito." },
  feedbackRunOnly: { de: "✓ Code läuft. Prüfe noch die Bausteine der Aufgabe.", es: "✓ El código corre. Revisá todavía los elementos de la tarea." },
  feedbackOfflineOk: { de: "✓ Struktur erfüllt. Die sichere Python-Runtime ist aktuell nicht erreichbar.", es: "✓ Estructura correcta. El entorno seguro de Python no está disponible ahora." },
  feedbackOfflineFail: { de: "✕ Noch nicht vollständig. Prüfe Aufgabe, Einrückung und erwartete Bausteine.", es: "✕ Todavía incompleto. Revisá la tarea, la indentación y los elementos esperados." },
  consoleNoOutput: { de: "(keine Ausgabe)", es: "(sin salida)" },
  consoleOfflineHeader: { de: "> Lokale Strukturprüfung: {passed}", es: "> Comprobación estructural local: {passed}" },
  consoleOfflineNote: { de: "Ohne Docker bleibt die Übung offline nutzbar; die tatsächliche Ausführung ist absichtlich nicht lokal freigegeben.", es: "Sin Docker el ejercicio sigue siendo usable offline; la ejecución real no está habilitada localmente a propósito." },
  passedYes: { de: "bestanden", es: "aprobada" },
  passedNo: { de: "noch offen", es: "pendiente" },
  traceHeader: { de: "> Didaktische Tracing-Ansicht (statisch, kein simuliertes Debugging)", es: "> Vista de trazado didáctica (estática, sin depuración simulada)" },
  traceEmpty: { de: "Schreibe zuerst Code, um eine Tracing-Ansicht zu erhalten.", es: "Escribí código primero para obtener una vista de trazado." },
  traceLineVar: { de: "Zeile {n}: Variable wird gesetzt → {content}", es: "Línea {n}: se asigna variable → {content}" },
  traceLineControl: { de: "Zeile {n}: Kontrollfluss → {content}", es: "Línea {n}: flujo de control → {content}" },
  traceLineFunc: { de: "Zeile {n}: Funktion wird definiert → {content}", es: "Línea {n}: se define función → {content}" },
  traceLineDefault: { de: "Zeile {n}: {content}", es: "Línea {n}: {content}" },
  cloudConnected: { de: "Cloud verbunden · {name}", es: "Nube conectada · {name}" },
  cloudNotSignedIn: { de: "Cloud: nicht angemeldet – lokales Lernen bleibt aktiv.", es: "Nube: no iniciaste sesión – el aprendizaje local sigue activo." },
  cloudNotConfigured: { de: "Cloud nicht konfiguriert – lokales Lernen bleibt aktiv.", es: "Nube no configurada – el aprendizaje local sigue activo." },
  noAssignments: { de: "Keine aktiven Aufgaben in dieser Klasse.", es: "No hay tareas activas en esta clase." },
  submitCodeButton: { de: "Code abgeben", es: "Entregar código" },
  submitOk: { de: "✓ Code an die Klasse abgegeben.", es: "✓ Código entregado a la clase." },
  progressTextTemplate: { de: "{solved} von {total} Missionen gelöst. Python EF legt die Grundlage für Java in Q1/Q2.", es: "{solved} de {total} misiones resueltas. Python EF sienta la base para Java en Q1/Q2." },
  progressMetaTemplate: { de: "{solved}/{total} Missionen gelöst", es: "{solved}/{total} misiones resueltas" },
  nextMetaTemplate: { de: "{stage} · Mission {n}", es: "{stage} · Misión {n}" },
  attemptLine: { de: "{time} · Mission {n} · {status}", es: "{time} · Misión {n} · {status}" },
  attemptPassed: { de: "erfüllt", es: "cumplida" },
  attemptOpen: { de: "noch offen", es: "pendiente" },
  pep8TabMessage: { de: "PEP 8: Verwende vier Leerzeichen statt Tabs.", es: "PEP 8: usá cuatro espacios en vez de tabs." },
  printUnclosedMessage: { de: "Klammer bei print() schließen.", es: "Cerrá el paréntesis de print()." },
  noProblemsMessage: { de: "Keine lokalen Strukturhinweise.", es: "Sin observaciones estructurales locales." },
  xpLabel: { de: "XP", es: "XP" },
  xpEarned: { de: "+{amount} XP", es: "+{amount} XP" },
  tabFeedback: { de: "Feedback", es: "Feedback" },
  tabNotifications: { de: "Benachrichtigungen", es: "Notificaciones" },
  feedbackPanelTitle: { de: "Feedback zur Mission", es: "Feedback de la misión" },
  feedbackPlaceholder: { de: "Frage oder Kommentar zu dieser Mission …", es: "Pregunta o comentario sobre esta misión…" },
  feedbackSubmit: { de: "Senden", es: "Enviar" },
  feedbackHintSignedOut: { de: "Melde dich an und wähle eine Klasse, um Feedback zu dieser Mission zu senden.", es: "Iniciá sesión y elegí una clase para enviar feedback de esta misión." },
  feedbackHintSignedIn: { de: "Sichtbar für deine Lehrkraft. Antworten erscheinen hier.", es: "Visible para tu docente. Las respuestas aparecen acá." },
  feedbackEmpty: { de: "Noch kein Feedback zu dieser Mission.", es: "Todavía no hay feedback para esta misión." },
  feedbackReplyLabel: { de: "Antworten an:", es: "Responder a:" },
  feedbackResolve: { de: "Als gelöst markieren", es: "Marcar como resuelto" },
  feedbackReopen: { de: "Wieder öffnen", es: "Reabrir" },
  feedbackStatusResolved: { de: "gelöst", es: "resuelto" },
  feedbackStatusOpen: { de: "offen", es: "abierto" },
  feedbackSent: { de: "✓ Feedback gesendet.", es: "✓ Feedback enviado." },
  notificationsPanelTitle: { de: "Benachrichtigungen", es: "Notificaciones" },
  notificationsMarkAll: { de: "Alle als gelesen markieren", es: "Marcar todas como leídas" },
  notificationsEmpty: { de: "Keine Benachrichtigungen.", es: "Sin notificaciones." },
  notificationsSignedOut: { de: "Melde dich an, um Benachrichtigungen zu sehen.", es: "Iniciá sesión para ver tus notificaciones." },
};

const $ = (selector) => document.querySelector(selector);
const storageKey = "python-studio-state-v2";
const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
const state = {
  current: Number.isInteger(stored.current) ? Math.max(0, Math.min(missions.length - 1, stored.current)) : 0,
  answers: stored.answers && typeof stored.answers === "object" ? stored.answers : {},
  solved: Array.isArray(stored.solved) ? stored.solved.filter((id) => missions.some((mission) => mission.id === id)) : [],
  attempts: Array.isArray(stored.attempts) ? stored.attempts.slice(-50) : [],
  hints: stored.hints && typeof stored.hints === "object" ? stored.hints : {},
  language: stored.language === "es" ? "es" : "de",
  xp: Number.isFinite(stored.xp) ? stored.xp : 0,
};
let cloud = { configured: false, user: null, csrf: "", classes: [], activeClassId: localStorage.getItem("python-studio-class") || "", assignments: [], syncTimer: null, feedback: [], notifications: [], unreadNotifications: 0 };

function t(key, vars = {}) {
  const entry = ui[key];
  const text = entry ? (entry[state.language] || entry.de) : key;
  return text.replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? ""));
}
function localized(field) { return field[state.language] || field.de; }
function mission() { return missions[state.current]; }
function saveLocal() { localStorage.setItem(storageKey, JSON.stringify(state)); }
function starterCode(item = mission()) { return `# Aufgabe: ${localized(item.prompt)}
# Schreibe deine eigene Python-Lösung darunter.

`; }
function activeAnswer() {
  const saved = state.answers[mission().id];
  return typeof saved === "string" ? saved : starterCode();
}

const XP_PER_MISSION = 30;
const XP_HINT_COST = 5;
function awardXp(amount) {
  state.xp = Math.max(0, state.xp + amount);
  saveLocal(); renderProgress();
}

const pythonCompletions = [
  { label: "print", insert: "print($END$)", description: { de: "Ausgabe in der Konsole", es: "Salida en la consola" } },
  { label: "input", insert: 'input("$END$")', description: { de: "Benutzereingabe lesen", es: "Leer entrada del usuario" } },
  { label: "int", insert: "int($END$)", description: { de: "Text in eine ganze Zahl umwandeln", es: "Convertir texto a un número entero" } },
  { label: "str", insert: "str($END$)", description: { de: "Wert in Text umwandeln", es: "Convertir un valor a texto" } },
  { label: "len", insert: "len($END$)", description: { de: "Länge einer Sequenz", es: "Longitud de una secuencia" } },
  { label: "range", insert: "range($END$)", description: { de: "Zahlenfolge für Schleifen", es: "Secuencia de números para bucles" } },
  { label: "if", insert: "if $END$:\n    pass", description: { de: "Bedingte Verzweigung", es: "Bifurcación condicional" } },
  { label: "else", insert: "else:\n    $END$", description: { de: "Alternative Verzweigung", es: "Bifurcación alternativa" } },
  { label: "elif", insert: "elif $END$:\n    pass", description: { de: "Weitere Bedingung", es: "Otra condición" } },
  { label: "for", insert: "for item in $END$:\n    print(item)", description: { de: "Über Sequenzen laufen", es: "Recorrer secuencias" } },
  { label: "while", insert: "while $END$:\n    pass", description: { de: "Wiederholen solange Bedingung gilt", es: "Repetir mientras se cumpla la condición" } },
  { label: "def", insert: "def $END$():\n    return", description: { de: "Eigene Funktion definieren", es: "Definir una función propia" } },
  { label: "list", insert: "[$END$]", description: { de: "Liste anlegen", es: "Crear una lista" } },
  { label: "append", insert: "append($END$)", description: { de: "Element an Liste anhängen", es: "Agregar un elemento a la lista" } },
  { label: "True", insert: "True", description: { de: "Wahrheitswert wahr", es: "Valor de verdad verdadero" } },
  { label: "False", insert: "False", description: { de: "Wahrheitswert falsch", es: "Valor de verdad falso" } },
];
function localizedCompletions() {
  return pythonCompletions.map((item) => ({ ...item, description: localized(item.description) }));
}
function rememberEditorChange(value) {
  state.answers[mission().id] = value;
  saveLocal(); renderProblems(); queueCloudSync();
}
function pythonDiagnostics(source) {
  const diagnostics = [];
  const tabIndex = source.indexOf("\t");
  if (tabIndex >= 0) diagnostics.push({ from: tabIndex, to: tabIndex + 1, severity: "warning", message: t("pep8TabMessage") });
  const openPrint = source.match(/\bprint\s*\([^)]*$/);
  if (openPrint) diagnostics.push({ from: source.length - openPrint[0].length, to: source.length, severity: "error", message: t("printUnclosedMessage") });
  return diagnostics;
}
const ideEditor = createIdeEditor({
  parent: $("#editorHost"),
  lang: "python",
  doc: activeAnswer(),
  completions: localizedCompletions(),
  lintSource: pythonDiagnostics,
  onChange: rememberEditorChange,
  ariaLabel: "Python Editor",
  watermark: "assets/python-logo-watermark.svg?v=2",
});
window.pythonIdeEditor = ideEditor; // Hook de test/depuración (Playwright lee el valor real del editor).
const TOOL_PANELS = ["console", "problems", "help", "progress", "feedback", "notifications"];
function setPanel(name) {
  document.querySelectorAll("[data-tool]").forEach((button) => {
    const active = button.dataset.tool === name;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-panel]").forEach((panel) => { panel.hidden = panel.dataset.panel !== name; });
}
function renderProgress() {
  const percent = Math.round(state.solved.length / missions.length * 100);
  $("#progress").textContent = `${state.solved.length} / ${missions.length}`;
  $("#bar").style.width = `${percent}%`;
  $("#progressText").textContent = t("progressTextTemplate", { solved: state.solved.length, total: missions.length });
  $("#commandProgress").textContent = `${percent}%`;
  $("#commandProgressMeta").textContent = t("progressMetaTemplate", { solved: state.solved.length, total: missions.length });
  $("#xp").textContent = String(state.xp);
  $("#attempts").replaceChildren(...state.attempts.slice(-6).reverse().map((attempt) => {
    const item = document.createElement("li"); item.textContent = attempt; return item;
  }));
}
function renderProblems() {
  const diagnostics = pythonDiagnostics(activeAnswer());
  const problems = diagnostics.length ? diagnostics.map((diagnostic) => diagnostic.message) : [t("noProblemsMessage")];
  $("#problems").replaceChildren(...problems.map((message) => { const item = document.createElement("li"); item.textContent = message; return item; }));
}
function renderMissions() {
  $("#missions").replaceChildren(...missions.map((item, index) => {
    const button = document.createElement("button");
    button.className = index === state.current ? "active" : "";
    button.setAttribute("aria-current", index === state.current ? "step" : "false");
    button.innerHTML = `<small>${String(index + 1).padStart(2, "0")}</small> ${localized(item.title)}`;
    button.onclick = () => { state.current = index; saveLocal(); render(); $("#title").focus(); };
    return button;
  }));
}
function renderCloud() {
  const signedIn = Boolean(cloud.user);
  $("#cloudStatus").textContent = signedIn ? t("cloudConnected", { name: cloud.user.name }) : (cloud.configured ? t("cloudNotSignedIn") : t("cloudNotConfigured"));
  $("#cloudClass").disabled = !signedIn;
  $("#cloudClass").replaceChildren(Object.assign(document.createElement("option"), { value: "", textContent: t("classSelectPlaceholder") }), ...cloud.classes.map((item) => Object.assign(document.createElement("option"), { value: item.id, textContent: item.name })));
  $("#cloudClass").value = cloud.activeClassId;
  $("#teacherAssignment").hidden = !(signedIn && ["teacher", "admin"].includes(cloud.user.role) && cloud.activeClassId);
  $("#assignmentList").replaceChildren(...cloud.assignments.map((assignment) => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${assignment.title}</strong><span>${assignment.due_at ? ` · ${assignment.due_at}` : ""}</span>`;
    const submit = document.createElement("button"); submit.type = "button"; submit.textContent = t("submitCodeButton");
    submit.onclick = () => submitAssignment(assignment); item.append(" ", submit); return item;
  }));
  if (signedIn && cloud.activeClassId && !cloud.assignments.length) $("#assignmentList").textContent = t("noAssignments");
}
function renderVideo(video, item) {
  const [videoId, videoTitle, start] = video;
  const params = new URLSearchParams({ autoplay: "1", rel: "0", modestbranding: "1", playsinline: "1" });
  if (start) params.set("start", String(start));
  $("#videoFrame").src = "about:blank"; $("#videoFrame").hidden = true;
  $("#videoFrame").dataset.embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  $("#videoFrame").title = `${videoTitle} · ${localized(item.title)}`;
  $("#videoPreview").hidden = false;
  $("#videoThumb").src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  $("#videoThumb").alt = `${videoTitle} · ${localized(item.title)}`;
  $("#videoExternal").href = `https://www.youtube.com/watch?v=${videoId}${start ? `&t=${start}s` : ""}`;
  $("#videoTitle").textContent = videoTitle;
}
function playVideo() {
  const embedUrl = $("#videoFrame").dataset.embedUrl;
  if (!embedUrl) return;
  $("#videoFrame").src = embedUrl; $("#videoFrame").hidden = false; $("#videoPreview").hidden = true;
}
let consoleTouched = false;
function applyI18n() {
  document.documentElement.lang = state.language;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel)));
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder)));
  document.querySelectorAll("[data-lang]").forEach((button) => button.classList.toggle("active", button.dataset.lang === state.language));
  // #console lo pisa runCode()/showTrace()/reset con contenido real: si el alumno ya
  // corrió algo, cambiar de idioma no debe borrarle la salida por el placeholder.
  if (!consoleTouched) $("#console").textContent = t("consoleHintInitial");
}
function setLanguage(lang) {
  state.language = lang === "es" ? "es" : "de";
  saveLocal();
  applyI18n();
  ideEditor.setCompletions(localizedCompletions());
  render();
  renderNotifications();
}
function render() {
  const item = mission(); const video = videos[item.video];
  $("#stage").textContent = item.stage; $("#title").textContent = localized(item.title); $("#objective").textContent = localized(item.objective); $("#prompt").textContent = localized(item.prompt);
  $("#commandNextMission").textContent = localized(item.title);
  $("#commandNextMeta").textContent = t("nextMetaTemplate", { stage: item.stage, n: String(state.current + 1).padStart(2, "0") });
  $("#commandTopic").textContent = localized(item.objective);
  $("#file").textContent = $("#tab").textContent = `mission_${String(state.current + 1).padStart(2, "0")}.py`;
  $("#tree").textContent = `　　${$("#file").textContent}`; renderVideo(video, item);
  ideEditor.setValue(activeAnswer());
  $("#helpText").textContent = t("helpTextTemplate", { objective: localized(item.objective) });
  renderMissions(); renderProblems(); renderProgress(); renderCloud(); loadFeedback();
}
function structurePassed() { return mission().rules.every((rule) => rule.test(activeAnswer())); }
function appendAttempt(passed) {
  state.attempts.push(t("attemptLine", { time: new Date().toLocaleTimeString(), n: state.current + 1, status: passed ? t("attemptPassed") : t("attemptOpen") }));
  state.attempts = state.attempts.slice(-50); saveLocal(); renderProgress();
}
function feedback(message, kind = "") { $("#result").hidden = false; $("#result").className = `result ${kind}`; $("#result").textContent = message; }
function setConsole(text) { $("#console").textContent = text; consoleTouched = true; }
async function runCode() {
  const localPass = structurePassed(); appendAttempt(localPass);
  if (localPass && !state.solved.includes(mission().id)) { state.solved.push(mission().id); saveLocal(); awardXp(XP_PER_MISSION); }
  $("#status").textContent = t("statusRunning"); $("#check").disabled = true;
  try {
    const response = await fetch("api/python.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ source: activeAnswer() }) });
    const payload = await response.json();
    if (!response.ok || !payload.ok) throw new Error(payload.error || payload.stderr || "Python konnte nicht ausgeführt werden.");
    setConsole(`> python ${$("#file").textContent}\n${payload.stdout || t("consoleNoOutput")}${payload.stderr ? `\n${payload.stderr}` : ""}`);
    feedback(localPass ? t("feedbackLocalOk") : t("feedbackRunOnly"), localPass ? "ok" : "");
  } catch (error) {
    setConsole(`${t("consoleOfflineHeader", { passed: localPass ? t("passedYes") : t("passedNo") })}\n> Runtime: ${error.message}\n\n${t("consoleOfflineNote")}`);
    feedback(localPass ? t("feedbackOfflineOk") : t("feedbackOfflineFail"), localPass ? "" : "bad");
  } finally { $("#status").textContent = t("statusReady"); $("#check").disabled = false; queueCloudSync(); }
}
function showTrace() {
  const steps = activeAnswer().split("\n").map((line, index) => {
    const content = line.trim(); if (!content) return null;
    const n = index + 1;
    if (/^[A-Za-z_]\w*\s*=/.test(content)) return t("traceLineVar", { n, content });
    if (/^(if|while|for)\b/.test(content)) return t("traceLineControl", { n, content });
    if (/^def\b/.test(content)) return t("traceLineFunc", { n, content });
    return t("traceLineDefault", { n, content });
  }).filter(Boolean);
  setConsole(`${t("traceHeader")}\n${steps.join("\n") || t("traceEmpty")}`);
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
  try { await cloudRequest("api/submissions.php?action=submit", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": cloud.csrf }, body: JSON.stringify({ assignmentId: Number(assignment.id), sourceCode, note: "Python Studio" }) }); feedback(t("submitOk"), "ok"); } catch (error) { feedback(error.message, "bad"); }
}
function isEducator() { return Boolean(cloud.user) && ["teacher", "admin"].includes(cloud.user.role); }
async function loadFeedback() {
  cloud.feedback = [];
  if (!cloud.user || !cloud.activeClassId) return renderFeedback();
  try {
    cloud.feedback = (await cloudRequest(`api/feedback.php?action=list&classId=${encodeURIComponent(cloud.activeClassId)}&missionId=${encodeURIComponent(mission().id)}`)).feedback || [];
  } catch { cloud.feedback = []; }
  renderFeedback();
}
function renderFeedback() {
  const signedIn = Boolean(cloud.user) && Boolean(cloud.activeClassId);
  $("#feedbackHint").textContent = signedIn ? t("feedbackHintSignedIn") : t("feedbackHintSignedOut");
  $("#feedbackForm").hidden = !signedIn;
  const roots = cloud.feedback.filter((item) => !item.parent_id);
  $("#feedbackThread").replaceChildren(...(cloud.feedback.length ? cloud.feedback.map((item) => {
    const li = document.createElement("li");
    if (item.parent_id) li.classList.add("is-reply");
    const meta = document.createElement("div"); meta.className = "feedback-meta";
    const author = document.createElement("b"); author.textContent = `${item.author} (${item.role})`;
    const time = document.createElement("span"); time.textContent = new Date(item.created_at).toLocaleString();
    meta.append(author, time);
    const message = document.createElement("p"); message.textContent = item.message;
    li.append(meta, message);
    if (!item.parent_id) {
      const status = document.createElement("span"); status.textContent = ` · ${item.status === "resolved" ? t("feedbackStatusResolved") : t("feedbackStatusOpen")}`;
      meta.append(status);
      if (isEducator()) {
        const actions = document.createElement("div"); actions.className = "feedback-actions";
        const toggle = document.createElement("button"); toggle.type = "button";
        toggle.textContent = item.status === "resolved" ? t("feedbackReopen") : t("feedbackResolve");
        toggle.onclick = () => toggleFeedbackStatus(item.id, item.status === "resolved" ? "open" : "resolved");
        const reply = document.createElement("button"); reply.type = "button"; reply.textContent = `${t("feedbackReplyLabel")} ${item.author}`;
        reply.onclick = () => { $("#feedbackReplyTo").value = String(item.id); $("#feedbackForm").querySelector("textarea").focus(); };
        actions.append(toggle, reply);
        li.append(actions);
      }
    }
    return li;
  }) : [Object.assign(document.createElement("li"), { textContent: t("feedbackEmpty") })]));
  const replySelect = $("#feedbackReplyTo");
  replySelect.hidden = !isEducator() || !roots.length;
  replySelect.replaceChildren(...roots.map((item) => Object.assign(document.createElement("option"), { value: String(item.id), textContent: `${t("feedbackReplyLabel")} ${item.author}` })));
}
async function toggleFeedbackStatus(feedbackId, status) {
  try { await cloudRequest("api/feedback.php?action=status", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": cloud.csrf }, body: JSON.stringify({ classId: Number(cloud.activeClassId), feedbackId, status }) }); await loadFeedback(); } catch (error) { feedback(error.message, "bad"); }
}
async function loadNotifications() {
  if (!cloud.user) { cloud.notifications = []; cloud.unreadNotifications = 0; return renderNotifications(); }
  try {
    const payload = await cloudRequest("api/notifications.php?action=list");
    cloud.notifications = payload.notifications || []; cloud.unreadNotifications = payload.unread || 0;
  } catch { cloud.notifications = []; cloud.unreadNotifications = 0; }
  renderNotifications();
}
function renderNotifications() {
  const badge = $("#notifBadge");
  badge.hidden = cloud.unreadNotifications < 1; badge.textContent = String(cloud.unreadNotifications);
  if (!cloud.user) { $("#notificationList").replaceChildren(Object.assign(document.createElement("li"), { textContent: t("notificationsSignedOut") })); return; }
  $("#notificationList").replaceChildren(...(cloud.notifications.length ? cloud.notifications.map((item) => {
    const li = document.createElement("li"); li.dataset.read = String(Boolean(item.read_at));
    const title = document.createElement("strong"); title.textContent = item.title;
    const message = document.createElement("p"); message.style.margin = "2px 0 0"; message.textContent = item.message;
    const time = document.createElement("time"); time.textContent = new Date(item.created_at).toLocaleString();
    li.append(title, message, time);
    return li;
  }) : [Object.assign(document.createElement("li"), { textContent: t("notificationsEmpty") })]));
}
async function markAllNotificationsRead() {
  if (!cloud.user || !cloud.notifications.some((item) => !item.read_at)) return;
  try { await cloudRequest("api/notifications.php?action=read", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": cloud.csrf }, body: JSON.stringify({ all: true }) }); await loadNotifications(); } catch { /* best-effort */ }
}
async function initCloud() {
  try {
    const session = await cloudRequest("api/auth.php?action=me"); cloud.configured = session.configured !== false; cloud.user = session.user; cloud.csrf = session.csrf || "";
    if (!cloud.user) return renderCloud();
    const [progress, classes] = await Promise.all([cloudRequest("api/progress.php"), cloudRequest("api/classes.php?action=list")]);
    (progress.progress || []).forEach((row) => { if (missions.some((item) => item.id === row.mission_id)) { if (row.answer) state.answers[row.mission_id] = row.answer; if (row.solved_at && !state.solved.includes(row.mission_id)) state.solved.push(row.mission_id); } });
    cloud.classes = classes.classes || []; if (!cloud.classes.some((item) => String(item.id) === cloud.activeClassId)) cloud.activeClassId = cloud.classes[0] ? String(cloud.classes[0].id) : "";
    saveLocal(); await loadAssignments(); await loadNotifications(); await loadFeedback(); render();
  } catch { cloud.configured = false; renderCloud(); }
}

// Botones de bienvenida, en paralelo a los de Java (commandContinue / exploreProjects):
// primario salta al editor de la misión actual, secundario a la lista de misiones.
$("#pyOpenMission").onclick = () => { $(".ide").scrollIntoView({ behavior: "smooth", block: "start" }); ideEditor.focusEnd(); };
$("#pyBrowseMissions").onclick = () => { $(".mission-rail").scrollIntoView({ behavior: "smooth", block: "start" }); $("#missions button")?.focus(); };
$("#videoPreview").onclick = playVideo;
$("#check").onclick = runCode;
$("#trace").onclick = showTrace;
$("#hint").onclick = () => {
  state.hints[mission().id] = (state.hints[mission().id] || 0) + 1; awardXp(-XP_HINT_COST); setPanel("help");
  $("#helpText").textContent = t("hintTemplate", { hint: localized(mission().prompt).split(". ")[0] });
  queueCloudSync();
};
$("#help").onclick = () => setPanel("help");
$("#reset").onclick = () => { delete state.answers[mission().id]; saveLocal(); $("#result").hidden = true; consoleTouched = false; $("#console").textContent = t("resetConsoleMessage"); render(); ideEditor.focusEnd(); };
$("#theme").onclick = () => { document.body.classList.toggle("light"); localStorage.setItem("python-studio-theme", document.body.classList.contains("light") ? "light" : "dark"); };
document.querySelectorAll("[data-lang]").forEach((button) => button.onclick = () => setLanguage(button.dataset.lang));
$("#cloudClass").onchange = async (event) => { cloud.activeClassId = event.target.value; localStorage.setItem("python-studio-class", cloud.activeClassId); await loadAssignments(); await loadFeedback(); };
$("#teacherAssignment").onsubmit = async (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); try { await cloudRequest("api/assignments.php?action=create", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": cloud.csrf }, body: JSON.stringify({ classId: Number(cloud.activeClassId), missionId: mission().id, title: form.get("title"), dueAt: form.get("dueAt") || null }) }); event.currentTarget.reset(); await loadAssignments(); } catch (error) { feedback(error.message, "bad"); } };
$("#feedbackForm").onsubmit = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = form.message.value.trim();
  if (!message) return;
  const parentId = Number($("#feedbackReplyTo").value || 0);
  try {
    await cloudRequest("api/feedback.php?action=create", { method: "POST", headers: { "Content-Type": "application/json", "X-CSRF-Token": cloud.csrf }, body: JSON.stringify({ classId: Number(cloud.activeClassId), missionId: mission().id, message, parentId }) });
    form.reset(); feedback(t("feedbackSent"), "ok"); await loadFeedback();
  } catch (error) { feedback(error.message, "bad"); }
};
$("#notificationsMarkAll").onclick = markAllNotificationsRead;
document.querySelectorAll("[data-tool]").forEach((button) => button.onclick = () => { setPanel(button.dataset.tool); if (button.dataset.tool === "notifications") loadNotifications(); });
$(".tool-tabs").addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const tabs = [...document.querySelectorAll("[data-tool]")];
  const current = tabs.indexOf(document.activeElement);
  if (current < 0) return;
  event.preventDefault();
  const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].focus(); setPanel(tabs[next].dataset.tool); if (tabs[next].dataset.tool === "notifications") loadNotifications();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "F5") { event.preventDefault(); runCode(); return; }
  if ((event.ctrlKey || event.altKey) && /^[1-6]$/.test(event.key)) {
    const panel = TOOL_PANELS[Number(event.key) - 1];
    if (panel) { event.preventDefault(); setPanel(panel); if (panel === "notifications") loadNotifications(); document.querySelector(`[data-tool="${panel}"]`)?.focus(); }
  }
});

const storedTheme = localStorage.getItem("python-studio-theme");
if (storedTheme === "light" || (!storedTheme && window.matchMedia?.("(prefers-color-scheme: light)").matches)) document.body.classList.add("light");

applyI18n(); render(); initCloud();
