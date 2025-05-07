<?php
// Load environment variables
$apiKey = 'fbba5026915445648d5b33eb719b4d81';

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
if (!isset($_GET['countryCode']) || !preg_match('/^[A-Za-z]{2}$/', $_GET['countryCode'])) {
    $output['status']['code'] = 400;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Valid country code (2 letters) is required';
    echo json_encode($output);
    exit;
}

$countryCode = strtolower($_GET['countryCode']);

$params = [
    'country' => $countryCode,
    'apiKey' => $apiKey,
];
$url = 'https://newsapi.org/v2/top-headlines?' . http_build_query($params);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_TIMEOUT => 60,
    CURLOPT_FAILONERROR => false,
    CURLOPT_HTTPHEADER => [
        'User-Agent: MyNewsApp/1.0', // <-- REQUIRED
    ],
]);

$newsResult = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Decode JSON response
$decoded = json_decode($newsResult, true);

// Handle curl or API error
if ($newsResult === false || $httpCode !== 200 || !isset($decoded['articles'])) {
    $output['status']['code'] = $httpCode;
    $output['status']['name'] = 'error';
    $output['status']['description'] = $curlError ?: ($decoded['message'] ?? 'Failed to fetch news data');
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

// Return first 5 articles
$output['data'] = array_slice($decoded['articles'], 0, 5);
echo json_encode($output);
