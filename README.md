# Java Werkstatt

Laboratorio estático, bilingüe (ES/DE) y sin dependencias para practicar fundamentos de informática mediante Java. La aplicación funciona enteramente en el navegador: no envía código, respuestas ni progreso a ningún servidor.

## Ejecutar

Desde la raíz del proyecto:

```bash
python3 -m http.server 8000
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
- La consola y el autocompletado funcionan sin dependencias; la salida de F5 es deliberadamente educativa y simulada.
- `localStorage`: progreso y preferencias. La carga filtra IDs desconocidos y completa campos nuevos con valores seguros.

No se usa Monaco, CodeMirror, frameworks, paquetes ni servicios externos.

## Currículo NRW GOSt

El **Kernlehrplan (KLP) Informatik für die gymnasiale Oberstufe** es el marco oficial vinculante. Java Werkstatt toma como referencia sus procesos de competencia —Argumentieren (A), Modellieren (M), Implementieren (I), Darstellen und Interpretieren (D), Kommunizieren und Kooperieren (K)— y sus campos de contenido.

El **Schulinterner Lehrplan (SiLP)** consultado aporta una secuencia orientativa EF/Q1/Q2; no es correcto presentarlo como una secuencia universal obligatoria para todos los centros. La documentación de los exámenes centrales se usa como contexto adicional.

La aplicación ofrece una cobertura práctica y razonable, pero **NO afirma cubrir literalmente todo el currículo, no reemplaza el KLP, un SiLP escolar, la docencia ni la preparación oficial de examen**.

Fuentes:

- [KLP GOSt Informatik (oficial y vinculante)](https://lehrplannavigator.nrw.de/system/files/media/document/file/klp_gost_informatik.pdf)
- [Ejemplo de SiLP GOSt Informatik (secuencia orientativa)](https://lehrplannavigator.nrw.de/system/files/media/document/file/silp_gost_if.pdf)
- [Documentación Zentralabitur Informatik GK/LK](https://lehrplannavigator.nrw.de/system/files/media/document/file/dokumentation_za-if_gk-lk_ab_2018_2021_12_22.pdf)

## Validación, límites y privacidad

La validación es **honestamente heurística**: expresiones regulares y análisis léxico local revisan estructuras esperadas, no la semántica completa del lenguaje. Los diagnósticos intentan ignorar strings y comentarios, pero pueden producir falsos positivos o negativos. El formateador solo normaliza indentación guiada por llaves.

**No existe un compilador Java real en esta app.** Una respuesta aceptada todavía puede no compilar, y una solución válida escrita de otra manera puede ser rechazada. Para verificar Java de verdad, usá `javac`, un IDE o un entorno de pruebas.

Todo se procesa en el navegador. No hay cuentas, telemetría, analytics ni sincronización. Borrar los datos del sitio o usar «Reiniciar todo el progreso» elimina el avance local.

### Fórmula de dominio estimado

La estimación mostrada se calcula así, con un máximo de 100:

`70 × misiones resueltas / 36 + 20 × aciertos / intentos + max(0, 10 − pistas − 2 × soluciones reveladas)`

Un **acierto** se registra únicamente la primera vez que una misión se resuelve; volver a comprobar una misión ya resuelta suma un intento, pero no infla los aciertos. Esta métrica local sirve para orientar la práctica: no es una calificación oficial.
