// Get HTML elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Current filter
let currentFilter = "all";


// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Display tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <li class="empty">No tasks found.</li>
        `;
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="complete-checkbox"
                data-id="${task.id}"
                ${task.completed ? "checked" : ""}
            >

            <span>${task.text}</span>

            <button class="edit-btn" data-id="${task.id}">
                Edit
            </button>

            <button class="delete-btn" data-id="${task.id}">
                Delete
            </button>
        `;

        taskList.appendChild(li);
    });

    updateTaskCount();
}


// Add new task
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();
}


// Update task count
function updateTaskCount() {

    const activeTasks = tasks.filter(task => !task.completed).length;

    taskCount.textContent =
        `${activeTasks} active task${activeTasks !== 1 ? "s" : ""}`;
}


// Edit task
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) {
        return;
    }

    const updatedText = newText.trim();

    if (updatedText === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.text = updatedText;

    saveTasks();

    renderTasks();
}


// Delete task
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}


// Toggle completed status
function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    task.completed = !task.completed;

    saveTasks();

    renderTasks();
}


// Clear all completed tasks
function clearCompletedTasks() {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();

    renderTasks();
}


// Add button event
addBtn.addEventListener("click", addTask);


// Enter key event
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }
});


// Event delegation for task buttons
taskList.addEventListener("click", function(event) {

    const id = Number(event.target.dataset.id);

    if (event.target.classList.contains("delete-btn")) {
        deleteTask(id);
    }

    if (event.target.classList.contains("edit-btn")) {
        editTask(id);
    }
});


// Checkbox event
taskList.addEventListener("change", function(event) {

    if (event.target.classList.contains("complete-checkbox")) {

        const id = Number(event.target.dataset.id);

        toggleTask(id);
    }
});


// Filter buttons
filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});


// Clear completed button
clearCompleted.addEventListener("click", clearCompletedTasks);


// Initial display
renderTasks();