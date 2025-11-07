require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Scheme = require('../models/Scheme');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const parseCSV = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    // Handle CSV with quoted values
    const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const obj = {};
    
    headers.forEach((header, index) => {
      let value = values[index] ? values[index].trim().replace(/^"|"$/g, '') : '';
      // Skip empty values for optional fields
      if (value && value !== '') {
        obj[header] = value;
      }
    });
    
    // Only add if we have required fields
    if (obj.name && obj.category && obj.level && obj.state_ut) {
      data.push(obj);
    }
  }
  
  return data;
};

const importSchemes = async () => {
  try {
    await connectDB();
    
    const jsonPath = path.join(__dirname, 'comprehensiveSchemesData.json');
    const schemes = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    // Clear existing schemes
    await Scheme.deleteMany({});
    console.log('Cleared existing schemes');
    
    // Insert new schemes
    const inserted = await Scheme.insertMany(schemes);
    console.log(`✅ Successfully imported ${inserted.length} schemes`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error importing schemes:', error);
    process.exit(1);
  }
};

importSchemes();
