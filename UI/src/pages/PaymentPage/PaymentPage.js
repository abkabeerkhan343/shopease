import { Elements } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react'
import CheckoutForm from './CheckoutPayment';
import { loadStripe } from '@stripe/stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../store/features/common';
import { fetchUserDetails } from '../../api/userInfo';
import { selectCartItems } from '../../store/features/cart';

const stripePublishableKey = process.env.STRIPE_KEY || 'pk_test_51RQBYv4QeyA5CDiIkkhvocQmNXiPTnVL0TfXC2dcwdkV6CPAX5JmsihAcaAyySJhnZEZuyd9fid7g9X21rLGVMs900DdamDyhu';
//Publishable Key
const stripePromise = loadStripe(stripePublishableKey);

const PaymentPage = (props) => {

    const options = {
        mode: 'payment',
        amount: 5000,
        currency: 'inr',
        // Fully customizable with appearance API.
        appearance: {
            theme: 'flat'
        },
      };
  return (
    <div>
        <Elements stripe={stripePromise} options={options}>
             <CheckoutForm {...props}/>   
        </Elements>
    </div>
  )
}

export default PaymentPage