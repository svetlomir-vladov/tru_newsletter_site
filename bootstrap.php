<?php
$dbDir  = __DIR__ . '/db';
$dbFile = $dbDir . '/tru.sqlite';

if (!is_dir($dbDir)) {
    mkdir($dbDir, 0755, true);
}

$needsSeed = !file_exists($dbFile);

$pdo = new PDO('sqlite:' . $dbFile);
$pdo->setAttribute(PDO::ATTR_ERRMODE,            PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$pdo->exec('PRAGMA journal_mode=WAL;');
$pdo->exec('PRAGMA foreign_keys=ON;');

if ($needsSeed) {
    $pdo->exec(file_get_contents($dbDir . '/schema.sql'));
    $pdo->exec(file_get_contents($dbDir . '/seed.sql'));
}

return $pdo;
