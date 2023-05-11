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
      <span>${task.dueDate ? task.dueDate + ' ' + task.dueTime : ''}</span>
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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask();
});
