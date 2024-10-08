import React, { Component } from 'react';
import './../styling/Login.css';
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aoa_number: "",
      password: "",
      email: ""
    };
  }

  handleChange(event, stateKey) {
    const { value } = event.target;
    this.setState({ [stateKey]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { password, email, aoa_number } = this.state;
    try {
      axios.post('http://localhost:1002/login', {
        aoa_number,
        user_login: { password, email }
      }).then((response) => {
        localStorage.setItem('apartix_session_id', response.data.session_id);
        window.location.href = `${window.location.origin}/home`;
      });
    } catch (error) {
      localStorage.setItem('apartix_session_id', "remove this later");
      window.location.href = `${window.location.origin}/home`;
      console.error('Login error:', error);
    }
  }

  render() {
    return (
      <div className='login-parent'>
        <div className="login-container">
          <h2>Login</h2>
          <form>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <div className='aoa-input-container'>
              <i className="fa-solid fa-building"></i>
              <input type="text" onChange={(event) => this.handleChange(event, "aoa_number")} placeholder="AOA Number" required />
            </div>
            <div className='email-input-container'>
              <i className="fa-solid fa-user"></i>
              <input type="email" onChange={(event) => this.handleChange(event, "email")} placeholder="Email" required />
            </div>
            <div className='pass-input-container'>
              <i className="fa-solid fa-key"></i>
              <input type="password" onChange={(event) => this.handleChange(event, "password")} placeholder="Password" required />
            </div>
            <button type="submit" onClick={this.handleSubmit}>Login</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
