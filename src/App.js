import LoginRegister from './components/defaultPages/LoginRegisterPage.jsx'
import SocietyHomePage from './components/SocietyHomePage.jsx'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import './App.css';
import React from 'react';
import Apps from './components/Apps.jsx'

const router = createBrowserRouter([
    {
      path: "/login-register",
      element: <LoginRegister />
    },
    {
      path: "/apps",
      element: <Apps />
    }, {
      path: "/",
      element: <SocietyHomePage />
    },
  ]
);

function App() {
  return(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
