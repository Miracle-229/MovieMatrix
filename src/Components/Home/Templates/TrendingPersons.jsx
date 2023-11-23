import React, { useState, useEffect } from 'react';
import { fetchPersons } from '../../../API/API.js';
import style from './Style.module.scss';

const TrendingPersons = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      setPersons(await fetchPersons());
    };
    fetchAPI();
  }, []);

  const trendingPersons = persons.slice(0, 4).map((item, index) => {
    return (
      <div className="col-md-3 text-center" key={index}>
        <img
          className="img-fluid rounded-circle mx-auto d-block"
          src={item.profileImg}
          alt={item.name}
        />
        <p className="font-weight-bold text-center">{item.name}</p>
      </div>
    );
  });

  return (
    <div>
      <div className={style.carousel}>
        <div className="row mt-3">
          <div className="col">
            <p className="font-weight-bold" style={{ color: '#5a606b' }}>
            ПОПУЛЯРНЫЕ ЛЮДИ НА ЭТОЙ НЕДЕЛЕ
            </p>
          </div>
        </div>
      </div>
      <div className="row mt-3">{trendingPersons}</div>
    </div>
  );
};

export default TrendingPersons;
