import { useState, useEffect } from 'react';
import ContentCarousel from './Templates/ContentCarousel';
import NowPlaying from './Templates/NowPlaying';
import TrendingPersons from './Templates/TrendingPersons';
import TopRated from './Templates/TopRated';
import Header from './../Header/Header';
import back from '../../Img/back.jpg';
import logo from '../../Img/logo_transparent.png'

function Home() {
  const [result, setResult] = useState('movie/now_playing');

  useEffect(() => {
    const interval = setInterval(() => {
      setResult(
        result === 'movie/now_playing' ? 'tv/airing_today' : 'movie/now_playing'
      );
    }, 30000);
    return () => clearInterval(interval);
  }, [result]);

  return (
    <div style={{ backgroundImage: `url(${back})` }}>
      <Header />
      <ContentCarousel result={result} />
      <div className="container">
        <NowPlaying result={'movie/now_playing'} />
        {/* <NowPlaying result={'tv/airing_today'} /> */}
        <TrendingPersons />
        <TopRated result={'movie'} />
        {/* <TopRated result={'tv'} /> */}
        <hr className="mt-5" style={{ borderTop: '1px solid #5a606b' }} />
        <div className="row mt-3">
          <div className="col-md-8 col-sm-6" style={{ color: '#5a606b' }}>
            <img src={logo} style={{height:"50px"}} alt='logo' />
            <h3>MOVIEMATRIX</h3>
            <p style={{fontWeight:"bolder"}}>Все сериалы и фильмы в одной матрице на MovieMatrix!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
