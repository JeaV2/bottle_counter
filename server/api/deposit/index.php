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

    // Check if a person is associated and update their bottle count
    $assocStmt = $pdo->prepare("SELECT associated_id FROM association WHERE id = 1");
    $assocStmt->execute();
    $assocResult = $assocStmt->fetch();
    if ($assocResult && $assocResult['associated_id']) {
        $userId = $assocResult['associated_id'];
        $userUpdateStmt = $pdo->prepare("UPDATE users SET bottles = bottles + 1 WHERE user_id = :user_id");
        $userUpdateStmt->execute([':user_id' => $userId]);

        // Reset the association
        $resetAssocStmt = $pdo->prepare("UPDATE association SET associated_id = 0 WHERE id = 1");
        $resetAssocStmt->execute();
        echo json_encode(['message' => 'Count updated successfully', 'new_count' => $newCount, 'user_id' => $userId, 'user_bottle_count' => $userUpdateStmt->rowCount() > 0 ? 'updated' : 'not updated']);
        exit;
    }

    echo json_encode(['message' => 'Count updated successfully', 'new_count' => $newCount]);

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}