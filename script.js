// ===============================
// Select Elements
// ===============================

const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// ===============================
// Load Tasks
// ===============================

window.onload = function () {
    loadTasks();
};

// ===============================
// Add Task
// ===============================

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

function addTask() {

    if (taskInput.value.trim() === "") {
        alert("Please enter a task.");
        return;
    }

    createTask(
        taskInput.value,
        priority.value,
        dueDate.value,
        false
    );

    saveTasks();

    taskInput.value = "";
    dueDate.value = "";

}

// ===============================
// Create Task
// ===============================

function createTask(text, level, date, completed) {

    const li = document.createElement("li");

    // Left Side

    const left = document.createElement("div");

    left.style.flex = "1";

    // Task Text

    const span = document.createElement("span");

    span.className = "task-text";

    span.textContent = text;

    if (completed) {
        span.classList.add("completed");
    }

    // Complete

    span.addEventListener("click", function () {

        span.classList.toggle("completed");

        saveTasks();

    });

    // Double Click Edit

    span.addEventListener("dblclick", function () {

        const newTask = prompt("Edit Task", span.textContent);

        if (newTask !== null && newTask.trim() !== "") {

            span.textContent = newTask;

            saveTasks();

        }

    });

    // Priority

    const badge = document.createElement("div");

    badge.className = "priority";

    badge.textContent = level;

    if (level === "High") {

        badge.classList.add("high");

    } else if (level === "Medium") {

        badge.classList.add("medium");

    } else {

        badge.classList.add("low");

    }

    // Date

    const taskDate = document.createElement("div");

    taskDate.className = "date";

    taskDate.textContent = date;

    left.appendChild(span);

    left.appendChild(document.createElement("br"));

    left.appendChild(badge);

    left.appendChild(taskDate);

    // ==========================
    // Buttons
    // ==========================

    const actions = document.createElement("div");

    actions.className = "actions";

    // Edit

    const editBtn = document.createElement("button");

    editBtn.className = "edit-btn";

    editBtn.innerHTML = "✏️";

    editBtn.onclick = function () {

        const newTask = prompt("Edit Task", span.textContent);

        if (newTask !== null && newTask.trim() !== "") {

            span.textContent = newTask;

            saveTasks();

        }

    };

    // Delete

    const deleteBtn = document.createElement("button");

    deleteBtn.className = "delete-btn";

    deleteBtn.innerHTML = "🗑️";

    deleteBtn.onclick = function () {

        li.remove();

        saveTasks();

    };

    actions.appendChild(editBtn);

    actions.appendChild(deleteBtn);

    li.appendChild(left);

    li.appendChild(actions);

    taskList.appendChild(li);

}

// ===============================
// Save Tasks
// ===============================

function saveTasks() {

    const tasks = [];

    document.querySelectorAll("#taskList li").forEach(li => {

        tasks.push({

            text: li.querySelector(".task-text").textContent,

            priority: li.querySelector(".priority").textContent,

            date: li.querySelector(".date").textContent,

            completed: li.querySelector(".task-text").classList.contains("completed")

        });

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// ===============================
// Load Tasks
// ===============================

function loadTasks() {

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(task => {

        createTask(

            task.text,

            task.priority,

            task.date,

            task.completed

        );

    });

}
// ================================
// Search Tasks
// ================================

searchInput.addEventListener("keyup", searchTasks);

function searchTasks() {

    const value = searchInput.value.toLowerCase();

    const tasks = document.querySelectorAll("#taskList li");

    tasks.forEach(task => {

        const text = task.querySelector(".task-text").textContent.toLowerCase();

        if (text.includes(value)) {

            task.style.display = "flex";

        } else {

            task.style.display = "none";

        }

    });

}

// ================================
// Dashboard Counter
// ================================

function updateDashboard() {

    const total = document.querySelectorAll("#taskList li").length;

    const completed = document.querySelectorAll(".completed").length;

    const pending = total - completed;

    totalTask.textContent = total;

    completedTask.textContent = completed;

    pendingTask.textContent = pending;

    updateProgress(total, completed);

}

// ================================
// Progress Bar
// ================================

function updateProgress(total, completed) {

    let percent = 0;

    if (total > 0) {

        percent = Math.round((completed / total) * 100);

    }

    progress.style.width = percent + "%";

    progressText.textContent = percent + "% Completed";

}

// ================================
// Filter
// ================================

const filters = document.querySelectorAll(".filter");

filters.forEach(btn => {

    btn.addEventListener("click", () => {

        filters.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        const type = btn.dataset.filter;

        filterTasks(type);

    });

});

function filterTasks(type) {

    const tasks = document.querySelectorAll("#taskList li");

    tasks.forEach(task => {

        const completed = task.querySelector(".task-text").classList.contains("completed");

        if (type === "all") {

            task.style.display = "flex";

        }

        else if (type === "completed") {

            task.style.display = completed ? "flex" : "none";

        }

        else if (type === "pending") {

            task.style.display = !completed ? "flex" : "none";

        }

    });

}
// ======================================
// Select New Elements
// ======================================

const themeBtn = document.getElementById("themeBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const clearCompleted = document.getElementById("clearCompleted");
const deleteAll = document.getElementById("deleteAll");

// ======================================
// Dark Mode
// ======================================

loadTheme();

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

    }else{

        localStorage.setItem("theme","light");

        themeBtn.innerHTML='<i class="fa-solid fa-moon"></i>';

    }

});

function loadTheme(){

    const theme=localStorage.getItem("theme");

    if(theme==="dark"){

        document.body.classList.add("dark");

        themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

    }

}

// ======================================
// Export Tasks
// ======================================

exportBtn.addEventListener("click",()=>{

    const data=localStorage.getItem("tasks") || "[]";

    const blob=new Blob([data],{type:"application/json"});

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="tasks.json";

    a.click();

    URL.revokeObjectURL(url);

});

// ======================================
// Import Tasks
// ======================================

const fileInput=document.createElement("input");

fileInput.type="file";

fileInput.accept=".json";

importBtn.addEventListener("click",()=>{

    fileInput.click();

});

fileInput.addEventListener("change",(e)=>{

    const file=e.target.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=function(event){

        try{

            const tasks=JSON.parse(event.target.result);

            localStorage.setItem("tasks",JSON.stringify(tasks));

            taskList.innerHTML="";

            loadTasks();

            updateDashboard();

            showToast("Tasks Imported Successfully");

        }

        catch{

            alert("Invalid JSON File");

        }

    };

    reader.readAsText(file);

});

// ======================================
// Delete All Tasks
// ======================================

deleteAll.addEventListener("click",()=>{

    const confirmDelete=confirm("Delete all tasks?");

    if(!confirmDelete) return;

    taskList.innerHTML="";

    localStorage.removeItem("tasks");

    updateDashboard();

    showToast("All Tasks Deleted");

});

// ======================================
// Clear Completed
// ======================================

clearCompleted.addEventListener("click",()=>{

    document.querySelectorAll(".completed").forEach(task=>{

        task.parentElement.parentElement.remove();

    });

    saveTasks();

    updateDashboard();

    showToast("Completed Tasks Cleared");

});
// ========================================
// Toast Notification
// ========================================

function showToast(message) {

    const oldToast = document.querySelector(".toast");

    if (oldToast) {
        oldToast.remove();
    }

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transform = "translateY(-20px)";

    }, 2500);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}

// ========================================
// Empty State
// ========================================

function checkEmptyState() {

    const oldState = document.querySelector(".empty-state");

    if (oldState) {

        oldState.remove();

    }

    if (taskList.children.length === 0) {

        const empty = document.createElement("div");

        empty.className = "empty-state";

        empty.innerHTML = `
            <i class="fa-solid fa-clipboard-list"></i>
            <p>No Tasks Available</p>
        `;

        taskList.parentNode.insertBefore(empty, taskList);

    }

}

// ========================================
// Due Date Highlight
// ========================================

function checkDueDates() {

    const today = new Date();

    document.querySelectorAll("#taskList li").forEach(li => {

        const dateText = li.querySelector(".date").textContent;

        if (!dateText) return;

        const due = new Date(dateText);

        if (due < today && !li.querySelector(".task-text").classList.contains("completed")) {

            li.style.border = "2px solid red";

        }

    });

}

// ========================================
// Sort By Priority
// ========================================

function sortTasksByPriority() {

    const priorities = {

        High: 1,

        Medium: 2,

        Low: 3

    };

    const items = [...taskList.children];

    items.sort((a, b) => {

        const p1 = a.querySelector(".priority").textContent;

        const p2 = b.querySelector(".priority").textContent;

        return priorities[p1] - priorities[p2];

    });

    taskList.innerHTML = "";

    items.forEach(item => taskList.appendChild(item));

}

// ========================================
// Keyboard Shortcut
// Ctrl + F → Search Box
// ========================================

document.addEventListener("keydown", function (e) {

    if (e.ctrlKey && e.key === "f") {

        e.preventDefault();

        searchInput.focus();

    }

});

// ========================================
// Refresh UI
// ========================================

function refreshUI() {

    saveTasks();

    updateDashboard();

    checkEmptyState();

    checkDueDates();

}

// ========================================
// Update Existing Actions
// ========================================

// Call refreshUI() after:
//
// - Add Task
// - Delete Task
// - Complete Task
// - Import
// - Delete All
// - Clear Completed
//
// Example:
//
// saveTasks();
// refreshUI();
//
// instead of:
//
// saveTasks();
// updateDashboard();