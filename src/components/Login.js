import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/login.css';

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/users/login`, { username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/tasks');
        } catch (error) {
            setError('Credenciales inválidas. Intenta nuevamente.');
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="page-container">
            {/* Sección de bienvenida (izquierda) */}
            <div className="welcome-section">
                <h1>Bienvenid@</h1>
                <p>Organiza tus tareas de manera eficiente y mantente productivo con nuestra aplicación de gestión de tareas.</p>
            </div>
            
            {/* Sección del formulario (derecha) */}
            <div className="login-container">
                <h2>Iniciar Sesión</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Nombre de usuario</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group password-container">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button" 
                            className="toggle-password" 
                            onClick={toggleShowPassword}
                        >
                            {showPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>
                    <button type="submit" className="login-btn">Iniciar Sesión</button>
                </form>
                
                {/* Enlace al registro */}
                <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
            </div>
        </div>
    );
};

export default Login;