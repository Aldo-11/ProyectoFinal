import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register'; // Importar página de registro
import TaskList from './components/TaskList';
import Weather from './components/Weather';
import TaskBoard from "./components/TaskBoard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> 
                <Route path="/tasks" element={<TaskList />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/taskboard" element={<TaskBoard />} />
            </Routes>
        </Router>
    );
}

export default App;

