const params = new URLSearchParams(window.location.search);
const redirect = params.get("redirect");

if (redirect) {
  document.getElementById("signupLink").href =
    `signup.html?redirect=${encodeURIComponent(redirect)}`;
}

const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const checkbox = document.getElementById("checkbox");

// Show/hide password toggle
checkbox.addEventListener("change", function () {
  passwordInput.type = this.checked ? "text" : "password";
});

loginBtn.addEventListener("click", function () {

  const enteredUsername = usernameInput.value.trim();
  const enteredPassword = passwordInput.value;

  // Clear previous errors
  message.textContent = "";
  message.style.color = "red";
  usernameInput.style.border = "1px solid #ccc";
  passwordInput.style.border = "1px solid #ccc";

  // Basic empty field check
  if (!enteredUsername || !enteredPassword) {
    message.textContent = "Please fill in all fields.";
    message.style.color = 'white';
    return;
  }

  // Get saved users from localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if username exists
  const user = users.find(u => u.username === enteredUsername);

  if (!user) {
    usernameInput.style.border = "2px solid red";
    message.textContent = "Account not found!";
    message.style.color = "White"
    return;
  }

  // Username found — check password
  if (user.password !== enteredPassword) {
    passwordInput.style.border = "2px solid red";
    message.textContent = "Incorrect password.";
    message.style.color = 'White';
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  // Success — save logged in user and show popup
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  showPopup();
});

function showPopup() {
  document.getElementById("popupOverlay").style.display = "block";
  document.getElementById("popup").style.display = "block";

  setTimeout(() => {

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");

    if (redirect) {
      window.location.href = redirect;
    } else {
      window.location.href = "dashboard.html";
    }

  }, 3000);
}