import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.AtomicMoveNotSupportedException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

final class Worker {
    private static final Path QUEUE = Path.of(System.getenv().getOrDefault(
        "JAVA_WORKER_QUEUE", "/var/lib/java-werkstatt/queue"
    ));
    private static final Duration COMPILE_TIMEOUT = Duration.ofSeconds(8);
    private static final Duration RUN_TIMEOUT = Duration.ofSeconds(3);
    private static final int MAX_OUTPUT_BYTES = 12_000;
    private static final Pattern MAIN_CLASS = Pattern.compile("[A-Za-z_$][A-Za-z0-9_$]*");
    private static final Pattern FILE_NAME = Pattern.compile("[A-Za-z_$][A-Za-z0-9_$]*\\.java");

    public static void main(String[] args) throws Exception {
        Files.createDirectories(QUEUE.resolve("in"));
        Files.createDirectories(QUEUE.resolve("out"));
        while (!Thread.currentThread().isInterrupted()) {
            try (var jobs = Files.list(QUEUE.resolve("in"))) {
                jobs.filter(Files::isDirectory).forEach(Worker::processIfReady);
            }
            Thread.sleep(20);
        }
    }

    private static void processIfReady(Path jobDirectory) {
        Path ready = jobDirectory.resolve("READY");
        Path running = jobDirectory.resolve("RUNNING");
        if (!Files.isRegularFile(ready)) return;
        try {
            Files.move(ready, running, StandardCopyOption.ATOMIC_MOVE);
        } catch (IOException exception) {
            return;
        }

        String jobId = jobDirectory.getFileName().toString();
        try {
            String mainClass = Files.readString(jobDirectory.resolve("main-class.txt")).trim();
            String fileName = Files.readString(jobDirectory.resolve("file-name.txt")).trim();
            boolean shouldRun = Files.readString(jobDirectory.resolve("run.txt")).trim().equals("1");
            if (!MAIN_CLASS.matcher(mainClass).matches()) {
                throw new IllegalArgumentException("Clase principal inválida.");
            }
            if (!FILE_NAME.matcher(fileName).matches()) {
                throw new IllegalArgumentException("Nombre de archivo inválido.");
            }
            byte[] stdin = Files.readAllBytes(jobDirectory.resolve("stdin.bin"));
            Result result = compileAndRun(jobDirectory, fileName, mainClass, stdin, shouldRun);
            writeResult(jobId, result);
        } catch (Exception exception) {
            writeResult(jobId, new Result("worker", 2, "", exception.getMessage(), "", false, 0, 0));
        } finally {
            removeDirectory(jobDirectory);
        }
    }

    private static Result compileAndRun(
        Path jobDirectory,
        String fileName,
        String mainClass,
        byte[] stdin,
        boolean shouldRun
    ) throws Exception {
        Path classes = jobDirectory.resolve("classes");
        Files.createDirectory(classes);
        ProcessResult compilation = execute(List.of(
            "javac", "-J-Duser.language=en", "-J-Duser.country=US", "-encoding", "UTF-8",
            "-J-Xmx96m", "-proc:none", "-Xlint:all", "-d", classes.toString(),
            jobDirectory.resolve(fileName).toString()
        ), jobDirectory, COMPILE_TIMEOUT, new byte[0]);
        String compileOutput = (compilation.stdout() + "\n" + compilation.stderr())
            .replace(jobDirectory.toString() + "/", "")
            .trim();
        if (compilation.exitCode() != 0 || compilation.timedOut() || !shouldRun) {
            return new Result(
                "compile",
                compilation.exitCode(),
                "",
                "",
                compileOutput,
                compilation.timedOut(),
                compilation.durationMs(),
                0
            );
        }

        ProcessResult execution = execute(List.of(
            "java", "-Duser.language=en", "-Duser.country=US", "-Dfile.encoding=UTF-8",
            "-Djava.awt.headless=true", "-Xms16m", "-Xmx64m", "-XX:ActiveProcessorCount=1",
            "-cp", classes.toString(), mainClass
        ), jobDirectory, RUN_TIMEOUT, stdin);
        return new Result(
            "run",
            execution.exitCode(),
            execution.stdout(),
            execution.stderr(),
            compileOutput,
            execution.timedOut(),
            compilation.durationMs(),
            execution.durationMs()
        );
    }

    private static ProcessResult execute(
        List<String> command,
        Path jobDirectory,
        Duration timeout,
        byte[] stdin
    ) throws Exception {
        long started = System.nanoTime();
        Process process = new ProcessBuilder(command).directory(jobDirectory.toFile()).start();
        try (var input = process.getOutputStream()) {
            input.write(stdin);
        }
        CompletableFuture<String> stdout = readLimited(process.getInputStream());
        CompletableFuture<String> stderr = readLimited(process.getErrorStream());
        boolean finished = process.waitFor(timeout.toMillis(), TimeUnit.MILLISECONDS);
        if (!finished) {
            process.destroy();
            if (!process.waitFor(100, TimeUnit.MILLISECONDS)) process.destroyForcibly();
        }
        return new ProcessResult(
            finished ? process.exitValue() : 124,
            stdout.get(1, TimeUnit.SECONDS),
            stderr.get(1, TimeUnit.SECONDS),
            !finished,
            TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - started)
        );
    }

    private static CompletableFuture<String> readLimited(InputStream stream) {
        return CompletableFuture.supplyAsync(() -> {
            try (stream; var output = new ByteArrayOutputStream()) {
                byte[] buffer = new byte[1024];
                int total = 0;
                for (int read; (read = stream.read(buffer)) != -1;) {
                    int accepted = Math.min(read, MAX_OUTPUT_BYTES - total);
                    if (accepted > 0) output.write(buffer, 0, accepted);
                    total += accepted;
                }
                String text = output.toString(StandardCharsets.UTF_8);
                return total > MAX_OUTPUT_BYTES ? text + "\n… salida recortada …" : text;
            } catch (IOException exception) {
                return "";
            }
        });
    }

    private static void writeResult(String jobId, Result result) {
        Path temporary = QUEUE.resolve("out").resolve(jobId + ".tmp");
        Path destination = QUEUE.resolve("out").resolve(jobId + ".json");
        String json = """
            {"phase":"%s","exitCode":%d,"stdout":"%s","stderr":"%s","compileOutput":"%s","timedOut":%s,"durationMs":%d,"compileDurationMs":%d,"runDurationMs":%d}
            """.formatted(
                result.phase(),
                result.exitCode(),
                escape(result.stdout()),
                escape(result.stderr()),
                escape(result.compileOutput()),
                result.timedOut(),
                result.compileDurationMs() + result.runDurationMs(),
                result.compileDurationMs(),
                result.runDurationMs()
            ).trim();
        try {
            Files.writeString(temporary, json, StandardCharsets.UTF_8);
            try {
                Files.move(temporary, destination, StandardCopyOption.ATOMIC_MOVE);
            } catch (AtomicMoveNotSupportedException exception) {
                Files.move(temporary, destination, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException exception) {
            System.err.println("No se pudo escribir el resultado " + jobId + ": " + exception.getMessage());
        }
    }

    private static String escape(String value) {
        return value.replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\r", "\\r")
            .replace("\n", "\\n")
            .replace("\t", "\\t");
    }

    private static void removeDirectory(Path directory) {
        if (!Files.exists(directory)) return;
        try (var paths = Files.walk(directory)) {
            paths.sorted(Comparator.reverseOrder()).forEach(path -> {
                try {
                    Files.deleteIfExists(path);
                } catch (IOException ignored) {
                }
            });
        } catch (IOException ignored) {
        }
    }

    private record ProcessResult(
        int exitCode,
        String stdout,
        String stderr,
        boolean timedOut,
        long durationMs
    ) {
    }

    private record Result(
        String phase,
        int exitCode,
        String stdout,
        String stderr,
        String compileOutput,
        boolean timedOut,
        long compileDurationMs,
        long runDurationMs
    ) {
    }
}
