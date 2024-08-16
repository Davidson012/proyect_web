document.addEventListener("DOMContentLoaded", () => {
  // Form references
  // Form references
  // Form references
  const registrationForm = document.getElementById("form_1");
  const loginForm1 = document.getElementById("form_2");

  // Regular expressions
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/; // Alphanumeric characters and underscores, 3-16 characters
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

  // Helper function to show error
  const showError = (input, message) => {
    const formControl = input.parentElement;
    const errorMessage = formControl.querySelector(".error-message");
    errorMessage.textContent = message;
    formControl.classList.add("error");
  };

  // Helper function to hide error
  const hideError = (input) => {
    const formControl = input.parentElement;
    const errorMessage = formControl.querySelector(".error-message");
    errorMessage.textContent = "";
    formControl.classList.remove("error");
  };

  // Validate registration form
  registrationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email_register");
    const username = document.getElementById("user_register");
    const password = document.getElementById("pass_register");

    let isValid = true;

    if (!emailRegex.test(email.value)) {
      isValid = false;
      showError(email, "Please enter a valid email address.");
    } else {
      hideError(email);
    }

    if (!usernameRegex.test(username.value)) {
      isValid = false;
      showError(
        username,
        "Username must be 3-16 characters long and can contain letters, numbers, and underscores."
      );
    } else {
      hideError(username);
    }

    if (!passwordRegex.test(password.value)) {
      isValid = false;
      showError(password, "Password must be at least 8 characters .");
    } else {
      hideError(password);
    }

    if (isValid) {
      registrationForm.submit();
    }
  });

  // Validate login form
  loginForm1.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email_login");
    const password = document.getElementById("pass_login");

    let isValid = true;

    if (!emailRegex.test(email.value)) {
      isValid = false;
      showError(email, "Please enter a valid email address.");
    } else {
      hideError(email);
    }

    if (!passwordRegex.test(password.value)) {
      isValid = false;
      showError(password, "Please enter a valid password.");
    } else {
      hideError(password);
    }

    if (isValid) {
      loginForm1.submit();
    }
  });

  const inputs = document.querySelectorAll("input, button");

  inputs.forEach((input, index) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();

        // Validar el campo actual
        if (!input.checkValidity()) {
          input.reportValidity(); // Mostrar el mensaje de error del campo actual
          return; // No mover el enfoque ni enviar el formulario
        }

        // Mover el enfoque al siguiente campo o enviar el formulario si no hay más campos
        const nextInput = inputs[index + 1];
        if (nextInput) {
          nextInput.focus();
        } else {
          // Enviar el formulario solo si todos los campos son válidos
          const form = input.form;
          if (form.checkValidity()) {
            form.submit();
          }
        }
      }
    });
  });

  //Comportamiento de formulario de registro y login
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const closeLoginForm = document.getElementById("closeLoginForm");
  const closeRegisterForm = document.getElementById("closeRegisterForm");

  loginLink.addEventListener("click", function (event) {
    event.preventDefault(); // Previene el comportamiento predeterminado del enlace
    loginForm.classList.toggle("hidden");
    if (!registerForm.classList.contains("hidden")) {
      registerForm.classList.add("hidden");
    }
  });

  registerLink.addEventListener("click", function (event) {
    event.preventDefault(); // Previene el comportamiento predeterminado del enlace
    registerForm.classList.toggle("hidden");
    if (!loginForm.classList.contains("hidden")) {
      loginForm.classList.add("hidden");
    }
  });

  closeLoginForm.addEventListener("click", function () {
    loginForm.classList.add("hidden");
  });

  closeRegisterForm.addEventListener("click", function () {
    registerForm.classList.add("hidden");
  });
});
