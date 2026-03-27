<?php

header('Content-Type: application/json');

try {
    require_once '../config.php';

    $stmt = $pdo->prepare("SELECT * FROM bottles");
    $stmt->execute();
    $deposits = $stmt->fetchAll();

    echo json_encode($deposits);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
