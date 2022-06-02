

const request = async url => {
    const response = await fetch(url);
    return response.ok ? response.json() : Promise.reject({ error: 500 });

};

const getWeatherInfoCoords = async (latitude, longitude) => {
    try {
        const response = await request(`/api/getWeatherInfoCoords?lat=${latitude}&lon=${longitude}`);
        return response;
    } catch (err) {
        console.log(err);
    }
};

const getWeatherInfoCity = async (city) => {
    try {
        const response = await request(`/api/getWeatherInfoCity?city=${city}`);
        var returnData = {
            cityName : city,
            data : response
        }
        return returnData;
    } catch (err) {
        console.log(err);
    }

};


const getWeatherForecast = async (lat,lon) => {
    try {
       const response = await request(`/api/getForecast?lat=${lat}&lon=${lon}`);
       return response;
    } catch (err) {
        console.log(err);
    }

};





