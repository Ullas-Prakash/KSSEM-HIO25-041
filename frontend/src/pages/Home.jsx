import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-purple-600 to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            ConnectHer
          </h1>
          <p className="text-2xl md:text-3xl mb-4 font-light">
            Empower | Inspire | Grow
          </p>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            A digital platform empowering women through storytelling and entrepreneurship.
            Share your journey, discover inspiring stories, and connect with women-led businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/stories"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition shadow-lg"
            >
              Explore Stories
            </Link>
            <Link
              to="/businesses"
              className="bg-secondary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition shadow-lg"
            >
              Discover Businesses
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Story Hub */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Story Hub</h3>
              <p className="text-gray-600 mb-6">
                Share your experiences and inspire others. Post stories anonymously or publicly
                across categories like Career, Health, Education, and Growth. Engage with the
                community through likes and comments.
              </p>
              <Link
                to="/stories"
                className="text-primary font-semibold hover:underline"
              >
                Read Stories →
              </Link>
            </div>

            {/* Business Hub */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Business Hub</h3>
              <p className="text-gray-600 mb-6">
                Discover and support women-led businesses in your area. Browse our interactive
                map to find local entrepreneurs, or register your own business to reach more
                customers.
              </p>
              <Link
                to="/businesses"
                className="text-secondary font-semibold hover:underline"
              >
                Explore Businesses →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          
          {!currentUser ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition"
              >
                Sign Up Now
              </Link>
              <Link
                to="/login"
                className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary hover:text-white transition"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/Schemes"
                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition"
              >
                Scheme description
              </Link>
              <Link
                to="/JobSearch"
                className="bg-secondary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition"
              >
                Job opportunitioes
              </Link>
            </div>
          )}
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore all the available schemes here and their details<br/>
            Raeach out for jobs, specific to your skills and interests
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-xl">Inspiring Stories</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-xl">Women-Led Businesses</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">5000+</div>
              <div className="text-xl">Community Members</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
