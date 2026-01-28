import { api } from './axios';

export const payrollApi = {
  // Get payroll information (protected - vendor only)
  getPayroll: async (params?: any): Promise<any> => {
    const response = await api.get('/payroll', { params });
    return response.data;
  },

  // Get payroll by ID (protected - vendor only)
  getPayrollDetails: async (payrollId: string): Promise<any> => {
    const response = await api.get(`/payroll/${payrollId}`);
    return response.data;
  },

  // Get earnings summary (protected - vendor only)
  getEarningsSummary: async (params?: any): Promise<any> => {
    const response = await api.get('/payroll/earnings/summary', { params });
    return response.data;
  },

  // Get payouts list (protected - vendor only)
  getPayouts: async (params?: any): Promise<any> => {
    const response = await api.get('/payroll/payouts', { params });
    return response.data;
  },

  // Get payout by ID (protected - vendor only)
  getPayout: async (payoutId: string): Promise<any> => {
    const response = await api.get(`/payroll/payouts/${payoutId}`);
    return response.data;
  },

  // Request payout (protected - vendor only)
  requestPayout: async (amount: number, bankDetails?: any): Promise<any> => {
    const response = await api.post('/payroll/request-payout', { amount, bankDetails });
    return response.data;
  },

  // Get payout history (protected - vendor only)
  getPayoutHistory: async (params?: any): Promise<any> => {
    const response = await api.get('/payroll/payout-history', { params });
    return response.data;
  },

  // Get bank details (protected - vendor only)
  getBankDetails: async (): Promise<any> => {
    const response = await api.get('/payroll/bank-details');
    return response.data;
  },

  // Update bank details (protected - vendor only)
  updateBankDetails: async (bankDetails: any): Promise<any> => {
    const response = await api.put('/payroll/bank-details', bankDetails);
    return response.data;
  },

  // Get commission rate (protected - vendor only)
  getCommissionRate: async (): Promise<any> => {
    const response = await api.get('/payroll/commission-rate');
    return response.data;
  },

  // Get payroll ledger (protected - vendor only)
  getPayrollLedger: async (params?: any): Promise<any> => {
    const response = await api.get('/payroll/ledger', { params });
    return response.data;
  }
};
