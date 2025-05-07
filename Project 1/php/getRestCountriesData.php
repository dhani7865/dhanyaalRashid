<?php
// Set headers
header('Content-Type: application/json; charset=UTF-8');

// Initialize response array
$output = [
    'status' => [
        'code' => 200,
        'name' => 'ok'
    ],
    'data' => null
];

// Validate country code
if (!isset($_GET['countryCode']) || !preg_match('/^[A-Za-z]{2,3}$/', $_GET['countryCode'])) {
    $output['status']['code'] = 400;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Valid country code (2 or 3 letters) is required';
    echo json_encode($output);
    exit;
}

$countryCode = strtoupper($_GET['countryCode']);

// Rest Countries API URL
$url = "https://restcountries.com/v3.1/alpha/" . urlencode($countryCode);

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_FAILONERROR, true);

// Execute cURL request
$result = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    $output['status']['code'] = 500;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'cURL error: ' . curl_error($ch);
    echo json_encode($output);
    curl_close($ch);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Decode JSON response
$response = json_decode($result, true);

// Check for API errors
if ($httpCode !== 200 || !isset($response[0])) {
    $output['status']['code'] = $httpCode ?: 500;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Invalid response from Rest Countries API';
    echo json_encode($output);
    exit;
}

$output['data'] = $response[0];
echo json_encode($output);
