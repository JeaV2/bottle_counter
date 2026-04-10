<?php

require '../../cinfo/env.php';
require "../../cinfo/config.php";
require "../../vendor/autoload.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;


function verifyToken($token) {
    $secretKey = $_ENV['JWT_SECRET'];
    try {
        $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
        return ['valid' => true, 'data' => $decoded];
    } catch (Exception $e) {
        return ['valid' => false, 'error' => $e->getMessage()];
    }
}