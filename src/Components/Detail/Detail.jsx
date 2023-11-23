import PlayerMedia from './Templates/PlayerMedia.jsx';
import CastList from './Templates/CastList.jsx';
import GenreOverviewList from './Templates/GenreOverviewList.jsx';
import SimilarMovieList from './Templates/SimilarList.jsx';
import Header from '../Header/Header.jsx';
import back from '../../Img/back.jpg'

function Detail(props) {
  const { result } = props;
  return (
    <div style={{ backgroundImage:`url(${back})`}}>
      <Header />
      <PlayerMedia result={result} />
      <div className="container">
        
        <GenreOverviewList result={result} />
        <CastList result={result} />
        {/* <SimilarMovieList result={result} /> */}

        <hr className="mt-5" style={{ borderTop: '1px solid #5a606b' }}></hr>

        <div className="row mt-3 mb-5">
          <div className="col-md-8 col-sm-6" style={{ color: '#5a606b' }}>
            <h3>ABOUT ME</h3>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi
              error earum perspiciatis praesentium sint ipsum provident
              blanditiis pariatur necessitatibus voluptas, cum, atque iste
              eligendi autem, culpa cupiditate placeat facilis repellat.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus,
              perspiciatis? Numquam, enim illo voluptatum neque facere aut sed
              ut dolore nihil? Nulla sit, recusandae ea tenetur rerum deserunt
              sequi earum?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
