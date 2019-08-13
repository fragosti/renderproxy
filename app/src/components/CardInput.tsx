import React from 'react';
import { CardElement } from 'react-stripe-elements';

const cardOptions: any = {
  style: {
    base: {
      fontSize: '20px',
      color: '#424770',
      letterSpacing: '0.025em',
      fontFamily: 'Roboto, monospace',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export interface OnChangeEventError {
  code: string;
  type: string;
  message: string;
}

export interface OnChangeEvent {
  brand: string;
  complete: boolean;
  empty: boolean;
  error: OnChangeEventError;
}

export interface CardInputProps {
  onChange: (event: OnChangeEvent) => void;
}

export const CardInput: React.FC<any> = props => <CardElement {...cardOptions} {...props} />;
