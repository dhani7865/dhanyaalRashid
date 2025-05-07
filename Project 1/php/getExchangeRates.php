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

// Open Exchange Rates API key
$apiKey = '9c448c9ce4fc4b48826e567233ce042a'; // Replace with your actual API key

// Open Exchange Rates API URL
$url = "https://openexchangerates.org/api/latest.json?app_id=$apiKey";

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
if (!isset($response['rates'])) {
    $output['status']['code'] = 500;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Invalid response from Open Exchange Rates API';
    echo json_encode($output);
    exit;
}

// Add exchange rates data to output
$output['data'] = $response;

// Return JSON response
echo json_encode($output);
