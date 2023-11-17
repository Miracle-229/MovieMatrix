import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { fetchGenre, fetchMovieByGenre } from '../../API/API.js';
import style from './Style.module.scss';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import Header from '../Header/Header.jsx';
import back from '../../Img/back.jpg';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { UserAuth } from '../../Context/AuthContext.js';
import { db } from '../../API/Firebase.js';
import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';

const TopRate = (props) => {
  const { result } = props;
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [numMovies, setNumMovies] = useState(8);
  const [selectedIcon, setSelectedIcon] = useState([]);
  const [page, setPage] = useState(1);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [movies, setMovies] = useState([]);
  const [savedId, setSavedId] = useState([]);
  const { user } = UserAuth();

  const movieID = doc(db, 'users', `${user?.email}`);
  const saveShow = async (item) => {
    if (user?.email) {
      console.log(item.id, item.title, item.poster);
      const showsToSave = selectedIcon.includes(item.id)
        ? selectedIcon.filter((itemId) => itemId !== item.id)
        : [...selectedIcon, item.id];
      setSelectedIcon(showsToSave);
      await updateDoc(movieID, {
        [result]: arrayUnion({
          id: item.id,
          poster: item.poster,
          title: result === 'movie' ? item.title : item.name,
        }),
      });
    } else {
      alert('Зайдите пожалуйста для сохранения');
    }
  };
  const deleteShow = async (i) => {
    try {
      const itemType = i.title ? 'movie' : 'tv';
      const updatedSavedShows = savedId
        .filter((itemId) => itemId !== i.id || itemType !== result)
        .map((itemId) => {
          const item = movies.find((movie) => movie && movie.id === itemId);
          if (!item) {
            return null;
          }
          return {
            id: item.id,
            poster: item.poster,
            title: result === 'movie' ? item.title : item.name,
          };
        })
        .filter(Boolean);
      setSelectedIcon(updatedSavedShows.map((item) => item.id));
      await updateDoc(movieID, {
        [result]: updatedSavedShows,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
      const savedShows = doc.data()?.[result];
      const savedIds = savedShows?.map((show) => show.id);
      setSavedId(savedIds);
    });
  }, [user?.email]);

  useEffect(() => {
    const fetchAPI = async () => {
      setGenres(await fetchGenre(result));
      const data = await fetchMovieByGenre(result, selectedGenres, page);
      if (page === 1) {
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
    setMovies(await fetchMovieByGenre(result, newSelectedGenres));
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

  useEffect(() => {
    function handleScroll() {
      const windowHeight = document.documentElement.clientHeight;
      const scrollPosition = document.documentElement.scrollTop;
      const bottomPosition = scrollPosition + windowHeight;
      if (bottomPosition >= document.documentElement.scrollHeight) {
        setNumMovies(numMovies + 4);
        setPage(page + 1);
      }
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            {result === 'tv'
              ? item.name
                ? item.name.length > 18
                  ? `${item.name.slice(0, 17)}...`
                  : item.name
                : 'НЕИЗВЕСТНОЕ НАЗВАНИЕ'
              : item.title
              ? item.title.length > 18
                ? `${item.title.slice(0, 17)}...`
                : item.title
              : 'НЕИЗВЕСТНОЕ НАЗВАНИЕ'}
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
            <BsBookmark
              onClick={() => {
                alert('Войдите в систему для сохранения ');
              }}
              style={{ cursor: 'pointer' }}
            />
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
          <div className="row mt-3">{movieList}</div>
        </div>
      </div>
    </div>
  );
};

export default TopRate;