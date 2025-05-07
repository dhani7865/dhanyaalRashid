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

$countryCode = strtoupper($_GET['countryCode']);

// Path to GeoJSON file
$filePath = '../data/countryBorders.geo.json';

// Check if file exists
if (!file_exists($filePath)) {
    $output['status']['code'] = 404;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'GeoJSON file not found';
    echo json_encode($output);
    exit;
}

// Read the GeoJSON file
$geoJSON = file_get_contents($filePath);

// Decode JSON
$geoData = json_decode($geoJSON, true);

// Check if JSON is valid
if ($geoData === null) {
    $output['status']['code'] = 500;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Invalid GeoJSON format';
    echo json_encode($output);
    exit;
}

// Find the country by ISO code
$countryFeature = null;

foreach ($geoData['features'] as $feature) {
    if (isset($feature['properties']['iso_a2']) && $feature['properties']['iso_a2'] === $countryCode) {
        $countryFeature = $feature;
        break;
    }
}

// Check if country was found
if ($countryFeature === null) {
    $output['status']['code'] = 404;
    $output['status']['name'] = 'error';
    $output['status']['description'] = 'Country not found';
    echo json_encode($output);
    exit;
}

// Add country feature to output
$output['data'] = $countryFeature;

// Return JSON response
echo json_encode($output);
?>
