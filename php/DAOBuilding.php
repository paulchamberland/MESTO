<?php
class bld { // structure of a building
	public $id;
	public $reference;
	public $latitude;
	public $longitude;
	public $bldName;
	public $description;
	public $adress;
	public $city;
	public $province;
	public $contry;
	public $postalCode;
	public $startDate;
	public $endDate;
	public $updateBy;
    public $updateDate;
}

try {
	$con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$stmt = $con->prepare("SELECT * from building;");
	$stmt->execute();
	
	$json = json_encode($stmt->fetchAll(PDO::FETCH_CLASS, "bld"));
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
    else 
        header('Content-Type: application/json');
        echo ")]}',\n";
        echo $json;
    
}
catch (PDOException $e) {
	echo "[error:$e->getMessage()]";
}
$con = null;

?>