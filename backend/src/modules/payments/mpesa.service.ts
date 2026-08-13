import { env } from '../../config/env';
import { logger } from '../../utils/logger';

/**
 * Thin wrapper around Safaricom's Daraja API.
 * This is a scaffold: plug in real OAuth + STK Push calls before going live.
 */
export const mpesaService = {
  async getAccessToken(): Promise<string> {
    // TODO: call https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
    // using Basic auth with MPESA_CONSUMER_KEY / MPESA_CONSUMER_SECRET.
    logger.debug(`[mpesa] Requesting OAuth token (env: ${env.mpesa.env})`);
    return 'stub-access-token';
  },

  async stkPush(params: { phone: string; amount: number; accountReference: string }) {
    // TODO: POST to /mpesa/stkpush/v1/processrequest with the access token,
    // BusinessShortCode, Passkey-derived password, timestamp, and callback URL.
    logger.debug(`[mpesa] STK Push -> phone=${params.phone} amount=${params.amount}`);

    return {
      merchantRequestId: `stub-merchant-${Date.now()}`,
      checkoutRequestId: `stub-checkout-${Date.now()}`,
      responseCode: '0',
      responseDescription: 'Success. Request accepted for processing',
    };
  },

  async handleCallback(payload: unknown) {
    // TODO: parse the Daraja callback payload, verify the transaction,
    // then mark the matching Payment record as SUCCESS or FAILED.
    logger.debug(`[mpesa] Callback received: ${JSON.stringify(payload)}`);
    return payload;
  },
};
