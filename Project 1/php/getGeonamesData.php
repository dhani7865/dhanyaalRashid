<?php
// Set headers
header('Content-Type: application/json; charset=UTF-8');

// Initialize response array
$output = array(
    'status' => array(
        'code' => 200,
        'name' => 'ok'
    ),
    'data' => null
);

// Check if country code is provided
if (!isset($_GET['countryCode']) || empty($_GET['countryCode'])) {
    $output['status']['code'] = 400;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Country code is required';
    echo json_encode($output);
    exit;
}

$countryCode = $_GET['countryCode'];

// Check if feature class and code are provided
$featureClass = isset($_GET['featureClass']) ? $_GET['featureClass'] : 'P';
$featureCode = isset($_GET['featureCode']) ? $_GET['featureCode'] : 'PPLA,PPLC';

// Geonames API username
$username = 'hassan4215454545'; // Replace with your actual Geonames username

// Geonames API URL for search
$url = "http://api.geonames.org/searchJSON?country=$countryCode&featureClass=$featureClass&featureCode=$featureCode&maxRows=50&username=$username";

// Initialize cURL
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);

// Execute cURL request
$result = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    $output['status']['code'] = 500;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'cURL error: ' . curl_error($ch);
    echo json_encode($output);
    exit;
}

// Close cURL
curl_close($ch);

// Decode JSON response
$response = json_decode($result, true);

// Check if response is valid
if (!isset($response['geonames'])) {
    $output['status']['code'] = 500;
    $output['status']['name'] = 'error';
    $output['status']['response'] = $response;
    $output['status']['description'] = 'Invalid response from Geonames API';
    echo json_encode($output);
    exit;
}

// Add geonames data to output
$output['data'] = $response['geonames'];

// Return JSON response
echo json_encode($output);
