<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    require '../../auth/verfify_token/index.php';
    $data = json_decode(file_get_contents('php://input'), true);
    $token = $data['token'] ?? "";
    $verificationResult = verifyToken($token);
    if ($verificationResult['valid']) {
        require '../../cinfo/config.php';
        $userData = $verificationResult['data'];
        $stmt = $pdo->prepare("UPDATE association SET associated_id = :user_id WHERE id = 1");
        $stmt->execute(['user_id' => $userData->user_id]);

        $stmt = $pdo->prepare("UPDATE users SET last_associated = NOW() WHERE user_id = :user_id");
        $stmt->execute(['user_id' => $userData->user_id]);
        echo json_encode(['message' => 'Association updated successfully']);
        
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token', 'details' => $verificationResult['error']]);
    }

    exit;
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}