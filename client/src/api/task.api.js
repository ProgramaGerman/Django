import axios from 'axios'; 

const api = axios.create({
    baseURL: 'http://localhost:8000/tasks/api/v1/tasks',
});

export const getAllTasks = () => {
    return api.get('/');
}

export const getTaskID = (taskId) => {
    return api.get(`/${taskId}/`);
}

export const createTask = (task) => {
    return api.post('/', task);
}

export const deleteTask = (taskId) => {
    return api.delete(`/${taskId}/`);
}

export const updateTask = (taskId, task) => {
    return api.put(`/${taskId}/`, task);
}



