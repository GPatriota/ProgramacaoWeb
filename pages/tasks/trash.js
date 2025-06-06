const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = '../../index.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '../../index.html';
});


function loadDeletedTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const deletedTasks = tasks.filter(task => 
        task.userId === currentUser.id && 
        task.deleted === true
    );
    
    const tasksList = document.getElementById('deletedTasksList');
    tasksList.innerHTML = '';
    
    deletedTasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.description}</td>
            <td><span class="priority-badge priority-${task.priority}">${task.priority}</span></td>
            <td><span class="status-badge status-${task.status}">${task.status}</span></td>
            <td>${new Date(task.deadline).toLocaleDateString()}</td>
            <td>
                <button onclick="restoreTask('${task.id}')" style="background-color: var(--success-color); margin-right: 0.5rem;">
                    Restaurar
                </button>
                <button onclick="deleteTaskPermanently('${task.id}')" style="background-color: var(--error-color)">
                    Excluir
                </button>
            </td>
        `;
        tasksList.appendChild(row);
    });
}

function restoreTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].deleted = false;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadDeletedTasks();
    }
}

function deleteTaskPermanently(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    loadDeletedTasks();
}

function restoreAllTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.map(task => {
        if (task.userId === currentUser.id && task.deleted) {
            return { ...task, deleted: false };
        }
        return task;
    });
    
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    loadDeletedTasks();
}

function deleteAllTasks() {
    if (confirm('Tem certeza que deseja excluir permanentemente todas as tarefas da lixeira?')) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => 
            !(task.userId === currentUser.id && task.deleted)
        );
        
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        loadDeletedTasks();
    }
}

loadDeletedTasks();