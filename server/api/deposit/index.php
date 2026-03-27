<?php

header('Content-Type: application/json');

$newCount = 0;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    require_once '../config.php';
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Get current count of bottles
    $stmt = $pdo->prepare("SELECT * FROM bottles");
    $stmt->execute();
    $result = $stmt->fetch();
    $currentCount = $result['bottleCount'];

    // Increment the count
    $newCount = $currentCount + 1;
    // Get the current timestamp
    $timestamp = date('Y-m-d H:i:s');
    // Update the count in the database
    $updateStmt = $pdo->prepare("UPDATE bottles SET bottleCount = :count, date = :timestamp");
    $updateStmt->execute(
        [
            ':count' => $newCount,
            ':timestamp' => $timestamp
        ]
    );
    echo json_encode(['message' => 'Count updated successfully', 'new_count' => $newCount]);

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}