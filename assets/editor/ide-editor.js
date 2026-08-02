import {
  EditorState,
  Compartment,
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  defaultKeymap,
  history,
  historyKeymap,
  indentOnInput,
  bracketMatching,
  foldGutter,
  foldKeymap,
  syntaxHighlighting,
  defaultHighlightStyle,
  closeBrackets,
  closeBracketsKeymap,
  autocompletion,
  completionKeymap,
  completionStatus,
  acceptCompletion,
  searchKeymap,
  highlightSelectionMatches,
  lintGutter,
  linter,
  lintKeymap,
  java,
  python,
} from "../../vendor/codemirror/cm6-bundle.js";

// Tema fino: solo tipografía/estructura. Los colores vienen de las variables
// CSS del sistema de diseño (styles.css / python.css) para que el editor
// respete el tema claro/oscuro activo sin duplicar la paleta acá.
// `watermark` es opcional: un SVG con la opacidad ya horneada en el archivo
// (background-image no admite opacidad propia), distinto por lenguaje.
function buildIdeTheme(watermark) {
  return EditorView.theme({
    "&": {
      height: "100%",
      fontSize: "0.86rem",
      backgroundColor: "var(--code-row, var(--panel))",
      color: "var(--code-text, var(--ink))",
      ...(watermark ? {
        backgroundImage: `url(${watermark})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "220px",
      } : {}),
    },
  ".cm-content": {
    fontFamily: "var(--mono)",
    caretColor: "var(--java-blue, var(--blue-soft))",
    padding: "0.85rem",
  },
  ".cm-gutters": {
    backgroundColor: "var(--code-panel, var(--panel-soft))",
    color: "var(--code-muted, var(--muted))",
    border: "none",
    fontFamily: "var(--mono)",
  },
  ".cm-activeLine": { backgroundColor: "color-mix(in srgb, var(--java-blue, var(--blue-soft)) 8%, transparent)" },
  ".cm-activeLineGutter": { backgroundColor: "color-mix(in srgb, var(--java-blue, var(--blue-soft)) 14%, transparent)" },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": { backgroundColor: "color-mix(in srgb, var(--java-blue, var(--blue-soft)) 28%, transparent) !important" },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": { fontFamily: "var(--mono)", overflow: "auto" },
  ".cm-tooltip-autocomplete": {
    border: "1px solid var(--line)",
    borderRadius: "10px",
    overflow: "hidden",
    fontFamily: "var(--mono)",
  },
  ".cm-tooltip-autocomplete ul li[aria-selected]": {
    backgroundColor: "var(--java-blue, var(--blue-soft))",
    color: "var(--button-ink, #fff)",
  },
  ".cm-diagnostic": { fontFamily: "var(--sans)" },
  });
}

function indentSnippet(snippet, indent) {
  return snippet.replace(/\n/g, `\n${indent}`);
}

function lineIndent(state, pos) {
  const line = state.doc.lineAt(pos);
  return line.text.slice(0, pos - line.from).match(/^\s*/)?.[0] || "";
}

/**
 * Convierte una lista plana { label, insert, description } (formato ya usado
 * por JAVA_COMPLETIONS / pythonCompletions) en una fuente de autocompletado
 * nativa de CodeMirror, preservando el marcador de cursor "$END$".
 */
function createCompletionSource(words) {
  return (context) => {
    const token = context.matchBefore(/[A-Za-z_][A-Za-z0-9_]*/);
    if (!context.explicit && (!token || token.from === token.to)) return null;
    const query = (token ? token.text : "").toLowerCase();
    if (!context.explicit && query.length < 2) return null;
    const from = token ? token.from : context.pos;
    const matches = words.filter((word) => (
      context.explicit ? (!query || word.label.toLowerCase().includes(query)) : word.label.toLowerCase().startsWith(query)
    ));
    if (!matches.length) return null;
    return {
      from,
      options: matches.map((word) => ({
        label: word.label,
        detail: word.description,
        type: "keyword",
        apply(view, _completion, applyFrom, applyTo) {
          const indent = lineIndent(view.state, applyFrom);
          const marker = word.insert.indexOf("$END$");
          const text = indentSnippet(word.insert.replace("$END$", ""), indent);
          const cursor = applyFrom + (marker >= 0 ? marker : text.length);
          view.dispatch({ changes: { from: applyFrom, to: applyTo, insert: text }, selection: { anchor: cursor } });
        },
      })),
      validFor: /^[A-Za-z_][A-Za-z0-9_]*$/,
    };
  };
}

const languages = { java: () => java(), python: () => python() };

/**
 * Fábrica compartida del editor de código real (CodeMirror 6) usado por
 * Java Werkstatt y Python Studio. Reemplaza el patrón textarea + <ol> de
 * números de línea + popup de autocompletado hecho a mano.
 */
export function createIdeEditor({ parent, lang, doc = "", completions = [], onChange, onSave, lintSource, ariaLabel, watermark, extraKeymap = [] }) {
  const langExtension = languages[lang]?.() ?? [];
  const completionCompartment = new Compartment();
  const tabKeymap = [{
    key: "Tab",
    run(view) {
      if (completionStatus(view.state) === "active") return acceptCompletion(view);
      view.dispatch(view.state.replaceSelection("    "));
      return true;
    },
  }];
  const saveKeymap = onSave ? [{
    key: "F5",
    run() { onSave(); return true; },
    preventDefault: true,
  }] : [];

  const extensions = [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    completionCompartment.of(autocompletion({ override: [createCompletionSource(completions)] })),
    lintGutter(),
    EditorView.contentAttributes.of(ariaLabel ? { "aria-label": ariaLabel } : {}),
    langExtension,
    buildIdeTheme(watermark),
    keymap.of([...tabKeymap, ...saveKeymap, ...extraKeymap, ...closeBracketsKeymap, ...completionKeymap, ...searchKeymap, ...historyKeymap, ...foldKeymap, ...lintKeymap, ...defaultKeymap]),
  ];
  if (lintSource) {
    extensions.push(linter((view) => lintSource(view.state.doc.toString())));
  }
  let suppressChange = false;
  if (onChange) {
    extensions.push(EditorView.updateListener.of((update) => {
      if (update.docChanged && !suppressChange) onChange(update.state.doc.toString());
    }));
  }

  const view = new EditorView({ state: EditorState.create({ doc, extensions }), parent });

  return {
    view,
    getValue: () => view.state.doc.toString(),
    setValue(value) {
      suppressChange = true;
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value }, selection: { anchor: Math.min(value.length, view.state.doc.length) } });
      suppressChange = false;
    },
    focus: () => view.focus(),
    focusEnd() {
      const end = view.state.doc.length;
      view.dispatch({ selection: { anchor: end } });
      view.focus();
    },
    setCompletions(newCompletions) {
      view.dispatch({ effects: completionCompartment.reconfigure(autocompletion({ override: [createCompletionSource(newCompletions)] })) });
    },
  };
}
