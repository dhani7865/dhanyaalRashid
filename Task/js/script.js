$(document).ready(function() {
    $('#locationForm').on('submit', function(e) {
        e.preventDefault();
        var location = $('#location').val();
        
        // Log location before making the request
        console.log('Location:', location);

        if (location) {
            fetchData(location);
        } else {
            alert("Please enter a location!");
        }
    });

    function fetchData(location) {
        console.log(location);  // Log the location before sending the request
        $.ajax({
            url: 'API%20task/get_data.php',
            method: 'GET',
            data: { location: location },
            success: function(response) {
                console.log('Server Response:', response);  // Log the response
                try {
                    var data = JSON.parse(response);

                    $('#weather').html('<h3>Weather</h3><p>' + (data.weather.description || 'No data available') + ' | ' + (data.weather.temp || 'No temperature data available') + '°C</p>');
                    if (typeof data.geo === 'object') {
                        $('#geo').html('<h3>Geographical Info</h3>' +
                            '<p>Country: ' + data.geo.country + '</p>' +
                            '<p>State: ' + data.geo.state + '</p>' +
                            '<p>Latitude: ' + data.geo.latitude + '</p>' +
                            '<p>Longitude: ' + data.geo.longitude + '</p>');
                    } else {
                        $('#geo').html('<h3>Geographical Info</h3><p>No data available</p>');
                    }
                    
                    $('#population').html('<h3>Population</h3><p>' + (data.population || 'No data available') + '</p>');
                } catch (e) {
                    console.log('Error parsing JSON:', e);  // Log JSON parsing error
                    alert('Failed to parse the response data.');
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('AJAX Error:', textStatus, errorThrown);  // Log AJAX errors
                alert('An error occurred while fetching data.');
            }
        });
    }
});
