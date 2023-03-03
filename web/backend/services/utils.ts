import { getShopByDomain } from './db-shop.js';
import { shopify } from './shopify.js';
import { Session } from '@shopify/shopify-api/lib/session/session';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';

export function randomTitle() {
	return faker.commerce.productName();
}

export function randomPrice() {
	return Math.round((Math.random() * 10 + Number.EPSILON) * 100) / 100;
}

export const registerWebhooks = async (domain: string) => {
	try {
		const shop = await getShopByDomain(domain);

		if (!shop) return;

		if (!shop.active) return;

		const session = {
			shop: shop.myshopifyDomain,
			accessToken: shop.accessToken,
		};

		await shopify.api.webhooks.register({ session: session as Session });
	} catch (e) {
		if (e instanceof Error) {
			console.error('Error register webhooks for dev store: ', e.message);
		}
	}
};

export const clientSideRedirection = (req: Request, res: Response, redirectUri: string) => {
	const queryParams = new URLSearchParams({
		...req.query,
		redirectUri: redirectUri,
	}).toString();

	return res.redirect(`/exitiframe?${queryParams}`);
};
