import React, { useState, useRef } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { loadOptions } from '../../API/API';
import { UserAuth } from '../../Context/AuthContext';
import { BiUser, BiCameraMovie } from 'react-icons/bi';
import { BsDoorClosedFill } from 'react-icons/bs';
import logo from '../../Img/logo_transparent.png';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Style.css';

const Header = () => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();
  const setTypeaheadRef = useRef();
  const { user, logOut } = UserAuth();

  const loadMovies = async (query) => {
    await loadOptions(query, setOptions);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const onChange = (selectedOption) => {
    setInputValue(selectedOption[0]?.label || '');
    if (selectedOption[0]?.value) {
      if (selectedOption[0]?.type === 'movie') {
        navigate(`/movie/${selectedOption[0].value}`);
      } else if (selectedOption[0]?.type === 'tv') {
        navigate(`/tv/${selectedOption[0].value}`);
      }
      setTypeaheadRef.current.clear();
    }
  };
  const renderOption = ({ label, posterPath, rating, year, type }) => (
    <div className="render-option" onClick={() => window.scrollTo(0, 0)}>
      {posterPath && (
        <img
          src={`https://image.tmdb.org/t/p/w92${posterPath}`}
          alt={`${label} poster`}
          style={{ marginRight: '10px', height: '85px' }}
        />
      )}
      <div className="render-option-inf">
        <div>{label}</div>
        <div style={{ display: 'flex', marginTop: '10px' }}>
          <span style={{ color: '#5A606B', padding: '3px 5px' }}>
            {year ? year.slice(0, 4) : ''}
          </span>{' '}
          <span style={{ color: '#5A606B', padding: '3px 5px' }}>
            {type === 'movie' ? 'фильм' : 'сериал'}
          </span>
          <span
            style={{
              color: 'white',
              marginLeft: '20px',
              backgroundColor:
                rating < 4 ? 'black' : rating < 7 ? '#2A2A2A' : '#625FC9',
              padding: '3px 5px',
            }}
          >
            {rating ? rating.toFixed(2) : ''}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Navbar sticky="top" bg="dark" variant={'dark'} expand="lg">
      <NavLink onClick={() => window.scrollTo(0, 0)} to={`/`}>
        <img className="logo" src={logo} alt="" />
      </NavLink>
      <Nav className="me-auto">
        <AsyncTypeahead
          ref={setTypeaheadRef}
          inputProps={{
            style: {
              backgroundColor: '#151C26',
              color: 'white',
            },
          }}
          id="movie-search"
          labelKey="label"
          inputValue={inputValue}
          onSearch={loadMovies}
          options={options}
          onChange={onChange}
          placeholder="Поиск фильма"
          renderMenuItemChildren={renderOption}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              window.scrollTo(0, 0);
            }
          }}
          maxLength={3}
        />
      </Nav>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <NavDropdown title="Обзор" id="navbarScrollingDropdown">
          <NavDropdown.Item>
            <NavLink
              style={{ color: 'gray', fontWeight: 'bold' }}
              onClick={() => window.scrollTo(0, 0)}
              to={`/movie_rate`}
            >
              Фильмы
            </NavLink>
          </NavDropdown.Item>
          <NavDropdown.Item href="#action4">
            <NavLink
              style={{ color: 'gray', fontWeight: 'bold' }}
              onClick={() => window.scrollTo(0, 0)}
              to={`/tv_rate`}
            >
              Сериалы
            </NavLink>
          </NavDropdown.Item>
        </NavDropdown>
        {user?.email ? (
          <NavDropdown
            title={<BiUser size={30} />}
            id="navbarScrollingDropdown"
          >
            <NavDropdown.Item>
              <NavLink
                style={{ color: 'gray' }}
                onClick={() => window.scrollTo(0, 0)}
                to={`/account_movies`}
              >
                <BiCameraMovie style={{ marginBottom: '3px' }} /> Фильмы
              </NavLink>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <NavLink
                style={{ color: 'gray' }}
                onClick={() => window.scrollTo(0, 0)}
                to={`/account_tv`}
              >
                <BiCameraMovie style={{ marginBottom: '3px' }} /> Сериалы
              </NavLink>
            </NavDropdown.Item>
            <NavDropdown.Item href="#action4">
              <NavLink
                style={{ color: 'gray' }}
                onClick={handleLogout}
                to={`/`}
              >
                <BsDoorClosedFill style={{ marginBottom: '3px' }} /> Выход
              </NavLink>
            </NavDropdown.Item>
          </NavDropdown>
        ) : (
          <NavLink
            style={{ color: 'gray' }}
            onClick={() => window.scrollTo(0, 0)}
            to={`/signIn`}
          >
            <BsDoorClosedFill size={30} />
          </NavLink>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
