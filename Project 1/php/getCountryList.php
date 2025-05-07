<?php
// Set headers
header('Content-Type: application/json; charset=UTF-8');

// Initialize response array
$output = array(
    'status' => array(
        'code' => 200,
        'name' => 'ok'
    ),
    'data' => array()
);

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

// Extract country codes and names
$countries = array();

foreach ($geoData['features'] as $feature) {
    if (isset($feature['properties']['iso_a2']) && isset($feature['properties']['name'])) {
        $countries[] = array(
            'iso2' => $feature['properties']['iso_a2'],
            'iso3' => $feature['properties']['iso_a3'],
            'name' => $feature['properties']['name']
        );
    }
}

// Add countries to output
$output['data'] = $countries;

// Return JSON response
echo json_encode($output);
?>
