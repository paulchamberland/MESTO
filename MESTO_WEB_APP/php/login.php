<?php
$logInfo = json_decode(file_get_contents("php://input"), true);
header('Content-Type: application/json');

try {
    $con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $con->prepare("SELECT id, password FROM mtuser WHERE active = true AND username = '".$logInfo['username']."';");
    $stmt->execute();
    $rs = $stmt->fetchAll();
    
    if (sizeOf($rs) > 0) {
        if (password_verify($logInfo['pwd'], $rs[0]['password'])) {
            session_start();
            $_SESSION['uId'] = uniqid($rs[0]['id']);
            echo $json = json_encode(array("msg" => "Login success", "error" => "", "obj" => $rs[0]['id'], "uId" => $_SESSION['uId']));
        }
        else {
            // user Invalid password.
            echo $json = json_encode(array("msg" => "", "error" => "Login Failed"));
        }
    }
    else {
        // user not found
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