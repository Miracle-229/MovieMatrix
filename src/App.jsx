import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home';
import Detail from './Components/Detail/Detail';
import { AuthContextProvider } from './Context/AuthContext';
import SignUp from './Components/Auth/SignUp';
import SignIn from './Components/Auth/SignIn';
import ProtectRouteAccount from './Context/ProtectRouteAccount';
import ProtectRouteLogin from './Context/ProtectRouteLogin';
import TopRate from './Components/TopRate/TopRate';
import Account from './Components/Auth/Account';

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={Home} />
          <Route
            path="/movie/:id"
            Component={(props) => <Detail {...props} result="movie" />}
          />
          <Route
            path="/tv/:id"
            Component={(props) => <Detail {...props} result="tv" />}
          />
          <Route
            path="/movie_rate"
            Component={(props) => <TopRate {...props} result="movie" />}
          />
          <Route
            path="/tv_rate"
            Component={(props) => <TopRate {...props} result="tv" />}
          />
          <Route
            path="/signUp"
            element={
              <ProtectRouteLogin>
                <SignUp />
              </ProtectRouteLogin>
            }
          />
          <Route
            path="/signIn"
            element={
              <ProtectRouteLogin>
                <SignIn />
              </ProtectRouteLogin>
            }
          />
          <Route
            path="/account_movies"
            Component={(props) => (
              <ProtectRouteAccount>
                <Account {...props} result="movie" />
              </ProtectRouteAccount>
            )}
          />
          <Route
            path="/account_tv"
            Component={(props) => (
              <ProtectRouteAccount>
                <Account {...props} result="tv" />
              </ProtectRouteAccount>
            )}
          />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
