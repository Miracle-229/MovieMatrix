import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { fetchMovies } from '../../../API/API.js';

const ContentCarousel = ({ result }) => {
  const [nowPlaying, setNowPlaying] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      setNowPlaying(await fetchMovies(result));
    };
    fetchAPI();
  }, [result]);

  const movies = nowPlaying.slice(0, 5).map((item, index) => {
    return (
      <Carousel.Item>
        <div style={{ height: "80vh", width: '100%' }} >
          <div
            className="carousel-center"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              style={{ height: "100vh", objectFit: 'cover',width:"100%" }}
              src={item.backPoster}
              alt={item.title}
            />
          </div>
        </div>
        <div
          className="carousel-caption"
          style={{
            textAlign: 'center',
            fontSize: 35,
            backgroundColor: 'rgba(21,28,38,0.6)',
          }}
        >
          {result === 'movie/now_playing' ? item.title : item.name}
        </div>
      </Carousel.Item>
    );
  });

  return (
    <div>
      <div style={{marginRight:"0px",marginLeft:"0px"}} className="row">
        <div style={{padding:"0px"}} className="col">
          <Carousel
            prevLabel={null}
            nextLabel={null}
            indicators={false}
            interval={3000}
          >
            {movies}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default ContentCarousel;
