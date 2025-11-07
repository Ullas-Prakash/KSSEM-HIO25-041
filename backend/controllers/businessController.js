const Business = require('../models/Business');
const { createBusinessSchema } = require('../validators/businessValidator');
const { geocodeAddress } = require('../utils/geocoder');

// GET /api/businesses?category=...&neLat=...&neLng=...&swLat=...&swLng=...&limit=50
exports.getBusinesses = async (req, res, next) => {
  try {
    const { category, neLat, neLng, swLat, swLng, limit = 50 } = req.query;
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    
    if (neLat && neLng && swLat && swLng) {
      filter.location = { 
        $geoWithin: { 
          $box: [[Number(swLng), Number(swLat)], [Number(neLng), Number(neLat)]] 
        } 
      };
    }
    
    const businesses = await Business.find(filter)
      .select('-__v')
      .limit(Math.min(Number(limit), 100))
      .lean();
    
    res.json({ businesses });
  } catch (err) { 
    next(err); 
  }
};

// GET /api/businesses/:id
exports.getBusinessById = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id)
      .where({ isActive: true })
      .select('-__v')
      .lean();
    
    if (!business) return res.status(404).json({ error: 'Business not found' });
    
    res.json({ business });
  } catch (err) { 
    next(err); 
  }
};

// POST /api/businesses
exports.createBusiness = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    const { value, error } = createBusinessSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details.map(d => d.message) 
      });
    }
    
    let coordinates = null;
    
    // Try geocoding address first
    const geocoded = await geocodeAddress(value.address);
    if (geocoded) coordinates = [geocoded.lng, geocoded.lat];
    
    // Fall back to manual lat/lng if provided
    if (!coordinates && value.latitude != null && value.longitude != null) {
      coordinates = [Number(value.longitude), Number(value.latitude)];
    }
    
    if (!coordinates) {
      return res.status(400).json({ 
        error: 'Provide a valid address or latitude/longitude.' 
      });
    }
    
    const doc = await Business.create({
      name: value.name,
      description: value.description,
      category: value.category,
      owner: req.user._id,
      address: value.address,
      location: { type: 'Point', coordinates },
      contact: value.contact,
    });
    
    res.status(201).json({ business: doc });
  } catch (err) { 
    next(err); 
  }
};
