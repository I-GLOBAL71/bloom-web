import { MYCOOLPAY_CONFIG } from './config';
import type { 
  PaymentRequest, PaymentResponse,
  PayoutRequest, PayoutResponse,
  TransactionStatus 
} from './types';

const BASE_URL = MYCOOLPAY_CONFIG.BASE_URL;
const PUBLIC_KEY = MYCOOLPAY_CONFIG.PUBLIC_KEY;
const PRIVATE_KEY = MYCOOLPAY_CONFIG.PRIVATE_KEY;

export async function createPayment(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    const response = await fetch(`${BASE_URL}/${PUBLIC_KEY}/paylink`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        transaction_amount: request.amount,
        transaction_currency: MYCOOLPAY_CONFIG.CURRENCY,
        transaction_reason: request.reason,
        app_transaction_ref: request.reference,
        customer_name: request.customerName,
        customer_phone_number: request.customerPhone,
        customer_email: request.customerEmail,
        customer_lang: MYCOOLPAY_CONFIG.LANG
      })
    });

    const data = await response.json();

    if (response.ok) {
      return {
        status: 'success',
        transactionRef: data.transaction_ref,
        paymentUrl: data.payment_url
      };
    }

    return {
      status: 'error',
      message: data.message || 'Payment creation failed'
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Network error'
    };
  }
}

export async function createPayout(request: PayoutRequest): Promise<PayoutResponse> {
  try {
    const response = await fetch(`${BASE_URL}/${PUBLIC_KEY}/payout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-PRIVATE-KEY': PRIVATE_KEY
      },
      body: JSON.stringify({
        transaction_amount: request.amount,
        transaction_currency: MYCOOLPAY_CONFIG.CURRENCY,
        transaction_reason: request.reason,
        transaction_operator: request.operator,
        app_transaction_ref: request.reference,
        customer_name: request.customerName,
        customer_phone_number: request.customerPhone,
        customer_email: request.customerEmail,
        customer_lang: MYCOOLPAY_CONFIG.LANG
      })
    });

    const data = await response.json();

    if (response.ok) {
      return {
        status: 'success',
        transactionRef: data.transaction_ref,
        message: data.message
      };
    }

    return {
      status: 'error',
      message: data.message || 'Payout creation failed'
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Network error'
    };
  }
}

export async function checkTransactionStatus(transactionRef: string): Promise<TransactionStatus> {
  try {
    const response = await fetch(
      `${BASE_URL}/${PUBLIC_KEY}/checkStatus/${transactionRef}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    const data = await response.json();

    return {
      status: data.status === 'success' ? 'completed' : 
              data.status === 'pending' ? 'pending' : 'failed',
      message: data.message
    };
  } catch (error) {
    return {
      status: 'failed',
      message: 'Network error'
    };
  }
}