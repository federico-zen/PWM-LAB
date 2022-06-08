


document.addEventListener('DOMContentLoaded',async () => {

    //load City
    var cities = ['milano','sidney','londra'];
    for (const city of cities){
        var response;
        response = await getWeatherInfoCity(city);
        document.getElementById(`temp-${response.cityName}`).innerText =Math.floor( response.data.main.temp )+ "°C";
        document.getElementById(`temp-${response.cityName}-slider`).innerText = Math.floor( response.data.main.temp ) + "°C";
    }



    navigator.geolocation.getCurrentPosition(async position => {
        const { latitude, longitude } = position.coords;
        var data = await getWeatherInfoCoords(latitude, longitude); //get local position weather info

        //display data
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;


        currentPositionTitle = document.getElementById('current-city');
        currentPositionWeather = document.getElementById('current-temp');

        currentPositionTitle.innerText = data.name;
        document.getElementById('temp').innerHTML = "Temperatura :" +  Math.floor(temp) + "°C";
        document.getElementById('description').innerHTML = description;
        document.getElementById('humidity').innerHTML = "Umidità :" + humidity + "%";
        document.getElementById('wind').innerHTML = "Velocità vento  :" + speed + "km/h";
        document.getElementById('icon').src = "https://openweathermap.org/img/wn/" + icon + ".png";

    }, ()=>{
        currentPositionTitle = document.getElementById('current-city');
        currentPositionTitle.innerText = "Posizione Corrente non Disponibile";
    });


});





