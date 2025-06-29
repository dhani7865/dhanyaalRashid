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
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}	

	// Personnel has no dependencies, so we can delete directly.
	$query = $conn->prepare('DELETE FROM personnel WHERE id = ?');
	$query->bind_param("i", $_REQUEST['id']);
	$query->execute();
	
	if (false === $query) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed: " . $conn->error;	
	} else {
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "Personnel deleted successfully";
	}
	
    $query->close();
	mysqli_close($conn);
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	echo json_encode($output); 
?>
