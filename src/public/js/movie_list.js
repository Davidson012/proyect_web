"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { sidebar } from "./sidebar.js";

const pageContent = document.querySelector("[page-content]");
sidebar();
