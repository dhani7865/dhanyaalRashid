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

$searchTerm = isset($_REQUEST['txt']) ? '%' . $_REQUEST['txt'] . '%' : '%';

$query_str = 'SELECT id, name FROM location';
if (isset($_REQUEST['txt']) && !empty($_REQUEST['txt'])) {
	$query_str .= ' WHERE name LIKE ?';
}
$query_str .= ' ORDER BY name ASC';

$query = $conn->prepare($query_str);

if (isset($_REQUEST['txt']) && !empty($_REQUEST['txt'])) {
	$query->bind_param("s", $searchTerm);
}
$query->execute();

if (false === $query) {
	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed: " . $conn->error;
	$output['data'] = [];
	mysqli_close($conn);
	echo json_encode($output);
	exit;
}

$result = $query->get_result();
$data = [];
while ($row = mysqli_fetch_assoc($result)) {
	array_push($data, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

$query->close();
mysqli_close($conn);
echo json_encode($output);
