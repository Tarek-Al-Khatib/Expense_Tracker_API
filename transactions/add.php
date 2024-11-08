<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$type = $_POST['type'];
$amount = $_POST['amount'];
$date = $_POST['date'];
$notes = $_POST['notes'];
$user_id = $_POST['userid'];

$query = $connection->prepare("INSERT INTO transactions (type, amount, date, notes, user_id) VALUES (?, ?, ?, ?,?)");
$query->bind_param("sdssi", $type, $amount, $date, $notes, $user_id);
$query->execute();

echo json_encode(["status" => "success"]);
?>
