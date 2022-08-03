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
$title = $mysqli->real_escape_string($json_obj['title']);
$tag = $mysqli->real_escape_string($json_obj['tag']);
$time = $mysqli->real_escape_string($json_obj['time']);

//Check if an event is selected
if($id == null){
    echo json_encode(
        array(

            'success' => false
            
        )
    );
    exit;
}



//prepare Query
$stmt = $mysqli->prepare("UPDATE `events` SET `title` = ?, `time` = ?, `tag` = ?  WHERE `events`.`id` = ?;");
$stmt->bind_param('sssd', $title, $time, $tag, $id);
$stmt->execute();


 
$arr = array(
    'success' => true,
    'id' => $id,
    'title' => $title,
    'time' => $time, 
    'tag' => $tag
);

echo json_encode(
    $arr
);

?>