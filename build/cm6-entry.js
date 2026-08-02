// Punto de entrada para vendorizar CodeMirror 6 como un único bundle ESM estático.
// No forma parte del runtime servido: se compila una vez con `npm run build:editor`
// y el artefacto resultante (vendor/codemirror/cm6-bundle.js) es lo que se sirve.
export { EditorState, Compartment } from "@codemirror/state";
export {
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
  placeholder,
  Decoration,
  ViewPlugin,
} from "@codemirror/view";
export {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
  indentMore,
  indentLess,
  insertNewlineAndIndent,
  cursorLineBoundaryBackward,
} from "@codemirror/commands";
export {
  indentOnInput,
  indentUnit,
  bracketMatching,
  foldGutter,
  foldKeymap,
  syntaxHighlighting,
  defaultHighlightStyle,
  StreamLanguage,
} from "@codemirror/language";
export {
  closeBrackets,
  closeBracketsKeymap,
  autocompletion,
  completionKeymap,
  startCompletion,
  acceptCompletion,
  completionStatus,
} from "@codemirror/autocomplete";
export { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
export { lintGutter, linter, setDiagnostics, lintKeymap } from "@codemirror/lint";
export { java } from "@codemirror/lang-java";
export { python } from "@codemirror/lang-python";
export { tags } from "@lezer/highlight";
