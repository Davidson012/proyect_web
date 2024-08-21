"use strict";

import { imageBaseURL } from "./api.js";

/**
 * Movie Card
 */

export function createmoviecard(movie) {
  const { poster_path, title, vote_average, release_date, id } = movie;

  const card = document.createElement("div");

  card.classList.add("movie-card");
  card.innerHTML = `
    <figure class="poster-box card-banner">
      <img
        src="${imageBaseURL}w342${poster_path}"
        class="img-cover"
        alt="${title}"
        loading="lazy"
      />
    </figure>

    <h4 class="title">${title}</h4>

    <div class="meta-list">
      <div class="meta-item">
        <img
          src="/images/star.png"
          width="20"
          height="20"
          loading="lazy"
          alt="rating"
        />
        <span class="span">${vote_average.toFixed(1)}</span>
      </div>
      <div class="card-badge">${release_date.split("-")[0]}</div>
    </div>

    <a href="#"  id="loginLink" onclick="getMovieDetail(${id})"   class="card-btn" title="${title}"></a>
  `;

  return card;
}
