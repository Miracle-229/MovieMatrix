import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  async function signUp(login, email, password) {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/signup',
        {
          login,
          email,
          password,
        }
      );
      setUser(JSON.parse(response.config.data));
    } catch (error) {
      console.error('Error during sign up:', error);
      // You can also handle the error in a way that suits your application
    }
  }

  async function signIn(login, password) {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        {
          login,
          password,
        }
      );
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      console.log(response);
      setUser(response);
    } catch (error) {
      console.error('Error during sign in:', error);
      // You can also handle the error in a way that suits your application
    }
  }

  async function logOut() {
    try {
      await axios.post('http://localhost:8080/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // You can also handle the error in a way that suits your application
    }
  }


  return (
    <AuthContext.Provider value={{ signUp, signIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function UserAuth() {
  return useContext(AuthContext);
}
