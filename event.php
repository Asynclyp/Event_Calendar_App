<?php

//HTTP-Only Cookies
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';
header("Content-Type: application/json");

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');

//This will store the data into an associative array
$json_obj = json_decode($json_str, true);
 
//Variables can be accessed as such:
$month = $json_obj["month"];
$author = $_SESSION['username'];
$author = $mysqli->real_escape_string($author);

$cur_tag = $json_obj['cur_tag'];
$cur_tag = $mysqli->real_escape_string($cur_tag);

if($cur_tag == 'All Events'){
    $stmt = $mysqli->prepare("SELECT title, tag, author, time, id FROM events Where MONTH(time)=? and author=?");
    $stmt->bind_param("ds", $month, $author);   
}
else{
    $stmt = $mysqli->prepare("SELECT title, tag, author, time, id FROM events Where MONTH(time)=? and author=? and tag=?");
    $stmt->bind_param("dss", $month, $author, $cur_tag);   
}

//get events by SQL Query

$stmt->execute();
$stmt->bind_result($title, $tag, $author, $time, $id);

$arr = array();

while($stmt->fetch()){
 
    //convert timestamp from 
    $timestamp = strtotime($time);

    array_push(
        $arr,
        array(
            'title' => $title,
            'tag' => $tag,
            'author' => $author,
            'year' => date("Y", $timestamp),
            'month' => date("m", $timestamp),
            'day' => date("d", $timestamp),
            'time' => date("H:i", $timestamp),
            'id' => $id,
        )
    );
}

echo json_encode(
    $arr
);

?>
