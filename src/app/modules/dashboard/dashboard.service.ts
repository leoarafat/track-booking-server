/* eslint-disable @typescript-eslint/ban-ts-comment */
import QueryBuilder from '../../../builder/QueryBuilder';
import { getYearRange } from '../../../helpers/yearRange';
import { IGenericResponse } from '../../../interfaces/paginations';
import { logger } from '../../../shared/logger';
import { IDriver } from '../driver/driver.interface';
import Driver from '../driver/driver.model';
import { IUser } from '../user/user.interface';

import User from '../user/user.model';
const totalCount = async () => {
  const users = await User.countDocuments();
  const drivers = await Driver.countDocuments();

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const newDrivers = await Driver.countDocuments({
    createdAt: { $gte: oneMonthAgo },
  });
  const newDriversDetails = await Driver.find({
    createdAt: { $gte: oneMonthAgo },
  });

  return {
    users,
    drivers,
    newDrivers,
    newDriversDetails,
  };
};

const getDriverGrowth = async (year?: number) => {
  try {
    const currentYear = new Date().getFullYear();
    const selectedYear = year || currentYear;

    const { startDate, endDate } = getYearRange(selectedYear);

    const monthlyUserGrowth = await Driver.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          count: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const result = [];
    for (let i = 1; i <= 12; i++) {
      const monthData = monthlyUserGrowth.find(data => data.month === i) || {
        month: i,
        count: 0,
        year: selectedYear,
      };
      result.push({
        ...monthData,
        month: months[i - 1],
      });
    }

    return {
      year: selectedYear,
      data: result,
    };
  } catch (error) {
    logger.error('Error in getMonthlyUserGrowth function: ', error);
    throw error;
  }
};
const getAllDriver = async (
  query: Record<string, unknown>,
): Promise<IGenericResponse<IDriver[]>> => {
  const driverQuery = new QueryBuilder(Driver.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await driverQuery.modelQuery;
  const meta = await driverQuery.countTotal();

  return {
    meta,
    data: result,
  };
};
const getAllUsers = async (
  query: Record<string, unknown>,
): Promise<IGenericResponse<IUser[]>> => {
  const driverQuery = new QueryBuilder(User.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await driverQuery.modelQuery;
  const meta = await driverQuery.countTotal();

  return {
    meta,
    data: result,
  };
};

export const DashboardService = {
  totalCount,
  getDriverGrowth,
  getAllDriver,
  getAllUsers,
};
