import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  // const [user, setUser] = useState(null);

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
      localStorage.setItem('user', response.config.data);
      console.log(response);
    } catch (error) {
      console.error('Error during sign up:', error);
    }
  }

  async function signIn(login, password) {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/auth/login`,
        {
          login,
          password,
        }
      );
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', response.config.data);
      console.log(response);
    } catch (error) {
      console.error('Error during sign in:', error);
      // You can also handle the error in a way that suits your application
    }
  }

  async function logOut() {
    try {
      await axios.post('http://localhost:8080/api/auth/logout');
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ signUp, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function UserAuth() {
  return useContext(AuthContext);
}
