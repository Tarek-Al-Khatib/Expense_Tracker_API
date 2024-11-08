<?php
include "connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$id = $_POST['id'];

$query = $connection->prepare("DELETE FROM transactions WHERE id = ?");
$query->bind_param("i", $id);
$query->execute();

echo json_encode(["status" => "success"]);
?>
