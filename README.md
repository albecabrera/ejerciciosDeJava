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

- **Exactamente 36 misiones:** EF (12), Q1 (12) y Q2 (12).
- Recorrido razonable por sintaxis, tipos, control, métodos, arrays/Strings, POO/UML, herencia, polimorfismo, colecciones, List/Stack/Queue, recursión, búsqueda, ordenamiento, eficiencia, BST, grafos, autómatas, gramáticas, SQL, normalización, redes, cifrado educativo, privacidad, Von Neumann y límites de la computación.
- Los contenidos no-Java se trabajan como simulaciones, modelos, cadenas o comentarios Java; no se finge una base de datos, red, CPU o autómata real.
- Popup de completado para Live Templates y términos contextuales, accesible como `listbox`.
- Diagnósticos locales con debounce para pares, strings/comentarios, mezcla de tabs/espacios, indentación por llaves y puntos y coma simples.
- Formateador de indentación a cuatro espacios.
- Progreso local con XP, intentos, aciertos, pistas, soluciones, competencias, campos y una estimación de dominio cuya fórmula se muestra en pantalla.
- Temas claro/oscuro, diseño responsive, navegación por teclado y respeto por `prefers-reduced-motion`.
- **Modo de práctica libre:** podés abrir cualquier misión sin resolver la anterior; el recorrido secuencial sigue disponible como modo guiado.
- Autocierre de `""`, `''`, `()`, `[]` y `{}` con el cursor dentro; si el cierre ya existe, el editor lo salta.
- Consola educativa dentro del IDE: F5 muestra el comando, diagnósticos por línea y un resultado simulado sin fingir que ejecuta `javac`.
- Documentación contextual visible por misión, con enlaces directos a `dev.java` y Oracle Java Tutorials/API.
- Live Templates y atajos IDEA en paneles desplegables para priorizar el editor y reducir ruido visual.
- **Compilación y ejecución real opcional:** al pulsar F5, `api/compile.php` compila con `javac` y, en misiones ejecutables, corre `java` con timeout, salida recortada y memoria JVM limitada. Si configurás sandbox Docker, ejecuta con red desactivada y límites CPU/RAM/PID.
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

## Documentación contextual

La tarjeta **¿Querés profundizar?** / **Möchtest du tiefer einsteigen?** selecciona recursos oficiales según el concepto de la misión. Incluye sintaxis, ejemplos y referencia API desde:

- [dev.java Learn](https://dev.java/learn/)
- [Oracle Java Tutorials](https://docs.oracle.com/javase/tutorial/)
- [Java SE API](https://docs.oracle.com/en/java/javase/21/docs/api/index.html)

Los enlaces abren una pestaña nueva. La app no scrapea ni copia el contenido: solo ofrece el acceso a la fuente.

## Arquitectura

- `index.html`: shell SPA y semántica accesible.
- `styles.css`: tokens visuales, temas, layouts responsive, editor, popup, diagnósticos y progreso.
- `game.js`: catálogo curricular, traducciones, validadores heurísticos, editor, atajos, diagnósticos y persistencia.
- `api/compile.php`: endpoint PHP sin framework que valida tamaño/nombre/modo, compila en temporal, ejecuta snippets/clases con límites y devuelve diagnósticos/salida JSON.
- `api/auth.php`: registro, login, logout, sesiones y roles student/teacher/admin.
- `api/classes.php`: creación de clases docente, unión por código y consulta GET de progreso por clase con permisos de docente/admin.
- `api/progress.php`: sincronización centralizada del progreso con upsert transaccional, allowlist de misiones y contadores monotónicos.
- `api/attempts.php`: historial de intentos por alumno para docentes: fase, resultado, feedback, duración y extracto de respuesta.
- `api/bootstrap.php`: PDO, sesión HttpOnly/SameSite, respuestas JSON y protección CSRF.
- `database/schema.sql`: esquema MySQL para usuarios, clases, miembros y progreso.
- `config/config.example.php`: configuración portable para XAMPP y servidor; `config/config.php` nunca se versiona.
- `tests/java-werkstatt.spec.js`: smoke tests Playwright de UI, API, modo libre, autocierre de pares, ejecución Java y progreso docente.
- `playwright.config.js`: ejecuta los tests contra el servidor PHP integrado.
- Con PHP activo, F5 usa `javac` real; sin PHP, la consola vuelve a la validación local y lo comunica.
- `localStorage`: progreso y preferencias. La carga filtra IDs desconocidos y completa campos nuevos con valores seguros.

`localStorage` queda como caché offline y fallback; con una sesión activa, `api/progress.php` sincroniza las respuestas con MySQL. El registro público siempre crea estudiantes: los docentes se crean por CLI o por un flujo administrativo.

El frontend no usa Monaco ni CodeMirror. Playwright es una dependencia exclusiva de testing; PHP no requiere framework.

### Tests Playwright

Instalá las dependencias de desarrollo y ejecutá los smoke tests:

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Los tests requieren PHP y un JDK con `javac` disponible en `PATH`. También podés definir `JAVAC_BIN=/ruta/a/javac`. En Docker XAMPP usá `tools/install-xampp-jdk.sh xampp-php`.

## Currículo NRW GOSt

El **Kernlehrplan (KLP) Informatik für die gymnasiale Oberstufe** es el marco oficial vinculante. Java Werkstatt toma como referencia sus procesos de competencia —Argumentieren (A), Modellieren (M), Implementieren (I), Darstellen und Interpretieren (D), Kommunizieren und Kooperieren (K)— y sus campos de contenido.

El **Schulinterner Lehrplan (SiLP)** consultado aporta una secuencia orientativa EF/Q1/Q2; no es correcto presentarlo como una secuencia universal obligatoria para todos los centros. La documentación de los exámenes centrales se usa como contexto adicional.

La aplicación ofrece una cobertura práctica y razonable, pero **NO afirma cubrir literalmente todo el currículo, no reemplaza el KLP, un SiLP escolar, la docencia ni la preparación oficial de examen**.

Fuentes:

- [KLP GOSt Informatik (oficial y vinculante)](https://lehrplannavigator.nrw.de/system/files/media/document/file/klp_gost_informatik.pdf)
- [Ejemplo de SiLP GOSt Informatik (secuencia orientativa)](https://lehrplannavigator.nrw.de/system/files/media/document/file/silp_gost_if.pdf)
- [Documentación Zentralabitur Informatik GK/LK](https://lehrplannavigator.nrw.de/system/files/media/document/file/dokumentation_za-if_gk-lk_ab_2018_2021_12_22.pdf)

## Compilación y seguridad

`api/compile.php` acepta únicamente `POST` JSON, limita el código a 48 KB, aplica un límite simple por sesión, rechaza nombres de archivo inseguros, comprueba que `javac`/`java` existan, usa `-proc:none`, fuerza un locale estable, impone timeout de compilación de 8 segundos, timeout de ejecución de 3 segundos, recorta salida y elimina artefactos temporales. Los snippets se envuelven en una clase educativa; las clases y métodos se compilan en sus respectivos modos.

Esto **no es un sandbox de producción**: ejecutar Java arbitrario en el mismo servidor puede consumir recursos o intentar acceder al sistema. Para un aula multiusuario, ejecutá el compilador dentro de un contenedor sin red, con usuario sin privilegios, límites de CPU/memoria y filesystem efímero. La versión incluida está pensada para desarrollo local o servidor de confianza.


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

## Validación, límites y privacidad

La validación local es **honestamente heurística**: expresiones regulares y análisis léxico revisan estructuras esperadas, no la semántica completa del lenguaje. Los diagnósticos locales intentan ignorar strings y comentarios, pero pueden producir falsos positivos o negativos. Cuando el backend PHP está conectado, el diagnóstico de compilación proviene de `javac`; aun así, que compile no demuestra que la solución cumpla el objetivo didáctico de la misión.

Sin PHP, no existe un compilador Java real en el navegador. Una respuesta aceptada todavía puede no compilar, y una solución válida escrita de otra manera puede ser rechazada por las reglas educativas de la misión.

Sin backend configurado, todo se procesa en el navegador. Con backend, las cuentas, clases y progreso se almacenan en MySQL; no se agrega telemetría ni analytics. Borrar los datos del sitio elimina el caché local, pero no el progreso central.

### Fórmula de dominio estimado

La estimación mostrada se calcula así, con un máximo de 100:

`70 × misiones resueltas / 36 + 20 × aciertos / intentos + max(0, 10 − pistas − 2 × soluciones reveladas)`

Un **acierto** se registra únicamente la primera vez que una misión se resuelve; volver a comprobar una misión ya resuelta suma un intento, pero no infla los aciertos. Esta métrica local sirve para orientar la práctica: no es una calificación oficial.
