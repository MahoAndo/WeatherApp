/**
* create 5days forecast
* @param dataList : get 5days weather from api
*/
exports.create5daysForecast = function (dataList, optionList) { 
    var optionsArr = [];
    var selectArr = [];
    
    for(var i = 0; i < dataList.length; i++)
    {
        var oneDayArray = [];

        //change format of Date and time
        getEnglishDateHour(oneDayArray, dataList[i], optionList);

        var perWeatherList =  dataList[i];
        var icons = perWeatherList.weather[0].icon;
        var dayIcon = `http://openweathermap.org/img/w/${icons}.png`;

        oneDayArray.push(
            perWeatherList.weather[0].main,             //weather
            perWeatherList.weather[0].description,      //description
            perWeatherList.main.temp,                   //temperature
            perWeatherList.main.temp_min,               //temp_min
            perWeatherList.main.temp_max,               //temp_max
            perWeatherList.main.humidity,               //humidity
            dayIcon                                     //icon
        );
        optionsArr.push(oneDayArray);  
    }
    return optionsArr;
};

/**
 * Change date and time format
 * @param array 
 * @param dateList
*/
function getEnglishDateHour(array, dateList, optionList)
{
    var dateHour = new Date(dateList.dt_txt);
    var day = dateHour.toDateString().replace(/:\d+ /, ' ');
    var hour = dateHour.toLocaleTimeString('en-US').replace(/:\d+ /, ' ');

    for (let f = 0; f < optionList.length; f++) {
        if (day === optionList[f][1]) {
            array.push(optionList[f][0], day, hour);
        }
    }
    return array;
};


/**
 * date pulldown
 * 
*/
exports.getPulldown = function(dataList){
    var optionList = [];
    var start = dataList[0].dt_txt;
    var end = dataList[dataList.length-1].dt_txt;
    //Determination of the number of digits of the month
    var month;
    var dt = start.substr(0,10);
    const [y, m, d] = dt.split('-');
    if(m.substr(0,1) === '0')
        month = m.substr(1);
    else
        month = m;

    //Define two date objects to be compared
    var day1 = new Date(start.substr(0,10));
    var day2 = new Date(end.substr(0,10));
    //Find the difference day (86,400,000 milliseconds = 1 day)
    var termDay = (day2 - day1) / 86400000;
    var startDate = new Date(y, month-1, d);
    
    for (var i = 0; i < termDay + 1; ++i) {
        var pullDate;
        var dateArray = [];
            
        if(i == 0){
            startDate.setDate(startDate.getDate());
            pullDate = startDate.toDateString();
        }
        else{
            startDate.setDate(startDate.getDate() + 1);
            pullDate = startDate.toDateString();
        }
        dateArray.push(i, pullDate);
        optionList.push(dateArray);
    }
    return optionList;
}
