import { DeliveryMethod } from '@shopify/shopify-api';
import { shopify } from '../services/shopify.js';
import { WebhookHandlersParam } from '@shopify/shopify-app-express/build/ts/webhooks/types';

const WEBHOOK_PATH = shopify.config.webhooks.path;

const handler: WebhookHandlersParam = {
	APP_SUBSCRIPTIONS_UPDATE: {
		deliveryMethod: DeliveryMethod.Http,
		callbackUrl: WEBHOOK_PATH,
		callback: async (topic, shop, body, webhookId) => {
			console.log('APP_SUBSCRIPTIONS_UPDATE topic', topic);
			console.log('APP_SUBSCRIPTIONS_UPDATE shop', shop);
			console.log('APP_SUBSCRIPTIONS_UPDATE body', body);
			console.log('APP_SUBSCRIPTIONS_UPDATE body type', typeof body);
			console.log('APP_SUBSCRIPTIONS_UPDATE webhookId', webhookId);
		},
	},
};

export default handler;
