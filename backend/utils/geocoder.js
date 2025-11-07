const NodeGeocoder = require('node-geocoder');

const provider = process.env.GEOCODER_PROVIDER || 'none';
let geocoder = null;

if (provider === 'google') {
  geocoder = NodeGeocoder({ provider: 'google', apiKey: process.env.GEOCODER_API_KEY });
}

exports.geocodeAddress = async (addressObj = {}) => {
  if (!geocoder) return null;
  const line = [addressObj.street, addressObj.city, addressObj.state, addressObj.zipCode, addressObj.country]
    .filter(Boolean).join(', ');
  if (!line) return null;
  const res = await geocoder.geocode(line);
  if (res && res.length) return { lat: res[0].latitude, lng: res[0].longitude };
  return null;
};
