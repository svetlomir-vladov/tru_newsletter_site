<?php
require_once __DIR__ . '/_helpers.php';

session_start_once();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Method not allowed'], 405);
}

$pdo  = require __DIR__ . '/../bootstrap.php';
$body = read_json_body();
$id   = trim($body['id'] ?? '');

if ($id === '') {
    json_out(['error' => 'Missing id'], 400);
}

$stmt = $pdo->prepare('SELECT id, name, initials FROM students WHERE id = ?');
$stmt->execute([$id]);
$student = $stmt->fetch();

if (!$student) {
    json_out(['error' => 'Student not found'], 401);
}

session_regenerate_id(true);
$_SESSION['student_id'] = $student['id'];
$_SESSION['student']    = $student;

json_out($student);
