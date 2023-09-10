import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { encryptString } from './../../utils/Utils.jsx';

const LoginRegister = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [aoaNumber, setaoaNumber] = useState('');
  const [password, setPassword] = useState('');

  const checkLoginFromBackend = () => {
    //TO-DO: hardcoding as of now, need to hit backend to authenticate
    return {
      status: true,
      token: "test_token"
    };
  }

  const handleLogin = () => {
    const response = checkLoginFromBackend();
    if (response.status) {
      console.log('Logging in...');
      addToLocalStorage(response.token);
      setIsLoggedIn(true);
    } else {
      alert(response.message);
    }
  };

  const registerToBackend = () => {
    //TO-DO: hardcoding as of now, need to hit backend to authenticate
    return {
      status: true,
      token: "test_token"
    }
  }

  const addToLocalStorage = (token) => {
    localStorage.setItem(encryptString("aptx-configurator-session-token"), token)
  }

  const handleRegister = () => {
    // Handle register logic here
    const response = registerToBackend();
    if (response.status) {
      console.log('Regsitering...');
      addToLocalStorage(response.token);
      setIsLoggedIn(true);
    } else {
      alert(response.message);
    }
  };

  const navigate = useNavigate();

  console.log(`isLoggedIn - ${isLoggedIn}`)
  return (
    <React.Fragment>
    {
      isLoggedIn ? (navigate("/")) : (
      <Container>
        <Row className="justify-content-center mt-5">
          <Col xs={6}>
            <h1>Welcome to Our Website</h1>
            <Form>
              <Form.Group controlId="formBasicaoaNumber">
                <Form.Label>Apartment Owners Association (AOA) Registration Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Apartment Owners Association (AOA) Registration Number"
                  value={aoaNumber}
                  onChange={(e) => setaoaNumber(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" onClick={handleLogin}>
                Login
              </Button>{' '}
              <Button variant="secondary" onClick={handleRegister}>
                Register
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    )}
    </React.Fragment>
  );
};

export default LoginRegister;
