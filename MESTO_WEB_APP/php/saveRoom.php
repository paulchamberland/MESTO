<?php
$room = json_decode(file_get_contents("php://input"), true);
// TODO: htmlspecialchars() and json_decode are not compatible for some reason, find a ways to secure data from XSS

try {
    $con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $arr = array("msg" => "", "error" => "");
    
    if (!empty($room['id']) && isset($room['activity']) && $room['activity'] == "del") {
        $sql = 'DELETE FROM room WHERE id="'.$room['id'].'"';
        $con->exec($sql);
        $arr["msg"] = "Room deleted successfully!!!";
    }
    else if (!empty($room['id']) && isset($room['activity']) && $room['activity'] == "rem-ass-st|rm") {
        $sql = 'UPDATE room SET fk_siteId="" WHERE id="'.$room['id'].'"';
        $con->exec($sql);
        $arr["msg"] = "Association with room ended successfully!!!";
    }
    else if (!empty($room['roomID'])) {
        $sql = "SELECT count(*) as nbRoom FROM room WHERE roomID = '".$room['roomID']."'";
        
        if (!empty($room['id'])) {
            $sql .= " AND NOT id = '".$room['id']."'";
        }
        
        $stmt = $con->prepare($sql);
        $stmt->execute();
        $rs = $stmt->fetchAll();
            
        if (empty($room['id'])) {
            if ($rs[0]['nbRoom'] == 0) {
                $sql = 'INSERT INTO room (roomID, pointOfContact, technicalPointOfContact, role, roomSize, fk_siteId, updateBy, updateDate)'
                    .' values ("'.$room['roomID'].'","'.$room['pointOfContact'].'","'.$room['technicalPointOfContact'].'","'.$room['role'].'","'.$room['roomSize'].'","'.$room['parentSiteKey'].'","apps", NOW())';
                $con->exec($sql);
                $arr["msg"] = "Room created successfully!!!";
            } else {
                $arr["error"] = "Room already exists with same room ID.";
            }
        }
        else {
            if ($rs[0]['nbRoom'] == 0) {
                $sql = 'UPDATE room SET roomID="'.$room['roomID'].'", pointOfContact="'.$room['pointOfContact'].'", technicalPointOfContact="'.$room['technicalPointOfContact'].'", role="'.$room['role'].'", roomSize="'.$room['roomSize'].'", fk_siteId="'.$room['parentSiteKey'].'", updateBy="apps", updateDate=NOW() WHERE id="'.$room['id'].'"';
                $con->exec($sql);
                $arr["msg"] = "Room updated successfully!!!";
            } else {
                $arr["error"] = "Update failed: Room already exists with same room ID.";
            }
        }
    }
    
    $json = json_encode($arr);

    // TODO: Modularize that
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
    /*echo "[error:'".$e->getMessage()."']";*/ // TODO: when appends put that in a for better consultation
    $arr = array("msg" => "", "error" => "Database error, Contact administrator. Try later : ".htmlspecialchars($e->getMessage()));
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