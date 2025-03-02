const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registro de usuario
const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }

        // Crear y guardar el nuevo usuario
        const user = new User({ username, password });
        await user.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (err) {
        next(err);
    }
};


// Inicio de sesión
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Buscar el usuario en la base de datos
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar el token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        next(err);
    }
};

// Obtener todos los usuarios (solo para usuarios autenticados)
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, '-password'); // Excluir la contraseña de la respuesta
        res.json(users);
    } catch (err) {
        next(err);
    }
};

// Actualizar usuario
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params; // ID del usuario a actualizar
        const { username, password } = req.body;

        // Verificar si el usuario existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Método updateUser
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        
        // Actualizar el usuario
        user.username = username || user.username; // Si no se proporciona un nuevo nombre de usuario, se mantiene el actual
        if (password) {
            user.password = password; // Si se proporciona una nueva contraseña, se actualiza
        }
        await user.save();

        res.json({ message: 'Usuario actualizado exitosamente', user });
    } catch (err) {
        next(err);
    }
};

// Eliminar usuario
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params; // ID del usuario a eliminar

        // Verificar si el usuario existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        if (req.userId === id) {
            return res.status(400).json({ message: 'No puedes eliminarte a ti mismo.' });
        }
        
        await User.findByIdAndDelete(id);
        res.json({ message: 'Usuario eliminado exitosamente' });        
    } catch (err) {
        next(err);
    }
};


module.exports = { register, login, getUsers, updateUser, deleteUser };
