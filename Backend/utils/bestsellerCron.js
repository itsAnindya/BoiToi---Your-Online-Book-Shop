const cron = require('node-cron');
const axios = require('axios');

/**
 * Cron Job for Category Bestsellers Update
 * Runs every day at 2:00 AM to update the category bestsellers
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

const startBestsellerCronJob = () => {
  console.log('Setting up category bestsellers cron job...');
  
  // Schedule: Every day at 2:00 AM
  // Cron pattern: '0 2 * * *' = minute hour day month weekday
  const cronPattern = '0 2 * * *';
  
  cron.schedule(cronPattern, async () => {
    console.log(`[${new Date().toISOString()}] Running automatic category bestsellers update...`);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/bestsellers/auto-update`, {
        trigger: 'automatic',
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ Automatic bestsellers update completed:', response.data);
      
    } catch (error) {
      console.error('❌ Error in automatic bestsellers update:', error.message);
      
      // Log detailed error for debugging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
  }, {
    scheduled: true,
    timezone: "Asia/Dhaka" // Bangladesh timezone
  });
  
  console.log('✅ Category bestsellers cron job scheduled to run daily at 2:00 AM (Asia/Dhaka)');
};

// Optional: Weekly update (more comprehensive)
const startWeeklyBestsellerCronJob = () => {
  console.log('Setting up weekly category bestsellers cron job...');
  
  // Schedule: Every Sunday at 3:00 AM
  // Cron pattern: '0 3 * * 0' = minute hour day month weekday(0=Sunday)
  const cronPattern = '0 3 * * 0';
  
  cron.schedule(cronPattern, async () => {
    console.log(`[${new Date().toISOString()}] Running weekly category bestsellers update...`);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/bestsellers/auto-update`, {
        trigger: 'weekly',
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ Weekly bestsellers update completed:', response.data);
      
    } catch (error) {
      console.error('❌ Error in weekly bestsellers update:', error.message);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
  }, {
    scheduled: true,
    timezone: "Asia/Dhaka"
  });
  
  console.log('✅ Weekly category bestsellers cron job scheduled to run every Sunday at 3:00 AM (Asia/Dhaka)');
};

// Manual trigger function for testing
const triggerManualUpdate = async () => {
  console.log('Triggering manual bestsellers update...');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/bestsellers/auto-update`, {
      trigger: 'manual',
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ Manual bestsellers update completed:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Error in manual bestsellers update:', error.message);
    throw error;
  }
};

module.exports = {
  startBestsellerCronJob,
  startWeeklyBestsellerCronJob,
  triggerManualUpdate
};
