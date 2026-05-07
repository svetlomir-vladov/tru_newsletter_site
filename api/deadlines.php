<?php
require_once __DIR__ . '/_helpers.php';

require_login();

$pdo = require __DIR__ . '/../bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $body    = read_json_body();
    $date    = trim($body['date']    ?? '');
    $title   = trim($body['title']   ?? '');
    $classId = trim($body['classId'] ?? '');
    $type    = trim($body['type']    ?? 'test');
    $note    = trim($body['note']    ?? '');

    if ($date === '' || $title === '') {
        json_out(['error' => 'date and title are required'], 400);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO deadlines (date, title, class_id, type, note, created_at)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$date, $title, $classId !== '' ? $classId : null, $type, $note, time()]);

    json_out([
        'id'      => (int)$pdo->lastInsertId(),
        'date'    => $date,
        'title'   => $title,
        'classId' => $classId,
        'type'    => $type,
        'note'    => $note,
    ], 201);

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $id = (int)($_GET['id'] ?? 0);
    if ($id === 0) {
        json_out(['error' => 'Missing id'], 400);
    }

    $stmt = $pdo->prepare('DELETE FROM deadlines WHERE id = ?');
    $stmt->execute([$id]);

    http_response_code(204);

} else {
    json_out(['error' => 'Method not allowed'], 405);
}
