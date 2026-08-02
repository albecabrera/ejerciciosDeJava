# Java Werkstatt

Laboratorio bilingüe (ES/DE) para practicar fundamentos de informática mediante Java. El frontend sigue siendo liviano y dependency-free; opcionalmente puede conectarse a un backend PHP local para compilar con el `javac` instalado.

## Ejecutar

Desde la raíz del proyecto:

Frontend local sin compilador real:

```bash
python3 -m http.server 8000
```

Modo recomendado con compilación real vía PHP:

```bash
php -S 127.0.0.1:8000 -t .
```

### XAMPP local

1. Copiá el proyecto a `xampp/htdocs/java-werkstatt`.
2. Iniciá **Apache** y **MySQL** desde el panel de XAMPP.
3. En phpMyAdmin, ejecutá `database/schema.sql`. Si actualizás una instalación existente, hacé primero una copia de seguridad y volvé a aplicar el schema: incluye la migración compatible para clases archivables, tareas, entregas, rúbricas y notificaciones.
4. Copiá `config/config.example.php` como `config/config.php` y ajustá el DSN y las credenciales.
5. Creá el primer docente desde una terminal:

```bash
php tools/create-teacher.php "Nombre Docente" docente@example.com "una-clave-segura"
```

6. Abrí `http://localhost/java-werkstatt/`. No uses `python3 -m http.server` si querés login, clases, persistencia o compilación real.

### Docker XAMPP local

En tu stack `xampp-docker`, la app queda montada en `~/xampp-data/htdocs/java-werkstatt` y aparece en el panel de `http://localhost:8080/` como sitio PHP. El frontend se abre desde `http://localhost/java-werkstatt/`; el puerto `8080` es el panel, no el Apache que sirve los sitios. La base `java_werkstatt` usa el host interno `mariadb`.

Para activar la compilación real dentro del contenedor PHP, instalá el JDK una vez:

```bash
tools/install-xampp-jdk.sh xampp-php
```

Si usás otro contenedor o servidor, instalá un JDK y configurá `JAVAC_BIN` o `config/config.php` → `compiler.javac`.

Para producción: HTTPS obligatorio, `session_secure=true`, credenciales fuera del repositorio y usuario MySQL con permisos mínimos.

Abrí `http://localhost:8000`. También puede abrirse `index.html` directamente, aunque un servidor local evita restricciones particulares de algunos navegadores.

## Qué incluye

- **49 misiones:** EF (17), Q1 (16) y Q2 (16). La ruta suma práctica de lógica de juego, ranking y proyectos verificables.
- **Cinco proyectos monofichero y deterministas:** Terminal de Mensa (arrays/bucles/cálculo), Biblioteca escolar (List/Queue/Deque/parsing), Chat seguro del campus (parser, lenguaje regular, Set y minimización de datos), Habit Tracker (proyecto inicial) y Snake Arena (reto avanzado). El alumno implementa un método reutilizable y un harness visible lo ejecuta con dos fixtures distintos.
- **Práctica inspirada en juegos reales:** Combo Counter introduce estado y rachas; Leaderboard ordena puntajes de forma descendente; Habit Tracker convierte eventos en una métrica semanal; Snake Arena implementa el núcleo de movimiento, límites y obstáculos de una grilla.
- **Rutas de proyecto aditivas:** cada misión conserva su ID histórico y suma `projectId`, orden, checkpoint, entregable y evidencia; el modo libre permite abrir cualquier proyecto y cualquier misión.
- **Bienvenida y dashboard separados del workspace:** la portada explica el flujo en tres pasos, ofrece abrir/reanudar la misión con `Alt+R` y permite explorar proyectos; al entrar deja paso a un área de trabajo enfocada, con una acción clara para volver.
- **Dashboards por rol:** el alumnado ve prioridad, tareas y feedback pendiente; docentes/admin ven entregas por revisar, tareas y actividad de la clase. Sin sesión, la interfaz explica el estado offline en vez de fingir datos compartidos.
- **Onboarding de primera visita:** una introducción breve y persistente presenta el flujo sin volver a interrumpir al alumno después de cerrarla.
- **Apertura no bloqueante:** un splash vectorial breve identifica Java Werkstatt, ofrece salto manual y se cierra automáticamente; con `prefers-reduced-motion` elimina animaciones y reduce la espera.
- Recorrido razonable por sintaxis, tipos, control, métodos, arrays/Strings, POO/UML, herencia, polimorfismo, colecciones, List/Stack/Queue, recursión, búsqueda, ordenamiento, eficiencia, BST, grafos, autómatas, gramáticas, SQL, normalización, redes, cifrado educativo, privacidad, Von Neumann y límites de la computación.
- Los contenidos no-Java se trabajan como simulaciones, modelos, cadenas o comentarios Java; no se finge una base de datos, red, CPU o autómata real.
- Popup de completado para Live Templates y términos contextuales, accesible como `listbox`.
- Diagnósticos locales con debounce para pares, strings/comentarios, mezcla de tabs/espacios, indentación por llaves y puntos y coma simples.
- **Preparación y debugging visibles:** los videos se asignan únicamente cuando hay una correspondencia temática explícita y verificada; los temas sin recurso alemán adecuado no muestran video. El botón de escarabajo abre una checklist persistente directamente en la barra superior.
- Formateador de indentación a cuatro espacios.
- Progreso local con XP, intentos, aciertos, pistas, soluciones, competencias, campos, avance por etapa y una estimación de dominio cuya fórmula se muestra en pantalla.
- **Historial personal local:** conserva los últimos 100 intentos y muestra fecha, misión y resultado sin requerir cuenta ni enviar telemetría.
- **Mentor y dificultad adaptivos:** recomiendan la siguiente práctica y el ritmo adecuado según progreso, intentos fallidos, pistas usadas y proyecto activo.
- **Accesibilidad operativa:** escala tipográfica persistente (100/112/125 %), foco visible, navegación rápida anterior/siguiente y recorrido de misiones con flechas, Inicio y Fin.
- Temas claro/oscuro, diseño responsive, navegación por teclado y respeto por `prefers-reduced-motion`. La interfaz enfatiza checkpoints de proyecto, transiciones sutiles y jerarquía visual sin sacrificar foco ni contraste.
- **Modo de práctica libre:** podés abrir cualquier misión sin resolver la anterior; el recorrido secuencial sigue disponible como modo guiado.
- Autocierre de `""`, `''`, `()`, `[]` y `{}` con el cursor dentro; si el cierre ya existe, el editor lo salta.
- Consola educativa dentro del IDE: F5 muestra comandos reales, diagnósticos por línea y salida stdout/stderr solo si el programa imprime con `System.out.print(...)`, `System.out.println(...)` o `System.out.printf(...)`. Las misiones ejecutables obligan al alumno a escribir también la impresión cuando el resultado debe observarse.
- **Validación enfocada:** el estado del pipeline conserva toda la información accesible, pero se resume junto al editor en vez de competir con la tarea principal.
- **Recursos progresivos:** Tutorial, Documentación y Pistas/Solución permanecen cerrados hasta que el alumno los pide.
- **Workspace estilo IntelliJ:** árbol Project, pestañas de archivos recientes, Tool Windows de Consola/Problemas/Progreso/Feedback, paleta de acciones, Go To, configuración de ejecución y acciones de contexto con `Alt+Enter`.
- **Scaffold de archivo completo:** el editor muestra el contexto Java de solo lectura, una consigna ES/DE como comentario y numeración continua alrededor del área editable. Ese scaffold es visual y no altera el texto que se evalúa o compila.
- **Feedback por misión:** la Tool Window incluye comentarios con autor, rol, fecha y estado abierto/resuelto. Con sesión y clase seleccionada usa PHP/MySQL para compartirlos: el alumnado publica, docentes/admin responden y moderan, y cada autor puede resolver su comentario. Sin sesión, clase o backend disponible conserva un fallback explícitamente local en `localStorage`; nunca presenta ese fallback como sincronizado.
- Documentación contextual por misión, con enlaces directos a `dev.java` y Oracle Java Tutorials/API, disponible bajo demanda.
- Live Templates y atajos IDEA en paneles desplegables para priorizar el editor y reducir ruido visual.
- **Compilación y ejecución real opcional:** al pulsar F5, `api/compile.php` compila con `javac` y ejecuta con `java` cuando la misión lo exige o cuando el código contiene una impresión de consola. La salida se recorta y corre con timeout/límites; con sandbox Docker/worker se ejecuta sin red y con límites CPU/RAM/PID.
- **Panel docente local y centralizado:** resumen de misiones, intentos, precisión, pendientes, vista por alumno, historial de intentos, recomendación automática y exportación CSV/JSON.
- **Ciclo académico compartido:** docentes crean y archivan tareas por clase; el alumnado entrega versiones sucesivas del código; docentes revisan con rúbrica de funcionalidad, legibilidad, concepto y explicación, más feedback escrito. Las notificaciones informan los cambios relevantes.
- **Cuentas y clases centralizadas:** sesiones PHP para estudiantes/docentes/admin, clases con código regenerable, archivo de clase, expulsión de miembros y progreso sincronizado por usuario en MySQL con métricas monotónicas para evitar regresiones accidentales.
- **Privacidad de cuenta:** cada usuario autenticado puede exportar sus datos y solicitar su eliminación con contraseña y confirmación explícita; la última cuenta administradora queda protegida.

## Atajos

| Atajo | Acción |
|---|---|
| `F5` | Comprobar la misión |
| `Ctrl/Cmd + Shift + A` | Buscar una acción |
| `Ctrl/Cmd + N` | Ir a una misión, clase o archivo |
| `Ctrl/Cmd + 1` | Enfocar la ventana Project |
| `Ctrl + Alt + 1–4` | Enfocar Tool Windows |
| `Ctrl/Cmd + Space` | Abrir completado |
| `↑` / `↓`, `Tab` / `Enter`, `Escape` | Navegar, aceptar o cerrar completado |
| `Tab` | Expandir Live Template o insertar cuatro espacios |
| `Alt + Enter` | Abrir acciones de contexto: quick fix, formato o pista |
| `Ctrl/Cmd + /` | Comentar/descomentar |
| `Ctrl/Cmd + D` o `Alt + Shift + ↓` | Duplicar línea/selección |
| `Alt + ↑/↓` | Mover línea/selección |
| `Ctrl/Cmd + L` | Limpiar el editor |
| `Ctrl/Cmd + ←/→` | Misión anterior/siguiente disponible |
| `Escape` | Cerrar popup/feedback, salir de enfoque o volver al editor |

## Preparación, diagnóstico y apariencia

Antes de resolver una misión, la tarjeta de preparación muestra solo un video en alemán cuya misión está asignada de forma explícita. Al pulsar una sola vez **«Vorbereitung abspielen»** o la previsualización, el reproductor se abre y comienza; la miniatura se carga primero para no depender de iframes externos durante el primer render. Cuando no existe un recurso alemán verificado para el tema, la tarjeta se oculta en lugar de mostrar un video aproximado.

El botón **Bugs** despliega una checklist persistente junto a la navegación: escribí un cambio y pulsá `Enter` para crear otra casilla. En el editor, los errores aparecen subrayados y al pasar el cursor sobre la línea se muestra una explicación. Estos avisos orientan el aprendizaje: la validación definitiva, cuando está disponible, la realiza `javac` mediante F5.

La interfaz adopta un **workspace inspirado en IntelliJ IDEA**. En modo oscuro, el editor usa los tokens Atom One Dark transcritos del archivo privado `Atom_One_Dark.icls` exportado por el usuario: base `#282C34`, gutter `#303845`, fila activa `#2C323C`, selección `#3E4451`, texto `#ABB2BF` y acentos azul/verde/púrpura/rojo/amarillo. Se usa JetBrains Mono con ligaduras y `line-height: 1.4`. El `.icls` completo no se copia ni se publica en el repositorio.

El alcance IDEA es deliberadamente honesto: Project, pestañas, búsqueda de acciones, Go To, run configurations, Tool Windows y quick fixes educativos son funcionales, pero el editor sigue siendo un `textarea` sin PSI, Java Language Server, refactoring semántico, debugger, terminal ni Git integrado. Estas superficies enseñan el flujo de una IDE; no afirman reemplazar IntelliJ IDEA.

La portada incorpora una firma Java SVG inline —taza, vapor y monograma `J_`— con halo y brillo controlados, baja opacidad, sin imagen pesada ni interacción. Portada y workspace son vistas separadas; dentro de la misión se priorizan tarea, editor y validación. Recursos y herramientas se revelan de forma progresiva. Los modos claro y oscuro conservan contraste, foco de teclado y `prefers-reduced-motion`.

La imagen aportada por el usuario, `src/IMG_0198.JPG`, se presenta como cover semántica de la bienvenida con `object-fit: cover`, texto ES/DE y overlays de contraste coordinados con el editor. Los patrones IntelliJ empleados son públicos y generales —tool windows, tabs, status bars, acciones compactas y pistas de teclado—; la app no accede, copia ni afirma disponer de configuraciones privadas de ninguna cuenta.

## Documentación contextual

La tarjeta **¿Querés profundizar?** / **Möchtest du tiefer einsteigen?** selecciona recursos oficiales según el concepto de la misión. Incluye sintaxis, ejemplos y referencia API desde:

- [dev.java Learn](https://dev.java/learn/)
- [Oracle Java Tutorials](https://docs.oracle.com/javase/tutorial/)
- [Java SE API](https://docs.oracle.com/en/java/javase/21/docs/api/index.html)

Los enlaces abren una pestaña nueva. La app no scrapea ni copia el contenido: solo ofrece el acceso a la fuente.

## Arquitectura

- `index.html`: shell SPA y semántica accesible.
- `styles.css`: tokens IntelliJ/Atom One Dark, dashboard/workspace separados, scaffold de editor, feedback, layouts responsive, debugging, diagnósticos y progreso.
- `game.js`: catálogo curricular, dashboards por rol, tareas/entregas/notificaciones, scaffold visual no evaluado, feedback, árbol Project, pestañas, acciones IDEA, traducciones, validadores, editor, diagnósticos y persistencia.
- `js/java-evaluators.js`: contratos conductuales sobre stdout real; soporta inclusión compatible (`stdoutIncludes`) e igualdad normalizada (`stdoutEquals`).
- `api/compile.php`: endpoint PHP sin framework que valida tamaño/nombre/modo, compila en temporal, ejecuta snippets/clases con límites y devuelve diagnósticos/salida JSON.
- `api/auth.php`: registro, login, logout, sesiones y roles student/teacher/admin.
- `api/classes.php`: creación/unión, archivo, regeneración de código, expulsión de miembros y progreso de clase con permisos de docente/admin.
- `api/progress.php`: sincronización centralizada del progreso con upsert transaccional, allowlist de misiones y contadores monotónicos.
- `api/attempts.php`: historial de intentos por alumno para docentes: fase, resultado, feedback, duración y extracto de respuesta.
- `api/feedback.php`: comentarios de misión por clase con sesión, CSRF y permisos comprobados en servidor; evita acceso entre clases, respuestas de alumnos y moderación no autorizada.
- `api/assignments.php`: listado, creación y archivo de tareas dentro de una clase autorizada.
- `api/submissions.php`: entregas versionadas y revisión docente con rúbrica y comentario.
- `api/notifications.php`: bandeja por usuario y marcado de lectura.
- `api/account.php`: exportación de datos y eliminación autenticada de cuenta.
- `api/bootstrap.php`: PDO, sesión HttpOnly/SameSite, respuestas JSON y protección CSRF.
- `database/schema.sql`: esquema y migración MySQL/MariaDB para usuarios, clases, miembros, progreso, feedback, tareas, entregas, rúbricas y notificaciones.
- `config/config.example.php`: configuración portable para XAMPP y servidor; `config/config.php` nunca se versiona.
- `tests/java-werkstatt.spec.js`: pruebas Playwright de UI, roles, estado online/offline, tareas, Project/Go To/paleta/quick fixes/run configuration, rutas contiguas, responsive, API, migraciones, proyectos y contratos Java positivos/adversariales.
- `playwright.config.js`: ejecuta los tests contra el servidor PHP integrado.
- `tools/xampp-smoke.mjs`: smoke test no destructivo para XAMPP; comprueba assets, superficies de plataforma, guardas de autenticación de las nuevas APIs y compilación por API.
- `tools/cloud-workflow-smoke.mjs`: contrato multiusuario local sin dependencias externas; usa sesiones/cookies separadas, crea fixtures únicos y verifica el flujo docente→clase→tarea→dos entregas→rúbrica→notificación→exportación antes de limpiar clase y cuentas en `finally`.
- `docs/architecture-roadmap.md`: plan de modularización sin romper XAMPP ni exigir build.
- Con PHP activo, F5 usa `javac` real y ejecuta solo cuando hay salida esperable; sin `System.out.print/println/printf` la consola avisa que no hay resultado visible. Sin PHP, vuelve a validación local y lo comunica.
- `localStorage`: progreso, preferencias y feedback offline por misión en estado v3. El feedback compartido de una clase se consulta desde MySQL y no se copia al caché persistente del navegador. Persiste `currentMissionId` estable; al migrar v2/legacy traduce el índice con el orden histórico de 36 misiones anterior a los capstones.

`localStorage` queda como caché offline y fallback del aprendizaje individual; tareas, entregas, rúbricas, notificaciones y administración de clases requieren sesión y MySQL. Con una sesión activa, `api/progress.php` sincroniza las 49 misiones. El registro público siempre crea estudiantes: los docentes se crean por CLI o por un flujo administrativo.

El frontend no usa Monaco ni CodeMirror. Playwright es una dependencia exclusiva de testing; PHP no requiere framework.

La hoja de ruta técnica está en [`docs/architecture-roadmap.md`](docs/architecture-roadmap.md). La regla principal: primero QA verde y compatibilidad XAMPP; después extracción gradual de módulos.

### Checks y tests

Instalá las dependencias de desarrollo una vez:

```bash
npm install
npx playwright install chromium
```

Después ejecutá, sin necesidad de build:

```bash
npm run test:syntax
npm run test:worker
npm run test:xampp
npm run test:cloud
npm run test:e2e
```

`test:e2e` cubre **56 contratos de producto**. Incluye splash accesible y seguro para reduced motion, cover bilingüe y responsive, bienvenida, onboarding, reanudación, dashboard→workspace, superficies separadas para alumno/docente, copy backend disponible/offline, tareas sin sesión, numeración contigua de rutas, Project, paleta de acciones, Go To, run configuration y quick fixes. También conserva cobertura sobre recursos, Tool Windows ES/DE, sidebar móvil, videos, checklist, diagnósticos y ausencia de overflow. El contrato oficial obtiene los 49 casos desde una API encapsulada que solo existe bajo `?e2e=1`, exige una regla para las misiones ejecutables, prueba salidas incorrectas y compila en paralelo con concurrencia limitada. Los cinco cheats verificados de capstone también deben ser rechazados. Los tests que compilan requieren PHP y un JDK/worker disponible según la configuración del sandbox.

`test:xampp` espera por defecto `http://127.0.0.1/java-werkstatt/`. Podés cambiarlo con:

```bash
JAVA_WERKSTATT_XAMPP_URL="http://localhost/java-werkstatt/" npm run test:xampp
```

`test:cloud` es destructivo **solo sobre sus fixtures únicos** y necesita que el servidor y `config/config.php` apunten a la misma base local con `database/schema.sql` actualizado. Por defecto usa `http://127.0.0.1:8000/`; configurá otra instalación local así:

```bash
JAVA_WERKSTATT_CLOUD_URL="http://localhost/java-werkstatt/" npm run test:cloud
```

El smoke no imprime emails, contraseñas, cookies, CSRF ni códigos de unión. Si PHP/DB no están disponibles termina con `cloud-smoke-unavailable` y código 2; un fallo de contrato usa `cloud-smoke-failed` y código 1. La limpieza directa por PDO se ejecuta incluso después de un fallo intermedio.

## Currículo NRW GOSt

El **Kernlehrplan (KLP) Informatik für die gymnasiale Oberstufe** es el marco oficial vinculante. Java Werkstatt toma como referencia sus procesos de competencia —Argumentieren (A), Modellieren (M), Implementieren (I), Darstellen und Interpretieren (D), Kommunizieren und Kooperieren (K)— y sus campos de contenido.

El **Schulinterner Lehrplan (SiLP)** consultado aporta una secuencia orientativa EF/Q1/Q2; no es correcto presentarlo como una secuencia universal obligatoria para todos los centros. La documentación de los exámenes centrales se usa como contexto adicional.

La aplicación ofrece una cobertura práctica y razonable, pero **NO afirma cubrir literalmente todo el currículo, no reemplaza el KLP, un SiLP escolar, la docencia ni la preparación oficial de examen**.

Como inspiración complementaria para secuencias y ejercicios se referencia la [playlist aportada para el proyecto](https://www.youtube.com/playlist?list=PLO-P6W97sI0Q-o0oZy8NeUgi0s5WKK8IV). Es material de apoyo: **no sustituye ni amplía por sí sola la cobertura oficial del KLP NRW**.

Fuentes:

- [KLP GOSt Informatik (oficial y vinculante)](https://lehrplannavigator.nrw.de/system/files/media/document/file/klp_gost_informatik.pdf)
- [Ejemplo de SiLP GOSt Informatik (secuencia orientativa)](https://lehrplannavigator.nrw.de/system/files/media/document/file/silp_gost_if.pdf)
- [Documentación Zentralabitur Informatik GK/LK](https://lehrplannavigator.nrw.de/system/files/media/document/file/dokumentation_za-if_gk-lk_ab_2018_2021_12_22.pdf)

## Compilación y seguridad

`api/compile.php` acepta únicamente `POST` JSON, limita el código a 48 KB, aplica rate limiting por sesión/IP, rechaza nombres de archivo inseguros, usa `-proc:none`, fuerza un locale estable, impone timeouts, recorta salida y elimina artefactos temporales. Los snippets se envuelven en una clase educativa; las clases y métodos se compilan en sus respectivos modos.

El modo `jvm` **no es un sandbox de producción** y solo debe habilitarse explícitamente para desarrollo local. Para un aula multiusuario configurá `worker` o `docker`. Si ese sandbox elegido no está disponible, el endpoint falla con error `503/504`: **no cae silenciosamente a JVM local**.


### Ejecución Java y sandbox

La plantilla local conserva `compiler.sandbox = "jvm"` para desarrollo XAMPP y ejecuta con límites prácticos (`-Xmx64m`, timeout, salida recortada), pero NO aísla red ni syscalls. Antes de publicar, cambiala obligatoriamente a `worker` o `docker`.

Para un servidor de aula más serio, configurá:

```php
'compiler' => [
    'javac' => 'javac',
    'java' => 'java',
    'sandbox' => 'docker',
    'docker_image' => 'eclipse-temurin:21-jre',
],
```

En modo Docker, el runner usa `docker run --rm --network none --cpus 0.5 --memory 96m --pids-limit 80 --read-only --cap-drop ALL --security-opt no-new-privileges`. Para que esto funcione, el proceso PHP debe poder ejecutar Docker o acceder a un worker que lo haga; un XAMPP clásico normalmente no expone el socket Docker dentro del contenedor PHP.

### Python Studio: ejecución segura y clase

Python Studio ejecuta programas mediante `api/python.php` exclusivamente en Docker. El contenedor usa Python 3.12 aislado, sin red, con filesystem de solo lectura, límite de CPU, RAM, PIDs, salida y tiempo. Si Docker no está disponible, la app conserva el editor, las pistas y la comprobación estructural local, pero **no** habilita una ejecución PHP/local insegura.

La configuración está en `config/config.php`:

```php
'python' => [
    'sandbox' => 'docker',
    'docker_bin' => 'docker',
    'docker_image' => 'python:3.12-alpine',
],
```

Las diez misiones Python (`python-01-output` a `python-10-project`) usan el mismo progreso cloud, clases, tareas y entregas que Java. Docentes pueden seleccionar una clase y asignar la misión abierta desde Python Studio; estudiantes entregan su código actual. Sin sesión, el progreso sigue guardándose localmente.

#### Worker recomendado para producción

La alternativa recomendada evita exponer el socket Docker a Apache/PHP. El worker compila y ejecuta el código dentro de un contenedor dedicado configurado con `network_mode: none`, usuario sin privilegios, filesystem de solo lectura y límites de CPU/RAM/PIDs. En este modo PHP no necesita tener `javac` ni `java`.

1. Montá la misma cola en PHP y en el worker (por ejemplo `/var/lib/java-werkstatt/queue`).
2. En `config/config.php` configurá:

```php
'compiler' => [
    'sandbox' => 'worker',
    'worker_queue' => '/var/lib/java-werkstatt/queue',
],
```

3. Prepará la cola para el UID compartido por PHP y el worker e iniciá el servicio:

```bash
mkdir -p sandbox/.sandbox-queue
chmod 0770 sandbox/.sandbox-queue
JAVA_WORKER_QUEUE_HOST="$PWD/sandbox/.sandbox-queue" \
  docker compose -f sandbox/docker-compose.worker.yml up -d
```

El worker usa directamente la imagen oficial `eclipse-temurin:21-jdk`; no necesita exponer Docker ni construir una imagen propia. El endpoint PHP entrega el código fuente mediante la cola y espera los diagnósticos de `javac` y el resultado de ejecución. Si el worker no responde, la operación falla cerradamente: no vuelve silenciosamente a `jvm-limited`.

Para el XAMPP Docker local se incluye `sandbox/xampp-worker.override.yml`. La cola debe ser una ruta visible tanto dentro de `xampp-php` como desde el host. No habilites `/var/run/docker.sock` salvo que aceptes el riesgo de otorgar control del daemon Docker al proceso web.

```bash
export JAVA_WORKER_QUEUE_HOST="$HOME/xampp-data/htdocs/.java-werkstatt-queue"
export JAVA_WERKSTATT_ROOT="$PWD"
mkdir -p "$JAVA_WORKER_QUEUE_HOST"/{in,out}
chmod -R 0777 "$JAVA_WORKER_QUEUE_HOST" # solo desarrollo local
docker compose -p xampp \
  -f /ruta/a/xampp-docker/docker-compose.yml \
  -f sandbox/xampp-worker.override.yml \
  up -d --no-build java-sandbox-worker
```

En el `config/config.php` desplegado dentro de XAMPP, usá `worker_queue => /var/www/html/.java-werkstatt-queue`. Protegé esa carpeta desde Apache; la instalación local verificada usa un `.htaccess` con `Require all denied`.

Podés comprobar el protocolo completo sin Docker con:

```bash
npm run test:worker
```

## Validación, límites y privacidad

La validación local es **honestamente heurística**: expresiones regulares y análisis léxico revisan estructuras esperadas, no la semántica completa del lenguaje. El frontend mantiene representaciones separadas del código crudo, del código sin comentarios y del código enmascarado. Así, los comentarios pueden servir como evidencia pedagógica solo en reglas explícitas, sin contaminar las comprobaciones estructurales. Los diagnósticos locales pueden producir falsos positivos o negativos.

Cada misión declara su modo de compilación (`source`, `snippet` o `member`) y, si necesita símbolos de contexto, un fixture visible alrededor del bloque editable. Cuando el backend PHP está conectado, el diagnóstico proviene de `javac`; las 23 misiones ejecutables tienen contrato runtime explícito y una ejecución sin regla se rechaza cerradamente. Los proyectos usan `stdoutEquals` normalizado sobre dos fixtures y validadores causales sobre parámetros/colecciones. Esto reduce hardcoding trivial, aunque ninguna heurística local reemplaza análisis semántico general.

Sin PHP, no existe un compilador Java real en el navegador. Una respuesta aceptada todavía puede no compilar, y una solución válida escrita de otra manera puede ser rechazada por las reglas educativas de la misión.

Sin backend configurado, todo se procesa en el navegador. Con backend, MySQL almacena cuentas, clases, progreso, feedback, tareas, versiones entregadas, rúbricas y notificaciones; no se agrega telemetría ni analytics. Borrar los datos del navegador elimina solo el caché local. La exportación de cuenta devuelve los datos asociados al usuario autenticado; la eliminación exige contraseña y confirmación, y aplica las reglas de conservación referencial del aula. Esto es una base técnica, no sustituye una política institucional de privacidad, retención, consentimiento de menores ni copias de seguridad.

### Fórmula de dominio estimado

La estimación mostrada se calcula así, con un máximo de 100:

`70 × misiones resueltas / 49 + 20 × aciertos / intentos + max(0, 10 − pistas − 2 × soluciones reveladas)`

Un **acierto** se registra únicamente la primera vez que una misión se resuelve; volver a comprobar una misión ya resuelta suma un intento, pero no infla los aciertos. Esta métrica local sirve para orientar la práctica: no es una calificación oficial.
