import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/taskboard.css';
import Weather from './Weather';
import { handleDragStart, handleDrop, allowDrop } from '../utils/dragAndDrop';

const API_URL = process.env.REACT_APP_API_URL;

const TaskBoard = () => {
    const [taskInput, setTaskInput] = useState('');
    const [tasks, setTasks] = useState({ todo: [], 'in-progress': [], done: [] });
    const [editingTask, setEditingTask] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No hay sesión activa. Por favor inicie sesión.');
                setLoading(false);
                return;
            }
    
            const response = await axios.get(`${API_URL}/api/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log('📌 Respuesta de la API:', response.data); // Para verificar la respuesta en la consola
    
            if (!response.data.tasks || !Array.isArray(response.data.tasks)) {
                throw new Error('La API no devolvió un array de tareas');
            }
    
            // ✅ Filtrar desde response.data.tasks
            const todoTasks = response.data.tasks.filter(task => task.status === 'todo');
            const inProgressTasks = response.data.tasks.filter(task => task.status === 'in-progress');
            const doneTasks = response.data.tasks.filter(task => task.status === 'done');
    
            setTasks({ todo: todoTasks, 'in-progress': inProgressTasks, done: doneTasks });
            setLoading(false);
        } catch (error) {
            console.error('❌ Error al obtener las tareas:', error);
            setError('Error al cargar las tareas. Intente nuevamente.');
            setLoading(false);
        }
    };
    

    const handleAddTask = async () => {
        if (taskInput.trim() === '') return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/api/tasks`,
                { title: taskInput },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setTasks(prevTasks => ({
                ...prevTasks,
                todo: [...prevTasks.todo, response.data.task]
            }));

            setTaskInput('');
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            setError('Error al crear la tarea. Intente nuevamente.');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTasks(prevTasks => {
                const updatedTasks = { ...prevTasks };
                for (const key in updatedTasks) {
                    updatedTasks[key] = updatedTasks[key].filter(task => task._id !== taskId);
                }
                return updatedTasks;
            });
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
                `${API_URL}/api/tasks/${taskId}`,
                { title: editedText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (!response.data || !response.data.task) {
                throw new Error('No se recibió la tarea actualizada desde el servidor.');
            }
    
            setTasks(prevTasks => {
                const updatedTasks = { ...prevTasks };
                for (const key in updatedTasks) {
                    updatedTasks[key] = updatedTasks[key].map(task =>
                        task._id === taskId ? { ...task, title: editedText } : task
                    );
                }
                return updatedTasks;
            });
    
            cancelEditing();
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
        }
    };    

    if (loading) {
        return <div className="loading">Cargando tareas...</div>;
    }

    return (
        <div className="task-container">
            <h2>Mis Tareas</h2>

            {error && <p className="error-message">{error}</p>}

            <div className="task-input-container">
                <input
                    type="text"
                    placeholder="Nueva tarea"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <button onClick={handleAddTask}>Agregar</button>
            </div>

            <div className="task-columns">
                {['todo', 'in-progress', 'done'].map((status) => (
                    <div
                        key={status}
                        className="task-column"
                        onDrop={(e) => handleDrop(e, status, setTasks)}
                        onDragOver={allowDrop}
                    >
                        <h3>
                            {status === 'todo' ? 'Por Hacer' : status === 'in-progress' ? 'En Progreso' : 'Completado'}
                        </h3>
                        <ul className="task-list">
                            {tasks[status].map((task) => (
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
                                                onKeyDown={(e) => e.key === 'Enter' && saveEditedTask(task._id)}
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

export default TaskBoard;
