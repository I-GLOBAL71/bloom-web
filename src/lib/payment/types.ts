export interface PaymentRequest {
  amount: number;
  reason: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  reference: string;
}

export interface PaymentResponse {
  status: 'success' | 'error';
  transactionRef?: string;
  paymentUrl?: string;
  message?: string;
}

export interface PayoutRequest {
  amount: number;
  reason: string;
  operator: 'CM_MOMO' | 'CM_OM';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  reference: string;
}

export interface PayoutResponse {
  status: 'success' | 'error';
  transactionRef?: string;
  message?: string;
}

export interface TransactionStatus {
  status: 'pending' | 'completed' | 'failed';
  message?: string;
}