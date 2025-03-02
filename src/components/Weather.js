import { useState } from 'react';
import axios from 'axios';
import './styles/weather.css';

const API_URL = process.env.REACT_APP_API_URL;

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getWeatherByLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            setError('');
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    try {
                        const response = await axios.get(`${API_URL}/api/weather?lat=${lat}&lon=${lon}`);
                        setWeather(response.data);
                    } catch (err) {
                        setError('Error al obtener el clima');
                    } finally {
                        setLoading(false);
                    }
                },
                (error) => {
                    setLoading(false);
                    setError('No se pudo obtener la ubicación. Asegúrate de permitir el acceso.');
                }
            );
        } else {
            setError('Geolocalización no soportada en este navegador.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Elimina el token de autenticación
        window.location.href = '/login'; // Redirige a la página de login
    };

    return (
        <div className="weather-container">
            <h3>🌤 Clima</h3>
            <button onClick={getWeatherByLocation} disabled={loading}>
                {loading ? 'Cargando...' : 'Obtener mi clima'}
            </button>
            {error && <p className="error-message">{error}</p>}
            {weather && (
                <div className="weather-info">
                    <p><strong>📍 Ubicación:</strong> {weather.name}</p>
                    <p><strong>🌡 Temperatura:</strong> {weather.main.temp}°C</p>
                    <p><strong>☁️ Condición:</strong> {weather.weather[0].description}</p>
                </div>
            )}

            {/* Botón de Cerrar Sesión debajo de "Condición" */}
            <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    );
};

export default Weather;
