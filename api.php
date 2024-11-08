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
        echo json_decode(["status" => "success"]);
        break;
}