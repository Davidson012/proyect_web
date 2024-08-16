"use strict";

import { api_key, fetchDataFromServer } from "./api.js";

export function sidebar() {
  const genreList = {};

  fetchDataFromServer(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`,
    function ({ genres }) {
      for (const { id, name } of genres) {
        genreList[id] = name;
      }

      genreLink();
    }
  );

  const siderbarInner = document.createElement("div");
  siderbarInner.classList.add("sidebar-inner");

  siderbarInner.innerHTML = `
     <div class="sidebar-list">
          <p class="title">Genre</p>

        </div>
        <div class="sidebar-list">
          <p class="title">Language</p>
          <a href="/movies" menu-close class="sidebar-link">Spanish</a>
          <a href="/movies" menu-close class="sidebar-link">English</a>
          <a href="/movies" menu-close class="sidebar-link">Japanese</a>
          <a href="/movies" menu-close class="sidebar-link">Korean</a>
          <a href="/movies" menu-close class="sidebar-link">Mandarin</a>
          <a href="/movies" menu-close class="sidebar-link">German</a>
          <a href="/movies" menu-close class="sidebar-link"> French</a>
        </div>

        <div class="sidebar-footer">
          <p class="copyright">
            Copyright @2024
            <a class="cp" href="https://bento.me/dalvinson-reyes"
              >Dalvinson Reyes</a
            >
            <img
              src="/images/tmdb-logo.svg"
              width="130"
              height="17"
              alt="The Movie Database Logo"
            />
          </p>
        </div>
  `;

  const genreLink = function () {
    for (const [genreId, genreName] of Object.entries(genreList)) {
      const link = document.createElement("a");
      link.classList.add("sidebar-link");
      link.setAttribute("href", "/movies");
      link.setAttribute("menu-close", "");
      // link.setAttribute(
      //   "onclick",
      //   `getMovieList("with_genres=${genreId}" , "${genreName}")`
      // );
      link.textContent = genreName;

      siderbarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
    }

    const sidebar = document.querySelector("[sidebar]");
    sidebar.appendChild(siderbarInner);
    toogleSidebar(sidebar);
  };

  const toogleSidebar = function (sidebar) {
    /**Toggle  sidebar in movie */

    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler");
    const sidebarClose = document.querySelectorAll("[menu-close]");
    const overlay = document.querySelector("[overlay]");

    const addEventOnElements = function (elements, eventType, callback) {
      for (const elem of elements) elem.addEventListener(eventType, callback);
    };
    addEventOnElements(sidebarTogglers, "click", function () {
      sidebar.classList.toggle("active");
      sidebarBtn.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    addEventOnElements(sidebarClose, "click", function () {
      sidebar.classList.remove("active");
      sidebarBtn.classList.remove("active");
      overlay.classList.remove("active");
    });
  };
}
