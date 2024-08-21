// "use strict";

// import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";

// import { sidebar } from "./sidebar.js";
// import { createMovieCard } from "./movie-card.js";

// const pageContent = document.querySelector("[page-content]");
// const movieId = window.localStorage.getItem("movieId");
// sidebar();

// const homePageSection = [
//   {
//     title: "Favorite Films",
//     path: "movie/upcoming",
//   },

//   {
//     title: "Likes",
//     path: "trending/movie/week",
//   },
// ];

// fetchDataFromServer(
//   `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
//   function (movie) {
//     const {
//       backdrop_path,
//       title,
//       release_date,
//       poster_path,
//       vote_average,
//       runtime,
//       releases: {
//         countries: [{ certification }],
//       },
//       genres,
//       overview,
//       casts: { cast, crew },
//       videos: { results: videos },
//     } = movie;

//     document.title = `${title} - Tvflix`;

//     for (const { title, path } of homePageSection) {
//       fetchDataFromServer(
//         `https://api.themoviedb.org/3/${path}?api_key=${api_key}&page=1`,
//         createMovieList,
//         title
//       );
//     }
//   }
// );

// const createMovieList = function ({ results: movieList }, title) {
//   const movieListElem = document.createElement("section");
//   movieListElem.classList.add("movie-list");
//   movieListElem.ariaLabel = `${title}`;

//   movieListElem.innerHTML = `
//      <div
//             class="title-wrapper"
//             style="
//               border-bottom: 2px solid white;
//               display: flex;
//               flex-direction: row;
//               align-items: center;
//             "
//           >
//             <h3 class="title-large">${title}</h3>
//           </div>

//       <div class="slider-list">
//         <div class="slider-inner"></div>
//       </div>
//     `;

//   for (const movie of movieList) {
//     const movieCard = createMovieCard(movie);

//     movieListElem.querySelector(".slider-inner").appendChild(movieCard);
//   }

//   pageContent.appendChild(movieListElem);
// };

// "use strict";

// import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
// import { sidebar } from "./sidebar.js";
// import { createmovieCard } from "./movieCard.js";

// const pageContent = document.querySelector("[page-content]");
// const movieId = window.localStorage.getItem("movieId");
// sidebar();

// // Función para obtener películas favoritas desde el servidor
// const fetchFavoriteMovies = () => {
//   fetch(`/api/get-favorites`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((favoriteMovies) => {
//       createMovieList({ results: favoriteMovies }, "Favorite Films");
//     })
//     .catch((error) =>
//       console.error("Error al obtener las películas favoritas:", error)
//     );
// };

// // Función para obtener películas que te gustan desde el servidor
// const fetchLikedMovies = () => {
//   fetch(`/api/get-likes`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((likedMovies) => {
//       createMovieList({ results: likedMovies }, "Likes");
//     })
//     .catch((error) =>
//       console.error("Error al obtener las películas que te gustan:", error)
//     );
// };

// const homePageSection = [
//   {
//     title: "Favorite Films",
//     path: "/api/get-favorites",
//   },

//   {
//     title: "Like",
//     path: "/api/get-likes",
//   },
// ];

// // Llamada a la API de TMDB para obtener detalles de la película seleccionada
// fetchDataFromServer(
//   `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
//   function (movie) {
//     const {
//       backdrop_path,
//       title,
//       release_date,
//       poster_path,
//       vote_average,
//       runtime,
//       genres,
//       overview,
//       id,
//     } = movie;

//     document.title = `${title} - Tvflix`;

//     // Obtener las secciones predeterminadas (por ejemplo, likes)
//     for (const { title, path } of homePageSection) {
//       fetchDataFromServer(
//         `https://api.themoviedb.org/3/${path}?api_key=${api_key}&page=1`,
//         createMovieList,
//         title
//       );
//     }

//     // Obtener las películas favoritas desde la base de datos
//     fetchFavoriteMovies();
//     fetchLikedMovies();
//   }
// );

// // Función para crear listas de películas
// const createMovieList = function ({ results: movieList = [] }, title) {
//   if (!Array.isArray(movieList)) {
//     console.error(`La lista de películas para ${title} no es válida.`);
//     return;
//   }

//   const movieListElem = document.createElement("section");
//   movieListElem.classList.add("movie-list");
//   movieListElem.ariaLabel = `${title}`;

//   movieListElem.innerHTML = `
//       <div
//         class="title-wrapper"
//         style="
//           border-bottom: 2px solid white;
//           display: flex;
//           flex-direction: row;
//           align-items: center;
//         "
//       >
//         <h3 class="title-large">${title}</h3>
//       </div>

//       <div class="slider-list">
//         <div class="slider-inner"></div>
//       </div>
//     `;

//   for (const movie of movieList) {
//     const movieCard = createmovieCard(movie);
//     movieListElem.querySelector(".slider-inner").appendChild(movieCard);
//   }

//   pageContent.appendChild(movieListElem);
// };

// "use strict";

// import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
// import { sidebar } from "./sidebar.js";
// import { createMovieCard } from "./movieCard.js";

// const pageContent = document.querySelector("[page-content]");
// const movieId = window.localStorage.getItem("movieId");
// sidebar();

// // Función para obtener películas favoritas desde el servidor
// const fetchFavoriteMovies = () => {
//   fetch(`/api/get-favorites`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((favoriteMovies) => {
//       console.log("Películas favoritas:", favoriteMovies); // Agregar console log para depuración
//       createMovieList({ results: favoriteMovies }, "Favorite Films");
//     })
//     .catch((error) =>
//       console.error("Error al obtener las películas favoritas:", error)
//     );
// };

// // Función para obtener películas que te gustan desde el servidor
// const fetchLikedMovies = () => {
//   fetch(`/api/get-likes`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((likedMovies) => {
//       console.log("Películas que te gustan:", likedMovies);
//       createMovieList({ results: likedMovies }, "Likes");
//     })
//     .catch((error) =>
//       console.error("Error al obtener las películas que te gustan:", error)
//     );
// };
// // Llamada a la API de TMDB para obtener detalles de la película seleccionada
// fetchDataFromServer(
//   `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
//   function (movie) {
//     const {
//       backdrop_path,
//       title,
//       release_date,
//       poster_path,
//       vote_average,
//       runtime,
//       genres,
//       overview,
//       id,
//       releases = {},
//     } = movie;

//     const countries = releases.countries || [];
//     const certification =
//       countries.length > 0 ? countries[0].certification : "Unknown";
//     document.title = `${title} - Tvflix`;

//     // Obtener las películas favoritas y los likes desde el servidor
//     fetchFavoriteMovies();
//     fetchLikedMovies();
//   }
// );

// // Función para crear listas de películas
// const createMovieList = function ({ results: movieList = [] }, title) {
//   if (!Array.isArray(movieList)) {
//     console.error(`La lista de películas para ${title} no es válida.`);
//     return;
//   }

//   const movieListElem = document.createElement("section");
//   movieListElem.classList.add("movie-list");
//   movieListElem.ariaLabel = `${title}`;

//   movieListElem.innerHTML = `
//       <div
//         class="title-wrapper"
//         style="
//           border-bottom: 2px solid white;
//           display: flex;
//           flex-direction: row;
//           align-items: center;
//         "
//       >
//         <h3 class="title-large">${title}</h3>
//       </div>

//       <div class="slider-list">
//         <div class="slider-inner"></div>
//       </div>
//     `;

//   for (const movie of movieList) {
//     // Verificar si poster_path está presente antes de crear la tarjeta
//     if (movie.poster_path) {
//       const movieCard = createMovieCard(movie);
//       movieListElem.querySelector(".slider-inner").appendChild(movieCard);
//     } else {
//       console.warn(
//         `La película "${movie.title || "desconocida"}" no tiene un poster_path.`
//       );
//     }
//   }

//   pageContent.appendChild(movieListElem);
// };

"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movieCard.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");
const movieId = window.localStorage.getItem("movieId");
sidebar();

// Función para obtener películas favoritas desde el servidor
const fetchFavoriteMovies = () => {
  fetch(`/api/get-favorites`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((favoriteMovies) => {
      console.log("Películas favoritas:", favoriteMovies); // Agregar console log para depuración
      createMovieList({ results: favoriteMovies }, "Favorite Films");
    })
    .catch((error) =>
      console.error("Error al obtener las películas favoritas:", error)
    );
};

// Función para obtener películas que te gustan desde el servidor
const fetchLikedMovies = () => {
  fetch(`/api/get-likes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((likedMovies) => {
      console.log("Películas que te gustan:", likedMovies);
      createMovieList({ results: likedMovies }, "Likes");
    })
    .catch((error) =>
      console.error("Error al obtener las películas que te gustan:", error)
    );
};

// Función para obtener películas en la watchlist desde el servidor
const fetchWatchlistMovies = () => {
  fetch(`/api/get-watchlist`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((watchlistMovies) => {
      console.log("Películas en la watchlist:", watchlistMovies);
      createMovieList({ results: watchlistMovies }, "Watchlist");
    })
    .catch((error) =>
      console.error("Error al obtener las películas en la watchlist:", error)
    );
};

const fetchSeenMovies = () => {
  fetch(`/api/get-watched`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((seenMovies) => {
      console.log("Películas vistas:", seenMovies);
      createMovieList({ results: seenMovies }, "Seen Movies");
    })
    .catch((error) =>
      console.error("Error al obtener las películas vistas:", error)
    );
};

// Llamada a la API de TMDB para obtener detalles de la película seleccionada
fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}`,
  function (movie) {
    const {
      //   backdrop_path,
      title,
      //   release_date,
      //   poster_path,
      //   vote_average,
      //   runtime,
      //   genres,
      //   overview,
      //   id,
      // Se asegura de que releases tenga un valor predeterminado de objeto vacío
    } = movie;

    document.title = `${title} - Tvflix`;

    // Obtener las películas favoritas y los likes desde el servidor
    fetchFavoriteMovies();
    fetchLikedMovies();
    fetchWatchlistMovies();
    fetchSeenMovies();
  }
);

// Función para crear listas de películas
const createMovieList = function ({ results: movieList = [] }, title) {
  if (!Array.isArray(movieList)) {
    console.error(`La lista de películas para ${title} no es válida.`);
    return;
  }

  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = `${title}`;

  movieListElem.innerHTML = `
      <div
        class="title-wrapper"
        style="
          border-bottom: 2px solid white;
          display: flex;
          flex-direction: row;
          align-items: center;
        "
      >
        <h3 class="title-large">${title}</h3>
      </div>

      <div class="slider-list">
        <div class="slider-inner"></div>
      </div>
    `;

  for (const movie of movieList) {
    // Verificar si poster_path está presente antes de crear la tarjeta
    if (movie.poster_path) {
      const movieCard = createMovieCard(movie);
      movieListElem.querySelector(".slider-inner").appendChild(movieCard);
    } else {
      console.warn(
        `La película "${movie.title || "desconocida"}" no tiene un poster_path.`
      );
    }
  }

  pageContent.appendChild(movieListElem);
};

search();
