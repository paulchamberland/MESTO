<?php
$data = json_decode(file_get_contents("php://input"), true);

try {
    // To send HTML mail, the Content-type header must be set
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

    if (mail($data["to"], $data["subject"], $data["message"], $headers))
        echo "[msg:'Mail function returned successfully. Mail has probably been sent.']";
    else
        echo "[error:'Error! Mail function failed. Mail NOT sent.']";
}
catch (Exception $e) {
	echo "[error:'".$e->getMessage()."']";
}
?>