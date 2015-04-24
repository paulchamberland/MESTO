<?php
$logInfo = json_decode(file_get_contents("php://input"), true);
header('Content-Type: application/json');

try {
    $con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $con->prepare("SELECT count(*) as nbUser FROM mtuser WHERE username = '".$logInfo['username']."' AND password='".$logInfo['pwd']."';");
    $stmt->execute();
    $rs = $stmt->fetchAll();
    
    if ($rs[0]['nbUser'] == 1) {
        // TODO: PHP START SESSION
        
        echo $json = json_encode(array("msg" => "Login success", "error" => ""));
    }
    else {
        echo $json = json_encode(array("msg" => "", "error" => "Login Failed"));
    }
}
catch (PDOException $e) {
    /*echo "[error:'".$e->getMessage()."']";*/ // TODO: when appends put that in a for better consultation
    $arr = array("msg" => "", "error" => "Database error, Contact administrator. Try later : ".htmlspecialchars($e->getMessage()));
	echo $json = json_encode($arr);
}
catch (Exception $e) {
	echo "[error:'".$e->getMessage()."']";
}
finally {
    $con = null;
}