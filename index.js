const itemCount = document.querySelector('.count span');
const leftCount = document.querySelector('.left-count span');
const todoList = document.querySelector('.todos ul');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

updateTodoCount();

todos.forEach(todo => {
    appendToDOM(todo);
});

const themeIcon = document.querySelector('.theme');

themeIcon.addEventListener('click', () => {
    document.body.classList.toggle('light');
    if (document.body.classList.contains('light')) {
        themeIcon.src = 'images/icon-moon.svg';
    } else {
        themeIcon.src = 'images/icon-sun.svg';
    }
});

const addButton = document.querySelector('.todo-input button');
const itemInput = document.getElementById('todo-input');

addButton.addEventListener('click', () => {
    const todoText = itemInput.value.trim();
    if (todoText.length > 0) {
        const newTodo = {
            text: todoText,
            completed: false,
        };

        todos.push(newTodo);

        localStorage.setItem('todos', JSON.stringify(todos));

        appendToDOM(newTodo);

        itemInput.value = '';

        updateTodoCount();
    }
});

itemInput.addEventListener('keypress', (e) => {
    if (e.charCode === 13) {
        addButton.click();
    }
});

function appendToDOM(todo) {
    const itemID = document.querySelector('.filters input[type="radio"]:checked');

    const item = document.createElement('li');
    
    item.innerHTML = `
        <label class="list">
            <input class="checkbox" type="checkbox" ${todo.completed ? 'checked' : ''}> 
            <span class="text">${todo.text}</span>
        </label>
        <img class="remove" src="images/icon-cross.svg" alt="theme-icon" />
        `;


    if (itemID.id === 'completed' && !todo.completed) {
        item.classList.add('hidden');
    }

    todoList.append(item);
}

function updateTodoCount() {
    const activeTodos = todos.filter(todo => !todo.completed).length;
    itemCount.innerText = activeTodos;
    leftCount.innerText = activeTodos;
}

function removeItems(item) {
    const index = todos.findIndex(todo => todo.text === item.querySelector('.text').innerText);

    if (index !== -1) {
        todos.splice(index, 1);

        localStorage.setItem('todos', JSON.stringify(todos));
    }

    item.remove();
    updateTodoCount();
}

todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove')) {
        removeItems(e.target.parentElement);
    } else if (e.target.classList.contains('checkbox')) {
        const index = todos.findIndex(todo => todo.text === e.target.nextElementSibling.innerText);

        if (index !== -1) {
            todos[index].completed = !todos[index].completed;

            localStorage.setItem('todos', JSON.stringify(todos));
        }

        updateTodoCount();
    }
});

document.querySelectorAll('.filters input').forEach(radio => {
    radio.addEventListener('change', (event) => {
        filterTodo(event.target.id);
    });
});

function filterTodo(id) {
    const allItems = document.querySelectorAll('li');

    if (id === 'all') {
        allItems.forEach(item => {
            item.classList.remove('hidden');
        });
    } else if (id === 'active') {
        allItems.forEach(item => {
            if (item.querySelector('input').checked) {
                item.classList.add('hidden');
            } else {
                item.classList.remove('hidden');
            }
        });
    } else {
        allItems.forEach(item => {
            if (item.querySelector('input').checked) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }
}

/* Clear items */
const clear = document.querySelector('.clear');
const leftClear = document.querySelector('.left-clear');

clear.addEventListener('click', () => {
    const itemChecked = document.querySelectorAll('.list input[type="checkbox"]:checked');
    itemChecked.forEach(item => {
        removeItems(item.closest('li'));
    });
});

leftClear.addEventListener('click', () => {
    const itemChecked = document.querySelectorAll('.list input[type="checkbox"]:checked');
    itemChecked.forEach(item => {
        removeItems(item.closest('li'));
    });
});
