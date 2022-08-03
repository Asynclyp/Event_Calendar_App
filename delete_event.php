<?php

//HTTP-Only Cookies
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$id = $json_obj["id"];

//prepare Query
$stmt = $mysqli->prepare("DELETE FROM `events` WHERE `events`.`id` = ?");
$stmt->bind_param('d', $id);
$stmt->execute();

?>  