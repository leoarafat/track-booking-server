import QueryBuilder from '../../../builder/QueryBuilder';
import { logger } from '../../../shared/logger';
import {
  generateLastMonthsData,
  generatedLast12MonthData,
} from '../../../utils/analytics.generator';
import { Payment } from '../payment/payment.model';
import { Subscription } from '../subscriptions/subscriptions.model';
import User from '../user/user.model';

const totalUserAndEarning = async () => {
  try {
    const totalUser = await User.countDocuments();

    const payments = await Payment.find({});
    const totalEarnings = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    return {
      totalUser,
      totalEarnings,
    };
  } catch (error) {
    logger.error('Error fetching dashboard overview:', error);
    throw new Error('Unable to fetch dashboard overview');
  }
};

const Analytics = async () => {
  //! User
  const monthlyUserGrowth = await generateLastMonthsData(User, 1);
  const yearlyUserGrowth = await generatedLast12MonthData(User);
  //! Income
  const monthlyIncomeGrowth = await generateLastMonthsData(User, 1);
  const yearlyIncomeGrowth = await generatedLast12MonthData(User);
  return {
    monthlyUserGrowth,
    yearlyUserGrowth,
    monthlyIncomeGrowth,
    yearlyIncomeGrowth,
  };
};
const purchasedPackageList = async (query: Record<string, unknown>) => {
  const purchaseQuery = new QueryBuilder(
    Subscription.find({}).populate('user_id'),
    query,
  )
    .search(['plan_type'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await purchaseQuery.modelQuery;
  const meta = await purchaseQuery.countTotal();

  return {
    meta,
    data: result,
  };
};

export const DashboardOverviewService = {
  totalUserAndEarning,
  Analytics,
  purchasedPackageList,
};
