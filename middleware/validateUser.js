// middleware/validateUser.js
const validateUser = (req, res, next) => {
    const { username, password } = req.body;

    // Verificar que el nombre de usuario y la contraseña no estén vacíos
    if (!username || !password) {
        return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos' });
    }

    // Verificar que el nombre de usuario tenga al menos 3 caracteres
    if (username.length < 3) {
        return res.status(400).json({ message: 'El nombre de usuario debe tener al menos 3 caracteres' });
    }

    // Verificar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    next(); // Si todo está bien, continuar con la siguiente función
};

module.exports = validateUser;

