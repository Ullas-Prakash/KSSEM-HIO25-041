import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            ConnectHer
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-secondary transition">
              Home
            </Link>
            <Link to="/stories" className="hover:text-secondary transition">
              Stories
            </Link>
            <Link to="/businesses" className="hover:text-secondary transition">
              Businesses
            </Link>
            <Link to="/schemes" className="hover:text-secondary transition">
              Schemes
            </Link>
            {currentUser?.dbUser?.isAdmin && (
              <Link to="/admin" className="hover:text-secondary transition">
                Admin
              </Link>
            )}
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-secondary px-4 py-2 rounded hover:bg-opacity-80 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded border border-white hover:bg-white hover:text-primary transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-secondary px-4 py-2 rounded hover:bg-opacity-80 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block py-2 hover:text-secondary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/stories"
              className="block py-2 hover:text-secondary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Stories
            </Link>
            <Link
              to="/businesses"
              className="block py-2 hover:text-secondary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Businesses
            </Link>
            <Link
              to="/schemes"
              className="block py-2 hover:text-secondary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Schemes
            </Link>
            {currentUser?.dbUser?.isAdmin && (
              <Link
                to="/admin"
                className="block py-2 hover:text-secondary transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {currentUser ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 hover:text-secondary transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 hover:text-secondary transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 hover:text-secondary transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
