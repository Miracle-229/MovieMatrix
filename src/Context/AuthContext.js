import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  async function signUp(login, email, password) {
    const response = await axios.post('http://localhost:8080/api/auth/signup', {
      login,
      email,
      password,
    });
    setUser(response.data.user);
  }

  async function logIn(email, password) {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      email,
      password,
    });
    setUser(response.data.user);
  }

  async function logOut() {
    await axios.post('http://localhost:8080/api/auth/logout');
    setUser(null);
  }

  // useEffect(() => {
  //   const checkUser = async () => {
  //     const response = await axios.get('localhost:8080/api/auth/user');
  //     setUser(response.data.user);
  //   };

  //   checkUser();
  // }, []);

  return (
    <AuthContext.Provider value={{ signUp, logIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function UserAuth() {
  return useContext(AuthContext);
}
