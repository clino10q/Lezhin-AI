const params = new URLSearchParams(window.location.search);
const redirect = params.get("redirect");

if (redirect) {
  document.getElementById("loginLink").href =
    `login.html?redirect=${encodeURIComponent(redirect)}`;
}

const form = document.getElementById("form-container");

let users = JSON.parse(localStorage.getItem("users")) || [];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const passwordInput = document.getElementById("password");
  const conPasswordInput = document.getElementById("conPassword");
  const errorMsg = document.getElementById("passwordError");
  const emailInput = document.getElementById('emailError');

  // Clear previous errors
  passwordInput.style.border = "1px solid #ccc";
  conPasswordInput.style.border = "1px solid #ccc";
  errorMsg.textContent = "";

  const password = passwordInput.value;
  const conPassword = conPasswordInput.value;


  if (password !== conPassword) {
    passwordInput.style.border = "2px solid red";
    conPasswordInput.style.border = "2px solid red";
    errorMsg.textContent = "Passwords don't match! Please try again.";
    errorMsg.fontSize = '12px' 
    conPasswordInput.value = "";
    passwordInput.focus();
    return;
  }

  const userData = {
    email: document.getElementById("e-mailAddress").value.trim(),
    username: document.getElementById("username").value.trim(),
    password: password,
    phone: document.getElementById("phone").value,
    age: document.getElementById("age").value,
    sex: document.getElementById("sex").value,
  };

  const emailExists = users.find((u) => u.email === userData.email);
  if(emailExists){
    emailInput.innerHTML = `<i class="ti ti-info-circle"></i> Email already exists`;
    return;
  }


  const exists = users.find((u) => u.username === userData.username);
  if (exists) {
    document.getElementById('usernameError').style.display = 'block'
    document.getElementById('usernameError').textContent = 'Username already exists!';
    document.getElementById('usernameError').style.fontSize = '12px' 
    return;
  }

  pendingUser = userData;
  modal.style.display = "flex";
});

const modal = document.getElementById("confirmationModal");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const check1 = document.getElementById("check1");
const check2 = document.getElementById("check2");

let pendingUser = null;

// Enable button only when both boxes are checked
function validateChecks() {
  confirmBtn.disabled = !(check1.checked && check2.checked);
}

check1.addEventListener("change", validateChecks);
check2.addEventListener("change", validateChecks);

// Cancel popup
cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";

  check1.checked = false;
  check2.checked = false;
  confirmBtn.disabled = true;
});

// Confirm account creation
confirmBtn.addEventListener("click", () => {

  users.push(pendingUser);

  localStorage.setItem(
    "users",
    JSON.stringify(users)
  );

  modal.style.display = "none";

  form.reset();

  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");

  if (redirect) {
    window.location.href = redirect;
  } else {
    window.location.href = "dashboard.html";
  }
});