<?php
class Activity {
    public $id;
	public $userName;
	public $date;
	public $title;
    public $action;
    public $concern;
    public $concernObject;
    public $concernUnique;
    public $isRestrain;
    public $parent;
    
    public function __construct($objSQL) {
        $this->id = $objSQL->id;
        $this->userName = $objSQL->userName;
        $this->date = $objSQL->date;
        $this->title = $objSQL->userTitle;
        $this->action = $objSQL->action;
        $this->concern = $objSQL->concern;
        $this->concernObject = $objSQL->concernObject;
        $this->concernUnique = $objSQL->concernUnique;
        $this->isRestrain = $objSQL->isRestrain;
        
        $this->parent = new ParentConcern($objSQL->parent_role, $objSQL->parent_info);
    }
}

class ParentConcern {
    public $role;
    public $info;
    
    public function __construct($pRole, $pInfo) {
        $this->role = $pRole;
        $this->info = $pInfo;
    }
}

try {
    $data = json_decode(file_get_contents("php://input"), true);
    
	$con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
    if (isset($data['isRestrain']) && isset($data['limit'])) {
        $sql = "SELECT * FROM activitystream";
        if ($data['isRestrain'] == 'false')
            $sql .= " WHERE isRestrain=".$data['isRestrain'];
        
        $sql .= " ORDER BY date DESC LIMIT ".$data['limit'];
        $stmt = $con->prepare($sql);
	}
    else if (empty($data['id'])) {
        $stmt = $con->prepare("SELECT * FROM activitystream ORDER BY date DESC");
	}
    else {
        
    }
    
    $stmt->execute();
	
    $arr = array();
    while ($obj = $stmt->fetch(PDO::FETCH_OBJ)) {
        array_push($arr, new Activity($obj));
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
    $arr = array("msg" => "", "error" => "Database error, Contact administrator. Try later", "sql"=> $sql, "errorMsg" => $e->getMessage());
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