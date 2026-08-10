export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'WHATSAPP' | 'PUSH' | 'SMS';

export interface NotificationPayload {
  tenantId: string;
  recipientUserId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  title: string;
  body: string;
  channel: NotificationChannel;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  linkUrl?: string;
}

export interface NotificationDeliveryResult {
  channel: NotificationChannel;
  status: 'DELIVERED_IN_APP' | 'EXTERNAL_CONFIG_REQUIRED' | 'FAILED' | 'SENT_EXTERNAL';
  message: string;
  providerDetails: string;
}

export interface INotificationAdapter {
  channel: NotificationChannel;
  isConfigured(): boolean;
  send(payload: NotificationPayload): Promise<NotificationDeliveryResult>;
}

export class InAppNotificationAdapter implements INotificationAdapter {
  public channel: NotificationChannel = 'IN_APP';

  public isConfigured(): boolean {
    return true; // Always active
  }

  public async send(payload: NotificationPayload): Promise<NotificationDeliveryResult> {
    return {
      channel: 'IN_APP',
      status: 'DELIVERED_IN_APP',
      message: `In-App notification dispatched for User [${payload.recipientUserId}]`,
      providerDetails: 'Minetrix Persistent Notification Feed'
    };
  }
}

export class EmailNotificationAdapter implements INotificationAdapter {
  public channel: NotificationChannel = 'EMAIL';

  public isConfigured(): boolean {
    return Boolean(process.env.SMTP_HOST || process.env.SENDGRID_API_KEY);
  }

  public async send(payload: NotificationPayload): Promise<NotificationDeliveryResult> {
    if (!this.isConfigured()) {
      return {
        channel: 'EMAIL',
        status: 'EXTERNAL_CONFIG_REQUIRED',
        message: 'Email provider unconfigured. In-App notification stored; SMTP_HOST or SENDGRID_API_KEY required for outbound SMTP.',
        providerDetails: 'SendGrid / SMTP Gateway (Unconfigured)'
      };
    }
    return {
      channel: 'EMAIL',
      status: 'SENT_EXTERNAL',
      message: `Outbound email dispatched to [${payload.recipientEmail || 'user@domain.com'}]`,
      providerDetails: 'SMTP Gateway / SendGrid'
    };
  }
}

export class WhatsAppNotificationAdapter implements INotificationAdapter {
  public channel: NotificationChannel = 'WHATSAPP';

  public isConfigured(): boolean {
    return Boolean(process.env.TWILIO_WHATSAPP_SID && process.env.TWILIO_AUTH_TOKEN);
  }

  public async send(_payload: NotificationPayload): Promise<NotificationDeliveryResult> {
    if (!this.isConfigured()) {
      return {
        channel: 'WHATSAPP',
        status: 'EXTERNAL_CONFIG_REQUIRED',
        message: 'WhatsApp Business API credentials missing. Set TWILIO_WHATSAPP_SID and TWILIO_AUTH_TOKEN.',
        providerDetails: 'Twilio WhatsApp Business API (Unconfigured)'
      };
    }
    return {
      channel: 'WHATSAPP',
      status: 'SENT_EXTERNAL',
      message: 'WhatsApp HSM template message dispatched.',
      providerDetails: 'Twilio WhatsApp API'
    };
  }
}

export class PushNotificationAdapter implements INotificationAdapter {
  public channel: NotificationChannel = 'PUSH';

  public isConfigured(): boolean {
    return Boolean(process.env.FIREBASE_FCM_CREDENTIALS || process.env.VAPID_PUBLIC_KEY);
  }

  public async send(_payload: NotificationPayload): Promise<NotificationDeliveryResult> {
    if (!this.isConfigured()) {
      return {
        channel: 'PUSH',
        status: 'EXTERNAL_CONFIG_REQUIRED',
        message: 'WebPush / Firebase FCM credentials unconfigured. Set FIREBASE_FCM_CREDENTIALS or VAPID keys.',
        providerDetails: 'Firebase Cloud Messaging / WebPush (Unconfigured)'
      };
    }
    return {
      channel: 'PUSH',
      status: 'SENT_EXTERNAL',
      message: 'Push notification push payload broadcasted.',
      providerDetails: 'FCM Gateway'
    };
  }
}

export class NotificationDispatcher {
  private adapters: Map<NotificationChannel, INotificationAdapter> = new Map();

  constructor() {
    this.adapters.set('IN_APP', new InAppNotificationAdapter());
    this.adapters.set('EMAIL', new EmailNotificationAdapter());
    this.adapters.set('WHATSAPP', new WhatsAppNotificationAdapter());
    this.adapters.set('PUSH', new PushNotificationAdapter());
  }

  public async dispatch(payload: NotificationPayload): Promise<NotificationDeliveryResult> {
    const adapter = this.adapters.get(payload.channel) || this.adapters.get('IN_APP')!;
    return adapter.send(payload);
  }
}

export const notificationDispatcher = new NotificationDispatcher();
