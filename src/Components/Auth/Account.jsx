import React, { useState, useEffect } from 'react';
import { UserAuth } from '../../Context/AuthContext.js';
import { BsBookmarkFill } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import style from './Style.module.scss';
import back from '../../Img/back.jpg';

const Account = (props) => {
  const { result } = props;
  const [movies, setMovies] = useState([]);
  const local = localStorage.getItem('user');

  const user = JSON.parse(local);

  const movieList = movies ? (
    movies.map((item, index) => {
      return (
        <div className="col-md-2 col-sm-4 col-4 mt-4" key={index}>
          <div className={style.carousel}>
            <div className="card">
              <NavLink
                onClick={() => window.scrollTo(0, 0)}
                to={`/${result}/${item.id}`}
              >
                <img src={item.poster} alt={item.title} className="img-fluid" />
              </NavLink>
            </div>
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
              {item.title.length > 14
                ? `${item.title.slice(0, 14)}...`
                : item.title}
            </p>
            <p style={{ margin: '0px' }}>
              <BsBookmarkFill style={{ cursor: 'pointer' }} />
            </p>
          </div>
        </div>
      );
    })
  ) : (
    <div style={{ display: 'flex' }}>
      <p className="text-centre">Вы ещё ничего не выбрали</p>
    </div>
  );
  return (
    <div>
      <Header />
      <div style={{ backgroundImage: `url(${back})` }}>
        <div className="container">
          <p className="text-center">{user.login}</p>
          <div className="row mt-3">{movieList}</div>
        </div>
      </div>
    </div>
  );
};

export default Account;
