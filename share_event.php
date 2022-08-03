<?php

//HTTP-Only Cookies
ini_set("session.cookie_httponly", 1);
session_abort();
header("Content-Type: application/json");
require 'database.php';

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$id = $json_obj["event_id"];
$user = $mysqli->real_escape_string($json_obj['share_user']);

$stmt = $mysqli -> prepare("INSERT INTO events (SELECT null, ?, title, content, time, tag from events WHERE id=?)");
$stmt->bind_param('sd', $user, $id);
$stmt->execute();
 
$arr = array(
    'id' => $id,
    'share_user' => $user,
);

echo json_encode(
    $arr
);


?>