// "use strict";

// import { imageBaseURL } from "./api.js";

// /**
//  * Movie Card
//  */

// export function createmovieCard(movie) {
//   const { poster_path, title, vote_average, release_date, id } = movie;

//   const card = document.createElement("div");

//   card.classList.add("movie-card");

//   // Asegúrate de que vote_average y release_date estén definidos
//   const rating = vote_average ? vote_average.toFixed(1) : "";
//   const releaseYear = release_date ? release_date.split("-")[0] : "";

//   card.innerHTML = `
//     <figure class="poster-box card-banner">
//       <img
//         src="${imageBaseURL}w342${poster_path}"
//         class="img-cover"
//         alt="${title}"
//         loading="lazy"
//       />
//     </figure>

//     <div class="meta-list">
//       <div class="meta-item">
//         <span class="span">${rating}</span>
//       </div>
//       <div class="card-badge">${releaseYear}</div>
//     </div>

//     <a href="/movie" onclick="getMovieDetail(${id})" class="card-btn" title="${title}"></a>
//   `;

//   return card;
// }

import { imageBaseURL } from "./api.js";

export function createMovieCard(movie) {
  const { poster_path, title, vote_average, release_date, id } = movie;

  const card = document.createElement("div");
  card.classList.add("movie-card");

  // Asegúrate de que vote_average y release_date estén definidos
  const rating = vote_average ? vote_average.toFixed(1) : "";
  const releaseYear = release_date ? release_date.split("-")[0] : "";

  // Usa una imagen de póster predeterminada si no se proporciona un poster_path
  const posterURL = poster_path
    ? `${imageBaseURL}w342${poster_path}`
    : "path/to/default-poster.jpg";

  card.innerHTML = `
    <figure class="poster-box card-banner">
      <img
        src="${posterURL}"
        class="img-cover"
        alt="${title}"
        loading="lazy"
      />
    </figure>

    <div class="meta-list">
      <div class="meta-item">
        <span class="span">${rating}</span>
      </div>
      <div class="card-badge">${releaseYear}</div>
    </div>

    <a href="/movie" onclick="getMovieDetail(${id})" class="card-btn" title="${title}"></a>
  `;

  return card;
}
