<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if 'location' is set in the GET request
if (isset($_GET['location'])) {
    $location = urlencode($_GET['location']);
    
    // Get weather, geographical, and population data
    $weatherData = getWeatherData($location);
    $geoData = getGeoData($location);
    $populationData = getPopulationData($location);

    // Return data as a JSON response
    echo json_encode([
        'weather' => $weatherData,
        'geo' => $geoData,
        'population' => $populationData
    ]);
} else {
    // If 'location' is not set, return an error message
    echo json_encode(['error' => 'Location parameter is missing']);
}

function getWeatherData($location) {
    $url = "http://api.openweathermap.org/data/2.5/weather?q={$location}&appid=69ea66720026010173d6729ce0ec2192&units=metric";
    $data = fetchDataFromAPI($url);
    
    if ($data && isset($data['weather'][0])) {
        return [
            'description' => $data['weather'][0]['description'],
            'temp' => $data['main']['temp'],
        ];
    }
    return 'No weather data available';
}

function getGeoData($location) {
    $url = "http://api.geonames.org/searchJSON?name={$location}&maxRows=1&username=dhanyaal19882";
    $data = fetchDataFromAPI($url);

    if ($data && isset($data['geonames'][0])) {
        return [
            'country' => $data['geonames'][0]['countryName'] ?? 'Unknown Country',
            'state' => $data['geonames'][0]['adminName1'] ?? 'Unknown State',
            'latitude' => $data['geonames'][0]['lat'] ?? 'Unknown Latitude',
            'longitude' => $data['geonames'][0]['lng'] ?? 'Unknown Longitude',
        ];
    }
    return 'No geographical data available';
}

function getPopulationData($location) {
    $url = "http://api.geonames.org/searchJSON?name={$location}&maxRows=1&username=dhanyaal19882";
    $data = fetchDataFromAPI($url);

    if ($data && isset($data['geonames'][0])) {
        return $data['geonames'][0]['population'] ?? 'No population data available';
    }
    return 'No population data available';
}


/*function getPopulationData($location) {
    // Fetch latitude and longitude from OpenWeatherMap API
    $geocodeUrl = "http://api.openweathermap.org/data/2.5/weather?q={$location}&appid=69ea66720026010173d6729ce0ec2192";
    $geocodeData = fetchDataFromAPI($geocodeUrl);
    
    if ($geocodeData) {
        // Extract latitude and longitude from geocode data
        $lat = $geocodeData['coord']['lat'];
        $lng = $geocodeData['coord']['lon'];

        // Use latitude and longitude to fetch population data from GeoNames
        $url = "http://api.geonames.org/findNearbyPlaceNameJSON?lat={$lat}&lng={$lng}&username=dhanyaal19882";
        $response = fetchDataFromAPI($url);
        
        if ($response && isset($response['geonames'][0])) {
            return $response['geonames'][0]['population'];
        }
    }
    return 'No population data available';
}*/

// Fetch data from an external API using cURL
function fetchDataFromAPI($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);

    // Check if the cURL request was successful
    if ($response === false) {
        // Log error if the cURL request fails
        error_log('cURL Error: ' . curl_error($ch));
        curl_close($ch);
        return null;
    }
    
    curl_close($ch);
    
    // Return the decoded JSON response if it's valid
    return json_decode($response, true) ?? null;
}
?>