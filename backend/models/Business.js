const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
}, { _id: false });

const contactSchema = new mongoose.Schema({
  phone: String,
  email: String,
  website: String,
}, { _id: false });

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true },
  category: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: addressSchema,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
  },
  contact: contactSchema,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

businessSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Business', businessSchema);
