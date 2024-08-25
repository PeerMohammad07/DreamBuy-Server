import { CronJob } from 'cron';
import UserModel from '../db/userSchema';
import moment from 'moment';
import sendEmailPremiumExpiration from './expirationEmail';
import Property from '../db/propertySchema';

const job = new CronJob(
  '0 12 * * *',
  async function () {
    console.log('Cron job executed at:', new Date().toLocaleString());

    const today = moment().startOf('day');
    const tomorrow = moment().add(1, 'day').startOf('day');

    try {

      // user premium removing
      const expiringSoon = await UserModel.find({
        'premiumSubscription.expiryDate': {
          $gte: tomorrow.toDate(),
          $lt: tomorrow.add(1, 'day').toDate()
        }
      });
      
      expiringSoon.forEach(user => {
        if(user?.premiumSubscription?.expiryDate){
          sendEmailPremiumExpiration(user.email,user.name,user?.premiumSubscription?.expiryDate)
        }
      });

      const expiredSubscriptions = await UserModel.updateMany(
        {
          'premiumSubscription.expiryDate': { $lt: today.toDate() }
        },
        {
          $set: {
            isPremium: false,
            premiumSubscription: null
          }
        }
      );
      
      // property boost removing
      const expiredBoostProperty = await Property.updateMany({
        'boostDetails.expiryDate' : {$lt : today.toDate()}
      },
      {
        $set: {
          isBoosted: false,
          boostDetails: null
        }
      })

      console.log(expiredBoostProperty,"boosted property expired")
    } catch (error) {
      console.error('Error checking subscriptions:', error);
    }
  },
  null,
  true,
  'Asia/Kolkata'
);


export default job