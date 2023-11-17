import axios from 'axios';
import img from '../Img/project-noimage.jpg';

const API_KEY = 'a4999a28333d1147dbac0d104526337a';
const API_URL = 'https://api.themoviedb.org/3';
const POSTER_URL = 'https://image.tmdb.org/t/p/original/';
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
          'vote_count.gte':'400'
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
          'vote_count.gte':'400'
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

export const fetchTopRatedMovie = async (result) => {
  return fetchMoviesByEndpoint('id', 'results', `${result}/top_rated`);
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

const fetchDataDetail = async (path, params) => {
  try {
    const { data } = await axios.get(`${API_URL}/${path}`, {
      params: {
        api_key: API_KEY,
        ...params,
      },
    });
    return data;
  } catch (error) {}
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

  const { data } = await axios.get(SEARCH_URL, {
    params: {
      api_key: API_KEY,
      language: 'ru',
      query: query,
    },
  });

  const newOptions = data.results.map((result) => ({
    value: result.id,
    label: result.media_type === 'movie' ? result.title : result.name,
    posterPath: result.poster_path,
    rating: result.vote_average,
    year:
      result.media_type === 'movie'
        ? result.release_date
        : result.first_air_date,
    genreIds: result.genre_ids,
    type: result.media_type,
  }));
  setOptions(newOptions);
};

const sortMoviesBySelectedGenres = async (result, selectedGenres) => {
  try {
    const { data } = await axios.get(`${API_URL}/discover/${result}`, {
      params: {
        api_key: API_KEY,
        language: LANGUAGE,
        with_genres: selectedGenres.join(','),
      },
    });
    const modifiedData = data.results.map((item) => ({
      id: item.id,
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
    }));
    return modifiedData;
  } catch (error) {
    console.error(error);
    return [];
  }
};
