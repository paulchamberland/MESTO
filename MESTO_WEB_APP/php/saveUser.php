<?php
$user = json_decode(file_get_contents("php://input"), true);
// TODO: htmlspecialchars() and json_decode are not compatible for some reason, find a ways to secure data from XSS

try {
    $con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $arr = array("msg" => "", "error" => "");
    
    if (!empty($user['id']) && isset($user['activity']) && $user['activity'] == "del") {
        $sql = 'DELETE FROM mtuser WHERE id="'.$user['id'].'"';
        $con->exec($sql);
        $arr["msg"] = "User deleted successfully!!!";
    }
    else if (isset($user['activity']) && $user['activity'] == "chgPWD") {
        $sql = 'UPDATE mtuser SET password="'.password_hash($user['password'], PASSWORD_BCRYPT).'" WHERE id="'.$user['id'].'"';
        
        $con->exec($sql);
        $arr["msg"] = "User password updated successfully!!!";
    }
    else if (!empty($user['username']) && !empty($user['email'])) {
        $sql = "SELECT count(*) as nbUser FROM mtuser WHERE (username = '".$user['username']."' OR email = '".$user['email']."')";
        // TODO: split the userName and email validation with some ajax call.
        if (!empty($user['id'])) {
            $sql .= " AND NOT id = '".$user['id']."'";
        }
        
        $stmt = $con->prepare($sql);
        $stmt->execute();
        $rs = $stmt->fetchAll();
            
        if (empty($user['id'])) {
            if ($rs[0]['nbUser'] == 0) {
                $sql = 'INSERT INTO mtuser (username, password, name, email, title, supervisor, fk_userRoleId, active, approved, address, phone, updateBy, updateDate)'
                    .' values ("'.$user['username'].'","'.password_hash($user['password'], PASSWORD_BCRYPT).'","'.$user['name'].'","'.$user['email'].'","'
                        .$user['title'].'","'.$user['supervisor'].'","'.$user['role'].'","'.$user['active'].'","'.$user['approved'].'","'.$user['address'].'","'.$user['phone'].'","apps", NOW())';
                $con->exec($sql);
                $arr["msg"] = "User created successfully!!!";
            } else {
                $arr["error"] = "User already exists with same username or email.";
            }
        }
        else {
            if ($rs[0]['nbUser'] == 0) {
                $sql = 'UPDATE mtuser SET username="'.$user['username'];
                if (!empty($user['password'])) $sql .= '", password="'.password_hash($user['password'], PASSWORD_BCRYPT);
                $sql .= '", name="'.$user['name'].'", email="'.$user['email'].'", title="'.$user['title'].'", supervisor="'.$user['supervisor']
                .'", fk_userRoleId="'.$user['role'].'", active="'.$user['active'].'", approved="'.$user['approved'].'", address="'.$user['address'].'", phone="'.$user['phone'].'", updateBy="apps", updateDate=NOW() WHERE id="'.$user['id'].'"';
                
                $con->exec($sql);
                $arr["msg"] = "User updated successfully!!!";
            } else {
                $arr["error"] = "Update failed: User already exists with same username or email.";
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
    /*echo "[error:'".$e->getMessage()."']";*/
    $arr = array("msg" => "", "error" => "Database error, Contact administrator. Try later", "errMsg" => $e->getMessage());
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