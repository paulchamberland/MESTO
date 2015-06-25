<?php
$userRole = json_decode(file_get_contents("php://input"), true);
// TODO: htmlspecialchars() and json_decode are not compatible for some reason, find a ways to secure data from XSS

try {
    $con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $arr = array("msg" => "", "error" => "");
    
    if (!empty($userRole['id']) && isset($userRole['activity']) && $userRole['activity'] == "del") {
        $sql = 'DELETE FROM userrole WHERE id="'.$userRole['id'].'"';
        $con->exec($sql);
        $arr["msg"] = "Role deleted successfully!!!";
    }
    else if (!empty($userRole['name'])) {
        $sql = "SELECT count(*) as nbUserRole FROM userrole WHERE name = '".$userRole['name']."'";
        if (!empty($userRole['id'])) {
            $sql .= " AND NOT id = '".$userRole['id']."'";
        }
        
        $stmt = $con->prepare($sql);
        $stmt->execute();
        $rs = $stmt->fetchAll();
            
        if (empty($userRole['id'])) {
            if ($rs[0]['nbUserRole'] == 0) {
                $sql = 'INSERT INTO userrole (name, description, list_permissions, updateBy, updateDate)'
                    .' values ("'.$userRole['name'].'","'.$userRole['description'].'","'.$userRole['lstPermissions'].'","'.$userRole['updateBy'].'", NOW())';
                $con->exec($sql);
                $arr["msg"] = "Role created successfully!!!";
            } else {
                $arr["error"] = "Role already exists with same name.";
            }
        }
        else {
            if ($rs[0]['nbUserRole'] == 0) {
                $sql = 'UPDATE userrole SET name="'.$userRole['name'].'", description="'.$userRole['description'].'", list_permissions="'.$userRole['lstPermissions'].'", updateBy="'.$userRole['updateBy'].'", updateDate=NOW() WHERE id="'.$userRole['id'].'"';
                
                $con->exec($sql);
                $arr["msg"] = "Role updated successfully!!!";
            } else {
                $arr["error"] = "Update failed: Role already exists with same name.";
            }
        }
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
    /*echo "{error:'".$e->getMessage()."'}";*/
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