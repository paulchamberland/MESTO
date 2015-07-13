<?php
class UserRole {
	public $id;
	public $name;
	public $description;
    public $lstPermissions;
	public $updateBy;
    public $updateDate;
    
    public function __construct($objSQL) {
        $this->id = $objSQL->id;
        $this->name = $objSQL->name;
        $this->description = $objSQL->description;
        $this->lstPermissions = $objSQL->list_permissions;
        $this->updateBy = $objSQL->updateBy;
        $this->updateDate = $objSQL->updateDate;
    }
}

try {
    $data = json_decode(file_get_contents("php://input"), true);
    
	$con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (isset($data['id']) && !isset($data['name'])) {
        $stmt = $con->prepare("SELECT id, name, description, list_permissions, updateBy, updateDate FROM userrole WHERE id = '".$data['id']."' ORDER BY id");
	}
    if (isset($data['name']) && !isset($data['id'])) {
        $stmt = $con->prepare("SELECT id, name, description, list_permissions, updateBy, updateDate FROM userrole WHERE name='".$data['name']."'");
	}
    else {
        $stmt = $con->prepare("SELECT id, name, description, list_permissions, updateBy, updateDate FROM userrole ORDER BY id");
    }
    
	$stmt->execute();
	
    $arr = array();
    while ($obj = $stmt->fetch(PDO::FETCH_OBJ)) {
        array_push($arr, new UserRole($obj));
    }
    
    $json = json_encode($arr);
    
    header('Content-Type: application/json');
    if (!$json)
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