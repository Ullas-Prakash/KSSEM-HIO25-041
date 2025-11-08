import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ConnectHer</h3>
            <p className="text-gray-400">
              Empowering women through storytelling and entrepreneurship.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/stories" className="hover:text-white transition">
                  Stories
                </a>
              </li>
              <li>
                <a href="/businesses" className="hover:text-white transition">
                  Businesses
                </a>
              </li>
              <li>
                <a href="/schemes" className="hover:text-white transition">
                  Schemes
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <p className="text-gray-400">
              Join our community and make a difference.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2024 ConnectHer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
