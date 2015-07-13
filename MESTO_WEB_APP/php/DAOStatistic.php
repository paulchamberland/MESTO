<?php
try {
    echo ")]}',\n";
    $arr = array();
    
    //$data = json_decode(file_get_contents("php://input"), true);
    
	$con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $con->prepare("SELECT count(*) from site;");
    $stmt->execute();
	$rs = $stmt->fetchAll();
    $arr['nbSite'] = $rs[0][0];
    
    $stmt = $con->prepare("SELECT count(*) from site WHERE updateDate >= DATE_SUB(now(), INTERVAL 1 MONTH)");
    $stmt->execute();
	$rs = $stmt->fetchAll();
    $arr['nbSiteModified'] = $rs[0][0];
    
    $stmt = $con->prepare("SELECT count(*) from mtuser ");
    $stmt->execute();
	$rs = $stmt->fetchAll();
    $arr['nbUser'] = $rs[0][0];
    
    $stmt = $con->prepare("SELECT count(*) from mtuser WHERE updateDate >= DATE_SUB(now(), INTERVAL 1 MONTH)");
    $stmt->execute();
	$rs = $stmt->fetchAll();
    $arr['nbUserModified'] = $rs[0][0];
    
    $stmt = $con->prepare("SELECT count(*) from equipment;");
    $stmt->execute();
	$rs = $stmt->fetchAll();
    $arr['nbEquipment'] = $rs[0][0];
    
    $stmt = $con->prepare("SELECT count(*) from equipment WHERE updateDate >= DATE_SUB(now(), INTERVAL 1 MONTH)");
    $stmt->execute();
	$rs = $stmt->fetchAll();
    $arr['nbEquipmentModified'] = $rs[0][0];
    
    $stmt = $con->prepare("SELECT count(*) from mtuser WHERE approved=0;");
    $stmt->execute();
	$rs = $stmt->fetchAll();
    $arr['nbPendingUser'] = $rs[0][0];
    
    $json = json_encode($arr);
    echo $json;
}
catch (PDOException $e) {
    $arr = array("msgError" => $e->getMessage(), "error" => "Database error, Contact administrator. Try later");
    header('Content-Type: application/json');
	echo $json = json_encode($arr);
}
catch (Exception $e) {
	echo "[error:'".$e->getMessage()."']";
}
finally {
    $con = null;
}
?>