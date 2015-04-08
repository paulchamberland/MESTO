<?php
$room = json_decode(file_get_contents("php://input"), true);
// TODO : remove html and script from data.

try {
    $con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (empty($room['id'])) {
        $stmt = $con->prepare("SELECT count(*) as nbRoom FROM room WHERE roomID = '".$room['roomID']."'");
        $stmt->execute();
        $rs = $stmt->fetchAll();
        
        $arr = array("msg" => "", "error" => "");
        if ($rs[0]['nbRoom'] == 0) {
            $sql = 'INSERT INTO room (roomID, pointOfContact, technicalPointOfContact, role, roomSize, updateBy, updateDate)'
                .' values ("'.$room['roomID'].'","'.$room['pointOfContact'].'","'.$room['technicalPointOfContact'].'","'.$room['role'].'","'.$room['roomSize'].'","apps", NOW())';
            $con->exec($sql);
            $arr = array("msg" => "Room created successfully!!!", "error" => "");
        } else {
            $arr["error"] = "Room already exists with same room ID.";
        }
    }
    else if (!empty($room['id']) && isset($room['activity']) && $room['activity'] == "del") {
        $sql = 'DELETE FROM room WHERE id="'.$room['id'].'"';
        $con->exec($sql);
        $arr = array("msg" => "Room deleted successfully!!!", "error" => "");
    }
    else {
        // TODO: Updating a roomID? that is unique, need validation, or block that...
        $sql = 'UPDATE room SET roomID="'.$room['roomID'].'", pointOfContact="'.$room['pointOfContact'].'", technicalPointOfContact="'.$room['technicalPointOfContact'].'", role="'.$room['role'].'", roomSize="'.$room['roomSize'].'", updateBy="apps", updateDate=NOW() WHERE id="'.$room['id'].'"';
        $con->exec($sql);
        $arr = array("msg" => "Room updated successfully!!!", "error" => "");
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