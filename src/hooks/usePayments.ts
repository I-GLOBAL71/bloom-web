import { useState } from 'react';
import { createPayment, createPayout, checkTransactionStatus } from '../lib/payment/api';
import type { PaymentRequest, PayoutRequest } from '../lib/payment/types';

export function usePayments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handlePayment = async (request: PaymentRequest) => {
    try {
      setLoading(true);
      setError(undefined);
      const response = await createPayment(request);
      
      if (response.status === 'success' && response.paymentUrl) {
        return response.paymentUrl;
      }
      
      throw new Error(response.message || 'Payment failed');
    } catch (err) {
      setError('Failed to process payment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePayout = async (request: PayoutRequest) => {
    try {
      setLoading(true);
      setError(undefined);
      const response = await createPayout(request);
      
      if (response.status === 'success') {
        return response.transactionRef;
      }
      
      throw new Error(response.message || 'Payout failed');
    } catch (err) {
      setError('Failed to process payout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async (transactionRef: string) => {
    try {
      setLoading(true);
      setError(undefined);
      return await checkTransactionStatus(transactionRef);
    } catch (err) {
      setError('Failed to check transaction status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handlePayment,
    handlePayout,
    checkStatus
  };
}