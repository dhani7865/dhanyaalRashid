<?php
// Load environment variables
$apiKey = 'pub_87766861ba6e6703a39d51ac72bea40cd5775'; // Replace with your valid Newsdata.io API key

// Set headers
header('Content-Type: application/json; charset=UTF-8');

// Initialize response array
$output = [
    'status' => [
        'code' => 200,
        'name' => 'ok',
        'description' => 'Success'
    ],
    'data' => null
];

// Validate country code
if (!isset($_GET['countryCode']) || !preg_match('/^[A-Za-z]{2}$/', $_GET['countryCode'])) {
    $output['status']['code'] = 400;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Valid country code (2 letters) is required';
    $output['data'] = [];
    echo json_encode($output, JSON_PRETTY_PRINT);
    exit;
}

$countryCode = strtolower($_GET['countryCode']);

// Build API request
$params = [
    'apikey' => $apiKey,
    'country' => $countryCode
];
$url = 'https://newsdata.io/api/1/news?' . http_build_query($params);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_TIMEOUT => 60,
    CURLOPT_FAILONERROR => false,
    CURLOPT_HTTPHEADER => [
        'User-Agent: MyNewsApp/1.0',
        'Accept: application/json'
    ],
]);

// Execute request
$newsResult = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Handle cURL failure
if ($newsResult === false) {
    $output['status']['code'] = 500;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Request failed: ' . ($curlError ?: 'Unknown error');
    $output['data'] = [];
    echo json_encode($output, JSON_PRETTY_PRINT);
    exit;
}

// Decode JSON response
$decoded = json_decode($newsResult, true);

// Handle JSON decoding failure
if (json_last_error() !== JSON_ERROR_NONE) {
    $output['status']['code'] = 500;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Failed to parse API response';
    $output['data'] = [];
    echo json_encode($output, JSON_PRETTY_PRINT);
    exit;
}

// Handle API errors or invalid response
if ($httpCode !== 200 || !isset($decoded['status']) || $decoded['status'] === 'error') {
    $output['status']['code'] = $httpCode ?: 400;
    $output['status']['name'] = 'error';
    $output['status']['description'] = $decoded['message'] ?? 'Failed to fetch news data';
    $output['data'] = [];
    echo json_encode($output, JSON_PRETTY_PRINT);
    exit;
}

// Extract articles (up to 5)
$articles = isset($decoded['results']) && is_array($decoded['results']) ? array_slice($decoded['results'], 0, 5) : [];
$output['url'] = $url;
$output['data'] = $articles;

// Output response
echo json_encode($output, JSON_PRETTY_PRINT);
