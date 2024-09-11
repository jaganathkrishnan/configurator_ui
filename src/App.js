import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import Home from './components/Home.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import ChatbotList from './components/chatbot_components/ChatbotList.js';
import WorkflowList from './components/workflow_components/WorkflowList.js';
import WorkflowForm from './components/workflow_components/WorkflowForm.js';
import './App.css';  // Import the CSS for global styles and the App component
import 'beautiful-react-diagrams/styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true, // Set to true for logged-in state
    };
  }

  render() {
    const { isLoggedIn } = this.state;

    return (
      <Router>
        <div className="App">
          <div className="navbar-container">
            <div className="logo-container">
              <Link to="/" className="logo">Logoplaceholder</Link>
            </div>
            <nav className="navbar">
              {isLoggedIn ? (
                <Link to="/" className="nav-link">Logout</Link> // Replace Home with Logout
              ) : (
                <Link to="/" className="nav-link">Home</Link>
              )}
              {!isLoggedIn && (
                <>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/register" className="nav-link">Register</Link>
                </>
              )}
            </nav>
          </div>
          <div className="content-wrapper">
            {isLoggedIn && (
              <div className="sidebar">
                <div className="sidebar-content">
                  <NavLink to="/chatbots" activeClassName="active-link">Chatbots</NavLink>
                  <NavLink to="/workflows" activeClassName="active-link">Workflows</NavLink>
                  <NavLink to="/user_management" activeClassName="active-link">User Management</NavLink>
                  <NavLink to="/society_details" activeClassName="active-link">Society Details</NavLink>
                </div>
              </div>
            )}
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<ChatbotList />} />
                <Route path="/chatbots" element={<ChatbotList />} />
                <Route path="/workflows/:workflowId" element={<WorkflowForm />} />
                <Route path="/workflows" element={<WorkflowList />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
