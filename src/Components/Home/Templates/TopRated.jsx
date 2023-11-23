import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchTopRatedMovie } from '../../../API/API.js';
import style from './Style.module.scss';

const TopRated = ({result}) => {
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      setTopRated(await fetchTopRatedMovie(result));
    };
    fetchAPI();
  }, [result]);

  const topRatedList = topRated.slice(0, 4).map((item, index) => {
    return (
      <div className="col-md-3 text-center" key={index}>
        <div className="card">
        {result === 'movie' ? (
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
          {result === 'movie' ? item.title : item.name}
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
            {item.rating.toFixed(1)}
          </span>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className={style.carousel}>
        <div className="row mt-5">
          <div className="col">
          {result === 'movie' ? (
              <p className="font-weight-bold" style={{ color: '#5a606b' }}>
                ТОП РЕЙТИНГОВЫХ ФИЛЬМОВ
              </p>
            ) : (
              <p className="font-weight-bold" style={{ color: '#5a606b' }}>
               ТОП РЕЙТИНГОВЫХ СЕРИАЛОВ
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="row mt-2">{topRatedList}</div>
    </div>
  );
};

export default TopRated;
