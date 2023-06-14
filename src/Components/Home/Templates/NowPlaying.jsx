import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchMovies } from '../../../API/API.js';
import style from './Style.module.scss';

const NowPlaying = ({ result }) => {
  const [nowPlaying, setNowPlaying] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      setNowPlaying(await fetchMovies(result));
    };
    fetchAPI();
  }, [result]);

  const movieList = nowPlaying.slice(0, 4).map((item, index) => {
    return (
      <div className="col-md-3 col-sm-6" key={index}>
        <div className="card">
          {result === 'movie/now_playing' ? (
            <NavLink
              onClick={() => window.scrollTo(0, 0)}
              to={`/movie/${item.id}`}
            >
              <img src={item.poster} alt={item.title} className="img-fluid" />
            </NavLink>
          ) : (
            <NavLink
              onClick={() => window.scrollTo(0, 0)}
              to={`/tv/${item.id}`}
            >
              <img src={item.poster} alt={item.title} className="img-fluid" />
            </NavLink>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          className="mt-3"
        >
          <p style={{ fontWeight: 'bolder', marginBottom: '0px' }}>
            {result === 'movie/now_playing' ? item.title : item.name}
          </p>
          <span
            style={{
              backgroundColor:
                item.rating < 4
                  ? 'black'
                  : item.rating < 7
                  ? '#2A2A2A'
                  : '#625FC9',
              padding: '3px 5px',
            }}
          >
            {item.rating.toFixed(2)}
          </span>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className={style.carousel}>
        <div className="row mt-3">
          <div className="col">
            {result === 'movie/now_playing' ? (
              <p className="font-weight-bold" style={{ color: '#5a606b' }}>
                ПОПУЛЯРНЫЕ ФИЛЬМЫ НА ЭТОЙ НЕДЕЛЕ
              </p>
            ) : (
              <p className="font-weight-bold" style={{ color: '#5a606b' }}>
                ПОПУЛЯРНЫЕ CЕРИАЛЫ НА ЭТОЙ НЕДЕЛЕ
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="row mt-3">{movieList}</div>
    </div>
  );
};

export default NowPlaying;
