const { ipcRenderer } = require('electron');

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const dateInput = document.querySelector('#due-date');
const timeInput = document.querySelector('#due-time');
const list = document.querySelector('#todo-list');

let tasks = [];

function renderTasks() {
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <span>${task.name}</span>
      <span>${task.dueDate ? task.dueDate + ' ' + task.dueTime : ''}</span>
      <button class="btn btn-danger delete-task" data-index="${index}">Delete</button>
    `;
    list.appendChild(li);
  });
}

function addTask() {
    var taskInput = document.getElementById("todo-input");
    var dueDateInput = document.getElementById("due-date");
    var dueTimeInput = document.getElementById("due-time");
  
    var task = taskInput.value;
    var dueDate = dueDateInput.value;
    var dueTime = dueTimeInput.value;
  
    var todoList = document.getElementById("todo-list");
  
    var li = document.createElement("li");
    li.className = "list-group-item";
  
    var taskSpan = document.createElement("span");
    taskSpan.className = "task";
    taskSpan.innerHTML = task;
    li.appendChild(taskSpan);
  
    var dueDateSpan = document.createElement("span");
    dueDateSpan.className = "due-date";
    dueDateSpan.innerHTML = "Due Date: " + dueDate;
    li.appendChild(dueDateSpan);
  
    var dueTimeSpan = document.createElement("span");
    dueTimeSpan.className = "due-time";
    dueTimeSpan.innerHTML = "Due Time: " + dueTime;
    li.appendChild(dueTimeSpan);
  
    todoList.appendChild(li);
  
    taskInput.value = "";
    dueDateInput.value = "";
    dueTimeInput.value = "";
  }

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTaskToPage(task) {
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-center';
  li.innerHTML = `
    <span>${task.name}</span>
    <span>${task.dueDate ? task.dueDate + ' ' + task.dueTime : ''}</span>
    <button class="btn btn-danger delete-task" data-id="${task.id}">Delete</button>
  `;
  list.appendChild(li);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const taskName = input.value.trim();
  const dueDate = dateInput.value.trim();
  const dueTime = timeInput.value.trim();
  if (taskName) {
    addTask(taskName, dueDate, dueTime);
    input.value = '';
    dateInput.value = '';
    timeInput.value = '';
    ipcRenderer.send('tasks', tasks);
  }
});

list.addEventListener('click', e => {
  if (e.target.classList.contains('delete-task')) {
    const taskId = parseInt(e.target.getAttribute('data-id'));
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
    ipcRenderer.send('tasks', tasks);
  }
});

ipcRenderer.on('tasks', (event, updatedTasks) => {
  tasks = updatedTasks;
  renderTasks();
});

// Initialize the tasks array from local storage on page load
const storedTasks = localStorage.getItem('tasks');
if (storedTasks) {
  tasks = JSON.parse(storedTasks);
  renderTasks();
}

document.getElementById("todo-form").addEventListener("submit", function(event) {
    event.preventDefault();
    addTask();
  });