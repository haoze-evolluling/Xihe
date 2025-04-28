// 本地存储键名
const STORAGE_KEY = 'daily_todos_v1';
const CHECKED_DATE_KEY = 'daily_todos_checked_date_v1';

function getTodayStr() {
  const now = new Date();
  return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
}

function loadTodos() {
  let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  let checkedDate = localStorage.getItem(CHECKED_DATE_KEY);
  const today = getTodayStr();
  // 如果不是今天，清空所有勾选状态
  if (checkedDate !== today) {
    todos = todos.map(t => ({...t, checked: false}));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    localStorage.setItem(CHECKED_DATE_KEY, today);
  }
  return todos;
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  localStorage.setItem(CHECKED_DATE_KEY, getTodayStr());
}

function renderTodos() {
  const todos = loadTodos();
  const list = document.getElementById('todo-list');
  list.innerHTML = '';
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.checked ? ' completed' : '');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.checked;
    checkbox.addEventListener('change', () => {
      todos[idx].checked = checkbox.checked;
      saveTodos(todos);
      renderTodos();
    });
    const label = document.createElement('label');
    label.textContent = todo.text;
    label.title = todo.text;
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.innerHTML = '🗑';
    delBtn.title = '删除';
    delBtn.addEventListener('click', () => {
      todos.splice(idx, 1);
      saveTodos(todos);
      renderTodos();
    });
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderTodos();
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const todos = loadTodos();
    todos.push({text, checked: false});
    saveTodos(todos);
    input.value = '';
    renderTodos();
  });
});