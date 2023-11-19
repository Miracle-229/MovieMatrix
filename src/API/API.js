import axios from 'axios';
import img from '../Img/project-noimage.jpg';

const API_KEY = 'a4999a28333d1147dbac0d104526337a';
const API_URL = 'https://api.themoviedb.org/3';
const POSTER_URL = 'https://image.tmdb.org/t/p/original';
const PROFILE_IMG_URL = 'https://image.tmdb.org/t/p/w200';
const SEARCH_URL = 'https://api.themoviedb.org/3/search/multi';
const LANGUAGE = 'ru';

const fetchMoviesByEndpoint = async (id, results, endpoint, params) => {
  try {
    const { data } = await axios.get(`${API_URL}/${endpoint}`, {
      params: {
        api_key: API_KEY,
        language: LANGUAGE,
        ...params,
      },
    });
    const modifiedData = data[results].map((item) => ({
      id: item[id],
      backPoster: item['backdrop_path']
        ? POSTER_URL + item['backdrop_path']
        : img,
      popularity: item['popularity'],
      title: item['title'],
      poster: item['poster_path'] ? POSTER_URL + item['poster_path'] : img,
      overview: item['overview'],
      rating: item['vote_average'],
      name: item['name'],
      profileImg: item['profile_path']
        ? PROFILE_IMG_URL + item['profile_path']
        : img,
      know: item['known_for_department'],
      character: item['character'],
    }));
    return modifiedData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchMovies = async (result) => {
  return fetchMoviesByEndpoint('id', 'results', `${result}`, {
    with_original_language: 'en',
  });
};

export const fetchGenre = async (result) => {
  return fetchMoviesByEndpoint('id', 'genres', `genre/${result}/list`);
};

export const fetchMovieByGenre = async (
  result,
  selectedGenres = [],
  page = 1
) => {
  const with_genres = selectedGenres.join(',');

  try {
    if (with_genres) {
      return await fetchMoviesByEndpoint(
        'id',
        'results',
        `discover/${result}`,
        {
          with_genres,
          page,
          sort_by: 'vote_average.desc',
          'vote_count.gte': '400',
        }
      );
    } else {
      return await fetchMoviesByEndpoint(
        'id',
        'results',
        `discover/${result}`,
        {
          page,
          sort_by: 'vote_average.desc',
          'vote_count.gte': '400',
        }
      );
    }
  } catch (error) {
    console.error('Error fetching movie by genre:', error);
    throw error; // Если вы хотите пробросить ошибку дальше
  }
};

export const fetchPersons = async () => {
  return fetchMoviesByEndpoint('id', 'results', 'trending/person/week');
};

export const fetchTopRatedMovie = async (id, results, endpoint, params) => {
  try {
    const { data } = await axios.get(
      `http://localhost:8080/api/movie/popular`,
      {
        params: {
          size: 10,
          ...params,
        },
      }
    );
    const modifiedData = data.map((item) => ({
      id: item.id,
      backPoster: item.backdrop_path ? POSTER_URL + item.backdrop_path : img,
      popularity: item.popularity,
      title: item.title,
      poster: item.posterPath ? POSTER_URL + item.posterPath : img,
      overview: item.overview,
      rating: item.voteAverage,
      name: item.name,
      profileImg: item.profile_path ? PROFILE_IMG_URL + item.profile_path : img,
      know: item.known_for_department,
      character: item.character,
    }));
    return modifiedData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchSimilarMovie = async (result, id) => {
  return await fetchMoviesByEndpoint(
    'id',
    'results',
    `${result}/${id}/similar`
  );
};

export const fetchCasts = async (result, id) => {
  return await fetchMoviesByEndpoint(
    'cast_id',
    'cast',
    `${result}/${id}/credits`
  );
};

const fetchDataDetail = async (movieId, params) => {
  try {
    const { data } = await axios.get(`http://localhost:8080/api/${movieId}`);
    const modifiedData = {
      id: data.id,
      backPoster: data.backdropPath ? POSTER_URL + data.backdropPath : img,
      popularity: data.popularity,
      title: data.title,
      poster: data.posterPath ? POSTER_URL + data.posterPath : img,
      overview: data.overview,
      rating: data.voteAverage,
      profileImg: data.profilePath ? PROFILE_IMG_URL + data.profilePath : img,
      know: data.known_for_department,
      character: data.character,
      genres:data.genres
    };
    return modifiedData;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchMovieDetail = async (result, id) =>
  fetchDataDetail(`${result}/${id}`, {
    language: 'ru',
  });
export const fetchMovieVideos = async (result, id) => {
  const data = await fetchDataDetail(`${result}/${id}/videos`, {
    language: 'en',
  });
  return data['results'][0];
};

export const loadOptions = async (query, setOptions) => {
  if (!query) {
    setOptions([]);
    return;
  }

  const { data } = await axios.get(
    'http://localhost:8080/api/movie/search/' + query,
    {
      params: {
        query: query,
      },
    }
  );

  const newOptions = data.map((result) => ({
    value: result.id,
    label: result.title,
    posterPath: result.posterPath,
    rating: result.voteAverage,
    genreIds: result.genre_ids,
  }));
  setOptions(newOptions);
};
