import React from 'react';

const HomePage = () => {
  return (
    <div className="container">
      <header>
        <nav className="navbar">
          <ul className="navbar-items">
            <li><a href="/">Home</a></li>
            <li><a href="/login-register">Login/Register</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Welcome to My Apartment App</h1>
            <p>Find the perfect apartment for your needs</p>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2023 My Apartment App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
