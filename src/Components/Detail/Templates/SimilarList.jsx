import React, { useState, useEffect } from 'react';
import { fetchSimilarMovie } from '../../../API/API.js';
import { useMatch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const SimilarMovieList = (props) => {
  const { result } = props;
  const match = useMatch(`/${result}/:id`);
  let params = match.params;
  const [similarMovie, setSimilarMovie] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      setSimilarMovie(await fetchSimilarMovie(result, params.id));
    };
    fetchApi();
  }, [result, params.id]);

  const similarMovieList = similarMovie.slice(0, 4).map((item, index) => {
    return (
      <div className="col-md-3 col-sm-6" key={index}>
        <div className="card">
          <NavLink
            onClick={() => window.scrollTo(0, 0)}
            to={`/${result}/${item.id}`}
          >
            <img className="img-fluid" src={item.poster} alt={item.title} />
          </NavLink>
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
            {result === 'tv' ? item.name : item.title}
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
            {item.rating === 0 || item.rating === 10
              ? '?'
              : item.rating.toFixed(2)}
          </span>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div className="row mt-3">
        <div className="col">
          <p style={{ color: '#5a606b', fontWeight: 'bolder' }}>ПОХОЖЕЕ</p>
        </div>
      </div>
      <div className="row mt-3">{similarMovieList}</div>
    </div>
  );
};

export default SimilarMovieList;
