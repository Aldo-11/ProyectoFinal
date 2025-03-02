import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/register.css';

const API_URL = process.env.REACT_APP_API_URL;

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(''); // Para éxito o error
    const [isSuccess, setIsSuccess] = useState(false); // Estado para diferenciar éxito de error
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setMessage('La contraseña debe tener al menos 6 caracteres.');
            setIsSuccess(false);
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Las contraseñas no coinciden.');
            setIsSuccess(false);
            return;
        }

        try {
            await axios.post(`${API_URL}/api/users/register`, { username, password });

            // Mensaje de éxito
            setMessage('Usuario registrado con éxito. Redirigiendo al login...');
            setIsSuccess(true);

            // Esperar 2 segundos y redirigir al login
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setMessage('El usuario ya existe o hubo un error en el registro.');
            setIsSuccess(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="register-container">
            <h2>Registro</h2>
            
            {/* Mensaje de éxito o error */}
            {message && <p className={isSuccess ? 'success-message' : 'error-message'}>{message}</p>}
            
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
                <div className="input-group password-container">
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        placeholder="Confirmar Contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button 
                        type="button" 
                        className="toggle-password" 
                        onClick={toggleShowConfirmPassword}
                    >
                        {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                </div>
                <button type="submit" className="register-btn">Registrarse</button>
            </form>

            {/* Enlace para volver al login */}
            <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
        </div>
    );
};

export default Register;
