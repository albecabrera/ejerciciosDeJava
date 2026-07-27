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
      cases: [{ stdoutIncludes: ["permit", "true"], any: true }],
      feedback: {
        es: "Además de compilar, la condición debe producir una señal visible de acceso permitido.",
        de: "Zusätzlich zur Kompilierung soll die Bedingung sichtbar erlaubten Zugriff zeigen.",
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
    arrays: {
      run: true,
      cases: [{ stdoutIncludes: ["15"] }],
      feedback: {
        es: "La suma del array de referencia debe producir 15.",
        de: "Die Summe des Referenz-Arrays soll 15 ergeben.",
      },
    },
  };

  function normalize(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function evaluate(missionId, compilerResult, language = "es") {
    const rule = rules[missionId];
    if (!rule || !rule.run || compilerResult?.phase !== "run" || !compilerResult.ok) {
      return { passed: true, message: "" };
    }
    const stdout = normalize(compilerResult.stdout);
    const passed = rule.cases.every((testCase) => {
      const expected = testCase.stdoutIncludes || [];
      return testCase.any
        ? expected.some((item) => stdout.includes(normalize(item)))
        : expected.every((item) => stdout.includes(normalize(item)));
    });
    return { passed, message: passed ? "" : (rule.feedback?.[language] || rule.feedback?.es || "La salida no coincide con lo esperado.") };
  }

  window.JavaWerkstattEvaluators = { rules, evaluate };
}());
