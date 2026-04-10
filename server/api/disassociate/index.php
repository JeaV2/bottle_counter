<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    require '../../auth/verfify_token/index.php';
    $data = json_decode(file_get_contents('php://input'), true);
    $token = $data['token'] ?? "";
    $verificationResult = verifyToken($token);
    if ($verificationResult['valid']) {
        require '../../cinfo/config.php';
        $stmt = $pdo->prepare("UPDATE association SET associated_id = 0 WHERE id = 1");
        $stmt->execute();
        echo json_encode(['message' => 'Disassociation successful']);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token', 'details' => $verificationResult['error']]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}