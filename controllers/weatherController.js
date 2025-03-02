const axios = require('axios');
require('dotenv').config();

const translateWeather = (description) => {
    const translations = {
        "clear sky": "Cielo despejado",
        "few clouds": "Pocas nubes",
        "scattered clouds": "Nubes dispersas",
        "broken clouds": "Parcialmente nublado",
        "overcast clouds": "Nublado",
        "shower rain": "Llovizna",
        "rain": "Lluvia",
        "thunderstorm": "Tormenta",
        "snow": "Nieve",
        "mist": "Neblina"
    };
    return translations[description] || description;
};

const getWeather = async (req, res) => {
    try {
        const { city, lat, lon } = req.query;
        const apiKey = process.env.WEATHER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'API Key no encontrada' });
        }

        let apiUrl;

        if (lat && lon) {
            // Si el usuario envía latitud y longitud, usar coordenadas
            apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        } else if (city) {
            // Si envía una ciudad, buscar por ciudad
            apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        } else {
            return res.status(400).json({ message: 'Debes proporcionar una ciudad o coordenadas (lat, lon)' });
        }

        const response = await axios.get(apiUrl);
        const weatherData = response.data;

        weatherData.weather[0].description = translateWeather(weatherData.weather[0].description);

        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el clima', error: error.message });
    }
};

module.exports = { getWeather };

