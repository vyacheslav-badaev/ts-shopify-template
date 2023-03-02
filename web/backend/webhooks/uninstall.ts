import { DeliveryMethod } from '@shopify/shopify-api';
import { shopify } from '../services/shopify.js';
import { updateShopByDomain } from '../services/db-shop.js';
import { WebhookHandlersParam } from '@shopify/shopify-app-express/build/ts/webhooks/types';

const WEBHOOK_PATH = shopify.config.webhooks.path;

const handler: WebhookHandlersParam = {
	APP_UNINSTALLED: {
		deliveryMethod: DeliveryMethod.Http,
		callbackUrl: WEBHOOK_PATH,
		callback: async (topic, shop, body, webhookId) => {
			console.log('APP_UNINSTALLED topic', topic);
			console.log('APP_UNINSTALLED shop', shop);
			console.log('APP_UNINSTALLED body', body);
			console.log('APP_UNINSTALLED webhookId', webhookId);
			try {
				await updateShopByDomain(shop, {
					active: false,
				});
			} catch (e) {
				if (e instanceof Error) {
					console.error('APP_UNINSTALLED webhook error: ', e.message);
				}
			}
		},
	},
};

export default handler;
