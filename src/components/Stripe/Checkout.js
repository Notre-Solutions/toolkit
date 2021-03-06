'use strict';
import React, { useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CartContext } from '../cart';

const CheckoutWrapper = () => {
  return (
    <CartContext.Consumer>
      {(context) => {
        console.log(context.checkoutItems);
        return <Checkout items={context.checkoutItems} />;
      }}
    </CartContext.Consumer>
  );
};
export const Checkout = ({ items }) => {
  const buttonStyles = {
    fontSize: '13px',
    color: '#fff',
    outline: 'none',
    padding: '12px 60px',
    boxShadow: '2px 5px 10px rgba(0,0,0,.1)',
    backgroundColor: 'rgb(255, 178, 56)',
    borderRadius: '6px',
    letterSpacing: '1.5px',
  };
  const stripePromise = loadStripe(process.env.STRIPE_PRIVATE_KEY);
  const redirectToCheckout = async (event) => {
    event.preventDefault();
    const stripeCheckout = await stripePromise;
    const { error } = await stripeCheckout.redirectToCheckout({
      shippingAddressCollection: {
        allowedCountries: ['GB'],
      },
      items: items,
      successUrl: `http://localhost:8000/payment-success/`,
      cancelUrl: `http://localhost:8000/payment-failure/`,
    });
    if (error) {
      console.warn('Error:', error);
    }
  };
  return (
    <div>
      <button style={buttonStyles} onClick={redirectToCheckout}>
        CheckOut
      </button>
    </div>
  );
};
export default CheckoutWrapper;
