import React from "react";
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
