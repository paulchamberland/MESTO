<?php
$bld = json_decode(file_get_contents("php://input"), true);
// TODO : remove html and script from data.

try {
    $con = new PDO("mysql:host=localhost;dbname=mesto", "root", "");
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (empty($bld['id'])) {
        $stmt = $con->prepare("SELECT count(*) as nbBuilding FROM building WHERE reference = '".$bld['reference']."'");
        $stmt->execute();
        $rs = $stmt->fetchAll();
        
        $arr = array("msg" => "", "error" => "");
        if ($rs[0]['nbBuilding'] == 0) {
            $sql = 'INSERT INTO building (reference, latitude, longitude, bldName, description, address, city, province, country, postalCode, startDate, endDate, updateBy, updateDate)'
                .' values ("'.$bld['reference'].'","'.$bld['latitude'].'","'.$bld['longitude'].'","'.$bld['bldName'].'","'.$bld['description'].'","'.$bld['address']
                .'","'.$bld['city'].'","'.$bld['province'].'","'.$bld['country'].'","'.$bld['postalCode'].'","'.$bld['startDate'].'","'.$bld['endDate'].'","apps", NOW())';
            $con->exec($sql);
            $arr = array("msg" => "Building created successfully!!!", "error" => "");
        } else {
            $arr["error"] = "Buildings already exists with same reference.";
        }
    }
    else if (!empty($bld['id']) && isset($bld['activity']) && $bld['activity'] == "del") {
        $sql = 'DELETE FROM building WHERE id="'.$bld['id'].'"';
        $con->exec($sql);
        $arr = array("msg" => "Building deleted successfully!!!", "error" => "");
    }
    else {
        $sql = 'UPDATE building SET reference="'.$bld['reference'].'", latitude="'.$bld['latitude'].'", longitude="'.$bld['longitude'].'", bldName="'.$bld['bldName']
                    .'", description="'.$bld['description'].'", address="'.$bld['address'].'", city="'.$bld['city'].'", province="'.$bld['province']
                    .'", country="'.$bld['country'].'", postalCode="'.$bld['postalCode'].'", startDate="'.$bld['startDate']
                    .'", endDate="'.$bld['endDate'].'", updateBy="apps", updateDate=NOW() WHERE id="'.$bld['id'].'"';
        $con->exec($sql);
        $arr = array("msg" => "Building updated successfully!!!", "error" => "");
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
    /*echo $e->getMessage();*/
    $arr = array("msg" => "", "error" => "Unknow error from the database, Contact administrator. Try later");
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