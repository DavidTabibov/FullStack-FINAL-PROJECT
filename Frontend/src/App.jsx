import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./hooks/useAuth";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import AppRoutes from "./routes/AppRoutes";
import ToastContainer from "./components/common/Toast/ToastContainer";
import ScrollToTop from "./components/common/ScrollToTop";
import ScrollToTopOnRouteChange from "./components/common/ScrollToTopOnRouteChange";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
              <ScrollToTopOnRouteChange />
              <AppRoutes />
              <ToastContainer />
              <ScrollToTop />
            </Router>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
