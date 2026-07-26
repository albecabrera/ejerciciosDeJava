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
- **Compilación real opcional:** al pulsar F5, `api/compile.php` envía el código al `javac` local, devuelve errores con línea/severidad y limpia el espacio temporal al terminar. Si PHP no está disponible, la app conserva el modo heurístico y lo indica.
- **Panel docente local:** resumen de misiones, intentos, precisión y pendientes; filtro EF/Q1/Q2 y exportación CSV/JSON. No inventa una clase ni sincroniza datos sin una cuenta/backend de identidad.

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
- `api/compile.php`: endpoint PHP sin framework que valida tamaño/nombre/modo, compila en un directorio temporal aislado y devuelve diagnósticos JSON.
- `tests/java-werkstatt.spec.js`: smoke tests Playwright de UI, API, modo libre y autocierre de pares.
- `playwright.config.js`: ejecuta los tests contra el servidor PHP integrado.
- Con PHP activo, F5 usa `javac` real; sin PHP, la consola vuelve a la validación local y lo comunica.
- `localStorage`: progreso y preferencias. La carga filtra IDs desconocidos y completa campos nuevos con valores seguros.

El frontend no usa Monaco ni CodeMirror. Playwright es una dependencia exclusiva de testing; PHP no requiere framework.

### Tests Playwright

Instalá las dependencias de desarrollo y ejecutá los smoke tests:

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Los tests requieren PHP y un JDK con `javac` disponible en `PATH`. También podés definir `JAVAC_BIN=/ruta/a/javac`.

## Currículo NRW GOSt

El **Kernlehrplan (KLP) Informatik für die gymnasiale Oberstufe** es el marco oficial vinculante. Java Werkstatt toma como referencia sus procesos de competencia —Argumentieren (A), Modellieren (M), Implementieren (I), Darstellen und Interpretieren (D), Kommunizieren und Kooperieren (K)— y sus campos de contenido.

El **Schulinterner Lehrplan (SiLP)** consultado aporta una secuencia orientativa EF/Q1/Q2; no es correcto presentarlo como una secuencia universal obligatoria para todos los centros. La documentación de los exámenes centrales se usa como contexto adicional.

La aplicación ofrece una cobertura práctica y razonable, pero **NO afirma cubrir literalmente todo el currículo, no reemplaza el KLP, un SiLP escolar, la docencia ni la preparación oficial de examen**.

Fuentes:

- [KLP GOSt Informatik (oficial y vinculante)](https://lehrplannavigator.nrw.de/system/files/media/document/file/klp_gost_informatik.pdf)
- [Ejemplo de SiLP GOSt Informatik (secuencia orientativa)](https://lehrplannavigator.nrw.de/system/files/media/document/file/silp_gost_if.pdf)
- [Documentación Zentralabitur Informatik GK/LK](https://lehrplannavigator.nrw.de/system/files/media/document/file/dokumentation_za-if_gk-lk_ab_2018_2021_12_22.pdf)

## Compilación y seguridad

`api/compile.php` acepta únicamente `POST` JSON, limita el código a 48 KB, rechaza nombres de archivo inseguros, usa `-proc:none`, fuerza un locale estable para diagnósticos, impone un timeout de 8 segundos y elimina los artefactos temporales. Los snippets se envuelven en una clase educativa; las clases y métodos se compilan en sus respectivos modos.

Esto **no es un sandbox de producción**: ejecutar Java arbitrario en el mismo servidor puede consumir recursos o intentar acceder al sistema. Para un aula multiusuario, ejecutá el compilador dentro de un contenedor sin red, con usuario sin privilegios, límites de CPU/memoria y filesystem efímero. La versión incluida está pensada para desarrollo local o servidor de confianza.

## Validación, límites y privacidad

La validación local es **honestamente heurística**: expresiones regulares y análisis léxico revisan estructuras esperadas, no la semántica completa del lenguaje. Los diagnósticos locales intentan ignorar strings y comentarios, pero pueden producir falsos positivos o negativos. Cuando el backend PHP está conectado, el diagnóstico de compilación proviene de `javac`; aun así, que compile no demuestra que la solución cumpla el objetivo didáctico de la misión.

Sin PHP, no existe un compilador Java real en el navegador. Una respuesta aceptada todavía puede no compilar, y una solución válida escrita de otra manera puede ser rechazada por las reglas educativas de la misión.

Todo se procesa en el navegador. No hay cuentas, telemetría, analytics ni sincronización. Borrar los datos del sitio o usar «Reiniciar todo el progreso» elimina el avance local.

### Fórmula de dominio estimado

La estimación mostrada se calcula así, con un máximo de 100:

`70 × misiones resueltas / 36 + 20 × aciertos / intentos + max(0, 10 − pistas − 2 × soluciones reveladas)`

Un **acierto** se registra únicamente la primera vez que una misión se resuelve; volver a comprobar una misión ya resuelta suma un intento, pero no infla los aciertos. Esta métrica local sirve para orientar la práctica: no es una calificación oficial.
