document.addEventListener("DOMContentLoaded", function () {
  function updateuser() {
    // Hacer una solicitud para obtener la información del usuario
    fetch("/auth/user-info")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("No estás logueado");
        }
      })
      .then((data) => {
        console.log("User data:", data);
        // Actualizar el enlace del nombre de usuario
        document.querySelectorAll(".usernameLink").forEach(function (element) {
          element.textContent = data.username;
        });

        // Actualizar la imagen de perfil
        const profileImageElement = document.getElementById("profileImage");
        profileImageElement.src = data.profileImage; //
      })
      .catch((error) => {
        console.error("Error:", error);
        console.log = "Error";
        // Redirigir a la página de inicio de sesión si no está logueado
        //window.location.href = "/home";
      });
  }
  // Manejador de evento para el enlace de cierre de sesión
  document
    .getElementById("logoutLink")
    .addEventListener("click", function (event) {
      event.preventDefault();
      document.getElementById("logoutForm").submit();
    });

  updateuser();

  // Agrega un listener para el evento de actualización del perfil
  document
    .getElementById("updateProfileButton")
    .addEventListener("click", function () {
      // Llama a la función de actualización de usuario después de hacer cambios
      updateuser();
    });
});
