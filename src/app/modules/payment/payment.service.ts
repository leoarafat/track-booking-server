import Stripe from 'stripe';
import config from '../../../config';

const stripe = new Stripe(config.stripe.stripe_secret_key as string);

const makePaymentIntent = async (payload: { price: any }) => {
  const amount = Math.trunc(payload.price * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  const data = {
    client_secret: paymentIntent.client_secret,
    transactionId: paymentIntent.id,
  };
  return data;
};

export const PaymentService = { makePaymentIntent };
