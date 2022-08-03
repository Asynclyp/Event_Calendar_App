<?php
  
//HTTP-Only Cookies
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';
header("Content-Type: application/json");
 
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$author = $_SESSION['username'];
$author = $mysqli->real_escape_string($author);

$time = $json_obj["time"];
$time = $mysqli->real_escape_string($time);

$title = $json_obj["title"];
$title = $mysqli->real_escape_string($title);

$tag = $json_obj["tag"];
$tag = $mysqli->real_escape_string($tag);

// $shared = $json_obj["shared"];
// $shared = $mysqli->real_escape_string($shared);

$a = $json_obj["1"];
$b = $json_obj["2"];
$c = $json_obj["3"];
$d = $json_obj["4"];
$e = $json_obj["5"];

$shared = array($a,$b,$c,$d,$e);

//$ppl = $mysqli->real_escape_string($ppl);

//Create Event
$stmt = $mysqli->prepare("INSERT INTO `events` (`id`, `author`, `title`, `content`, `time`, `tag`) VALUES (NULL, ?, ?, '', ?, ?);");

$stmt->bind_param('ssss', $author, $title, $time, $tag);

$stmt->execute();

$stmt->close();


//worked
// $stmt = $mysqli->prepare("INSERT INTO `events` (`id`, `author`, `title`, `content`, `time`, `tag`) VALUES (NULL, ?, ?, '', ?, ?);");

// $stmt->bind_param('ssss', $shared, $title, $time, $tag);

// $stmt->execute();

// $stmt->close();


// //get id
// $stmt = $mysqli->prepare("SELECT id FROM events Where title=? and author=? and tag=?");
// $stmt->bind_param("sss", $title, $author, $tag);  

// $stmt->execute();
// $stmt->bind_result($id);
// $stmt->close();

// $arr = array(
//     'id' => $id
// );

// echo json_encode(
//     $arr
// );

// exit;

// //share event
// foreach($shared as $person){
//     $stmt = $mysqli->prepare("INSERT INTO `events` (`id`, `author`, `title`, `content`, `time`, `tag`) VALUES (NULL, ?, ?, '', ?, ?);");

//     $stmt->bind_param('ssss', $person, $title, $time, $tag);

//     $stmt->execute();

//     $stmt->close();
// }

for($i=0;$i<5;$i++){
    $stmt = $mysqli->prepare("INSERT INTO `events` (`id`, `author`, `title`, `content`, `time`, `tag`) VALUES (NULL, ?, ?, '', ?, ?);");

    $stmt->bind_param('ssss', $shared[$i], $title, $time, $tag);

    $stmt->execute();

    $stmt->close();
}




$arr = array(
    'title' => $title,
    'time' => $time,
    'shared' => $shared[0]
);

echo json_encode(
    $arr
);



?> 