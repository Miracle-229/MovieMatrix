import React, { useState, useEffect } from 'react';
import { fetchMovieDetail, fetchMovieVideos } from '../../../API/API.js';
import { Modal } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { useMatch } from 'react-router-dom';
import { AiFillPlayCircle } from 'react-icons/ai';
import img from '../../../Img/f74f39dbc9b60954c926d72401adf1cc.jpg';

const MoviePlayerMedia = (props) => {
  const { result } = props;
  const match = useMatch(`/${result}/:id`);
  let params = match.params;
  const [detail, setDetail] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [video, setVideo] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      setDetail(await fetchMovieDetail(result, params.id));
      setVideo(await fetchMovieVideos(result, params.id));
    };
    fetchApi();
  }, [result, params.id]);

  const MoviePlayerMedia = (props) => {
    let tvURL = 'https://www.youtube.com/watch?v=';
    if (result === 'tv' && detail.id === 1396) {
      tvURL = 'https://www.youtube.com/watch?v=I5CUMnUM91Q';
    } else if (result === 'tv' && detail.id === 37854) {
      tvURL = 'https://www.youtube.com/watch?v=gWo12TtN9Kk';
    } else if (result === 'movie' && detail.id === 316029) {
      tvURL = 'https://www.youtube.com/watch?v=oxMisiLx9B4';
    } else if (result === 'tv' && detail.id === 31910) {
      tvURL = 'https://www.youtube.com/watch?v=6wmRQUc96yM';
    } else if (result === 'tv' && detail.id === 46260) {
      tvURL = 'https://www.youtube.com/watch?v=ihgWUo6tvJQ';
    } else if (result === 'tv' && detail.id === 131041) {
      tvURL = 'https://www.youtube.com/watch?v=7XNBRr9xmZc';
    } else if (result === 'movie' && detail.id === 525875) {
      tvURL = 'https://www.youtube.com/watch?v=OaEagjcNGTo';
    } else if (result === 'tv' && detail.id === 94295) {
      //Мини-футбол для мальчиков
      tvURL = 'https://www.youtube.com/watch?v=XGHkonnM_N8';
    } else if (result === 'tv' && detail.id === 30981) {
      //Монстр (аниме)
      tvURL = 'https://www.youtube.com/watch?v=e5hc_0ZeU_M';
    } else if (result === 'movie' && detail.id === 8467) {
      tvURL = 'https://youtu.be/iassUSI_qJ0?t=1286';
    } else if (result === 'movie' && detail.id === 361931) {
      tvURL = 'https://www.youtube.com/watch?v=Fel-OaoTE8w';
    }
    else if (result === 'tv' && detail.id === 30984) {
      tvURL = 'https://www.youtube.com/watch?v=Z3lO6d4aZmM';
    }

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header
          style={{ backgroundColor: '#403D70', border: 'none' }}
          closeButton
        >
          <Modal.Title
            id="contained-modal-title-vcenter"
            style={{ color: 'white', fontWeight: 'bolder' }}
          >
            {result === 'movie' ? detail.title : detail.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#000000', padding: '0px' }}>
          {video?.key ? (
            <ReactPlayer
              style={{ padding: '0px' }}
              className="container-fluid"
              url={tvURL + (video?.key || '')}
              playing
              width="100%"
              controls={true}
            ></ReactPlayer>
          ) : (
            <p>Видео не найдено</p>
          )}
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div>
      <div style={{ marginRight: '0px', marginLeft: '0px' }} className="row">
        <MoviePlayerMedia
          show={isOpen}
          onHide={() => {
            setIsOpen(false);
          }}
        ></MoviePlayerMedia>
        <div
          className="col text-center"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0px',
          }}
        >
          <img
            style={{
              height: '75vh',
              objectFit: 'cover',
              width: '100%',
              opacity: '1',
            }}
            src={
              detail.backdrop_path
                ? `https://image.tmdb.org/t/p/original/${detail.backdrop_path}`
                : img
            }
            alt={detail.title}
            className="img-fluid"
          />
          <AiFillPlayCircle
            onClick={() => setIsOpen(true)}
            style={{
              fontSize: '95px',
              position: 'absolute',
              cursor: 'pointer',
            }}
          ></AiFillPlayCircle>
          <div
            className="carousel-caption"
            style={{
              textAlign: 'center',
              fontSize: 35,
              backgroundColor: 'rgba(21,28,38,0.6)',
            }}
          >
            {result === 'tv' ? detail.name : detail.title}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePlayerMedia;
