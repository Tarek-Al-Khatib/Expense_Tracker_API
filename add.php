<?php
include "connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$type = $_POST['type'];
$amount = $_POST['amount'];
$date = $_POST['date'];
$notes = $_POST['notes'];

$query = $connection->prepare("INSERT INTO transactions (type, amount, date, notes) VALUES (?, ?, ?, ?)");
$query->bind_param("sdss", $type, $amount, $date, $notes);
$query->execute();

echo json_encode(["status" => "success"]);
?>
