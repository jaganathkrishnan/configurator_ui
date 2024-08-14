import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import Sidebar from 'react-sidebar';

import Home from './components/Home.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import ChatbotList from './components/chatbot_components/ChatbotList.js';
import WorkflowList from './components/workflow_components/WorkflowList.js';
import WorkflowForm from './components/workflow_components/WorkflowForm.js'
import Button from 'devextreme-react/button';
import './App.css';  // Import the CSS for global styles and the App component
import 'beautiful-react-diagrams/styles.css';
import { useParams } from 'react-router-dom'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false,
    };
  }

  componentDidMount() {
    // Select the dx-license element
    const licenseElement = document.querySelector('dx-license');
    if (licenseElement) {
      // Hide the element
      licenseElement.style.display = 'none';
    }
  }

  onSetSidebarOpen = (open) => {
    this.setState({ sidebarOpen: open });
  };

  renderMenuButton = () => {
    const localStorageToken = localStorage.getItem('apartix_session_id')
    return (localStorageToken && <Button className="menu-button" onClick={() => this.onSetSidebarOpen(true)}>Menu</Button>)
  }

  render() {
    const sidebarContent = (
      <div className="sidebar-content">
        <NavLink to="/chatbots" activeClassName="active-link">
          Chatbots
        </NavLink>
        <NavLink to="/workflows" activeClassName="active-link">
          Workflows
        </NavLink>
        <NavLink to="/user_management" activeClassName="active-link">
          User Management
        </NavLink>
        <NavLink to="/society_details" activeClassName="active-link">
          Society Details
        </NavLink>
      </div>)
    return (
      <Router>
        <Sidebar
          sidebar={sidebarContent}
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
          styles={{ sidebar: { background: "white", width: "250px" } }}
        >
          <div className="App">
            <nav className="navbar">
              <Link to="/" className="nav-link">Home</Link>
              {
                localStorage.getItem('apartix_session_id') ? "" : <Link to="/login" className="nav-link">Login</Link>
              }
              <Link to="/register" className="nav-link">Register</Link>
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<ChatbotList renderMenuButton={this.renderMenuButton}/>} />
              <Route path="/chatbots" element={<Login />} />
              <Route path="/workflows/:workflowId" element={
                <WorkflowForm renderMenuButton={this.renderMenuButton}/>
              } />
              <Route path="/workflows" element={<WorkflowList renderMenuButton={this.renderMenuButton}/>} />
              {/* <Route path="/user_management" element={<UserManagement />} /> */}
              {/* <Route path="/society_details" element={<SocietyDetails />} /> */}
            </Routes>
          </div>
        </Sidebar>
      </Router>
    );
  }
}

export default App;
