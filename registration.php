<?php

//HTTP-Only Cookies
ini_set("session.cookie_httponly", 1);
require 'database.php';

session_start();

// login_ajax.php

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $json_obj["username_reg"];
$password = $json_obj["password_reg"];
$password2 =$json_obj["password2"];


$username = $mysqli->real_escape_string($username);
$password = $mysqli->real_escape_string($password);
$password2 = $mysqli->real_escape_string($password2);

 
# make sure the two password are the same

if($password != $password2){
    echo json_encode(array(
		"success" => false,
		"message" => "Please enter the same password."
	));
	exit;
}
else{

    $stmt = $mysqli->prepare("SELECT COUNT(*) FROM user WHERE username=?");

    if (!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Query Preparation Failed."
        ));
        exit;
        
    } 
    else{
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $stmt->bind_result($cnt);
        $stmt->fetch();
        if($cnt != 0){
            echo json_encode(array(
                "success" => false,
                "message" => "Username already exists."
            ));
            exit;
        }
        else{
            $stmt->close();
            $stmt = $mysqli->prepare("insert into user (username, password) values (?, ?)");
            if (!$stmt){
                printf("Query Prep Failed: %s\n", $mysqli->error);
                echo json_encode(array(
                    "success" => false,
                    "message" => "Query Preparation Failed."
                ));
                exit;
            }

            # hash the password input
            $hash_pswd = password_hash($password, PASSWORD_BCRYPT);


            #bind input and execute
            $stmt->bind_param("ss", $username, $hash_pswd);
            $stmt->execute();
            $stmt->close();

            //$_SESSION['message'] = 'Registration Succeeed :)';

            echo json_encode(array(
                "success" => true,

            ));
            exit;
        }
        
    }
    

    

    # prepare the Query
    
    

}
