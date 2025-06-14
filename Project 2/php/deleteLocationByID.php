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

	$id = $_REQUEST['id'];

    // DEPENDENCY CHECK: Check if any departments are assigned to this location.
    $checkQuery = $conn->prepare('SELECT COUNT(id) as departmentCount FROM department WHERE locationID = ?');
    $checkQuery->bind_param("i", $id);
    $checkQuery->execute();
    $result = $checkQuery->get_result();
    $row = $result->fetch_assoc();
    $checkQuery->close();

    if ($row['departmentCount'] > 0) {
        // Conflict found, cannot delete.
        $output['status']['code'] = "409"; // 409 Conflict
		$output['status']['name'] = "conflict";
		$output['status']['description'] = "Location has " . $row['departmentCount'] . " department(s) assigned. Please reassign them before deleting.";	
    } else {
        // No dependencies, proceed with delete.
        $query = $conn->prepare('DELETE FROM location WHERE id = ?');
        $query->bind_param("i", $id);
        $query->execute();
        
        if (false === $query) {
            $output['status']['code'] = "400";
            $output['status']['name'] = "executed";
            $output['status']['description'] = "query failed: " . $conn->error;	
        } else {
            $output['status']['code'] = "200";
            $output['status']['name'] = "ok";
            $output['status']['description'] = "Location deleted successfully";
        }
        $query->close();
    }
	
	mysqli_close($conn);
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	echo json_encode($output); 
?>
