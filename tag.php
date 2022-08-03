<?php
//HTTP-Only Cookies
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';
header("Content-Type: application/json");

$author = $_SESSION['username'];
$author = $mysqli->real_escape_string($author);

$stmt = $mysqli->prepare("SELECT distinct tag FROM events Where author=?");

$stmt->bind_param("s", $author);
$stmt->execute();
$stmt->bind_result($tag);

$arr = array();

while($stmt->fetch()){
    array_push($arr, $tag);
}
 
echo json_encode(
    $arr
);


?>