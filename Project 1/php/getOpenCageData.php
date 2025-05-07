<?php
$apiKey = '89ddfd2eac0d4da58545beebecb0b8e6'; // Fallback for testing

// Set headers
header('Content-Type: application/json; charset=UTF-8');
// Optional: CORS for cross-origin requests
header('Access-Control-Allow-Origin: *'); // Adjust for specific domains in production

// Initialize response array
$output = [
    'status' => [
        'code' => 200,
        'name' => 'ok'
    ],
    'data' => null
];

// Validate coordinates
if (!isset($_GET['lat']) || !isset($_GET['lng']) || !is_numeric($_GET['lat']) || !is_numeric($_GET['lng'])) {
    $output['status']['code'] = 400;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Valid latitude and longitude are required';
    echo json_encode($output);
    exit;
}

$lat = floatval($_GET['lat']);
$lng = floatval($_GET['lng']);

// Check coordinate ranges
if ($lat < -90 || $lat > 90 || $lng < -180 || $lng > 180) {
    $output['status']['code'] = 400;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Latitude must be between -90 and 90, longitude between -180 and 180';
    echo json_encode($output);
    exit;
}

// OpenCage API URL
$url = "https://api.opencagedata.com/geocode/v1/json?q=" . urlencode("$lat+$lng") . "&key=" . urlencode($apiKey) . "&no_annotations=1";

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
    error_log("cURL error: " . curl_error($ch));
    echo json_encode($output);
    curl_close($ch);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Decode JSON response
$response = json_decode($result, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    $output['status']['code'] = 500;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Failed to parse API response: ' . json_last_error_msg();
    error_log("JSON decode error: " . json_last_error_msg());
    echo json_encode($output);
    exit;
}

// Check for API errors
if ($httpCode !== 200 || !isset($response['results']) || empty($response['results'])) {
    $errorMessage = $response['status']['message'] ?? 'Invalid response from OpenCage API';
    $output['status']['code'] = $httpCode ?: 500;
    $output['status']['name'] = 'error';
    $output['status']['description'] = $errorMessage;
    if ($httpCode === 429) {
        $output['status']['description'] = 'Rate limit exceeded for OpenCage API. Please try again later.';
    }
    error_log("OpenCage API error: HTTP $httpCode, Message: $errorMessage");
    echo json_encode($output);
    exit;
}

// Extract country data with fallback
$components = $response['results'][0]['components'] ?? [];
$countryData = [
    'countryName' => $components['country'] ?? 'Unknown',
    'countryCode' => $components['ISO_3166-1_alpha-2'] ?? 'US', // Fallback to US
    'formatted' => $response['results'][0]['formatted'] ?? 'Unknown'
];

$output['data'] = $countryData;
echo json_encode($output);
