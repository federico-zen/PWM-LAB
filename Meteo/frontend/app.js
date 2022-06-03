const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios').default;
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const MongoClient = require('mongodb').MongoClient;

require("dotenv").config();

// APP CONFIG
const app = express();
const port = process.env.PORT;
const api_waeather_key = process.env.API_WEATHER_KEY;
const mongo_url = process.env.MONGO;

//SESSION
app.use(sessions({
    secret: process.env.SECRET, //secret key
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 86400000 }, // one day
    resave: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// RENDER ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);

//STATIC RESOURCES
app.use(express.static(path.join(__dirname, "public")));
// -------------------------------

//ROUTES
app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/index.html", (req, res) => {
    res.render('index.html');
});

app.get("/map", (req, res) => {
    res.render('map.html');
});

app.get("/login", (req, res) => {
    if(req.session.loggato==true){
        console.log("utente gia loggato")
        res.redirect("/");
    }else{
        res.render('login', { error: null });
    }
    
});

app.get("/register", (req, res) => {
    if(req.session.loggato==true){
        console.log("utente gia loggato")
        res.redirect("/");
    }else{
        res.render('register', { error: null });
    }
});

app.get("/city", (req, res) => {

    res.render("city.html");
});

app.get("/logged", (req, res) => {
    
    if (req.session.loggato == true) {
        var user = req.session.utente.username;
        res.send({ username: user, loggato: true });
    } else {
        res.send({ username: null, loggato: false });
    }

});

app.post("/auth", (req, res) => {

    var user = req.body.username;
    var psw = req.body.password;

    if (user && psw) {

        MongoClient.connect(mongo_url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, async (err, client) => {
                if (err) {
                    res.render("login", { error: "Impossibile connettersi" });
                } else {
                    const db = client.db('PWM');
                    const utenti = db.collection('utenti');
                    var utente = await utenti.findOne({ username: user, password: psw });
                    
                    if (utente) {
                        //Utente Trovato
                        req.session.utente = utente;
                        req.session.loggato = true;
                        res.redirect("/");
                    } else {
                        res.render("login", { error: "Username o Password Errati" });
                    }

                }

            });



    } else {
        res.render("login", { error: "Inserire username e Password" });

    }

});

app.post("register",(req,res)=>{

    
});

app.get("/logout", (req, res) => {

    req.session.destroy();
    res.redirect("/");

});

//-------------------------------

//API
app.get("/api/getWeatherInfoCoords", (req, res) => {

    var lat = req.query.lat;
    var lon = req.query.lon;

    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_waeather_key}&units=metric&lang=it`)
        .then(info => {
            return res.send(info.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send({ error: "Errore" });
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
            res.send({ error: "Errore" });
        });

});

app.get("/api/getForecast", (req, res) => {

    var lat = req.query.lat;
    var lon = req.query.lon;

    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_waeather_key}&cnt=5&units=metric&lang=it`)
        .then(info => {
            return res.send(info.data);
        })
        .catch(error => {
            console.log(error.message);
            res.send({ error: "Errore" });
        });

});
//-------------------------------

var server = app.listen(port, () => {
    var port = server.address().port;

    console.log(`Applicazione in ascolto su localhost su porta ${port}`);
});