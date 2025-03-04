// Function to show a simple notification
function showAuthNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Save user data in localStorage under key "user" (for logged-in user)
// And store all registered users under key "users" (an array)

function getRegisteredUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function setRegisteredUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function setCurrentUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

// SIGN UP form handler
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    let users = getRegisteredUsers();

    // Check if email already registered
    if (users.some(user => user.email === email)) {
      showAuthNotification("Email already registered. Please log in.");
      return;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    setRegisteredUsers(users);
    setCurrentUser(newUser);

    showAuthNotification("Sign up successful!");
    // Redirect to homepage after sign up (or user profile)
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  });
}

// LOGIN form handler
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    let users = getRegisteredUsers();
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
      setCurrentUser(user);
      showAuthNotification("Login successful!");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      showAuthNotification("Invalid credentials. Please try again.");
    }
  });
}

// LOGOUT functionality: can be triggered from header if needed
function logout() {
  localStorage.removeItem("user");
  showAuthNotification("Logged out successfully!");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}

// If user is logged in, update the header accordingly
document.addEventListener("DOMContentLoaded", function () {
  const currentUser = getCurrentUser();
  const headerRight = document.querySelector(".header-right");
  if (currentUser && headerRight) {
    headerRight.innerHTML = `
        <span>Welcome, ${currentUser.username}!</span>
        <button id="logout-btn">Logout</button>
        <a href="profile.html">Profile</a>
        <a href="wishlist.html" class="wishlist-link" title="View Wishlist">
          <i class="fas fa-heart"></i>
          <span id="wishlist-count">0</span>
        </a>
        <a href="cart.html" class="cart-link">
          <i class="fas fa-shopping-cart"></i>
          <span id="cart-count">0</span>
        </a>
      `;
    document.getElementById("logout-btn").addEventListener("click", logout);
  }
});  