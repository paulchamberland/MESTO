<?php
class Room { // structure of a room
    public $id;
	public $roomID;
	public $pointOfContact;
	public $technicalPointOfContact;
    public $role;
    public $roomSize;
    public $parentSite;
	public $updateBy;
    public $updateDate;
    
    public function __construct($objSQL) {
        $this->id = $objSQL->id;
        $this->roomID = $objSQL->roomID;
        $this->pointOfContact = $objSQL->pointOfContact;
        $this->technicalPointOfContact = $objSQL->technicalPointOfContact;
        $this->role = $objSQL->role;
        $this->roomSize = $objSQL->roomSize;
        $this->updateBy = $objSQL->updateBy;
        $this->updateDate = $objSQL->updateDate;
        
        $this->parentSite = new ParentSite($objSQL->fk_siteId, $objSQL->siteName);
    }
}

class ParentSite {
    public $id;
    public $name;
    
    public function __construct($pId, $pName) {
        $this->id = $pId;
        $this->name = $pName;
    }
}

try {
    $data = json_decode(file_get_contents("php://input"), true);
    
	$con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
    if (empty($data['id'])) {
        $stmt = $con->prepare("SELECT r.*, s.siteName FROM room r LEFT JOIN site s ON r.fk_siteId = s.id");
	}
    else {
        $stmt = $con->prepare("SELECT r.*, s.siteName FROM room r LEFT JOIN site s ON r.fk_siteId = s.id WHERE r.fk_siteId = '".$data['id']."'");
    }
    
    $stmt->execute();
	
	//$json = json_encode($stmt->fetchAll(PDO::FETCH_CLASS, "room"));
    $arr = array();
    while ($obj = $stmt->fetch(PDO::FETCH_OBJ)) {
        array_push($arr, new Room($obj));
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