<?php
header('Content-Type: text/plain');
require '../vendor/autoload.php';
require './config.php';

$eventHanlers = explode("\n", $eventHanlers);
$tags = explode("\n", $tags);

$sanitizer = new \Phlib\XssSanitizer\Sanitizer($tags, $eventHanlers);
$sanitized = $sanitizer->sanitize($_REQUEST['html'] ?? '');

echo $sanitized;