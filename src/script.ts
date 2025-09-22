let filter: string = "all";
interface Task {
  text: string;
  completed: boolean;
}

/* ===== Signup ===== */
function signup(): void {
  const username = (document.getElementById("signupUsername") as HTMLInputElement).value;
  const password = (document.getElementById("signupPassword") as HTMLInputElement).value;
  if (username && password) {
    localStorage.setItem(username, password);
    alert("Signup successful! Please login.");
    window.location.href = "index.html";
  } else {
    alert("Please enter username and password.");
  }
}

/* ===== Login ===== */
function login(): void {
  const username = (document.getElementById("loginUsername") as HTMLInputElement).value;
  const password = (document.getElementById("loginPassword") as HTMLInputElement).value;
  const storedPassword = localStorage.getItem(username);
  if (storedPassword === password) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "todo.html";
  } else {
    alert("Invalid login credentials!");
  }
}

/* ===== Add Task ===== */
function addTask(): void {
  const taskInput = document.getElementById("taskInput") as HTMLInputElement;
  const taskText = taskInput.value.trim();
  if (taskText === "") return;
  const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.push({ text: taskText, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  loadTasks();
}

/* ===== Load Tasks ===== */
function loadTasks(): void {
  const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
  const taskList = document.getElementById("taskList");
  if (!taskList) return;
  taskList.innerHTML = "";
  const total = tasks.length;
  const active = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;
  const totalTasks = document.getElementById("totalTasks");
  const activeTasks = document.getElementById("activeTasks");
  const completedTasks = document.getElementById("completedTasks");
  const allCount = document.getElementById("allCount");
  const activeCount = document.getElementById("activeCount");
  const completedCount = document.getElementById("completedCount");

  if (totalTasks) totalTasks.textContent = total.toString();
  if (activeTasks) activeTasks.textContent = active.toString();
  if (completedTasks) completedTasks.textContent = completed.toString();
  if (allCount) allCount.textContent = total.toString();
  if (activeCount) activeCount.textContent = active.toString();
  if (completedCount) completedCount.textContent = completed.toString();

  let anyRendered = false;
  tasks.forEach((task, index) => {
    const shouldShow = filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed);
    if (!shouldShow) return;
    anyRendered = true;
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", (e: Event) => {
      e.stopPropagation();
      toggleTask(index);
    });

    const span = document.createElement("span");
    span.textContent = task.text;
    span.addEventListener("click", () => toggleTask(index));

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.addEventListener("click", (e: Event) => {
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
function toggleTask(index: number): void {
  const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
  if (typeof tasks[index] === "undefined") return;
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

/* ===== Delete Task ===== */
function deleteTask(index: number): void {
  const tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
  if (typeof tasks[index] === "undefined") return;
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

/* ===== Filters ===== */
function filterTasks(type: string, btn?: HTMLButtonElement): void {
  filter = type;
  document.querySelectorAll(".task-filters button").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  loadTasks();
}

/* ===== Auth Check + Logout ===== */
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("todo.html")) {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    const welcomeEl = document.getElementById("welcomeUser");
    if (welcomeEl) welcomeEl.textContent = "Welcome back, " + user + "!";
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "thankyou.html";
      });
    }
    loadTasks();
  }
});
