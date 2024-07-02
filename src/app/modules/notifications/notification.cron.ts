import cron from 'node-cron';
import Notification from './notifications.model';
//Delete
cron.schedule('0 0 0 * * *', async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await Notification.deleteMany({
    status: 'read',
    createdAt: { $lt: thirtyDaysAgo },
  });
});
