<?php

// example use from browser
// http://localhost/companydirectory/libs/php/getAll.php
// http://localhost/companydirectory/libs/php/getAll.php?txt=Smith

// remove next two lines for production

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

$baseQuery = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location, p.departmentID FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID)';
$conditions = [];
$params = [];
$types = "";

if (isset($_REQUEST['txt']) && !empty($_REQUEST['txt'])) {
    $searchTerm = '%' . $_REQUEST['txt'] . '%';
    $conditions[] = '(p.firstName LIKE ? OR p.lastName LIKE ? OR p.email LIKE ? OR p.jobTitle LIKE ? OR d.name LIKE ? OR l.name LIKE ?)';
    array_push($params, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
    $types .= "ssssss";
}

// Handle department OR location filter (not AND)
$filterConditions = [];
if (isset($_REQUEST['departmentID']) && !empty($_REQUEST['departmentID'])) {
    $filterConditions[] = 'p.departmentID = ?';
    $params[] = $_REQUEST['departmentID'];
    $types .= "i";
}
if (isset($_REQUEST['locationID']) && !empty($_REQUEST['locationID'])) {
    $filterConditions[] = 'd.locationID = ?';
    $params[] = $_REQUEST['locationID'];
    $types .= "i";
}

if (count($filterConditions) > 0) {
    $conditions[] = '(' . implode(' OR ', $filterConditions) . ')';
}

if (count($conditions) > 0) {
    $baseQuery .= ' WHERE ' . implode(' AND ', $conditions);
}
$baseQuery .= ' ORDER BY p.lastName, p.firstName';

$query = $conn->prepare($baseQuery);
if (count($params) > 0) {
    $query->bind_param($types, ...$params);
}

$query->execute();
$result = $query->get_result();

if (!$result) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed: " . $conn->error;
    $output['data'] = [];
} else {
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($data, $row);
    }
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['data'] = $data;
}

$query->close();
mysqli_close($conn);
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
echo json_encode($output);
