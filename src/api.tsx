const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  original_title: string;
  release_date: string;
  vote_average: number;
  adult: boolean;
  popularity: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

interface IGenres {
  name: string;
}

export interface IMovieDetail {
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  tagline: string;
  title: string;
  adult: boolean;
  popularity: number;
  genres: IGenres[];
}

interface ISeasons {
  episode_count: number;
}

export interface ITvDetail {
  backdrop_path: string;
  genres: IGenres[];
  name: string;
  overview: string;
  poster_path: string;
  tagline: string;
  vote_average: number;
  first_air_date: string;
  seasons: ISeasons[];
}

interface ICast {
  name: string;
  profile_path: string;
  job: string;
  department: string;
}

interface ICrews {
  name: string;
  profile_path: string;
  job: string;
  department: string;
}

export interface ICrew {
  cast: ICast[];
  crew: ICrews[];
}

export interface ISearchMovies {
  results: IMovie[];
}

interface ITv {
  backdrop_path: string;
  overview: string;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  id: number;
}

export interface ISearchTv {
  results: ITv[];
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function getMoviesDetail(id: number) {
  return fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}&language=ko`).then(
    (reponse) => reponse.json()
  );
}

export function getTvDetail(id: number) {
  return fetch(`${BASE_PATH}/tv/${id}?api_key=${API_KEY}&language=ko`).then(
    (reponse) => reponse.json()
  );
}

export function popularMovies() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function topMovies() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function upComingMovies() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function movieCrews(id: number) {
  return fetch(
    `${BASE_PATH}/movie/${id}/credits?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function tvCrews(id: number) {
  return fetch(
    `${BASE_PATH}/tv/${id}/credits?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function searchMovies(query: string) {
  return fetch(
    `${BASE_PATH}/search/movie?query=${query}&api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}

export function searchTv(query: string) {
  return fetch(
    `${BASE_PATH}/search/tv?query=${query}&api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}
