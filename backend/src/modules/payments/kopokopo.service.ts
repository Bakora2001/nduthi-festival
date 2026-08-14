import axios from 'axios';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

interface KopoKopoTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  created_at?: number;
}

interface StkPushParams {
  phone: string;
  amount: number;
  paymentId: string;
  nomineeId?: string;
  userId: string;
  voterName?: string;
  voterEmail?: string;
}

class KopoKopoService {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private apiKey: string;
  private tillNumber: string;
  private callbackUrl: string;

  private cachedToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor() {
    this.baseUrl = env.kopokopo.baseUrl;
    this.clientId = env.kopokopo.clientId;
    this.clientSecret = env.kopokopo.clientSecret;
    this.apiKey = env.kopokopo.apiKey;
    this.tillNumber = env.kopokopo.tillNumber;
    this.callbackUrl = env.kopokopo.callbackUrl;

    if (!this.callbackUrl.startsWith('https://')) {
      logger.warn(`[KopoKopo] Callback URL must be HTTPS for production. Got: ${this.callbackUrl}`);
      this.callbackUrl = 'https://nduthi-festival-backend.onrender.com/api/payments/kopokopo/callback';
    }

    logger.info(`[KopoKopo] Initialized — Till: ${this.tillNumber} | Callback: ${this.callbackUrl}`);
  }

  /**
   * Format phone number to standard E.164 (+254XXXXXXXXX)
   */
  public formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      cleaned = '254' + cleaned;
    }
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    return cleaned;
  }

  /**
   * Request OAuth access token using Client ID & Client Secret
   */
  public async getAccessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    if (this.cachedToken && this.tokenExpiresAt > now + 60) {
      logger.debug('[KopoKopo OAuth] Using cached token');
      return this.cachedToken;
    }

    try {
      logger.info(`[KopoKopo OAuth] Requesting token from ${this.baseUrl}/oauth/v1/users/auth`);
      const response = await axios.post<KopoKopoTokenResponse>(
        `${this.baseUrl}/oauth/v1/users/auth`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      this.cachedToken = response.data.access_token;
      this.tokenExpiresAt = now + (response.data.expires_in || 7200);
      logger.info('[KopoKopo OAuth] Access token acquired successfully');
      return this.cachedToken!;
    } catch (err: any) {
      try {
        logger.info(`[KopoKopo OAuth] Primary endpoint failed, retrying ${this.baseUrl}/oauth/token...`);
        const fallbackRes = await axios.post<KopoKopoTokenResponse>(
          `${this.baseUrl}/oauth/token`,
          {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'client_credentials',
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        this.cachedToken = fallbackRes.data.access_token;
        this.tokenExpiresAt = now + (fallbackRes.data.expires_in || 7200);
        logger.info('[KopoKopo OAuth] Access token acquired from fallback endpoint');
        return this.cachedToken!;
      } catch (fallbackErr: any) {
        const errDetails =
          fallbackErr.response?.data || err.response?.data || err.message;
        logger.error(`[KopoKopo OAuth Error]: ${JSON.stringify(errDetails)}`);
        throw new Error(`Kopo Kopo authentication failed: ${JSON.stringify(errDetails)}`);
      }
    }
  }

  /**
   * Initiate M-Pesa STK Push via Kopo Kopo incoming_payments
   */
  public async initiateStkPush(params: StkPushParams) {
    const accessToken = await this.getAccessToken();
    const formattedPhone = this.formatPhoneNumber(params.phone);
    const [firstName, ...rest] = (params.voterName || 'Nduthi Voter').split(' ');
    const lastName = rest.join(' ') || 'Voter';

    const payload = {
      payment_channel: 'M-PESA STK Push',
      till_number: String(this.tillNumber),
      subscriber: {
        first_name: firstName,
        last_name: lastName,
        phone_number: formattedPhone,
        email: params.voterEmail || 'voter@nduthiawards.co.ke',
      },
      amount: {
        currency: 'KES',
        value: Number(params.amount),
      },
      metadata: {
        payment_id: String(params.paymentId),
        nominee_id: String(params.nomineeId),
        user_id: String(params.userId),
      },
      _links: {
        callback_url: this.callbackUrl,
      },
    };

    logger.info(`[KopoKopo STK Push] Sending KES ${params.amount} prompt to ${formattedPhone} (Till: ${this.tillNumber})`);
    logger.info(`[KopoKopo STK Payload] callback_url: ${this.callbackUrl}`);

    try {
      const response = await axios.post(`${this.baseUrl}/api/v1/incoming_payments`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      const locationHeader =
        response.headers['location'] || response.headers['Location'] || '';
      logger.info(`[KopoKopo STK Success] HTTP ${response.status}. Payment Location: ${locationHeader}`);

      return {
        success: true,
        location: locationHeader,
        status: response.status,
        data: response.data,
      };
    } catch (err: any) {
      const errData = err.response?.data;
      logger.error(
        `[KopoKopo STK Error] Status ${err.response?.status}: ${errData ? JSON.stringify(errData) : err.message}`
      );

      return {
        success: false,
        error: errData || err.message,
      };
    }
  }

  /**
   * Check live status of an incoming payment using the Kopo Kopo resource Location URL
   */
  public async checkPaymentStatus(locationUrl: string) {
    if (!locationUrl || !locationUrl.startsWith('http')) {
      return { status: 'Pending' };
    }

    try {
      const accessToken = await this.getAccessToken();
      logger.info(`[KopoKopo Query] Checking status at ${locationUrl}`);
      const response = await axios.get(locationUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          'x-api-key': this.apiKey,
        },
      });

      const attributes = response.data?.data?.attributes || response.data?.attributes || {};
      const status = String(attributes.status || attributes.event?.resource?.status || 'Pending');
      const mpesaRef = attributes.event?.resource?.reference || attributes.id;

      logger.info(`[KopoKopo Query Status]: ${status} (Ref: ${mpesaRef || 'N/A'})`);

      return {
        status, // 'Pending', 'Success', 'Failed'
        mpesaRef,
        data: response.data,
      };
    } catch (err: any) {
      logger.error(`[KopoKopo Query Error]: ${err.response?.data ? JSON.stringify(err.response.data) : err.message}`);
      return { status: 'Pending', error: err.message };
    }
  }
}

export const kopokopoService = new KopoKopoService();
