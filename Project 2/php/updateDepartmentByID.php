<?php
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	include("config.php");
	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}	

    $id = $_REQUEST['id']; // from editDepartmentForm hidden input
    $name = $_REQUEST['name'];
    $locationID = $_REQUEST['locationID'];

	$query = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');
	$query->bind_param("sii", $name, $locationID, $id);

    if ($query->execute()) {
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
    } else {
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed: " . $conn->error;
    }
    $output['data'] = [];
	
	$query->close();
	mysqli_close($conn);
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	echo json_encode($output); 
?>
