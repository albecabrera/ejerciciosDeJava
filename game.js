const STORAGE_KEY = "java-werkstatt-state-v3";
const LEGACY_STORAGE_KEYS = ["java-werkstatt-state-v2", "java-werkstatt-state", "javaWerkstattState"];
const THEME_STORAGE_KEY = "java-werkstatt-theme";
const EDITOR_PREFS_STORAGE_KEY = "java-werkstatt-editor-prefs";
const ONBOARDING_STORAGE_KEY = "java-werkstatt-onboarding-v1";
const BASE_XP = 30;
const HINT_COST = 5;
const SOLUTION_COST = 15;
const COMPILER_API_URL = "api/compile.php";
const ATTEMPT_API_URL = "api/attempts.php";
const HISTORICAL_MISSION_IDS_V2 = [
  "types", "condition", "loop", "method", "arrays", "class", "list", "debug",
  "strings", "while-input", "uml-model", "tests-thinking",
  "inheritance", "polymorphism", "stack", "queue", "linked-list", "recursion",
  "linear-search", "binary-search", "insertion-sort", "efficiency", "bst", "graph-bfs",
  "dfa", "grammar", "parser", "sql", "normalization", "network", "caesar", "privacy",
  "von-neumann", "concurrency-limits", "halting-limit", "hash-map",
];

const ui = {
  es: {
    documentTitle: "Java Werkstatt · Laboratorio de código",
    skipLink: "Saltar al editor",
    brandAria: "Java Werkstatt, inicio",
    learningPathAria: "Ruta de aprendizaje",
    missionsAria: "Misiones",
    xpAria: "Experiencia acumulada",
    progressAria: "Progreso de misiones",
    masteryAria: "Dominio estimado",
    suggestionsAria: "Sugerencias de código",
    templatesAria: "Plantillas Java disponibles",
    contextAria: "Contexto del archivo",
    brandTagline: "Laboratorio de código",
    courseLabel: "Ruta práctica",
    courseTitle: "Java desde los cimientos",
    courseIntro: "49 misiones y 5 proyectos de EF a Q2. Escribís, compilás y construís productos reales.",
    commandLabel: "Mesa de trabajo",
    welcomeGreeting: "Bienvenido a Java Werkstatt",
    commandTitle: "Tu próxima decisión está clara",
    commandNextLabel: "Siguiente misión",
    commandContinue: "Abrir misión",
    commandContinueAria: "Abrir misión. Atajo Alt más R.",
    commandResume: "Reanudar misión",
    commandResumeAria: "Reanudar misión. Atajo Alt más R.",
    welcomeStepsAria: "Cómo empezar",
    welcomeStepChoose: "Elegí una misión",
    welcomeStepCode: "Escribí y compilá",
    welcomeStepProgress: "Guardá tu progreso",
    exploreProjects: "Explorar proyectos",
    onboardingLabel: "Primera visita",
    onboardingTitle: "Tu taller Java, sin distracciones",
    onboardingDescription: "Elegí una misión, escribí código y validalo. Tutoriales y ayudas aparecen solo cuando los necesitás.",
    onboardingClose: "Empezar",
    commandProgressLabel: "Progreso",
    commandProjectLabel: "Proyecto activo",
    commandNarrative: "No adivines por dónde seguir: el tablero une misión, proyecto y evidencia en una ruta visible.",
    commandComplete: "Ruta completa",
    commandMissionsSolved: "{solved}/{total} misiones resueltas",
    commandProjectProgress: "{solved}/{total} pasos",
    commandOpenProject: "Abrir proyecto",
    commandProjectLocked: "Bloqueado",
    commandProjectLockedAria: "{project} bloqueado. Completá la ruta anterior para abrirlo.",
    dashboardBack: "Proyectos",
    workspaceLabel: "Espacio de trabajo",
    workspaceFocus: "Tarea · Editor · Validación",
    resourcesLabel: "Recursos",
    resourcesTitle: "Ayuda cuando la necesites",
    resourcesAria: "Recursos de la misión",
    resourceTutorial: "Tutorial",
    resourceDocs: "Documentación",
    resourceGuidance: "Pistas y solución",
    toolWindowTitle: "Herramientas",
    toolsAria: "Herramientas del espacio de trabajo",
    toolConsole: "Consola",
    toolProblems: "Problemas",
    toolProgress: "Progreso",
    freePractice: "Practicar cualquier misión",
    freePracticeOn: "Modo libre activo",
    projectNavigatorLabel: "Proyecto actual",
    projectNavigatorTitle: "Ruta de entrega",
    projectSelectLabel: "Elegir proyecto",
    projectContinue: "Continuar ruta",
    projectCheckpoint: "Ir al checkpoint",
    projectContextLabel: "Contexto de proyecto",
    projectDeliverableLabel: "Entregable",
    projectEvidenceLabel: "Evidencia",
    projectStep: "Paso {current} de {total}",
    storageNote: "Progreso guardado en este navegador",
    taskLabel: "Tu tarea",
    conceptLabel: "Concepto",
    lessonVideoLabel: "Antes de empezar",
    lessonVideoTitle: "Prepará la misión con un video",
    lessonVideoOpen: "Abrir video en YouTube",
    lessonVideoPlay: "Reproducir preparación",
    docsLabel: "Documentación oficial",
    docsTitle: "¿Querés profundizar?",
    docsBadge: "Java SE",
    docsIntro: "Consultá sintaxis, ejemplos y API directamente en las fuentes oficiales. Los enlaces se adaptan a esta misión.",
    docsAria: "Documentación oficial relacionada",
    docsOpen: "Abrir documentación oficial",
    docsSource: "Fuente oficial",
    localValidation: "Validación estructural local",
    compileRailLabel: "Compile Rail",
    compileRailTitle: "Del código a la evidencia",
    compileRailReady: "Escribí y pulsá F5.",
    compileRailRequesting: "Solicitud pendiente: el backend informará si compiló y si ejecutó.",
    compileRailValidating: "Contrastando salida y evidencia pedagógica.",
    compileRailVerifiedRun: "javac compiló, java ejecutó y la evidencia pedagógica fue validada.",
    compileRailVerifiedCompile: "javac compiló el contexto; ejecución omitida y evidencia validada.",
    compileRailLocal: "Backend no disponible: solo validación heurística local.",
    compileRailFailed: "El flujo se detuvo en {phase}.",
    workbenchMission: "Misión",
    workbenchFile: "Archivo",
    workbenchAutosave: "Guardado",
    workbenchAutosaveValue: "Local",
    workbenchShortcut: "Atajo",
    compileWrite: "Escribir",
    compileCompile: "Compilar",
    compileRun: "Ejecutar",
    compileValidate: "Validar",
    compileExplain: "Explicar",
    compileStatePending: "pendiente",
    compileStateRequested: "solicitado al backend; resultado pendiente",
    compileStateActive: "en validación",
    compileStateDone: "verificado",
    compileStateSkipped: "omitido o no alcanzado",
    compileStateLocal: "no verificado; backend no disponible",
    compileStateError: "falló",
    editorLabel: "Editor Java",
    shortcut: "F5 para comprobar · Tab expande plantillas · ⌥⇧↓ duplica",
    themeToggle: "Modo oscuro",
    themeToggleAria: "Cambiar a modo oscuro",
    themeToggleLight: "Modo claro",
    themeToggleLightAria: "Cambiar a modo claro",
    debugToggle: "Bugs",
    debugToggleAria: "Abrir checklist de bugs",
    editorToolsAria: "Herramientas del editor",
    sidebarShow: "Mostrar ruta",
    sidebarHide: "Ocultar ruta",
    sidebarShowAria: "Mostrar ruta de misiones",
    sidebarHideAria: "Ocultar ruta de misiones",
    focusEnter: "Modo enfoque",
    focusExit: "Salir de enfoque",
    focusEnterAria: "Activar modo enfoque del editor",
    focusExitAria: "Salir del modo enfoque del editor",
    editorToolbarHint: "Esc sale del modo enfoque · los atajos del editor se mantienen",
    consoleTitle: "Consola del editor",
    consoleReady: "Lista para F5",
    consoleChecking: "Comprobando estructura…",
    consoleSuccess: "Estructura aceptada",
    consoleError: "Hay errores · revisá los diagnósticos",
    consolePlaceholder: "La salida de F5 aparecerá acá. Para ver resultado real, imprimí con System.out.println(...).",
    consoleHint: "Para que aparezca salida, el programa tiene que imprimir con System.out.print(...) o System.out.println(...).",
    consoleNoStdout: "El programa se ejecutó, pero no imprimió nada en stdout.",
    consolePrintRequired: "Sin salida visible: agregá System.out.println(...) para ver el resultado en consola.",
    compilerOnline: "Compilador PHP conectado",
    compilerOffline: "Compilador PHP no disponible · modo local",
    compilerConnecting: "Conectando con javac…",
    compilerSuccess: "Compilación real aceptada",
    compilerError: "javac encontró errores",
    compilerHint: "Compilación y ejecución aisladas en backend; la consola muestra solo lo que tu código imprime.",
    runnerSuccess: "Ejecución real completada",
    runnerError: "El programa compiló, pero falló al ejecutarse",
    pedagogicError: "La salida no demuestra todavía el objetivo de la misión",
    teacherToggle: "Panel docente",
    teacherTitle: "Panel docente",
    teacherIntro: "Resumen local del alumno y, si iniciás sesión como docente, progreso centralizado de la clase.",
    teacherLocalNote: "Sin cuenta docente se muestra solo el progreso guardado en este navegador.",
    teacherCloudEmpty: "Elegí una clase para ver el progreso centralizado.",
    teacherCloudLoading: "Cargando progreso de clase…",
    teacherCloudError: "No se pudo cargar el progreso de clase.",
    teacherCloudStudents: "Estudiantes",
    teacherLastActivity: "Última actividad",
    teacherHistory: "Historial",
    teacherNoHistory: "Sin historial de intentos.",
    teacherWeakness: "A reforzar",
    teacherRecommendation: "Recomendación",
    teacherSolved: "Misiones resueltas",
    teacherAttempts: "Intentos",
    teacherAccuracy: "Precisión",
    teacherNeedsPractice: "Para seguir practicando",
    mentorLabel: "Mentor de práctica",
    mentorTitle: "Qué haría ahora",
    mentorAction: "Practicar recomendación",
    mentorAdviceStart: "Empezá por {mission}: fundamentos antes de velocidad.",
    mentorAdviceHints: "Volvé a {mission} sin pedir pista: entender el concepto vale más que pasar rápido.",
    mentorAdviceAttempts: "Repetí {mission} trazando valores a mano antes de ejecutar.",
    mentorAdviceProject: "Buen momento para avanzar en {project}: llevá lo aprendido a un producto real.",
    mentorAdviceComplete: "Ruta completa: elegí un proyecto avanzado y reescribilo sin mirar soluciones.",
    teacherStage: "Nivel",
    teacherAllStages: "Todos los niveles",
    teacherExport: "Exportar CSV",
    teacherExportJson: "Exportar JSON",
    teacherNoPractice: "Todavía no hay misiones pendientes.",
    accountTitle: "Cuenta central",
    accountLogin: "Iniciar sesión",
    accountRegister: "Crear cuenta",
    accountLogout: "Cerrar sesión",
    accountName: "Nombre",
    accountEmail: "Email",
    accountPassword: "Contraseña",
    accountOffline: "Modo local: configurá PHP y MySQL para sincronizar.",
    accountConnected: "Sincronización central activa",
    accountStudent: "Estudiante",
    accountTeacher: "Docente",
    classSelect: "Clase",
    classNone: "Sin clase seleccionada",
    className: "Nombre de clase",
    classCode: "Código de acceso",
    classCreate: "Crear clase",
    classJoin: "Unirse",
    shortcutHelpLabel: "Atajos IDEA",
    shortcutHelpTitle: "Teclado productivo",
    shortcutHelpIntro:
      "Atajos locales inspirados en IntelliJ IDEA. Escribí una abreviatura y pulsá Tab para expandir una plantilla; si no coincide, Tab inserta 4 espacios.",
    shortcutCheck: "Comprobar estructura",
    shortcutHint: "Pedir pista/intención",
    shortcutComment: "Comentar/descomentar selección o línea",
    shortcutDuplicate: "Duplicar línea o bloque seleccionado",
    shortcutMoveLine: "Subir/bajar línea o bloque seleccionado",
    shortcutClear: "Limpiar editor cuando tiene foco",
    shortcutNavigate: "Navegar misión anterior/siguiente si está disponible",
    shortcutEscape: "Salir de enfoque, cerrar feedback o devolver foco al editor",
    liveTemplatesSummary: "Live Templates · Plantillas Java rápidas",
    shortcutSummary: "IDEA-Kürzel · Atajos de teclado",
    liveTemplatesLabel: "Live Templates",
    liveTemplatesTitle: "Plantillas Java rápidas",
    liveTemplatesIntro:
      "Simulación educativa local inspirada en Live Templates de IntelliJ: abreviatura + Tab dentro del editor.",
    liveTemplatesAvailable: "Disponibles",
    completionTitle: "Completar código",
    diagnosticsLabel: "Asistencia local",
    diagnosticsTitle: "Diagnósticos e indentación",
    diagnosticsNotice: "Avisos heurísticos locales: orientan, pero no compilan ni garantizan Java válido.",
    bugChecklistLabel: "Cambios pendientes",
    bugChecklistTitle: "Mi checklist de bugs",
    bugChecklistIntro: "Anotá lo que querés cambiar. Enter crea una nueva casilla.",
    bugChecklistPlaceholder: "Escribí un cambio…",
    bugChecklistRemove: "Eliminar ítem",
    format: "Formatear a 4 espacios",
    noDiagnostics: "Sin avisos heurísticos en este bloque.",
    progressLabel: "Aprendizaje transparente",
    progressTitle: "Tu progreso",
    check: "Compilar y validar",
    hint: "Pedir pista",
    reveal: "Ver solución",
    next: "Siguiente misión",
    finish: "Ruta completada",
    hintTitle: "Pista del mentor",
    reset: "Reiniciar todo el progreso",
    mission: "Misión",
    difficulty: { easy: "Inicial", medium: "Intermedia", hard: "Avanzada" },
    editorPlaceholder: "// Escribí solamente el bloque que falta",
    emptyTitle: "El editor está vacío",
    emptyMessage: "Escribí el bloque solicitado antes de comprobarlo.",
    errorTitle: "La estructura todavía no cierra",
    successTitle: "Flujo validado",
    successMessage: "La solución superó el flujo disponible para esta misión.",
    alreadySolved: "Esta misión ya estaba resuelta. Podés revisar la explicación o seguir.",
    validationLocalNote: "El backend no respondió: este intento se aceptó solo con reglas heurísticas locales.",
    validationCompileNote: "javac compiló el contexto real de la misión; la regla pedagógica se validó después.",
    validationRunNote: "javac compiló y java ejecutó el programa; la salida real también pasó la regla pedagógica.",
    validationSavedNote: "Resultado guardado de un intento anterior; pulsá F5 para volver a verificar el pipeline.",
    hintLevel: "Pista {current} de {total}",
    noMoreHints: "Ya viste todas las pistas disponibles.",
    solutionIntro: "Solución de referencia",
    solutionPenalty: "Revelaste la solución. Estudiala, reescribila y comprobá la estructura.",
    completed: "Completada",
    locked: "Bloqueada",
    unlocked: "Disponible",
    resetConfirm: "¿Querés borrar respuestas, XP y progreso guardado?",
    allDoneTitle: "Ruta completada",
    allDoneMessage:
      "Terminaste las 49 misiones y sus cinco entregas. Repetí las que te costaron sin pistas: ahí se consolida el aprendizaje.",
  },
  de: {
    documentTitle: "Java Werkstatt · Code-Labor",
    skipLink: "Zum Editor springen",
    brandAria: "Java Werkstatt, Startseite",
    learningPathAria: "Lernpfad",
    missionsAria: "Missionen",
    xpAria: "Gesammelte Erfahrungspunkte",
    progressAria: "Missionsfortschritt",
    masteryAria: "Geschätzter Lernstand",
    suggestionsAria: "Codevorschläge",
    templatesAria: "Verfügbare Java-Vorlagen",
    contextAria: "Dateikontext",
    brandTagline: "Code-Labor",
    courseLabel: "Praxispfad",
    courseTitle: "Java vom Fundament an",
    courseIntro: "49 Missionen und 5 Projekte von EF bis Q2. Du schreibst, kompilierst und baust echte Produkte.",
    commandLabel: "Werkbank",
    welcomeGreeting: "Willkommen in der Java Werkstatt",
    commandTitle: "Deine nächste Entscheidung ist klar",
    commandNextLabel: "Nächste Mission",
    commandContinue: "Mission öffnen",
    commandContinueAria: "Mission öffnen. Tastenkürzel Alt plus R.",
    commandResume: "Mission fortsetzen",
    commandResumeAria: "Mission fortsetzen. Tastenkürzel Alt plus R.",
    welcomeStepsAria: "So startest du",
    welcomeStepChoose: "Mission auswählen",
    welcomeStepCode: "Schreiben und kompilieren",
    welcomeStepProgress: "Fortschritt speichern",
    exploreProjects: "Projekte erkunden",
    onboardingLabel: "Erster Besuch",
    onboardingTitle: "Deine Java-Werkstatt ohne Ablenkung",
    onboardingDescription: "Wähle eine Mission, schreibe Code und validiere ihn. Tutorials und Hilfen erscheinen nur bei Bedarf.",
    onboardingClose: "Starten",
    commandProgressLabel: "Fortschritt",
    commandProjectLabel: "Aktives Projekt",
    commandNarrative: "Rätsle nicht über den nächsten Schritt: Das Dashboard verbindet Mission, Projekt und Nachweis in einem sichtbaren Pfad.",
    commandComplete: "Route abgeschlossen",
    commandMissionsSolved: "{solved}/{total} Missionen gelöst",
    commandProjectProgress: "{solved}/{total} Schritte",
    commandOpenProject: "Projekt öffnen",
    commandProjectLocked: "Gesperrt",
    commandProjectLockedAria: "{project} ist gesperrt. Schließe zuerst den vorherigen Pfad ab.",
    dashboardBack: "Projekte",
    workspaceLabel: "Arbeitsbereich",
    workspaceFocus: "Aufgabe · Editor · Validierung",
    resourcesLabel: "Ressourcen",
    resourcesTitle: "Hilfe genau dann, wenn du sie brauchst",
    resourcesAria: "Ressourcen der Mission",
    resourceTutorial: "Tutorial",
    resourceDocs: "Dokumentation",
    resourceGuidance: "Hinweise und Lösung",
    toolWindowTitle: "Werkzeuge",
    toolsAria: "Werkzeuge des Arbeitsbereichs",
    toolConsole: "Konsole",
    toolProblems: "Probleme",
    toolProgress: "Fortschritt",
    freePractice: "Jede Mission frei üben",
    freePracticeOn: "Freier Modus aktiv",
    projectNavigatorLabel: "Aktuelles Projekt",
    projectNavigatorTitle: "Abgaberoute",
    projectSelectLabel: "Projekt wählen",
    projectContinue: "Route fortsetzen",
    projectCheckpoint: "Zum Checkpoint",
    projectContextLabel: "Projektkontext",
    projectDeliverableLabel: "Abgabe",
    projectEvidenceLabel: "Nachweis",
    projectStep: "Schritt {current} von {total}",
    storageNote: "Fortschritt in diesem Browser gespeichert",
    taskLabel: "Deine Aufgabe",
    conceptLabel: "Konzept",
    lessonVideoLabel: "Vor dem Start",
    lessonVideoTitle: "Bereite die Mission mit einem Video vor",
    lessonVideoOpen: "Video auf YouTube öffnen",
    lessonVideoPlay: "Vorbereitung abspielen",
    docsLabel: "Offizielle Dokumentation",
    docsTitle: "Möchtest du tiefer einsteigen?",
    docsBadge: "Java SE",
    docsIntro: "Lies Syntax, Beispiele und API direkt in den offiziellen Quellen. Die Links passen sich an diese Mission an.",
    docsAria: "Verwandte offizielle Dokumentation",
    docsOpen: "Offizielle Dokumentation öffnen",
    docsSource: "Offizielle Quelle",
    localValidation: "Lokale Strukturprüfung",
    compileRailLabel: "Compile Rail",
    compileRailTitle: "Vom Code zum Nachweis",
    compileRailReady: "Schreibe Code und drücke F5.",
    compileRailRequesting: "Anfrage läuft: Das Backend meldet anschließend Kompilierung und Ausführung.",
    compileRailValidating: "Ausgabe und Lernnachweis werden verglichen.",
    compileRailVerifiedRun: "javac hat kompiliert, java ausgeführt und der Lernnachweis wurde validiert.",
    compileRailVerifiedCompile: "javac hat den Kontext kompiliert; Ausführung übersprungen und Nachweis validiert.",
    compileRailLocal: "Backend nicht verfügbar: nur lokale heuristische Prüfung.",
    compileRailFailed: "Die Pipeline wurde bei {phase} gestoppt.",
    workbenchMission: "Mission",
    workbenchFile: "Datei",
    workbenchAutosave: "Speicher",
    workbenchAutosaveValue: "Lokal",
    workbenchShortcut: "Kürzel",
    compileWrite: "Schreiben",
    compileCompile: "Kompilieren",
    compileRun: "Ausführen",
    compileValidate: "Validieren",
    compileExplain: "Erklären",
    compileStatePending: "ausstehend",
    compileStateRequested: "beim Backend angefragt; Ergebnis ausstehend",
    compileStateActive: "wird validiert",
    compileStateDone: "verifiziert",
    compileStateSkipped: "übersprungen oder nicht erreicht",
    compileStateLocal: "nicht verifiziert; Backend nicht verfügbar",
    compileStateError: "fehlgeschlagen",
    editorLabel: "Java-Editor",
    shortcut: "F5 zum Prüfen · Tab erweitert Vorlagen · ⌥⇧↓ dupliziert",
    themeToggle: "Dunkelmodus",
    themeToggleAria: "Zum Dunkelmodus wechseln",
    themeToggleLight: "Hellmodus",
    themeToggleLightAria: "Zum Hellmodus wechseln",
    debugToggle: "Bugs",
    debugToggleAria: "Bug-Checkliste öffnen",
    editorToolsAria: "Editor-Werkzeuge",
    sidebarShow: "Pfad zeigen",
    sidebarHide: "Pfad ausblenden",
    sidebarShowAria: "Missionspfad anzeigen",
    sidebarHideAria: "Missionspfad ausblenden",
    focusEnter: "Fokusmodus",
    focusExit: "Fokus beenden",
    focusEnterAria: "Fokusmodus des Editors aktivieren",
    focusExitAria: "Fokusmodus des Editors beenden",
    editorToolbarHint: "Esc beendet den Fokusmodus · Editor-Kürzel bleiben aktiv",
    consoleTitle: "Editor-Konsole",
    consoleReady: "Bereit für F5",
    consoleChecking: "Struktur wird geprüft…",
    consoleSuccess: "Struktur akzeptiert",
    consoleError: "Fehler gefunden · Diagnosen prüfen",
    consolePlaceholder: "Die F5-Ausgabe erscheint hier. Für ein echtes Ergebnis gib mit System.out.println(...) aus.",
    consoleHint: "Damit eine Ausgabe erscheint, muss das Programm mit System.out.print(...) oder System.out.println(...) ausgeben.",
    consoleNoStdout: "Das Programm wurde ausgeführt, hat aber nichts nach stdout ausgegeben.",
    consolePrintRequired: "Keine sichtbare Ausgabe: Ergänze System.out.println(...), um das Ergebnis in der Konsole zu sehen.",
    compilerOnline: "PHP-Compiler verbunden",
    compilerOffline: "PHP-Compiler nicht verfügbar · lokaler Modus",
    compilerConnecting: "Verbindung zu javac…",
    compilerSuccess: "Echte Kompilierung akzeptiert",
    compilerError: "javac hat Fehler gefunden",
    compilerHint: "Kompilierung und Ausführung laufen isoliert im Backend; die Konsole zeigt nur, was dein Code ausgibt.",
    runnerSuccess: "Echte Ausführung abgeschlossen",
    runnerError: "Das Programm wurde kompiliert, ist aber beim Ausführen fehlgeschlagen",
    pedagogicError: "Die Ausgabe zeigt das Lernziel noch nicht ausreichend",
    teacherToggle: "Lehrkräfte-Panel",
    teacherTitle: "Lehrkräfte-Panel",
    teacherIntro: "Lokale Übersicht und, mit Lehrkraft-Konto, zentraler Klassenfortschritt.",
    teacherLocalNote: "Ohne Lehrkraft-Konto wird nur der Fortschritt dieses Browsers angezeigt.",
    teacherCloudEmpty: "Wähle eine Klasse, um zentralen Fortschritt zu sehen.",
    teacherCloudLoading: "Klassenfortschritt wird geladen…",
    teacherCloudError: "Klassenfortschritt konnte nicht geladen werden.",
    teacherCloudStudents: "Lernende",
    teacherLastActivity: "Letzte Aktivität",
    teacherHistory: "Verlauf",
    teacherNoHistory: "Noch kein Versuchsverlauf.",
    teacherWeakness: "Zu üben",
    teacherRecommendation: "Empfehlung",
    teacherSolved: "Gelöste Missionen",
    teacherAttempts: "Versuche",
    teacherAccuracy: "Trefferquote",
    teacherNeedsPractice: "Weiter üben",
    mentorLabel: "Praxis-Mentor",
    mentorTitle: "Was ich jetzt tun würde",
    mentorAction: "Empfehlung üben",
    mentorAdviceStart: "Beginne mit {mission}: Grundlagen vor Geschwindigkeit.",
    mentorAdviceHints: "Wiederhole {mission} ohne Hinweis: Konzeptverständnis zählt mehr als schnelles Durchklicken.",
    mentorAdviceAttempts: "Wiederhole {mission} mit manueller Wertetabelle vor dem Ausführen.",
    mentorAdviceProject: "Guter Moment für {project}: übertrage das Gelernte in ein echtes Produkt.",
    mentorAdviceComplete: "Route abgeschlossen: Wähle ein fortgeschrittenes Projekt und schreibe es ohne Lösung neu.",
    teacherStage: "Stufe",
    teacherAllStages: "Alle Stufen",
    teacherExport: "CSV exportieren",
    teacherExportJson: "JSON exportieren",
    teacherNoPractice: "Noch keine offenen Missionen.",
    accountTitle: "Zentrales Konto",
    accountLogin: "Anmelden",
    accountRegister: "Konto erstellen",
    accountLogout: "Abmelden",
    accountName: "Name",
    accountEmail: "E-Mail",
    accountPassword: "Passwort",
    accountOffline: "Lokaler Modus: PHP und MySQL für Synchronisierung einrichten.",
    accountConnected: "Zentrale Synchronisierung aktiv",
    accountStudent: "Lernende",
    accountTeacher: "Lehrkraft",
    classSelect: "Klasse",
    classNone: "Keine Klasse ausgewählt",
    className: "Klassenname",
    classCode: "Zugangscode",
    classCreate: "Klasse erstellen",
    classJoin: "Beitreten",
    shortcutHelpLabel: "IDEA-Kürzel",
    shortcutHelpTitle: "Produktive Tastatur",
    shortcutHelpIntro:
      "Lokale Tastenkürzel nach IntelliJ IDEA. Schreibe eine Abkürzung und drücke Tab, um eine Vorlage zu erweitern; ohne Treffer fügt Tab 4 Leerzeichen ein.",
    shortcutCheck: "Struktur prüfen",
    shortcutHint: "Hinweis/Intention anfordern",
    shortcutComment: "Auswahl oder Zeile kommentieren/entkommentieren",
    shortcutDuplicate: "Zeile oder ausgewählten Block duplizieren",
    shortcutMoveLine: "Zeile oder ausgewählten Block nach oben/unten verschieben",
    shortcutClear: "Editor leeren, wenn er fokussiert ist",
    shortcutNavigate: "Vorherige/nächste Mission öffnen, wenn verfügbar",
    shortcutEscape: "Fokusmodus beenden, Feedback schließen oder Fokus zurück zum Editor",
    liveTemplatesSummary: "Live Templates · Schnelle Java-Vorlagen",
    shortcutSummary: "IDEA-Kürzel · Tastaturkürzel",
    liveTemplatesLabel: "Live Templates",
    liveTemplatesTitle: "Schnelle Java-Vorlagen",
    liveTemplatesIntro:
      "Lokale Lernsimulation inspiriert von IntelliJ Live Templates: Abkürzung + Tab im Editor.",
    liveTemplatesAvailable: "Verfügbar",
    completionTitle: "Code vervollständigen",
    diagnosticsLabel: "Lokale Assistenz",
    diagnosticsTitle: "Diagnosen und Einrückung",
    diagnosticsNotice: "Lokale heuristische Hinweise: Sie helfen, kompilieren oder garantieren aber kein gültiges Java.",
    bugChecklistLabel: "Offene Änderungen",
    bugChecklistTitle: "Meine Bug-Checkliste",
    bugChecklistIntro: "Notiere, was du ändern möchtest. Enter erstellt eine neue Checkbox.",
    bugChecklistPlaceholder: "Änderung notieren…",
    bugChecklistRemove: "Eintrag löschen",
    format: "Auf 4 Leerzeichen formatieren",
    noDiagnostics: "Keine heuristischen Hinweise in diesem Block.",
    progressLabel: "Transparenter Lernstand",
    progressTitle: "Dein Fortschritt",
    check: "Kompilieren und validieren",
    hint: "Hinweis anfordern",
    reveal: "Lösung anzeigen",
    next: "Nächste Mission",
    finish: "Lernpfad abgeschlossen",
    hintTitle: "Hinweis des Mentors",
    reset: "Gesamten Fortschritt zurücksetzen",
    mission: "Mission",
    difficulty: { easy: "Einstieg", medium: "Mittel", hard: "Fortgeschritten" },
    editorPlaceholder: "// Schreibe nur den fehlenden Block",
    emptyTitle: "Der Editor ist leer",
    emptyMessage: "Schreibe zuerst den geforderten Block.",
    errorTitle: "Die Struktur ist noch nicht korrekt",
    successTitle: "Pipeline validiert",
    successMessage: "Die Lösung hat den verfügbaren Prüfablauf dieser Mission bestanden.",
    alreadySolved: "Diese Mission war bereits gelöst. Lies die Erklärung oder gehe weiter.",
    validationLocalNote: "Das Backend antwortete nicht: Dieser Versuch wurde nur durch lokale heuristische Regeln akzeptiert.",
    validationCompileNote: "javac hat den echten Missionskontext kompiliert; danach wurde die Lernregel geprüft.",
    validationRunNote: "javac hat kompiliert, java hat ausgeführt und die echte Ausgabe hat auch die Lernregel bestanden.",
    validationSavedNote: "Gespeichertes Ergebnis eines früheren Versuchs; drücke F5, um die Pipeline erneut zu prüfen.",
    hintLevel: "Hinweis {current} von {total}",
    noMoreHints: "Du hast bereits alle verfügbaren Hinweise gesehen.",
    solutionIntro: "Referenzlösung",
    solutionPenalty: "Du hast die Lösung angezeigt. Analysiere sie, schreibe sie neu und prüfe die Struktur.",
    completed: "Abgeschlossen",
    locked: "Gesperrt",
    unlocked: "Verfügbar",
    resetConfirm: "Antworten, XP und gespeicherten Fortschritt löschen?",
    allDoneTitle: "Lernpfad abgeschlossen",
    allDoneMessage:
      "Du hast alle 49 Missionen und fünf Abgaben geschafft. Wiederhole schwierige Aufgaben ohne Hinweise – dort festigt sich dein Wissen.",
  },
};

const LIVE_TEMPLATES = [
  { abbr: "sout", description: "System.out.println", template: "System.out.println($END$);" },
  { abbr: "soutv", description: "Print value", template: 'System.out.println("value = " + value);$END$' },
  { abbr: "souv", description: "Print value", template: 'System.out.println("value = " + value);$END$' },
  { abbr: "soutm", description: "Print method", template: 'System.out.println("method = " + Thread.currentThread().getStackTrace()[1].getMethodName());$END$' },
  { abbr: "soutp", description: "Print parameters", template: 'System.out.println("args = " + java.util.Arrays.toString(args));$END$' },
  { abbr: "serr", description: "System.err.println", template: "System.err.println($END$);" },
  {
    abbr: "main",
    description: "public static void main",
    template: [
      "public static void main(String[] args) {",
      "    $END$",
      "}",
    ].join("\n"),
  },
  {
    abbr: "psvm",
    description: "public static void main",
    template: [
      "public static void main(String[] args) {",
      "    $END$",
      "}",
    ].join("\n"),
  },
  { abbr: "psfs", description: "public static final String", template: 'public static final String NAME = "$END$";' },
  { abbr: "psfi", description: "public static final int", template: "public static final int VALUE = $END$;" },
  { abbr: "psf", description: "public static final", template: "public static final $END$" },
  { abbr: "prsf", description: "private static final", template: "private static final $END$" },
  {
    abbr: "fori",
    description: "indexed for",
    template: [
      "for (int i = 0; i < count; i++) {",
      "    $END$",
      "}",
    ].join("\n"),
  },
  {
    abbr: "for",
    description: "enhanced for",
    template: [
      "for (var item : items) {",
      "    $END$",
      "}",
    ].join("\n"),
  },
  {
    abbr: "iter",
    description: "iterate Iterable",
    template: [
      "for (var item : iterable) {",
      "    $END$",
      "}",
    ].join("\n"),
  },
  {
    abbr: "itar",
    description: "iterate array",
    template: [
      "for (int i = 0; i < array.length; i++) {",
      "    var item = array[i];",
      "    $END$",
      "}",
    ].join("\n"),
  },
  {
    abbr: "ritar",
    description: "reverse array iteration",
    template: [
      "for (int i = array.length - 1; i >= 0; i--) {",
      "    var item = array[i];",
      "    $END$",
      "}",
    ].join("\n"),
  },
  {
    abbr: "itco",
    description: "iterate collection",
    template: [
      "for (var item : collection) {",
      "    $END$",
      "}",
    ].join("\n"),
  },
  {
    abbr: "iten",
    description: "iterate enumeration",
    template: [
      "while (enumeration.hasMoreElements()) {",
      "    var item = enumeration.nextElement();",
      "    $END$",
      "}",
    ].join("\n"),
  },
  {
    abbr: "ifn",
    description: "if null",
    template: [
      "if (value == null) {",
      "    $END$",
      "}",
    ].join("\n"),
  },
  {
    abbr: "inn",
    description: "if not null",
    template: [
      "if (value != null) {",
      "    $END$",
      "}",
    ].join("\n"),
  },
  {
    abbr: "nn",
    description: "if not null",
    template: [
      "if (value != null) {",
      "    $END$",
      "}",
    ].join("\n"),
  },
  {
    abbr: "inst",
    description: "instanceof pattern",
    template: [
      "if (object instanceof Type value) {",
      "    $END$",
      "}",
    ].join("\n"),
  },
  {
    abbr: "lazy",
    description: "lazy initialization",
    template: [
      "if (value == null) {",
      "    value = new Value();",
      "}",
      "$END$",
    ].join("\n"),
  },
  { abbr: "lst", description: "last element", template: "items.get(items.size() - 1)$END$" },
  { abbr: "mn", description: "min", template: "Math.min(a, b)$END$" },
  { abbr: "mx", description: "max", template: "Math.max(a, b)$END$" },
  { abbr: "toar", description: "to array", template: "collection.toArray(new Type[0])$END$" },
  { abbr: "thr", description: "throw new", template: 'throw new IllegalStateException("$END$");' },
  {
    abbr: "try",
    description: "try/catch",
    template: [
      "try {",
      "    $END$",
      "} catch (Exception exception) {",
      "    exception.printStackTrace();",
      "}",
    ].join("\n"),
  },
];

function stripComments(code) {
  return String(code || "")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/.*$/gm, "$1 ");
}

function codeRepresentations(code) {
  const raw = String(code || "");
  const withoutComments = stripComments(raw);
  return {
    raw,
    evidence: raw.replace(/\s+/g, " ").trim(),
    withoutComments,
    code: withoutComments.replace(/\s+/g, " ").trim(),
    masked: maskJava(raw).masked,
  };
}

function clean(code) {
  return codeRepresentations(code).code;
}

function hasBalancedPairs(code, open, close) {
  let depth = 0;
  for (const character of code) {
    if (character === open) depth += 1;
    if (character === close) depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
}

function commonStructureChecks(code, language) {
  const messages = {
    es: {
      braces: "Revisá las llaves: cada «{» necesita su «}».",
      parentheses: "Revisá los paréntesis: cada «(» necesita su «)».",
    },
    de: {
      braces: "Prüfe die geschweiften Klammern: Jedes „{“ braucht ein „}“.",
      parentheses: "Prüfe die runden Klammern: Jedes „(“ braucht ein „)“.",
    },
  };

  const structuralCode = maskJava(code).masked;
  if (!hasBalancedPairs(structuralCode, "{", "}")) return messages[language].braces;
  if (!hasBalancedPairs(structuralCode, "(", ")")) return messages[language].parentheses;
  return null;
}

const missions = [
  {
    id: "types",
    difficulty: "easy",
    xp: BASE_XP,
    file: "Profile.java",
    contextBefore: `public class Profile {\n    public static void main(String[] args) {`,
    contextAfter: `    }\n}`,
    solution: `String name = "Mara";\nint age = 27;\nSystem.out.println(name + " · " + age);`,
    text: {
      es: {
        short: "Variables y tipos",
        title: "Dale tipo a los datos",
        objective: "Diferenciar texto y números usando tipos explícitos.",
        prompt:
          'Declará una variable String llamada name con "Mara", una variable int llamada age con 27 e imprimí ambos valores en consola.',
        concept: "Tipado estático y declaración",
        hints: [
          "Java necesita el tipo antes del nombre: String para texto, int para enteros.",
          'La forma completa es: tipo nombre = valor; Recordá las comillas de "Mara".',
        ],
        explanation:
          "Java comprueba los tipos antes de ejecutar. String acepta texto; int, enteros. System.out.println hace visible el resultado.",
        errors: {
          nameType: "Falta declarar name con el tipo String.",
          nameValue: 'name debe inicializarse exactamente con el texto "Mara".',
          ageType: "Falta declarar age con el tipo int.",
          ageValue: "age debe inicializarse con el número 27.",
          semicolon: "Cada declaración debe terminar con punto y coma.",
          print: "Falta imprimir name y age con System.out.println(...).",
        },
      },
      de: {
        short: "Variablen und Typen",
        title: "Gib den Daten einen Typ",
        objective: "Text und Zahlen mit expliziten Typen unterscheiden.",
        prompt:
          'Deklariere eine String-Variable name mit "Mara", eine int-Variable age mit 27 und gib beide Werte in der Konsole aus.',
        concept: "Statische Typisierung und Deklaration",
        hints: [
          "In Java steht der Typ vor dem Namen: String für Text, int für Ganzzahlen.",
          'Die vollständige Form lautet: Typ name = Wert; Denke an die Anführungszeichen bei "Mara".',
        ],
        explanation:
          "Java prüft Typen vor der Ausführung. String speichert Text, int ganze Zahlen. System.out.println macht das Ergebnis sichtbar.",
        errors: {
          nameType: "name muss mit dem Typ String deklariert werden.",
          nameValue: 'name muss genau mit dem Text "Mara" initialisiert werden.',
          ageType: "age muss mit dem Typ int deklariert werden.",
          ageValue: "age muss mit der Zahl 27 initialisiert werden.",
          semicolon: "Jede Deklaration muss mit einem Semikolon enden.",
          print: "Es fehlt die Ausgabe von name und age mit System.out.println(...).",
        },
      },
    },
    validate(code, language) {
      const value = clean(code);
      const e = this.text[language].errors;
      if (!/\bString\s+name\b/.test(value)) return e.nameType;
      if (!/\bString\s+name\s*=\s*"Mara"\s*;/.test(value)) return e.nameValue;
      if (!/\bint\s+age\b/.test(value)) return e.ageType;
      if (!/\bint\s+age\s*=\s*27\s*;/.test(value)) return e.ageValue;
      if ((value.match(/;/g) || []).length < 3) return e.semicolon;
      if (!/System\.out\.println\s*\([^;]*(name[^;]*age|age[^;]*name)[^;]*\)\s*;/.test(value)) return e.print;
      return null;
    },
  },
  {
    id: "condition",
    difficulty: "easy",
    xp: BASE_XP,
    file: "AccessControl.java",
    contextBefore: `public class AccessControl {\n    public static void main(String[] args) {\n        int age = 20;`,
    contextAfter: `    }\n}`,
    solution: `if (age >= 18) {\n    System.out.println("Access granted");\n} else {\n    System.out.println("Access denied");\n}`,
    text: {
      es: {
        short: "Condicionales",
        title: "Tomá una decisión",
        objective: "Controlar el flujo con dos caminos excluyentes.",
        prompt:
          'Si age es al menos 18, imprimí "Access granted"; si no, imprimí "Access denied". Usá if/else.',
        concept: "if/else y operadores relacionales",
        hints: [
          "La condición debe comparar age con 18 usando >=.",
          "Necesitás un bloque if y un bloque else, cada uno con su System.out.println(...).",
        ],
        explanation:
          "if ejecuta un bloque cuando la condición es true; else cubre el caso contrario. >= incluye exactamente 18.",
        errors: {
          ifBlock: "Falta un bloque if con una condición entre paréntesis.",
          condition: "La condición debe comprobar age >= 18.",
          elseBlock: "Falta el camino alternativo con else.",
          granted: 'El bloque positivo debe imprimir "Access granted".',
          denied: 'El bloque alternativo debe imprimir "Access denied".',
        },
      },
      de: {
        short: "Bedingungen",
        title: "Triff eine Entscheidung",
        objective: "Den Programmfluss über zwei exklusive Wege steuern.",
        prompt:
          'Wenn age mindestens 18 ist, gib "Access granted" aus, sonst "Access denied". Verwende if/else.',
        concept: "if/else und Vergleichsoperatoren",
        hints: [
          "Die Bedingung muss age mit 18 über >= vergleichen.",
          "Du brauchst einen if- und einen else-Block mit jeweils System.out.println(...).",
        ],
        explanation:
          "if führt einen Block aus, wenn die Bedingung true ist; else deckt den Gegenfall ab. >= schließt 18 ein.",
        errors: {
          ifBlock: "Ein if-Block mit einer Bedingung in Klammern fehlt.",
          condition: "Die Bedingung muss age >= 18 prüfen.",
          elseBlock: "Der alternative Pfad mit else fehlt.",
          granted: 'Der positive Block muss "Access granted" ausgeben.',
          denied: 'Der alternative Block muss "Access denied" ausgeben.',
        },
      },
    },
    validate(code, language) {
      const value = clean(code);
      const e = this.text[language].errors;
      if (!/\bif\s*\([^)]*\)\s*\{/.test(value)) return e.ifBlock;
      if (!/\bif\s*\(\s*age\s*>=\s*18\s*\)/.test(value)) return e.condition;
      if (!/\}\s*else\s*\{/.test(value)) return e.elseBlock;
      if (!/System\.out\.println\s*\(\s*"Access granted"\s*\)\s*;/.test(value)) {
        return e.granted;
      }
      if (!/System\.out\.println\s*\(\s*"Access denied"\s*\)\s*;/.test(value)) {
        return e.denied;
      }
      return commonStructureChecks(value, language);
    },
  },
  {
    id: "loop",
    difficulty: "medium",
    xp: BASE_XP,
    file: "TeamPrinter.java",
    contextBefore: `public class TeamPrinter {\n    public static void main(String[] args) {\n        String[] names = {"Mara", "Noah", "Lina"};`,
    contextAfter: `    }\n}`,
    solution: `for (int i = 0; i < names.length; i++) {\n    System.out.println(names[i]);\n}`,
    text: {
      es: {
        short: "Bucle for",
        title: "Recorré sin salirte",
        objective: "Iterar un array usando sus límites reales.",
        prompt:
          "Recorré names desde el primer elemento hasta el último e imprimí cada nombre. Usá un for con índice.",
        concept: "Bucle for, índice y length",
        hints: [
          "El primer índice de un array es 0 y el último es length - 1.",
          "La cabecera necesita inicialización, condición e incremento: int i = 0; i < names.length; i++.",
        ],
        explanation:
          "i < names.length evita ArrayIndexOutOfBoundsException. names[i] accede al elemento actual y i++ avanza.",
        errors: {
          loop: "Falta un bucle for con sus tres partes.",
          init: "Inicializá un índice int en 0.",
          condition: "La condición debe usar i < names.length, no un número fijo.",
          increment: "Falta incrementar el índice con i++ o ++i.",
          print: "Dentro del recorrido tenés que imprimir names[i].",
        },
      },
      de: {
        short: "for-Schleife",
        title: "Durchlaufe sicher",
        objective: "Ein Array anhand seiner tatsächlichen Grenzen durchlaufen.",
        prompt:
          "Durchlaufe names vom ersten bis zum letzten Element und gib jeden Namen aus. Verwende eine for-Schleife mit Index.",
        concept: "for-Schleife, Index und length",
        hints: [
          "Der erste Array-Index ist 0, der letzte ist length - 1.",
          "Der Kopf braucht Start, Bedingung und Schritt: int i = 0; i < names.length; i++.",
        ],
        explanation:
          "i < names.length verhindert eine ArrayIndexOutOfBoundsException. names[i] liest das aktuelle Element, i++ geht weiter.",
        errors: {
          loop: "Eine for-Schleife mit drei Bereichen fehlt.",
          init: "Initialisiere einen int-Index mit 0.",
          condition: "Die Bedingung muss i < names.length statt einer festen Zahl verwenden.",
          increment: "Der Index muss mit i++ oder ++i erhöht werden.",
          print: "Innerhalb der Schleife musst du names[i] ausgeben.",
        },
      },
    },
    validate(code, language) {
      const value = clean(code);
      const e = this.text[language].errors;
      const header = value.match(/\bfor\s*\(([^;]*);([^;]*);([^)]*)\)/);
      if (!header) return e.loop;
      if (!/\bint\s+i\s*=\s*0\b/.test(header[1])) return e.init;
      if (!/\bi\s*<\s*names\.length\b/.test(header[2])) return e.condition;
      if (!/(?:i\s*\+\+|\+\+\s*i)/.test(header[3])) return e.increment;
      if (!/System\.out\.println\s*\(\s*names\s*\[\s*i\s*]\s*\)\s*;/.test(value)) {
        return e.print;
      }
      return commonStructureChecks(value, language);
    },
  },
  {
    id: "method",
    difficulty: "medium",
    xp: BASE_XP,
    file: "Calculator.java",
    contextBefore: `public class Calculator {`,
    contextAfter: `\n    public static void main(String[] args) {\n        System.out.println(add(4, 7));\n    }\n}`,
    solution: `public static int add(int a, int b) {\n    return a + b;\n}`,
    text: {
      es: {
        short: "Métodos",
        title: "Encapsulá una operación",
        objective: "Definir un contrato con parámetros y valor de retorno.",
        prompt:
          "Creá un método public static llamado add que reciba dos int (a y b), devuelva int y retorne su suma.",
        concept: "Firma, parámetros y return",
        hints: [
          "La firma empieza con public static int add(...).",
          "Los dos parámetros necesitan su propio tipo: int a, int b. El cuerpo retorna a + b.",
        ],
        explanation:
          "La firma define cómo se usa el método. El tipo int antes de add obliga a devolver un entero mediante return.",
        errors: {
          visibility: "El método debe ser public y static.",
          returnType: "El tipo de retorno debe ser int.",
          name: "El método debe llamarse add.",
          params: "La firma debe recibir exactamente int a e int b.",
          return: "Falta devolver a + b con return.",
        },
      },
      de: {
        short: "Methoden",
        title: "Kapsele eine Operation",
        objective: "Einen Vertrag mit Parametern und Rückgabewert definieren.",
        prompt:
          "Erstelle eine public-static-Methode add, die int a und int b erhält, int zurückgibt und ihre Summe liefert.",
        concept: "Signatur, Parameter und return",
        hints: [
          "Die Signatur beginnt mit public static int add(...).",
          "Beide Parameter brauchen einen Typ: int a, int b. Der Körper gibt a + b zurück.",
        ],
        explanation:
          "Die Signatur legt fest, wie die Methode aufgerufen wird. int vor add verlangt einen ganzzahligen Rückgabewert über return.",
        errors: {
          visibility: "Die Methode muss public und static sein.",
          returnType: "Der Rückgabetyp muss int sein.",
          name: "Die Methode muss add heißen.",
          params: "Die Signatur muss genau int a und int b erhalten.",
          return: "a + b muss mit return zurückgegeben werden.",
        },
      },
    },
    validate(code, language) {
      const value = clean(code);
      const e = this.text[language].errors;
      if (!/\bpublic\s+static\b/.test(value)) return e.visibility;
      if (!/\bpublic\s+static\s+int\b/.test(value)) return e.returnType;
      if (!/\bint\s+add\s*\(/.test(value)) return e.name;
      if (!/\badd\s*\(\s*int\s+a\s*,\s*int\s+b\s*\)/.test(value)) return e.params;
      if (!/\breturn\s+a\s*\+\s*b\s*;/.test(value)) return e.return;
      return commonStructureChecks(value, language);
    },
  },
  {
    id: "arrays",
    difficulty: "medium",
    xp: BASE_XP,
    file: "ScoreTotal.java",
    contextBefore: `public class ScoreTotal {\n    public static void main(String[] args) {`,
    contextAfter: `    }\n}`,
    solution: `int[] scores = {8, 10, 7, 9};\nint total = 0;\nfor (int score : scores) {\n    total += score;\n}\nSystem.out.println(total);`,
    text: {
      es: {
        short: "Arrays",
        title: "Acumulá una colección fija",
        objective: "Crear un array y reducirlo a un único valor.",
        prompt:
          "Creá scores con 8, 10, 7 y 9. Inicializá total en 0, sumá cada score con for-each e imprimí total.",
        concept: "Array, for-each y acumulador",
        hints: [
          "Un array de enteros se declara con int[] y los valores van entre llaves.",
          "El for-each tiene la forma for (int score : scores). Dentro, actualizá total.",
        ],
        explanation:
          "El array tiene tamaño fijo. El for-each expresa que importa cada valor, no su posición; total acumula el resultado.",
        errors: {
          arrayType: "scores debe declararse como int[].",
          values: "El array debe contener 8, 10, 7 y 9 en ese orden.",
          accumulator: "Declará total como int e inicializalo en 0.",
          foreach: "Usá un for-each con int score : scores.",
          sum: "Dentro del bucle, sumá score a total.",
          print: "Falta imprimir total con System.out.println(total).",
        },
      },
      de: {
        short: "Arrays",
        title: "Summiere eine feste Sammlung",
        objective: "Ein Array erstellen und auf einen Wert reduzieren.",
        prompt:
          "Erstelle scores mit 8, 10, 7 und 9. Setze total auf 0, addiere jeden score mit for-each und gib total aus.",
        concept: "Array, for-each und Akkumulator",
        hints: [
          "Ein Ganzzahl-Array wird mit int[] deklariert; Werte stehen in geschweiften Klammern.",
          "Die for-each-Form lautet for (int score : scores). Aktualisiere darin total.",
        ],
        explanation:
          "Das Array hat eine feste Größe. for-each zeigt, dass jeder Wert statt seiner Position wichtig ist; total sammelt das Ergebnis.",
        errors: {
          arrayType: "scores muss als int[] deklariert werden.",
          values: "Das Array muss 8, 10, 7 und 9 in dieser Reihenfolge enthalten.",
          accumulator: "Deklariere total als int und initialisiere es mit 0.",
          foreach: "Verwende for-each mit int score : scores.",
          sum: "Addiere score innerhalb der Schleife zu total.",
          print: "Es fehlt System.out.println(total).",
        },
      },
    },
    validate(code, language) {
      const value = clean(code);
      const e = this.text[language].errors;
      if (!/\bint\s*\[\s*]\s*scores\b/.test(value)) return e.arrayType;
      if (!/\bscores\s*=\s*(?:new\s+int\s*\[\s*]\s*)?\{\s*8\s*,\s*10\s*,\s*7\s*,\s*9\s*}\s*;/.test(value)) {
        return e.values;
      }
      if (!/\bint\s+total\s*=\s*0\s*;/.test(value)) return e.accumulator;
      if (!/\bfor\s*\(\s*int\s+score\s*:\s*scores\s*\)\s*\{/.test(value)) return e.foreach;
      if (!/(?:total\s*\+=\s*score|total\s*=\s*total\s*\+\s*score)\s*;/.test(value)) return e.sum;
      if (!/System\.out\.println\s*\(\s*total\s*\)\s*;/.test(value)) return e.print;
      return commonStructureChecks(value, language);
    },
  },
  {
    id: "class",
    difficulty: "hard",
    xp: BASE_XP,
    file: "Book.java",
    contextBefore: "",
    contextAfter: "",
    solution: `public class Book {\n    private String title;\n    private int pages;\n\n    public Book(String title, int pages) {\n        this.title = title;\n        this.pages = pages;\n    }\n}`,
    text: {
      es: {
        short: "Clase y constructor",
        title: "Modelá un objeto",
        objective: "Encapsular estado e inicializarlo mediante un constructor.",
        prompt:
          "Definí la clase pública Book con campos privados title (String) y pages (int). Creá un constructor que reciba ambos y use this.",
        concept: "Clase, estado privado y constructor",
        hints: [
          "Los campos viven dentro de public class Book y se marcan private.",
          "El constructor no tiene tipo de retorno y se llama igual que la clase. Asigná this.title = title y this.pages = pages.",
        ],
        explanation:
          "private protege el estado. El constructor establece un objeto válido desde su creación; this distingue el campo del parámetro.",
        errors: {
          className: "Falta declarar public class Book.",
          titleField: "Falta el campo private String title.",
          pagesField: "Falta el campo private int pages.",
          constructor: "Falta el constructor public Book(String title, int pages).",
          titleAssign: "El constructor debe asignar this.title = title.",
          pagesAssign: "El constructor debe asignar this.pages = pages.",
        },
      },
      de: {
        short: "Klasse und Konstruktor",
        title: "Modelliere ein Objekt",
        objective: "Zustand kapseln und über einen Konstruktor initialisieren.",
        prompt:
          "Definiere die öffentliche Klasse Book mit privaten Feldern title (String) und pages (int). Erstelle einen Konstruktor mit beiden Parametern und this.",
        concept: "Klasse, privater Zustand und Konstruktor",
        hints: [
          "Die Felder stehen in public class Book und werden mit private geschützt.",
          "Der Konstruktor hat keinen Rückgabetyp und heißt wie die Klasse. Weise this.title = title und this.pages = pages zu.",
        ],
        explanation:
          "private schützt den Zustand. Der Konstruktor erzeugt von Anfang an ein gültiges Objekt; this unterscheidet Feld und Parameter.",
        errors: {
          className: "public class Book fehlt.",
          titleField: "Das Feld private String title fehlt.",
          pagesField: "Das Feld private int pages fehlt.",
          constructor: "Der Konstruktor public Book(String title, int pages) fehlt.",
          titleAssign: "Der Konstruktor muss this.title = title zuweisen.",
          pagesAssign: "Der Konstruktor muss this.pages = pages zuweisen.",
        },
      },
    },
    validate(code, language) {
      const value = clean(code);
      const e = this.text[language].errors;
      if (!/\bpublic\s+class\s+Book\s*\{/.test(value)) return e.className;
      if (!/\bprivate\s+String\s+title\s*;/.test(value)) return e.titleField;
      if (!/\bprivate\s+int\s+pages\s*;/.test(value)) return e.pagesField;
      if (!/\bpublic\s+Book\s*\(\s*String\s+title\s*,\s*int\s+pages\s*\)\s*\{/.test(value)) {
        return e.constructor;
      }
      if (!/\bthis\.title\s*=\s*title\s*;/.test(value)) return e.titleAssign;
      if (!/\bthis\.pages\s*=\s*pages\s*;/.test(value)) return e.pagesAssign;
      return commonStructureChecks(value, language);
    },
  },
  {
    id: "list",
    difficulty: "hard",
    xp: BASE_XP,
    file: "TaskBoard.java",
    contextBefore: `import java.util.ArrayList;\nimport java.util.List;\n\npublic class TaskBoard {\n    public static void main(String[] args) {`,
    contextAfter: `    }\n}`,
    solution: `List<String> tasks = new ArrayList<>();\ntasks.add("Learn Java");\ntasks.add("Write tests");\nSystem.out.println(tasks.size());`,
    text: {
      es: {
        short: "Listas",
        title: "Usá una colección dinámica",
        objective: "Programar contra la interfaz List y agregar elementos.",
        prompt:
          'Creá tasks como List<String> usando ArrayList<>. Agregá "Learn Java" y "Write tests" con add e imprimí tasks.size().',
        concept: "Genéricos, List y ArrayList",
        hints: [
          "Usá List<String> para declarar el contrato y new ArrayList<>() para crear el objeto.",
          'Cada elemento se agrega por separado: tasks.add("...");',
        ],
        explanation:
          "List define las operaciones; ArrayList aporta la implementación redimensionable. <String> impide insertar valores de otro tipo.",
        errors: {
          interface: "Declará tasks usando la interfaz List<String>.",
          implementation: "Inicializá tasks con new ArrayList<>().",
          first: 'Agregá "Learn Java" mediante tasks.add(...).',
          second: 'Agregá "Write tests" mediante tasks.add(...).',
          print: "Falta imprimir tasks.size() con System.out.println(...).",
        },
      },
      de: {
        short: "Listen",
        title: "Nutze eine dynamische Sammlung",
        objective: "Gegen das List-Interface programmieren und Elemente hinzufügen.",
        prompt:
          'Erstelle tasks als List<String> mit ArrayList<>. Füge "Learn Java" und "Write tests" über add hinzu und gib tasks.size() aus.',
        concept: "Generics, List und ArrayList",
        hints: [
          "Deklariere den Vertrag mit List<String> und erzeuge das Objekt mit new ArrayList<>().",
          'Jedes Element wird einzeln ergänzt: tasks.add("...");',
        ],
        explanation:
          "List definiert die Operationen; ArrayList liefert die veränderbare Implementierung. <String> verhindert Werte anderer Typen.",
        errors: {
          interface: "Deklariere tasks über das Interface List<String>.",
          implementation: "Initialisiere tasks mit new ArrayList<>().",
          first: 'Füge "Learn Java" über tasks.add(...) hinzu.',
          second: 'Füge "Write tests" über tasks.add(...) hinzu.',
          print: "Es fehlt System.out.println(tasks.size()).",
        },
      },
    },
    validate(code, language) {
      const value = clean(code);
      const e = this.text[language].errors;
      if (!/\bList\s*<\s*String\s*>\s+tasks\b/.test(value)) return e.interface;
      if (!/\btasks\s*=\s*new\s+ArrayList\s*<\s*>\s*\(\s*\)\s*;/.test(value)) {
        return e.implementation;
      }
      if (!/\btasks\.add\s*\(\s*"Learn Java"\s*\)\s*;/.test(value)) return e.first;
      if (!/\btasks\.add\s*\(\s*"Write tests"\s*\)\s*;/.test(value)) return e.second;
      if (!/System\.out\.println\s*\(\s*tasks\.size\s*\(\s*\)\s*\)\s*;/.test(value)) return e.print;
      return commonStructureChecks(value, language);
    },
  },
  {
    id: "debug",
    difficulty: "hard",
    xp: BASE_XP,
    file: "Average.java",
    contextBefore: `public class Average {`,
    contextAfter: `}`,
    solution: `public static double average(int[] values) {\n    if (values == null || values.length == 0) {\n        return 0.0;\n    }\n\n    double sum = 0.0;\n    for (int value : values) {\n        sum += value;\n    }\n    return sum / values.length;\n}`,
    text: {
      es: {
        short: "Debugging final",
        title: "Escribí código resistente",
        objective: "Combinar método, guard clause, bucle y división decimal.",
        prompt:
          "Implementá average(int[] values). Si values es null o está vacío devolvé 0.0; si no, sumá con for-each y devolvé el promedio como double.",
        concept: "Guard clause, recorrido y precisión",
        hints: [
          "Antes de leer length, comprobá values == null. Uní ambos casos con ||.",
          "Usá double sum = 0.0, recorré int value : values y al final dividí sum por values.length.",
          "El método completo devuelve double y cada camino debe llegar a un return.",
        ],
        explanation:
          "La guard clause evita NullPointerException y división por cero. Usar double conserva decimales en el promedio.",
        errors: {
          signature: "La firma debe ser public static double average(int[] values).",
          nullGuard: "Comprobá values == null antes de usar length.",
          emptyGuard: "La guarda también debe comprobar values.length == 0.",
          guardReturn: "La guarda debe devolver 0.0.",
          sum: "El acumulador sum debe ser double e iniciar en 0.0.",
          loop: "Recorré values con for (int value : values).",
          accumulate: "Dentro del bucle, agregá value a sum.",
          average: "Al final devolvé sum / values.length.",
        },
      },
      de: {
        short: "Finales Debugging",
        title: "Schreibe robusten Code",
        objective: "Methode, Guard Clause, Schleife und Dezimaldivision kombinieren.",
        prompt:
          "Implementiere average(int[] values). Bei null oder leerem Array gib 0.0 zurück; sonst summiere mit for-each und liefere den Durchschnitt als double.",
        concept: "Guard Clause, Durchlauf und Präzision",
        hints: [
          "Prüfe values == null, bevor du length liest. Verbinde beide Fehlerfälle mit ||.",
          "Nutze double sum = 0.0, durchlaufe int value : values und teile sum durch values.length.",
          "Die vollständige Methode gibt double zurück und jeder Pfad braucht ein return.",
        ],
        explanation:
          "Die Guard Clause verhindert NullPointerException und Division durch null. double bewahrt Nachkommastellen im Durchschnitt.",
        errors: {
          signature: "Die Signatur muss public static double average(int[] values) lauten.",
          nullGuard: "Prüfe values == null, bevor du length verwendest.",
          emptyGuard: "Die Guard Clause muss auch values.length == 0 prüfen.",
          guardReturn: "Die Guard Clause muss 0.0 zurückgeben.",
          sum: "Der Akkumulator sum muss double sein und mit 0.0 starten.",
          loop: "Durchlaufe values mit for (int value : values).",
          accumulate: "Addiere value innerhalb der Schleife zu sum.",
          average: "Gib am Ende sum / values.length zurück.",
        },
      },
    },
    validate(code, language) {
      const value = clean(code);
      const e = this.text[language].errors;
      if (!/\bpublic\s+static\s+double\s+average\s*\(\s*int\s*\[\s*]\s*values\s*\)/.test(value)) {
        return e.signature;
      }
      if (!/\bvalues\s*==\s*null\b/.test(value)) return e.nullGuard;
      if (!/\bvalues\.length\s*==\s*0\b/.test(value)) return e.emptyGuard;
      if (!/\bif\s*\([^)]*values\s*==\s*null[^)]*\|\|[^)]*values\.length\s*==\s*0[^)]*\)\s*\{[^}]*return\s+0(?:\.0)?\s*;/s.test(value)) {
        return e.guardReturn;
      }
      if (!/\bdouble\s+sum\s*=\s*0(?:\.0)?\s*;/.test(value)) return e.sum;
      if (!/\bfor\s*\(\s*int\s+value\s*:\s*values\s*\)\s*\{/.test(value)) return e.loop;
      if (!/(?:sum\s*\+=\s*value|sum\s*=\s*sum\s*\+\s*value)\s*;/.test(value)) {
        return e.accumulate;
      }
      if (!/\breturn\s+sum\s*\/\s*values\.length\s*;/.test(value)) return e.average;
      return commonStructureChecks(value, language);
    },
  },
];

const CURRICULUM_FIELDS = {
  data: { es: "Datos y su estructuración", de: "Daten und ihre Strukturierung" },
  algorithms: { es: "Algoritmos", de: "Algorithmen" },
  formal: { es: "Lenguajes formales y autómatas", de: "Formale Sprachen und Automaten" },
  systems: { es: "Sistemas informáticos", de: "Informatiksysteme" },
  society: { es: "Informática, persona y sociedad", de: "Informatik, Mensch und Gesellschaft" },
};

const COMPETENCE_NAMES = {
  A: { es: "Argumentar", de: "Argumentieren" },
  M: { es: "Modelar", de: "Modellieren" },
  I: { es: "Implementar", de: "Implementieren" },
  D: { es: "Representar/interpretar", de: "Darstellen/Interpretieren" },
  K: { es: "Comunicar/cooperar", de: "Kommunizieren/Kooperieren" },
};

function curriculumMission(spec) {
  const starter = spec.starter || "// Completá el modelo solicitado / Vervollständige das geforderte Modell";
  const makeText = (language) => ({
    short: spec[language].short,
    title: spec[language].title,
    objective: spec[language].objective,
    prompt: spec[language].prompt,
    concept: spec[language].concept,
    hints: [spec[language].hint, spec[language].hint2 || spec[language].hint],
    explanation: spec[language].explanation,
    errors: { required: spec[language].error },
  });
  return {
    id: spec.id,
    stage: spec.stage,
    field: spec.field,
    competencies: spec.competencies,
    difficulty: spec.difficulty,
    xp: spec.xp || BASE_XP,
    minutes: spec.minutes || 15,
    file: spec.file,
    compileMode: spec.compileMode,
    starter,
    contextBefore: spec.before ?? starter,
    contextAfter: spec.after ?? "",
    solution: spec.solution,
    text: { es: makeText("es"), de: makeText("de") },
    validate(code, language) {
      const views = codeRepresentations(code);
      const missingCode = spec.required.find((pattern) => !pattern.test(views.code));
      const missingEvidence = (spec.evidenceRequired || []).find((pattern) => !pattern.test(views.evidence));
      return missingCode || missingEvidence
        ? this.text[language].errors.required
        : commonStructureChecks(views.raw, language);
    },
  };
}

const extraMissions = [
  {
    id: "strings", stage: "EF", field: "data", competencies: ["I", "D"], difficulty: "easy", file: "Greeting.java",
    compileMode: "snippet", before: `String name = "  Mara  ";`,
    solution: `String message = name.trim().toUpperCase();\nSystem.out.println(message.length());`,
    required: [/String\s+message\s*=\s*name\.trim\(\)\.toUpperCase\(\)\s*;/, /message\.length\(\)/],
    es: { short: "Strings", title: "Transformá texto", objective: "Encadenar operaciones inmutables.", prompt: "Creá message recortando name y pasándolo a mayúsculas; imprimí su longitud.", concept: "String, inmutabilidad y métodos", hint: "Usá trim(), toUpperCase() y length().", explanation: "Cada operación devuelve un nuevo String.", error: "Faltan la cadena trim/toUpperCase o la impresión de length." },
    de: { short: "Strings", title: "Verarbeite Text", objective: "Unveränderliche Operationen verketten.", prompt: "Erzeuge message aus name ohne Randabstände in Großbuchstaben und gib die Länge aus.", concept: "String, Unveränderlichkeit und Methoden", hint: "Nutze trim(), toUpperCase() und length().", explanation: "Jede Operation liefert einen neuen String.", error: "Die trim/toUpperCase-Kette oder length-Ausgabe fehlt." },
  },
  {
    id: "while-input", stage: "EF", field: "algorithms", competencies: ["M", "I"], difficulty: "medium", file: "Countdown.java",
    compileMode: "snippet", before: `int seconds = 3;`,
    solution: `while (seconds > 0) {\n    System.out.println(seconds);\n    seconds--;\n}`,
    required: [/while\s*\(\s*seconds\s*>\s*0\s*\)/, /seconds\s*--/, /println\s*\(\s*seconds\s*\)/],
    es: { short: "Bucle while", title: "Repetí con condición", objective: "Mantener una invariante de terminación.", prompt: "Mientras seconds sea mayor que cero, imprimilo y decrementalo.", concept: "while y terminación", hint: "La variable debe cambiar dentro del bucle.", explanation: "seconds-- garantiza que la condición eventualmente sea falsa.", error: "El while debe comprobar, imprimir y decrementar seconds." },
    de: { short: "while-Schleife", title: "Wiederhole bedingt", objective: "Eine Terminierungsinvariante erhalten.", prompt: "Solange seconds größer null ist, gib es aus und verringere es.", concept: "while und Terminierung", hint: "Die Variable muss sich in der Schleife ändern.", explanation: "seconds-- macht die Bedingung schließlich falsch.", error: "while muss seconds prüfen, ausgeben und verringern." },
  },
  {
    id: "uml-model", stage: "EF", field: "data", competencies: ["M", "D", "K"], difficulty: "medium", file: "Student.java",
    compileMode: "source", before: "",
    solution: `// UML: Student\n// - name: String\n// + getName(): String\npublic class Student {\n    private String name;\n    public String getName() { return name; }\n}`,
    required: [/class\s+Student/, /private\s+String\s+name/, /public\s+String\s+getName\s*\(\)/],
    evidenceRequired: [/UML\s*:\s*Student/, /-\s*name\s*:\s*String/, /\+\s*getName\(\)\s*:\s*String/],
    es: { short: "POO y UML", title: "Traducí un modelo", objective: "Pasar de una clase UML a Java.", prompt: "Modelá Student con name privado y getName público. Conservá el UML como comentarios.", concept: "UML, visibilidad y encapsulación", hint: "«-» significa private y «+» public.", explanation: "UML describe el contrato; Java lo implementa.", error: "Faltan Student, el atributo privado o el getter público." },
    de: { short: "OOP und UML", title: "Übersetze ein Modell", objective: "Ein UML-Klassenmodell in Java übertragen.", prompt: "Modelliere Student mit privatem name und öffentlichem getName. Bewahre UML als Kommentare.", concept: "UML, Sichtbarkeit und Kapselung", hint: "„-“ bedeutet private, „+“ public.", explanation: "UML beschreibt den Vertrag, Java implementiert ihn.", error: "Student, das private Attribut oder der Getter fehlt." },
  },
  {
    id: "tests-thinking", stage: "EF", field: "algorithms", competencies: ["A", "I", "K"], difficulty: "medium", file: "BoundaryCases.java",
    compileMode: "member", before: "",
    solution: `// Casos: -1 -> false; 0 -> true; 1 -> true\nboolean inRange(int value) {\n    return value >= 0 && value <= 10;\n}`,
    required: [/boolean\s+inRange\s*\(\s*int\s+value\s*\)/, /value\s*>=\s*0\s*&&\s*value\s*<=\s*10/],
    evidenceRequired: [/Casos|Fälle/, /-1\s*->\s*false/, /0\s*->\s*true/, /1\s*->\s*true/],
    es: { short: "Casos límite", title: "Pensá antes de ejecutar", objective: "Argumentar con ejemplos frontera.", prompt: "Implementá inRange para 0..10 inclusive y documentá tres casos límite.", concept: "Contrato y casos de prueba", hint: "Probá justo antes, en y después del límite.", explanation: "Los casos frontera hacen explícita la intención.", error: "Faltan el contrato 0..10 o los casos comentados." },
    de: { short: "Grenzfälle", title: "Denke vor dem Ausführen", objective: "Mit Grenzbeispielen argumentieren.", prompt: "Implementiere inRange inklusiv für 0..10 und dokumentiere drei Grenzfälle.", concept: "Vertrag und Testfälle", hint: "Prüfe direkt vor, auf und nach der Grenze.", explanation: "Grenzfälle machen die Absicht überprüfbar.", error: "Der Vertrag 0..10 oder kommentierte Fälle fehlen." },
  },
  {
    id: "inheritance", stage: "Q1", field: "data", competencies: ["M", "I"], difficulty: "medium", file: "Shape.java",
    compileMode: "source", before: "",
    solution: `abstract class Shape { abstract double area(); }\nclass Square extends Shape {\n    private final double side;\n    Square(double side) { this.side = side; }\n    @Override double area() { return side * side; }\n}`,
    required: [/abstract\s+class\s+Shape/, /class\s+Square\s+extends\s+Shape/, /@Override/, /return\s+side\s*\*\s*side/],
    es: { short: "Herencia", title: "Especializá un contrato", objective: "Modelar una jerarquía mínima.", prompt: "Creá Shape abstracta y Square que la extienda e implemente area().", concept: "Herencia y override", hint: "El método abstracto no tiene cuerpo.", explanation: "La subclase concreta cumple el contrato común.", error: "Faltan la clase abstracta, extends u override de area." },
    de: { short: "Vererbung", title: "Spezialisiere einen Vertrag", objective: "Eine minimale Hierarchie modellieren.", prompt: "Erstelle abstraktes Shape und Square, das area() implementiert.", concept: "Vererbung und Override", hint: "Die abstrakte Methode hat keinen Körper.", explanation: "Die konkrete Unterklasse erfüllt den gemeinsamen Vertrag.", error: "Abstrakte Klasse, extends oder area-Override fehlt." },
  },
  {
    id: "polymorphism", stage: "Q1", field: "data", competencies: ["A", "I", "D"], difficulty: "medium", file: "ShapeReport.java",
    compileMode: "snippet", before: `abstract class Shape { abstract double area(); }\nclass Square extends Shape {\n    private final double side;\n    Square(double side) { this.side = side; }\n    @Override double area() { return side * side; }\n}\nShape[] shapes = {new Square(2), new Square(3)};`,
    solution: `double total = 0.0;\nfor (Shape shape : shapes) {\n    total += shape.area();\n}`,
    required: [/double\s+total\s*=\s*0(?:\.0)?/, /for\s*\(\s*Shape\s+shape\s*:\s*shapes\s*\)/, /shape\.area\(\)/],
    es: { short: "Polimorfismo", title: "Programá contra el contrato", objective: "Despachar comportamiento dinámicamente.", prompt: "Sumá las áreas de shapes sin instanceof.", concept: "Polimorfismo y despacho dinámico", hint: "Cada Shape sabe calcular su propia área.", explanation: "La referencia común evita condicionales por subtipo.", error: "Usá for-each sobre Shape y llamá area()." },
    de: { short: "Polymorphie", title: "Programmiere gegen den Vertrag", objective: "Verhalten dynamisch aufrufen.", prompt: "Summiere die Flächen von shapes ohne instanceof.", concept: "Polymorphie und dynamische Bindung", hint: "Jedes Shape kennt seine eigene Fläche.", explanation: "Der gemeinsame Typ vermeidet Subtyp-Fallunterscheidungen.", error: "Nutze for-each über Shape und area()." },
  },
  {
    id: "stack", stage: "Q1", field: "data", competencies: ["M", "I"], difficulty: "medium", file: "Undo.java",
    compileMode: "snippet", before: "",
    solution: `Deque<String> history = new ArrayDeque<>();\nhistory.push("type A");\nString last = history.pop();\nSystem.out.println(last);`,
    required: [/Deque\s*<\s*String\s*>\s+history/, /new\s+ArrayDeque/, /history\.push/, /history\.pop/, /System\.out\.println\s*\(\s*last\s*\)/],
    es: { short: "Stack", title: "Deshacé en orden LIFO", objective: "Modelar historial con pila.", prompt: "Creá history como Deque, apilá una acción, recuperá la última e imprimí last.", concept: "Stack / LIFO", hint: "ArrayDeque ofrece push y pop.", explanation: "La última acción ingresada es la primera en salir.", error: "Faltan Deque/ArrayDeque, push, pop o la impresión de last." },
    de: { short: "Stack", title: "Mache in LIFO-Reihenfolge rückgängig", objective: "Verlauf als Stapel modellieren.", prompt: "Erstelle history als Deque, lege eine Aktion ab, hole die letzte und gib last aus.", concept: "Stack / LIFO", hint: "ArrayDeque bietet push und pop.", explanation: "Die zuletzt eingefügte Aktion wird zuerst entfernt.", error: "Deque/ArrayDeque, push, pop oder die Ausgabe von last fehlt." },
  },
  {
    id: "queue", stage: "Q1", field: "data", competencies: ["M", "I"], difficulty: "medium", file: "PrintQueue.java",
    compileMode: "snippet", before: "",
    solution: `Queue<String> jobs = new ArrayDeque<>();\njobs.offer("report.pdf");\nString next = jobs.poll();\nSystem.out.println(next);`,
    required: [/Queue\s*<\s*String\s*>\s+jobs/, /jobs\.offer/, /jobs\.poll/, /System\.out\.println\s*\(\s*next\s*\)/],
    es: { short: "Queue", title: "Atendé en orden FIFO", objective: "Modelar una cola de trabajo.", prompt: "Creá jobs, agregá report.pdf, retiralo de forma segura e imprimí next.", concept: "Queue / FIFO", hint: "offer y poll evitan excepciones por capacidad/vacío.", explanation: "La primera tarea ingresada es la primera atendida.", error: "Faltan Queue, offer, poll o la impresión de next." },
    de: { short: "Queue", title: "Bearbeite in FIFO-Reihenfolge", objective: "Eine Arbeitswarteschlange modellieren.", prompt: "Erstelle jobs, füge report.pdf hinzu, entnimm es sicher und gib next aus.", concept: "Queue / FIFO", hint: "offer und poll sind sichere Queue-Operationen.", explanation: "Der zuerst eingefügte Auftrag wird zuerst bearbeitet.", error: "Queue, offer, poll oder die Ausgabe von next fehlt." },
  },
  {
    id: "linked-list", stage: "Q1", field: "data", competencies: ["A", "M", "I"], difficulty: "medium", file: "Playlist.java",
    compileMode: "snippet", before: "",
    solution: `List<String> songs = new LinkedList<>();\nsongs.add("Intro");\nsongs.add(0, "Overture");\nsongs.remove("Intro");\nSystem.out.println(songs);`,
    required: [/List\s*<\s*String\s*>\s+songs\s*=\s*new\s+LinkedList/, /songs\.add/, /songs\.remove/, /System\.out\.println\s*\(\s*songs\s*\)/],
    es: { short: "List", title: "Editá una secuencia", objective: "Usar una lista con inserción y borrado.", prompt: "Creá songs como LinkedList, insertá dos títulos, eliminá Intro e imprimí la lista final.", concept: "Interfaz List y LinkedList", hint: "Declarar contra List reduce acoplamiento.", explanation: "List define el contrato; LinkedList la implementación.", error: "Faltan List/LinkedList, add, remove o la impresión de songs." },
    de: { short: "List", title: "Bearbeite eine Sequenz", objective: "Eine Liste mit Einfügen und Löschen verwenden.", prompt: "Erstelle songs als LinkedList, füge zwei Titel ein, entferne Intro und gib die finale Liste aus.", concept: "List-Schnittstelle und LinkedList", hint: "Die Deklaration gegen List reduziert Kopplung.", explanation: "List definiert den Vertrag, LinkedList die Umsetzung.", error: "List/LinkedList, add, remove oder die Ausgabe von songs fehlt." },
  },
  {
    id: "recursion", stage: "Q1", field: "algorithms", competencies: ["A", "M", "I"], difficulty: "hard", file: "Factorial.java",
    compileMode: "member", before: "",
    solution: `static int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}`,
    required: [/int\s+factorial\s*\(\s*int\s+n\s*\)/, /if\s*\(\s*n\s*<=\s*1\s*\)/, /return\s+n\s*\*\s*factorial\s*\(\s*n\s*-\s*1\s*\)/],
    es: { short: "Recursión", title: "Reducí el problema", objective: "Separar caso base y paso recursivo.", prompt: "Implementá factorial con caso base n <= 1.", concept: "Recursión y terminación", hint: "Toda llamada debe acercarse al caso base.", explanation: "n-1 reduce el problema y evita recursión infinita.", error: "Faltan firma, caso base o llamada con n-1." },
    de: { short: "Rekursion", title: "Verkleinere das Problem", objective: "Basisfall und Rekursionsschritt trennen.", prompt: "Implementiere factorial mit Basisfall n <= 1.", concept: "Rekursion und Terminierung", hint: "Jeder Aufruf muss sich dem Basisfall nähern.", explanation: "n-1 verkleinert das Problem und verhindert Endlosrekursion.", error: "Signatur, Basisfall oder Aufruf mit n-1 fehlt." },
  },
  {
    id: "linear-search", stage: "Q1", field: "algorithms", competencies: ["I", "D"], difficulty: "medium", file: "Search.java",
    compileMode: "member", before: `static int search(int[] values, int target) {`, after: `}`,
    solution: `for (int i = 0; i < values.length; i++) {\n    if (values[i] == target) return i;\n}\nreturn -1;`,
    required: [/for\s*\(\s*int\s+i\s*=\s*0;\s*i\s*<\s*values\.length;\s*i\+\+\s*\)/, /values\s*\[\s*i\s*]\s*==\s*target/, /return\s+-1/],
    es: { short: "Búsqueda lineal", title: "Buscá sin suponer orden", objective: "Recorrer hasta encontrar.", prompt: "Devolvé el índice de target o -1 si no aparece.", concept: "Búsqueda lineal O(n)", hint: "Compará cada values[i] y cortá al encontrar.", explanation: "Sin orden, en el peor caso se inspeccionan n elementos.", error: "Faltan recorrido, comparación o retorno -1." },
    de: { short: "Lineare Suche", title: "Suche ohne Sortierannahme", objective: "Bis zum Treffer durchlaufen.", prompt: "Gib den Index von target oder -1 zurück.", concept: "Lineare Suche O(n)", hint: "Vergleiche jedes values[i] und beende beim Treffer.", explanation: "Ohne Ordnung werden schlimmstenfalls n Elemente geprüft.", error: "Durchlauf, Vergleich oder -1-Rückgabe fehlt." },
  },
  {
    id: "binary-search", stage: "Q1", field: "algorithms", competencies: ["A", "M", "I"], difficulty: "hard", file: "BinarySearch.java",
    compileMode: "member", before: `static int search(int[] values, int target) {`, after: `}`,
    solution: `int low = 0, high = values.length - 1;\nwhile (low <= high) {\n    int mid = low + (high - low) / 2;\n    if (values[mid] == target) return mid;\n    if (values[mid] < target) low = mid + 1; else high = mid - 1;\n}\nreturn -1;`,
    required: [/low\s*=\s*0/, /high\s*=\s*values\.length\s*-\s*1/, /while\s*\(\s*low\s*<=\s*high\s*\)/, /mid\s*=\s*low\s*\+\s*\(high\s*-\s*low\)\s*\/\s*2/],
    es: { short: "Búsqueda binaria", title: "Partí el espacio", objective: "Buscar en datos ordenados en O(log n).", prompt: "Implementá búsqueda binaria con límites low/high.", concept: "Invariante y complejidad logarítmica", hint: "mid debe evitar overflow y cada paso descarta una mitad.", explanation: "La precondición es que values esté ordenado.", error: "Faltan límites, bucle o cálculo seguro de mid." },
    de: { short: "Binäre Suche", title: "Halbiere den Suchraum", objective: "In sortierten Daten in O(log n) suchen.", prompt: "Implementiere binäre Suche mit low/high.", concept: "Invariante und logarithmische Komplexität", hint: "mid soll Überlauf vermeiden; jeder Schritt verwirft eine Hälfte.", explanation: "Vorbedingung: values ist sortiert.", error: "Grenzen, Schleife oder sichere mid-Berechnung fehlt." },
  },
  {
    id: "insertion-sort", stage: "Q1", field: "algorithms", competencies: ["A", "I", "D"], difficulty: "hard", file: "InsertionSort.java",
    compileMode: "member", before: `static void sort(int[] values) {`, after: `}`,
    solution: `for (int i = 1; i < values.length; i++) {\n    int key = values[i];\n    int j = i - 1;\n    while (j >= 0 && values[j] > key) {\n        values[j + 1] = values[j];\n        j--;\n    }\n    values[j + 1] = key;\n}`,
    required: [/for\s*\(\s*int\s+i\s*=\s*1/, /int\s+key\s*=\s*values\s*\[\s*i\s*]/, /while\s*\([^)]*values\s*\[\s*j\s*]\s*>\s*key/, /values\s*\[\s*j\s*\+\s*1\s*]\s*=\s*key/],
    es: { short: "Ordenamiento", title: "Insertá manteniendo orden", objective: "Implementar insertion sort.", prompt: "Ordená values in-place mediante inserción.", concept: "Insertion sort y O(n²)", hint: "El prefijo antes de i permanece ordenado.", explanation: "Es cuadrático en general y eficiente en datos casi ordenados.", error: "Faltan key, desplazamiento o inserción final." },
    de: { short: "Sortieren", title: "Füge sortiert ein", objective: "Insertion Sort implementieren.", prompt: "Sortiere values in-place durch Einfügen.", concept: "Insertion Sort und O(n²)", hint: "Das Präfix vor i bleibt sortiert.", explanation: "Allgemein quadratisch, bei fast sortierten Daten oft gut.", error: "key, Verschiebung oder abschließendes Einfügen fehlt." },
  },
  {
    id: "efficiency", stage: "Q1", field: "algorithms", competencies: ["A", "D", "K"], difficulty: "medium", file: "Complexity.java",
    compileMode: "snippet", before: `boolean sorted = true;`,
    solution: `// Búsqueda lineal: O(n), no requiere orden.\n// Búsqueda binaria: O(log n), requiere datos ordenados.\nString choice = sorted ? "binary" : "linear";\nSystem.out.println(choice);`,
    required: [/sorted\s*\?\s*"binary"\s*:\s*"linear"/, /System\.out\.println\s*\(\s*choice\s*\)/],
    evidenceRequired: [/O\s*\(\s*n\s*\)/, /O\s*\(\s*log\s*n\s*\)/i, /requiere orden|benötigt sortierte Daten|Sortierung/i],
    es: { short: "Eficiencia", title: "Justificá el algoritmo", objective: "Comparar costo y precondiciones.", prompt: "Documentá lineal vs binaria, elegí según sorted e imprimí la decisión.", concept: "Complejidad y trade-offs", hint: "No mires solo Big-O: anotá la precondición de orden.", explanation: "La opción asintóticamente mejor puede exigir preparación adicional.", error: "Faltan ambas complejidades, la decisión según sorted o su impresión." },
    de: { short: "Effizienz", title: "Begründe den Algorithmus", objective: "Kosten und Vorbedingungen vergleichen.", prompt: "Dokumentiere linear vs. binär, wähle anhand sorted und gib die Entscheidung aus.", concept: "Komplexität und Trade-offs", hint: "Nicht nur Big-O: Sortierung ist eine Vorbedingung.", explanation: "Die asymptotisch bessere Wahl kann Vorbereitung verlangen.", error: "Beide Komplexitäten, die Auswahl nach sorted oder ihre Ausgabe fehlt." },
  },
  {
    id: "bst", stage: "Q1", field: "data", competencies: ["M", "I", "D"], difficulty: "hard", file: "BinarySearchTree.java",
    compileMode: "member", before: `static final class Node {\n    final int value;\n    Node left;\n    Node right;\n    Node(int value) { this.value = value; }\n}`,
    solution: `Node insert(Node node, int value) {\n    if (node == null) return new Node(value);\n    if (value < node.value) node.left = insert(node.left, value);\n    else if (value > node.value) node.right = insert(node.right, value);\n    return node;\n}`,
    required: [/Node\s+insert\s*\(\s*Node\s+node\s*,\s*int\s+value\s*\)/, /node\s*==\s*null/, /node\.left\s*=\s*insert/, /node\.right\s*=\s*insert/],
    es: { short: "Árbol BST", title: "Conservá el orden del árbol", objective: "Insertar recursivamente en un BST.", prompt: "Implementá insert sin duplicados.", concept: "BST e invariante de orden", hint: "Menores van a izquierda; mayores, a derecha.", explanation: "La estructura mantiene el orden local en cada nodo.", error: "Faltan caso vacío o inserciones izquierda/derecha." },
    de: { short: "BST-Baum", title: "Bewahre die Baumordnung", objective: "Rekursiv in einen BST einfügen.", prompt: "Implementiere insert ohne Duplikate.", concept: "BST und Ordnungsinvariante", hint: "Kleinere Werte nach links, größere nach rechts.", explanation: "Jeder Knoten erhält die lokale Ordnung.", error: "Leerer Fall oder linkes/rechtes Einfügen fehlt." },
  },
  {
    id: "graph-bfs", stage: "Q1", field: "data", competencies: ["M", "I", "D"], difficulty: "hard", file: "GraphBfs.java",
    compileMode: "member", before: `static void bfs(Map<Integer, List<Integer>> graph, int start) {`, after: `}`,
    solution: `Queue<Integer> open = new ArrayDeque<>();\nSet<Integer> visited = new HashSet<>();\nopen.offer(start);\nvisited.add(start);\nwhile (!open.isEmpty()) {\n    int node = open.poll();\n    for (int next : graph.get(node)) if (visited.add(next)) open.offer(next);\n}`,
    required: [/Queue\s*<\s*Integer\s*>/, /Set\s*<\s*Integer\s*>/, /while\s*\(\s*!open\.isEmpty\(\)\s*\)/, /visited\.add\s*\(\s*next\s*\)/],
    es: { short: "Grafos BFS", title: "Explorá por niveles", objective: "Recorrer un grafo evitando ciclos.", prompt: "Implementá BFS con cola y conjunto visited.", concept: "Grafo, BFS y visitados", hint: "Marcá al encolar, no al retirar.", explanation: "La cola produce recorrido por distancia no ponderada.", error: "Faltan cola, visitados o expansión BFS." },
    de: { short: "Graphen BFS", title: "Durchsuche ebenenweise", objective: "Einen Graphen ohne Zyklen durchlaufen.", prompt: "Implementiere BFS mit Queue und visited-Set.", concept: "Graph, BFS und Besuche", hint: "Beim Einfügen markieren, nicht beim Entnehmen.", explanation: "Die Queue besucht nach ungewichteter Distanz.", error: "Queue, visited oder BFS-Erweiterung fehlt." },
  },
  {
    id: "dfa", stage: "Q2", field: "formal", competencies: ["M", "I", "D"], difficulty: "medium", file: "EvenOnesDfa.java",
    compileMode: "member", before: `static boolean accepts(String word) {`, after: `}`,
    solution: `boolean even = true;\nfor (char symbol : word.toCharArray()) {\n    if (symbol == '1') even = !even;\n    else if (symbol != '0') return false;\n}\nreturn even;`,
    required: [/boolean\s+even\s*=\s*true/, /for\s*\(\s*char\s+symbol\s*:\s*word\.toCharArray\(\)\s*\)/, /symbol\s*==\s*'1'/, /even\s*=\s*!even/],
    es: { short: "Autómata DFA", title: "Simulá estados finitos", objective: "Reconocer palabras con cantidad par de unos.", prompt: "Simulá un DFA binario y rechazá símbolos fuera de 0/1.", concept: "DFA, estado y transición", hint: "Un 1 alterna el estado; un 0 lo conserva.", explanation: "El boolean representa los dos estados del autómata.", error: "Faltan estado inicial, recorrido o transición con 1." },
    de: { short: "DFA-Automat", title: "Simuliere endliche Zustände", objective: "Wörter mit gerader Einsanzahl erkennen.", prompt: "Simuliere einen binären DFA und verwerfe andere Zeichen.", concept: "DFA, Zustand und Übergang", hint: "Eine 1 wechselt den Zustand; 0 behält ihn.", explanation: "Der boolean repräsentiert die zwei Zustände.", error: "Startzustand, Durchlauf oder 1-Übergang fehlt." },
  },
  {
    id: "grammar", stage: "Q2", field: "formal", competencies: ["A", "M", "D", "K"], difficulty: "medium", file: "GrammarModel.java",
    compileMode: "snippet", before: `String word = "aaabbb";`,
    solution: `// G = ({S}, {a,b}, P, S)\n// P: S -> aSb | ε\nboolean generated = word.matches("a*b*") && word.replace("b", "").length() == word.replace("a", "").length();`,
    required: [/word\.matches/, /word\.replace/],
    evidenceRequired: [/S\s*->\s*aSb/, /ε|epsilon/],
    es: { short: "Gramáticas", title: "Modelá una producción", objective: "Representar una gramática y un reconocedor limitado.", prompt: "Documentá S → aSb | ε y modelá una comprobación para aⁿbⁿ.", concept: "Gramática formal y límites del modelo", hint: "Conservá la producción en comentarios y separá forma de conteo.", explanation: "La expresión regular sola no demuestra el lenguaje; el conteo completa este modelo acotado.", error: "Faltan producción, epsilon o modelo de comprobación." },
    de: { short: "Grammatiken", title: "Modelliere eine Produktion", objective: "Grammatik und begrenzten Erkenner darstellen.", prompt: "Dokumentiere S → aSb | ε und modelliere eine Prüfung für aⁿbⁿ.", concept: "Formale Grammatik und Modellgrenzen", hint: "Produktion kommentieren; Form und Anzahl getrennt prüfen.", explanation: "Der reguläre Ausdruck allein erkennt die Sprache nicht; die Zählung ergänzt das Modell.", error: "Produktion, epsilon oder Prüfmodell fehlt." },
  },
  {
    id: "parser", stage: "Q2", field: "formal", competencies: ["M", "I"], difficulty: "hard", file: "TinyParser.java",
    compileMode: "member", before: "",
    solution: `int parseSum(String input) {\n    String[] parts = input.split("\\\\+");\n    int sum = 0;\n    for (String part : parts) sum += Integer.parseInt(part.trim());\n    return sum;\n}`,
    required: [/String\s*\[\s*]\s+parts\s*=\s*input\.split/, /Integer\.parseInt/, /return\s+sum/],
    es: { short: "Parser simple", title: "Interpretá una mini lengua", objective: "Separar tokens y construir significado.", prompt: "Interpretá sumas como «2 + 3 + 4».", concept: "Tokenización e interpretación", hint: "Separá por +, limpiá espacios y convertí cada token.", explanation: "Es un parser educativo limitado, no una gramática Java.", error: "Faltan tokenización, conversión o acumulación." },
    de: { short: "Einfacher Parser", title: "Interpretiere eine Minisprache", objective: "Tokens trennen und Bedeutung bilden.", prompt: "Interpretiere Summen wie „2 + 3 + 4“.", concept: "Tokenisierung und Interpretation", hint: "An + trennen, trimmen und jedes Token umwandeln.", explanation: "Dies ist ein begrenzter Lernparser, keine Java-Grammatik.", error: "Tokenisierung, Umwandlung oder Summe fehlt." },
  },
  {
    id: "sql", stage: "Q2", field: "data", competencies: ["M", "D"], difficulty: "medium", file: "QueryModel.java",
    compileMode: "snippet", before: "",
    solution: `String sql = "SELECT name FROM Student WHERE grade >= ? ORDER BY name";\n// ? se enlaza como parámetro, no se concatena.`,
    required: [/SELECT\s+name\s+FROM\s+Student\s+WHERE\s+grade\s*>=\s*\?\s+ORDER\s+BY\s+name/i],
    evidenceRequired: [/parámetro|Parameter/i, /no se concatena|nicht verkettet/i],
    es: { short: "SQL", title: "Consultá datos con intención", objective: "Modelar selección, filtro y orden.", prompt: "Guardá una consulta parametrizada de nombres por nota mínima.", concept: "SQL y parámetros", hint: "Usá ? en lugar de concatenar entrada.", explanation: "La cadena modela SQL; la app no conecta una base real.", error: "Falta SELECT/WHERE/ORDER BY parametrizado." },
    de: { short: "SQL", title: "Frage Daten gezielt ab", objective: "Auswahl, Filter und Ordnung modellieren.", prompt: "Speichere eine parametrisierte Namensabfrage nach Mindestnote.", concept: "SQL und Parameter", hint: "Nutze ? statt Eingaben zu verketten.", explanation: "Der String modelliert SQL; keine echte Datenbank wird verbunden.", error: "Parametrisiertes SELECT/WHERE/ORDER BY fehlt." },
  },
  {
    id: "normalization", stage: "Q2", field: "data", competencies: ["A", "M", "D", "K"], difficulty: "medium", file: "Schema.java",
    compileMode: "source", before: "",
    solution: `// 3NF\n// Student(studentId PK, name)\n// Course(courseId PK, title)\n// Enrollment(studentId FK, courseId FK, grade)\nrecord Enrollment(int studentId, int courseId, int grade) {}`,
    required: [/record\s+Enrollment\s*\(\s*int\s+studentId\s*,\s*int\s+courseId\s*,\s*int\s+grade/],
    evidenceRequired: [/3NF/, /Student\s*\(/, /Course\s*\(/, /Enrollment\s*\(/, /FK/],
    es: { short: "Normalización", title: "Separá responsabilidades de datos", objective: "Modelar una relación N:M en 3NF.", prompt: "Documentá Student, Course y Enrollment con claves.", concept: "Normalización y dependencias", hint: "La nota depende de la pareja estudiante-curso.", explanation: "La tabla puente evita grupos repetidos y redundancia.", error: "Faltan 3NF, entidades o claves de Enrollment." },
    de: { short: "Normalisierung", title: "Trenne Datenverantwortung", objective: "Eine N:M-Beziehung in 3NF modellieren.", prompt: "Dokumentiere Student, Course und Enrollment mit Schlüsseln.", concept: "Normalisierung und Abhängigkeiten", hint: "Die Note hängt vom Paar Schüler-Kurs ab.", explanation: "Die Zwischentabelle vermeidet Wiederholungsgruppen.", error: "3NF, Entitäten oder Enrollment-Schlüssel fehlen." },
  },
  {
    id: "network", stage: "Q2", field: "systems", competencies: ["M", "D", "K"], difficulty: "medium", file: "PacketRoute.java",
    compileMode: "snippet", before: "",
    solution: `record Packet(String source, String destination, String payload) {}\nList<String> route = List.of("client", "router", "server");\n// Cada salto procesa el paquete; Internet no garantiza una ruta fija.`,
    required: [/record\s+Packet/, /source/, /destination/, /List\.of\s*\(\s*"client"\s*,\s*"router"\s*,\s*"server"/],
    es: { short: "Redes", title: "Modelá un recorrido de paquetes", objective: "Distinguir paquete, nodo y ruta.", prompt: "Representá un paquete y una ruta educativa cliente-router-servidor.", concept: "Redes por capas y paquetes", hint: "No confundas la simulación con una ruta real fija.", explanation: "El modelo simplifica encaminamiento para hacerlo observable.", error: "Faltan Packet o la ruta de tres nodos." },
    de: { short: "Netzwerke", title: "Modelliere einen Paketweg", objective: "Paket, Knoten und Route unterscheiden.", prompt: "Stelle ein Paket und den Lernweg Client-Router-Server dar.", concept: "Schichten und Pakete", hint: "Die Simulation ist keine feste reale Route.", explanation: "Das Modell vereinfacht Routing, um es sichtbar zu machen.", error: "Packet oder Drei-Knoten-Route fehlt." },
  },
  {
    id: "caesar", stage: "Q2", field: "society", competencies: ["A", "I", "D"], difficulty: "medium", file: "CaesarDemo.java",
    compileMode: "member", before: "",
    solution: `char encryptUpper(char c, int shift) {\n    return (char) ('A' + (c - 'A' + shift) % 26);\n}\n// Solo demostración: César NO protege datos reales.`,
    required: [/char\s+encryptUpper/, /%\s*26/],
    evidenceRequired: [/NO|NICHT|nicht\s+sicher/i],
    es: { short: "Cifrado educativo", title: "Entendé sustitución y límite", objective: "Implementar César sin presentarlo como seguridad.", prompt: "Cifrá una mayúscula con módulo 26 y advertí que no es seguro.", concept: "Cifrado César y seguridad", hint: "Normalizá respecto de 'A' y usá módulo 26.", explanation: "Sirve para estudiar transformación, NO para proteger información.", error: "Faltan transformación modular o advertencia de inseguridad." },
    de: { short: "Lernverschlüsselung", title: "Verstehe Ersetzung und Grenze", objective: "Caesar implementieren, ohne Sicherheit zu behaupten.", prompt: "Verschiebe einen Großbuchstaben modulo 26 und warne vor Unsicherheit.", concept: "Caesar-Chiffre und Sicherheit", hint: "Relativ zu 'A' rechnen und modulo 26 verwenden.", explanation: "Geeignet zum Lernen, NICHT zum Schutz echter Daten.", error: "Modulare Umwandlung oder Sicherheitswarnung fehlt." },
  },
  {
    id: "privacy", stage: "Q2", field: "society", competencies: ["A", "M", "K"], difficulty: "medium", file: "PrivacyModel.java",
    compileMode: "snippet", before: `String id = "student-17";\nint grade = 12;`,
    solution: `String pseudonym = Integer.toHexString(id.hashCode());\nrecord StudentView(String pseudonym, int grade) {}\nStudentView shared = new StudentView(pseudonym, grade);\n// Minimización: no compartir nombre, email ni fecha de nacimiento.`,
    required: [/String\s+pseudonym\s*=\s*Integer\.toHexString\s*\(\s*id\.hashCode\(\)\s*\)/, /record\s+StudentView/, /new\s+StudentView\s*\(\s*pseudonym\s*,\s*grade\s*\)/],
    evidenceRequired: [/Minimizaci|Datenminimierung/i, /nombre|Name/i, /email|E-Mail/i],
    es: { short: "Privacidad", title: "Compartí solo lo necesario", objective: "Aplicar minimización y seudonimización.", prompt: "Modelá una vista de notas sin identidad directa.", concept: "Privacidad desde el diseño", hint: "Un hash no vuelve anónimos automáticamente los datos.", explanation: "La minimización reduce exposición; la seudonimización sigue requiriendo protección.", error: "Faltan vista mínima, seudónimo o justificación." },
    de: { short: "Datenschutz", title: "Teile nur Notwendiges", objective: "Datenminimierung und Pseudonymisierung anwenden.", prompt: "Modelliere eine Notenansicht ohne direkte Identität.", concept: "Privacy by Design", hint: "Ein Hash anonymisiert Daten nicht automatisch.", explanation: "Minimierung senkt Exposition; Pseudonyme bleiben schutzbedürftig.", error: "Minimale Ansicht, Pseudonym oder Begründung fehlt." },
  },
  {
    id: "von-neumann", stage: "Q2", field: "systems", competencies: ["M", "D"], difficulty: "medium", file: "VonNeumann.java",
    compileMode: "snippet", before: "",
    solution: `String[] cycle = {"FETCH", "DECODE", "EXECUTE", "STORE"};\nfor (String phase : cycle) System.out.println(phase);\n// Programa y datos comparten memoria en el modelo de Von Neumann.`,
    required: [/FETCH/, /DECODE/, /EXECUTE/, /STORE/],
    evidenceRequired: [/comparten memoria|gemeinsamen Speicher/i],
    es: { short: "Von Neumann", title: "Simulá el ciclo de instrucción", objective: "Representar fases y memoria compartida.", prompt: "Recorré FETCH, DECODE, EXECUTE, STORE y explicá el modelo.", concept: "Arquitectura Von Neumann", hint: "Es un modelo conceptual, no una emulación de CPU.", explanation: "El ciclo ayuda a relacionar software, memoria y procesador.", error: "Faltan fases o explicación de memoria compartida." },
    de: { short: "Von Neumann", title: "Simuliere den Befehlszyklus", objective: "Phasen und gemeinsamen Speicher darstellen.", prompt: "Durchlaufe FETCH, DECODE, EXECUTE, STORE und erkläre das Modell.", concept: "Von-Neumann-Architektur", hint: "Konzeptmodell, keine CPU-Emulation.", explanation: "Der Zyklus verbindet Software, Speicher und Prozessor.", error: "Phasen oder Erklärung des gemeinsamen Speichers fehlt." },
  },
  {
    id: "concurrency-limits", stage: "Q2", field: "systems", competencies: ["A", "M", "K"], difficulty: "hard", file: "RaceModel.java",
    compileMode: "snippet", before: `int balance = 0;`,
    solution: `// Lectura-modificación-escritura NO es atómica.\nint snapshotA = balance;\nint snapshotB = balance;\nbalance = snapshotA + 1;\nbalance = snapshotB + 1;\n// Resultado posible: se pierde una actualización.`,
    required: [/snapshotA/, /snapshotB/, /balance\s*=\s*snapshotA\s*\+\s*1/, /balance\s*=\s*snapshotB\s*\+\s*1/],
    evidenceRequired: [/NO\s+es\s+atómica|NICHT\s+atomar/i, /pierde una actualización|Update verloren/i],
    es: { short: "Límites concurrentes", title: "Hacé visible una carrera", objective: "Argumentar sobre intercalado y atomicidad.", prompt: "Modelá dos incrementos intercalados que pierdan una actualización.", concept: "Race condition y atomicidad", hint: "Separá leer, sumar y escribir.", explanation: "La secuencia demuestra por qué ++ no es una transacción.", error: "Faltan dos snapshots o explicación de actualización perdida." },
    de: { short: "Nebenläufigkeitsgrenzen", title: "Mache ein Rennen sichtbar", objective: "Über Interleaving und Atomarität argumentieren.", prompt: "Modelliere zwei verschachtelte Inkremente mit verlorenem Update.", concept: "Race Condition und Atomarität", hint: "Lesen, Rechnen und Schreiben trennen.", explanation: "Die Sequenz zeigt, warum ++ keine Transaktion ist.", error: "Zwei Snapshots oder Erklärung des verlorenen Updates fehlt." },
  },
  {
    id: "halting-limit", stage: "Q2", field: "formal", competencies: ["A", "D", "K"], difficulty: "hard", file: "Computability.java",
    compileMode: "snippet", before: "",
    solution: `// No existe un algoritmo general que decida para todo programa y entrada si termina.\nString model = "halting problem";\nboolean claimUniversalSolver = false;`,
    required: [/halting problem/, /claimUniversalSolver\s*=\s*false/],
    evidenceRequired: [/algoritmo general|allgemeinen Algorithmus/i, /todo programa|jedes Programm/i],
    es: { short: "Límites computables", title: "Reconocé lo indecidible", objective: "Explicar el límite del problema de parada.", prompt: "Representá y comentá por qué no hay solucionador universal de terminación.", concept: "Computabilidad y problema de parada", hint: "No confundas casos particulares con una decisión universal.", explanation: "Podemos analizar muchos programas, pero no decidir todos algorítmicamente.", error: "Falta la afirmación correcta o negar el solucionador universal." },
    de: { short: "Berechenbarkeitsgrenzen", title: "Erkenne Unentscheidbarkeit", objective: "Die Grenze des Halteproblems erklären.", prompt: "Stelle dar, warum es keinen universellen Terminierungsentscheider gibt.", concept: "Berechenbarkeit und Halteproblem", hint: "Einzelfälle sind kein universelles Verfahren.", explanation: "Viele Programme sind analysierbar, aber nicht alle algorithmisch entscheidbar.", error: "Korrekte Aussage oder Ablehnung des Universallösers fehlt." },
  },
  {
    id: "hash-map", stage: "Q2", field: "data", competencies: ["A", "I"], difficulty: "medium", file: "Frequency.java",
    compileMode: "snippet", before: `String[] words = {"java", "oop", "java"};`,
    solution: `Map<String, Integer> counts = new HashMap<>();\nfor (String word : words) {\n    counts.merge(word, 1, Integer::sum);\n}\nSystem.out.println(counts);`,
    required: [/Map\s*<\s*String\s*,\s*Integer\s*>\s+counts/, /new\s+HashMap/, /counts\.merge\s*\(\s*word\s*,\s*1\s*,\s*Integer::sum/, /System\.out\.println\s*\(\s*counts\s*\)/],
    es: { short: "Map", title: "Contá por clave", objective: "Construir una tabla de frecuencias.", prompt: "Contá cada palabra con HashMap.merge e imprimí counts.", concept: "Map, hashing y frecuencia", hint: "merge cubre alta y actualización en una operación.", explanation: "El acceso esperado es O(1), no una garantía absoluta.", error: "Faltan Map/HashMap, merge o la impresión de counts." },
    de: { short: "Map", title: "Zähle nach Schlüssel", objective: "Eine Häufigkeitstabelle aufbauen.", prompt: "Zähle jedes Wort mit HashMap.merge und gib counts aus.", concept: "Map, Hashing und Häufigkeit", hint: "merge behandelt Einfügen und Aktualisieren.", explanation: "Erwarteter Zugriff ist O(1), keine absolute Garantie.", error: "Map/HashMap, merge oder die Ausgabe von counts fehlt." },
  },
  {
    id: "guessing-game", stage: "EF", field: "algorithms", competencies: ["M", "I"], difficulty: "easy", file: "GuessingGame.java",
    compileMode: "snippet", before: `int secret = 7;\nint guess = 5;`,
    solution: `if (guess < secret) {\n    System.out.println("too low");\n} else if (guess > secret) {\n    System.out.println("too high");\n} else {\n    System.out.println("hit");\n}`,
    required: [/if\s*\(\s*guess\s*<\s*secret\s*\)/, /else\s+if\s*\(\s*guess\s*>\s*secret\s*\)/, /System\.out\.println\s*\(\s*"too low"\s*\)/, /System\.out\.println\s*\(\s*"hit"\s*\)/],
    es: { short: "Juego: adivinar", title: "Compará una apuesta", objective: "Modelar feedback de un mini juego con ramas claras.", prompt: "Compará guess contra secret: imprimí too low, too high o hit según corresponda.", concept: "if/else if/else en lógica de juego", hint: "Primero cubrí menor, después mayor y dejá el acierto para el else.", explanation: "Un juego simple no necesita magia: necesita estados observables y decisiones exclusivas.", error: "Faltan las tres ramas del juego o la salida visible." },
    de: { short: "Spiel: Raten", title: "Vergleiche einen Tipp", objective: "Feedback eines Mini-Spiels mit klaren Zweigen modellieren.", prompt: "Vergleiche guess mit secret: Gib too low, too high oder hit passend aus.", concept: "if/else if/else in Spiellogik", hint: "Erst kleiner, dann größer prüfen; der Treffer bleibt im else.", explanation: "Ein einfaches Spiel braucht keine Magie, sondern sichtbare Zustände und exklusive Entscheidungen.", error: "Die drei Spielzweige oder die sichtbare Ausgabe fehlen." },
  },
  {
    id: "score-level", stage: "EF", field: "algorithms", competencies: ["A", "I"], difficulty: "medium", file: "ScoreLevel.java",
    compileMode: "snippet", before: `int points = 1200;`,
    solution: `String badge = points >= 1000 ? "LEVEL_UP" : "KEEP_TRAINING";\nSystem.out.println(badge);`,
    required: [/String\s+badge/, /points\s*>=\s*1000\s*\?\s*"LEVEL_UP"\s*:\s*"KEEP_TRAINING"/, /System\.out\.println\s*\(\s*badge\s*\)/],
    es: { short: "Puntaje", title: "Convertí puntos en estado", objective: "Usar una expresión condicional para comunicar progreso.", prompt: "Creá badge con el operador ternario: LEVEL_UP si points >= 1000, si no KEEP_TRAINING. Imprimí badge.", concept: "Ternario y estado de juego", hint: "El ternario tiene forma condición ? valorSiTrue : valorSiFalse.", explanation: "La UI de un juego se alimenta de estados simples; el cálculo debe quedar explícito.", error: "Falta badge con ternario, umbral 1000 o impresión." },
    de: { short: "Punkte", title: "Wandle Punkte in Status", objective: "Mit einem bedingten Ausdruck Fortschritt kommunizieren.", prompt: "Erstelle badge mit dem ternären Operator: LEVEL_UP bei points >= 1000, sonst KEEP_TRAINING. Gib badge aus.", concept: "Ternärer Operator und Spielstatus", hint: "Die Form lautet Bedingung ? WertWennTrue : WertWennFalse.", explanation: "Eine Spiel-UI lebt von einfachen Zuständen; die Berechnung muss sichtbar bleiben.", error: "badge mit ternärem Operator, Schwelle 1000 oder Ausgabe fehlt." },
  },
  {
    id: "dice-duel", stage: "Q1", field: "algorithms", competencies: ["M", "I", "D"], difficulty: "medium", file: "DiceDuel.java",
    compileMode: "snippet", before: `int mara = 4;\nint noah = 6;`,
    solution: `String winner = mara > noah ? "Mara wins" : "Noah wins";\nSystem.out.println(winner);`,
    required: [/String\s+winner/, /mara\s*>\s*noah\s*\?\s*"Mara wins"\s*:\s*"Noah wins"/, /System\.out\.println\s*\(\s*winner\s*\)/],
    es: { short: "Duelo de dados", title: "Resolvé un turno", objective: "Separar datos del resultado visible de una ronda.", prompt: "Compará mara y noah, guardá el texto ganador en winner e imprimilo.", concept: "Regla de juego y resultado", hint: "No imprimas dos caminos: calculá winner una vez y después mostrala.", explanation: "Nombrar el resultado baja la complejidad: primero decidís, después comunicás.", error: "Falta calcular winner desde mara/noah o imprimirlo." },
    de: { short: "Würfelduell", title: "Entscheide eine Runde", objective: "Daten und sichtbares Rundenergebnis trennen.", prompt: "Vergleiche mara und noah, speichere den Gewinnertext in winner und gib ihn aus.", concept: "Spielregel und Ergebnis", hint: "Nicht zwei Wege direkt drucken: Berechne winner einmal und gib ihn dann aus.", explanation: "Ein benanntes Ergebnis senkt Komplexität: erst entscheiden, dann kommunizieren.", error: "winner aus mara/noah oder seine Ausgabe fehlt." },
  },
  {
    id: "snake-step", stage: "Q1", field: "algorithms", competencies: ["M", "I"], difficulty: "medium", file: "SnakeStep.java",
    compileMode: "snippet", before: `int x = 2;\nint y = 2;\nchar direction = 'R';`,
    solution: `switch (direction) {\n    case 'R': x++; break;\n    case 'L': x--; break;\n    case 'U': y--; break;\n    case 'D': y++; break;\n    default: throw new IllegalArgumentException("bad direction");\n}\nSystem.out.println(x + "," + y);`,
    required: [/switch\s*\(\s*direction\s*\)/, /case\s+'R'\s*:/, /x\s*\+\+/, /case\s+'L'\s*:/, /case\s+'U'\s*:/, /case\s+'D'\s*:/, /System\.out\.println\s*\(\s*x\s*\+\s*","\s*\+\s*y\s*\)/],
    es: { short: "Snake: paso", title: "Mové una ficha", objective: "Traducir una dirección a cambio de coordenadas.", prompt: "Usá switch sobre direction para mover x/y y después imprimí x,y.", concept: "switch, coordenadas y estado mutable", hint: "R suma x; L resta x; U resta y; D suma y.", explanation: "Un juego de grilla es estado + transición. Si no entendés eso, sólo estás copiando código.", error: "Falta switch por dirección, actualización de coordenadas o impresión x,y." },
    de: { short: "Snake: Schritt", title: "Bewege eine Figur", objective: "Eine Richtung in Koordinatenänderung übersetzen.", prompt: "Nutze switch über direction, bewege x/y und gib danach x,y aus.", concept: "switch, Koordinaten und veränderlicher Zustand", hint: "R erhöht x; L verringert x; U verringert y; D erhöht y.", explanation: "Ein Rasterspiel ist Zustand plus Übergang. Ohne dieses Konzept kopierst du nur Code.", error: "switch nach Richtung, Koordinatenänderung oder x,y-Ausgabe fehlt." },
  },
  {
    id: "exception-parse", stage: "Q2", field: "systems", competencies: ["A", "I", "K"], difficulty: "medium", file: "SafeParse.java",
    compileMode: "snippet", before: `String input = "42";`,
    solution: `try {\n    int value = Integer.parseInt(input);\n    System.out.println(value);\n} catch (NumberFormatException error) {\n    System.out.println("invalid");\n}`,
    required: [/try\s*\{/, /Integer\.parseInt\s*\(\s*input\s*\)/, /catch\s*\(\s*NumberFormatException\s+\w+\s*\)/, /System\.out\.println\s*\(\s*"invalid"\s*\)/],
    es: { short: "Excepciones", title: "Parseá sin romper", objective: "Controlar una entrada inválida con catch específico.", prompt: "Parseá input con Integer.parseInt dentro de try; capturá NumberFormatException e imprimí invalid.", concept: "Excepciones y recuperación", hint: "No captures Exception genérico si conocés el fallo esperado.", explanation: "La recuperación responsable empieza por acotar qué puede fallar y cómo responder.", error: "Falta try, parseInt, catch específico o salida invalid." },
    de: { short: "Exceptions", title: "Parse ohne Absturz", objective: "Ungültige Eingabe mit spezifischem catch behandeln.", prompt: "Parse input mit Integer.parseInt im try; fange NumberFormatException ab und gib invalid aus.", concept: "Exceptions und Wiederherstellung", hint: "Fange nicht generisch Exception, wenn der erwartete Fehler bekannt ist.", explanation: "Verantwortliche Fehlerbehandlung beginnt damit, erwartete Fehler klar einzugrenzen.", error: "try, parseInt, spezifischer catch oder invalid-Ausgabe fehlt." },
  },
  {
    id: "stream-filter", stage: "Q2", field: "data", competencies: ["A", "I", "D"], difficulty: "hard", file: "StreamFilter.java",
    compileMode: "snippet", before: `List<String> names = List.of("Mara", "Noah", "Lina");`,
    solution: `long count = names.stream()\n    .filter(name -> name.toLowerCase().contains("a"))\n    .count();\nSystem.out.println(count);`,
    required: [/long\s+count/, /names\.stream\s*\(\s*\)/, /\.filter\s*\(\s*name\s*->\s*name\.toLowerCase\(\)\.contains\(\s*"a"\s*\)\s*\)/, /\.count\s*\(\s*\)/, /System\.out\.println\s*\(\s*count\s*\)/],
    es: { short: "Streams", title: "Filtrá una colección", objective: "Expresar una consulta de datos sin mutar la lista.", prompt: "Contá con stream/filter/count los nombres que contienen la letra a e imprimí count.", concept: "Streams, lambda y consulta", hint: "stream() crea la tubería; filter conserva elementos; count produce el resultado.", explanation: "Streams sirven cuando pensás en transformación de datos. No reemplazan entender bucles: LOS ABSTRAEN.", error: "Faltan stream, lambda de filtro, count o impresión." },
    de: { short: "Streams", title: "Filtere eine Sammlung", objective: "Eine Datenabfrage ohne Mutation der Liste ausdrücken.", prompt: "Zähle mit stream/filter/count die Namen mit Buchstabe a und gib count aus.", concept: "Streams, Lambda und Abfrage", hint: "stream() startet die Pipeline; filter behält Elemente; count liefert das Ergebnis.", explanation: "Streams helfen bei Datentransformation. Sie ersetzen Schleifenverständnis nicht, sie abstrahieren es.", error: "stream, Filter-Lambda, count oder Ausgabe fehlt." },
  },
  {
    id: "combo-counter", stage: "EF", field: "algorithms", competencies: ["I", "D"], difficulty: "easy", file: "ComboCounter.java",
    compileMode: "snippet", before: `int[] hits = {1, 1, 0, 1, 1, 1};`,
    solution: `int combo = 0;\nint best = 0;\nfor (int hit : hits) {\n    combo = hit == 1 ? combo + 1 : 0;\n    best = Math.max(best, combo);\n}\nSystem.out.println(best);`,
    required: [/int\s+combo\s*=\s*0/, /for\s*\(\s*int\s+hit\s*:\s*hits\s*\)/, /hit\s*==\s*1/, /Math\.max\s*\(\s*best\s*,\s*combo\s*\)/, /System\.out\.println\s*\(\s*best\s*\)/],
    es: { short: "Juego · Combo", title: "Medí una racha", objective: "Actualizar estado de juego sin perder el mejor resultado.", prompt: "Recorré hits: acumulá combo mientras hit sea 1, reinicialo con 0 y guardá el máximo en best. Imprimí best.", concept: "Estado, acumulador y máximo", hint: "Una racha depende del estado anterior: combo + 1 o vuelta a cero.", explanation: "La mecánica de un juego es una transición de estado. Nombrarla evita una solución opaca.", error: "Faltan la racha, el recorrido, el reinicio, el máximo o la salida." },
    de: { short: "Spiel · Combo", title: "Miss eine Serie", objective: "Spielzustand aktualisieren, ohne das beste Ergebnis zu verlieren.", prompt: "Durchlaufe hits: erhöhe combo bei 1, setze bei 0 zurück und speichere das Maximum in best. Gib best aus.", concept: "Zustand, Akkumulator und Maximum", hint: "Eine Serie hängt vom vorherigen Zustand ab: combo + 1 oder zurück auf null.", explanation: "Spielmechanik ist eine Zustandsänderung. Benennung verhindert eine undurchsichtige Lösung.", error: "Serie, Schleife, Reset, Maximum oder Ausgabe fehlt." },
  },
  {
    id: "leaderboard-sort", stage: "Q1", field: "data", competencies: ["A", "I", "D"], difficulty: "medium", file: "Leaderboard.java",
    compileMode: "member", before: "",
    solution: `public static void sortDescending(int[] scores) {\n    for (int i = 0; i < scores.length - 1; i++) {\n        for (int j = 0; j < scores.length - 1 - i; j++) {\n            if (scores[j] < scores[j + 1]) {\n                int swap = scores[j];\n                scores[j] = scores[j + 1];\n                scores[j + 1] = swap;\n            }\n        }\n    }\n}`,
    required: [/void\s+sortDescending\s*\(\s*int\s*\[\s*]\s*scores\s*\)/, /for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*scores\.length\s*-\s*1/, /scores\s*\[\s*j\s*]\s*<\s*scores\s*\[\s*j\s*\+\s*1\s*]/, /int\s+swap\s*=\s*scores\s*\[\s*j\s*]/],
    es: { short: "Juego · Ranking", title: "Ordená un leaderboard", objective: "Transformar una lista mutable en un ranking descendente.", prompt: "Implementá sortDescending(scores) con burbuja: compará vecinos y permutalos cuando el de la izquierda sea menor.", concept: "Ordenamiento y mutación controlada", hint: "El valor temporal swap evita perder un puntaje al intercambiar.", explanation: "No memorices el algoritmo: seguí el invariante, los puntajes más altos avanzan hacia el inicio.", error: "Faltan firma, recorridos, comparación descendente o intercambio." },
    de: { short: "Spiel · Rangliste", title: "Sortiere ein Leaderboard", objective: "Eine veränderliche Liste in eine absteigende Rangliste transformieren.", prompt: "Implementiere sortDescending(scores) mit Bubble Sort: Vergleiche Nachbarn und tausche, wenn links kleiner ist.", concept: "Sortieren und kontrollierte Mutation", hint: "Die temporäre Variable swap verhindert den Verlust eines Punktestands beim Tausch.", explanation: "Lerne nicht nur den Algorithmus auswendig: Höhere Punktzahlen wandern nach vorn.", error: "Signatur, Schleifen, absteigender Vergleich oder Tausch fehlt." },
  },
];

missions.push(...extraMissions.map(curriculumMission));

const legacyMeta = [
  ["types", "data", ["I", "D"], 10],
  ["condition", "algorithms", ["M", "I"], 12],
  ["loop", "algorithms", ["I", "D"], 12],
  ["method", "data", ["M", "I", "K"], 15],
  ["arrays", "data", ["I", "D"], 15],
  ["class", "data", ["M", "I"], 18],
  ["list", "data", ["A", "I"], 15],
  ["debug", "algorithms", ["A", "I", "D"], 20],
];
legacyMeta.forEach(([id, field, competencies, minutes]) => {
  const mission = missions.find((candidate) => candidate.id === id);
  Object.assign(mission, {
    stage: "EF",
    field,
    competencies,
    minutes,
    starter: mission.contextBefore,
    compileMode: "source",
  });
});

const PROJECTS = [
  {
    id: "mensa-terminal",
    stage: "EF",
    checkpointId: "project-mensa-terminal",
    text: {
      es: {
        name: "Terminal de Mensa",
        deliverable: "Un ticket monofichero que calcula total, descuento y pago desde datos reales.",
        evidence: "stdout exacto con TOTAL_CENTS, DISCOUNT_CENTS y DUE_CENTS calculados.",
      },
      de: {
        name: "Mensa-Terminal",
        deliverable: "Eine Ein-Datei-Abrechnung, die Summe, Rabatt und Zahlbetrag aus echten Daten berechnet.",
        evidence: "Exakte stdout-Zeilen mit berechneten TOTAL_CENTS, DISCOUNT_CENTS und DUE_CENTS.",
      },
    },
  },
  {
    id: "school-library",
    stage: "Q1",
    checkpointId: "project-school-library",
    text: {
      es: {
        name: "Biblioteca escolar",
        deliverable: "Un flujo monofichero de catálogo, cola de préstamos y deshacer.",
        evidence: "stdout exacto que demuestra colección, FIFO y LIFO con BOOKS, NEXT y UNDO.",
      },
      de: {
        name: "Schulbibliothek",
        deliverable: "Ein Ein-Datei-Ablauf für Bestand, Ausleihwarteschlange und Rückgängig.",
        evidence: "Exakte stdout-Ausgabe für Sammlung, FIFO und LIFO mit BOOKS, NEXT und UNDO.",
      },
    },
  },
  {
    id: "safe-chat",
    stage: "Q2",
    checkpointId: "project-safe-chat",
    text: {
      es: {
        name: "Chat seguro del campus",
        deliverable: "Un filtro monofichero que parsea mensajes, valida símbolos y minimiza la salida.",
        evidence: "stdout exacto con aceptados, rechazados y solo remitentes permitidos.",
      },
      de: {
        name: "Sicherer Campus-Chat",
        deliverable: "Ein Ein-Datei-Filter, der Nachrichten parst, Zeichen prüft und die Ausgabe minimiert.",
        evidence: "Exakte stdout-Ausgabe mit angenommenen, abgelehnten und nur erlaubten Absendern.",
      },
    },
  },
  {
    id: "habit-tracker",
    stage: "EF",
    checkpointId: "project-habit-tracker",
    extension: true,
    text: {
      es: { name: "Reto · Habit Tracker", deliverable: "Un resumen semanal que cuenta hábitos cumplidos desde una colección recibida.", evidence: "stdout exacto con dos semanas y sus resúmenes calculados." },
      de: { name: "Challenge · Habit Tracker", deliverable: "Eine Wochenübersicht, die erledigte Gewohnheiten aus einer übergebenen Sammlung zählt.", evidence: "Exakte stdout-Ausgabe für zwei Wochen und ihre berechneten Zusammenfassungen." },
    },
  },
  {
    id: "snake-arena",
    stage: "Q2",
    checkpointId: "project-snake-arena",
    extension: true,
    text: {
      es: { name: "Reto avanzado · Snake Arena", deliverable: "Un motor de movimiento en grilla que encuentra la ficha, respeta bordes y detecta obstáculos.", evidence: "stdout exacto de dos tableros que prueban movimiento y bloqueo reales." },
      de: { name: "Fortgeschritten · Snake Arena", deliverable: "Eine Raster-Engine, die die Figur findet, Grenzen respektiert und Hindernisse erkennt.", evidence: "Exakte stdout-Ausgabe zweier Bretter für echte Bewegung und Blockierung." },
    },
  },
];

const capstoneMissions = [
  curriculumMission({
    id: "project-habit-tracker", stage: "EF", field: "data", competencies: ["M", "I", "D", "K"], difficulty: "medium", file: "HabitTracker.java",
    compileMode: "source", before: `public class HabitTracker {`, xp: 55, minutes: 25,
    solution: `public static String summary(String[] days) {
        int completed = 0;
        for (String day : days) {
            if ("DONE".equals(day)) completed++;
        }
        return completed + "/" + days.length;
    }`,
    after: `    private static void printWeek(int number, String[] days) {
        System.out.println("WEEK=" + number);
        System.out.println("SUMMARY=" + summary(days));
    }

    public static void main(String[] args) {
        printWeek(1, new String[] {"DONE", "SKIP", "DONE", "DONE", "SKIP"});
        printWeek(2, new String[] {"DONE", "DONE", "SKIP"});
    }
}`,
    required: [/public\s+static\s+String\s+summary\s*\(\s*String\s*\[\s*]\s+days\s*\)/, /for\s*\(\s*String\s+day\s*:\s*days\s*\)/, /"DONE"\.equals\s*\(\s*day\s*\)/, /completed\s*\+\+/, /completed\s*\+\s*"\/"\s*\+\s*days\.length/],
    es: { short: "Proyecto · Hábitos", title: "Entregá un Habit Tracker", objective: "Convertir una colección semanal en un resumen útil y verificable.", prompt: "Implementá summary(days). Contá solamente DONE y devolvé completados/total. El harness prueba dos semanas distintas.", concept: "Recorrido causal + método reutilizable", hint: "No hay valores mágicos: days.length sale del parámetro y cada día se evalúa.", hint2: "Usá \"DONE\".equals(day) para comparar texto de forma segura.", explanation: "Dos semanas obligan a que el resumen se calcule desde la entrada y no desde una respuesta memorizada.", error: "summary debe recorrer days, contar DONE y devolver completados/total derivados." },
    de: { short: "Projekt · Gewohnheiten", title: "Liefere einen Habit Tracker", objective: "Eine Wochenliste in eine nützliche und prüfbare Zusammenfassung verwandeln.", prompt: "Implementiere summary(days). Zähle nur DONE und gib erledigt/gesamt zurück. Der Harness prüft zwei verschiedene Wochen.", concept: "Kausale Schleife + wiederverwendbare Methode", hint: "Keine magischen Werte: days.length kommt vom Parameter und jeder Tag wird geprüft.", hint2: "Nutze \"DONE\".equals(day) für einen sicheren Textvergleich.", explanation: "Zwei Wochen erzwingen eine Berechnung aus der Eingabe statt einer gemerkten Antwort.", error: "summary muss days durchlaufen, DONE zählen und erledigt/gesamt ableiten." },
  }),
  curriculumMission({
    id: "project-mensa-terminal", stage: "EF", field: "algorithms", competencies: ["M", "I", "D", "K"], difficulty: "hard", file: "MensaTerminal.java",
    compileMode: "source", before: `public class MensaTerminal {`, xp: 60, minutes: 30,
    solution: `public static int[] calculate(int[] itemCents, int discountPercent) {
        int totalCents = 0;
        for (int priceCents : itemCents) {
            totalCents += priceCents;
        }
        int discountCents = totalCents * discountPercent / 100;
        int dueCents = totalCents - discountCents;
        return new int[] {totalCents, discountCents, dueCents};
    }`,
    after: `    private static void printCase(int caseNumber, int[] itemCents, int discountPercent) {
        int[] result = calculate(itemCents, discountPercent);
        System.out.println("CASE=" + caseNumber);
        System.out.println("TOTAL_CENTS=" + result[0]);
        System.out.println("DISCOUNT_CENTS=" + result[1]);
        System.out.println("DUE_CENTS=" + result[2]);
    }

    public static void main(String[] args) {
        printCase(1, new int[] {350, 420, 250}, 10);
        printCase(2, new int[] {125, 375}, 20);
    }
}`,
    required: [
      /public\s+static\s+int\s*\[\s*]\s+calculate\s*\(\s*int\s*\[\s*]\s+itemCents\s*,\s*int\s+discountPercent\s*\)/,
      /for\s*\(\s*int\s+priceCents\s*:\s*itemCents\s*\)/,
      /totalCents\s*\+=\s*priceCents/,
      /discountCents\s*=\s*totalCents\s*\*\s*discountPercent\s*\/\s*100/,
      /dueCents\s*=\s*totalCents\s*-\s*discountCents/,
      /return\s+new\s+int\s*\[\s*]\s*\{\s*totalCents\s*,\s*discountCents\s*,\s*dueCents\s*}/,
    ],
    es: {
      short: "Proyecto · Mensa", title: "Entregá una terminal de Mensa", objective: "Integrar arrays, bucles, acumulación y aritmética entera en un ticket verificable.",
      prompt: "Implementá calculate(itemCents, discountPercent). Devolvé total, descuento y deuda calculados desde los parámetros. El harness visible ejecuta dos tickets distintos.",
      concept: "Función reutilizable + harness determinista", hint: "Recorré itemCents para obtener totalCents; no supongas valores ni longitud.",
      hint2: "Derivá discountCents con discountPercent y devolvé las tres variables en ese orden.",
      explanation: "Dos fixtures fuerzan a que el resultado dependa del array y del porcentaje recibidos, no de un ticket conocido.",
      error: "calculate debe recorrer itemCents, usar discountPercent y devolver total, descuento y deuda derivados.",
    },
    de: {
      short: "Projekt · Mensa", title: "Liefere ein Mensa-Terminal", objective: "Arrays, Schleifen, Akkumulation und Ganzzahlarithmetik in einem prüfbaren Bon verbinden.",
      prompt: "Implementiere calculate(itemCents, discountPercent). Gib Summe, Rabatt und Zahlbetrag aus den Parametern zurück. Der sichtbare Harness führt zwei verschiedene Bons aus.",
      concept: "Wiederverwendbare Funktion + deterministischer Harness", hint: "Durchlaufe itemCents für totalCents; setze keine Werte oder Länge voraus.",
      hint2: "Leite discountCents aus discountPercent ab und gib die drei Variablen in dieser Reihenfolge zurück.",
      explanation: "Zwei Fixtures erzwingen, dass das Ergebnis vom Array und Prozentsatz abhängt statt von einem bekannten Bon.",
      error: "calculate muss itemCents durchlaufen, discountPercent verwenden und drei abgeleitete Werte zurückgeben.",
    },
  }),
  curriculumMission({
    id: "project-school-library", stage: "Q1", field: "data", competencies: ["M", "I", "D", "K"], difficulty: "hard", file: "SchoolLibrary.java",
    compileMode: "source", before: `import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Queue;

public class SchoolLibrary {`, xp: 70, minutes: 40,
    solution: `public static String[] process(
        List<String> books,
        Queue<String> requests,
        Deque<String> undoHistory
    ) {
        String next = requests.poll();
        String borrowed = next.split(":", 2)[1];
        books.remove(borrowed);
        undoHistory.push(borrowed);
        String restored = undoHistory.pop();
        books.add(restored);
        return new String[] {String.valueOf(books.size()), next, restored};
    }`,
    after: `    private static void printCase(
        int caseNumber,
        List<String> books,
        Queue<String> requests
    ) {
        String[] result = process(books, requests, new ArrayDeque<>());
        System.out.println("CASE=" + caseNumber);
        System.out.println("BOOKS=" + result[0]);
        System.out.println("NEXT=" + result[1]);
        System.out.println("UNDO=" + result[2]);
    }

    public static void main(String[] args) {
        printCase(
            1,
            new ArrayList<>(List.of("Ada", "Java", "Networks")),
            new ArrayDeque<>(List.of("Lina:Java", "Noah:Ada"))
        );
        printCase(
            2,
            new ArrayList<>(List.of("Ada", "Java", "Networks", "Databases")),
            new ArrayDeque<>(List.of("Mika:Networks", "Ana:Ada"))
        );
    }
}`,
    required: [
      /public\s+static\s+String\s*\[\s*]\s+process\s*\(\s*List\s*<\s*String\s*>\s+books\s*,\s*Queue\s*<\s*String\s*>\s+requests\s*,\s*Deque\s*<\s*String\s*>\s+undoHistory\s*\)/,
      /String\s+next\s*=\s*requests\.poll\s*\(\s*\)/,
      /String\s+borrowed\s*=\s*next\.split\s*\(\s*":"\s*,\s*2\s*\)\s*\[\s*1\s*]/,
      /books\.remove\s*\(\s*borrowed\s*\)/,
      /undoHistory\.push\s*\(\s*borrowed\s*\)/,
      /String\s+restored\s*=\s*undoHistory\.pop\s*\(\s*\)/,
      /books\.add\s*\(\s*restored\s*\)/,
      /return\s+new\s+String\s*\[\s*]\s*\{\s*String\.valueOf\s*\(\s*books\.size\s*\(\s*\)\s*\)\s*,\s*next\s*,\s*restored\s*}/,
    ],
    es: {
      short: "Proyecto · Biblioteca", title: "Operá una biblioteca escolar", objective: "Integrar colección, cola FIFO, pila LIFO y parsing en un flujo observable.",
      prompt: "Implementá process(books, requests, undoHistory). Atendé la primera solicitud, retirala, registrala y deshacela. El harness usa dos catálogos y colas distintos.",
      concept: "Colecciones causales + harness", hint: "next debe salir de requests.poll(); borrowed debe salir de next.",
      hint2: "Usá la misma variable borrowed en remove/push y restored desde pop en add/return.",
      explanation: "Los dos fixtures comprueban que FIFO, LIFO y catálogo participan realmente del resultado.",
      error: "process debe derivar next/restored de Queue y Deque, mutar books y devolver los valores observados.",
    },
    de: {
      short: "Projekt · Bibliothek", title: "Betreibe eine Schulbibliothek", objective: "Sammlung, FIFO-Queue, LIFO-Stack und Parsing sichtbar verbinden.",
      prompt: "Implementiere process(books, requests, undoHistory). Bearbeite die erste Anfrage, entferne, speichere und mache rückgängig. Der Harness nutzt zwei Bestände und Queues.",
      concept: "Kausale Sammlungen + Harness", hint: "next muss aus requests.poll() kommen; borrowed muss aus next entstehen.",
      hint2: "Nutze borrowed für remove/push und restored aus pop für add/return.",
      explanation: "Zwei Fixtures prüfen, dass FIFO, LIFO und Bestand das Ergebnis wirklich bestimmen.",
      error: "process muss next/restored aus Queue und Deque ableiten, books ändern und beobachtete Werte zurückgeben.",
    },
  }),
  curriculumMission({
    id: "project-safe-chat", stage: "Q2", field: "formal", competencies: ["A", "M", "I", "D", "K"], difficulty: "hard", file: "SafeChat.java",
    compileMode: "source", before: `import java.util.LinkedHashSet;
import java.util.Set;

public class SafeChat {`, xp: 80, minutes: 45,
    solution: `public static String[] filter(String[] messages, Set<String> allowed) {
        Set<String> acceptedSenders = new LinkedHashSet<>();
        int accepted = 0;
        int rejected = 0;
        for (String message : messages) {
            String[] parts = message.split(":", 2);
            boolean validShape = parts.length == 2 && parts[1].matches("[A-Z]+");
            if (validShape && allowed.contains(parts[0])) {
                acceptedSenders.add(parts[0]);
                accepted++;
            } else {
                rejected++;
            }
        }
        return new String[] {
            String.valueOf(accepted),
            String.valueOf(rejected),
            acceptedSenders.toString()
        };
    }`,
    after: `    private static void printCase(
        int caseNumber,
        String[] messages,
        Set<String> allowed
    ) {
        String[] result = filter(messages, allowed);
        System.out.println("CASE=" + caseNumber);
        System.out.println("ACCEPTED=" + result[0]);
        System.out.println("REJECTED=" + result[1]);
        System.out.println("SENDERS=" + result[2]);
    }

    public static void main(String[] args) {
        printCase(
            1,
            new String[] {"ALICE:HELLO", "BOB:JAVA", "EVE:<script>"},
            Set.of("ALICE", "BOB")
        );
        printCase(
            2,
            new String[] {"ALICE:JAVA", "MALLORY:HELLO", "BOB:OK", "BOB:42"},
            Set.of("ALICE", "BOB")
        );
    }
}`,
    required: [
      /public\s+static\s+String\s*\[\s*]\s+filter\s*\(\s*String\s*\[\s*]\s+messages\s*,\s*Set\s*<\s*String\s*>\s+allowed\s*\)/,
      /Set\s*<\s*String\s*>\s+acceptedSenders\s*=\s*new\s+LinkedHashSet\s*<\s*>\s*\(\s*\)/,
      /for\s*\(\s*String\s+message\s*:\s*messages\s*\)/,
      /message\.split\s*\(\s*":"\s*,\s*2\s*\)/,
      /parts\s*\[\s*1\s*]\.matches\s*\(\s*"\[A-Z]\+"\s*\)/,
      /allowed\.contains\s*\(\s*parts\s*\[\s*0\s*]\s*\)/,
      /acceptedSenders\.add\s*\(\s*parts\s*\[\s*0\s*]\s*\)/,
      /accepted\s*\+\+/,
      /rejected\s*\+\+/,
      /return\s+new\s+String\s*\[\s*]\s*\{\s*String\.valueOf\s*\(\s*accepted\s*\)\s*,\s*String\.valueOf\s*\(\s*rejected\s*\)\s*,\s*acceptedSenders\.toString\s*\(\s*\)\s*}/,
    ],
    es: {
      short: "Proyecto · Chat seguro", title: "Filtrá un chat del campus", objective: "Integrar parser, lenguaje regular, Set y minimización de datos.",
      prompt: "Implementá filter(messages, allowed). Parseá y validá cada mensaje recibido; devolvé aceptados, rechazados y remitentes. El harness ejecuta dos lotes distintos.",
      concept: "Parser causal + reconocedor + privacidad", hint: "Iterá messages: split tokeniza y matches(\"[A-Z]+\") valida el contenido.",
      hint2: "allowed decide autorización; LinkedHashSet deduplica remitentes sin publicar mensajes.",
      explanation: "Dos lotes prueban que conteos y remitentes nacen de los parámetros, no de datos precargados.",
      error: "filter debe recorrer messages, consultar allowed y devolver contadores y remitentes derivados.",
    },
    de: {
      short: "Projekt · Sicherer Chat", title: "Filtere einen Campus-Chat", objective: "Parser, reguläre Sprache, Set und Datenminimierung verbinden.",
      prompt: "Implementiere filter(messages, allowed). Parse und prüfe jede übergebene Nachricht; gib angenommene, abgelehnte und Absender zurück. Der Harness führt zwei Stapel aus.",
      concept: "Kausaler Parser + Erkenner + Datenschutz", hint: "Iteriere messages: split tokenisiert, matches(\"[A-Z]+\") prüft den Inhalt.",
      hint2: "allowed entscheidet die Berechtigung; LinkedHashSet dedupliziert Absender ohne Nachrichten zu veröffentlichen.",
      explanation: "Zwei Stapel prüfen, dass Zähler und Absender aus den Parametern statt aus Vorbelegung entstehen.",
      error: "filter muss messages durchlaufen, allowed abfragen und abgeleitete Zähler sowie Absender zurückgeben.",
    },
  }),
  curriculumMission({
    id: "project-snake-arena", stage: "Q2", field: "algorithms", competencies: ["M", "I", "D", "K"], difficulty: "hard", file: "SnakeArena.java",
    compileMode: "source", before: `public class SnakeArena {`, xp: 90, minutes: 50,
    solution: `public static String move(String[] board, char direction) {
        int x = -1;
        int y = -1;
        for (int row = 0; row < board.length; row++) {
            int column = board[row].indexOf('S');
            if (column >= 0) {
                x = column;
                y = row;
            }
        }
        int dx = direction == 'R' ? 1 : direction == 'L' ? -1 : 0;
        int dy = direction == 'D' ? 1 : direction == 'U' ? -1 : 0;
        int nextX = x + dx;
        int nextY = y + dy;
        if (nextY < 0 || nextY >= board.length || nextX < 0 || nextX >= board[nextY].length() || board[nextY].charAt(nextX) == '#') {
            return "BLOCKED";
        }
        return nextX + "," + nextY;
    }`,
    after: `    private static void printCase(int number, String[] board, char direction) {
        System.out.println("CASE=" + number);
        System.out.println("RESULT=" + move(board, direction));
    }

    public static void main(String[] args) {
        printCase(1, new String[] {"....", ".S..", "...."}, 'R');
        printCase(2, new String[] {"....", ".S#.", "...."}, 'R');
    }
}`,
    required: [/public\s+static\s+String\s+move\s*\(\s*String\s*\[\s*]\s+board\s*,\s*char\s+direction\s*\)/, /for\s*\(\s*int\s+row\s*=\s*0\s*;\s*row\s*<\s*board\.length/, /board\s*\[\s*row\s*]\.indexOf\s*\(\s*'S'\s*\)/, /nextX\s*=\s*x\s*\+\s*dx/, /nextY\s*=\s*y\s*\+\s*dy/, /charAt\s*\(\s*nextX\s*\)\s*==\s*'#'/, /return\s+"BLOCKED"/],
    es: { short: "Proyecto · Snake", title: "Construí una Snake Arena", objective: "Integrar búsqueda, coordenadas, transición de estado y límites en un motor de juego real.", prompt: "Implementá move(board, direction): encontrá S, calculá la siguiente celda y devolvé x,y o BLOCKED si hay borde u obstáculo. El harness prueba ambos caminos.", concept: "Estado espacial + validación de límites", hint: "Primero encontrá la posición actual; recién después derivá dx/dy y la siguiente celda.", hint2: "Validá los límites antes de leer board[nextY].charAt(nextX).", explanation: "El proyecto no dibuja una UI ficticia: modela el núcleo verificable de un juego de grilla.", error: "move debe encontrar S, derivar el próximo punto, comprobar límites/obstáculo y devolver un resultado calculado." },
    de: { short: "Projekt · Snake", title: "Baue eine Snake Arena", objective: "Suche, Koordinaten, Zustandsübergang und Grenzen in einer echten Spiel-Engine verbinden.", prompt: "Implementiere move(board, direction): Finde S, berechne die nächste Zelle und gib x,y oder BLOCKED bei Rand/Hindernis zurück. Der Harness prüft beide Wege.", concept: "Räumlicher Zustand + Grenzprüfung", hint: "Finde zuerst die aktuelle Position; leite erst dann dx/dy und die nächste Zelle ab.", hint2: "Prüfe Grenzen vor board[nextY].charAt(nextX).", explanation: "Das Projekt zeichnet keine Schein-UI, sondern modelliert den prüfbaren Kern eines Rasterspiels.", error: "move muss S finden, den nächsten Punkt ableiten, Grenze/Hindernis prüfen und ein berechnetes Resultat zurückgeben." },
  }),
];

capstoneMissions.forEach((capstone) => {
  const lastStageIndex = missions.reduce(
    (last, mission, index) => mission.stage === capstone.stage ? index : last,
    -1,
  );
  missions.splice(lastStageIndex + 1, 0, capstone);
});

PROJECTS.filter((project) => !project.extension).forEach((project) => {
  const routeMissions = missions.filter((mission) => mission.stage === project.stage);
  routeMissions.forEach((mission, index) => {
    mission.projectId = project.id;
    mission.projectOrder = index + 1;
    mission.checkpoint = mission.id === project.checkpointId;
    mission.deliverable = {
      es: project.text.es.deliverable,
      de: project.text.de.deliverable,
    };
    mission.evidence = mission.checkpoint
      ? { es: project.text.es.evidence, de: project.text.de.evidence }
      : { es: mission.text.es.objective, de: mission.text.de.objective };
  });
});

capstoneMissions.filter((mission) => mission.id === "project-habit-tracker" || mission.id === "project-snake-arena").forEach((mission) => {
  const project = PROJECTS.find((item) => item.checkpointId === mission.id);
  mission.projectId = project.id;
  mission.projectOrder = 1;
  mission.checkpoint = true;
  mission.deliverable = { es: project.text.es.deliverable, de: project.text.de.deliverable };
  mission.evidence = { es: project.text.es.evidence, de: project.text.de.evidence };
});

const elements = {
  dashboard: document.querySelector("#dashboard"),
  dashboardBackButton: document.querySelector("#dashboardBackButton"),
  xp: document.querySelector("#xp"),
  missionList: document.querySelector("#missionList"),
  projectSelect: document.querySelector("#projectSelect"),
  projectProgress: document.querySelector("#projectProgress"),
  projectDeliverable: document.querySelector("#projectDeliverable"),
  projectSteps: document.querySelector("#projectSteps"),
  projectContinueButton: document.querySelector("#projectContinueButton"),
  commandNarrative: document.querySelector("#commandNarrative"),
  commandNextMission: document.querySelector("#commandNextMission"),
  commandNextMeta: document.querySelector("#commandNextMeta"),
  commandContinueButton: document.querySelector("#commandContinueButton"),
  exploreProjectsButton: document.querySelector("#exploreProjectsButton"),
  commandProgress: document.querySelector("#commandProgress"),
  commandProgressMeta: document.querySelector("#commandProgressMeta"),
  commandProjectName: document.querySelector("#commandProjectName"),
  commandProjectMeta: document.querySelector("#commandProjectMeta"),
  projectGallery: document.querySelector("#projectGallery"),
  projectContextName: document.querySelector("#projectContextName"),
  projectStep: document.querySelector("#projectStep"),
  projectContextDeliverable: document.querySelector("#projectContextDeliverable"),
  projectEvidence: document.querySelector("#projectEvidence"),
  compileRailStatus: document.querySelector("#compileRailStatus"),
  compileRailSteps: document.querySelector("#compileRailSteps"),
  workbenchMission: document.querySelector("#workbenchMission"),
  workbenchFile: document.querySelector("#workbenchFile"),
  missionNumber: document.querySelector("#missionNumber"),
  difficulty: document.querySelector("#difficulty"),
  missionXp: document.querySelector("#missionXp"),
  missionTitle: document.querySelector("#missionTitle"),
  objective: document.querySelector("#objective"),
  prompt: document.querySelector("#prompt"),
  concept: document.querySelector("#concept"),
  lessonVideoCard: document.querySelector("#lessonVideoCard"),
  lessonVideo: document.querySelector("#lessonVideo"),
  lessonVideoPreview: document.querySelector("#lessonVideoPreview"),
  lessonVideoThumbnail: document.querySelector("#lessonVideoThumbnail"),
  lessonVideoIntro: document.querySelector("#lessonVideoIntro"),
  lessonVideoExternal: document.querySelector("#lessonVideoExternal"),
  lessonVideoBadge: document.querySelector("#lessonVideoBadge"),
  docsLinks: document.querySelector("#docsLinks"),
  resourceTabs: document.querySelector(".resource-tabs"),
  resourceTutorialTab: document.querySelector("#resourceTutorialTab"),
  resourcePanels: [...document.querySelectorAll("[data-resource-panel]")],
  toolTabs: document.querySelector(".tool-tabs"),
  toolPanels: [...document.querySelectorAll("[data-tool-panel]")],
  onboardingDialog: document.querySelector("#onboardingDialog"),
  onboardingClose: document.querySelector("#onboardingClose"),
  fileName: document.querySelector("#fileName"),
  codeBefore: document.querySelector("#codeBefore"),
  codeAfter: document.querySelector("#codeAfter"),
  editor: document.querySelector("#editor"),
  editorDiagnosticsOverlay: document.querySelector("#editorDiagnosticsOverlay"),
  editorErrorTooltip: document.querySelector("#editorErrorTooltip"),
  lineNumbers: document.querySelector("#lineNumbers"),
  completionPopup: document.querySelector("#completionPopup"),
  completionList: document.querySelector("#completionList"),
  diagnosticsList: document.querySelector("#diagnosticsList"),
  bugChecklist: document.querySelector("#bugChecklist"),
  formatButton: document.querySelector("#formatButton"),
  masteryValue: document.querySelector("#masteryValue"),
  masteryExplanation: document.querySelector("#masteryExplanation"),
  mentorAdvice: document.querySelector("#mentorAdvice"),
  mentorAction: document.querySelector("#mentorAction"),
  progressStats: document.querySelector("#progressStats"),
  progressInsights: document.querySelector("#progressInsights"),
  progressValue: document.querySelector("#progressValue"),
  orbitValue: document.querySelector("#orbitValue"),
  checkButton: document.querySelector("#checkButton"),
  hintButton: document.querySelector("#hintButton"),
  hintCost: document.querySelector("#hintCost"),
  solutionButton: document.querySelector("#solutionButton"),
  nextButton: document.querySelector("#nextButton"),
  feedbackPanel: document.querySelector("#feedbackPanel"),
  feedbackIcon: document.querySelector("#feedbackIcon"),
  feedbackTitle: document.querySelector("#feedbackTitle"),
  feedbackMessage: document.querySelector("#feedbackMessage"),
  explanation: document.querySelector("#explanation"),
  hintPanel: document.querySelector("#hintPanel"),
  hintLevel: document.querySelector("#hintLevel"),
  hintText: document.querySelector("#hintText"),
  resetButton: document.querySelector("#resetButton"),
  themeToggle: document.querySelector("#themeToggle"),
  debugToggle: document.querySelector("#debugToggle"),
  workspace: document.querySelector("#workspace"),
  missionRail: document.querySelector("#missionRail"),
  freePracticeToggle: document.querySelector("#freePracticeToggle"),
  editorPanel: document.querySelector("#editorPanel"),
  sidebarToggle: document.querySelector("#sidebarToggle"),
  focusToggle: document.querySelector("#focusToggle"),
  liveTemplateList: document.querySelector("#liveTemplateList"),
  consoleStatus: document.querySelector("#consoleStatus"),
  consoleOutput: document.querySelector("#consoleOutput"),
  teacherToggle: document.querySelector("#teacherToggle"),
  teacherPanel: document.querySelector("#teacherPanel"),
  teacherTitle: document.querySelector("#teacherTitle"),
  teacherStats: document.querySelector("#teacherStats"),
  teacherPracticeList: document.querySelector("#teacherPracticeList"),
  teacherStageFilter: document.querySelector("#teacherStageFilter"),
  teacherExport: document.querySelector("#teacherExport"),
  teacherExportJson: document.querySelector("#teacherExportJson"),
  teacherCloudProgress: document.querySelector("#teacherCloudProgress"),
  authToggle: document.querySelector("#authToggle"),
  authToggleLabel: document.querySelector("#authToggleLabel"),
  authPanel: document.querySelector("#authPanel"),
  authStatus: document.querySelector("#authStatus"),
  authForm: document.querySelector("#authForm"),
  authName: document.querySelector("#authName"),
  authEmail: document.querySelector("#authEmail"),
  authPassword: document.querySelector("#authPassword"),
  loginButton: document.querySelector("#loginButton"),
  registerButton: document.querySelector("#registerButton"),
  logoutButton: document.querySelector("#logoutButton"),
  classSelect: document.querySelector("#classSelect"),
  createClassForm: document.querySelector("#createClassForm"),
  className: document.querySelector("#className"),
  joinClassForm: document.querySelector("#joinClassForm"),
  joinCode: document.querySelector("#joinCode"),
};

let activeAppView = "dashboard";

const OFFICIAL_DOCS = [
  {
    id: "basics",
    terms: ["variable", "tipo", "string", "int", "declaración", "grundlagen", "variable"],
    es: { title: "Java Language Basics", description: "Tipos, variables, operadores y sintaxis esencial." },
    de: { title: "Java Language Basics", description: "Typen, Variablen, Operatoren und grundlegende Syntax." },
    url: "https://dev.java/learn/language-basics/",
  },
  {
    id: "control-flow",
    terms: ["condicional", "bucle", "for", "while", "control", "schleife", "bedingung"],
    es: { title: "Control de flujo", description: "Sintaxis y ejemplos de if, for, while y switch." },
    de: { title: "Kontrollfluss", description: "Syntax und Beispiele für if, for, while und switch." },
    url: "https://dev.java/learn/language-basics/controlling-flow/",
  },
  {
    id: "for",
    terms: ["bucle for", "for-schleife", "iteración", "recorrido"],
    es: { title: "Sentencia for", description: "La sintaxis del bucle for con ejemplos oficiales." },
    de: { title: "for-Schleife", description: "Syntax der for-Schleife mit offiziellen Beispielen." },
    url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html",
  },
  {
    id: "classes",
    terms: ["clase", "constructor", "objeto", "poo", "herencia", "polimorfismo", "klasse", "objekt"],
    es: { title: "Clases y objetos", description: "Cómo modelar clases, objetos, herencia e interfaces." },
    de: { title: "Klassen und Objekte", description: "Klassen, Objekte, Vererbung und Interfaces modellieren." },
    url: "https://dev.java/learn/classes-objects/",
  },
  {
    id: "collections",
    terms: ["lista", "array", "stack", "queue", "map", "colección", "sammlung", "liste"],
    es: { title: "Collections Framework", description: "Guía de arrays y colecciones de la biblioteca Java." },
    de: { title: "Collections Framework", description: "Arrays und Collections der Java-Bibliothek." },
    url: "https://dev.java/learn/api/collections-framework/",
  },
  {
    id: "exceptions",
    terms: ["error", "debug", "excepción", "try", "catch", "exception", "fehler"],
    es: { title: "Excepciones", description: "Entender y manejar errores con try, catch y finally." },
    de: { title: "Exceptions", description: "Fehler mit try, catch und finally verstehen und behandeln." },
    url: "https://dev.java/learn/exceptions/",
  },
  {
    id: "api",
    terms: ["api", "método", "string", "integer", "hashmap", "arraylist"],
    es: { title: "Java SE API", description: "Referencia oficial de clases, métodos y tipos." },
    de: { title: "Java SE API", description: "Offizielle Referenz für Klassen, Methoden und Typen." },
    url: "https://docs.oracle.com/en/java/javase/21/docs/api/index.html",
  },
];

function renderDocumentation(mission = missions[state.current]) {
  if (!elements.docsLinks || !mission) return;
  const text = getMissionText(mission);
  const haystack = [text.title, text.objective, text.prompt, text.concept, mission.field].join(" ").toLowerCase();
  const selected = OFFICIAL_DOCS.filter((resource) => resource.terms.some((term) => haystack.includes(term)))
    .slice(0, 3);
  const resources = selected.length ? selected : OFFICIAL_DOCS.slice(0, 2);
  elements.docsLinks.replaceChildren(...resources.map((resource) => {
    const copy = resource[state.language];
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = resource.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `${copy.title}: ${t("docsOpen")}`);
    const title = document.createElement("strong");
    title.textContent = copy.title;
    const description = document.createElement("span");
    description.textContent = copy.description;
    const source = document.createElement("small");
    source.textContent = `${t("docsSource")} · dev.java / Oracle`;
    link.append(title, description, source);
    item.append(link);
    return item;
  }));
  elements.docsLinks.setAttribute("aria-label", t("docsAria"));
}

const JAVA_VIDEO_PLAYLIST = "PLO-P6W97sI0Q-o0oZy8NeUgi0s5WKK8IV";

function javaLessonVideo(key, id, topic, terms, missionIds = []) {
  return {
    key,
    id,
    topic,
    terms,
    missionIds,
    playlist: JAVA_VIDEO_PLAYLIST,
    url: `https://www.youtube.com/watch?v=${id}&list=${JAVA_VIDEO_PLAYLIST}`,
    title: {
      es: `Java · ${topic.es}`,
      de: `Java · ${topic.de}`,
    },
  };
}

function germanLessonVideo(key, id, topic, missionIds, source) {
  return {
    key,
    id,
    topic,
    terms: [],
    missionIds,
    url: `https://www.youtube.com/watch?v=${id}`,
    title: {
      es: `${topic.es} · ${source}`,
      de: `${topic.de} · ${source}`,
    },
  };
}

const LESSON_VIDEO_CATALOG = [
  javaLessonVideo("variables", "C8hLep5UfYg", { es: "variables", de: "Variablen" },
    ["variable", "declaracion", "inicializacion"], ["types"]),
  javaLessonVideo("types", "iOfM6T5zpEo", { es: "tipos de datos", de: "Datentypen" },
    ["tipo", "tipado", "datentyp", "integer", "boolean", "double"]),
  javaLessonVideo("if-else", "bduK1FAtHBk", { es: "if/else", de: "if/else" },
    ["if/else", "if else", "condicional", "beding", "rama", "ternario"],
    ["condition", "guessing-game", "score-level", "dice-duel"]),
  javaLessonVideo("logical", "GjB6YrsZEGk", { es: "operadores lógicos", de: "logische Operatoren" },
    ["operador logico", "boolean", "&&", "||", "logisch"]),
  javaLessonVideo("scanner", "dz-_Ok5WdVA", { es: "entrada con Scanner", de: "Eingabe mit Scanner" },
    ["scanner", "entrada", "input", "eingabe"]),
  javaLessonVideo("while", "mcm84hlxXo8", { es: "bucle while", de: "while-Schleife" },
    ["while", "terminacion", "schleife"], ["while-input"]),
  javaLessonVideo("for", "CoEKIbc8B0k", { es: "bucle for", de: "for-Schleife" },
    ["bucle for", "for-schleife", "indice", "recorrer", "durchlauf"], ["loop"]),
  javaLessonVideo("arrays", "-7gk5dgM_5w", { es: "arrays", de: "Arrays" },
    ["array", "arreglo"], ["arrays"]),
  javaLessonVideo("methods", "bvGepmcDqD0", { es: "métodos", de: "Methoden" },
    ["metodo", "method", "firma", "parametro", "funktion"], ["method"]),
  javaLessonVideo("oop", "Hc3ddOTYzME", { es: "programación orientada a objetos", de: "Objektorientierung" },
    ["poo", "oop", "orientada a objetos", "objektorient"]),
  javaLessonVideo("classes-objects", "7o-0IDEHs5M", { es: "clases y objetos", de: "Klassen und Objekte" },
    ["clase", "objeto", "klasse", "objekt", "modelo"], ["class"]),
  javaLessonVideo("constructors", "cD_u6A5S9Xk", { es: "constructores", de: "Konstruktoren" },
    ["constructor", "konstruktor"], ["class"]),
  javaLessonVideo("return", "LlWPVBDV5Yc", { es: "return", de: "return" },
    ["return", "devolver", "ruckgabe"]),
  javaLessonVideo("access", "T05n0oumTl0", { es: "modificadores de acceso", de: "Zugriffsmodifikatoren" },
    ["private", "public", "acceso", "visibilidad", "sichtbarkeit"]),
  javaLessonVideo("getter-setter", "O6_pwT1EF3k", { es: "getters y setters", de: "Getter und Setter" },
    ["getter", "setter", "encapsul"]),
  javaLessonVideo("foreach", "n0Hb8GNZx50", { es: "for-each", de: "for-each-Schleife" },
    ["for-each", "foreach", "acumulador"]),
  javaLessonVideo("break-continue", "XPi-xN_I1-I", { es: "break y continue", de: "break und continue" },
    ["break", "continue", "cortar", "beenden"]),
  javaLessonVideo("switch", "q_nZSnmJ5Jw", { es: "switch", de: "switch" },
    ["switch", "direccion", "richtung"], ["snake-step"]),
  javaLessonVideo("uml", "Rb9oNcj8mcw", { es: "UML", de: "UML" },
    ["uml"], ["uml-model"]),
  javaLessonVideo("2d-arrays", "S3mzLcQaDjE", { es: "arrays bidimensionales", de: "zweidimensionale Arrays" },
    ["2d", "bidimensional", "matriz", "grilla", "raster"], ["project-snake-arena"]),
  javaLessonVideo("strings", "FbgZuPNVQsU", { es: "Strings", de: "Strings" },
    ["string", "texto", "cadena", "zeichen", "token"], ["strings"]),
  javaLessonVideo("inheritance", "xXDDVSjogs0", { es: "herencia", de: "Vererbung" },
    ["herencia", "extends", "vererbung"], ["inheritance"]),
  javaLessonVideo("overriding", "ud1i5uqOmg8", { es: "sobrescritura de métodos", de: "Methodenüberschreibung" },
    ["override", "sobrescrit", "uberschreib", "polimorf"], ["polymorphism"]),
  javaLessonVideo("interfaces", "GcqQDuFUqg8", { es: "interfaces", de: "Interfaces" },
    ["interface", "contrato", "schnittstelle"]),
  javaLessonVideo("lists", "crm0yaneCb0", { es: "listas", de: "Listen" },
    ["list", "arraylist", "lista", "coleccion", "sammlung"], ["list"]),
  javaLessonVideo("stacks-queues", "a4EpC1Kmb7I", { es: "pilas y colas", de: "Stacks und Queues" },
    ["stack", "queue", "pila", "cola", "lifo", "fifo", "deque"], ["stack", "queue"]),
  javaLessonVideo("sets", "gj1zWiXG6hY", { es: "conjuntos", de: "Sets" },
    ["set", "conjunto", "visited"]),
  javaLessonVideo("hashmap", "sNrT2hbilsk", { es: "HashMap", de: "HashMap" },
    ["hashmap", "hash map", "map", "hashing", "frecuencia"], ["hash-map"]),
  javaLessonVideo("exceptions", "O1yJ9wvlviA", { es: "excepciones", de: "Exceptions" },
    ["excepcion", "exception", "try", "catch", "fehler"], ["exception-parse"]),
  javaLessonVideo("recursion", "KwB0gjnYvoY", { es: "recursión", de: "Rekursion" },
    ["recursion", "rekursion", "caso base"], ["recursion", "bst"]),
  javaLessonVideo("multithreading", "XHcCh2rmMAY", { es: "multithreading", de: "Multithreading" },
    ["concurr", "thread", "race", "atomic"], ["concurrency-limits"]),
  javaLessonVideo("unit-tests", "uTDpMENNbf8", { es: "pruebas unitarias", de: "Unit-Tests" },
    ["test", "prueba", "caso limite", "grenzfall"], ["tests-thinking"]),
  javaLessonVideo("linked-list", "jZYVp84RgRE", { es: "ArrayList vs. LinkedList", de: "ArrayList vs. LinkedList" },
    ["linkedlist", "linked-list", "lista enlazada"], ["linked-list"]),
  germanLessonVideo("debugger", "ipUAR3r7PQM", { es: "depuración con Eclipse", de: "Debugging mit Eclipse" }, ["debug"], "Boris Gedat"),
  germanLessonVideo("graph-bfs", "hR4s2W7Dsss", { es: "búsqueda en anchura", de: "Graphen-Breitensuche" }, ["graph-bfs"], "Tutorial City"),
  germanLessonVideo("dfa", "ztK5O0hT17s", { es: "autómatas finitos deterministas", de: "Deterministische endliche Automaten" }, ["dfa"], "Informatik – simpleclub"),
  germanLessonVideo("sql", "phdWpI5VUWk", { es: "consultas SQL", de: "SQL-Abfragen" }, ["sql"], "Informatik – simpleclub"),
  germanLessonVideo("normalization", "aCXKT4ycAbQ", { es: "normalización de bases de datos", de: "Datenbanknormalisierung" }, ["normalization"], "Patrick Boekhoven"),
  germanLessonVideo("caesar", "nxtunxsnJvY", { es: "cifrado César", de: "Caesar-Verschlüsselung" }, ["caesar"], "Daheim bei Heim"),
];

function getLessonVideo(mission) {
  if (!mission) return null;
  // Solo se muestran videos verificados por su misión exacta. No hay fallback
  // curricular: un video de Java cercano no explica automáticamente grafos,
  // gramáticas o privacidad.
  const video = LESSON_VIDEO_CATALOG.find((entry) => entry.missionIds.includes(mission.id));
  if (!video) return null;
  const concept = getMissionText(mission).concept;
  return {
    ...video,
    description: {
      es: `Corresponde a esta misión porque «${concept}» necesita ${video.topic.es} en Java.`,
      de: `Dieses Video passt zur Mission, weil „${concept}“ ${video.topic.de} in Java benötigt.`,
    },
  };
}

function renderLessonVideo(mission = missions[state.current]) {
  const video = getLessonVideo(mission);
  if (!elements.lessonVideo || !elements.lessonVideoCard) return;
  if (!video) {
    elements.lessonVideo.src = "about:blank";
    delete elements.lessonVideo.dataset.embedUrl;
    elements.lessonVideoCard.hidden = true;
    elements.resourceTutorialTab.hidden = true;
    elements.resourceTutorialTab.disabled = true;
    if (elements.resourceTutorialTab.getAttribute("aria-expanded") === "true") {
      activateResourceTab();
    }
    return;
  }
  elements.resourceTutorialTab.hidden = false;
  elements.resourceTutorialTab.disabled = false;
  elements.lessonVideoCard.hidden = false;
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (video.start) params.set("start", String(video.start));
  if (video.playlist) params.set("list", video.playlist);
  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.id}?${params.toString()}`;
  elements.lessonVideo.src = "about:blank";
  elements.lessonVideo.dataset.embedUrl = embedUrl;
  elements.lessonVideo.hidden = true;
  elements.lessonVideoPreview.hidden = false;
  elements.lessonVideoThumbnail.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
  elements.lessonVideoThumbnail.alt = `${video.title[state.language]} · ${getMissionText(mission).title}`;
  elements.lessonVideoPreview.setAttribute("aria-label", `${t("lessonVideoPlay")}: ${video.title[state.language]}`);
  elements.lessonVideo.title = `${video.title[state.language]} · ${getMissionText(mission).title}`;
  elements.lessonVideoIntro.textContent = video.description[state.language];
  elements.lessonVideoExternal.href = video.url;
  elements.lessonVideoBadge.textContent = video.title[state.language];
}

function playLessonVideo() {
  if (!elements.lessonVideo || !elements.lessonVideoPreview) return;
  const embedUrl = elements.lessonVideo.dataset.embedUrl;
  if (!embedUrl) return;
  // El clic es el gesto del usuario que autoriza autoplay: mostramos y
  // arrancamos el reproductor en una sola interacción.
  elements.lessonVideo.src = embedUrl;
  elements.lessonVideo.hidden = false;
  elements.lessonVideoPreview.hidden = true;
}

function getStoredEditorPrefs() {
  try {
    const stored = JSON.parse(localStorage.getItem(EDITOR_PREFS_STORAGE_KEY));
    if (!stored || typeof stored !== "object") return {};
    return {
      sidebarCollapsed: Boolean(stored.sidebarCollapsed),
      focusMode: Boolean(stored.focusMode),
    };
  } catch {
    return {};
  }
}

function saveEditorPrefs() {
  try {
    localStorage.setItem(
      EDITOR_PREFS_STORAGE_KEY,
      JSON.stringify({
        sidebarCollapsed: Boolean(state.editorPrefs?.sidebarCollapsed),
        focusMode: Boolean(state.editorPrefs?.focusMode),
      }),
    );
  } catch {
    document.querySelector(".status-dot")?.classList.add("storage-error");
  }
}

function getFullscreenElement() {
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}

function requestFullscreen(element) {
  const request = element.requestFullscreen || element.webkitRequestFullscreen;
  if (!request) return Promise.resolve(false);
  return request.call(element).then(() => true).catch(() => false);
}

function exitFullscreen() {
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  if (!exit || !getFullscreenElement()) return Promise.resolve(false);
  return exit.call(document).then(() => true).catch(() => false);
}

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // La preferencia del sistema cubre navegadores con storage bloqueado.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  elements.themeToggle?.setAttribute("aria-pressed", String(isDark));
  elements.themeToggle?.setAttribute(
    "aria-label",
    isDark ? t("themeToggleLightAria") : t("themeToggleAria"),
  );
  const icon = elements.themeToggle?.querySelector(".theme-toggle-icon");
  if (icon) icon.textContent = isDark ? "☀" : "☾";
  const label = elements.themeToggle?.querySelector("[data-i18n]");
  if (label) label.textContent = isDark ? t("themeToggleLight") : t("themeToggle");
}

function setTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  state.theme = nextTheme;
  applyTheme(nextTheme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch {
    document.querySelector(".status-dot")?.classList.add("storage-error");
  }
}

function createDefaultState(language = "es") {
  return {
    stateVersion: 3,
    language,
    theme: getInitialTheme(),
    current: 0,
    currentMissionId: missions[0].id,
    unlockedThroughMissionId: missions[0].id,
    selectedProject: PROJECTS[0].id,
    freePractice: false,
    xp: 0,
    solved: [],
    answers: {},
    answerUpdatedAt: {},
    hintsUsed: {},
    solutionShown: {},
    attempts: {},
    correctAttempts: {},
    bugChecklist: [createBugChecklistItem()],
    editorPrefs: {
      sidebarCollapsed: false,
      focusMode: false,
      ...getStoredEditorPrefs(),
    },
  };
}

function createBugChecklistItem() {
  return {
    id: `bug-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: "",
    checked: false,
  };
}

function sanitizeBugChecklist(value) {
  if (!Array.isArray(value)) return [createBugChecklistItem()];
  const items = value.slice(0, 50).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const text = typeof item.text === "string" ? item.text.slice(0, 240) : "";
    const id = typeof item.id === "string" && /^bug-[a-z0-9-]+$/i.test(item.id)
      ? item.id
      : createBugChecklistItem().id;
    return [{ id, text, checked: item.checked === true }];
  });
  return items.length ? items : [createBugChecklistItem()];
}

function sanitizeMissionMap(value, sanitize) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(missions.flatMap((mission) => {
    if (!Object.prototype.hasOwnProperty.call(value, mission.id)) return [];
    const sanitized = sanitize(value[mission.id], mission);
    return sanitized === undefined ? [] : [[mission.id, sanitized]];
  }));
}

function normalizeState(stored, options = {}) {
  const defaults = createDefaultState();
  const validIds = new Set(missions.map((mission) => mission.id));
  const legacySolved = stored?.solved ?? stored?.completedMissions ?? stored?.completed;
  const solved = [...new Set(Array.isArray(legacySolved) ? legacySolved : [])]
    .filter((id) => typeof id === "string" && validIds.has(id));
  const solvedSet = new Set(solved);
  let highestUnlocked = 0;
  while (highestUnlocked < missions.length - 1 && solvedSet.has(missions[highestUnlocked].id)) {
    highestUnlocked += 1;
  }
  const highestSolvedIndex = missions.reduce(
    (highest, mission, index) => solvedSet.has(mission.id) ? Math.max(highest, index) : highest,
    -1,
  );
  highestUnlocked = Math.min(
    missions.length - 1,
    Math.max(highestUnlocked, highestSolvedIndex + 1),
  );
  const storedIndex = Number.isFinite(Number(stored?.current ?? stored?.currentMission))
    ? Math.max(0, Math.trunc(Number(stored.current ?? stored.currentMission)))
    : 0;
  const requestedMissionId = validIds.has(stored?.currentMissionId)
    ? stored.currentMissionId
    : options.historicalIndex
      ? (HISTORICAL_MISSION_IDS_V2[Math.min(storedIndex, HISTORICAL_MISSION_IDS_V2.length - 1)] || missions[0].id)
      : (missions[Math.min(storedIndex, missions.length - 1)]?.id || missions[0].id);
  const requestedCurrent = Math.max(0, missions.findIndex((mission) => mission.id === requestedMissionId));
  const attempts = sanitizeMissionMap(stored?.attempts, (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, Math.trunc(number)) : 0;
  });
  const correctAttempts = sanitizeMissionMap(stored?.correctAttempts, (value, mission) => {
    const number = Number(value);
    const safe = Number.isFinite(number) ? Math.max(0, Math.trunc(number)) : 0;
    return Math.min(safe, attempts[mission.id] || 0);
  });
  const xpValue = Number(stored?.xp ?? stored?.score);
  const storedUnlockedIndex = validIds.has(stored?.unlockedThroughMissionId)
    ? missions.findIndex((mission) => mission.id === stored.unlockedThroughMissionId)
    : -1;
  const preservedUnlockedIndex = options.historicalIndex
    ? Math.max(highestUnlocked, requestedCurrent)
    : Math.max(highestUnlocked, storedUnlockedIndex);
  const current = Math.min(
    requestedCurrent,
    stored?.freePractice === true ? missions.length - 1 : preservedUnlockedIndex,
  );

  return {
    ...defaults,
    stateVersion: 3,
    language: stored?.language === "de" ? "de" : "es",
    theme: stored?.theme === "light" || stored?.theme === "dark" ? stored.theme : getInitialTheme(),
    current,
    currentMissionId: missions[current].id,
    unlockedThroughMissionId: missions[preservedUnlockedIndex]?.id || missions[0].id,
    selectedProject: PROJECTS.some((project) => project.id === stored?.selectedProject)
      ? stored.selectedProject
      : (missions[current]?.projectId || PROJECTS[0].id),
    freePractice: stored?.freePractice === true,
    xp: Number.isFinite(xpValue) ? Math.max(0, Math.trunc(xpValue)) : 0,
    solved,
    answers: sanitizeMissionMap(stored?.answers ?? stored?.codeByMission, (value) => typeof value === "string" ? value : undefined),
    answerUpdatedAt: sanitizeMissionMap(stored?.answerUpdatedAt, (value) => {
      const time = Date.parse(String(value));
      return Number.isFinite(time) ? new Date(time).toISOString() : undefined;
    }),
    hintsUsed: sanitizeMissionMap(stored?.hintsUsed ?? stored?.hints, (value, mission) => {
      const number = Number(value);
      const safe = Number.isFinite(number) ? Math.max(0, Math.trunc(number)) : 0;
      return Math.min(safe, mission.text.es.hints.length);
    }),
    solutionShown: sanitizeMissionMap(stored?.solutionShown ?? stored?.solutionsShown, (value) => value === true),
    attempts,
    correctAttempts,
    bugChecklist: sanitizeBugChecklist(stored?.bugChecklist),
    editorPrefs: {
      sidebarCollapsed: stored?.editorPrefs?.sidebarCollapsed === true,
      focusMode: stored?.editorPrefs?.focusMode === true,
      ...getStoredEditorPrefs(),
    },
  };
}

function loadState() {
  try {
    const currentValue = localStorage.getItem(STORAGE_KEY);
    if (currentValue) {
      const parsed = JSON.parse(currentValue);
      return parsed && typeof parsed === "object" ? normalizeState(parsed) : createDefaultState();
    }

    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      const legacyValue = localStorage.getItem(legacyKey);
      if (!legacyValue) continue;
      try {
        const parsed = JSON.parse(legacyValue);
        if (!parsed || typeof parsed !== "object") continue;
        const migrated = normalizeState(parsed, { historicalIndex: true });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        localStorage.removeItem(legacyKey);
        return migrated;
      } catch {
        // Una clave legacy corrupta no debe bloquear otras migraciones posibles.
      }
    }
  } catch {
    return createDefaultState();
  }
  return createDefaultState();
}

let state = loadState();
let cloudSession = {
  configured: false,
  user: null,
  csrf: "",
  syncTimer: null,
  registerMode: false,
  classes: [],
  classProgress: null,
  classProgressError: "",
};

async function cloudRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: { Accept: "application/json", ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.headers || {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.ok === false) throw new Error(body.error || `HTTP ${response.status}`);
  return body;
}

function queueCloudSync() {
  if (!cloudSession.user || !cloudSession.csrf) return;
  clearTimeout(cloudSession.syncTimer);
  cloudSession.syncTimer = setTimeout(syncCloudProgress, 450);
}

async function syncCloudProgress() {
  if (!cloudSession.user || !cloudSession.csrf) return;
  const missionsPayload = missions.map((mission) => ({
    missionId: mission.id,
    answer: state.answers[mission.id] || "",
    attempts: state.attempts[mission.id] || 0,
    correctAttempts: state.correctAttempts[mission.id] || 0,
    hintsUsed: state.hintsUsed[mission.id] || 0,
    solutionShown: Boolean(state.solutionShown[mission.id]),
    solved: state.solved.includes(mission.id),
  }));
  try {
    await cloudRequest("api/progress.php", { method: "POST", headers: { "X-CSRF-Token": cloudSession.csrf }, body: JSON.stringify({ missions: missionsPayload }) });
  } catch {
    elements.authStatus.textContent = t("accountOffline");
  }
}

async function recordAttemptEvent(mission, payload = {}) {
  if (!cloudSession.user || !cloudSession.csrf) return;
  try {
    await cloudRequest(ATTEMPT_API_URL, {
      method: "POST",
      headers: { "X-CSRF-Token": cloudSession.csrf },
      body: JSON.stringify({
        missionId: mission.id,
        phase: payload.phase || "local",
        passed: Boolean(payload.passed),
        feedback: payload.feedback || "",
        diagnosticsCount: Number(payload.diagnosticsCount || 0),
        durationMs: Number(payload.durationMs || 0),
        answerExcerpt: String(payload.answer || "").slice(0, 800),
      }),
    });
  } catch {
    // El historial es útil para docentes, pero nunca debe bloquear la práctica.
  }
}

function mergeCloudProgress(progress) {
  if (!Array.isArray(progress)) return;
  progress.forEach((row) => {
    const id = String(row.mission_id || "");
    if (!missions.some((mission) => mission.id === id)) return;
    const remoteUpdated = Date.parse(String(row.updated_at || ""));
    const localUpdated = Date.parse(String(state.answerUpdatedAt?.[id] || ""));
    if (typeof row.answer === "string" && (!state.answers[id] || !Number.isFinite(localUpdated) || (Number.isFinite(remoteUpdated) && remoteUpdated >= localUpdated))) {
      state.answers[id] = row.answer;
      state.answerUpdatedAt[id] = Number.isFinite(remoteUpdated) ? new Date(remoteUpdated).toISOString() : new Date().toISOString();
    }
    state.attempts[id] = Math.max(Number(state.attempts[id] || 0), Number(row.attempts || 0));
    state.correctAttempts[id] = Math.max(Number(state.correctAttempts[id] || 0), Number(row.correct_attempts || 0));
    state.hintsUsed[id] = Math.max(Number(state.hintsUsed[id] || 0), Number(row.hints_used || 0));
    state.solutionShown[id] = Boolean(state.solutionShown[id] || Number(row.solution_shown));
    if (row.solved_at && !state.solved.includes(id)) state.solved.push(id);
  });
  saveState(false);
}

function renderAccount() {
  const user = cloudSession.user;
  elements.authToggleLabel.textContent = user ? user.name : t("accountLogin");
  elements.authStatus.textContent = user ? `${t("accountConnected")} · ${user.name} (${user.role === "teacher" ? t("accountTeacher") : t("accountStudent")})` : t("accountOffline");
  elements.authName.hidden = !cloudSession.registerMode || Boolean(user);
  elements.loginButton.hidden = Boolean(user);
  elements.registerButton.hidden = Boolean(user);
  elements.logoutButton.hidden = !user;
  elements.loginButton.textContent = cloudSession.registerMode ? t("accountRegister") : t("accountLogin");
  elements.registerButton.textContent = cloudSession.registerMode ? t("accountLogin") : t("accountRegister");
  elements.authEmail.disabled = Boolean(user);
  elements.authPassword.disabled = Boolean(user);
  elements.classSelect.disabled = !user;
  elements.className.disabled = !user;
  elements.joinCode.disabled = !user;
  renderClasses();
}

function renderClasses() {
  if (!elements.classSelect) return;
  const selected = elements.classSelect.value;
  elements.classSelect.replaceChildren();
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = t("classNone");
  elements.classSelect.append(empty);
  cloudSession.classes.forEach((item) => {
    const option = document.createElement("option");
    option.value = String(item.id);
    option.textContent = `${item.name} · ${item.join_code}`;
    elements.classSelect.append(option);
  });
  elements.classSelect.value = selected;
  renderTeacherCloudProgress();
}

async function loadClasses() {
  if (!cloudSession.user) return;
  try {
    const result = await cloudRequest("api/classes.php?action=list");
    cloudSession.classes = Array.isArray(result.classes) ? result.classes : [];
    renderClasses();
    if (elements.classSelect?.value) await loadClassProgress(elements.classSelect.value);
  } catch {
    cloudSession.classes = [];
    renderClasses();
  }
}

async function loadClassProgress(classId) {
  if (!cloudSession.user || !classId) {
    cloudSession.classProgress = null;
    cloudSession.classProgressError = "";
    renderTeacherCloudProgress();
    return;
  }
  cloudSession.classProgress = null;
  cloudSession.classProgressError = "";
  renderTeacherCloudProgress(true);
  try {
    const result = await cloudRequest(`api/classes.php?action=progress&classId=${encodeURIComponent(classId)}`);
    cloudSession.classProgress = result;
  } catch (error) {
    cloudSession.classProgressError = error.message || t("teacherCloudError");
  }
  renderTeacherCloudProgress();
}

async function loadStudentAttemptHistory(studentId) {
  const classId = elements.classSelect?.value || "";
  if (!cloudSession.user || !classId || !studentId) return [];
  const result = await cloudRequest(`api/attempts.php?action=student&classId=${encodeURIComponent(classId)}&studentId=${encodeURIComponent(studentId)}`);
  return Array.isArray(result.attempts) ? result.attempts : [];
}

async function initCloud() {
  try {
    const result = await cloudRequest("api/auth.php?action=me");
    cloudSession.configured = result.configured !== false;
    cloudSession.user = result.user || null;
    cloudSession.csrf = result.csrf || "";
    renderAccount();
    if (cloudSession.user) {
      const progress = await cloudRequest("api/progress.php");
      mergeCloudProgress(progress.progress);
      await loadClasses();
      renderMission({ silent: true });
      queueCloudSync();
    }
  } catch {
    cloudSession.configured = false;
    renderAccount();
  }
}

function saveState(sync = true) {
  state.stateVersion = 3;
  state.currentMissionId = missions[state.current]?.id || missions[0].id;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    document.querySelector(".status-dot")?.classList.add("storage-error");
  }
  if (sync) queueCloudSync();
}

function t(key) {
  return ui[state.language][key];
}

function interpolate(template, values) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template,
  );
}

function getMissionText(mission = missions[state.current]) {
  return mission.text[state.language];
}

function isUnlocked(index) {
  if (state.freePractice || index === 0 || state.solved.includes(missions[index]?.id)) return true;
  const preservedIndex = missions.findIndex((mission) => mission.id === state.unlockedThroughMissionId);
  if (preservedIndex >= index) return true;
  if (state.solved.includes(missions[index - 1].id)) return true;
  return missions.slice(index + 1).some((mission) => state.solved.includes(mission.id));
}

function translateInterface() {
  document.documentElement.lang = state.language;
  document.title = t("documentTitle");
  document.querySelector(".skip-link").textContent = t("skipLink");
  document.querySelector(".brand").setAttribute("aria-label", t("brandAria"));
  elements.missionRail?.setAttribute("aria-label", t("learningPathAria"));
  elements.missionRail?.querySelector("nav")?.setAttribute("aria-label", t("missionsAria"));
  document.querySelector(".xp-display").setAttribute("aria-label", t("xpAria"));
  document.querySelector(".code-context").setAttribute("aria-label", t("contextAria"));
  document.querySelector(".editor-toolbar")?.setAttribute("aria-label", t("editorToolsAria"));
  elements.resourceTabs?.setAttribute("aria-label", t("resourcesAria"));
  elements.toolTabs?.setAttribute("aria-label", t("toolsAria"));
  document.querySelector(".welcome-steps")?.setAttribute("aria-label", t("welcomeStepsAria"));
  document.querySelector(".progress-orbit")?.setAttribute("aria-label", t("progressAria"));
  elements.masteryValue?.setAttribute("aria-label", t("masteryAria"));
  elements.completionList?.setAttribute("aria-label", t("suggestionsAria"));
  elements.liveTemplateList?.setAttribute("aria-label", t("templatesAria"));
  elements.teacherToggle?.setAttribute("aria-label", t("teacherToggle"));
  elements.debugToggle?.setAttribute("aria-label", t("debugToggleAria"));
  elements.debugToggle?.setAttribute("title", t("debugToggleAria"));
  elements.teacherStageFilter?.setAttribute("aria-label", t("teacherStage"));
  elements.freePracticeToggle?.setAttribute("aria-pressed", String(Boolean(state.freePractice)));
  if (elements.freePracticeToggle) {
    const label = elements.freePracticeToggle.querySelector("[data-i18n]");
    if (label) label.textContent = state.freePractice ? t("freePracticeOn") : t("freePractice");
  }
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = t(element.dataset.i18n);
    if (typeof value === "string") element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const value = t(element.dataset.i18nPlaceholder);
    if (typeof value === "string") element.placeholder = value;
  });
  document.querySelectorAll(".language-button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === state.language));
  });
  elements.editor.placeholder = t("editorPlaceholder");
  applyTheme(state.theme);
  applyEditorPrefs();
  renderBugChecklist();
  renderTeacherPanel();
  renderAccount();
}

function applyEditorPrefs() {
  const mobileWorkspace = activeAppView === "workspace"
    && window.matchMedia("(max-width: 760px)").matches;
  const sidebarCollapsed = mobileWorkspace || Boolean(state.editorPrefs?.sidebarCollapsed);
  const focusMode = Boolean(state.editorPrefs?.focusMode);

  applySidebarState(sidebarCollapsed);

  document.body.classList.toggle("editor-focus-active", focusMode);
  elements.editorPanel?.classList.toggle("is-focus-mode", focusMode);
  elements.focusToggle?.setAttribute("aria-pressed", String(focusMode));
  elements.focusToggle?.setAttribute(
    "aria-label",
    focusMode ? t("focusExitAria") : t("focusEnterAria"),
  );
  if (elements.focusToggle) {
    elements.focusToggle.title = focusMode ? t("focusExitAria") : t("focusEnterAria");
    elements.focusToggle.querySelector("[data-i18n]").textContent = focusMode
      ? t("focusExit")
      : t("focusEnter");
  }
}

function applySidebarState(sidebarCollapsed) {
  elements.workspace?.classList.toggle("is-sidebar-collapsed", sidebarCollapsed);
  elements.missionRail?.toggleAttribute("hidden", sidebarCollapsed);
  elements.sidebarToggle?.setAttribute("aria-expanded", String(!sidebarCollapsed));
  elements.sidebarToggle?.setAttribute(
    "aria-label",
    sidebarCollapsed ? t("sidebarShowAria") : t("sidebarHideAria"),
  );
  if (elements.sidebarToggle) {
    elements.sidebarToggle.title = sidebarCollapsed ? t("sidebarShowAria") : t("sidebarHideAria");
    elements.sidebarToggle.querySelector("[data-i18n]").textContent = sidebarCollapsed
      ? t("sidebarShow")
      : t("sidebarHide");
  }
}

function setSidebarCollapsed(collapsed) {
  state.editorPrefs = {
    ...state.editorPrefs,
    sidebarCollapsed: Boolean(collapsed),
  };
  applyEditorPrefs();
  saveEditorPrefs();
}

function setAppView(view, options = {}) {
  const workspaceOpen = view === "workspace";
  activeAppView = workspaceOpen ? "workspace" : "dashboard";
  elements.dashboard.hidden = workspaceOpen;
  elements.workspace.hidden = !workspaceOpen;
  document.body.classList.toggle("view-workspace", workspaceOpen);

  if (workspaceOpen && window.matchMedia("(max-width: 760px)").matches) {
    applySidebarState(true);
  } else if (workspaceOpen) {
    applySidebarState(Boolean(state.editorPrefs?.sidebarCollapsed));
  } else {
    renderCommandCenter();
  }

  if (workspaceOpen && options.focusHeading) {
    focusMissionHeading();
  } else if (!workspaceOpen && options.focusDashboard !== false) {
    window.requestAnimationFrame(() => elements.commandContinueButton?.focus());
  }
}

function initOnboarding() {
  if (!elements.onboardingDialog || activeAppView !== "dashboard") return;
  const params = new URLSearchParams(window.location.search);
  const e2e = params.get("e2e") === "1";
  if (e2e && params.get("onboarding") !== "1") return;
  let completed = false;
  try {
    completed = localStorage.getItem(ONBOARDING_STORAGE_KEY) === "done";
  } catch {
    // La bienvenida sigue siendo usable aunque storage esté bloqueado.
  }
  if (completed) return;
  if (typeof elements.onboardingDialog.showModal === "function") {
    elements.onboardingDialog.showModal();
  } else {
    elements.onboardingDialog.setAttribute("open", "");
  }
}

function completeOnboarding() {
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "done");
  } catch {
    // Cerrar la bienvenida no depende de poder persistirla.
  }
}

function activateResourceTab(name = "") {
  const selected = name || "";
  elements.resourceTabs?.querySelectorAll("[data-resource-tab]").forEach((button) => {
    const active = button.dataset.resourceTab === selected;
    button.setAttribute("aria-expanded", String(active));
    button.classList.toggle("is-active", active);
  });
  elements.resourcePanels.forEach((panel) => {
    panel.hidden = panel.dataset.resourcePanel !== selected;
  });
}

function activateToolTab(name = "console", options = {}) {
  const selected = elements.toolPanels.some((panel) => panel.dataset.toolPanel === name)
    ? name
    : "console";
  elements.toolTabs?.querySelectorAll("[data-tool-tab]").forEach((button) => {
    const active = button.dataset.toolTab === selected;
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
    button.classList.toggle("is-active", active);
  });
  elements.toolPanels.forEach((panel) => {
    panel.hidden = panel.dataset.toolPanel !== selected;
  });
  if (options.focus) {
    elements.toolTabs?.querySelector(`[data-tool-tab="${selected}"]`)?.focus();
  }
}

function setFreePractice(enabled) {
  state.freePractice = Boolean(enabled);
  saveState();
  translateInterface();
  renderMissionList();
  renderCommandCenter();
}

async function setFocusMode(enabled, options = {}) {
  const nextEnabled = Boolean(enabled);

  if (nextEnabled && options.requestNative !== false && elements.editorPanel) {
    await requestFullscreen(elements.editorPanel);
  }

  if (!nextEnabled && getFullscreenElement()) {
    await exitFullscreen();
  }

  state.editorPrefs = {
    ...state.editorPrefs,
    focusMode: nextEnabled,
  };
  applyEditorPrefs();
  saveEditorPrefs();
  if (nextEnabled) elements.editor.focus();
}

function syncFocusModeWithFullscreen() {
  if (state.editorPrefs?.focusMode && !getFullscreenElement()) {
    state.editorPrefs = {
      ...state.editorPrefs,
      focusMode: false,
    };
    applyEditorPrefs();
    saveEditorPrefs();
  }
}

function projectById(projectId) {
  return PROJECTS.find((project) => project.id === projectId) || PROJECTS[0];
}

function projectMissions(projectId) {
  return missions.filter((mission) => mission.projectId === projectId);
}

function renderProjectNavigator() {
  if (!elements.projectSelect || !elements.projectSteps) return;
  const project = projectById(state.selectedProject);
  const route = projectMissions(project.id);
  const solvedCount = route.filter((mission) => state.solved.includes(mission.id)).length;

  elements.projectSelect.replaceChildren(...PROJECTS.map((candidate) => {
    const option = document.createElement("option");
    option.value = candidate.id;
    option.textContent = `${candidate.stage} · ${candidate.text[state.language].name}`;
    option.selected = candidate.id === project.id;
    return option;
  }));
  elements.projectProgress.textContent = `${solvedCount}/${route.length}`;
  elements.projectDeliverable.textContent = project.text[state.language].deliverable;
  elements.projectSteps.replaceChildren(...route.map((mission) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const index = missions.indexOf(mission);
    const solved = state.solved.includes(mission.id);
    button.type = "button";
    button.dataset.missionId = mission.id;
    button.disabled = !isUnlocked(index);
    button.className = mission.checkpoint ? "is-checkpoint" : "";
    if (solved) button.classList.add("is-complete");
    if (index === state.current) button.setAttribute("aria-current", "step");
    button.setAttribute(
      "aria-label",
      `${t("projectStep").replace("{current}", mission.projectOrder).replace("{total}", route.length)}: ${getMissionText(mission).short}`,
    );
    const order = document.createElement("span");
    order.textContent = solved ? "✓" : String(mission.projectOrder).padStart(2, "0");
    const title = document.createElement("strong");
    title.textContent = getMissionText(mission).short;
    const marker = document.createElement("small");
    marker.textContent = mission.checkpoint ? "CHECKPOINT" : mission.competencies.join("·");
    button.append(order, title, marker);
    item.append(button);
    return item;
  }));

  const remaining = route.filter((mission) => !state.solved.includes(mission.id));
  const nextMission = remaining.find((mission) => isUnlocked(missions.indexOf(mission)))
    || (state.freePractice ? remaining[0] : null)
    || route.find((mission) => mission.id === project.checkpointId);
  elements.projectContinueButton.disabled = !nextMission || !isUnlocked(missions.indexOf(nextMission));
  elements.projectContinueButton.dataset.missionId = nextMission?.id || "";
  const label = elements.projectContinueButton.querySelector("[data-i18n]");
  if (label) {
    label.dataset.i18n = nextMission?.checkpoint ? "projectCheckpoint" : "projectContinue";
    label.textContent = t(label.dataset.i18n);
  }
}

function renderCommandCenter() {
  if (!elements.commandNextMission || !elements.projectGallery) return;
  const solved = new Set(state.solved);
  const currentMission = missions[state.current];
  const currentHasWork = Boolean(String(state.answers[currentMission.id] || "").trim())
    && !solved.has(currentMission.id);
  const nextMission = (currentHasWork ? currentMission : null)
    || missions.find((mission, index) => !solved.has(mission.id) && isUnlocked(index))
    || missions.find((mission) => !solved.has(mission.id))
    || currentMission;
  const currentProject = projectById(state.selectedProject);
  const currentRoute = projectMissions(currentProject.id);
  const currentProjectSolved = currentRoute.filter((mission) => solved.has(mission.id)).length;
  const percentage = missions.length ? Math.round((state.solved.length / missions.length) * 100) : 0;

  elements.commandNarrative.textContent = t("commandNarrative");
  elements.commandNextMission.textContent = nextMission ? getMissionText(nextMission).short : t("commandComplete");
  elements.commandNextMeta.textContent = nextMission
    ? `${nextMission.stage} · ${t("mission")} ${String(missions.indexOf(nextMission) + 1).padStart(2, "0")} · +${nextMission.xp} XP`
    : t("commandComplete");
  elements.commandContinueButton.disabled = !nextMission;
  elements.commandContinueButton.dataset.missionId = nextMission?.id || "";
  const continueLabel = elements.commandContinueButton.querySelector("[data-i18n]");
  const resume = currentHasWork || state.solved.length > 0;
  if (continueLabel) {
    continueLabel.dataset.i18n = resume ? "commandResume" : "commandContinue";
    continueLabel.textContent = t(continueLabel.dataset.i18n);
  }
  elements.commandContinueButton.setAttribute(
    "aria-label",
    t(resume ? "commandResumeAria" : "commandContinueAria"),
  );
  elements.commandProgress.textContent = `${percentage}%`;
  elements.commandProgressMeta.textContent = interpolate(t("commandMissionsSolved"), {
    solved: state.solved.length,
    total: missions.length,
  });
  elements.commandProjectName.textContent = currentProject.text[state.language].name;
  elements.commandProjectMeta.textContent = interpolate(t("commandProjectProgress"), {
    solved: currentProjectSolved,
    total: currentRoute.length,
  });

  elements.projectGallery.replaceChildren(...PROJECTS.map((project) => {
    const route = projectMissions(project.id);
    const projectSolved = route.filter((mission) => solved.has(mission.id)).length;
    const nextProjectMission = route.find((mission) => !solved.has(mission.id) && isUnlocked(missions.indexOf(mission)))
      || (state.freePractice ? route.find((mission) => !solved.has(mission.id)) : null)
      || route.find((mission) => mission.id === project.checkpointId)
      || route[0];
    const projectUnlocked = Boolean(nextProjectMission && isUnlocked(missions.indexOf(nextProjectMission)));
    const card = document.createElement("article");
    card.className = "project-gallery-card";
    if (project.id === currentProject.id) card.classList.add("is-active");
    if (!projectUnlocked) card.classList.add("is-locked");
    card.innerHTML = `
      <div>
        <span>${project.stage}</span>
        <strong></strong>
        <small></small>
      </div>
      <button class="button button-text button-compact" type="button" data-project-id="${project.id}" data-mission-id="${nextProjectMission?.id || ""}" ${projectUnlocked ? "" : "disabled"}>
        ${projectUnlocked ? t("commandOpenProject") : t("commandProjectLocked")}
      </button>
    `;
    card.querySelector("strong").textContent = project.text[state.language].name;
    card.querySelector("small").textContent = interpolate(t("commandProjectProgress"), {
      solved: projectSolved,
      total: route.length,
    });
    const button = card.querySelector("button");
    button.setAttribute(
      "aria-label",
      projectUnlocked
        ? `${t("commandOpenProject")}: ${project.text[state.language].name}`
        : interpolate(t("commandProjectLockedAria"), { project: project.text[state.language].name }),
    );
    return card;
  }));
}

function renderProjectContext(mission) {
  const project = projectById(mission.projectId);
  const route = projectMissions(project.id);
  elements.projectContextName.textContent = `${project.stage} · ${project.text[state.language].name}`;
  elements.projectStep.textContent = `${interpolate(t("projectStep"), {
    current: mission.projectOrder,
    total: route.length,
  })} · ${getMissionText(mission).short}${mission.checkpoint ? " · CHECKPOINT" : ""}`;
  elements.projectContextDeliverable.textContent = mission.deliverable[state.language];
  elements.projectEvidence.textContent = mission.evidence[state.language];
}

const COMPILE_PHASES = ["write", "compile", "run", "validate", "explain"];

function setCompileRail(activePhase = "write", options = {}) {
  if (!elements.compileRailSteps) return;
  const activeIndex = COMPILE_PHASES.indexOf(activePhase);
  elements.compileRailSteps.querySelectorAll("[data-compile-phase]").forEach((step) => {
    const phase = step.dataset.compilePhase;
    const phaseIndex = COMPILE_PHASES.indexOf(phase);
    let status;
    if (activePhase === "request") {
      status = phase === "write" ? "done" : ["compile", "run"].includes(phase) ? "requested" : "pending";
    } else {
      status = phaseIndex < activeIndex ? "done" : phaseIndex === activeIndex ? "active" : "pending";
    }
    if (phase === "compile" && options.local) status = "local";
    if (phase === "run" && options.runSkipped) status = "skipped";
    if (options.failed && phase === activePhase) status = "error";
    step.dataset.state = status;
    step.setAttribute("aria-current", status === "active" || status === "error" ? "step" : "false");
    const phaseLabel = t(`compile${phase[0].toUpperCase()}${phase.slice(1)}`);
    const stateLabel = t(`compileState${status[0].toUpperCase()}${status.slice(1)}`);
    step.setAttribute("aria-label", `${phaseLabel}: ${stateLabel}`);
  });

  const statusKey = options.failed
    ? "compileRailFailed"
    : options.local
      ? "compileRailLocal"
      : activePhase === "request"
        ? "compileRailRequesting"
        : activePhase === "validate"
          ? "compileRailValidating"
          : activePhase === "explain"
            ? (options.runSkipped ? "compileRailVerifiedCompile" : "compileRailVerifiedRun")
            : "compileRailReady";
  elements.compileRailStatus.textContent = statusKey === "compileRailFailed"
    ? interpolate(t(statusKey), { phase: t(`compile${activePhase[0].toUpperCase()}${activePhase.slice(1)}`) })
    : t(statusKey);
}

function renderMissionList() {
  elements.missionList.replaceChildren();
  let renderedStage = "";
  missions.forEach((mission, index) => {
    if (mission.stage !== renderedStage) {
      renderedStage = mission.stage;
      const heading = document.createElement("li");
      heading.className = "mission-stage";
      heading.textContent = `${mission.stage} · ${missions.filter((item) => item.stage === mission.stage).length}`;
      elements.missionList.append(heading);
    }
    const solved = state.solved.includes(mission.id);
    const unlocked = isUnlocked(index);
    const button = document.createElement("button");
    button.type = "button";
    button.disabled = !unlocked;
    button.dataset.index = String(index);
    button.dataset.missionId = mission.id;
    button.className = solved ? "is-complete" : "";
    button.setAttribute(
      "aria-label",
      `${t("mission")} ${index + 1}: ${getMissionText(mission).short}. ${
        solved ? t("completed") : unlocked ? t("unlocked") : t("locked")
      }`,
    );
    if (index === state.current) button.setAttribute("aria-current", "step");

    const indexLabel = document.createElement("span");
    indexLabel.className = "mission-index";
    indexLabel.textContent = solved ? "✓" : String(index + 1).padStart(2, "0");

    const name = document.createElement("span");
    name.className = "mission-name";
    name.textContent = getMissionText(mission).short;
    const chips = document.createElement("small");
    chips.className = "mission-chips";
    chips.textContent = `${mission.competencies.join("·")} · ${mission.minutes} min`;

    const missionState = document.createElement("span");
    missionState.className = "mission-state";
    missionState.textContent = solved ? "●" : unlocked ? "›" : "×";

    button.append(indexLabel, name, chips, missionState);
    const item = document.createElement("li");
    item.append(button);
    elements.missionList.append(item);
  });
  renderProjectNavigator();
}

function updateLineNumbers(diagnosticLines = new Set()) {
  const lineCount = Math.max(elements.editor.value.split("\n").length, 1);
  elements.lineNumbers.replaceChildren(...Array.from({ length: lineCount }, (_, index) => {
    const line = document.createElement("span");
    line.textContent = String(index + 1);
    if (diagnosticLines.has(index + 1)) {
      line.className = `has-diagnostic diagnostic-${diagnosticLines.get?.(index + 1) || "warning"}`;
      line.dataset.severity = diagnosticLines.get?.(index + 1) || "warning";
    }
    return line;
  }));
}

function hideMessages() {
  elements.feedbackPanel.hidden = true;
  elements.hintPanel.hidden = true;
  elements.explanation.hidden = true;
}

function renderProgress() {
  const solved = new Set(state.solved);
  const totalAttempts = Object.values(state.attempts).reduce((sum, value) => sum + Number(value || 0), 0);
  const totalCorrect = Object.values(state.correctAttempts).reduce((sum, value) => sum + Number(value || 0), 0);
  const hints = Object.values(state.hintsUsed).reduce((sum, value) => sum + Number(value || 0), 0);
  const solutions = Object.values(state.solutionShown).filter(Boolean).length;
  const mastery = missions.length
    ? Math.round((state.solved.length / missions.length) * 70 + (totalAttempts ? (totalCorrect / totalAttempts) * 20 : 0) + Math.max(0, 10 - hints - solutions * 2))
    : 0;
  elements.masteryValue.textContent = `${Math.min(100, mastery)}%`;
  elements.masteryExplanation.textContent = state.language === "es"
    ? `Fórmula local: 70 × resueltas/${missions.length} + 20 × aciertos/intentos + máx.(0, 10 − pistas − 2 × soluciones). No es una nota oficial.`
    : `Lokale Formel: 70 × gelöst/${missions.length} + 20 × Treffer/Versuche + max.(0, 10 − Hinweise − 2 × Lösungen). Keine offizielle Note.`;

  const stats = [
    [state.language === "es" ? "Intentos" : "Versuche", totalAttempts],
    [state.language === "es" ? "Aciertos" : "Treffer", totalCorrect],
    [state.language === "es" ? "Pistas" : "Hinweise", hints],
    [state.language === "es" ? "Soluciones" : "Lösungen", solutions],
  ];
  elements.progressStats.replaceChildren(...stats.map(([label, value]) => {
    const item = document.createElement("div");
    item.innerHTML = `<strong>${value}</strong><span>${label}</span>`;
    return item;
  }));

  const next = missions.find((mission) => !solved.has(mission.id));
  const currentMission = missions[state.current];
  const hintsOnCurrent = Number(state.hintsUsed[currentMission.id] || 0);
  const attemptsOnCurrent = Number(state.attempts[currentMission.id] || 0);
  const currentProject = projectById(state.selectedProject);
  const currentRoute = projectMissions(currentProject.id);
  const pendingProjectMission = currentRoute.find((mission) => !solved.has(mission.id));
  let mentorTarget = currentMission;
  let mentorText = "";
  if (!next) {
    mentorText = t("mentorAdviceComplete");
  } else if (hintsOnCurrent >= 2 && !solved.has(currentMission.id)) {
    mentorText = interpolate(t("mentorAdviceHints"), { mission: getMissionText(currentMission).short });
  } else if (attemptsOnCurrent >= 2 && !solved.has(currentMission.id)) {
    mentorText = interpolate(t("mentorAdviceAttempts"), { mission: getMissionText(currentMission).short });
  } else if (pendingProjectMission && state.solved.length >= Math.max(3, Math.floor(missions.length * 0.08))) {
    mentorTarget = pendingProjectMission;
    mentorText = interpolate(t("mentorAdviceProject"), { project: currentProject.text[state.language].name });
  } else {
    mentorTarget = next;
    mentorText = interpolate(t("mentorAdviceStart"), { mission: getMissionText(next).short });
  }
  if (elements.mentorAdvice) elements.mentorAdvice.textContent = mentorText;
  if (elements.mentorAction) {
    elements.mentorAction.disabled = !mentorTarget;
    elements.mentorAction.dataset.missionId = mentorTarget?.id || "";
  }

  const scoreFor = (key, property) => missions.filter((mission) => mission[property]?.includes?.(key) || mission[property] === key)
    .filter((mission) => solved.has(mission.id)).length;
  const competenceScores = Object.keys(COMPETENCE_NAMES).map((key) => [key, scoreFor(key, "competencies")]);
  const fieldScores = Object.keys(CURRICULUM_FIELDS).map((key) => [key, scoreFor(key, "field")]);
  const strongest = [...competenceScores].sort((a, b) => b[1] - a[1])[0];
  const weakest = [...competenceScores].sort((a, b) => a[1] - b[1])[0];
  elements.progressInsights.replaceChildren();
  const summary = document.createElement("p");
  summary.textContent = state.language === "es"
    ? `Fortaleza actual: ${COMPETENCE_NAMES[strongest[0]].es}. Seguí practicando: ${COMPETENCE_NAMES[weakest[0]].es}. Recomendación: ${next ? getMissionText(next).short : "repasar sin pistas"}.`
    : `Aktuelle Stärke: ${COMPETENCE_NAMES[strongest[0]].de}. Weiter üben: ${COMPETENCE_NAMES[weakest[0]].de}. Empfehlung: ${next ? getMissionText(next).short : "ohne Hinweise wiederholen"}.`;
  const bars = document.createElement("div");
  bars.className = "curriculum-bars";
  [...competenceScores, ...fieldScores].forEach(([key, value]) => {
    const row = document.createElement("span");
    const label = COMPETENCE_NAMES[key]?.[state.language] || CURRICULUM_FIELDS[key][state.language];
    row.textContent = `${label}: ${value}`;
    bars.append(row);
  });
  elements.progressInsights.append(summary, bars);
  renderTeacherPanel();
}

function getTeacherRows() {
  const filter = elements.teacherStageFilter?.value || "all";
  return missions
    .filter((mission) => filter === "all" || mission.stage === filter)
    .map((mission) => ({
      stage: mission.stage,
      mission: getMissionText(mission).short,
      attempts: Number(state.attempts[mission.id] || 0),
      solved: state.solved.includes(mission.id),
      hints: Number(state.hintsUsed[mission.id] || 0),
      xp: state.solved.includes(mission.id) ? mission.xp : 0,
    }));
}

function renderTeacherPanel() {
  if (!elements.teacherPanel || !elements.teacherStats || !elements.teacherPracticeList) return;
  renderTeacherCloudProgress();
  const rows = getTeacherRows();
  const allRows = missions.map((mission) => ({
    attempts: Number(state.attempts[mission.id] || 0),
    solved: state.solved.includes(mission.id),
  }));
  const attempts = allRows.reduce((sum, row) => sum + row.attempts, 0);
  const solved = allRows.filter((row) => row.solved).length;
  const correct = allRows.filter((row) => row.solved).reduce((sum, row) => sum + 1, 0);
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
  const stats = [
    [t("teacherSolved"), `${solved}/${missions.length}`],
    [t("teacherAttempts"), attempts],
    [t("teacherAccuracy"), `${accuracy}%`],
    [t("teacherNeedsPractice"), missions.length - solved],
  ];
  elements.teacherStats.replaceChildren(...stats.map(([label, value]) => {
    const item = document.createElement("div");
    item.className = "teacher-stat";
    const strong = document.createElement("strong");
    strong.textContent = String(value);
    const caption = document.createElement("span");
    caption.textContent = label;
    item.append(strong, caption);
    return item;
  }));
  const pending = rows.filter((row) => !row.solved).slice(0, 8);
  elements.teacherPracticeList.replaceChildren();
  if (!pending.length) {
    const empty = document.createElement("li");
    empty.textContent = t("teacherNoPractice");
    elements.teacherPracticeList.append(empty);
    return;
  }
  pending.forEach((row) => {
    const item = document.createElement("li");
    item.innerHTML = `<span>${row.stage} · ${row.mission}</span><small>${row.attempts} ${t("teacherAttempts").toLowerCase()}</small>`;
    elements.teacherPracticeList.append(item);
  });
}

function renderTeacherCloudProgress(loading = false) {
  if (!elements.teacherCloudProgress) return;
  elements.teacherCloudProgress.replaceChildren();
  const classId = elements.classSelect?.value || "";
  if (!cloudSession.user || !classId) {
    const empty = document.createElement("p");
    empty.className = "heuristic-note";
    empty.textContent = t("teacherCloudEmpty");
    elements.teacherCloudProgress.append(empty);
    return;
  }
  if (loading) {
    const status = document.createElement("p");
    status.className = "heuristic-note";
    status.textContent = t("teacherCloudLoading");
    elements.teacherCloudProgress.append(status);
    return;
  }
  if (cloudSession.classProgressError) {
    const error = document.createElement("p");
    error.className = "heuristic-note diagnostic-error-text";
    error.textContent = `${t("teacherCloudError")} ${cloudSession.classProgressError}`;
    elements.teacherCloudProgress.append(error);
    return;
  }
  const students = cloudSession.classProgress?.students;
  if (!Array.isArray(students)) return;
  const title = document.createElement("strong");
  title.textContent = `${cloudSession.classProgress.class?.name || t("classSelect")} · ${students.length} ${t("teacherCloudStudents")}`;
  const grid = document.createElement("div");
  grid.className = "teacher-student-grid";
  students.forEach((student) => {
    const attempts = Number(student.attempts || 0);
    const solved = Number(student.solved || 0);
    const accuracy = attempts ? Math.round((Number(student.correct_attempts || 0) / attempts) * 100) : 0;
    const weakest = student.weakest_mission ? missionLabel(student.weakest_mission) : "—";
    const recommendation = recommendationForStudent(student);
    const card = document.createElement("article");
    card.className = "teacher-student-card";
    card.dataset.studentId = String(student.id);
    card.innerHTML = `
      <strong></strong>
      <span></span>
      <dl>
        <div><dt>${t("teacherSolved")}</dt><dd>${solved}/${missions.length}</dd></div>
        <div><dt>${t("teacherAttempts")}</dt><dd>${attempts}</dd></div>
        <div><dt>${t("teacherAccuracy")}</dt><dd>${accuracy}%</dd></div>
      </dl>
      <p class="teacher-recommendation"><b>${t("teacherWeakness")}:</b> <span data-weakest></span><br><b>${t("teacherRecommendation")}:</b> <span data-recommendation></span></p>
      <button class="button button-text button-compact" type="button" data-student-history>${t("teacherHistory")}</button>
      <ol class="student-history" hidden></ol>
      <small></small>
    `;
    card.querySelector("strong").textContent = student.name || student.email || `#${student.id}`;
    card.querySelector("span").textContent = student.email || "";
    card.querySelector("[data-weakest]").textContent = weakest;
    card.querySelector("[data-recommendation]").textContent = recommendation;
    card.querySelector("small").textContent = `${t("teacherLastActivity")}: ${student.last_activity || "—"}`;
    grid.append(card);
  });
  elements.teacherCloudProgress.append(title, grid);
}

function missionLabel(missionId) {
  const mission = missions.find((item) => item.id === missionId);
  return mission ? `${mission.stage} · ${getMissionText(mission).short}` : missionId;
}

function recommendationForStudent(student) {
  const attempts = Number(student.attempts || 0);
  const solved = Number(student.solved || 0);
  const failed = Number(student.failed_attempts || 0);
  const accuracy = attempts ? Number(student.correct_attempts || 0) / attempts : 0;
  if (!attempts) return state.language === "es" ? "Empezar con EF y exigir explicación verbal." : "Mit EF starten und eine mündliche Erklärung verlangen.";
  if (failed >= 3 && student.weakest_mission) return state.language === "es" ? `Repetir ${missionLabel(student.weakest_mission)} sin solución y con casos de prueba.` : `${missionLabel(student.weakest_mission)} ohne Lösung und mit Testfällen wiederholen.`;
  if (accuracy < 0.4) return state.language === "es" ? "Trabajar trazas manuales antes de volver a escribir código." : "Vor dem weiteren Coden manuelle Traces üben.";
  if (solved < missions.length / 3) return state.language === "es" ? "Consolidar fundamentos antes de avanzar a Q1/Q2." : "Grundlagen sichern, bevor Q1/Q2 vertieft wird.";
  return state.language === "es" ? "Subir dificultad: menos pistas y más justificación." : "Schwierigkeit erhöhen: weniger Hinweise, mehr Begründung.";
}

function buildTeacherExport() {
  return getTeacherRows().map((row) => ({
    nivel: row.stage,
    mision: row.mission,
    intentos: row.attempts,
    resuelta: row.solved,
    pistas: row.hints,
    xp: row.xp,
  }));
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function exportTeacherCsv() {
  const rows = buildTeacherExport();
  const header = Object.keys(rows[0] || { nivel: "", mision: "", intentos: "", resuelta: "", pistas: "", xp: "" });
  const csv = [header, ...rows.map((row) => header.map((key) => `"${String(row[key]).replaceAll('"', '""')}"`))]
    .map((row) => row.join(","))
    .join("\n");
  downloadFile("java-werkstatt-progreso.csv", `\ufeff${csv}`, "text/csv;charset=utf-8");
}

function exportTeacherJson() {
  downloadFile("java-werkstatt-progreso.json", JSON.stringify({ exportedAt: new Date().toISOString(), rows: buildTeacherExport() }, null, 2), "application/json;charset=utf-8");
}

function renderMission(options = {}) {
  const mission = missions[state.current];
  const text = getMissionText(mission);
  const solved = state.solved.includes(mission.id);
  const completedCount = state.solved.length;
  const hintCount = Math.min(Number(state.hintsUsed[mission.id]) || 0, text.hints.length);

  translateInterface();
  renderMissionList();
  elements.xp.textContent = String(state.xp);
  elements.missionNumber.textContent = `${mission.stage} · ${t("mission")} ${String(state.current + 1).padStart(2, "0")} · ${mission.competencies.join("/")}`;
  elements.difficulty.textContent = t("difficulty")[mission.difficulty];
  elements.missionXp.textContent = `+${mission.xp} XP`;
  elements.missionTitle.textContent = text.title;
  elements.objective.textContent = text.objective;
  elements.prompt.textContent = text.prompt;
  elements.concept.textContent = text.concept;
  if (elements.workbenchMission) {
    elements.workbenchMission.textContent = `${mission.stage} · ${String(state.current + 1).padStart(2, "0")}`;
  }
  if (elements.workbenchFile) {
    elements.workbenchFile.textContent = mission.file;
  }
  renderProjectContext(mission);
  renderCommandCenter();
  activateResourceTab();
  renderLessonVideo(mission);
  renderDocumentation(mission);
  elements.fileName.textContent = mission.file;
  elements.codeBefore.textContent = mission.contextBefore;
  elements.codeAfter.textContent = mission.contextAfter;
  elements.editor.value = state.answers[mission.id] || "";
  setEditorDiagnostics(mergeDiagnostics(analyzeCode(elements.editor.value)));
  setConsole(t("consoleReady"), t("consolePlaceholder"));
  elements.progressValue.textContent = `${completedCount}/${missions.length}`;
  elements.orbitValue.style.strokeDashoffset = String(
    113.1 - (113.1 * completedCount) / missions.length,
  );
  elements.hintCost.textContent = `−${HINT_COST} XP`;
  elements.nextButton.disabled = !solved;
  elements.nextButton.querySelector("[data-i18n]").textContent =
    state.current === missions.length - 1 ? t("finish") : t("next");
  elements.checkButton.disabled = false;
  elements.hintButton.disabled = hintCount >= text.hints.length;
  elements.solutionButton.disabled = Boolean(state.solutionShown[mission.id]);
  setEditorDiagnostics(mergeDiagnostics(analyzeCode(elements.editor.value)));
  scheduleDiagnostics();
  renderProgress();
  hideMessages();
  setCompileRail("write");

  if (hintCount > 0) showCurrentHint();
  if (solved && !options.silent) showSuccess(true);
}

function showFeedback(kind, title, message) {
  elements.feedbackPanel.hidden = false;
  elements.feedbackPanel.className = `feedback-panel ${kind}`;
  elements.feedbackIcon.textContent = kind === "success" ? "✓" : "!";
  elements.feedbackTitle.textContent = title;
  elements.feedbackMessage.textContent = message;
}

function setConsole(status, output) {
  if (!elements.consoleStatus || !elements.consoleOutput) return;
  elements.consoleStatus.textContent = status;
  elements.consoleOutput.replaceChildren(document.createTextNode(output));
}

function renderConsoleResult(mission, answer, structuralError = "") {
  const diagnostics = analyzeCode(answer);
  if (structuralError) {
    const lines = diagnostics.length
      ? diagnostics.map((item) => `L${item.line} [${item.severity.toUpperCase()}] ${item.message}`).join("\n")
      : `INFO ${structuralError}`;
    setConsole(t("consoleError"), `> javac ${mission.file}\n✕ ${lines}\n\n${t("consoleHint")}`);
    return;
  }
  setConsole(t("consoleSuccess"), `> javac ${mission.file}\n✓ 0 errores estructurales\n✓ ${getMissionText(mission).title}\n\n${t("consoleHint")}`);
}

function detectCompileMode(source) {
  if (/\b(public\s+)?(abstract\s+|final\s+)?(class|interface|enum|record)\b/.test(source)) return "source";
  if (/\b(?:public\s+|private\s+|protected\s+)?(?:static\s+)?[\w<>\[\]]+\s+\w+\s*\([^;{}]*\)\s*\{/.test(source)) return "member";
  return "snippet";
}

function hasConsolePrint(source) {
  return /\bSystem\s*\.\s*out\s*\.\s*print(?:ln|f)?\s*\(/.test(maskJava(source).masked);
}

function buildCompileRequest(mission, answer) {
  const source = [mission.contextBefore, answer, mission.contextAfter].filter(Boolean).join("\n");
  const mode = mission.compileMode || detectCompileMode(source);
  const answerStartLine = mission.contextBefore ? mission.contextBefore.split("\n").length + 1 : 1;
  const requiresRun = Boolean(window.JavaWerkstattEvaluators?.rules?.[mission.id]?.run);
  const shouldRun = mode !== "member" && (requiresRun || hasConsolePrint(source));
  return {
    source,
    fileName: mission.file,
    mode,
    answerStartLine,
    run: shouldRun,
  };
}

async function compileWithBackend(mission, answer) {
  if (!window.fetch) return { available: false };
  const request = buildCompileRequest(mission, answer);
  try {
    const response = await fetch(COMPILER_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(request),
    });
    const payload = await response.json();
    if (!response.ok && response.status !== 408) return { available: false };
    if (Array.isArray(payload.diagnostics)) {
      payload.diagnostics = payload.diagnostics.map((item) => ({
        ...item,
        sourceLine: item.line,
        line: Math.max(1, Number(item.line || 1) - request.answerStartLine + 1),
      }));
    }
    return { available: true, ...payload };
  } catch {
    return { available: false };
  }
}

function renderRealCompilerResult(mission, result) {
  if (!result.available) return;
  const header = `> javac ${mission.file} [${result.mode || "source"}]`;
  const runHeader = result.phase === "run" ? `\n> java ${mission.file.replace(/\.java$/, "")} [${result.sandbox || "jvm"}]` : "";
  const successText = result.phase === "run" ? t("runnerSuccess") : t("compilerSuccess");
  const errorText = result.phase === "run" ? t("runnerError") : t("compilerError");
  const stream = [result.stdout ? `stdout:\n${result.stdout}` : "", result.stderr ? `stderr:\n${result.stderr}` : ""].filter(Boolean).join("\n");
  const visibleOutput = result.phase === "run"
    ? (stream || `stdout:\n${t("consoleNoStdout")}`)
    : t("consolePrintRequired");
  const output = result.ok
    ? `${header}${runHeader}\n✓ ${successText} · ${result.durationMs || 0} ms\n${visibleOutput}\n✓ ${getMissionText(mission).title}\n\n${t("compilerHint")}`
    : `${header}${runHeader}\n✕ ${errorText}\n${(result.diagnostics || []).map((item) => `L${item.line} [${item.severity.toUpperCase()}] ${item.message}`).join("\n") || stream || result.rawOutput || result.error}\n\n${t("compilerHint")}`;
  setConsole(result.ok ? successText : errorText, output);
}

function showSuccess(wasAlreadySolved = false, compiler = null) {
  const mission = missions[state.current];
  const text = getMissionText(mission);
  showFeedback(
    "success",
    t("successTitle"),
    wasAlreadySolved ? t("alreadySolved") : t("successMessage"),
  );
  elements.explanation.hidden = false;
  const validationNote = compiler?.available
    ? (compiler.phase === "run" ? t("validationRunNote") : t("validationCompileNote"))
    : (wasAlreadySolved ? t("validationSavedNote") : t("validationLocalNote"));
  elements.explanation.textContent = `${text.explanation} ${validationNote}`;
  elements.nextButton.disabled = false;
}

async function checkAnswer() {
  const mission = missions[state.current];
  const answer = elements.editor.value;
  activateToolTab("console");
  setConsole(t("consoleChecking"), `> javac ${mission.file}\n… ${t("consoleChecking")}`);
  state.answers[mission.id] = answer;
  state.answerUpdatedAt[mission.id] = new Date().toISOString();
  state.attempts[mission.id] = Number(state.attempts[mission.id] || 0) + 1;

  if (!clean(answer)) {
    setCompileRail("write", { failed: true });
    showFeedback("error", t("emptyTitle"), t("emptyMessage"));
    renderConsoleResult(mission, answer, t("emptyMessage"));
    recordAttemptEvent(mission, { phase: "local", passed: false, feedback: t("emptyMessage"), answer });
    saveState();
    renderProgress();
    return;
  }

  setCompileRail("request");
  setConsole(t("compilerConnecting"), `> javac ${mission.file}\n… ${t("compilerConnecting")}`);
  const compiler = await compileWithBackend(mission, answer);
  if (compiler.available) {
    renderRealCompilerResult(mission, compiler);
    if (!compiler.ok) {
      setEditorDiagnostics(mergeDiagnostics(
        analyzeCode(answer),
        (compiler.diagnostics || []).map((item) => ({
          severity: item.severity || "error",
          line: item.line || 1,
          message: item.message || t("compilerError"),
        })),
      ));
      setCompileRail(compiler.phase === "run" ? "run" : "compile", {
        failed: true,
        runSkipped: compiler.phase !== "run",
      });
      const firstDiagnostic = compiler.diagnostics?.[0];
      const message = firstDiagnostic
        ? `Línea ${firstDiagnostic.line}: ${firstDiagnostic.message}`
        : compiler.error || t("consoleError");
      showFeedback("error", compiler.phase === "run" ? t("runnerError") : t("compilerError"), message);
      recordAttemptEvent(mission, {
        phase: compiler.phase || "compile",
        passed: false,
        feedback: message,
        diagnosticsCount: compiler.diagnostics?.length || 0,
        durationMs: compiler.durationMs || 0,
        answer,
      });
      saveState();
      renderProgress();
      return;
    }
    setCompileRail("validate", { runSkipped: compiler.phase !== "run" });
    const pedagogic = window.JavaWerkstattEvaluators?.evaluate?.(mission.id, compiler, state.language);
    if (pedagogic && !pedagogic.passed) {
      setCompileRail("validate", { failed: true, runSkipped: compiler.phase !== "run" });
      showFeedback("error", t("pedagogicError"), pedagogic.message);
      recordAttemptEvent(mission, { phase: "pedagogic", passed: false, feedback: pedagogic.message, durationMs: compiler.durationMs || 0, answer });
      saveState();
      renderProgress();
      return;
    }
  } else {
    setCompileRail("validate", { local: true, runSkipped: true });
    setConsole(t("compilerOffline"), `> javac ${mission.file}\n… ${t("compilerOffline")}\n\n${t("consoleHint")}`);
  }

  const answerViews = codeRepresentations(answer);
  const structuralError =
    commonStructureChecks(answerViews.raw, state.language) ||
    mission.validate(answerViews.raw, state.language);

  if (structuralError) {
    setCompileRail("validate", {
      failed: true,
      local: !compiler.available,
      runSkipped: compiler.phase !== "run",
    });
    showFeedback("error", t("errorTitle"), structuralError);
    renderConsoleResult(mission, answer, structuralError);
    recordAttemptEvent(mission, { phase: "local", passed: false, feedback: structuralError, diagnosticsCount: analyzeCode(answer).length, answer });
    saveState();
    renderProgress();
    return;
  }

  const alreadySolved = state.solved.includes(mission.id);
  if (!alreadySolved) {
    state.correctAttempts[mission.id] = Number(state.correctAttempts[mission.id] || 0) + 1;
    state.solved.push(mission.id);
    state.xp += mission.xp;
  }

  saveState();
  renderMissionList();
  elements.xp.textContent = String(state.xp);
  elements.progressValue.textContent = `${state.solved.length}/${missions.length}`;
  elements.orbitValue.style.strokeDashoffset = String(
    113.1 - (113.1 * state.solved.length) / missions.length,
  );
  setCompileRail("explain", {
    local: !compiler.available,
    runSkipped: compiler.phase !== "run",
  });
  showSuccess(alreadySolved, compiler);
  recordAttemptEvent(mission, { phase: compiler.available ? (compiler.phase || "compile") : "local", passed: true, feedback: getMissionText(mission).title, durationMs: compiler.durationMs || 0, answer });
  if (!compiler.available) renderConsoleResult(mission, answer);
  renderProgress();
}

function showCurrentHint() {
  const mission = missions[state.current];
  const text = getMissionText(mission);
  const count = Math.min(Number(state.hintsUsed[mission.id]) || 0, text.hints.length);

  if (count === 0) return;
  elements.hintPanel.hidden = false;
  elements.hintLevel.textContent = interpolate(t("hintLevel"), {
    current: count,
    total: text.hints.length,
  });
  elements.hintText.textContent = text.hints[count - 1];
}

function requestHint() {
  const mission = missions[state.current];
  const text = getMissionText(mission);
  const currentCount = Number(state.hintsUsed[mission.id]) || 0;

  if (currentCount >= text.hints.length) {
    activateResourceTab("guidance");
    elements.hintPanel.hidden = false;
    elements.hintText.textContent = t("noMoreHints");
    return;
  }

  state.hintsUsed[mission.id] = currentCount + 1;
  state.xp = Math.max(0, state.xp - HINT_COST);
  elements.xp.textContent = String(state.xp);
  elements.hintButton.disabled = state.hintsUsed[mission.id] >= text.hints.length;
  activateResourceTab("guidance");
  showCurrentHint();
  renderProgress();
  saveState();
}

function revealSolution() {
  const mission = missions[state.current];
  if (state.solutionShown[mission.id]) return;

  state.solutionShown[mission.id] = true;
  state.xp = Math.max(0, state.xp - SOLUTION_COST);
  state.answers[mission.id] = mission.solution;
  state.answerUpdatedAt[mission.id] = new Date().toISOString();
  elements.editor.value = mission.solution;
  elements.xp.textContent = String(state.xp);
  elements.solutionButton.disabled = true;
  activateResourceTab("guidance");
  updateLineNumbers();
  scheduleDiagnostics();
  renderProgress();

  elements.hintPanel.hidden = false;
  elements.hintLevel.textContent = t("solutionIntro");
  elements.hintText.replaceChildren(document.createTextNode(t("solutionPenalty")));
  const code = document.createElement("code");
  code.className = "solution-code";
  code.textContent = mission.solution;
  elements.hintText.append(code);
  saveState();
}

function moveNext() {
  const mission = missions[state.current];
  if (!state.solved.includes(mission.id)) return;

  if (state.current === missions.length - 1) {
    showFeedback("success", t("allDoneTitle"), t("allDoneMessage"));
    elements.explanation.hidden = true;
    return;
  }

  state.current += 1;
  state.selectedProject = missions[state.current].projectId;
  saveState();
  renderMission({ silent: true });
  elements.editor.focus();
}

function focusMissionHeading() {
  window.requestAnimationFrame(() => {
    elements.missionTitle?.focus({ preventScroll: false });
  });
}

function selectMission(index, options = {}) {
  if (!isUnlocked(index)) return;
  const currentMission = missions[state.current];
  state.answers[currentMission.id] = elements.editor.value;
  state.answerUpdatedAt[currentMission.id] = new Date().toISOString();
  state.current = index;
  state.selectedProject = missions[index].projectId;
  saveState();
  renderMission();
  setAppView("workspace", { focusHeading: options.focusHeading });
}

function changeLanguage(language) {
  if (!ui[language] || language === state.language) return;
  state.answers[missions[state.current].id] = elements.editor.value;
  state.language = language;
  saveState();
  renderLiveTemplates();
  renderMission();
}

function resetProgress() {
  if (!window.confirm(t("resetConfirm"))) return;
  const language = state.language;
  const theme = state.theme;
  state = createDefaultState(language);
  state.theme = theme;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // La aplicación sigue funcionando aunque el navegador bloquee storage.
  }
  renderMission({ silent: true });
  saveState();
}


function replaceEditorRange(start, end, text, selectionMode = "end") {
  elements.editor.setRangeText(text, start, end, selectionMode);
  elements.editor.dispatchEvent(new Event("input"));
}

function getLineBounds(value, position) {
  const start = value.lastIndexOf("\n", Math.max(position - 1, 0)) + 1;
  const nextBreak = value.indexOf("\n", position);
  const end = nextBreak === -1 ? value.length : nextBreak;
  return { start, end };
}

function commentSelectionOrLine() {
  const value = elements.editor.value;
  let start = elements.editor.selectionStart;
  let end = elements.editor.selectionEnd;
  const selectionIsEmpty = start === end;

  const firstLine = getLineBounds(value, start).start;
  const lastLinePosition = selectionIsEmpty ? end : Math.max(end - 1, start);
  const lastLine = getLineBounds(value, lastLinePosition).end;
  const block = value.slice(firstLine, lastLine);
  const lines = block.split("\n");
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  const shouldUncomment = nonEmptyLines.length > 0 && nonEmptyLines.every((line) => /^\s*\/\//.test(line));

  const transformed = lines
    .map((line) => {
      if (!line.trim()) return line;
      return shouldUncomment ? line.replace(/^(\s*)\/\/\s?/, "$1") : line.replace(/^(\s*)/, "$1// ");
    })
    .join("\n");

  replaceEditorRange(firstLine, lastLine, transformed, "select");
  if (selectionIsEmpty) {
    const offset = shouldUncomment ? -3 : 3;
    const nextCursor = Math.max(firstLine, start + offset);
    elements.editor.setSelectionRange(nextCursor, nextCursor);
  }
}

function duplicateSelectionOrLine() {
  const value = elements.editor.value;
  const start = elements.editor.selectionStart;
  const end = elements.editor.selectionEnd;

  if (start !== end) {
    const blockStart = getLineBounds(value, start).start;
    const blockEnd = getLineBounds(value, Math.max(end - 1, start)).end;
    const selectedBlock = value.slice(blockStart, blockEnd);
    const separator = blockEnd >= value.length ? "\n" : "";
    const insert = `${separator}${selectedBlock}`;
    replaceEditorRange(blockEnd, blockEnd, insert, "end");
    const nextStart = blockEnd + separator.length;
    elements.editor.setSelectionRange(nextStart, nextStart + selectedBlock.length);
    return;
  }

  const { start: lineStart, end: lineEnd } = getLineBounds(value, start);
  const line = value.slice(lineStart, lineEnd);
  const insert = `\n${line}`;
  replaceEditorRange(lineEnd, lineEnd, insert, "end");
  const nextStart = lineEnd + 1;
  elements.editor.setSelectionRange(nextStart, nextStart + line.length);
}

function getCurrentLineIndent(value, position) {
  const { start } = getLineBounds(value, position);
  return value.slice(start, position).match(/^\s*/)?.[0] || "";
}

function indentTemplate(template, indent) {
  return template.replace(/\n/g, `\n${indent}`);
}

function findTemplateBeforeCursor(value, cursor) {
  const beforeCursor = value.slice(0, cursor);
  const match = beforeCursor.match(/(^|[^A-Za-z0-9_])([A-Za-z][A-Za-z0-9_]*)$/);
  if (!match) return null;
  const abbreviation = match[2];
  const template = LIVE_TEMPLATES.find((candidate) => candidate.abbr === abbreviation);
  if (!template) return null;
  return { template, start: cursor - abbreviation.length };
}

function expandLiveTemplateOrInsertTab() {
  const value = elements.editor.value;
  const start = elements.editor.selectionStart;
  const end = elements.editor.selectionEnd;
  const match = start === end ? findTemplateBeforeCursor(value, start) : null;

  if (!match) {
    replaceEditorRange(start, end, "    ", "end");
    return;
  }

  const indent = getCurrentLineIndent(value, match.start);
  const expandedWithMarker = indentTemplate(match.template.template, indent);
  const markerIndex = expandedWithMarker.indexOf("$END$");
  const expanded = expandedWithMarker.replace("$END$", "");
  replaceEditorRange(match.start, start, expanded, "end");

  if (markerIndex >= 0) {
    const cursor = match.start + markerIndex;
    elements.editor.setSelectionRange(cursor, cursor);
  }
}

function renderLiveTemplates() {
  if (!elements.liveTemplateList) return;
  elements.liveTemplateList.replaceChildren();
  LIVE_TEMPLATES.forEach((template) => {
    const item = document.createElement("li");
    const abbreviation = document.createElement("code");
    abbreviation.textContent = template.abbr;
    const description = document.createElement("span");
    description.textContent = state.language === "es"
      ? `Expande ${template.abbr} como estructura Java`
      : `Erweitert ${template.abbr} als Java-Struktur`;
    item.append(abbreviation, description);
    elements.liveTemplateList.append(item);
  });
}

const JAVA_COMPLETIONS = [
  ["public", "public ", "Modificador público", "Öffentlicher Modifikator"],
  ["private", "private ", "Modificador privado", "Privater Modifikator"],
  ["class", "class $END$ {\n    \n}", "Declaración de clase", "Klassendeklaration"],
  ["return", "return $END$;", "Devolver un valor", "Wert zurückgeben"],
  ["if", "if ($END$) {\n    \n}", "Decisión condicional", "Bedingte Entscheidung"],
  ["while", "while ($END$) {\n    \n}", "Repetición condicional", "Bedingte Wiederholung"],
  ["new", "new $END$()", "Crear una instancia", "Instanz erzeugen"],
  ["String", "String", "Tipo de texto inmutable", "Unveränderlicher Texttyp"],
  ["ArrayList", "ArrayList<>", "Lista dinámica", "Dynamische Liste"],
  ["HashMap", "HashMap<>", "Mapa basado en hash", "Hash-basierte Map"],
];
let completionState = { items: [], active: 0, start: 0, end: 0 };

function completionCandidates(force = false) {
  const cursor = elements.editor.selectionStart;
  if (cursor !== elements.editor.selectionEnd) return [];
  const token = elements.editor.value.slice(0, cursor).match(/[A-Za-z][A-Za-z0-9_]*$/)?.[0] || "";
  if (!force && token.length < 2) return [];
  const query = token.toLowerCase();
  const templates = LIVE_TEMPLATES.map((item) => ({
    label: item.abbr,
    insert: item.template,
    description: state.language === "es"
      ? `Expande ${item.abbr} como estructura Java`
      : `Erweitert ${item.abbr} als Java-Struktur`,
  }));
  const terms = JAVA_COMPLETIONS.map(([label, insert, es, de]) => ({
    label, insert, description: state.language === "es" ? es : de,
  }));
  return [...templates, ...terms]
    .filter((item) => force ? !query || item.label.toLowerCase().includes(query) : item.label.toLowerCase().startsWith(query))
    .slice(0, 8)
    .map((item) => ({ ...item, start: cursor - token.length, end: cursor }));
}

function closeCompletion() {
  elements.completionPopup.hidden = true;
  elements.editor.setAttribute("aria-expanded", "false");
  elements.editor.removeAttribute("aria-activedescendant");
  completionState.items = [];
}

function renderCompletion(force = false) {
  const items = completionCandidates(force);
  if (!items.length) return closeCompletion();
  completionState = { items, active: 0, start: items[0].start, end: items[0].end };
  elements.completionList.replaceChildren(...items.map((item, index) => {
    const option = document.createElement("li");
    option.id = `completion-${index}`;
    option.role = "option";
    option.dataset.index = String(index);
    option.setAttribute("aria-selected", String(index === 0));
    const label = document.createElement("code");
    label.textContent = item.label;
    const description = document.createElement("span");
    description.textContent = item.description;
    option.append(label, description);
    return option;
  }));
  elements.completionPopup.hidden = false;
  elements.editor.setAttribute("aria-expanded", "true");
  elements.editor.setAttribute("aria-activedescendant", "completion-0");
}

function moveCompletion(direction) {
  completionState.active = (completionState.active + direction + completionState.items.length) % completionState.items.length;
  [...elements.completionList.children].forEach((option, index) => option.setAttribute("aria-selected", String(index === completionState.active)));
  const active = elements.completionList.children[completionState.active];
  elements.editor.setAttribute("aria-activedescendant", active.id);
  active.scrollIntoView({ block: "nearest" });
}

function acceptCompletion(index = completionState.active) {
  const item = completionState.items[index];
  if (!item) return false;
  const indent = getCurrentLineIndent(elements.editor.value, item.start);
  const expandedWithMarker = indentTemplate(item.insert, indent);
  const marker = expandedWithMarker.indexOf("$END$");
  const expanded = expandedWithMarker.replace("$END$", "");
  replaceEditorRange(item.start, item.end, expanded, "end");
  if (marker >= 0) elements.editor.setSelectionRange(item.start + marker, item.start + marker);
  closeCompletion();
  return true;
}

function maskJava(code) {
  let result = "";
  let mode = "code";
  for (let index = 0; index < code.length; index += 1) {
    const char = code[index];
    const next = code[index + 1];
    if (mode === "code" && char === "/" && next === "/") { mode = "line"; result += "  "; index += 1; continue; }
    if (mode === "code" && char === "/" && next === "*") { mode = "block"; result += "  "; index += 1; continue; }
    if (mode === "code" && (char === '"' || char === "'")) { mode = char; result += " "; continue; }
    if (mode === "line" && char === "\n") { mode = "code"; result += "\n"; continue; }
    if (mode === "block" && char === "*" && next === "/") { mode = "code"; result += "  "; index += 1; continue; }
    if ((mode === '"' || mode === "'") && char === "\\") { result += "  "; index += 1; continue; }
    if ((mode === '"' || mode === "'") && char === mode) { mode = "code"; result += " "; continue; }
    result += mode === "code" ? char : (char === "\n" ? "\n" : " ");
  }
  return { masked: result, unterminated: mode !== "code" && mode !== "line" };
}

function analyzeCode(code) {
  const { masked, unterminated } = maskJava(code);
  const diagnostics = [];
  const lines = code.split("\n");
  const maskedLines = masked.split("\n");
  const add = (severity, line, es, de) => diagnostics.push({ severity, line, message: state.language === "es" ? es : de });
  const stack = [];
  for (let index = 0; index < masked.length; index += 1) {
    if ("{([".includes(masked[index])) stack.push([masked[index], index]);
    if ("})]".includes(masked[index])) {
      const expected = { "}": "{", ")": "(", "]": "[" }[masked[index]];
      if (stack.at(-1)?.[0] === expected) stack.pop();
      else add("error", masked.slice(0, index).split("\n").length, "Cierre sin apertura compatible.", "Schließzeichen ohne passende Öffnung.");
    }
  }
  stack.forEach(([, position]) => add("error", masked.slice(0, position).split("\n").length, "Par sin cerrar.", "Nicht geschlossenes Zeichenpaar."));
  if (unterminated) add("error", lines.length, "String o comentario de bloque sin cerrar.", "String oder Blockkommentar nicht geschlossen.");
  const hasTabs = lines.some((line) => /^\s*\t/.test(line));
  const hasSpaces = lines.some((line) => /^ +\S/.test(line));
  if (hasTabs && hasSpaces) add("warning", lines.findIndex((line) => /^\s*\t/.test(line)) + 1, "Mezcla de tabs y espacios.", "Tabs und Leerzeichen gemischt.");
  let depth = 0;
  maskedLines.forEach((line, index) => {
    const trimmed = line.trim();
    const expectedDepth = Math.max(0, depth - (trimmed.startsWith("}") ? 1 : 0));
    if (trimmed && !trimmed.startsWith("//")) {
      const actual = lines[index].match(/^[ \t]*/)[0].replace(/\t/g, "    ").length;
      if (actual !== expectedDepth * 4) add("info", index + 1, `Indentación esperada: ${expectedDepth * 4} espacios.`, `Erwartete Einrückung: ${expectedDepth * 4} Leerzeichen.`);
      if (/^(?:return|throw|break|continue|(?:final\s+)?(?:int|double|boolean|char|String|var)\s+\w+|[\w.[\]]+\s*(?:=|\+=|-=|\+\+|--)|System\.out\.)/.test(trimmed)
        && !/[;{}:]$/.test(trimmed)) add("warning", index + 1, "Posible punto y coma faltante.", "Möglicherweise fehlt ein Semikolon.");
    }
    depth += (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
    depth = Math.max(0, depth);
  });
  return diagnostics.slice(0, 20);
}

let activeEditorDiagnostics = [];

function diagnosticRank(severity) {
  return { error: 3, warning: 2, info: 1 }[severity] || 0;
}

function mergeDiagnostics(...groups) {
  const byLine = new Map();
  groups.flat().filter(Boolean).forEach((diagnostic) => {
    const line = Math.max(1, Number(diagnostic.line || 1));
    const current = byLine.get(line);
    const next = {
      severity: diagnostic.severity || "warning",
      line,
      message: diagnostic.message || String(diagnostic.error || ""),
    };
    if (!current || diagnosticRank(next.severity) > diagnosticRank(current.severity)) {
      byLine.set(line, next);
    }
  });
  return [...byLine.values()].sort((a, b) => a.line - b.line).slice(0, 20);
}

function setEditorDiagnostics(diagnostics) {
  activeEditorDiagnostics = diagnostics;
  const lines = new Map(activeEditorDiagnostics.map((item) => [item.line, item.severity]));
  updateLineNumbers(lines);
  renderEditorDiagnosticsOverlay();
}

function renderEditorDiagnosticsOverlay() {
  if (!elements.editorDiagnosticsOverlay || !elements.editor) return;
  const diagnosticsByLine = new Map(activeEditorDiagnostics.map((item) => [item.line, item]));
  const lines = elements.editor.value.split("\n");
  elements.editorDiagnosticsOverlay.replaceChildren(...lines.map((line, index) => {
    const row = document.createElement("div");
    row.className = "editor-diagnostic-line";
    const diagnostic = diagnosticsByLine.get(index + 1);
    if (diagnostic) {
      row.classList.add(`diagnostic-${diagnostic.severity}`);
      row.dataset.tooltip = diagnostic.message;
    }
    row.textContent = line || " ";
    return row;
  }));
  elements.editorDiagnosticsOverlay.scrollTop = elements.editor.scrollTop;
  elements.editorDiagnosticsOverlay.scrollLeft = elements.editor.scrollLeft;
}

function diagnosticForEditorEvent(event) {
  if (!activeEditorDiagnostics.length) return null;
  const style = getComputedStyle(elements.editor);
  const lineHeight = Number.parseFloat(style.lineHeight) || 24;
  const paddingTop = Number.parseFloat(style.paddingTop) || 0;
  const rect = elements.editor.getBoundingClientRect();
  const line = Math.floor((event.clientY - rect.top - paddingTop + elements.editor.scrollTop) / lineHeight) + 1;
  const exact = activeEditorDiagnostics.find((diagnostic) => diagnostic.line === line);
  if (exact) return exact;
  // El cálculo del contenido interno de un textarea puede redondear una línea
  // arriba/abajo según navegador y zoom; conserva el hover útil en ese borde.
  const nearest = activeEditorDiagnostics.reduce((closest, diagnostic) => (
    !closest || Math.abs(diagnostic.line - line) < Math.abs(closest.line - line) ? diagnostic : closest
  ), null);
  return nearest && Math.abs(nearest.line - line) <= 1 ? nearest : null;
}

function showHoveredDiagnostic(event) {
  const diagnostic = diagnosticForEditorEvent(event);
  if (diagnostic) showEditorTooltip(diagnostic, event.clientX, event.clientY);
  else hideEditorTooltip();
}

function handleDiagnosticPointerMove(event) {
  if (!elements.editor) return;
  const rect = elements.editor.getBoundingClientRect();
  const insideEditor = event.clientX >= rect.left && event.clientX <= rect.right
    && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (insideEditor) showHoveredDiagnostic(event);
  else hideEditorTooltip();
}

function showEditorTooltip(diagnostic, x, y) {
  if (!elements.editorErrorTooltip || !diagnostic) return;
  elements.editorErrorTooltip.textContent = diagnostic.message;
  elements.editorErrorTooltip.className = `editor-error-tooltip diagnostic-${diagnostic.severity}`;
  elements.editorErrorTooltip.hidden = false;
  const wrap = elements.editor.parentElement.getBoundingClientRect();
  elements.editorErrorTooltip.style.left = `${Math.max(8, Math.min(x - wrap.left + 14, wrap.width - 280))}px`;
  elements.editorErrorTooltip.style.top = `${Math.max(8, y - wrap.top + 14)}px`;
}

function hideEditorTooltip() {
  if (elements.editorErrorTooltip) elements.editorErrorTooltip.hidden = true;
}

function showCursorDiagnostic() {
  if (!activeEditorDiagnostics.length) return hideEditorTooltip();
  const line = elements.editor.value.slice(0, elements.editor.selectionStart).split("\n").length;
  const diagnostic = activeEditorDiagnostics.find((item) => item.line === line);
  if (!diagnostic) return hideEditorTooltip();
  const style = getComputedStyle(elements.editor);
  const lineHeight = Number.parseFloat(style.lineHeight) || 24;
  const paddingTop = Number.parseFloat(style.paddingTop) || 0;
  const top = paddingTop + (line - 1) * lineHeight - elements.editor.scrollTop;
  const rect = elements.editor.getBoundingClientRect();
  showEditorTooltip(diagnostic, rect.left + 28, rect.top + top + lineHeight);
}

let diagnosticsTimer;
function renderDiagnostics() {
  const diagnostics = mergeDiagnostics(analyzeCode(elements.editor.value));
  setEditorDiagnostics(diagnostics);
  elements.diagnosticsList.replaceChildren();
  if (!diagnostics.length) {
    const empty = document.createElement("li");
    empty.className = "diagnostic-empty";
    empty.textContent = t("noDiagnostics");
    elements.diagnosticsList.append(empty);
    return;
  }
  diagnostics.forEach((diagnostic) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.line = String(diagnostic.line);
    button.className = `diagnostic-${diagnostic.severity}`;
    button.innerHTML = `<span>${diagnostic.severity.toUpperCase()}</span><strong>${state.language === "es" ? "Línea" : "Zeile"} ${diagnostic.line}</strong><em></em>`;
    button.querySelector("em").textContent = diagnostic.message;
    item.append(button);
    elements.diagnosticsList.append(item);
  });
}

function renderBugChecklist() {
  if (!elements.bugChecklist) return;
  elements.bugChecklist.replaceChildren(...state.bugChecklist.map((item) => {
    const row = document.createElement("li");
    row.className = "bug-checklist-item";
    row.dataset.id = item.id;

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = item.checked;
    check.setAttribute("aria-label", item.text || t("bugChecklistPlaceholder"));

    const input = document.createElement("input");
    input.type = "text";
    input.value = item.text;
    input.maxLength = 240;
    input.placeholder = t("bugChecklistPlaceholder");
    input.setAttribute("aria-label", t("bugChecklistPlaceholder"));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.action = "remove";
    remove.setAttribute("aria-label", t("bugChecklistRemove"));
    remove.title = t("bugChecklistRemove");
    remove.textContent = "×";

    row.append(check, input, remove);
    return row;
  }));
}

function focusBugChecklistItem(id) {
  requestAnimationFrame(() => {
    elements.bugChecklist?.querySelector(`li[data-id="${id}"] input[type="text"]`)?.focus();
  });
}

function openBugChecklist(event) {
  event?.preventDefault();
  const panel = document.querySelector("#bugChecklistPanel");
  const firstItem = state.bugChecklist[0];
  if (!panel || !firstItem) return;
  const opening = panel.hidden;
  panel.hidden = !opening;
  elements.debugToggle?.setAttribute("aria-expanded", String(opening));
  if (!opening) return;
  focusBugChecklistItem(firstItem.id);
}

function closeBugChecklist() {
  const panel = document.querySelector("#bugChecklistPanel");
  if (!panel || panel.hidden) return;
  panel.hidden = true;
  elements.debugToggle?.setAttribute("aria-expanded", "false");
}

function scheduleDiagnostics() {
  clearTimeout(diagnosticsTimer);
  diagnosticsTimer = setTimeout(renderDiagnostics, 220);
}

function formatIndentation() {
  const { masked } = maskJava(elements.editor.value);
  const rawLines = elements.editor.value.split("\n");
  const maskedLines = masked.split("\n");
  let depth = 0;
  const formatted = rawLines.map((raw, index) => {
    const content = raw.trim();
    const structural = maskedLines[index].trim();
    const currentDepth = Math.max(0, depth - (structural.startsWith("}") ? 1 : 0));
    const line = content ? `${" ".repeat(currentDepth * 4)}${content}` : "";
    depth += (structural.match(/{/g) || []).length - (structural.match(/}/g) || []).length;
    depth = Math.max(0, depth);
    return line;
  }).join("\n");
  elements.editor.value = formatted;
  elements.editor.dispatchEvent(new Event("input"));
  elements.editor.focus();
}

function getEditorLineColumn(value, position) {
  const safePosition = Math.min(Math.max(position, 0), value.length);
  const before = value.slice(0, safePosition).split("\n");
  return { line: before.length - 1, column: before[before.length - 1].length };
}

function getEditorPosition(lines, line, column) {
  const safeLine = Math.min(Math.max(line, 0), lines.length - 1);
  const safeColumn = Math.min(Math.max(column, 0), lines[safeLine].length);
  return lines.slice(0, safeLine).reduce((total, current) => total + current.length + 1, 0) + safeColumn;
}

function moveSelectedLines(direction) {
  const value = elements.editor.value;
  const lines = value.split("\n");
  if (lines.length < 2) return false;

  const start = elements.editor.selectionStart;
  const end = elements.editor.selectionEnd;
  const selectionIsEmpty = start === end;
  const startLocation = getEditorLineColumn(value, start);
  const endLocation = getEditorLineColumn(value, end);
  const firstLine = startLocation.line;
  const lastLine = selectionIsEmpty
    ? startLocation.line
    : endLocation.column === 0 && endLocation.line > firstLine
      ? endLocation.line - 1
      : endLocation.line;

  if (direction === "up" && firstLine === 0) return false;
  if (direction === "down" && lastLine >= lines.length - 1) return false;

  const nextLines = [...lines];
  const block = nextLines.splice(firstLine, lastLine - firstLine + 1);
  const insertionIndex = direction === "up" ? firstLine - 1 : firstLine + 1;
  nextLines.splice(insertionIndex, 0, ...block);
  elements.editor.value = nextLines.join("\n");
  elements.editor.dispatchEvent(new Event("input"));

  const offset = direction === "up" ? -1 : 1;
  const nextStart = getEditorPosition(nextLines, startLocation.line + offset, startLocation.column);
  const nextEnd = selectionIsEmpty
    ? nextStart
    : getEditorPosition(nextLines, endLocation.line + offset, endLocation.column);
  elements.editor.setSelectionRange(nextStart, nextEnd);
  return true;
}

function clearEditor() {
  if (!elements.editor.value) return;
  elements.editor.value = "";
  elements.editor.dispatchEvent(new Event("input"));
  hideMessages();
}

function handleAutoPair(event) {
  const pairs = { '"': '"', "'": "'", "(": ")", "[": "]", "{": "}" };
  const opening = event.key;
  const closing = pairs[opening];
  const value = elements.editor.value;
  const start = elements.editor.selectionStart;
  const end = elements.editor.selectionEnd;
  if ([")", "]", "}"].includes(opening) && start === end && value[start] === opening) {
    event.preventDefault();
    elements.editor.setSelectionRange(start + 1, start + 1);
    return true;
  }
  if (!closing) return false;
  if (start === end && value[start] === closing) {
    event.preventDefault();
    elements.editor.setSelectionRange(start + 1, start + 1);
    return true;
  }

  event.preventDefault();
  const selected = value.slice(start, end);
  const replacement = `${opening}${selected}${closing}`;
  elements.editor.setRangeText(replacement, start, end, "end");
  const cursor = selected ? end + 2 : start + 1;
  elements.editor.setSelectionRange(cursor, cursor);
  elements.editor.dispatchEvent(new Event("input"));
  return true;
}

function moveToMission(index) {
  if (index < 0 || index >= missions.length || !isUnlocked(index) || index === state.current) {
    return false;
  }
  selectMission(index);
  elements.editor.focus();
  return true;
}

function handleShortcut(event) {
  const command = event.metaKey || event.ctrlKey;
  const isEditorFocused = document.activeElement === elements.editor;

  if (event.key === "Escape") {
    if (!elements.completionPopup.hidden) {
      event.preventDefault();
      closeCompletion();
      return;
    }
    if (state.editorPrefs?.focusMode) {
      event.preventDefault();
      setFocusMode(false);
      return;
    }

    if (!elements.feedbackPanel.hidden || !elements.hintPanel.hidden) {
      event.preventDefault();
      hideMessages();
      elements.editor.focus();
      return;
    }
    if (!isEditorFocused) {
      event.preventDefault();
      elements.editor.focus();
    }
    return;
  }

  if (!command && !event.altKey && !event.ctrlKey && event.key === "F5") {
    event.preventDefault();
    checkAnswer();
    return;
  }

  if (isEditorFocused && command && event.code === "Space") {
    event.preventDefault();
    renderCompletion(true);
    return;
  }

  if (event.altKey && event.key === "Enter") {
    event.preventDefault();
    requestHint();
    return;
  }

  if (command && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
    const targetIndex = state.current + (event.key === "ArrowRight" ? 1 : -1);
    if (moveToMission(targetIndex)) event.preventDefault();
    return;
  }

  if (isEditorFocused && event.altKey && event.shiftKey && !event.metaKey && !event.ctrlKey) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      duplicateSelectionOrLine();
      return;
    }
  }

  if (isEditorFocused && event.altKey && !event.shiftKey && !event.metaKey && !event.ctrlKey) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      const moved = moveSelectedLines(event.key === "ArrowUp" ? "up" : "down");
      if (moved) event.preventDefault();
      return;
    }
  }

  if (!isEditorFocused || !command) return;

  if (event.key === "/") {
    event.preventDefault();
    commentSelectionOrLine();
    return;
  }

  if (event.key.toLowerCase() === "d") {
    event.preventDefault();
    duplicateSelectionOrLine();
    return;
  }

  if (event.key.toLowerCase() === "l") {
    event.preventDefault();
    clearEditor();
  }
}

elements.lessonVideoPreview?.addEventListener("click", playLessonVideo);

elements.editor.addEventListener("input", () => {
  state.answers[missions[state.current].id] = elements.editor.value;
  state.answerUpdatedAt[missions[state.current].id] = new Date().toISOString();
  updateLineNumbers();
  hideEditorTooltip();
  scheduleDiagnostics();
  renderCompletion();
  setCompileRail("write");
  saveState();
});

elements.editor.addEventListener("scroll", () => {
  renderEditorDiagnosticsOverlay();
  hideEditorTooltip();
});

document.addEventListener("mousemove", handleDiagnosticPointerMove);
document.addEventListener("pointermove", handleDiagnosticPointerMove);

elements.editor.addEventListener("click", showCursorDiagnostic);

elements.editor.addEventListener("keyup", (event) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"].includes(event.key)) {
    showCursorDiagnostic();
  }
});

elements.editor.addEventListener("keydown", (event) => {
  if (!elements.completionPopup.hidden) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveCompletion(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      acceptCompletion();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeCompletion();
      return;
    }
  }
  if (event.key === "Tab") {
    event.preventDefault();
    expandLiveTemplateOrInsertTab();
    return;
  }
  handleAutoPair(event);
});

elements.completionList?.addEventListener("mousedown", (event) => {
  const option = event.target.closest("[data-index]");
  if (!option) return;
  event.preventDefault();
  acceptCompletion(Number(option.dataset.index));
  elements.editor.focus();
});

elements.diagnosticsList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-line]");
  if (!button) return;
  const line = Number(button.dataset.line);
  const position = getEditorPosition(elements.editor.value.split("\n"), line - 1, 0);
  elements.editor.focus();
  elements.editor.setSelectionRange(position, position);
  showCursorDiagnostic();
});

elements.bugChecklist?.addEventListener("input", (event) => {
  const input = event.target.closest('input[type="text"]');
  const item = input?.closest("li[data-id]");
  if (!item) return;
  const checklistItem = state.bugChecklist.find((entry) => entry.id === item.dataset.id);
  if (!checklistItem) return;
  checklistItem.text = input.value.slice(0, 240);
  saveState(false);
});

elements.bugChecklist?.addEventListener("change", (event) => {
  const checkbox = event.target.closest('input[type="checkbox"]');
  const item = checkbox?.closest("li[data-id]");
  if (!item) return;
  const checklistItem = state.bugChecklist.find((entry) => entry.id === item.dataset.id);
  if (!checklistItem) return;
  checklistItem.checked = checkbox.checked;
  saveState(false);
});

elements.bugChecklist?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.target.type !== "text") return;
  event.preventDefault();
  const item = event.target.closest("li[data-id]");
  const index = state.bugChecklist.findIndex((entry) => entry.id === item?.dataset.id);
  if (index < 0) return;
  const next = createBugChecklistItem();
  state.bugChecklist.splice(index + 1, 0, next);
  saveState(false);
  renderBugChecklist();
  focusBugChecklistItem(next.id);
});

elements.bugChecklist?.addEventListener("click", (event) => {
  const remove = event.target.closest('button[data-action="remove"]');
  const item = remove?.closest("li[data-id]");
  const index = state.bugChecklist.findIndex((entry) => entry.id === item?.dataset.id);
  if (index < 0) return;
  state.bugChecklist.splice(index, 1);
  if (!state.bugChecklist.length) state.bugChecklist.push(createBugChecklistItem());
  saveState(false);
  renderBugChecklist();
  focusBugChecklistItem(state.bugChecklist[Math.min(index, state.bugChecklist.length - 1)].id);
});

elements.debugToggle?.addEventListener("click", openBugChecklist);

document.querySelector(".brand")?.addEventListener("click", (event) => {
  event.preventDefault();
  setAppView("dashboard");
});

document.querySelector(".skip-link")?.addEventListener("click", (event) => {
  event.preventDefault();
  setAppView("workspace");
  window.requestAnimationFrame(() => elements.editor?.focus());
});

elements.dashboardBackButton?.addEventListener("click", () => {
  setAppView("dashboard");
});

elements.exploreProjectsButton?.addEventListener("click", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  elements.projectGallery?.scrollIntoView({
    block: "center",
    behavior: reduceMotion ? "auto" : "smooth",
  });
  window.requestAnimationFrame(() => {
    elements.projectGallery?.querySelector("button:not(:disabled)")?.focus({ preventScroll: true });
  });
});

elements.onboardingDialog?.addEventListener("close", () => {
  completeOnboarding();
  if (activeAppView === "dashboard") {
    window.requestAnimationFrame(() => elements.commandContinueButton?.focus());
  }
});
elements.onboardingClose?.addEventListener("click", completeOnboarding);

elements.resourceTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-resource-tab]");
  if (!button) return;
  activateResourceTab(button.getAttribute("aria-expanded") === "true" ? "" : button.dataset.resourceTab);
});

elements.toolTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tool-tab]");
  if (button) activateToolTab(button.dataset.toolTab);
});

elements.toolTabs?.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const tabs = [...elements.toolTabs.querySelectorAll("[data-tool-tab]")];
  const current = Math.max(0, tabs.indexOf(document.activeElement));
  const next = event.key === "Home"
    ? 0
    : event.key === "End"
      ? tabs.length - 1
      : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  activateToolTab(tabs[next].dataset.toolTab, { focus: true });
});

document.addEventListener("click", (event) => {
  const panel = document.querySelector("#bugChecklistPanel");
  if (!panel || panel.hidden || panel.contains(event.target) || elements.debugToggle?.contains(event.target)) return;
  closeBugChecklist();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const panel = document.querySelector("#bugChecklistPanel");
  if (!panel || panel.hidden) return;
  event.stopPropagation();
  closeBugChecklist();
  elements.debugToggle?.focus();
});

elements.formatButton?.addEventListener("click", formatIndentation);

document.addEventListener("keydown", handleShortcut);

elements.checkButton.addEventListener("click", checkAnswer);
elements.hintButton.addEventListener("click", requestHint);
elements.solutionButton.addEventListener("click", revealSolution);
elements.nextButton.addEventListener("click", moveNext);
elements.resetButton.addEventListener("click", resetProgress);

elements.missionList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-index]");
  if (button) selectMission(Number(button.dataset.index), { focusHeading: true });
});

elements.projectSelect?.addEventListener("change", (event) => {
  state.selectedProject = event.target.value;
  const target = projectMissions(state.selectedProject)
    .find((mission) => isUnlocked(missions.indexOf(mission)));
  if (target) {
    selectMission(missions.indexOf(target), { focusHeading: true });
  } else {
    saveState();
    renderProjectNavigator();
    focusMissionHeading();
  }
});

elements.projectSteps?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-mission-id]");
  if (!button) return;
  const index = missions.findIndex((mission) => mission.id === button.dataset.missionId);
  if (index >= 0) selectMission(index, { focusHeading: true });
});

elements.projectContinueButton?.addEventListener("click", () => {
  const missionId = elements.projectContinueButton.dataset.missionId;
  const index = missions.findIndex((mission) => mission.id === missionId);
  if (index >= 0) selectMission(index, { focusHeading: true });
});

elements.commandContinueButton?.addEventListener("click", () => {
  const missionId = elements.commandContinueButton.dataset.missionId;
  const index = missions.findIndex((mission) => mission.id === missionId);
  if (index >= 0) selectMission(index, { focusHeading: true });
});

document.addEventListener("keydown", (event) => {
  if (
    event.defaultPrevented
    || activeAppView !== "dashboard"
    || elements.onboardingDialog?.open
    || !event.altKey
    || event.ctrlKey
    || event.key.toLowerCase() !== "r"
    || elements.commandContinueButton?.disabled
  ) return;
  event.preventDefault();
  elements.commandContinueButton?.click();
});

elements.projectGallery?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-project-id]");
  if (!button) return;
  state.selectedProject = button.dataset.projectId;
  const index = missions.findIndex((mission) => mission.id === button.dataset.missionId);
  if (index >= 0 && isUnlocked(index)) {
    selectMission(index, { focusHeading: true });
  } else {
    saveState();
    renderMission({ silent: true });
  }
});

elements.mentorAction?.addEventListener("click", () => {
  const index = missions.findIndex((mission) => mission.id === elements.mentorAction.dataset.missionId);
  if (index >= 0) selectMission(index, { focusHeading: true });
});

document.querySelectorAll(".language-button").forEach((button) => {
  button.addEventListener("click", () => changeLanguage(button.dataset.language));
});

elements.themeToggle?.addEventListener("click", () => {
  setTheme(state.theme === "dark" ? "light" : "dark");
  saveState();
});

elements.sidebarToggle?.addEventListener("click", () => {
  if (window.matchMedia("(max-width: 760px)").matches) {
    applySidebarState(!elements.missionRail.hidden);
    return;
  }
  setSidebarCollapsed(!state.editorPrefs?.sidebarCollapsed);
});

elements.freePracticeToggle?.addEventListener("click", () => {
  setFreePractice(!state.freePractice);
});

elements.teacherToggle?.addEventListener("click", () => {
  if (elements.workspace.hidden) setAppView("workspace");
  const open = elements.teacherPanel.hidden;
  elements.teacherPanel.hidden = !open;
  elements.teacherToggle.setAttribute("aria-expanded", String(open));
  if (open) {
    renderTeacherPanel();
    window.requestAnimationFrame(() => {
      elements.teacherTitle?.scrollIntoView({ block: "start", behavior: "smooth" });
      elements.teacherTitle?.focus({ preventScroll: true });
    });
  }
});
elements.teacherStageFilter?.addEventListener("change", renderTeacherPanel);
elements.classSelect?.addEventListener("change", (event) => {
  loadClassProgress(event.target.value);
});
elements.teacherExport?.addEventListener("click", exportTeacherCsv);
elements.teacherExportJson?.addEventListener("click", exportTeacherJson);
elements.teacherCloudProgress?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-student-history]");
  if (!button) return;
  const card = button.closest(".teacher-student-card");
  const list = card?.querySelector(".student-history");
  const studentId = card?.dataset.studentId;
  if (!card || !list || !studentId) return;
  if (!list.hidden) {
    list.hidden = true;
    return;
  }
  list.hidden = false;
  list.replaceChildren();
  const loading = document.createElement("li");
  loading.textContent = t("teacherCloudLoading");
  list.append(loading);
  try {
    const attempts = await loadStudentAttemptHistory(studentId);
    list.replaceChildren();
    if (!attempts.length) {
      const empty = document.createElement("li");
      empty.textContent = t("teacherNoHistory");
      list.append(empty);
      return;
    }
    attempts.slice(0, 12).forEach((attempt) => {
      const item = document.createElement("li");
      item.className = attempt.passed === "1" || attempt.passed === 1 ? "attempt-pass" : "attempt-fail";
      item.textContent = `${attempt.created_at} · ${missionLabel(attempt.mission_id)} · ${attempt.phase} · ${attempt.feedback || "—"}`;
      list.append(item);
    });
  } catch (error) {
    list.replaceChildren();
    const item = document.createElement("li");
    item.textContent = error.message || t("teacherCloudError");
    list.append(item);
  }
});

elements.authToggle?.addEventListener("click", () => {
  const open = elements.authPanel.hidden;
  elements.authPanel.hidden = !open;
  elements.authToggle.setAttribute("aria-expanded", String(open));
  if (open) renderAccount();
});

elements.registerButton?.addEventListener("click", () => {
  cloudSession.registerMode = !cloudSession.registerMode;
  renderAccount();
  elements.authName.focus();
});

elements.authForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (cloudSession.user) return;
  const action = cloudSession.registerMode ? "register" : "login";
  try {
    const result = await cloudRequest(`api/auth.php?action=${action}`, {
      method: "POST",
      body: JSON.stringify({ name: elements.authName.value, email: elements.authEmail.value, password: elements.authPassword.value }),
    });
    cloudSession.user = result.user;
    cloudSession.csrf = result.csrf || "";
    cloudSession.registerMode = false;
    renderAccount();
    const progress = await cloudRequest("api/progress.php");
    mergeCloudProgress(progress.progress);
    await loadClasses();
    renderMission({ silent: true });
    queueCloudSync();
  } catch (error) {
    elements.authStatus.textContent = error.message;
  }
});

elements.logoutButton?.addEventListener("click", async () => {
  try {
    await cloudRequest("api/auth.php?action=logout", { method: "POST", headers: { "X-CSRF-Token": cloudSession.csrf }, body: "{}" });
  } catch {
    // La sesión local se limpia aunque el servidor ya no responda.
  }
  cloudSession = { configured: cloudSession.configured, user: null, csrf: "", syncTimer: null, registerMode: false, classes: [], classProgress: null, classProgressError: "" };
  renderAccount();
});

elements.createClassForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await cloudRequest("api/classes.php?action=create", { method: "POST", headers: { "X-CSRF-Token": cloudSession.csrf }, body: JSON.stringify({ name: elements.className.value }) });
    elements.className.value = "";
    await loadClasses();
  } catch (error) {
    elements.authStatus.textContent = error.message;
  }
});

elements.joinClassForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await cloudRequest("api/classes.php?action=join", { method: "POST", headers: { "X-CSRF-Token": cloudSession.csrf }, body: JSON.stringify({ joinCode: elements.joinCode.value }) });
    elements.joinCode.value = "";
    await loadClasses();
  } catch (error) {
    elements.authStatus.textContent = error.message;
  }
});

elements.focusToggle?.addEventListener("click", () => {
  setFocusMode(!state.editorPrefs?.focusMode);
});

document.addEventListener("fullscreenchange", syncFocusModeWithFullscreen);
document.addEventListener("webkitfullscreenchange", syncFocusModeWithFullscreen);

if (new URLSearchParams(window.location.search).get("e2e") === "1") {
  window.__JAVA_WERKSTATT_E2E__ = Object.freeze({
    officialContracts() {
      return missions.map((mission) => ({
        id: mission.id,
        stage: mission.stage,
        projectId: mission.projectId,
        checkpoint: mission.checkpoint,
        solution: mission.solution,
        localError: mission.validate(mission.solution, "es"),
        compileRequest: buildCompileRequest(mission, mission.solution),
        evaluatorRule: window.JavaWerkstattEvaluators?.rules?.[mission.id] || null,
      }));
    },
    projects() {
      return PROJECTS.map((project) => ({
        id: project.id,
        stage: project.stage,
        checkpointId: project.checkpointId,
        missionIds: projectMissions(project.id).map((mission) => mission.id),
      }));
    },
    validateMission(missionId, answer) {
      const mission = missions.find((candidate) => candidate.id === missionId);
      if (!mission) return { localError: "unknown-mission", compileRequest: null };
      return {
        localError: mission.validate(String(answer || ""), "es"),
        compileRequest: buildCompileRequest(mission, String(answer || "")),
      };
    },
  });
}

renderLiveTemplates();
renderMission();
activateToolTab("console");
setAppView(
  new URLSearchParams(window.location.search).get("workspace") === "1" ? "workspace" : "dashboard",
  { focusDashboard: false },
);
initOnboarding();
renderBugChecklist();
renderAccount();
initCloud();
