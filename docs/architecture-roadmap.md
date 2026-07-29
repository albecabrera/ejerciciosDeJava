# Roadmap de arquitectura premium

Java Werkstatt ya funciona como SPA liviana sin build, con PHP/XAMPP opcional y worker aislado. La siguiente mejora importante no es sumar más UI encima del monolito: es separar responsabilidades sin romper la instalación local.

## Estado actual

- `game.js` concentra currículo, traducciones, estado, UI, editor, diagnósticos, auth, docente, proyectos y sincronización.
- `styles.css` concentra tokens, layout, componentes, temas y responsive.
- `index.html` contiene shell semántico, paneles, dashboard, editor, docente y ayudas.
- `js/java-evaluators.js` ya está mejor aislado: contiene reglas conductuales sobre stdout real.
- `api/*` mantiene backend PHP simple y portable para XAMPP.

## Principios de evolución

1. **Sin build obligatorio:** la app debe seguir funcionando en XAMPP local copiando archivos.
2. **IDs semánticos sobre índices:** rutas, tests y migraciones deben depender de `mission.id`, no de posiciones visuales.
3. **Proyectos visibles por defecto:** la galería y el dashboard son navegación primaria, no decoración.
4. **QA antes de refactor grande:** cada extracción debe mantener `npm run test:syntax`, `npm run test:worker`, `npm run test:xampp` y `npm run test:e2e` verdes.
5. **Assets versionados manualmente:** si cambia CSS/JS visible, actualizar query strings en `index.html`.

## Extracciones recomendadas

### 1. Currículo y proyectos

Mover datos puros a módulos sin dependencias DOM:

- `js/curriculum/missions.js`
- `js/curriculum/projects.js`
- `js/curriculum/i18n.js`

Objetivo: poder revisar contenido educativo sin tocar editor ni runtime.

### 2. Estado y migraciones

Separar persistencia:

- `js/state/storage.js`
- `js/state/migrations.js`
- `js/state/cloud-sync.js`

Objetivo: que cambios de currículo no rompan progreso histórico.

### 3. Workspace/editor

Separar comportamiento de editor:

- `js/editor/editor-state.js`
- `js/editor/completion.js`
- `js/editor/diagnostics.js`
- `js/editor/shortcuts.js`

Objetivo: mejorar experiencia tipo IDE sin mezclarlo con proyectos o docente.

### 4. UI components sin framework

Crear renderizadores pequeños:

- `js/ui/command-center.js`
- `js/ui/project-navigator.js`
- `js/ui/workbench.js`
- `js/ui/mentor.js`
- `js/ui/progress.js`

Objetivo: testear y evolucionar UX premium por secciones.

### 5. CSS por capas

Dividir `styles.css` gradualmente:

- `css/00-tokens.css`
- `css/10-base.css`
- `css/20-layout.css`
- `css/30-components.css`
- `css/40-editor.css`
- `css/50-responsive.css`

Mantener `styles.css` como agregador simple con `@import` sólo si XAMPP/navegadores objetivo lo aceptan; si no, posponer división física.

## Guardrail de release local

Antes de decir que XAMPP está actualizado:

```bash
npm run test:syntax
npm run test:worker
npm run test:e2e
npm run test:xampp
```

Luego verificar visualmente una captura desktop de `http://127.0.0.1/java-werkstatt/`.

## Qué NO hacer todavía

- No introducir React/Vite/TypeScript sólo por moda: agregaría build y fricción XAMPP.
- No partir `game.js` sin tests verdes antes y después.
- No usar índices de misión en tests nuevos.
- No sumar animaciones grandes antes de mejorar estructura.
