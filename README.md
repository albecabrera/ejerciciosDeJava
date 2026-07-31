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
3. En phpMyAdmin, ejecutá `database/schema.sql`.
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
- **Onboarding de primera visita:** una introducción breve y persistente presenta el flujo sin volver a interrumpir al alumno después de cerrarla.
- Recorrido razonable por sintaxis, tipos, control, métodos, arrays/Strings, POO/UML, herencia, polimorfismo, colecciones, List/Stack/Queue, recursión, búsqueda, ordenamiento, eficiencia, BST, grafos, autómatas, gramáticas, SQL, normalización, redes, cifrado educativo, privacidad, Von Neumann y límites de la computación.
- Los contenidos no-Java se trabajan como simulaciones, modelos, cadenas o comentarios Java; no se finge una base de datos, red, CPU o autómata real.
- Popup de completado para Live Templates y términos contextuales, accesible como `listbox`.
- Diagnósticos locales con debounce para pares, strings/comentarios, mezcla de tabs/espacios, indentación por llaves y puntos y coma simples.
- **Preparación y debugging visibles:** los videos se asignan únicamente cuando hay una correspondencia temática explícita y verificada; los temas sin recurso alemán adecuado no muestran video. El botón de escarabajo abre una checklist persistente directamente en la barra superior.
- Formateador de indentación a cuatro espacios.
- Progreso local con XP, intentos, aciertos, pistas, soluciones, competencias, campos y una estimación de dominio cuya fórmula se muestra en pantalla.
- **Mentor adaptivo:** recomienda la siguiente práctica según progreso, intentos fallidos, pistas usadas y proyecto activo; la recomendación es accionable con un botón.
- Temas claro/oscuro, diseño responsive, navegación por teclado y respeto por `prefers-reduced-motion`. La interfaz enfatiza checkpoints de proyecto, transiciones sutiles y jerarquía visual sin sacrificar foco ni contraste.
- **Modo de práctica libre:** podés abrir cualquier misión sin resolver la anterior; el recorrido secuencial sigue disponible como modo guiado.
- Autocierre de `""`, `''`, `()`, `[]` y `{}` con el cursor dentro; si el cierre ya existe, el editor lo salta.
- Consola educativa dentro del IDE: F5 muestra comandos reales, diagnósticos por línea y salida stdout/stderr solo si el programa imprime con `System.out.print(...)`, `System.out.println(...)` o `System.out.printf(...)`. Las misiones ejecutables obligan al alumno a escribir también la impresión cuando el resultado debe observarse.
- **Validación enfocada:** el estado del pipeline conserva toda la información accesible, pero se resume junto al editor en vez de competir con la tarea principal.
- **Recursos progresivos:** Tutorial, Documentación y Pistas/Solución permanecen cerrados hasta que el alumno los pide.
- **Tool Window estilo IntelliJ:** Consola, Problemas y Progreso comparten un panel inferior; solo una herramienta se muestra a la vez.
- **Scaffold de archivo completo:** el editor muestra el contexto Java de solo lectura, una consigna ES/DE como comentario y numeración continua alrededor del área editable. Ese scaffold es visual y no altera el texto que se evalúa o compila.
- **Feedback por misión:** la Tool Window incluye comentarios con autor, rol, fecha y estado abierto/resuelto. Por ahora se guardan únicamente en el `localStorage` del navegador y la propia interfaz lo indica; no existe sincronización de feedback con MySQL. Una sesión docente/admin habilita respuestas y moderación local.
- Documentación contextual por misión, con enlaces directos a `dev.java` y Oracle Java Tutorials/API, disponible bajo demanda.
- Live Templates y atajos IDEA en paneles desplegables para priorizar el editor y reducir ruido visual.
- **Compilación y ejecución real opcional:** al pulsar F5, `api/compile.php` compila con `javac` y ejecuta con `java` cuando la misión lo exige o cuando el código contiene una impresión de consola. La salida se recorta y corre con timeout/límites; con sandbox Docker/worker se ejecuta sin red y con límites CPU/RAM/PID.
- **Panel docente local y centralizado:** resumen de misiones, intentos, precisión, pendientes, vista por alumno, historial de intentos, recomendación automática y exportación CSV/JSON.
- **Cuentas y clases centralizadas:** estudiantes y docentes con sesiones PHP, clases con código de acceso y progreso sincronizado por usuario en MySQL con métricas monotónicas para evitar regresiones accidentales.

## Atajos

| Atajo | Acción |
|---|---|
| `F5` | Comprobar la misión |
| `Ctrl/Cmd + Space` | Abrir completado |
| `↑` / `↓`, `Tab` / `Enter`, `Escape` | Navegar, aceptar o cerrar completado |
| `Tab` | Expandir Live Template o insertar cuatro espacios |
| `Alt + Enter` | Pedir pista |
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
- `game.js`: catálogo curricular y de videos alemanes verificados, scaffold visual no evaluado, feedback local por misión, traducciones, validadores, editor, atajos, diagnósticos y persistencia.
- `js/java-evaluators.js`: contratos conductuales sobre stdout real; soporta inclusión compatible (`stdoutIncludes`) e igualdad normalizada (`stdoutEquals`).
- `api/compile.php`: endpoint PHP sin framework que valida tamaño/nombre/modo, compila en temporal, ejecuta snippets/clases con límites y devuelve diagnósticos/salida JSON.
- `api/auth.php`: registro, login, logout, sesiones y roles student/teacher/admin.
- `api/classes.php`: creación de clases docente, unión por código y consulta GET de progreso por clase con permisos de docente/admin.
- `api/progress.php`: sincronización centralizada del progreso con upsert transaccional, allowlist de misiones y contadores monotónicos.
- `api/attempts.php`: historial de intentos por alumno para docentes: fase, resultado, feedback, duración y extracto de respuesta.
- `api/bootstrap.php`: PDO, sesión HttpOnly/SameSite, respuestas JSON y protección CSRF.
- `database/schema.sql`: esquema MySQL para usuarios, clases, miembros y progreso.
- `config/config.example.php`: configuración portable para XAMPP y servidor; `config/config.php` nunca se versiona.
- `tests/java-werkstatt.spec.js`: pruebas Playwright de UI, cover semántica ES/DE, bienvenida/onboarding, scaffold continuo, feedback local, Atom One Dark, reanudación, reduced motion, rutas, recursos, Tool Window, videos, checklist, diagnósticos, API, responsive, migraciones, proyectos y contratos Java positivos/adversariales.
- `playwright.config.js`: ejecuta los tests contra el servidor PHP integrado.
- `tools/xampp-smoke.mjs`: smoke test para la instancia XAMPP real; comprueba assets versionados, dashboard/mentor/HUD y compilación por API.
- `docs/architecture-roadmap.md`: plan de modularización sin romper XAMPP ni exigir build.
- Con PHP activo, F5 usa `javac` real y ejecuta solo cuando hay salida esperable; sin `System.out.print/println/printf` la consola avisa que no hay resultado visible. Sin PHP, vuelve a validación local y lo comunica.
- `localStorage`: progreso, preferencias y feedback por misión en estado v3. Persiste `currentMissionId` estable; al migrar v2/legacy traduce el índice con el orden histórico de 36 misiones anterior a los capstones.

`localStorage` queda como caché offline y fallback; con una sesión activa, `api/progress.php` sincroniza las respuestas con MySQL. El registro público siempre crea estudiantes: los docentes se crean por CLI o por un flujo administrativo.

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
npm run test:e2e
```

`test:e2e` cubre 43 contratos de producto. Incluye cover bilingüe y responsive, bienvenida, onboarding persistente con retorno de foco, fondo decorativo no interactivo, reanudación real con Alt+R sin interceptar Ctrl+R, reduced motion al explorar, transición dashboard→workspace, acceso docente y skip-link desde portada, bloqueo explícito de rutas, revelado de recursos, exclusividad y labels ES/DE de la Tool Window, sidebar móvil transitoria entre renders, selección estricta de videos temáticos, checklist de Bugs, tooltip de diagnósticos y ausencia de overflow a 390/320 px. El contrato oficial obtiene los 49 casos desde una API encapsulada que solo existe bajo `?e2e=1`, exige una regla para las misiones ejecutables, prueba salidas incorrectas y compila en paralelo con concurrencia limitada. Los cinco cheats verificados de capstone también deben ser rechazados. Los tests requieren PHP y un JDK con `javac` disponible en `PATH`. También podés definir `JAVAC_BIN=/ruta/a/javac`. En Docker XAMPP usá `tools/install-xampp-jdk.sh xampp-php`.

`test:xampp` espera por defecto `http://127.0.0.1/java-werkstatt/`. Podés cambiarlo con:

```bash
JAVA_WERKSTATT_XAMPP_URL="http://localhost/java-werkstatt/" npm run test:xampp
```

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

`api/compile.php` acepta únicamente `POST` JSON, limita el código a 48 KB, aplica un límite simple por sesión, rechaza nombres de archivo inseguros, comprueba que `javac`/`java` existan, usa `-proc:none`, fuerza un locale estable, impone timeout de compilación de 8 segundos, timeout de ejecución de 3 segundos, recorta salida y elimina artefactos temporales. Los snippets se envuelven en una clase educativa; las clases y métodos se compilan en sus respectivos modos.

El modo `jvm` **no es un sandbox de producción**: ejecutar Java arbitrario en el mismo servidor puede consumir recursos o intentar acceder al sistema. Para un aula multiusuario usá el worker aislado incluido.


### Ejecución Java y sandbox

Por defecto, `compiler.sandbox = "jvm"` ejecuta Java con límites prácticos (`-Xmx64m`, timeout, salida recortada). Esto es suficiente para laboratorio local, pero NO aísla red ni syscalls.

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

Sin backend configurado, todo se procesa en el navegador. Con backend, las cuentas, clases y progreso se almacenan en MySQL; no se agrega telemetría ni analytics. Borrar los datos del sitio elimina el caché local, pero no el progreso central.

### Fórmula de dominio estimado

La estimación mostrada se calcula así, con un máximo de 100:

`70 × misiones resueltas / 49 + 20 × aciertos / intentos + max(0, 10 − pistas − 2 × soluciones reveladas)`

Un **acierto** se registra únicamente la primera vez que una misión se resuelve; volver a comprobar una misión ya resuelta suma un intento, pero no infla los aciertos. Esta métrica local sirve para orientar la práctica: no es una calificación oficial.
