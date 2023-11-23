import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchGenre, fetchMovieByGenre } from '../../API/API.js';
import style from './Style.module.scss';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import Header from '../Header/Header.jsx';
import back from '../../Img/back.jpg';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { UserAuth } from '../../Context/AuthContext.js';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';

const TopRate = (props) => {
  const { result } = props;
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [numMovies, setNumMovies] = useState(8);
  // const [selectedIcon, setSelectedIcon] = useState([]);
  const [page, setPage] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [movies, setMovies] = useState([]);
  const [savedId, setSavedId] = useState([]);
  const [objectMark, setObjectMark] = useState([]);
  const access = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');

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

  const prevPropsBook = useRef();
  useEffect(() => {
    if (
      prevPropsBook.current &&
      prevPropsBook.current.user?.login === user?.login
    ) {
      return;
    }
    prevPropsBook.current = { user };

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
  }, [user?.email, access]);

  const prevProps = useRef();
  useEffect(() => {
    if (prevProps.current && prevProps.current.page === page) {
      return;
    }
    prevProps.current = { page };

    const fetchAPI = async () => {
      setGenres(await fetchGenre(result));
      console.log('genre');
      const data = await fetchMovieByGenre(selectedGenres, page);
      if (page === 0) {
        setMovies(data);
      } else setMovies((movies) => [...movies, ...data]);
    };
    fetchAPI();
  }, [result, selectedGenres, page, numMovies]);

  const genreClick = async (genre_id) => {
    let newSelectedGenres;
    if (selectedGenres.includes(genre_id)) {
      newSelectedGenres = selectedGenres.filter((id) => id !== genre_id);
    } else {
      newSelectedGenres = [...selectedGenres, genre_id];
    }
    setSelectedGenres(newSelectedGenres);
    setMovies(await fetchMovieByGenre(newSelectedGenres));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    function handleScroll() {
      const scrollPosition = document.documentElement.scrollTop;
      if (scrollPosition > 2500) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    }
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [numMovies, page]);

  const scroll = () => {
    setPage(page + 1);
    setNumMovies(numMovies + 4);
  };

  const genreList = genres.map((item, index) => {
    const active = selectedGenres.includes(item.id);
    return (
      <li className="list-inline-item" key={index}>
        <button
          style={{}}
          className={`btn btn-outline-info ${
            active ? 'bg-primary text-white' : ''
          }`}
          onClick={() => {
            genreClick(item.id);
          }}
        >
          {item.name}
        </button>
      </li>
    );
  });

  const movieList = movies.slice(0, numMovies).map((item, index) => {
    return (
      <div className="col-md-3 col-sm-4 col-6 mt-4" key={index}>
        <div className={style.card}>
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
            {item?.title?.length > 18
              ? `${item.title.slice(0, 17)}...`
              : item?.title || 'НЕИЗВЕСТНОЕ НАЗВАНИЕ'}
          </p>
          {user ? (
            <div style={{ margin: '0px' }}>
              {savedId && savedId.includes(item.id) ? (
                <BsBookmarkFill
                  onClick={() => deleteShow(item)}
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <BsBookmark
                  onClick={() => saveShow(item)}
                  style={{ cursor: 'pointer' }}
                />
              )}
            </div>
          ) : (
            <BsBookmark style={{ cursor: 'pointer', display: 'none' }} />
          )}
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
            ~{item.rating.toFixed(1)}
          </span>
        </div>
      </div>
    );
  });

  return (
    <div style={{ backgroundImage: `url(${back})` }}>
      <Header />
      <div>
        {showScrollButton && (
          <button style={{ color: 'gray' }}>
            <AiOutlineArrowUp
              style={{
                position: 'fixed',
                bottom: '50px',
                right: '40px',
                padding: '10px',
                fontSize: '65px',
                cursor: 'pointer',
              }}
              className="scroll-to-top"
              onClick={scrollToTop}
            />
          </button>
        )}
        <div className="container">
          <div className={style.carousel}>
            <div className="row mt-3">
              <div className="col">
                <ul className="list-inline">{genreList}</ul>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <InfiniteScroll
              dataLength={movies.length}
              next={() => scroll()}
              hasMore={true}
              className="row mt-3"
            >
              {movieList}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopRate;
