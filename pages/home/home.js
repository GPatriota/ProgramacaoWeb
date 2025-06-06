const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = '../../index.html';
}

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '../../index.html';
});


document.getElementById('newTaskForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const errorSpans = document.querySelectorAll('.error-message');
    errorSpans.forEach(span => span.textContent = '');
    const inputs = this.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.classList.remove('invalid'));

    let isValid = true;

    const taskName = document.getElementById('taskName');
    const taskPriority = document.getElementById('taskPriority');
    const taskStatus = document.getElementById('taskStatus');
    const taskDeadline = document.getElementById('taskDeadline');
    const taskDescription = document.getElementById('taskDescription');

    const fields = [
        { el: taskName, name: "Nome da Tarefa" },
        { el: taskPriority, name: "Prioridade" },
        { el: taskStatus, name: "Status" },
        { el: taskDeadline, name: "Prazo" },
        { el: taskDescription, name: "Descrição" }
    ];

    fields.forEach(field => {
        if (!field.el.value.trim()) {
            const errorSpan = field.el.parentElement.querySelector('.error-message');
            errorSpan.textContent = `${field.name} é obrigatório.`;
            field.el.classList.add('invalid');
            isValid = false;
        }
    });

    if (!isValid) return;

    const task = {
        id: Date.now().toString(),
        name: taskName.value,
        description: taskDescription.value,
        priority: taskPriority.value,
        status: taskStatus.value,
        deadline: taskDeadline.value,
        userId: currentUser.id,
        deleted: false,
        createdAt: new Date().toISOString()
    };

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    this.reset();
    loadPriorityTasks();
    alert('Tarefa criada com sucesso!');
});


function loadPriorityTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const priorityTasks = tasks.filter(task => 
        task.userId === currentUser.id && 
        task.priority === 'alta' && 
        task.status !== 'finalizada' &&
        !task.deleted
    );
    
    const tasksList = document.getElementById('priorityTasksList');
    tasksList.innerHTML = '';
    
    priorityTasks.forEach(task => {
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
        loadPriorityTasks();
    }
}

function updateTaskPriority(taskId, newPriority) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].priority = newPriority;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadPriorityTasks();
    }
}

function updateTaskDeadline(taskId, newDeadline) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].deadline = newDeadline;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadPriorityTasks();
    }
}

function deleteTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].deleted = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadPriorityTasks();
    }
}

const modal = document.getElementById('weatherModal');
const weatherBtn = document.getElementById('weatherBtn');
const closeBtn = document.getElementsByClassName('close')[0];

weatherBtn.onclick = async function() {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=77edd1c87a954853b7e15314251404&q=${currentUser.city}&days=1&lang=pt`);
        const data = await response.json();
        
        const weatherInfo = document.getElementById('weatherInfo');
        weatherInfo.innerHTML = `
            <p><strong>Cidade:</strong> ${data.location.name}</p>
            <p><strong>Temperatura:</strong> ${data.current.temp_c}°C</p>
            <p><strong>Condição:</strong> ${data.current.condition.text}</p>
            <p><strong>Umidade:</strong> ${data.current.humidity}%</p>
            <p><strong>Vento:</strong> ${data.current.wind_kph} km/h</p>
            <p><strong>Previsão para hoje:</strong> ${data.forecast.forecastday[0].day.condition.text}</p>
            <p><strong>Temperatura máxima:</strong> ${data.forecast.forecastday[0].day.maxtemp_c}°C</p>
            <p><strong>Temperatura mínima:</strong> ${data.forecast.forecastday[0].day.mintemp_c}°C</p>
        `;
        
        modal.style.display = 'block';
    } catch (error) {
        alert('Erro ao buscar previsão do tempo. Tente novamente mais tarde.');
    }
}

closeBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

loadPriorityTasks();