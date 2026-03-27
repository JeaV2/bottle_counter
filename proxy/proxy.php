<?php

declare(strict_types=1);

/*
 * Minimal Arduino HTTP -> School HTTPS proxy.
 *
 * Run locally with:
 * php -S 0.0.0.0:8071 proxy.php
*/

// Get environment variable for shared secret, or use a default for testing.
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            putenv(trim($line));
        }
    }
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Proxy misconfigured: .env file not found']);
    exit;
}

$SCHOOL_ENDPOINT = getenv('FORWARD_URL');

$sharedSecret = getenv('SHARED_SECRET') ?: '';
if ($sharedSecret === '') {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Proxy misconfigured: SHARED_SECRET missing in .env']);
    exit;
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
if ($path !== '/api/deposit-proxy') {
    http_response_code(404);
    echo json_encode(['ok' => false, 'error' => 'not_found']);
    exit;
}

$providedSecret = $_SERVER['HTTP_X_PROXY_SECRET'] ?? '';
if (!hash_equals($sharedSecret, $providedSecret)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'invalid_shared_secret']);
    exit;
}

// Arduino sends application/x-www-form-urlencoded.
$formData = $_POST;
if (empty($formData)) {
    parse_str(file_get_contents('php://input'), $formData);
}

$forwardPayload = [
    'device_id' => $formData['device_id'] ?? 'unknown-device',
    'event' => $formData['event'] ?? 'bottle_detected',
    'sent_at' => $formData['sent_at'] ?? gmdate(DATE_ATOM),
];

$ch = curl_init($SCHOOL_ENDPOINT);
if ($ch === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'curl_init_failed']);
    exit;
}

$body = json_encode($forwardPayload);
if ($body === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'json_encode_failed']);
    exit;
}

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
    ],
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS => 5,
    CURLOPT_POSTREDIR => CURL_REDIR_POST_ALL,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
]);

$responseBody = curl_exec($ch);
$curlErrNo = curl_errno($ch);
$curlError = curl_error($ch);
$statusCode = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);

if ($curlErrNo !== 0) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => 'forward_failed',
        'details' => $curlError,
    ]);
    exit;
}

http_response_code($statusCode > 0 ? $statusCode : 200);
echo json_encode([
    'ok' => $statusCode >= 200 && $statusCode < 300,
    'forwarded_to' => $SCHOOL_ENDPOINT,
    'status_code' => $statusCode,
    'school_response' => $responseBody,
]);
