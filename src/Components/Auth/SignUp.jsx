import React from 'react';
import { Form, Button } from 'react-bootstrap';
import logo from '../../Img/logo_transparent.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../Context/AuthContext';
import { useState } from 'react';

const SignUP = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {signUp } = UserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <p className="text-center">
          <h3>Регистрация</h3>
        </p>
        <img style={{ height: '100px' }} src={logo} alt="logo" />
        <Form onSubmit={handleSubmit} className="w-50">
          <Form.Group>
            <Form.Label>Почта</Form.Label>
            <Form.Control
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Введите почту"
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Введите пароль"
            />
          </Form.Group>
          <div className="text-center">
            <Button style={{ backgroundColor: '#625FC9' }} type="submit">
              Регистрация
            </Button>
          </div>
          <div className="text-center mt-4">
            <NavLink
              style={{
                color: '#5A606B',
                fontSize: '14px',
                textDecoration: 'none',
              }}
              to="/signIn"
            >
              Есть аккаунт ? Войти!
            </NavLink>
          </div>
          <div className="text-center mt-4">
            <NavLink
              style={{
                color: '#5A606B',
                fontSize: '14px',
                textDecoration: 'none',
              }}
              to="/"
            >
              На главную
            </NavLink>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUP;
