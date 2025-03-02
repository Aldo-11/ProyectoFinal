const Task = require('../models/Task');

// Obtener todas las tareas
const getTasks = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const tasks = await Task.find({ userId: req.userId })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Task.countDocuments({ userId: req.userId });

        res.json({
            tasks,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
};

// Crear una nueva tarea
const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: 'El título de la tarea es requerido' });
        }
        
        const task = new Task({
            title,
            description,
            userId: req.userId
        });
        
        const savedTask = await task.save();
        
        res.status(201).json({ 
            message: 'Tarea creada exitosamente',
            task: savedTask 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    
    if (!['todo', 'in-progress', 'done'].includes(status)) {
        return res.status(400).json({ message: 'Estado inválido' });
    }
    
    try {
        const task = await Task.findOneAndUpdate(
            { _id: taskId, userId: req.userId },
            { status },
            { new: true } //IMPORTANTE: Esto hace que devuelva la tarea actualizada
        );

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.json({ message: 'Estado actualizado', task }); //Devuelve la tarea en la respuesta
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la tarea', error: error.message });
    }
};



// Eliminar una tarea
const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    
    try {
        const task = await Task.findOneAndDelete({ _id: taskId, userId: req.userId });
        
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        
        res.json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la tarea', error: error.message });
    }
};

const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'El título no puede estar vacío' });
    }

    try {
        const task = await Task.findOneAndUpdate(
            { _id: taskId, userId: req.userId },
            { title },
            { new: true } // IMPORTANTE: Esto devuelve la tarea actualizada
        );

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.json({ message: 'Título actualizado exitosamente', task });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la tarea', error: error.message });
    }
};

// Exportar todas las funciones
module.exports = { 
    getTasks, 
    createTask,
    updateTaskStatus,
    deleteTask,
    updateTask //IMPORTANTE
};