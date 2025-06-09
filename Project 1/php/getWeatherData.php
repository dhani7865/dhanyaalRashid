<?php

$apiKey = "de18436cadb1a7fa0ae1e3282b352848";
if (!$apiKey) {
    error_log("OpenWeather API key not set", 3, "errors.log");
    $output = [
        'status' => [
            'code' => 500,
            'name' => 'error',
            'description' => 'API configuration missing'
        ],
        'data' => null
    ];
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);
    exit;
}

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

// Validate and sanitize country code
$countryCode = strtoupper(filter_var($_GET['countryCode'] ?? ''));
if (empty($countryCode) || !preg_match('/^[A-Z]{2}$/', $countryCode)) {
    $output['status'] = [
        'code' => 400,
        'name' => 'error',
        'description' => 'Invalid or missing country code'
    ];
    echo json_encode($output);
    exit;
}

// Check cache
$cacheFile = "weather_cache_$countryCode.json";
$cacheDuration = 3600; // 1 hour
if (file_exists($cacheFile) && (time() - filemtime($cacheFile)) < $cacheDuration) {
    $cachedData = json_decode(file_get_contents($cacheFile), true);
    if ($cachedData) {
        echo json_encode($cachedData);
        exit;
    }
}

// Fetch capital city from Rest Countries API
$restCountriesUrl = "https://restcountries.com/v3.1/alpha/" . urlencode($countryCode);
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $restCountriesUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_FAILONERROR => true
]);
$restCountriesResult = curl_exec($ch);
if (curl_errno($ch)) {
    $error = 'Rest Countries cURL error: ' . curl_error($ch);
    error_log($error, 3, "errors.log");
    $output['status'] = [
        'code' => 500,
        'name' => 'error',
        'description' => $error
    ];
    echo json_encode($output);
    curl_close($ch);
    exit;
}
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$restCountriesResponse = json_decode($restCountriesResult, true);
if ($httpCode !== 200 || !isset($restCountriesResponse[0]['capital'][0])) {
    $error = 'Could not retrieve capital city from Rest Countries API';
    error_log($error, 3, "errors.log");
    $output['status'] = [
        'code' => $httpCode ?: 500,
        'name' => 'error',
        'description' => $error
    ];
    echo json_encode($output);
    exit;
}

$capital = $restCountriesResponse[0]['capital'][0];
$countryName = $restCountriesResponse[0]['name']['common'];

// Fetch weather forecast from OpenWeather API
$params = [
    'q' => $capital,
    'appid' => $apiKey,
    'units' => 'metric'
];
$url = 'https://api.openweathermap.org/data/2.5/forecast?' . http_build_query($params);
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_FAILONERROR => true
]);

// Retry logic for rate limits
$maxRetries = 3;
$retryDelay = 60; // Seconds
$attempt = 0;

do {
    $forecastResult = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($forecastResult !== false && $httpCode !== 429) {
        break; // Success or non-429 error
    }

    $error = 'OpenWeather cURL error: ' . ($httpCode === 429 ? 'Rate limit exceeded' : curl_error($ch));
    error_log("Attempt " . ($attempt + 1) . ": $error", 3, "errors.log");

    if ($httpCode === 429 && $attempt < $maxRetries - 1) {
        sleep($retryDelay);
    } else {
        $output['status'] = [
            'code' => $httpCode === 429 ? 429 : 500,
            'name' => 'error',
            'description' => $httpCode === 429 ? 'OpenWeather API rate limit exceeded. Please try again later.' : $error
        ];
        echo json_encode($output);
        curl_close($ch);
        exit;
    }
    $attempt++;
} while ($attempt < $maxRetries);

curl_close($ch);

// Check JSON decoding
$forecastResponse = json_decode($forecastResult, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    $error = 'Failed to parse OpenWeather API response: ' . json_last_error_msg();
    error_log($error, 3, "errors.log");
    $output['status'] = [
        'code' => 500,
        'name' => 'error',
        'description' => $error
    ];
    echo json_encode($output);
    exit;
}

// Check for API errors
if ($httpCode !== 200 || !isset($forecastResponse['list']) || empty($forecastResponse['list'])) {
    $error = $forecastResponse['message'] ?? 'Invalid response from OpenWeather API';
    error_log("OpenWeather error: $error", 3, "errors.log");
    $output['status'] = [
        'code' => $httpCode ?: 500,
        'name' => 'error',
        'description' => $error
    ];
    echo json_encode($output);
    exit;
}

// Process forecast data
$currentWeather = $forecastResponse['list'][0];
$forecasts = $forecastResponse['list'];
$timezoneOffset = $forecastResponse['city']['timezone'] ?? 18000; // Default to PKT (+5 hours)

// Get today's date in the city's timezone
$today = gmdate('Y-m-d', time() + $timezoneOffset);

// Initialize today's forecast
$forecast = [
    'morning' => ['temp' => null, 'icon' => '01d', 'description' => 'Clear sky', 'pop' => 0],
    'afternoon' => ['temp' => null, 'icon' => '01d', 'description' => 'Clear sky', 'pop' => 0],
    'evening' => ['temp' => null, 'icon' => '01d', 'description' => 'Clear sky', 'pop' => 0]
];

// Process today's forecast
foreach ($forecasts as $forecastItem) {
    $forecastTime = $forecastItem['dt'] + $timezoneOffset;
    $date = gmdate('Y-m-d', $forecastTime);
    $hour = (int) gmdate('H', $forecastTime);

    if ($date !== $today) {
        continue;
    }

    if ($hour >= 6 && $hour < 12 && $forecast['morning']['temp'] === null) {
        $forecast['morning'] = [
            'temp' => $forecastItem['main']['temp'],
            'icon' => $forecastItem['weather'][0]['icon'],
            'description' => $forecastItem['weather'][0]['description'],
            'pop' => $forecastItem['pop'] * 100
        ];
    } elseif ($hour >= 12 && $hour < 18 && $forecast['afternoon']['temp'] === null) {
        $forecast['afternoon'] = [
            'temp' => $forecastItem['main']['temp'],
            'icon' => $forecastItem['weather'][0]['icon'],
            'description' => $forecastItem['weather'][0]['description'],
            'pop' => $forecastItem['pop'] * 100
        ];
    } elseif ($hour >= 18 && $hour < 24 && $forecast['evening']['temp'] === null) {
        $forecast['evening'] = [
            'temp' => $forecastItem['main']['temp'],
            'icon' => $forecastItem['weather'][0]['icon'],
            'description' => $forecastItem['weather'][0]['description'],
            'pop' => $forecastItem['pop'] * 100
        ];
    }

    if ($forecast['morning']['temp'] !== null && $forecast['afternoon']['temp'] !== null && $forecast['evening']['temp'] !== null) {
        break;
    }
}

// Fallback to current weather
$forecast['morning']['temp'] = $forecast['morning']['temp'] ?? $currentWeather['main']['temp'];
$forecast['morning']['icon'] = $forecast['morning']['icon'] ?? $currentWeather['weather'][0]['icon'];
$forecast['morning']['description'] = $forecast['morning']['description'] ?? $currentWeather['weather'][0]['description'];
$forecast['morning']['pop'] = $forecast['morning']['pop'] ?? 0;

$forecast['afternoon']['temp'] = $forecast['afternoon']['temp'] ?? $currentWeather['main']['temp'];
$forecast['afternoon']['icon'] = $forecast['afternoon']['icon'] ?? $currentWeather['weather'][0]['icon'];
$forecast['afternoon']['description'] = $forecast['afternoon']['description'] ?? $currentWeather['weather'][0]['description'];
$forecast['afternoon']['pop'] = $forecast['afternoon']['pop'] ?? 0;

$forecast['evening']['temp'] = $forecast['evening']['temp'] ?? $currentWeather['main']['temp'];
$forecast['evening']['icon'] = $forecast['evening']['icon'] ?? $currentWeather['weather'][0]['icon'];
$forecast['evening']['description'] = $forecast['evening']['description'] ?? $currentWeather['weather'][0]['description'];
$forecast['evening']['pop'] = $forecast['evening']['pop'] ?? 0;

// Initialize daily forecasts
$dailyForecasts = [];
$daysProcessed = 0;
$currentDay = null;
$dayData = null;

foreach ($forecasts as $forecastItem) {
    $forecastTime = $forecastItem['dt'] + $timezoneOffset;
    $date = gmdate('Y-m-d', $forecastTime);
    $weekday = gmdate('D', $forecastTime);
    $hour = (int) gmdate('H', $forecastTime);

    if ($daysProcessed >= 3 || $date === $today) {
        continue;
    }

    if ($date !== $currentDay) {
        if ($dayData !== null) {
            $dailyForecasts[] = $dayData;
            $daysProcessed++;
        }
        $currentDay = $date;
        $dayData = [
            'date' => $date,
            'weekday' => $weekday,
            'temp' => null,
            'icon' => '01d',
            'description' => 'Clear sky',
            'pop' => 0,
            'sunrise' => null,
            'sunset' => null
        ];
    }

    if ($hour >= 12 && $hour < 18 && $dayData['temp'] === null) {
        $dayData['temp'] = $forecastItem['main']['temp'];
        $dayData['icon'] = $forecastItem['weather'][0]['icon'];
        $dayData['description'] = $forecastItem['weather'][0]['description'];
        $dayData['pop'] = $forecastItem['pop'] * 100;
    }
}

if ($dayData !== null && $daysProcessed < 3) {
    $dailyForecasts[] = $dayData;
}

while (count($dailyForecasts) < 3) {
    $lastDay = end($dailyForecasts) ?: [
        'temp' => $currentWeather['main']['temp'],
        'icon' => $currentWeather['weather'][0]['icon'],
        'description' => $currentWeather['weather'][0]['description'],
        'pop' => 0
    ];
    $daysProcessed++;
    $nextDate = gmdate('Y-m-d', strtotime($currentDay . " +$daysProcessed day") + $timezoneOffset);
    $nextWeekday = gmdate('D', strtotime($currentDay . " +$daysProcessed day") + $timezoneOffset);
    $dailyForecasts[] = [
        'date' => $nextDate,
        'weekday' => $nextWeekday,
        'temp' => $lastDay['temp'],
        'icon' => $lastDay['icon'],
        'description' => $lastDay['description'],
        'pop' => $lastDay['pop'],
        'sunrise' => null,
        'sunset' => null
    ];
}

// Get sunrise and sunset times
$sunrise = $forecastResponse['city']['sunrise'] + $timezoneOffset;
$sunset = $forecastResponse['city']['sunset'] + $timezoneOffset;
$sunriseFormatted = gmdate('H:i', $sunrise);
$sunsetFormatted = gmdate('H:i', $sunset);

foreach ($dailyForecasts as &$day) {
    $day['sunrise'] = $sunriseFormatted;
    $day['sunset'] = $sunsetFormatted;
}
unset($day);

// Clean weather data output
$output['data'] = [
    'city' => "$capital, $countryName",
    'description' => ucfirst($currentWeather['weather'][0]['description'] ?? 'Unknown'),
    'icon' => "https://openweathermap.org/img/wn/" . ($currentWeather['weather'][0]['icon'] ?? '01d') . "@2x.png",
    'temperature' => $currentWeather['main']['temp'] ?? 0,
    'humidity' => $currentWeather['main']['humidity'] ?? 0,
    'wind' => $currentWeather['wind']['speed'] ?? 0,
    'sunrise' => $sunriseFormatted,
    'sunset' => $sunsetFormatted,
    'forecast' => [
        'morning' => [
            'temp' => round($forecast['morning']['temp'], 1),
            'icon' => "https://openweathermap.org/img/wn/{$forecast['morning']['icon']}@2x.png",
            'description' => ucfirst($forecast['morning']['description']),
            'precipitation' => round($forecast['morning']['pop']),
            'sunrise' => $sunriseFormatted,
            'sunset' => $sunsetFormatted
        ],
        'afternoon' => [
            'temp' => round($forecast['afternoon']['temp'], 1),
            'icon' => "https://openweathermap.org/img/wn/{$forecast['afternoon']['icon']}@2x.png",
            'description' => ucfirst($forecast['afternoon']['description']),
            'precipitation' => round($forecast['afternoon']['pop']),
            'sunrise' => $sunriseFormatted,
            'sunset' => $sunsetFormatted
        ],
        'evening' => [
            'temp' => round($forecast['evening']['temp'], 1),
            'icon' => "https://openweathermap.org/img/wn/{$forecast['evening']['icon']}@2x.png",
            'description' => ucfirst($forecast['evening']['description']),
            'precipitation' => round($forecast['evening']['pop']),
            'sunrise' => $sunriseFormatted,
            'sunset' => $sunsetFormatted
        ]
    ],
    'daily_forecast' => array_map(function ($day) {
        return [
            'date' => $day['date'],
            'day' => date("d", strtotime($day['date'])),
            'weekday' => $day['weekday'],
            'temp' => round($day['temp'], 0),
            'icon' => "https://openweathermap.org/img/wn/{$day['icon']}@2x.png",
            'description' => ucfirst($day['description']),
            'precipitation' => round($day['pop']),
            'sunrise' => $day['sunrise'],
            'sunset' => $day['sunset']
        ];
    }, $dailyForecasts)
];

// Save to cache
if (!file_put_contents($cacheFile, json_encode($output))) {
    error_log("Failed to write to cache file: $cacheFile", 3, "errors.log");
}

echo json_encode($output);
