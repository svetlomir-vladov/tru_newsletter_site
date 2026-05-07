<?php
require_once __DIR__ . '/_helpers.php';

require_login();

json_out($_SESSION['student']);
