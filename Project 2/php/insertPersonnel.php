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

    $firstName = $_REQUEST['addPersonnelFirstName'];
    $lastName = $_REQUEST['addPersonnelLastName'];
    $jobTitle = $_REQUEST['addPersonnelJobTitle'];
    $email = $_REQUEST['addPersonnelEmailAddress'];
    $departmentID = $_REQUEST['addPersonnelDepartment'];

	$query = $conn->prepare('INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES (?, ?, ?, ?, ?)');
	$query->bind_param("ssssi", $firstName, $lastName, $jobTitle, $email, $departmentID);
	
    if ($query->execute()) {
        $output['status']['code'] = "200";
        $output['status']['name'] = "ok";
        $output['status']['description'] = "success";
        $output['data'] = ['id' => $conn->insert_id];
    } else {
        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed: " . $conn->error;
        $output['data'] = [];
    }
	
	$query->close();
	mysqli_close($conn);
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	echo json_encode($output); 
?>
