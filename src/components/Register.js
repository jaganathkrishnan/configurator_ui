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
    return (<>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <div className='register-parent'>  
      <div className="register-container">
        <h2>Register</h2>
        <form>
        <div className='apartmentnum-container'>
        <i class="fa-solid fa-building"></i>
          <input type="text" onChange={(event) => this.handleChange(event,"name")} placeholder="Apartment Name" required />
      </div>  
      <div className='aoa-reg-container'>
          <input type="text" onChange={(event) => this.handleChange(event,"aoa_number")} placeholder="AOA number" required />
      </div>
      <div className='pass-reg-container'>
          <i class="fa-solid fa-key"></i>
          <input type="password" onChange={(event) => this.handleChange(event,"password")} placeholder="Password" required />
      </div>
      <div className='society-container'>
          <i class="fa-solid fa-envelope"></i>
          <input type="email" onChange={(event) => this.handleChange(event,"email")} placeholder="Society email" required />
      </div>    
          <button type="submit" onClick={this.handleSubmit}>Join Now</button>
        </form>
      </div>
     
    <div className='reg-info'>
      <h2>Create a free account</h2>
      <p>Explore insane workflow automation possibilities with Apartix! We provide an easy-to-use AI-powered workflow designer to set up workflows within minutes.</p>
        <div className='gap'>
          <ul>
            <li>Contact info:0909090909</li>
            <li>Email:apartix@mail.com</li>
            <li>Address:Bengaluru</li>
          </ul>
        </div>
    </div> 
    </div> 
    </>);
  }
}

export default Register;
