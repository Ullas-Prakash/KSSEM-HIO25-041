import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Stories from './pages/Stories';
import Businesses from './pages/Businesses';
import Schemes from './pages/Schemes';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPanel from './pages/AdminPanel';
import CandidateProfile from './pages/CandidateProfile';
import EmployerProfile from './pages/EmployerProfile';
import JobPlatform from './pages/JobPlatform';
import PostJob from './pages/PostJob';
import JobSearch from './pages/JobSearch';
import BrowseCandidates from './pages/BrowseCandidates';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !currentUser.dbUser?.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stories" element={<Stories />} />
              <Route path="/businesses" element={<Businesses />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/job-platform"
                element={
                  <ProtectedRoute>
                    <JobPlatform />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidate-profile"
                element={
                  <ProtectedRoute>
                    <CandidateProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer-profile"
                element={
                  <ProtectedRoute>
                    <EmployerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-job"
                element={
                  <ProtectedRoute>
                    <PostJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/job-search"
                element={
                  <ProtectedRoute>
                    <JobSearch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/browse-candidates"
                element={
                  <ProtectedRoute>
                    <BrowseCandidates />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
