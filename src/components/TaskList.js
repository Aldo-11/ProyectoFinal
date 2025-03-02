import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/home.css';
import Weather from './Weather';
import { handleDragStart, handleDrop, allowDrop } from '../utils/dragAndDrop';

const API_URL = process.env.REACT_APP_API_URL;

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [editedText, setEditedText] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/tasks`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                console.log("📌 Datos recibidos de la API:", response.data); // <-- Agrega este console.log
    
                if (!response.data.tasks || !Array.isArray(response.data.tasks)) {
                    throw new Error("La API no devolvió un array de tareas");
                }
    
                setTasks(response.data.tasks);
            } catch (error) {
                console.error("❌ Error al obtener las tareas:", error);
            }
        };
        fetchTasks();
    }, []);
    

    const handleCreateTask = async () => {
        if (!newTask.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/api/tasks`,
                { title: newTask },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks([...tasks, response.data.task]);
            setNewTask('');
        } catch (error) {
            console.error('Error al crear la tarea:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    };

    const startEditing = (task) => {
        setEditingTask(task._id);
        setEditedText(task.title);
    };

    const cancelEditing = () => {
        setEditingTask(null);
        setEditedText('');
    };

    const saveEditedTask = async (taskId) => {
        if (!editedText.trim()) {
            cancelEditing();
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${API_URL}/api/tasks/${taskId}`, // Ruta correcta
                { title: editedText }, // Envía el nuevo título
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Actualizar el estado inmediatamente
            const updatedTasks = tasks.map(task =>
                task._id === taskId ? { ...task, title: editedText } : task
            );
            setTasks(updatedTasks);
    
            // Resetear la edición
            setEditingTask(null);
            setEditedText('');
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
        }
    };

    const handleEditKeyPress = (e, taskId) => {
        if (e.key === 'Enter') {
            saveEditedTask(taskId);
        } else if (e.key === 'Escape') {
            cancelEditing();
        }
    };

    return (
        <div className="task-container">
            <h2>Mis Tareas</h2>
            
            <div className="task-input-container">
                <input
                    type="text"
                    placeholder="Nueva tarea"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTask()}
                />
                <button onClick={handleCreateTask}>Agregar</button>
            </div>

            <div className="task-columns">
                {['todo', 'in-progress', 'done'].map((status) => (
                    <div
                        key={status}
                        className="task-column"
                        onDrop={(e) => handleDrop(e, status, setTasks)}
                        onDragOver={allowDrop}
                    >
                        <h3>{status === 'todo' ? 'Por Hacer' : status === 'in-progress' ? 'En Progreso' : 'Completado'}</h3>
                        <ul className="task-list">
                            {tasks
                                .filter((task) => task.status === status)
                                .map((task) => (
                                    <li
                                        key={task._id}
                                        draggable={editingTask !== task._id}
                                        onDragStart={(e) => handleDragStart(e, task._id)}
                                        className="task-item"
                                    >
                                        {editingTask === task._id ? (
                                            <div className="task-edit-container">
                                                <input
                                                    type="text"
                                                    value={editedText}
                                                    onChange={(e) => setEditedText(e.target.value)}
                                                    onKeyDown={(e) => handleEditKeyPress(e, task._id)}
                                                    className="task-edit-input"
                                                    autoFocus
                                                />
                                                <div className="task-edit-buttons">
                                                    <button 
                                                        onClick={() => saveEditedTask(task._id)}
                                                        className="task-action-button save-button"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button 
                                                        onClick={cancelEditing}
                                                        className="task-action-button cancel-button"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="task-content">
                                                <span className="task-title">{task.title}</span>
                                                <div className="task-actions">
                                                    <button 
                                                        onClick={() => startEditing(task)}
                                                        className="task-action-button edit-button"
                                                        title="Editar tarea"
                                                    >
                                                        ✎
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteTask(task._id)}
                                                        className="task-action-button delete-button"
                                                        title="Eliminar tarea"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                        </ul>
                    </div>
                ))}
            </div>

            <Weather />
        </div>
    );
};

export default TaskList;