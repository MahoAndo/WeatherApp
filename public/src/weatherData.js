const request = require('request');
// export file
const constants = require('./config');
const dateFormat = require("../src/weatherFormat");


/**
 * get today's weather information from open weather map api
 * @param address : location name
*/
exports.todayWeatherData = (address, callback) => {
    let weatherInfo = [];
    const url = constants.TODAY_URL + encodeURIComponent(address) + '&units=metric&appid=' + process.env.API_KEY;
    request({url, json:true}, (error, {body}) => {
        if (error) {
            callback("Can't get data from open weather map api", undefined);
        }else{
            const icon_key = body.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/w/${icon_key}.png`;
            
            weatherInfo.push(
                body.name,
                body.weather[0].main,          //main weather
                body.weather[0].description,   //description
                body.main.temp,                //temperature
                body.main.temp_min,            //temp_min
                body.main.temp_max,            //temp_max
                body.main.humidity,            //humidity
                iconUrl                        //icon
            );
            callback(undefined,{weatherInfo})
        };
    });
};

/**
 * get five days weather information from open weather map api
 * @param cityName : location name
*/
exports.fiveDaysWeatherData = (cityName, selectNo, callback) => {
    var options;
    var selectedArr = [];

    const url = constants.FIVE_DAYS_URL + encodeURIComponent(cityName) + '&units=metric&appid=' + process.env.API_KEY;
    request({url, json:true}, (error, {body}) => {
        if (error){
        }else{
                //get 5days forecastList(1day = 0:00AM ~ 21:00PM)
                var weatherList = body.list;
                // get Date pulldown
                options = dateFormat.getPulldown(weatherList);

                var fiveDays = dateFormat.create5daysForecast(weatherList, options);
                // now selected date's forecast
                for (let j = 0; j < fiveDays.length; j++) {
                    if (fiveDays[j][0] == selectNo)
                        selectedArr.push(fiveDays[j]);
                };
                callback(undefined,{selectedArr, options})
        }
    });
};
