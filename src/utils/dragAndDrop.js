import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; 

export const handleDragStart = (event, taskId) => {
    event.dataTransfer.setData('taskId', taskId);
};

export const handleDrop = async (event, newStatus, setTasks) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('taskId');

    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
            `${API_URL}/api/tasks/${taskId}/status`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.data.task) {
            throw new Error('No se recibió la tarea actualizada del servidor.');
        }

        const updatedTask = response.data.task;

        setTasks(prevTasks => {
            if (Array.isArray(prevTasks)) {
                return prevTasks.map(task => 
                    task._id === taskId ? {...task, status: newStatus} : task
                );
            } else {
                const updatedTasks = { ...prevTasks };
                
                // Eliminar la tarea de su estado anterior
                Object.keys(updatedTasks).forEach(key => {
                    if (Array.isArray(updatedTasks[key])) {
                        updatedTasks[key] = updatedTasks[key].filter(task => 
                            String(task._id) !== String(taskId)
                        );
                    }
                });
                
                // Asegurar que updatedTasks[newStatus] es un array
                if (!Array.isArray(updatedTasks[newStatus])) {
                    updatedTasks[newStatus] = [];
                }
                
                // Agregar la tarea al nuevo estado
                updatedTasks[newStatus] = [...updatedTasks[newStatus], updatedTask];
                
                return updatedTasks;
            }
        });
    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
    }
};

export const allowDrop = (event) => {
    event.preventDefault();
};
