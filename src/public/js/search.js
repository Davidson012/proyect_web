import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

export function search() {
  const searchField = document.querySelector("[search-field]");
  const searchModal = document.getElementById("search-result-modal");
  const searchQueryHeading = document.getElementById("search-query");
  const searchGridList = document.getElementById("search-grid-list");

  let searchTimeout;

  searchField.addEventListener("input", function () {
    clearTimeout(searchTimeout);

    const query = searchField.value.trim();

    if (!query) {
      searchModal.classList.remove("active");
      searchGridList.innerHTML = ""; // Limpiar los resultados anteriores
      return;
    }

    searchTimeout = setTimeout(() => {
      fetchDataFromServer(
        `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${query}&include_adult=true&page=1`,
        function ({ results: movieList }) {
          searchModal.classList.add("active");
          searchQueryHeading.textContent = query;
          searchGridList.innerHTML = ""; // Limpiar los resultados anteriores

          if (movieList.length > 0) {
            for (const movie of movieList) {
              const movieCard = createMovieCard(movie);
              searchGridList.appendChild(movieCard);
            }
          } else {
            searchGridList.innerHTML = `<p>No results found for "${query}".</p>`;
          }
        }
      );
    }, 500);
  });
}
