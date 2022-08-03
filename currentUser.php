
<?php
header("Content-Type: application/json"); 
//HTTP-Only Cookies
ini_set("session.cookie_httponly", 1);
session_start();

//Check if the user is logged in and reponse with the current user
if(isset($_SESSION['username'])){
    echo json_encode(
        array(

            'success' => true,
            'user' => $_SESSION['username']
            
        )
    );
    exit; 
}
else{
    echo json_encode(
        array(

            'success' => false,
            'user' => $_SESSION['username']
            
        )
    );
    exit;
}
 
?>  