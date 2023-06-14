import React, { useState, useEffect } from 'react';
import { fetchCasts } from '../../../API/API.js';
import { useMatch } from 'react-router-dom';

const CastList = (props) => {
  const { result } = props;
  const match = useMatch(`/${result}/:id`);
  let params = match.params;
  const [casts, setCasts] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      setCasts(await fetchCasts(result,params.id));
    };
    fetchApi();
  }, [result,params.id]);

  const castList = casts.slice(0, 4).map((item, index) => {
    return (
      <div className="col-md-3 text-center" key={index}>
        <img
          style={{maxHeight:"300px"}}
          className="img-fluid rounded-circle mx-auto d-block"
          src={item.profileImg}
          alt={item.name}
        ></img>
        <p className="font-weight-bold text-center">{item.name}</p>
        <p
          className="font-weight-light text-center"
          style={{ color: '#5a606b' }}
        >
          {item.character}
        </p>
      </div>
    );
  });

  return (
    <div>
      <div className="row mt-3">
        <div className="col">
          <p style={{ color: '#5a606b', fontWeight: 'bolder' }}>CASTS</p>
        </div>
      </div>
      <div className="row mt-3">{castList}</div>
    </div>
  );
};

export default CastList;
