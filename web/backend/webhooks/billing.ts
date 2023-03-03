import { DeliveryMethod } from '@shopify/shopify-api';
import { shopify } from '../services/shopify.js';
import { WebhookHandlersParam } from '@shopify/shopify-app-express/build/ts/webhooks/types';
import { Subscription } from '../types/subscription';
import { updateShopByDomain } from '../services/db-shop.js';

const WEBHOOK_PATH = shopify.config.webhooks.path;

const handler: WebhookHandlersParam = {
	APP_SUBSCRIPTIONS_UPDATE: {
		deliveryMethod: DeliveryMethod.Http,
		callbackUrl: WEBHOOK_PATH,
		callback: async (topic, shop, body, webhookId) => {
			console.log('APP_SUBSCRIPTIONS_UPDATE topic', topic);
			console.log('APP_SUBSCRIPTIONS_UPDATE shop', shop);
			console.log('APP_SUBSCRIPTIONS_UPDATE body', body);
			console.log('APP_SUBSCRIPTIONS_UPDATE webhookId', webhookId);
			const { app_subscription }: Subscription = JSON.parse(body);
			await updateShopByDomain(shop, {
				subscriptionId: app_subscription.admin_graphql_api_id,
				billingPlan: app_subscription.name,
				billingStatus: app_subscription.status,
			});
		},
	},
};

export default handler;
