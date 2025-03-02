const express = require('express');
const { register, login, getUsers, updateUser, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');
const validateUser = require('../middleware/validateUser');

const router = express.Router();

// Rutas públicas
router.post('/register', validateUser, register);
router.post('/login', validateUser, login);

// Rutas protegidas
router.get('/users', authMiddleware, checkRole(['admin']), getUsers); // Solo admin puede ver todos los usuarios
router.put('/:id', authMiddleware, validateUser, updateUser); // Usuario puede editar su perfil
router.delete('/:id', authMiddleware, checkRole(['admin']), deleteUser); // Solo admin puede eliminar usuarios

module.exports = router;

