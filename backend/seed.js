import mongoose from 'mongoose';
import User from './models/Usermodel.js';

const seedUserHistory = async () => {
  try {
    await mongoose.connect('mongodb+srv://koushik:koushik@cluster0.h2lzgvs.mongodb.net/geoguide');

    const user = await User.findOne({ email: 'koushik.p22@iiits.in' }); // Change email as needed
    if (!user) {
      console.log('User not found');
      return;
    }

    const historyData = [
      { tag: 'travel', count: 5 },
      { tag: 'shopping', count: 3 },
      { tag: 'food', count: 8 },
      { tag: 'fitness', count: 6 },
      { tag: 'movies', count: 4 },
      { tag: 'education', count: 7 },
      { tag: 'music', count: 9 },
      { tag: 'technology', count: 2 },
      { tag: 'gaming', count: 10 },
      { tag: 'restaurant', count: 5 },
      { tag: 'park', count: 3 },
      { tag: 'museum', count: 4 },
      { tag: 'library', count: 2 },
      { tag: 'cafe', count: 6 },
      { tag: 'beach', count: 7 },
      { tag: 'mall', count: 8 },
      { tag: 'theater', count: 9 }
    ];

    user.history = historyData;
    await user.save();

    console.log('User history seeded successfully');
  } catch (error) {
    console.error('Error seeding user history:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedUserHistory();
