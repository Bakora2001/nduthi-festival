/**
 * This module is superseded by kopokopo.service.ts
 * Kopo Kopo K2 Connect is used for all M-Pesa STK Push payments.
 * This file is kept only for compatibility with any legacy imports.
 */
export const mpesaService = {
  async getAccessToken(): Promise<string> {
    return '';
  },
  async stkPush(_params: { phone: string; amount: number; accountReference: string }) {
    return {};
  },
  async handleCallback(payload: unknown) {
    return payload;
  },
};
