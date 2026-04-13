<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    require '../../cinfo/config.php';
    $stmt = $pdo->prepare("SELECT username, bottles FROM users ORDER BY bottles DESC LIMIT 5");
    $stmt->execute();
    $leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([$leaderboard]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}