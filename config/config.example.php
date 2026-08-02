<?php
declare(strict_types=1);

return [
    'db' => [
        'dsn' => 'mysql:host=127.0.0.1;dbname=java_werkstatt;charset=utf8mb4',
        'user' => 'root',
        'password' => '',
    ],
    'session_secure' => false,
    'rate_limit_path' => sys_get_temp_dir() . '/java-werkstatt-rate-limits',
    'auth_rate_limits' => [
        'login' => ['limit' => 10, 'window_seconds' => 900],
        'register' => ['limit' => 5, 'window_seconds' => 3600],
    ],
    'compiler' => [
        'javac' => 'javac',
        'java' => 'java',
        // Producción falla cerrada. jvm solo se admite en config.php local con allow_unsafe_jvm=true.
        'sandbox' => 'worker',
        'allow_unsafe_jvm' => false,
        'docker_image' => 'eclipse-temurin:21-jdk',
        'worker_queue' => '/var/lib/java-werkstatt/queue',
    ],
    'python' => [
        // Ejecución aislada, sin fallback local inseguro. Requiere Docker en el host.
        'sandbox' => 'docker',
        'docker_bin' => 'docker',
        'docker_image' => 'python:3.12-alpine',
    ],
];
