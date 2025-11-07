const Business = require('../models/Business');

exports.getBusinesses = async (req, res) => {
  try {
    const { category, bounds } = req.query;
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (bounds) {
      const [swLng, swLat, neLng, neLat] = bounds.split(',').map(Number);
      query.location = {
        $geoWithin: {
          $box: [
            [swLng, swLat],
            [neLng, neLat],
          ],
        },
      };
    }

    const businesses = await Business.find(query)
      .populate('owner', 'displayName email')
      .sort({ createdAt: -1 });

    res.json({ businesses });
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
};

exports.createBusiness = async (req, res) => {
  try {
    const { name, description, category, address, location, contact } = req.body;

    if (!name || !description || !category || !location) {
      return res.status(400).json({
        error: 'Name, description, category, and location are required',
      });
    }

    if (!location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({
        error: 'Location coordinates must be [longitude, latitude]',
      });
    }

    const business = await Business.create({
      name,
      description,
      category,
      address,
      location,
      contact,
      owner: req.user._id,
    });

    await business.populate('owner', 'displayName email');

    res.status(201).json({ business });
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ error: 'Failed to create business' });
  }
};

exports.getBusinessById = async (req, res) => {
  try {
    const { id } = req.params;

    const business = await Business.findById(id)
      .populate('owner', 'displayName email photoURL');

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json({ business });
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ error: 'Failed to fetch business' });
  }
};
