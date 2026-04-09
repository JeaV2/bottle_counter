<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../cinfo/env.php';

require "../cinfo/config.php";
require "../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secretKey = $_ENV['JWT_SECRET'];

function sanitizeInput($input) {
    return trim(htmlspecialchars(strip_tags($input), ENT_QUOTES, 'UTF-8'));
}

function getUserByUsername($pdo, $username) {
    $query = "SELECT * FROM users WHERE username = :username";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getUserByEmail($pdo, $email) {
    $query = "SELECT * FROM users WHERE email = :email";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function generateToken($user, $secretKey) {
    $payload = [
        'iat' => time(),
        'exp' => time() + (10080 * 60),
        'user_id' => $user['user_id'],
        'username' => $user['username']
    ];

    return JWT::encode($payload, $secretKey, 'HS256');
}

function handleLogin($pdo, $secretKey) {
    $error = '';

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $username = isset($_POST['username']) ? sanitizeInput($_POST['username']) : null;
        $email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : null;
        $password = isset($_POST['password']) ? sanitizeInput($_POST['password']) : null;

        if ($username && $password) {
            $user = getUserByUsername($pdo, $username);
            if ($user && password_verify($password, $user['password'])) {
                $token = generateToken($user, $secretKey);
                sendJsonResponse(['token' => $token, 'user_id' => $user['user_id'], 'username' => $user['username']]);
            } else {
                $error = "Username or Password doesn't match!";
            }
        } elseif ($email && $password) {
            $user = getUserByEmail($pdo, $email);
            if ($user && password_verify($password, $user['password'])) {
                $token = generateToken($user, $secretKey);
                sendJsonResponse(['token' => $token, 'user_id' => $user['user_id'], 'username' => $user['username']]);
            } else {
                $error = "Email or Password doesn't match!";
            }
        } else {
            $error = "Please enter either username or email and password!";
        }
    }

    if (!empty($error)) {
        http_response_code(400);
        sendJsonResponse(['error' => $error]);
    }
}

function sendJsonResponse($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

handleLogin($pdo, $secretKey);