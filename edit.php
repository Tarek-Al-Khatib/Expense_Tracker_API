<?php
include "connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$id = $_POST['id'];
$type = $_POST['type'];
$amount = $_POST['amount'];
$date = $_POST['date'];
$notes = $_POST['notes'];

$query = $connection->prepare("UPDATE transactions SET type = ?, amount = ?, date = ?, notes = ? WHERE id = ?");
$query->bind_param("sdssi", $type, $amount, $date, $notes, $id);
$query->execute();

echo json_encode(["status" => "success"]);
?>
