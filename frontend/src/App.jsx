import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Flash } from './components/Flash';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ListingsIndex } from './pages/ListingsIndex';
import { ShowListing } from './pages/ShowListing';
import { NewListing } from './pages/NewListing';
import { EditListing } from './pages/EditListing';
import { Home } from './pages/Home';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-white">
          <Navbar />
          <Flash />
          <div className="flex-1 mx-auto w-full max-w-7xl px-6 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/user/login" element={<Login />} />
              <Route path="/user/signup" element={<Signup />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/listing" element={<ListingsIndex />} />
              <Route path="/listing/new" element={<NewListing />} />
              <Route path="/listings/:id" element={<ShowListing />} />
              <Route path="/listings/:id/edit" element={<EditListing />} />
              <Route path="*" element={<Navigate to="/listing" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
