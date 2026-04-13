<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    require '../../auth/verfify_token/index.php';
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    $token = '';
    if (preg_match('/Token\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
    }
    $verificationResult = verifyToken($token);
    if ($verificationResult['valid']) {
        require '../../cinfo/config.php';
        $userData = $verificationResult['data'];
        $stmt = $pdo->prepare("SELECT bottles FROM users WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $userData->user_id]);
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($stats);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token', 'details' => $verificationResult['error']]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}