<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../cinfo/env.php';

require "../cinfo/config.php";
require "../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$errorMessages = [];

$secretKey = $_ENV['JWT_SECRET'];

function sanitizeInput(string $input): string
{
    return trim(htmlspecialchars(strip_tags($input), ENT_QUOTES, 'UTF-8'));
}

function validateInput(array $data): array
{
    $errors = [];

    if ($data['username'] === '' || $data['password'] === '') {
        $errors[] = "username en wachtwoord zijn verplicht!";
    }

    if ($data['email'] === '') {
        $errors[] = "Geen e-mailadres ingevoerd!";
    } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Ongeldig e-mailadres!";
    }

    return ['errors' => $errors, 'data' => $data];
}

function registerUser(PDO $pdo, array $data): int|string
{
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare(
            "INSERT INTO users (username, password, email) 
            VALUES (:username, :password, :email)"
        );
        $stmt->execute([
            'username' => $data['username'],
            'password' => $hashedPassword,
            'email' => $data['email'],
        ]);
        
        return (int)$pdo->lastInsertId();
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) return "Username or Email already exists!";
        return "Database error!";
    }
}

function generateJWT(int $userId, string $username, string $secretKey): string
{
    $payload = [
        'iat' => time(),
        'exp' => time() + (10080 * 60),
        'user_id' => $userId,
        'username' => $username
     ];

    return JWT::encode($payload, $secretKey, 'HS256');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = [
        'username' => sanitizeInput($_POST['username'] ?? ''),
        'password' => $_POST['password'] ?? '',
        'email' => sanitizeInput($_POST['email'] ?? '')
    ];

    $validationResult = validateInput($input);
    $errorMessages = $validationResult['errors'];
    $input = $validationResult['data'];

    if (empty($errorMessages)) {
        $result = registerUser($pdo, $input);

        if (is_int($result)) {
            $token = generateJWT($result, $input['username'], $secretKey);
            header ('Content-Type: application/json');
            echo json_encode(['token' => $token]);
            exit;
        } else {
            header("Content-Type: application/json", true, 400);
            echo json_encode(['error' => $result]);
            exit;
        }
    } else {
        header("Content-Type: application/json", true, 400);
        echo json_encode(['errors' => $errorMessages]);
        exit;
    }
}