<?php
include "connection.php";

$action = $_POST['action'] ?? null;
//https://www.w3schools.com/php/php_switch.asp
switch($action) {
  case 'add':
        $type = $_POST['type'];
        $amount = $_POST['amount'];
        $date = $_POST['date'];
        $notes = $_POST['notes'];
        $query = $connection->prepare("INSERT INTO transactions (type, amount, date, notes) VALUES (?, ?, ?, ?)");
        //https://www.w3schools.com/php/php_mysql_prepared_statements.asp
        $query->bind_param("sdss", $type, $amount, $date, $notes);
        $query->execute();
        echo json_encode(["status" => "success"]);
        break;
  case 'edit':
        $id = $_POST['id'];
        $type = $_POST['type'];
        $amount = $_POST['amount'];
        $date = $_POST['date'];
        $notes = $_POST['notes'];

        $query = $connection->prepare("UPDATE transactions SET type = ?, amount = ?, date = ?, notes = ? WHERE id = ?");
        $query->bind_param("sdssi", $type, $amount, $date, $notes, $id);
        $query->execute();
        echo json_encode(["status" => "success"]);
        break;
  case 'get':
        echo "anything";
        $query = $connection->prepare("SELECT * FROM transactions");
        $query->execute();
        $transactions = [];
        $result = $query->get_result();
        while($transaction = $result->fetch_assoc()) {
          $transactions[] = $transaction;
        }
        echo json_encode($transactions);
        break;
}