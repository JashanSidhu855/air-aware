// Importing all frameworks required
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");
const { response } = require("express");

// API key - 7634c2cd74ad481f9a395914230503
const API = "7634c2cd74ad481f9a395914230503"

// Create global variables
var forecastedData = {
    city: "",
    tempCel: 0,
    windDir: "",
    windSpeed: 0,
    humidity: 0,
    region: "",
    country: "",
    timeZone: ""
}
// For home page popular cities
var popularCities = {

}
var code = 0;

app.use(express.urlencoded({ extended: true }));
app.set("view-engine", "ejs");
app.use(express.static(__dirname + "/public"));


// Forecasting weather for popular cities
const URL = "https://api.weatherapi.com/v1/current.json?key=" + API;
// London
https.get(URL + "&q=london", function (res) {
  res.on("data", function (data) {
    const Data = JSON.parse(data);
    popularCities.londonTemp = Data.current.temp_c;
    popularCities.londonDesc = Data.current.condition.text;
  });
});
// Toronto
https.get(URL + "&q=toronto", function (res) {
  res.on("data", function (data) {
    const Data = JSON.parse(data);
    popularCities.torontoTemp = Data.current.temp_c;
    popularCities.torontoDesc = Data.current.condition.text;
  });
});
// Delhi
https.get(URL + "&q=delhi", function (res) {
  res.on("data", function (data) {
    const Data = JSON.parse(data);
    popularCities.delhiTemp = Data.current.temp_c;
    popularCities.delhiDesc = Data.current.condition.text;
  });
});
// Melbourne
https.get(URL + "&q=melbourne", function (res) {
  res.on("data", function (data) {
    const Data = JSON.parse(data);
    popularCities.melbourneTemp = Data.current.temp_c;
    popularCities.melbourneDesc = Data.current.condition.text;
  });
});
app.get("/", function (req, res) {
  res.render("home.ejs", {
    londonTemp: popularCities.londonTemp,
    londonDesc: popularCities.londonDesc,
    torontoTemp: popularCities.torontoTemp,
    torontoDesc: popularCities.torontoDesc,
    delhiTemp: popularCities.delhiTemp,
    delhiDesc: popularCities.delhiDesc,
    melbourneTemp: popularCities.melbourneTemp,
    melbourneDesc: popularCities.melbourneDesc,
  });
});
app.post("/", function (req, res) {
  forecastedData.city = req.body.search;
  let url =
    "https://api.weatherapi.com/v1/current.json?key=" +
    API +
    "&q=" +
    forecastedData.city;
  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      code = weatherData.cod;

      if (code === 404) {
        res.redirect("/error");
      } else if (weatherData.current) {
        forecastedData.tempCel = weatherData.current.temp_c;
        forecastedData.weatherDesc = weatherData.current.condition.text;
        forecastedData.imgDesc = weatherData.current.condition.icon;
        forecastedData.windDir = weatherData.current.wind_dir;
        forecastedData.windSpeed = weatherData.current.wind_kph;
        forecastedData.humidity = weatherData.current.humidity;
        forecastedData.region = weatherData.location.region;
        forecastedData.country = weatherData.location.country;
        forecastedData.timeZone = weatherData.location.tz_id;

        res.redirect("/forecasted");
      } else {
        res.redirect("/error");
      }
    });
  });
});

app.get("/forecasted", function (req, res) {
  res.render("forecasted.ejs", {
    cityName: forecastedData.city,
    tempCel: forecastedData.tempCel,
    imgDesc: forecastedData.imgDesc,
    weatherDesc: forecastedData.weatherDesc,
    windDir: forecastedData.windDir,
    windSpeed: forecastedData.windSpeed,
    humidity: forecastedData.humidity,
    region: forecastedData.region,
    country: forecastedData.country,
    timeZone: forecastedData.timeZone,
    
  });
});

app.get("/error", function (req, res) {
  res.render("error.ejs");
});

app.listen(3000, function () {
  console.log("Server has started at port 3000.");
});