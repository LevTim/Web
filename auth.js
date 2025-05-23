let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = null;

if (!users.find(u => u.username === "admin")) {
    users.push({ username: "admin", password: "admin123", role: "admin" });
    localStorage.setItem("users", JSON.stringify(users));
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        if (user.role === "admin") {
            showAdminPanel();
        } else {
            window.location.href = "calendar.html";
        }
    } else {
        errorMessage.textContent = "Невірне ім'я користувача або пароль.";
    }
}

function register() {
    const username = document.getElementById("reg-username").value;
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById("reg-confirm-password").value;
    const errorMessage = document.getElementById("register-error-message");

    if (password !== confirmPassword) {
        errorMessage.textContent = "Паролі не співпадають!";
        return;
    }

    if (users.find(u => u.username === username)) {
        errorMessage.textContent = "Користувач з таким іменем вже існує!";
        return;
    }

    users.push({ username, password, role: "user" });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Реєстрація успішна! Тепер ви можете увійти.");
    toggleForm();
}

function toggleForm() {
    const authContainer = document.getElementById("auth-container");
    const registerContainer = document.getElementById("register-container");
    const adminPanel = document.getElementById("admin-panel");
    const errorMessage = document.getElementById("error-message");

    authContainer.style.display = authContainer.style.display === "none" ? "block" : "none";
    registerContainer.style.display = registerContainer.style.display === "none" ? "block" : "none";
    adminPanel.style.display = "none";
    errorMessage.textContent = "";
}

function showAdminPanel() {
    const authContainer = document.getElementById("auth-container");
    const registerContainer = document.getElementById("register-container");
    const adminPanel = document.getElementById("admin-panel");
    const userList = document.getElementById("user-list");

    authContainer.style.display = "none";
    registerContainer.style.display = "none";
    adminPanel.style.display = "block";

    userList.innerHTML = "";
    users.forEach(user => {
        if (user.username !== "admin") {
            const li = document.createElement("li");
            li.textContent = `Користувач: ${user.username} (${user.role})`;
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Видалити";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.onclick = () => deleteUser(user.username);
            li.appendChild(deleteBtn);
            userList.appendChild(li);
        }
    });
}

function deleteUser(username) {
    if (confirm(`Ви впевнені, що хочете видалити користувача ${username}?`)) {
        users = users.filter(u => u.username !== username);
        localStorage.setItem("users", JSON.stringify(users));
        showAdminPanel();
    }
}

function showAuthForm() {
    const authContainer = document.getElementById("auth-container");
    const registerContainer = document.getElementById("register-container");
    const adminPanel = document.getElementById("admin-panel");

    authContainer.style.display = "block";
    registerContainer.style.display = "none";
    adminPanel.style.display = "none";
}
