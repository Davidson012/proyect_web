"use strict";

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";

import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";

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
//return only  trailers and teaser as array
const filterVideos = (videoList) => {
  return videoList.filter(
    ({ type, site }) => type == "Teaser" && site == "YouTube"
  );
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
  function (movie) {
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
                <button><ion-icon name="eye-outline"></ion-icon></button>
                <button><ion-icon name="heart-outline"></ion-icon></button>
                <button>
                  <ion-icon name="time-outline"></ion-icon>
                </button>
              </div>

              <div class="form-buttons">
                <button type="button">Add favorite film</button>
              </div>

              <section class="ratings-section">
                <form id="form">
                  <div class="rating-text">Rating</div>
                  <p class="clasificacion">
                    <input
                      id="radio1"
                      type="radio"
                      name="estrellas"
                      value="5"
                    /><!--
                    --><label for="radio1">★</label
                    ><!--
                    --><input
                      id="radio2"
                      type="radio"
                      name="estrellas"
                      value="4"
                    /><!--
                    --><label for="radio2">★</label
                    ><!--
                    --><input
                      id="radio3"
                      type="radio"
                      name="estrellas"
                      value="3"
                    /><!--
                    --><label for="radio3">★</label
                    ><!--
                    --><input
                      id="radio4"
                      type="radio"
                      name="estrellas"
                      value="2"
                    /><!--
                    --><label for="radio4">★</label
                    ><!--
                    --><input
                      id="radio5"
                      type="radio"
                      name="estrellas"
                      value="1"
                    /><!--
                    --><label for="radio5">★</label>
                  </p>
                </form>
              </section>
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
