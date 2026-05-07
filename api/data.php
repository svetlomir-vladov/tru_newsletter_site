<?php
require_once __DIR__ . '/_helpers.php';

require_login();

$pdo = require __DIR__ . '/../bootstrap.php';

// Students
$students = $pdo->query('SELECT id, name, initials FROM students')->fetchAll();

// Classes
$classes = $pdo->query('SELECT id, subject, room, color, icon FROM classes')->fetchAll();

// Teachers with classIds[]
$teachers = $pdo->query('SELECT id, name, title, email, phone, initials, color FROM teachers')->fetchAll();
$tcRows   = $pdo->query('SELECT teacher_id, class_id FROM teacher_classes')->fetchAll();
$tcMap    = [];
foreach ($tcRows as $row) {
    $tcMap[$row['teacher_id']][] = $row['class_id'];
}
foreach ($teachers as &$t) {
    $t['classIds'] = $tcMap[$t['id']] ?? [];
}
unset($t);

// Schedule grouped by day → {monday:[{time,endTime,classId}], ...}
$schedRows = $pdo->query(
    'SELECT day, start_time, end_time, class_id FROM schedule ORDER BY day, start_time'
)->fetchAll();
$schedule = [];
foreach ($schedRows as $row) {
    $schedule[$row['day']][] = [
        'time'    => $row['start_time'],
        'endTime' => $row['end_time'],
        'classId' => $row['class_id'],
    ];
}

// Deadlines
$deadlines = $pdo->query(
    'SELECT id, date, title, class_id AS classId, type, note FROM deadlines ORDER BY date'
)->fetchAll();
// Cast id to int so JS receives a number
foreach ($deadlines as &$d) {
    $d['id'] = (int)$d['id'];
}
unset($d);

$school = ['name' => 'Тракийски университет', 'class' => '', 'year' => '2025/2026'];

json_out(compact('school', 'students', 'classes', 'teachers', 'schedule', 'deadlines'));
