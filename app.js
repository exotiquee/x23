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
    li.className =
      'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <span>${task.name}</span>
      <span>on ${task.dueDate ? task.dueDate + ' ' + task.dueTime : ''}</span>
      <button class="btn btn-danger delete-task" data-index="${index}">Delete</button>
    `;
    list.appendChild(li);

    // Delete task event listener
    const deleteBtn = li.querySelector('.delete-task');
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
      ipcRenderer.send('tasks', tasks);
    });
  });
}

function addTask() {
  const taskName = input.value.trim();
  const dueDate = dateInput.value.trim();
  const dueTime = timeInput.value.trim();

  // Check if the task name is empty
  if (!taskName) {
    input.placeholder = 'Please enter a task name';
    shakeElement(input);
    return;
  }

  // Check if the due date is in the future
  const today = new Date();
  const selectedDate = new Date(dueDate);
  selectedDate.setHours(23, 59, 59, 999); // Set the selectedDate to the end of the day to compare with today's date

  if (selectedDate < today) {
    dateInput.placeholder = 'Due date cannot be in the past';
    shakeElement(dateInput);
    return;
  }

  tasks.push({
    name: taskName,
    dueDate,
    dueTime,
  });
  saveTasks();
  renderTasks();
  input.value = '';
  input.classList.remove('shake');
  dateInput.classList.remove('shake');
  input.focus();
}


function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function shakeElement(element) {
  element.classList.add('shake');
  if (element.tagName === 'INPUT') {
    element.placeholder = 'Please enter a task name';
    element.style.color = 'red';
  }
  setTimeout(() => {
    element.classList.remove('shake');
    if (element.tagName === 'INPUT') {
      element.placeholder = 'Enter a task name';
      element.style.color = 'black';
    }
  }, 1000);
}

// Initialize the tasks array from local storage on page load
const storedTasks = localStorage.getItem('tasks');
if (storedTasks) {
  tasks = JSON.parse(storedTasks);
  renderTasks();
}

// Set the value of the date input to the current date
const today = new Date();
const todayString = today.toISOString().substr(0, 10);
dateInput.value = todayString;

// Get the current time
var currentTime = new Date();

// Get the time components (hours and minutes)
var hours = currentTime.getHours();
var minutes = currentTime.getMinutes();

// Format the time as a string with leading zeros if needed
var formattedTime = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

// Set the value of the time input
document.getElementById('due-time').value = formattedTime;



form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask();
});


const options = document.querySelectorAll('.option');

options.forEach((option) => {
  option.addEventListener('click', () => {
    // Remove the selected class from all options
    options.forEach((otherOption) => {
      otherOption.classList.remove('selected');
    });

    // Add the selected class to the clicked option
    option.classList.add('selected');

    // Update the task list based on the selected option
    updateTaskList(option.id);
  });
});

function updateTaskList(option) {
  const filteredTasks = tasks.filter((task) => {
    if (option === 'due-today') {
      const today = new Date();
      const selectedDate = new Date(task.dueDate);
      selectedDate.setHours(00, 59, 59, 999); // Set the selectedDate to the end of the day to compare with today's date
      return selectedDate <= today;
    } else if (option === 'due-soon') {
      const today = new Date();
      const selectedDate = new Date(task.dueDate);
      selectedDate.setHours(0, 0, 0, 0); // Set the selectedDate to the beginning of the day to compare with today's date
      const daysUntilDue = Math.round((selectedDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilDue >= 0 && daysUntilDue <= 7;
    } else {
      return true;
    }
  });

  // Render the filtered tasks
  list.innerHTML = '';
  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className =
      'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <span>${task.name}</span>
      <span>${task.dueDate ? task.dueDate + ' ' + task.dueTime : ''}</span>
      <button class="btn btn-danger delete-task" data-index="${index}">Delete</button>
    `;
    list.appendChild(li);

    // Delete task event listener
    const deleteBtn = li.querySelector('.delete-task');
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      updateTaskList(option);
      ipcRenderer.send('tasks', tasks);
    });
  });
}

const loadingScreen = document.querySelector('#loading-screen');
const app = document.querySelector('#app');

// Show the loading screen
loadingScreen.style.opacity = 1;

// Hide the loading screen and show the app content after a short delay (e.g. 2 seconds)
setTimeout(() => {
  loadingScreen.style.opacity = 0;
  app.style.display = 'block';
  app.style.opacity = 1;
}, 2000);

document.addEventListener('DOMContentLoaded', () => {
  const logobackgroundElement = document.getElementById('loading-screen');
  logobackgroundElement.style.zIndex = '-2';
  const logoElement = document.getElementById('logoloading');
  logoElement.style.zIndex = '-2';
});