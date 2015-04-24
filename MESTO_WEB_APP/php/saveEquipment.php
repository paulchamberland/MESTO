<?php
$equip = json_decode(file_get_contents("php://input"), true);
// TODO: htmlspecialchars() and json_decode are not compatible for some reason, find a ways to secure data from XSS

try {
    $con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (empty($equip['id'])) {
        $stmt = $con->prepare("SELECT count(*) as nbEquip FROM equipment WHERE serialNumber = '".$equip['serialNumber']."'");
        $stmt->execute();
        $rs = $stmt->fetchAll();
        
        $arr = array("msg" => "", "error" => "");
        if ($rs[0]['nbEquip'] == 0 && !empty($equip['serialNumber'])) {
            $sql = 'INSERT INTO equipment (serialNumber, barCode, manufacturer, model, configHW, configSW, type, fk_roomId, fk_siteId, updateBy, updateDate)'
                .' values ("'.$equip['serialNumber'].'","'.$equip['barCode'].'","'.$equip['manufacturer'].'","'.$equip['model'].'","'.$equip['configHW'].'","'.$equip['configSW'].'","'.$equip['type'].'","'.$equip['parentRoomKey'].'","'.$equip['parentSiteKey'].'","apps", NOW())';
            $con->exec($sql);
            $arr = array("msg" => "Equipment created successfully!!!", "error" => "");
        } else {
            $arr["error"] = "Equipment already exists with same serial number.";
        }
    }
    else if (!empty($equip['id']) && isset($equip['activity']) && $equip['activity'] == "del") {
        $sql = 'DELETE FROM equipment WHERE id="'.$equip['id'].'"';
        $con->exec($sql);
        $arr = array("msg" => "Equipment deleted successfully!!!", "error" => "");
    }
    else {
        // TODO: Updating a serialNumber? that is unique, need validation, or block that...
        $sql = 'UPDATE equipment SET serialNumber="'.$equip['serialNumber'].'", barCode="'.$equip['barCode'].'", manufacturer="'.$equip['manufacturer'].'", model="'.$equip['model'].'", configHW="'.$equip['configHW'].'", configSW="'.$equip['configSW'].'", type="'.$equip['type'].'", fk_roomId="'.$equip['parentRoomKey'].'", fk_siteId="'.$equip['parentSiteKey'].'", updateBy="apps", updateDate=NOW() WHERE id="'.$equip['id'].'"';
        $con->exec($sql);
        $arr = array("msg" => "Equipment updated successfully!!!", "error" => "");
    }

    $json = json_encode($arr);

    // TODO: Modulirize that
    header('Content-Type: application/json');
    if (!$json) {
        switch (json_last_error()) {
            case JSON_ERROR_NONE:
                echo '[error: JSON - No errors]';
            break;
            case JSON_ERROR_DEPTH:
                echo '[error: JSON  - Maximum stack depth exceeded]';
            break;
            case JSON_ERROR_STATE_MISMATCH:
                echo '[error: JSON  - Underflow or the modes mismatch]';
            break;
            case JSON_ERROR_CTRL_CHAR:
                echo '[error: JSON  - Unexpected control character found]';
            break;
            case JSON_ERROR_SYNTAX:
                echo '[error: JSON  - Syntax error, malformed JSON]';
            break;
            case JSON_ERROR_UTF8:
                echo '[error: JSON  - Malformed UTF-8 characters, possibly incorrectly encoded]';
            break;
            default:
                echo '[error: JSON  - Unknown error]';
            break;
        }
    }
    else {
        echo ")]}',\n";
        echo $json;
    }
}
catch (PDOException $e) {
    /*echo "[error:'".$e->getMessage()."']";*/
    $arr = array("msg" => "", "error" => "Database error, Contact administrator. Try later");
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