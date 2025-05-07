<?php
// Load environment variables
$geonamesUsername =  'hassan4215454545';

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
$restCountriesUrl = "https://restcountries.com/v3.1/alpha/" . urlencode($countryCode);

// Initialize cURL for Rest Countries
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $restCountriesUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_FAILONERROR, true);

// Execute cURL request
$restCountriesResult = curl_exec($ch);

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
$restCountriesResponse = json_decode($restCountriesResult, true);

// Check if response is valid
if ($httpCode !== 200 || !isset($restCountriesResponse[0]['name']['common'])) {
    $output['status']['code'] = $httpCode ?: 500;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Could not get country name';
    echo json_encode($output);
    exit;
}

// Get country name
$countryName = urlencode($restCountriesResponse[0]['name']['common']);

// Geonames API URL
$url = "http://api.geonames.org/wikipediaSearchJSON?q=$countryName&maxRows=10&username=" . urlencode($geonamesUsername);
// Initialize cURL for Geonames
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_FAILONERROR, true);

// Execute cURL request
$wikiResult = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    $output['status']['code'] = 500;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'cURL error: ' . curl_error($ch);
    $output['status']['wikiResult'] = $wikiResult;
    echo json_encode($output);
    curl_close($ch);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Decode JSON response
$wikiResponse = json_decode($wikiResult, true);

// Check for API errors
if ($httpCode !== 200 || !isset($wikiResponse['geonames'])) {
    $output['status']['code'] = $httpCode ?: 500;
    $output['status']['name'] = 'error';
    $output['status']['description'] = $wikiResponse['status']['message'] ?? 'Invalid response from Geonames API';
    echo json_encode($output);
    exit;
}

$output['data'] = $wikiResponse['geonames'];
echo json_encode($output);
