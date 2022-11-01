const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const ejs = require("ejs");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");

var http = require('http');
var fs = require('fs');

// Parsing form values
app.use(bodyParser.urlencoded({ extended: true }));
//get particular path
app.use(express.static(path.join("js")));
//Dynamic files: set ejs template engine
app.set("view engine", "ejs");
// export file
const weatherData = require('../src/weatherData');

var weData = [];


/*************************
 * setting top(form)page
**************************/
app.get("/", (req,res) =>{
    res.render('weather', {
        weatherData : weData,
        selectCity : ""
    });
});

/*************************
 * Display input results
**************************/
app.post("/weather", (req, res) =>{
    let cityName;
    let selectedNo;
    weData = [];
        console.log(req.body.selectNo1);
    //get city
    if (req.body.city != "")
    {
        cityName = req.body.city;
        selectedNo = 0;
    }
    else
    {
        cityName = req.body.selectCity;
        selectedNo = req.body.selectNo;
    }

    //Today's weather
    weatherData.todayWeatherData(cityName, (error, {weatherInfo}) => {
        if (error) {
            return res.send({error});
        }else{
            weData = weatherInfo;
        }
    });
    //Five days weather
    weatherData.fiveDaysWeatherData(cityName, selectedNo, (error, {selectedArr, options}) => {
        if (error) {
            return res.send({error});
        }else{
            weData.push(selectedArr, options);
            res.render('weather', 
            {
                weatherData : weData,
                selectCity : cityName,
                selectedDate : weData[9][selectedNo][1]
            });
        }
    });
});    

//launch the local server by using express
app.listen(PORT,() => console.log("It's running."));
