import { api_key, fetchDataFromServer } from "./api.js";

export const fetchMissingProperty = (movieId, property) => {
  return new Promise((resolve, reject) => {
    fetchDataFromServer(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=${property}`,
      (data) => {
        if (data[property]) {
          resolve(data[property]);
        } else {
          reject(`La propiedad ${property} no se pudo encontrar.`);
        }
      }
    );
  });
};
