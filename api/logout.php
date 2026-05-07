<?php
require_once __DIR__ . '/_helpers.php';

session_start_once();
session_destroy();

http_response_code(204);
