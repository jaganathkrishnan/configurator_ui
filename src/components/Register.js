import React, { Component } from 'react';
import './../styling/Register.css'
import axios from 'axios';

class Register extends Component {

  constructor(props){
    super(props);
    this.state = {
      name: "",
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
    let { name, aoa_number, password, email } = this.state
    let db_prefix = `${aoa_number}_${name}_prod`
    try {
      axios.post('http://localhost:3001/societies', {"society": {
        name,
        aoa_number,
        password,
        db_prefix,
        email
      }}).then((response) => {
        //TO-DO: Add loaders and flash messages
        if (response.ok) {
          window.location.href = `${window.location.origin}/login`
        } else {
          throw response.json()
        }
      })

    } catch (error) {
      console.error('Registration error:', error);
    }
  }

  render() {
    return (
      <div className="register-container">
        <h2>Register</h2>
        <form>
          <input type="text" onChange={(event) => this.handleChange(event,"name")} placeholder="Apartment Name" required />
          <input type="text" onChange={(event) => this.handleChange(event,"aoa_number")} placeholder="AOA number" required />
          <input type="password" onChange={(event) => this.handleChange(event,"password")} placeholder="Password" required />
          <input type="email" onChange={(event) => this.handleChange(event,"email")} placeholder="Society email" required />
          <button type="submit" onClick={this.handleSubmit}>Join Now</button>
        </form>
      </div>
    );
  }
}

export default Register;
