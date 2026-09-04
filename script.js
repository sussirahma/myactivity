const storageKey = 'myactivity-todos';

function loadTodos() {
  try {
    const savedTodos = localStorage.getItem(storageKey);
    return savedTodos ? JSON.parse(savedTodos) : [];
  } catch (error) {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(todos));
  } catch (error) {
    showNotification('Aktivitas tidak dapat disimpan di browser.');
  }
}

let todos = loadTodos();

let currentFilter = 'all';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const taskCounter = document.getElementById('task-counter');
const bulkActions = document.getElementById('bulk-actions');
const notificationBox = document.getElementById('notification-box');
const notificationText = document.getElementById('notification-text');

function showNotification(message) {
  notificationText.textContent = message;
  notificationBox.classList.remove('hidden');
  setTimeout(hideNotification, 3500);
}

function hideNotification() {
  notificationBox.classList.add('hidden');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function render() {
  const filteredTodos = currentFilter === 'active'
    ? todos.filter(todo => !todo.completed)
    : currentFilter === 'completed'
      ? todos.filter(todo => todo.completed)
      : todos;

  emptyState.classList.toggle('hidden', filteredTodos.length !== 0);
  todoList.classList.toggle('hidden', filteredTodos.length === 0);
  todoList.innerHTML = '';

  filteredTodos.forEach(item => {
    const li = document.createElement('li');
    li.className = `group flex items-center justify-between p-3.5 rounded-xl border transition-all ${
      item.completed
        ? 'bg-slate-50 border-slate-200/60 text-slate-400'
        : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
    }`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'flex items-center gap-3 flex-1 min-w-0 cursor-pointer select-none';
    contentDiv.addEventListener('click', () => toggleTask(item.id));

    const checkbox = document.createElement('div');
    checkbox.className = `w-5 h-5 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
      item.completed
        ? 'bg-emerald-500 border-emerald-500 text-white'
        : 'border-slate-300 bg-white group-hover:border-indigo-400'
    }`;
    if (item.completed) {
      checkbox.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>';
    }

    const spanText = document.createElement('span');
    spanText.className = `text-sm truncate ${item.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-700 font-medium'}`;
    spanText.textContent = item.text;
    contentDiv.append(checkbox, spanText);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.title = 'Hapus aktifitas';
    deleteBtn.className = 'opacity-80 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-2 shrink-0';
    deleteBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>';
    deleteBtn.addEventListener('click', event => {
      event.stopPropagation();
      deleteTask(item.id);
    });

    li.append(contentDiv, deleteBtn);
    todoList.appendChild(li);
  });

  taskCounter.textContent = `${todos.filter(todo => !todo.completed).length} aktifitas belum selesai`;
  const showBulkActions = currentFilter !== 'active' && todos.some(todo => todo.completed);
  bulkActions.classList.toggle('hidden', !showBulkActions);
  updateFilterButtons();
}

todoForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = todoInput.value.trim();
  if (!text) {
    showNotification('Mohon masukkan nama aktifitas terlebih dahulu!');
    todoInput.focus();
    return;
  }

  todos.unshift({ id: generateId(), text, completed: false });
  saveTodos();
  todoInput.value = '';
  hideNotification();
  render();
});

function toggleTask(id) {
  todos = todos.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
  saveTodos();
  render();
}

function deleteTask(id) {
  todos = todos.filter(task => task.id !== id);
  saveTodos();
  render();
}

function clearCompleted() {
  todos = todos.filter(task => !task.completed);
  saveTodos();
  render();
}

function updateFilterButtons() {
  ['all', 'active', 'completed'].forEach(filter => {
    const button = document.getElementById(`filter-${filter}`);
    button.className = filter === currentFilter
      ? 'filter-btn px-3 py-1.5 rounded-md bg-white text-indigo-600 shadow-sm font-semibold transition-all'
      : 'filter-btn px-3 py-1.5 rounded-md text-slate-500 hover:text-slate-800 font-normal transition-all';
  });
}

document.getElementById('filter-all').addEventListener('click', () => {
  currentFilter = 'all';
  render();
});
document.getElementById('filter-active').addEventListener('click', () => {
  currentFilter = 'active';
  render();
});
document.getElementById('filter-completed').addEventListener('click', () => {
  currentFilter = 'completed';
  render();
});
document.getElementById('hide-notification').addEventListener('click', hideNotification);
document.getElementById('clear-completed').addEventListener('click', clearCompleted);

render();
