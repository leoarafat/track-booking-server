import express from 'express';
import { ManageRoutes } from '../modules/manage-web/manage.routes';
import { SubscriptionPlanRoutes } from '../modules/subscriptions-plan/subscriptions-plan.routes';
import { MessageRoutes } from '../modules/messages/message.routes';
import { SubscriptionRoutes } from '../modules/subscriptions/subscriptions.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { NotificationRoutes } from '../modules/notifications/notifications.routes';
import { DashboardOverviewRoutes } from '../modules/overview/overview.routes';

import { FeedbackRoutes } from '../modules/feedback/feedback.routes';
import { PaymentRoutes } from '../modules/payment/payment.routes';
import { DriverRoutes } from '../modules/driver/driver.routes';
import { DashboardRoutes } from '../modules/dashboard/dashboard.routes';
import { TripRoutes } from '../modules/trip/trip.routes';
import { RattingRoutes } from '../modules/rattings/rattings.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/manage',
    route: ManageRoutes,
  },
  {
    path: '/subscription-plan',
    route: SubscriptionPlanRoutes,
  },
  {
    path: '/subscriptions',
    route: SubscriptionRoutes,
  },

  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/auth/driver',
    route: DriverRoutes,
  },
  {
    path: '/message',
    route: MessageRoutes,
  },
  {
    path: '/notification',
    route: NotificationRoutes,
  },
  {
    path: '/overview',
    route: DashboardOverviewRoutes,
  },
  {
    path: '/feedback',
    route: FeedbackRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/dashboard',
    route: DashboardRoutes,
  },
  {
    path: '/trip',
    route: TripRoutes,
  },
  {
    path: '/ratting',
    route: RattingRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
