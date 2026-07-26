<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') exit("Solo CLI\n");
$configPath = dirname(__DIR__) . '/config/config.php';
if (!is_file($configPath)) exit("Copiá config/config.example.php como config/config.php primero.\n");
$config = require $configPath;
$name = $argv[1] ?? '';
$email = strtolower(trim($argv[2] ?? ''));
$password = $argv[3] ?? '';
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) exit("Uso: php tools/create-teacher.php 'Nombre' docente@example.com 'contraseña-8+'\n");
$pdo = new PDO($config['db']['dsn'], $config['db']['user'], $config['db']['password'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$statement = $pdo->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, \'teacher\')');
$statement->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]);
echo "Docente creado: {$email}\n";
