require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const EXPERTS = [
  {
    name: 'Dr. Santosh Verma', email: 'santosh.verma@croporia.com', password: 'Expert@123', role: 'Expert',
    expertDetails: { specialization: 'Soil & Nutrient Management', region: 'Punjab, India', experience: '18+ years advising small and mid-size farms', crops: 'Wheat, Paddy, Maize, Fodder crops', languages: ['English', 'Hindi', 'Punjabi'], rating: 4.9, achievements: ['Designed nutrient plans for 5,000+ acres', 'Set up low-cost composting systems', 'Published 12+ research papers'] }
  },
  {
    name: 'Anita Kulkarni', email: 'anita.kulkarni@croporia.com', password: 'Expert@123', role: 'Expert',
    expertDetails: { specialization: 'Fruit Orchard Specialist', region: 'Maharashtra, India', experience: '12 years in horticulture', crops: 'Mango, Pomegranate, Citrus, Banana', languages: ['English', 'Marathi', 'Hindi'], rating: 4.8, achievements: ['Revived 150+ ageing orchards', 'Trained 1,000+ farmers on drip irrigation', 'Consulted for 3 FPOs'] }
  },
  {
    name: 'Rahul Menon', email: 'rahul.menon@croporia.com', password: 'Expert@123', role: 'Expert',
    expertDetails: { specialization: 'Climate-Smart Farming', region: 'Karnataka, India', experience: '9 years in climate resilience', crops: 'Millets, Pulses, Vegetables', languages: ['English', 'Kannada', 'Hindi'], rating: 4.7, achievements: ['Helped 800+ farmers shift to millets', 'Designed rainwater harvesting structures', 'State govt advisor'] }
  },
  {
    name: 'Dr. Asha Nair', email: 'asha.nair@croporia.com', password: 'Expert@123', role: 'Expert',
    expertDetails: { specialization: 'Plant Protection & IPM', region: 'Andhra Pradesh, India', experience: '15+ years in pest management', crops: 'Rice, Cotton, Chilli, Vegetables', languages: ['English', 'Telugu', 'Hindi'], rating: 5.0, achievements: ['Reduced pesticide use by 40%', 'Weekly field clinics across 4 districts', 'Trained 300+ pest scouts'] }
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  let created = 0, skipped = 0;
  for (const expert of EXPERTS) {
    const exists = await User.findOne({ email: expert.email });
    if (exists) { console.log(`Skipping ${expert.name} — already exists`); skipped++; continue; }
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(expert.password, salt);
    await new User({ name: expert.name, email: expert.email, password_hash, role: expert.role, expertDetails: expert.expertDetails }).save();
    console.log(`Created: ${expert.name}`);
    created++;
  }
  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
  console.log('\nLogin credentials for all experts: password = Expert@123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
