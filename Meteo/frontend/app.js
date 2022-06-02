const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios').default;


require("dotenv").config();

// APP CONFIG
const app = express();
const port = process.env.PORT;
const api_waeather_key = process.env.API_WEATHER_KEY;



// Render Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);

//Static resources
app.use(express.static(path.join(__dirname, "public")));
// -------------------------------

app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/map", (req, res) => {
    res.render('map.html');
});

app.get("/login", (req, res) => {
    res.render('login.html');
});

app.get("/city", (req, res) => {

    res.render("city.html");
});


app.get("/api/getWeatherInfoCoords", (req, res) => {

    var lat = req.query.lat;
    var lon = req.query.lon;

    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_waeather_key}&units=metric&lang=it`)
        .then(info => {
            return res.send(info.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send({error : "Errore"});
        });
});

app.get("/api/getWeatherInfoCity", (req, res) => {

    var city = req.query.city;
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_waeather_key}&units=metric&lang=it`)
        .then(info => {
            return res.send(info.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send({error : "Errore"});
        });

});

app.get("/api/getForecast" , (req,res)=>{
    
    var lat = req.query.lat;
    var lon = req.query.lon;
    
   axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_waeather_key}&cnt=5&units=metric&lang=it`)
        .then(info => {
            return res.send(info.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send({error : "Errore"});
        });
    
});


var server = app.listen(port, () => {
    var port = server.address().port;

    console.log(`Applicazione in ascolto su localhost su porta ${port}`);
});