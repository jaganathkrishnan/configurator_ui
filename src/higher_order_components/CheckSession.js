import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';

const withSessionCheck = (WrappedComponent) => {
  class SessionCheck extends Component {
    componentDidMount() {
      if (!localStorage.getItem('apartix_session_id')) {
        // Redirect or handle the absence of session_id
        // For example, redirect to login page
        window.location.href = `${window.location.origin}/login`
      }
    }

    render() {
      return localStorage.getItem('session_id') ? <WrappedComponent {...this.props} /> : null;
    }
  };

  // return withRouter(SessionCheck);
};

export default withSessionCheck;
