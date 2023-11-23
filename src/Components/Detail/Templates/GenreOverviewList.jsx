import React, { useState, useEffect } from 'react';
import { fetchMovieDetail } from '../../../API/API.js';
import { useMatch } from 'react-router-dom';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { UserAuth } from '../../../Context/AuthContext.js';
import axios from 'axios';

const GenreOverviewList = (props) => {
  const { result } = props;
  const match = useMatch(`/${result}/:id`);
  let params = match.params;
  let genres = [];
  let date;
  let last_date;
  const [detail, setDetail] = useState([]);
  const [objectMark, setObjectMark] = useState([]);
  const [savedId, setSavedId] = useState([]);
  // const [selectedIcon, setSelectedIcon] = useState([]);
  const user = localStorage.getItem('user');
  const access = localStorage.getItem('accessToken')

  const saveShow = async (item) => {
    try {
      await axios.post('http://localhost:8080/api/bookmark', {
        movieId: item.id,
      });
      axios
        .get(`http://localhost:8080/api/bookmark`)
        .then((response) => {
          const savedShows = response.data;
          const savedIds = savedShows?.map((show) => show.movie.id);
          setSavedId(savedIds);
        })
        .catch((error) => {
          console.error('Ошибка:', error);
        });
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const deleteShow = async (item) => {
    const bookmarkId = objectMark.find(
      (obj) => obj.movie.id === item.id
    )?.bookmarkId;
    console.log(bookmarkId);
    try {
      await axios.delete(`http://localhost:8080/api/bookmark/${bookmarkId}`);
      // После успешного сохранения, обновляем состояние
      axios
        .get(`http://localhost:8080/api/bookmark`)
        .then((response) => {
          const savedShows = response.data;
          const savedIds = savedShows?.map((show) => show.movie.id);
          setSavedId(savedIds);
        })
        .catch((error) => {
          console.error('Ошибка:', error);
        });
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };
  useEffect(() => {
    if (access) {
      axios
        .get(`http://localhost:8080/api/bookmark`)
        .then((response) => {
          const savedShows = response.data;
          const savedIds = savedShows?.map((show) => show.movie.id);
          setSavedId(savedIds);
          setObjectMark(response.data);
        })
        .catch((error) => {
          console.error('Ошибка:', error);
        });
    }
  }, [user?.email]);

  genres = detail.genres;

  useEffect(() => {
    const fetchApi = async () => {
      setDetail(await fetchMovieDetail(result, params.id));
    };
    fetchApi();
  }, [result, params.id]);

  let genresList;
  if (genres) {
    genresList = genres.map((item, index) => {
      return (
        <li className="list-inline-item" key={index}>
          <button className="btn btn-outline-info">{item.name}</button>
        </li>
      );
    });
  }

  if (result === 'movie') {
    date = new Date(detail.release_date);
  } else if (result === 'tv') {
    date = new Date(detail.first_air_date);
    last_date = new Date(detail.last_air_date);
  }
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '40% 30% 30%' }}>
        <div>
          <div className="row mt-3">
            <div className="col">
              <p style={{ color: '#5a606b', fontWeight: 'bolder' }}>ЖАНР</p>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col">
              <ul className="list-inline">{genresList}</ul>
            </div>
          </div>
        </div>
        <div>
          <div className="row mt-3">
            <div className="col">
              <p style={{ color: '#5a606b', fontWeight: 'bolder' }}>РЕЙТИНГ</p>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col">
              <p
                style={{
                  backgroundColor:
                    detail.rating < 4
                      ? 'black'
                      : detail.rating < 7
                      ? '#2A2A2A'
                      : '#625FC9',
                  padding: '3px 5px',
                  display: 'inline-block',
                }}
              >
                {detail.rating ? detail.rating.toFixed(2) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <div style={{ margin: '0px' }}>
              {user ? (
                <div style={{ margin: '0px' }}>
                  {savedId && savedId.includes(detail.id) ? (
                    <BsBookmarkFill
                      onClick={() => deleteShow(detail)}
                      style={{ cursor: 'pointer', fontSize: '45px' }}
                    />
                  ) : (
                    <BsBookmark
                      onClick={() => saveShow(detail)}
                      style={{ cursor: 'pointer', fontSize: '45px' }}
                    />
                  )}
                </div>
              ) : (
                <BsBookmark style={{ display: 'none', cursor: 'pointer' }} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col">
          <div className="mt-3">
            <p style={{ color: '#5a606b', fontWeight: 'bolder' }}>ОБЗОР</p>
            {detail.overview}
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-3">
          <p style={{ color: '#5a606b', fontWeight: 'bolder' }}>ДАТА ВЫХОДА</p>
          {result === 'movie' ? (
            <p style={{ color: '#f4c10f' }}>{`${date.getDate()} ${
              months[date.getMonth()]
            } ${date.getFullYear()} года`}</p>
          ) : (
            <p style={{ color: '#f4c10f' }}>
              C{' '}
              {`${date.getDate()} ${
                months[date.getMonth()]
              } ${date.getFullYear()} года`}{' '}
              {detail.next_episode_to_air === null ? (
                <p style={{ color: '#f4c10f' }}>
                  по{' '}
                  {`${last_date.getDate()} ${
                    months[last_date.getMonth()]
                  } ${last_date.getFullYear()} года`}
                </p>
              ) : (
                <p />
              )}
            </p>
          )}
        </div>
        <div className="col-md-3">
          <p style={{ color: '#5a606b', fontWeight: 'bolder' }}>ДЛИТЕЛЬНОСТЬ</p>
          {result === 'movie' ? (
            <p style={{ color: '#f4c10f' }}>
              {Math.floor(detail.runtime / 60)} ч. {detail.runtime % 60} мин.
            </p>
          ) : (
            <p style={{ color: '#f4c10f' }}>
              {detail.number_of_seasons} сез. по{' '}
              {Math.floor(detail.number_of_episodes / detail.number_of_seasons)}{' '}
              сер.
            </p>
          )}
        </div>
        {result === 'movie' ? (
          <>
            <div className="col-md-3">
              <p style={{ color: '#5a606b', fontWeight: 'bolder' }}>БЮДЖЕТ</p>
              <p style={{ color: '#f4c10f' }}>
                {detail.budget === undefined || detail.budget === 0
                  ? 'Нет данных'
                  : `${detail.budget.toLocaleString()} $`}
              </p>
            </div>
            <div className="col-md-3">
              <p style={{ color: '#5a606b', fontWeight: 'bolder' }}>СБОРЫ</p>
              <p style={{ color: '#f4c10f' }}>
                {detail.revenue === undefined || detail.revenue === 0
                  ? 'Нет данных'
                  : `${detail.revenue.toLocaleString()} $`}
              </p>
            </div>
          </>
        ) : (
          <div className="col-md-3">
            <p style={{ color: '#5a606b', fontWeight: 'bolder' }}>
              ВРЕМЯ СЕРИИ
            </p>
            <p style={{ color: '#f4c10f' }}>
              {detail.episode_run_time === undefined ||
              detail.episode_run_time === 0
                ? 'Нет данных'
                : `~ ${Math.floor(parseInt(detail.episode_run_time))} мин.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenreOverviewList;
