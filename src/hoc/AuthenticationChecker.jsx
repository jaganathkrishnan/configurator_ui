import React from 'react';
import { encryptString, logoutSession } from './../utils/Utils.jsx';
import HomePage from '../components/defaultPages/Homepage.jsx';

const authenticationChecker = (Component) => {
  return class extends React.Component {
    checkIfLoggedIn = () => {
      return localStorage.getItem(encryptString("aptx-configurator-session-token"))
    }

    renderNavBar = () => {
      return (
        <header>
          <nav className="navbar">
            <ul className="navbar-items">
              <li><a href="/">Home</a></li>
              <li><a href="/apps">Apps</a></li>
              <li><a onClick={logoutSession}>Logout</a></li>
            </ul>
          </nav>
        </header>
      );
    }

    render() {
      return (!this.checkIfLoggedIn() ? (
        <HomePage />
        ) : (
          <React.Fragment>
            {this.renderNavBar()}
            {<Component {...this.props} />}
          </React.Fragment>
        )
      )
    }
  }
}

export default authenticationChecker;
