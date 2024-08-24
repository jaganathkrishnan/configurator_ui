import React, { Component } from 'react';
import './../styling/Login.css'
import axios from 'axios';

class Login extends Component {

  constructor(props){
    super(props);
    this.state = {
      aoa_number: "",
      password: "",
      //TO-DO: Add email pattern validation
      email: ""
    }
  }

  handleChange(event, stateKey) {
    const { value } = event.target;

    this.setState({
      [stateKey]: value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let { password, email, aoa_number } = this.state
    try {
      axios.post('http://localhost:1002/login', {
        aoa_number,
        user_login: {
          password,
          email
        }
      }).then((response) => {
        localStorage.setItem('apartix_session_id', response.data.session_id );
        window.location.href = `${window.location.origin}/home`
      })

    } catch (error) {
      localStorage.setItem('apartix_session_id', "remove this later" );
      window.location.href = `${window.location.origin}/home`
      console.error('Login error:', error);
    }
  }


  render() {
    return (
      <div className="login-container">
        <h2>Login</h2>
        <form>
          <input type="aoa_number" onChange={(event) => this.handleChange(event,"aoa_number")} placeholder="AOA Number" required />
          <input type="email" onChange={(event) => this.handleChange(event,"email")} placeholder="Email" required />
          <input type="password" onChange={(event) => this.handleChange(event,"password")} placeholder="Password" required />
          <button type="submit" onClick={this.handleSubmit}>Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
