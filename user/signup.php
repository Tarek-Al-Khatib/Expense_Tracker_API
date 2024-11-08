<?php
include "../config/connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$username = $_POST['username'] ?? null;
$password = $_POST['password'] ?? null;

if (!$username || !$password) {
    echo json_encode(["status" => "error", "message" => "Missing username or password"]);
    exit;
}

$query = $connection->prepare("SELECT id FROM users WHERE username = ?");
$query->bind_param("s", $username);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Username already exists"]);
} else {
    $query = $connection->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $query->bind_param("ss", $username, $password);
    $query->execute();
    echo json_encode(["status" => "success", "message" => "User registered successfully"]);
}
?>
