const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = '../login/login.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '../login/login.html';
});

document.getElementById('filterStatus').addEventListener('change', loadTasks);
document.getElementById('filterPriority').addEventListener('change', loadTasks);

document.getElementById('newTaskForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let isValid = true;

    function checkField(id, message) {
        const field = document.getElementById(id);
        const errorSpan = field.parentElement.querySelector('.error-message');
        const value = field.value.trim();

        if (!value) {
            errorSpan.textContent = message;
            isValid = false;
        } else {
            errorSpan.textContent = '';
        }
    }

    checkField('taskName', 'Campo obrigatório');
    checkField('taskPriority', 'Campo obrigatório');
    checkField('taskStatus', 'Campo obrigatório');
    checkField('taskDeadline', 'Campo obrigatório');
    checkField('taskDescription', 'Campo obrigatório');

    if (!isValid) return;

    const task = {
        id: Date.now().toString(),
        name: document.getElementById('taskName').value.trim(),
        description: document.getElementById('taskDescription').value.trim(),
        priority: document.getElementById('taskPriority').value,
        status: document.getElementById('taskStatus').value,
        deadline: document.getElementById('taskDeadline').value,
        userId: currentUser.id,
        deleted: false,
        createdAt: new Date().toISOString()
    };

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    this.reset();
    loadTasks();
    alert('Tarefa criada com sucesso!');
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const statusFilter = document.getElementById('filterStatus').value;
    const priorityFilter = document.getElementById('filterPriority').value;

    const filteredTasks = tasks.filter(task => {
        const matchesUser = task.userId === currentUser.id;
        const notDeleted = !task.deleted;
        return matchesUser && notDeleted;
    }).filter(task => {
        if (statusFilter && task.status !== statusFilter) return false;
        if (priorityFilter && task.priority !== priorityFilter) return false;
        return true;
    });

    const tasksList = document.getElementById('allTasksList');
    tasksList.innerHTML = '';

    filteredTasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.description}</td>
            <td>
                <select onchange="updateTaskPriority('${task.id}', this.value)" class="priority-${task.priority}">
                    <option value="baixa" ${task.priority === 'baixa' ? 'selected' : ''}>Baixa</option>
                    <option value="regular" ${task.priority === 'regular' ? 'selected' : ''}>Regular</option>
                    <option value="alta" ${task.priority === 'alta' ? 'selected' : ''}>Alta</option>
                </select>
            </td>
            <td>
                <select onchange="updateTaskStatus('${task.id}', this.value)" class="status-${task.status}">
                    <option value="criada" ${task.status === 'criada' ? 'selected' : ''}>Criada</option>
                    <option value="andamento" ${task.status === 'andamento' ? 'selected' : ''}>Em Andamento</option>
                    <option value="finalizada" ${task.status === 'finalizada' ? 'selected' : ''}>Finalizada</option>
                </select>
            </td>
            <td>
                <input type="date" value="${task.deadline}" onchange="updateTaskDeadline('${task.id}', this.value)">
            </td>
            <td>
                <button onclick="deleteTask('${task.id}')" style="background-color: var(--error-color)">
                    Excluir
                </button>
            </td>
        `;
        tasksList.appendChild(row);
    });
}

function updateTaskStatus(taskId, newStatus) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

function updateTaskPriority(taskId, newPriority) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].priority = newPriority;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

function updateTaskDeadline(taskId, newDeadline) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].deadline = newDeadline;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

function deleteTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex].deleted = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }
}

loadTasks();
