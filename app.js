const { ipcRenderer } = require('electron');

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');

let todos = [];

function renderTodos() {
  list.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <span>${todo}</span>
      <button class="btn btn-danger delete-todo" data-index="${index}">Delete</button>
    `;
    list.appendChild(li);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const todo = input.value.trim();
  if (todo) {
    todos.push(todo);
    renderTodos();
    input.value = '';
    ipcRenderer.send('todos', todos);
  }
});

list.addEventListener('click', e => {
  if (e.target.classList.contains('delete-todo')) {
    const index = e.target.getAttribute('data-index');
    todos.splice(index, 1);
    renderTodos();
    ipcRenderer.send('todos', todos);
  }
});

ipcRenderer.on('todos', (event, updatedTodos) => {
  todos = updatedTodos;
  renderTodos();
});
