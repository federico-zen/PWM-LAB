var map;
var marker;

document.addEventListener('DOMContentLoaded', async () => {
  navigator.geolocation.getCurrentPosition(async position => {
    const { latitude, longitude } = position.coords;

    await initMap(latitude, longitude);
    await showData(latitude, longitude);
  }, async () => {
    latitude = 51.505;
    longitude = -0.09;

    await initMap(latitude, longitude);
    await showData(latitude, longitude);
  });
});

async function showData(latitude, longitude) {
  var data = await getWeatherInfoCoords(latitude, longitude); //get local position weather info

  //display data
  const { icon, description } = data.weather[0];
  const { temp, humidity } = data.main;
  const { speed } = data.wind;

  currentPositionTitle = document.getElementById('current-city');
    currentPositionTitle.innerText = data.name;
  document.getElementById('temp').innerHTML = "Temperatura :" + temp + "°C";
  document.getElementById('description').innerHTML = description;
  document.getElementById('humidity').innerHTML = "Umidità :" + humidity + "%";
  document.getElementById('wind').innerHTML = "Velocità vento  :" + speed + "km/h";
  document.getElementById('icon').src = "https://openweathermap.org/img/wn/" + icon + ".png";
}


function posizioneCorrente() {
  navigator.geolocation.getCurrentPosition(async position => {
    const { latitude, longitude } = position.coords;

    map.setView([latitude, longitude], 13);
    marker.setLatLng([latitude, longitude]);


    await showData(latitude, longitude);

  }, () => {
    alert("Posizione Attuale non disponibile");
  });
}

async function initMap(latitude, longitude) {

  map = L.map('map').setView([latitude, longitude], 13);

  var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  marker = L.marker([latitude, longitude]).addTo(map);

  map.on('click', async (ev) => {
    marker.setLatLng(ev.latlng);
    await showData(ev.latlng.lat, ev.latlng.lng);
  });
}
