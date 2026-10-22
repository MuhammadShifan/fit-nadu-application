const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron'); 
const axios = require('axios');
require('dotenv').config();

const User = require('./models/User'); 
const Notification = require('./models/Notification'); 
// Puthusa Fitness model-ah import pandrom (reset panrathukku thevai)
const Fitness = require('./models/Fitness'); 
const authRoutes = require('./routes/authRoutes');
const gymRoutes = require('./routes/gymRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const supplementRoutes = require('./routes/supplementRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const fitnessRoutes = require('./routes/fitnessRoutes');

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/gyms', gymRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/supplements', supplementRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/fitness', fitnessRoutes);
app.use('/api/notifications', require('./routes/notificationRoutes'));

// 1. Existing Water Reminder Cron Job
cron.schedule('0 8,10,12,14,16,18,20 * * *', async () => {
  try {
    const users = await User.find({}); 

    if (users.length > 0) {
      const notifications = users.map(user => ({
        userId: user._id,
        title: "Time to Hydrate! 💧",
        message: "Take a break and drink a glass of water to reach your daily goal!",
        type: "water",
        isRead: false,
        createdAt: new Date()
      }));
      await Notification.insertMany(notifications);

      const pushMessages = users
        .filter(user => user.expoPushToken) 
        .map(user => ({
          to: user.expoPushToken,
          sound: 'default',
          title: 'Time to Hydrate! 💧',
          body: 'Take a break and drink a glass of water to reach your daily goal!',
          data: { type: 'water' },
        }));

      if (pushMessages.length > 0) {
        await axios.post('https://exp.host/--/api/v2/push/send', pushMessages, {
          headers: {
            'Accept': 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
        });
      }
    }
  } catch (error) {
    console.error('❌ Error in water reminder cron job:', error);
  }
});

// 2. PUDHU CRON JOB: Daily Midnight Data Reset (12:00 AM)
cron.schedule('0 0 * * *', async () => {
  try {
    console.log("🔄 Running midnight reset for Fitness data...");
    
    // Yella users-oda fitness data-vayum eduthu reset pandrom
    const result = await Fitness.updateMany(
      {}, // Empty filter means ellarukkum apply aagum
      { 
        $set: { 
          'nutrition.waterIntake': 0, // Water glass empty aakkurom
          'nutrition.foodDiary': [],  // Food list-ah delete pandrom
          'nutrition.consumed': {     // Consumed macros-ah 0 aakkurom
            kcal: 0, 
            protein: 0, 
            carbs: 0, 
            fibre: 0 
          }
        }
      }
    );
    console.log(`✅ Successfully reset daily fitness data for ${result.modifiedCount} users.`);
  } catch (error) {
    console.error('❌ Error in midnight fitness reset cron job:', error);
  }
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB Connected Successfully!');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.log('Database connection error:', err));