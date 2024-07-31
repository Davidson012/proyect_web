document.addEventListener("DOMContentLoaded", function () {
    // Espera a que el contenido del documento esté completamente cargado antes de ejecutar el código
  
    // Obtiene referencias a los elementos del DOM que se utilizarán
    const signInLink = document.getElementById("sign-in-link");
    const registerLink = document.getElementById("register-link");
    const formContainer = document.getElementById("form-container");
    const registrationForm = document.getElementById("registration-form");
    const loginForm = document.getElementById("login-form");
    const closeRegistrationBtn = document.getElementById("close-registration");
    const closeLoginBtn = document.getElementById("close-login");
  
    // Maneja el evento de clic en el enlace "Sign In"
    signInLink.addEventListener("click", function (e) {
      e.preventDefault(); // Previene el comportamiento por defecto del enlace
      formContainer.style.display = "flex"; // Muestra el contenedor del formulario en modo flex
      loginForm.style.display = "flex"; // Muestra el formulario de inicio de sesión
      registrationForm.style.display = "none"; // Oculta el formulario de registro
    });
  
    // Maneja el evento de clic en el enlace "Create Account"
    registerLink.addEventListener("click", function (e) {
      e.preventDefault(); // Previene el comportamiento por defecto del enlace
      formContainer.style.display = "flex"; // Muestra el contenedor del formulario en modo flex
      registrationForm.style.display = "flex"; // Muestra el formulario de registro
      loginForm.style.display = "none"; // Oculta el formulario de inicio de sesión
    });
  
    // Maneja el evento de clic en el botón de cerrar del formulario de registro
    closeRegistrationBtn.addEventListener("click", function () {
      formContainer.style.display = "none"; // Oculta el contenedor del formulario
    });
  
    // Maneja el evento de clic en el botón de cerrar del formulario de inicio de sesión
    closeLoginBtn.addEventListener("click", function () {
      formContainer.style.display = "none"; // Oculta el contenedor del formulario
    });
  
    // Validación de Bootstrap
    (function () {
      "use strict"; // Asegura que el código se ejecute en modo estricto
  
      // Selecciona todos los formularios con la clase "needs-validation"
      var forms = document.querySelectorAll(".needs-validation");
  
      // Itera sobre cada formulario y añade un evento de submit
      Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener(
          "submit",
          function (event) {
            // Si el formulario no es válido, previene el envío y detiene la propagación del evento
            if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
            }
            // Añade la clase "was-validated" para mostrar los mensajes de validación de Bootstrap
            form.classList.add("was-validated");
          },
          false
        );
      });
    })();
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    // Form references
    const registrationForm = document.getElementById("form_1");
    const loginForm = document.getElementById("form_2");
  
    // Regular expressions
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/; // Alphanumeric characters and underscores, 3-16 characters
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/; //
    // Validate registration form
    registrationForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const email = document.getElementById("email_register");
      const username = document.getElementById("user_register");
      const password = document.getElementById("pass_register");
  
      let isValid = true;
  
      if (!emailRegex.test(email.value)) {
        isValid = false;
        email.setCustomValidity("Ingrese un email valido");
      } else {
        email.setCustomValidity("");
      }
  
      if (!usernameRegex.test(username.value)) {
        isValid = false;
        username.setCustomValidity("Ingrese un usuario con al meno un numero.");
      } else {
        username.setCustomValidity("");
      }
  
      if (!passwordRegex.test(password.value)) {
        isValid = false;
        password.setCustomValidity("La contraseña debe ser de 8 o mas digitos ");
      } else {
        password.setCustomValidity("");
      }
  
      if (isValid) {
        registrationForm.submit();
      } else {
        registrationForm.reportValidity();
      }
    });
  
    // Validate login form
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const email = document.getElementById("email_login");
      const password = document.getElementById("pass_login");
  
      let isValid = true;
  
      if (!emailRegex.test(email.value)) {
        isValid = false;
        email.setCustomValidity("Ingrese un email valido y registrado");
      } else {
        email.setCustomValidity("");
      }
  
      if (!passwordRegex.test(password.value)) {
        isValid = false;
        password.setCustomValidity("Ingrese una contraseña valida ");
      } else {
        password.setCustomValidity("");
      }
  
      if (isValid) {
        loginForm.submit();
      } else {
        loginForm.reportValidity();
      }
    });
  
    // Close buttons
    document
      .getElementById("close-registration")
      .addEventListener("click", () => {
        document.getElementById("registration-form").style.display = "none";
      });
  
    document.getElementById("close-login").addEventListener("click", () => {
      document.getElementById("login-form").style.display = "none";
    });
  });
  