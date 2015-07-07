<?php
class site { // structure of a site
	public $id;
	public $reference;
	public $latitude;
	public $longitude;
	public $siteName;
	public $description;
	public $address;
	public $city;
	public $province;
	public $country;
	public $postalCode;
    public $isTemporary;
	public $startDate;
	public $endDate;
    public $role;
    public $pointOfContact;
    public $phoneNumberPoC;
    public $techPoC;
    public $phoneTechPoC;
    public $employesNumber;
    public $organization;
	public $updateBy;
    public $updateDate;
}
$arr = null;
try {
    $data = json_decode(file_get_contents("php://input"), true);
    
    //throw new PDOException('juste un test');
	$con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (isset($data['reference'])) {
        $stmt = $con->prepare("SELECT * from site WHERE reference='".$data['reference']."'");
	}
    else {
        $stmt = $con->prepare("SELECT * from site ORDER BY id;");
    }
    
    $stmt->execute();
	
	$json = json_encode($stmt->fetchAll(PDO::FETCH_CLASS, "site"));
    
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