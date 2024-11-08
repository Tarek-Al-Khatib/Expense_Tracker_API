<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$query = $connection->prepare("SELECT * FROM transactions");
$query->execute();
$transactions = [];
$result = $query->get_result();

while ($transaction = $result->fetch_assoc()) {
    $transactions[] = $transaction;
}

echo json_encode($transactions);
?>
