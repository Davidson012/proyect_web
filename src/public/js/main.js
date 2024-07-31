document.addEventListener("DOMContentLoaded", function () {
    const heroSection = document.querySelector(".hero-section");
    const images = [
      "https://image.tmdb.org/t/p/original/4xtWRAmFwCodEbHQy1jD81FGSj4.jpg",
      "https://media.themoviedb.org/t/p/w500_and_h282_face/en3GU5uGkKaYmSyetHV4csHHiH3.jpg",
      "https://image.tmdb.org/t/p/original/lgkPzcOSnTvjeMnuFzozRO5HHw1.jpg",
      "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
      "https://image.tmdb.org/t/p/original/fzkLKtZCkYSDzxoqntE5KgIqvzk.jpg",
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomIndex];
  
    // Establece la imagen seleccionada como fondo
    heroSection.style.backgroundImage = `url(${selectedImage})`;
  });
  