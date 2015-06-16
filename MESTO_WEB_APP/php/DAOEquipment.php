<?php
class Equipment { // structure of an equipment
	public $id;
	public $serialNumber;
	public $barCode;
	public $manufacturer;
    public $model;
    public $configHW;
    public $configSW;
    public $type;
    public $parentRoom;
    public $parentSite;
	public $updateBy;
    public $updateDate;
    
    public function __construct($objSQL) {
        $this->id = $objSQL->id;
        $this->serialNumber = $objSQL->serialNumber;
        $this->barCode = $objSQL->barCode;
        $this->manufacturer = $objSQL->manufacturer;
        $this->model = $objSQL->model;
        $this->configHW = $objSQL->configHW;
        $this->configSW = $objSQL->configSW;
        $this->type = $objSQL->type;
        $this->updateBy = $objSQL->updateBy;
        $this->updateDate = $objSQL->updateDate;
        
        $this->parentRoom = new ParentRoom($objSQL->fk_roomId, $objSQL->roomID, $objSQL->roomRole, $objSQL->siteName);
        $this->parentSite = new ParentSite($objSQL->fk_siteId, $objSQL->siteName, $objSQL->siteRole);
    }
}

class ParentRoom {
    public $id;
    public $roomID;
    public $siteName;
    public $role;
    
    public function __construct($pId, $pRoomId, $pRole, $pSiteName) {
        $this->id = $pId;
        $this->roomID = $pRoomId;
        $this->role = $pRole;
        if ($pId > 0)
            $this->siteName = $pSiteName;
        else
            $this->siteName = "";
    }
}

class ParentSite {
    public $id;
    public $name;
    public $role;
    
    public function __construct($pId, $pName, $pRole) {
        $this->id = $pId;
        $this->role = $pRole;
        if ($pId > 0)
            $this->name = $pName;
        else
            $this->name = "";
    }
}

try {
    $data = json_decode(file_get_contents("php://input"), true);
    
	$con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (empty($data['id'])) {
        $stmt = $con->prepare("SELECT e.*, r.roomID, r.role as roomRole, s.siteName, s.role as siteRole FROM equipment e LEFT JOIN room r ON e.fk_roomId = r.id LEFT JOIN site s ON r.fk_siteId = s.id OR e.fk_siteId = s.id ORDER BY e.id");
	}
    else {
        if (isset($data['type']) && $data['type'] == "SITE_INC") {
            $stmt = $con->prepare("SELECT e.*, r.roomID, r.role as roomRole, s.siteName, s.role as siteRole FROM equipment e LEFT JOIN room r ON e.fk_roomId = r.id LEFT JOIN site s ON e.fk_siteId = s.id WHERE e.fk_siteId = '".$data['id']."' ORDER BY e.id");
        }
        else if (isset($data['type']) && $data['type'] == "ROOM_INC") {
            $stmt = $con->prepare("SELECT e.*, r.roomID, r.role as roomRole, s.siteName, s.role as siteRole FROM equipment e LEFT JOIN room r ON e.fk_roomId = r.id LEFT JOIN site s ON e.fk_siteId = s.id WHERE e.fk_roomId = '".$data['id']."' ORDER BY e.id");
        }
        else if (isset($data['type']) && ($data['type'] == "SITE_FREE" || $data['type'] == "ROOM_FREE")) {
            $stmt = $con->prepare("SELECT e.*, '' as roomID, '' as roomRole, '' as siteName,  '' as siteRole FROM equipment e WHERE e.fk_roomId = '' AND e.fk_siteId = '' ORDER BY e.id");
        }
    }
    
	$stmt->execute();
	
    $arr = array();
    while ($obj = $stmt->fetch(PDO::FETCH_OBJ)) {
        array_push($arr, new Equipment($obj));
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