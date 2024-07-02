import { Subscription } from '../app/modules/subscriptions/subscriptions.model';

export const userSubscription = async (userId: string) => {
  const isExist = await Subscription.findOne({ user_id: userId });
  if (isExist) {
    return isExist;
  } else {
    return null;
  }
};
