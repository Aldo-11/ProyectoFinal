const express = require('express');
const { getTasks, createTask, updateTask, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Rutas para tareas
router.get('/tasks', authMiddleware, getTasks);
router.post('/tasks', authMiddleware, createTask);
router.put('/tasks/:taskId/status', authMiddleware, updateTaskStatus); // Usar updateTaskStatus
router.put('/tasks/:taskId', authMiddleware, updateTask);
router.delete('/tasks/:taskId', authMiddleware, deleteTask);

module.exports = router;