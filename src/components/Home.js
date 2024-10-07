import React, { Component } from 'react';
import './../styling/Home.css'

class Home extends Component {
  render() {
    return (<>
    <div className='parent-container'>
      <div className="home-container">
        <h1>Apartix engineering</h1> 
        <p>Create forms, set up workflows, and automate any business process on the go! Apartix – the best workflow automation software, lets you set permissions, assign rule-based conditions, and go live within minutes.(this is placeholder)
        </p>
      </div>
      <img className='image' alt='placeholder' src='https://www.cflowapps.com/wp-content/uploads/2023/02/bpmn-notation-workflow.jpg'></img>
    </div>
    </>);
  }
}

export default Home;
