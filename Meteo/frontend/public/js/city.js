

var cityName;
var map;

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    cityName = urlParams.get("city");
    if (cityName != '') {
        response = await getWeatherInfoCity(cityName);

        if (response.data.error == null) { // Richiesta ok
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

            //Check if the user is logged

            res = await checkLogged();
            var btn = document.getElementById('favBtn');
            if (res.loggato == true) {
                //check if the city is in favourite
                var list = res.user.favCity;
                //console.log(list)

                if (list.includes(cityName)) {

                    btn.innerHTML = '<i class="bi bi-star-fill"></i>'
                    btn.style.backgroundColor = "#ffc400";
                } else {
                    btn.innerHTML = `<i class="bi bi-star"></i>`;
                }

            } else {
                btn.classList.add('disabled');
            }

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

    document.getElementById('temp').innerHTML = "Temperatura :" + Math.floor(temp) + "°C";
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
                        <div>${date.getHours()}:00 </div>
                        <div> ${date.toLocaleString('it-it', { weekday: 'long' })} </div>
                        <div> Temperatura : ${Math.floor(forecast.main.temp)} °C</div>
                        <div>${weather.description} </div>
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

function addFav() {
    cityName = document.getElementById('city');

    //send cityName

}