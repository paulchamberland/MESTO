<?php
class User { 
	public $id;
	public $username;
	public $name;
	public $email;
    public $password;
    public $supervisor;
    public $title;
    public $role;
    public $lstPermissions;
    public $active;
    public $approved;
    public $address;
    public $phone;
	public $updateBy;
    public $updateDate;
    
    public function __construct($objSQL) {
        $this->id = $objSQL->id;
        $this->username = $objSQL->username;
        $this->name = $objSQL->name;
        $this->email = $objSQL->email;
        //$this->password = $objSQL->password;
        $this->supervisor = $objSQL->supervisor;
        $this->title = $objSQL->title;
        $this->role = $objSQL->fk_userRoleId;
        
        if (isset($objSQL->list_permissions))
            $this->lstPermissions = $objSQL->list_permissions;
        
        $this->active = $objSQL->active;
        $this->approved = $objSQL->approved;
        $this->address = $objSQL->address;
        $this->phone = $objSQL->phone;
        $this->updateBy = $objSQL->updateBy;
        $this->updateDate = $objSQL->updateDate;
    }
}

try {
    $data = json_decode(file_get_contents("php://input"), true);
    
	$con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (isset($data['activity']) && $data['activity'] == 'loadPending') {
        $stmt = $con->prepare("SELECT * FROM mtuser WHERE approved = '0'");
    }
    else if (!isset($data['id']) && !isset($data['activity']) && !isset($data['username'])) {
        $stmt = $con->prepare("SELECT id, username, name, email, title, supervisor, fk_userRoleId, active, approved, address, phone, updateBy, updateDate FROM mtuser ORDER BY id");
	}
    else if (isset($data['username']) && !isset($data['id']) && !isset($data['activity'])) {
        $stmt = $con->prepare("SELECT id, username, name, email, title, supervisor, fk_userRoleId, active, approved, address, phone, updateBy, updateDate FROM mtuser WHERE username = '".$data['username']."'");
	}
    else if (isset($data['activity']) && $data['activity'] == "login" && isset($data['id'])) {
        $stmt = $con->prepare("SELECT u.*, ur.list_permissions FROM mtuser u LEFT JOIN userrole ur ON u.fk_userRoleId = ur.id WHERE u.id = '".$data['id']."'");
    }
    else {
        $stmt = $con->prepare("SELECT id, username, name, email, title, supervisor, fk_userRoleId, active, approved, address, phone, updateBy, updateDate FROM mtuser WHERE id = '".$data['id']."'");
    }
    
	$stmt->execute();
	
    $arr = array();
    while ($obj = $stmt->fetch(PDO::FETCH_OBJ)) {
        array_push($arr, new User($obj));
    }
    
    if (!empty($data['activity']) && $data['activity'] == "login" && !empty($data['id'])) {
        session_id();
        session_start();

        if (isset($_SESSION['uId'])) {
            $_SESSION['user'] = $arr[0];
        }
        else {
            // DELETE the possible create sessions
        }
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