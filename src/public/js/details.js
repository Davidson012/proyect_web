"use strict";

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";

import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

const pageContent = document.querySelector("[page-content]");
const movieId = window.localStorage.getItem("movieId");
sidebar();

const getGenres = function (genreList) {
  const newGenreList = [];

  for (const { name } of genreList) newGenreList.push(name);

  return newGenreList.join(", ");
};

const getCats = (castList) => {
  const newCastList = [];

  for (let i = 0, len = castList.length; i < len && i < 10; i++) {
    const { name } = castList[i];

    newCastList.push(name);
  }

  return newCastList.join(", ");
};

const getCrew = (CrewList) => {
  const directors = CrewList.filter(({ job }) => job == "Director");

  const directorList = [];

  for (const { name } of directors) directorList.push(name);

  return directorList.join(", ");
};
// return only  trailers and teaser as array
const filterVideos = (videoList) => {
  return videoList.filter(
    ({ type, site }) => type == "Teaser" && site == "YouTube"
  );
};

const generateStars = (rating) => {
  return `
    <div class="review-rating">
      ${"★".repeat(rating)}${"☆".repeat(5 - rating)}
    </div>
  `;
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
  async function (movie) {
    const {
      backdrop_path,
      title,
      release_date,
      poster_path,
      vote_average,
      runtime,
      releases: {
        countries: [{ certification }],
      },

      genres,
      overview,
      casts: { cast, crew },
      videos: { results: videos },
    } = movie;

    document.title = `${title} - Tvflix`;

    // Filtrar medios

    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");

    movieDetail.innerHTML = `

      <div
            class="backdrop-image"
         style="background-image: url('${imageBaseURL}${
      backdrop_path ? "w1280" : "original"
    }${backdrop_path || poster_path}')"

          ></div>

          <figure class="poster-box movie-poster">
            <img
              src="${imageBaseURL}w342${poster_path}"
              alt="${title} poster"
              class="img-cover"
            />
          </figure>

          <section class="section-container">
            <div class="form-container">
              <div class="form-header">
                <button class="btn-v"><ion-icon name="eye-outline"></ion-icon></button>
                <button class="btn-l"><ion-icon name="heart-outline"></ion-icon></button>
                <button class="btn-w">
                  <ion-icon name="time-outline"></ion-icon>
                </button>
              </div>

              <div class="form-buttons">
                <button class="btn-add" type="button">Add favorite film</button>
              </div>
            </div>
          </section>

              <div class="detail-box">
            <div class="detail-content">
              <h1 class="heading">${title}</h1>

              <div class="meta-list">
                <div class="meta-item">
                  <img
                    src="/images/star.png"
                    width="20"
                    height="20"
                    alt="rating"
                  />
                  <span class="span">${vote_average.toFixed(1)}</span>
                </div>

                <div class="separator"></div>

                <div class="meta-item">${runtime}m</div>

                <div class="separator"></div>

                <div class="meta-item">${release_date.split("-")[0]}</div>

                <div class="meta-item card-badge">${certification}</div>
              </div>

              <p class="genre">${getGenres(genres)}</p>

              <p class="overview">
                ${overview}
              </p>

              <ul class="detail-list">
                <div class="list-item">
                  <p class="list-name">Starring</p>

                  <p>
                    ${getCats(cast)}
                  </p>
                </div>

                <div class="list-item">
                  <p class="list-name">Crew</p>

                  <p>${getCrew(crew)}</p>
                </div>
              </ul>
            </div>

            <div class="title-wrapper">
              <h3 class="title-large">Trailers and Clips</h3>
            </div>

            <div class="slider-list">
              <div class="slider-inner"></div>
            </div>
          </div>

            <!-- Sección de comentarios -->
  <div class="comments-section">
    <div class="comment-form">
      <div class="title-wrapper">
              <h3 class="title-large">Seccion de comentarios</h3>
            </div>
      <textarea id="comment" placeholder="Escribe tu comentario..."></textarea>
      <div class="rating-stars">
        <!-- Estrellas de calificación -->
        <p class="rs" >
        <input type="radio" name="stars" id="star5" value="5" /><label for="star5">★</label>
        <input type="radio" name="stars" id="star4" value="4" /><label for="star4">★</label>
        <input type="radio" name="stars" id="star3" value="3" /><label for="star3">★</label>
        <input type="radio" name="stars" id="star2" value="2" /><label for="star2">★</label>
        <input type="radio" name="stars" id="star1" value="1" /><label for="star1">★</label>
        </p>
      </div>
      <button class="btn-e" id="submitComment">Enviar</button>
    </div>

    <div id="commentsList">
      <!-- Aquí se agregarán los comentarios -->
    </div>
  </div>

    `;

    for (const { key, name } of filterVideos(videos)) {
      const videoCard = document.createElement("div");
      videoCard.classList.add("video-card");

      videoCard.innerHTML = `
        <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" frameborder="0" allowfullscreen="1" title= "${name}" class= "img-cover" loading= "lazy"></iframe>

        `;

      movieDetail.querySelector(".slider-inner").appendChild(videoCard);
    }

    pageContent.appendChild(movieDetail);

    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`,
      addSuggestedMovies
    );

    const posterPath = String(poster_path);

    // Código para manejar el botón de la watchlist
    fetch("/api/get-watchlist")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then((text) => {
            throw new Error(
              `Server responded with status ${response.status}: ${text}`
            );
          });
        }
      })
      .then((watchlist) => {
        const isInWatchlist = watchlist.some(
          (item) => item.movie_id === parseInt(movieId)
        );
        updateWatchlistBtn(isInWatchlist);
      })
      .catch((error) => console.error("Error fetching watchlist:", error));

    const watchlistBtn = movieDetail.querySelector(".btn-w");

    const updateWatchlistBtn = (isInWatchlist) => {
      const watchlistIcon = watchlistBtn.querySelector("ion-icon");

      if (isInWatchlist) {
        watchlistIcon.setAttribute("name", "checkmark-circle-outline"); // Ícono para "Remove from Watchlist"
        watchlistBtn.classList.add("in-watchlist"); // Añade la clase para cambiar el color a azul
      } else {
        watchlistIcon.setAttribute("name", "time-outline"); // Ícono para "Add to Watchlist"
        watchlistBtn.classList.remove("in-watchlist"); // Remueve la clase para volver al color predeterminado
      }
    };

    watchlistBtn.addEventListener("click", () => {
      const isInWatchlist = watchlistBtn.classList.contains("in-watchlist");
      const url = isInWatchlist
        ? "/api/remove-from-watchlist"
        : "/api/add-to-watchlist";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId, title: title, posterPath }),
      })
        .then((response) => response.text())
        .then((message) => {
          console.log(message);
          updateWatchlistBtn(!isInWatchlist);
        })
        .catch((error) => console.error("Error updating watchlist:", error));
    });

    // Obtener el botón de película vista
    const watchedBtn = movieDetail.querySelector(".btn-v");

    // Función para actualizar el botón basado en si la película ya está en la lista de vistas
    const updateWatchedBtn = (isWatched) => {
      const watchedIcon = watchedBtn.querySelector("ion-icon");

      if (isWatched) {
        watchedIcon.setAttribute("name", "checkmark-circle-outline"); // Ícono para "Remove from Watched"
        watchedBtn.classList.add("in-watched"); // Añade la clase para cambiar el color a azul
      } else {
        watchedIcon.setAttribute("name", "eye-outline"); // Ícono para "Add to Watched"
        watchedBtn.classList.remove("in-watched"); // Remueve la clase para volver al color predeterminado
      }
    };

    // Función para manejar clics en el botón
    watchedBtn.addEventListener("click", () => {
      const isWatched = watchedBtn.classList.contains("in-watched");
      const url = isWatched
        ? "/api/remove-from-watched"
        : "/api/add-to-watched";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId, title: title, posterPath }),
      })
        .then((response) => response.text())
        .then((message) => {
          console.log(message);
          updateWatchedBtn(!isWatched);
        })
        .catch((error) => console.error("Error updating watched list:", error));
    });

    // Código para verificar el estado inicial del botón
    fetch("/api/get-watched")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then((text) => {
            throw new Error(
              `Server responded with status ${response.status}: ${text}`
            );
          });
        }
      })
      .then((watchedList) => {
        const isWatched = watchedList.some(
          (item) => item.movie_id === parseInt(movieId)
        );
        updateWatchedBtn(isWatched);
      })
      .catch((error) => console.error("Error fetching watched list:", error));

    // Código para manejar el botón de likes
    fetch("/api/get-likes")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then((text) => {
            throw new Error(
              `Server responded with status ${response.status}: ${text}`
            );
          });
        }
      })
      .then((likes) => {
        const isLiked = likes.some(
          (item) => item.movie_id === parseInt(movieId)
        );
        updateLikeBtn(isLiked);
      })
      .catch((error) => console.error("Error fetching likes:", error));

    const likeBtn = movieDetail.querySelector(".btn-l");

    const updateLikeBtn = (isLiked) => {
      const likeIcon = likeBtn.querySelector("ion-icon");

      if (isLiked) {
        likeIcon.setAttribute("name", "heart"); // Ícono para "Liked"
        likeBtn.classList.add("liked"); // Añade la clase para cambiar el color
      } else {
        likeIcon.setAttribute("name", "heart-outline"); // Ícono para "Like"
        likeBtn.classList.remove("liked"); // Remueve la clase para volver al color predeterminado
      }
    };

    likeBtn.addEventListener("click", () => {
      const isLiked = likeBtn.classList.contains("liked");
      const url = isLiked ? "/api/remove-from-like" : "/api/add-to-like";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId, title, posterPath }),
      })
        .then((response) => response.text())
        .then((message) => {
          console.log(message);
          updateLikeBtn(!isLiked);
        })
        .catch((error) => console.error("Error updating like:", error));
    });

    //Codigo de peliculsa favorista
    // Obtener el botón de película favorita
    const favoriteBtn = movieDetail.querySelector(".btn-add");

    // Función para actualizar el botón de favoritos basado en si la película ya está en la lista de favoritas
    const updateFavoriteBtn = (isFavorited) => {
      if (isFavorited) {
        favoriteBtn.textContent = "Remove from Favorites"; // Cambia el texto del botón
        favoriteBtn.classList.add("in-favorites"); // Añade la clase para cambiar el color a azul permanentemente
        favoriteBtn.classList.remove("not-in-favorites"); // Remueve la clase de hover normal
      } else {
        favoriteBtn.textContent = "Add favorite film"; // Cambia el texto del botón
        favoriteBtn.classList.add("not-in-favorites"); // Añade la clase para el hover azul
        favoriteBtn.classList.remove("in-favorites"); // Remueve la clase azul permanente
      }
    };

    // Código para manejar el clic en el botón de favoritos
    favoriteBtn.addEventListener("click", () => {
      const isFavorited = favoriteBtn.classList.contains("in-favorites");
      const url = isFavorited
        ? "/api/remove-from-favorites"
        : "/api/add-to-favorites";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId, title, posterPath }),
      })
        .then((response) => response.text())
        .then((message) => {
          console.log(message);
          updateFavoriteBtn(!isFavorited);
        })
        .catch((error) => console.error("Error updating favorites:", error));
    });

    // Verificar el estado inicial del botón de favoritos
    fetch("/api/get-favorites")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.text().then((text) => {
            throw new Error(
              `Server responded with status ${response.status}: ${text}`
            );
          });
        }
      })
      .then((favorites) => {
        const isFavorited = favorites.some(
          (item) => item.movie_id === parseInt(movieId)
        );
        updateFavoriteBtn(isFavorited);
      })
      .catch((error) => console.error("Error fetching favorites:", error));

    // Manejo del envío de comentarios
    const submitCommentBtn = document.getElementById("submitComment");

    submitCommentBtn.addEventListener("click", () => {
      const commentText = document.getElementById("comment").value;
      const rating = document.querySelector(
        'input[name="stars"]:checked'
      )?.value;

      if (!commentText || !rating) {
        alert("Por favor, completa el comentario y la calificación.");
        return;
      }

      fetch("/api/add-comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
          comment: commentText,
          rating: parseInt(rating),
        }),
      })
        .then((response) => {
          if (response.ok) {
            document.getElementById("comment").value = "";
            document.querySelector(
              'input[name="stars"]:checked'
            ).checked = false;
            loadComments();
          } else {
            return response.text().then((text) => {
              throw new Error(
                `Server responded with status ${response.status}: ${text}`
              );
            });
          }
        })
        .catch((error) => console.error("Error adding comment:", error));
    });

    const loadComments = () => {
      fetch(`/api/get-comments/${movieId}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return response.text().then((text) => {
              throw new Error(
                `Server responded with status ${response.status}: ${text}`
              );
            });
          }
        })
        .then((comments) => {
          const commentsList = document.getElementById("commentsList");
          if (!commentsList) {
            console.error("El contenedor de comentarios no existe.");
            return;
          }

          commentsList.innerHTML = comments
            .map(
              (comment) => `
                <div class="comment-item">
                  <div class="comment-content">
                    <p><strong class="usernameLink">${
                      comment.name_user
                    }</strong> </p>
                     <p>${generateStars(comment.rating)}</p>
                    <p>${comment.comment}</p>
                  </div>
                </div>
              `
            )
            .join("");
        })
        .catch((error) => console.error("Error loading comments:", error));
    };

    // Llama a la función para cargar los comentarios cuando sea necesario
    loadComments();
  }
);

const addSuggestedMovies = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");
  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = "You May Also Like";

  movieListElem.innerHTML = `
      <div class="title-wrapper">
        <h3 class="title-large">You May Also Like</h3>
      </div>

      <div class="slider-list">
        <div class="slider-inner"></div>
      </div>
    `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie);

    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElem);
};

search();
