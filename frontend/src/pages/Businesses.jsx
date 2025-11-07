import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useAuth } from '../context/AuthContext';
import BusinessCard from '../components/BusinessCard';
import api from '../services/api';

const Businesses = () => {
  const { currentUser } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
    },
    location: {
      coordinates: [-98.5795, 39.8283], // Center of USA
    },
    contact: {
      phone: '',
      email: '',
      website: '',
    },
  });

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
  };

  const center = {
    lat: 39.8283,
    lng: -98.5795,
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/businesses');
      setBusinesses(response.data.businesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert('Please login to register your business');
      return;
    }

    try {
      // Convert coordinates to latitude/longitude for backend
      const businessData = {
        ...formData,
        latitude: formData.location.coordinates[1],
        longitude: formData.location.coordinates[0],
      };
      delete businessData.location; // Remove location object
      
      const response = await api.post('/api/businesses', businessData);
      setBusinesses([...businesses, response.data.business]);
      setFormData({
        name: '',
        description: '',
        category: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA',
        },
        location: {
          coordinates: [-98.5795, 39.8283],
        },
        contact: {
          phone: '',
          email: '',
          website: '',
        },
      });
      setShowForm(false);
      alert('Business registered successfully!');
    } catch (error) {
      console.error('Error creating business:', error);
      alert('Failed to register business. Please ensure location coordinates are provided.');
    }
  };

  const handleMapClick = (e) => {
    if (showForm) {
      setFormData({
        ...formData,
        location: {
          coordinates: [e.latLng.lng(), e.latLng.lat()],
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Business Hub</h1>
          {currentUser && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
            >
              {showForm ? 'Cancel' : 'Register Business'}
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Register Your Business</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Retail, Food, Services"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, street: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, zipCode: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, phone: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, email: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.contact.website}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: { ...formData.contact, website: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Location Coordinates (Required):</strong> Click on the map below to set your business location, or enter manually.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.location.coordinates[0]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            coordinates: [parseFloat(e.target.value), formData.location.coordinates[1]],
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.location.coordinates[1]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: {
                            coordinates: [formData.location.coordinates[0], parseFloat(e.target.value)],
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
              >
                Register Business
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={4}
              onClick={handleMapClick}
            >
              {businesses.map((business) => (
                <Marker
                  key={business._id}
                  position={{
                    lat: business.location.coordinates[1],
                    lng: business.location.coordinates[0],
                  }}
                  onClick={() => setSelectedBusiness(business)}
                />
              ))}

              {selectedBusiness && (
                <InfoWindow
                  position={{
                    lat: selectedBusiness.location.coordinates[1],
                    lng: selectedBusiness.location.coordinates[0],
                  }}
                  onCloseClick={() => setSelectedBusiness(null)}
                >
                  <div style={{ maxWidth: '250px' }}>
                    <BusinessCard business={selectedBusiness} />
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : businesses.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-lg">
                No businesses registered yet. Be the first!
              </p>
            </div>
          ) : (
            businesses.map((business) => (
              <BusinessCard key={business._id} business={business} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Businesses;
