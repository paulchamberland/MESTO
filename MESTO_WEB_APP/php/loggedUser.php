<?php
session_id();
session_start();

if (isset($_SESSION['uId']) && isset($_SESSION['user'])) {
    //echo $json = json_encode($_SESSION['user']);
    echo $json = json_encode(array("obj" => $_SESSION['user'], "uId" => $_SESSION['uId']));
}
else {
    // DELETE the possible create sessions
}
?>