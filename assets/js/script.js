var apiKey = "1a6294fb43846f1aaf25f430265df8b2";
var searchBtn = document.querySelector('#searchButton');
var cityInput = document.querySelector('#cityInput');
var cityName = document.querySelector('#cityName');


var cityForm = function(event) {
    var selectedCity = cityInput.value
  
    if (selectedCity) {
        getCityCoordinates(selectedCity);
        cityInput.value = '';

    };
};
searchBtn.addEventListener('click', cityForm)

var getCityCoordinates = function (city) {
    var currentWeatherData = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    console.log(searchBtn);
    fetch(currentWeatherData).then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    var longitude = data.coord['lon'];
                    var latitude = data.coord['lat'];
                    getCityWeather(city, longitude, latitude);
                });
            }
        })
        
}
// Longitude and Latitude to fetch today's weather
var getCityWeather = function (city, longitude, latitude) {
    var oneCallData = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly,alerts&appid=${apiKey}`;
    fetch(oneCallData).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {


                cityName.textContent = `${city} (${moment().format("M/D/YYYY")})`;

                console.log(data);
                console.log(oneCallApi);
                currentForecast(data);
            });
        }
    })
}

var showTemp = function(element, temperature) {
    var temp = document.querySelector(element);
    var tempText = Math.round(temperature);
    temp.textContent = tempText;
}
var currentForecast = function (forecast) {

    showTemp('#currentTemperature', forecast.current['temp']);
}