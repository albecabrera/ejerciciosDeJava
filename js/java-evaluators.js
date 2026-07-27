(function () {
  const rules = {
    types: {
      run: true,
      cases: [{ stdoutIncludes: ["Mara", "27"] }],
      feedback: {
        es: "El programa debe imprimir el nombre Mara y la edad 27.",
        de: "Das Programm soll den Namen Mara und das Alter 27 ausgeben.",
      },
    },
    condition: {
      run: true,
      cases: [{ stdoutEquals: "Access granted" }],
      feedback: {
        es: 'La ejecución debe producir exactamente "Access granted".',
        de: 'Die Ausführung muss genau „Access granted“ ausgeben.',
      },
    },
    loop: {
      run: true,
      cases: [{ stdoutIncludes: ["Mara", "Noah", "Lina"] }],
      feedback: {
        es: "El bucle debe recorrer e imprimir los nombres del array.",
        de: "Die Schleife soll die Namen des Arrays durchlaufen und ausgeben.",
      },
    },
    method: {
      run: true,
      cases: [{ stdoutEquals: "11" }],
      feedback: {
        es: "add(4, 7) debe producir exactamente 11.",
        de: "add(4, 7) muss genau 11 ergeben.",
      },
    },
    arrays: {
      run: true,
      cases: [{ stdoutEquals: "34" }],
      feedback: {
        es: "La suma de 8, 10, 7 y 9 debe producir exactamente 34.",
        de: "Die Summe aus 8, 10, 7 und 9 muss genau 34 ergeben.",
      },
    },
    list: {
      run: true,
      cases: [{ stdoutEquals: "2" }],
      feedback: {
        es: "La lista de referencia debe contener exactamente dos tareas.",
        de: "Die Referenzliste muss genau zwei Aufgaben enthalten.",
      },
    },
    strings: {
      run: true,
      cases: [{ stdoutEquals: "4" }],
      feedback: {
        es: "El texto recortado y convertido a MARA debe tener longitud 4.",
        de: "Der getrimmte Text MARA muss die Länge 4 haben.",
      },
    },
    "while-input": {
      run: true,
      cases: [{ stdoutEquals: "3\n2\n1" }],
      feedback: {
        es: "La cuenta regresiva debe imprimir exactamente 3, 2 y 1.",
        de: "Der Countdown muss genau 3, 2 und 1 ausgeben.",
      },
    },
    stack: {
      run: true,
      cases: [{ stdoutEquals: "type A" }],
      feedback: {
        es: "La pila debe recuperar exactamente la última acción: type A.",
        de: "Der Stack muss genau die letzte Aktion liefern: type A.",
      },
    },
    queue: {
      run: true,
      cases: [{ stdoutEquals: "report.pdf" }],
      feedback: {
        es: "La cola debe atender exactamente report.pdf.",
        de: "Die Queue muss genau report.pdf bearbeiten.",
      },
    },
    "linked-list": {
      run: true,
      cases: [{ stdoutEquals: "[Overture]" }],
      feedback: {
        es: "La secuencia final debe contener únicamente Overture.",
        de: "Die finale Sequenz darf nur Overture enthalten.",
      },
    },
    efficiency: {
      run: true,
      cases: [{ stdoutEquals: "binary" }],
      feedback: {
        es: "Con datos ordenados, la decisión visible debe ser binary.",
        de: "Bei sortierten Daten muss die sichtbare Entscheidung binary sein.",
      },
    },
    "von-neumann": {
      run: true,
      cases: [{ stdoutEquals: "FETCH\nDECODE\nEXECUTE\nSTORE" }],
      feedback: {
        es: "El ciclo debe emitir las cuatro fases en orden.",
        de: "Der Zyklus muss die vier Phasen in dieser Reihenfolge ausgeben.",
      },
    },
    "hash-map": {
      run: true,
      cases: [{ stdoutIncludes: ["java=2", "oop=1"] }],
      feedback: {
        es: "La tabla debe contar java dos veces y oop una vez.",
        de: "Die Tabelle muss java zweimal und oop einmal zählen.",
      },
    },
    "guessing-game": {
      run: true,
      cases: [{ stdoutEquals: "too low" }],
      feedback: {
        es: "El juego debe indicar exactamente too low para guess=5 y secret=7.",
        de: "Das Spiel muss für guess=5 und secret=7 genau too low ausgeben.",
      },
    },
    "score-level": {
      run: true,
      cases: [{ stdoutEquals: "LEVEL_UP" }],
      feedback: {
        es: "Con 1200 puntos, el badge visible debe ser exactamente LEVEL_UP.",
        de: "Bei 1200 Punkten muss das sichtbare Badge genau LEVEL_UP sein.",
      },
    },
    "dice-duel": {
      run: true,
      cases: [{ stdoutEquals: "Noah wins" }],
      feedback: {
        es: "El duelo debe imprimir exactamente Noah wins para 4 contra 6.",
        de: "Das Duell muss bei 4 gegen 6 genau Noah wins ausgeben.",
      },
    },
    "snake-step": {
      run: true,
      cases: [{ stdoutEquals: "3,2" }],
      feedback: {
        es: "La ficha debe moverse a la derecha y emitir exactamente 3,2.",
        de: "Die Figur muss nach rechts laufen und genau 3,2 ausgeben.",
      },
    },
    "exception-parse": {
      run: true,
      cases: [{ stdoutEquals: "42" }],
      feedback: {
        es: "Con input=42, el parseo seguro debe imprimir exactamente 42.",
        de: "Bei input=42 muss das sichere Parsing genau 42 ausgeben.",
      },
    },
    "stream-filter": {
      run: true,
      cases: [{ stdoutEquals: "3" }],
      feedback: {
        es: "Los tres nombres contienen a al normalizar a minúsculas; la salida debe ser 3.",
        de: "Alle drei Namen enthalten nach Kleinschreibung a; die Ausgabe muss 3 sein.",
      },
    },
    "combo-counter": {
      run: true,
      cases: [{ stdoutEquals: "3" }],
      feedback: {
        es: "La racha más larga de hits debe ser exactamente 3.",
        de: "Die längste Treffer-Serie muss genau 3 sein.",
      },
    },
    "project-mensa-terminal": {
      run: true,
      cases: [{
        stdoutEquals: "CASE=1\nTOTAL_CENTS=1020\nDISCOUNT_CENTS=102\nDUE_CENTS=918\nCASE=2\nTOTAL_CENTS=500\nDISCOUNT_CENTS=100\nDUE_CENTS=400",
      }],
      feedback: {
        es: "La terminal debe calcular y emitir las tres líneas exactas de total, descuento e importe.",
        de: "Das Terminal muss die drei exakten Zeilen für Summe, Rabatt und Zahlbetrag berechnen und ausgeben.",
      },
    },
    "project-habit-tracker": {
      run: true,
      cases: [{ stdoutEquals: "WEEK=1\nSUMMARY=3/5\nWEEK=2\nSUMMARY=2/3" }],
      feedback: {
        es: "El tracker debe calcular los dos resúmenes semanales desde los arrays recibidos.",
        de: "Der Tracker muss beide Wochenzusammenfassungen aus den erhaltenen Arrays berechnen.",
      },
    },
    "project-school-library": {
      run: true,
      cases: [{
        stdoutEquals: "CASE=1\nBOOKS=3\nNEXT=Lina:Java\nUNDO=Java\nCASE=2\nBOOKS=4\nNEXT=Mika:Networks\nUNDO=Networks",
      }],
      feedback: {
        es: "La biblioteca debe demostrar colección, cola y deshacer con las tres líneas exactas.",
        de: "Die Bibliothek muss Sammlung, Warteschlange und Rückgängig-Funktion mit drei exakten Zeilen zeigen.",
      },
    },
    "project-safe-chat": {
      run: true,
      cases: [{
        stdoutEquals: "CASE=1\nACCEPTED=2\nREJECTED=1\nSENDERS=[ALICE, BOB]\nCASE=2\nACCEPTED=2\nREJECTED=2\nSENDERS=[ALICE, BOB]",
      }],
      feedback: {
        es: "El chat debe aceptar dos mensajes, rechazar uno y listar solo los remitentes permitidos.",
        de: "Der Chat muss zwei Nachrichten annehmen, eine ablehnen und nur erlaubte Absender ausgeben.",
      },
    },
    "project-snake-arena": {
      run: true,
      cases: [{ stdoutEquals: "CASE=1\nRESULT=2,1\nCASE=2\nRESULT=BLOCKED" }],
      feedback: {
        es: "Snake Arena debe mover la ficha en el primer tablero y bloquearla ante el obstáculo del segundo.",
        de: "Snake Arena muss die Figur im ersten Brett bewegen und sie am Hindernis des zweiten blockieren.",
      },
    },
  };

  function normalizeIncludes(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function normalizeStdout(value) {
    return String(value ?? "")
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((line) => line.replace(/[ \t]+$/g, ""))
      .join("\n")
      .trim();
  }

  function evaluate(missionId, compilerResult, language = "es") {
    const rule = rules[missionId];
    if (compilerResult?.phase !== "run" || !compilerResult.ok) {
      return { passed: true, message: "" };
    }
    if (!rule?.run) {
      return {
        passed: false,
        message: language === "de"
          ? "Ausführbare Mission ohne Runtime-Vertrag. Die Abgabe kann nicht akzeptiert werden."
          : "Misión ejecutable sin contrato runtime. No se puede aceptar la entrega.",
      };
    }
    const stdout = normalizeIncludes(compilerResult.stdout);
    const passed = rule.cases.every((testCase) => {
      if (Object.prototype.hasOwnProperty.call(testCase, "stdoutEquals")) {
        const expectedExact = Array.isArray(testCase.stdoutEquals)
          ? testCase.stdoutEquals
          : [testCase.stdoutEquals];
        return expectedExact.some((item) => normalizeStdout(compilerResult.stdout) === normalizeStdout(item));
      }
      const expected = testCase.stdoutIncludes || [];
      return testCase.any
        ? expected.some((item) => stdout.includes(normalizeIncludes(item)))
        : expected.every((item) => stdout.includes(normalizeIncludes(item)));
    });
    return { passed, message: passed ? "" : (rule.feedback?.[language] || rule.feedback?.es || "La salida no coincide con lo esperado.") };
  }

  window.JavaWerkstattEvaluators = { rules, evaluate, normalizeStdout };
}());
