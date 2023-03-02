import { DeliveryMethod } from '@shopify/shopify-api';
import { shopify } from '../services/shopify.js';
import { WebhookHandlersParam } from '@shopify/shopify-app-express/build/ts/webhooks/types';

const WEBHOOK_PATH = shopify.config.webhooks.path;
const handler: WebhookHandlersParam = {
	/**
	 * Customers can request their data from a store owner. When this happens,
	 * Shopify invokes this webhook.
	 *
	 * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
	 */
	CUSTOMERS_DATA_REQUEST: {
		deliveryMethod: DeliveryMethod.Http,
		callbackUrl: WEBHOOK_PATH,
		callback: async (topic, shop, body, webhookId) => {
			console.log('CUSTOMERS_DATA_REQUEST topic', topic);
			console.log('CUSTOMERS_DATA_REQUEST shop', shop);
			console.log('CUSTOMERS_DATA_REQUEST body', body);
			console.log('CUSTOMERS_DATA_REQUEST webhookId', webhookId);
			// const payload = JSON.parse(body);
			// Payload has the following shape:
			// {
			//   "shop_id": 954889,
			//   "shop_domain": "{shop}.myshopify.com",
			//   "orders_requested": [
			//     299938,
			//     280263,
			//     220458
			//   ],
			//   "customer": {
			//     "id": 191167,
			//     "email": "john@example.com",
			//     "phone": "555-625-1199"
			//   },
			//   "data_request": {
			//     "id": 9999
			//   }
			// }
		},
	},

	/**
	 * Store owners can request that data is deleted on behalf of a customer. When
	 * this happens, Shopify invokes this webhook.
	 *
	 * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#customers-redact
	 */
	CUSTOMERS_REDACT: {
		deliveryMethod: DeliveryMethod.Http,
		callbackUrl: WEBHOOK_PATH,
		callback: async (topic, shop, body, webhookId) => {
			console.log('CUSTOMERS_REDACT topic', topic);
			console.log('CUSTOMERS_REDACT shop', shop);
			console.log('CUSTOMERS_REDACT body', body);
			console.log('CUSTOMERS_REDACT webhookId', webhookId);
			// const payload = JSON.parse(body);
			// Payload has the following shape:
			// {
			//   "shop_id": 954889,
			//   "shop_domain": "{shop}.myshopify.com",
			//   "customer": {
			//     "id": 191167,
			//     "email": "john@example.com",
			//     "phone": "555-625-1199"
			//   },
			//   "orders_to_redact": [
			//     299938,
			//     280263,
			//     220458
			//   ]
			// }
		},
	},

	/**
	 * 48 hours after a store owner uninstalls your app, Shopify invokes this
	 * webhook.
	 *
	 * https://shopify.dev/apps/webhooks/configuration/mandatory-webhooks#shop-redact
	 */
	SHOP_REDACT: {
		deliveryMethod: DeliveryMethod.Http,
		callbackUrl: WEBHOOK_PATH,
		callback: async (topic, shop, body, webhookId) => {
			console.log('SHOP_REDACT topic', topic);
			console.log('SHOP_REDACT shop', shop);
			console.log('SHOP_REDACT body', body);
			console.log('SHOP_REDACT webhookId', webhookId);
			// const payload = JSON.parse(body);
			// Payload has the following shape:
			// {
			//   "shop_id": 954889,
			//   "shop_domain": "{shop}.myshopify.com"
			// }
		},
	},
};

export default handler;
