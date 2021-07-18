//
var apiKey = "1a6294fb43846f1aaf25f430265df8b2";
var searchBtn = document.querySelector('#searchButton');
var cityInput = document.querySelector('#cityInput');
var cityName = document.querySelector('#cityName');


var cityForm = function(event) {
    var cityChoice = cityInput.value
  
    if (cityChoice) {
        getCityCoordinates(cityChoice);
        cityInput.value = '';

    };
};
searchBtn.addEventListener('click', cityForm)

// Fetch city coordinates
var getCityCoordinates = function (city) {
    var currentWeatherData = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
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
                console.log(oneCallData);
                currentWeather(data);
            });
        }
    })
}

var showTemp = function(element, temperature) {
    var temp = document.querySelector(element);
    var tempText = Math.round(temperature);
    temp.textContent = tempText;
}
var currentWeather = function (forecast) {

    var weatherImg = document.querySelector('#currentIcon');
    var Icon = forecast.current.weather[0].icon;
    weatherImg.setAttribute('src', `http://openweathermap.org/img/wn/${Icon}.png`);
    weatherImg.setAttribute('alt', forecast.current.weather[0].main)

    showTemp('#currentTemperature', forecast.current['temp']);
    showTemp('#currentHigh', forecast.daily[0].temp.max);
    showTemp('#currentLow', forecast.daily[0].temp.min);

    var conditions = document.querySelector('#currentConditions');
    conditions.textContent = forecast.current.weather[0].description

    var humidity = document.querySelector('#currentHumidity');
    humidity.textContent = forecast.current['humidity'];

    var windSpeed = document.querySelector('#currentWindSpeed')
    windSpeed.textContent = forecast.current['wind_speed'];

    var uvIndex = document.querySelector('#currentUvIndex')
    var uvIndexText = forecast.current['uvi'];
    uvIndex.textContent = uvIndexText;
}

