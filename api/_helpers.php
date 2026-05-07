<?php
function session_start_once(): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_set_cookie_params([
            'httponly' => true,
            'samesite' => 'Lax',
            'path'     => '/',
        ]);
        session_start();
    }
}

function json_out(mixed $data, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function require_login(): string {
    session_start_once();
    if (empty($_SESSION['student_id'])) {
        json_out(['error' => 'Unauthorized'], 401);
    }
    return $_SESSION['student_id'];
}

function read_json_body(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}
