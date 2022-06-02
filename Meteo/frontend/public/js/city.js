

var cityName;
var map;

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    cityName = urlParams.get("city");
    if (cityName != '') {
        response = await getWeatherInfoCity(cityName);
        console.log(response);
        if (response.data.error==null) { // Richiesta ok
            var latitude = response.data.coord.lat;
            var longitude = response.data.coord.lon;
            document.getElementById('city').innerHTML = cityName;
            //Init Map

            map = L.map('map').setView([latitude, longitude], 13);
            var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            var marker = L.marker([latitude, longitude]).addTo(map);

            await showCurrentData(response.data);

            response = await getWeatherForecast(latitude, longitude);

            showForecast(response);
        } else {
            //Show Modal 
            showErrorModal("Città inesistente");
        }

    } else {
        //Show Modal 
        showErrorModal("Campo Città Vuoto");
    }


});

async function showCurrentData(data) {
    //display data
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    document.getElementById('temp').innerHTML = "Temperatura :" + temp + "°C";
    document.getElementById('description').innerHTML = description;
    document.getElementById('humidity').innerHTML = "Umidità :" + humidity + "%";
    document.getElementById('wind').innerHTML = "Velocità vento  :" + speed + "km/h";
    document.getElementById('icon').src = "https://openweathermap.org/img/wn/" + icon + ".png";

}

async function showForecast(data) {
    var dim = data.cnt;
    var forecasts = data.list;
    var divForecast = document.getElementById('days');

    for (let index = 0; index < dim; index++) {
        const forecast = forecasts[index];
        insertHTML(divForecast, forecast, index);
    }


}

function insertHTML(div, forecast, index) {

    var weather = forecast.weather[0];
    var date = new Date(forecast.dt_txt);
    div.innerHTML += `<div id="forecast${index}" class ="forecast col-sm"> 
                        <img src="https://openweathermap.org/img/wn/${weather.icon}.png" class = "weather-icon">
                        <div> Temperatura : ${Math.floor(forecast.main.temp)} °C</div>
                        <div>${weather.description} </div>
                        <div> ${date.toLocaleString('it-it', { weekday: 'long' })} </div>
                        <div>${date.getHours()}:00 </div>
                    </div>`;
}

function showErrorModal(txt) {
    var errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
    document.getElementById('txt').innerText = txt;
    errorModal.show();

    errorModal._element.addEventListener('hidden.bs.modal', function (e) {
        window.location.replace("/");
    });
}