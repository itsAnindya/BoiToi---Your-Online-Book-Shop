const cron = require('node-cron');
const BestsellerService = require('./bestsellerService');

/**
 * Scheduler Service for Periodic Tasks
 */
class SchedulerService {
  
  constructor() {
    this.jobs = [];
    this.isStarted = false;
  }

  /**
   * Start all scheduled jobs
   */
  start() {
    if (this.isStarted) {
      console.log('Scheduler is already running');
      return;
    }

    console.log('Starting scheduler service...');
    
    // Schedule bestseller updates
    this.scheduleBestsellerUpdates();
    
    this.isStarted = true;
    console.log('Scheduler service started successfully');
  }

  /**
   * Stop all scheduled jobs
   */
  stop() {
    if (!this.isStarted) {
      console.log('Scheduler is not running');
      return;
    }

    console.log('Stopping scheduler service...');
    
    this.jobs.forEach(job => {
      if (job.destroy) {
        job.destroy();
      }
    });
    
    this.jobs = [];
    this.isStarted = false;
    console.log('Scheduler service stopped');
  }

  /**
   * Schedule bestseller updates
   * Runs daily at 2 AM
   */
  scheduleBestsellerUpdates() {
    // Daily at 2:00 AM
    const dailyJob = cron.schedule('0 2 * * *', async () => {
      console.log('Running scheduled bestseller update...');
      try {
        const result = await BestsellerService.updateCategoryBestsellersSQL();
        console.log('Scheduled bestseller update completed:', result.data);
      } catch (error) {
        console.error('Scheduled bestseller update failed:', error);
      }
    }, {
      scheduled: false,
      timezone: "Asia/Dhaka" // Adjust to your timezone
    });

    // Weekly on Sunday at 3:00 AM
    const weeklyJob = cron.schedule('0 3 * * 0', async () => {
      console.log('Running weekly bestseller maintenance...');
      try {
        const result = await BestsellerService.updateCategoryBestsellersSQL();
        console.log('Weekly bestseller maintenance completed:', result.data);
        
        // Additional weekly maintenance tasks can be added here
        await this.cleanupOldBestsellerData();
      } catch (error) {
        console.error('Weekly bestseller maintenance failed:', error);
      }
    }, {
      scheduled: false,
      timezone: "Asia/Dhaka"
    });

    // Start the jobs
    dailyJob.start();
    weeklyJob.start();

    this.jobs.push(dailyJob, weeklyJob);

    console.log('Bestseller update jobs scheduled:');
    console.log('- Daily updates at 2:00 AM');
    console.log('- Weekly maintenance on Sundays at 3:00 AM');
  }

  /**
   * Clean up old bestseller data (keep last 12 months)
   */
  async cleanupOldBestsellerData() {
    return new Promise((resolve, reject) => {
      const db = require('../config/database');
      
      const cleanupSql = `
        DELETE FROM category_bestseller 
        WHERE PERIOD_TYPE = 'MONTHLY' 
        AND PERIOD_START < DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 12 MONTH)
      `;

      db.query(cleanupSql, (err, result) => {
        if (err) {
          console.error('Error cleaning up old bestseller data:', err);
          reject(err);
          return;
        }

        console.log(`Cleaned up ${result.affectedRows} old bestseller records`);
        resolve(result);
      });
    });
  }

  /**
   * Manually trigger bestseller update
   */
  async triggerBestsellerUpdate() {
    console.log('Manual bestseller update triggered...');
    try {
      const result = await BestsellerService.updateCategoryBestsellersSQL();
      console.log('Manual bestseller update completed:', result.data);
      return result;
    } catch (error) {
      console.error('Manual bestseller update failed:', error);
      throw error;
    }
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isStarted,
      activeJobs: this.jobs.length,
      nextExecutions: this.jobs.map(job => ({
        nextExecution: job.nextDate ? job.nextDate().toISOString() : 'Unknown',
        timezone: 'Asia/Dhaka'
      }))
    };
  }
}

// Export singleton instance
const schedulerService = new SchedulerService();

module.exports = schedulerService;
