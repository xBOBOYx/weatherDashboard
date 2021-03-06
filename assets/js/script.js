// Variables
var apiKey = "1a6294fb43846f1aaf25f430265df8b2";
var searchBtn = document.querySelector('#searchButton');
var cityInput = document.querySelector('#cityInput');
var cityName = document.querySelector('#cityName');
var cityList = [];


var cityForm = function (event) {
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

                // saves searched city and refreshes recent city list
                if (document.querySelector('.city-list')) {
                    document.querySelector('.city-list').remove();
                }

                storeCity(city);
                pullCity()
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
                todayWeather(data);
                showFiveDay(data);
            });
        }
    })
}

// show temp
var showTemp = function (element, temperature) {
    var temp = document.querySelector(element);
    var tempText = Math.round(temperature);
    temp.textContent = tempText;
}

//show today's weather
var todayWeather = function (forecast) {

    var peekabooForecast = document.querySelector('.peekabooForecast');
    peekabooForecast.classList.remove('hide');

    var weatherImg = document.querySelector('#todayIcon');
    var icon = forecast.current.weather[0].icon;
    weatherImg.setAttribute('src', `http://openweathermap.org/img/wn/${icon}.png`);
    weatherImg.setAttribute('alt', forecast.current.weather[0].main);

    showTemp('#todayTemperature', forecast.current['temp']);
    showTemp('#todayHigh', forecast.daily[0].temp.max);
    showTemp('#todayLow', forecast.daily[0].temp.min);

    var conditions = document.querySelector('#todayConditions');
    conditions.textContent = forecast.current.weather[0].description

    var humidity = document.querySelector('#todayHumidity');
    humidity.textContent = forecast.current['humidity'];

    var windSpeed = document.querySelector('#todayWindSpeed')
    windSpeed.textContent = forecast.current['wind_speed'];

    var uvIndex = document.querySelector('#todayUvIndex')
    var uvIndexText = forecast.current['uvi'];
    uvIndex.textContent = uvIndexText;
    
}

// show five day forecast
var showFiveDay = function (forecast) {

    for (var i = 1; i < 6; i++) {
        var fiveDay = document.querySelector('#day-' + i);
        fiveDay.textContent = moment().add(i, 'days').format('M/D/YYYY');

        var fiveDayImg = document.querySelector('#weatherIcon-' + i);
        var fiveDayIcon = forecast.daily[i].weather[0].icon;
        fiveDayImg.setAttribute('src', `http://openweathermap.org/img/wn/${fiveDayIcon}.png`);
        fiveDayImg.setAttribute('alt', forecast.daily[i].weather[0].main);

        showTemp('#fdTemp-' + i, forecast.daily[i].temp.day);
        showTemp('#fdHigh-' + i, forecast.daily[i].temp.max);
        showTemp('#fdLow-' + i, forecast.daily[i].temp.min);

        var fiveDayHumidity = document.querySelector('#fdHumidity-' + i);
        fiveDayHumidity.textContent = forecast.daily[i].humidity;

        var fiveDayWindSpeed = document.querySelector('#fdWindSpeed-' + i)
        fiveDayWindSpeed.textContent = forecast.daily[i].wind_speed;
    }


}

// store city
var storeCity = function (city) {

    for (var i = 0; i < cityList.length; i++) {
        if (city === cityList[i]) {
            cityList.splice(i, 1);
        }
    }
    cityList.push(city);
    localStorage.setItem('cities', JSON.stringify(cityList));
}

// pull city from storage
var pullCity = function () {
    cityList = JSON.parse(localStorage.getItem('cities'));

    if (!cityList) {
        cityList = [];
        return false;
    }

    var storedCities = document.querySelector('#storedCities');
    var listCities = document.createElement('ul');
    listCities.className = 'list-group list-group-flush city-list';
    storedCities.appendChild(listCities);

    for (var i = 0; i < cityList.length; i++) {
        var recentCityList = document.createElement('button');
        recentCityList.setAttribute('type', 'button');
        recentCityList.className = 'list-group-item';
        recentCityList.setAttribute('value', cityList[i]);
        recentCityList.textContent = cityList[i];
        listCities.prepend(recentCityList);
    }

    var cityList = document.querySelector('.city-list');
    cityList.addEventListener('click', citySearchHistory)
}

var citySearchHistory = function (event) {
    var selectCity = event.target.getAttribute('value');

    getCityCoordinates(selectCity);
}

pullCity();