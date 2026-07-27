<?php
declare(strict_types=1);

return [
    'db' => [
        'dsn' => 'mysql:host=127.0.0.1;dbname=java_werkstatt;charset=utf8mb4',
        'user' => 'root',
        'password' => '',
    ],
    'session_secure' => false,
    'compiler' => [
        'javac' => 'javac',
        'java' => 'java',
        // jvm = local; docker = PHP ejecuta contenedores; worker = cola compartida a un contenedor aislado sin red.
        'sandbox' => 'jvm',
        'docker_image' => 'eclipse-temurin:21-jre',
        'worker_queue' => '/var/lib/java-werkstatt/queue',
    ],
];
