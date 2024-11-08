<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");
$id = $_POST['id'] ?? null;

$query = $connection->prepare("SELECT * FROM transactions where user_id = $id");
$query->execute();
$transactions = [];
$result = $query->get_result();

while ($transaction = $result->fetch_assoc()) {
    $transactions[] = $transaction;
}

echo json_encode($transactions);
?>
