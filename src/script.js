var filter = "all";
/* ===== Signup ===== */
function signup() {
    var username = document.getElementById("signupUsername").value;
    var password = document.getElementById("signupPassword").value;
    if (username && password) {
        localStorage.setItem(username, password);
        alert("Signup successful! Please login.");
        window.location.href = "index.html";
    }
    else {
        alert("Please enter username and password.");
    }
}
/* ===== Login ===== */
function login() {
    var username = document.getElementById("loginUsername").value;
    var password = document.getElementById("loginPassword").value;
    var storedPassword = localStorage.getItem(username);
    if (storedPassword === password) {
        localStorage.setItem("loggedInUser", username);
        window.location.href = "todo.html";
    }
    else {
        alert("Invalid login credentials!");
    }
}
/* ===== Add Task ===== */
function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskText = taskInput.value.trim();
    if (taskText === "")
        return;
    var tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";
    loadTasks();
}
/* ===== Load Tasks ===== */
function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    var taskList = document.getElementById("taskList");
    if (!taskList)
        return;
    taskList.innerHTML = "";
    var total = tasks.length;
    var active = tasks.filter(function (t) { return !t.completed; }).length;
    var completed = tasks.filter(function (t) { return t.completed; }).length;
    var totalTasks = document.getElementById("totalTasks");
    var activeTasks = document.getElementById("activeTasks");
    var completedTasks = document.getElementById("completedTasks");
    var allCount = document.getElementById("allCount");
    var activeCount = document.getElementById("activeCount");
    var completedCount = document.getElementById("completedCount");
    if (totalTasks)
        totalTasks.textContent = total.toString();
    if (activeTasks)
        activeTasks.textContent = active.toString();
    if (completedTasks)
        completedTasks.textContent = completed.toString();
    if (allCount)
        allCount.textContent = total.toString();
    if (activeCount)
        activeCount.textContent = active.toString();
    if (completedCount)
        completedCount.textContent = completed.toString();
    var anyRendered = false;
    tasks.forEach(function (task, index) {
        var shouldShow = filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed);
        if (!shouldShow)
            return;
        anyRendered = true;
        var li = document.createElement("li");
        if (task.completed)
            li.classList.add("completed");
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", function (e) {
            e.stopPropagation();
            toggleTask(index);
        });
        var span = document.createElement("span");
        span.textContent = task.text;
        span.addEventListener("click", function () { return toggleTask(index); });
        var btn = document.createElement("button");
        btn.textContent = "❌";
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            deleteTask(index);
        });
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(btn);
        taskList.appendChild(li);
    });
    if (!anyRendered) {
        taskList.innerHTML = "\n\nNo tasks yet. Add your first task above!";
    }
}
/* ===== Toggle Task ===== */
function toggleTask(index) {
    var tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    if (typeof tasks[index] === "undefined")
        return;
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}
/* ===== Delete Task ===== */
function deleteTask(index) {
    var tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    if (typeof tasks[index] === "undefined")
        return;
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}
/* ===== Filters ===== */
function filterTasks(type, btn) {
    filter = type;
    document.querySelectorAll(".task-filters button").forEach(function (b) { return b.classList.remove("active"); });
    if (btn)
        btn.classList.add("active");
    loadTasks();
}
/* ===== Auth Check + Logout ===== */
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("todo.html")) {
        var user = localStorage.getItem("loggedInUser");
        if (!user) {
            window.location.href = "index.html";
            return;
        }
        var welcomeEl = document.getElementById("welcomeUser");
        if (welcomeEl)
            welcomeEl.textContent = "Welcome back, " + user + "!";
        var logoutBtn = document.getElementById("logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                localStorage.removeItem("loggedInUser");
                window.location.href = "thankyou.html";
            });
        }
        loadTasks();
    }
});
