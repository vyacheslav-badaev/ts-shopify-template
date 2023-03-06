import { getShopByDomain } from './db-shop.js';
import { shopify } from './shopify.js';
import { Session } from '@shopify/shopify-api/lib/session/session';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';
import { parse } from 'stack-trace';
import { logger } from './logger.js';

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
			logger.error(prepareErrorMessage(e));
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

export const prepareErrorMessage = (e: Error) => {
	const metadata = parse(e);
	let stackError = '';
	const basePath = process.cwd();
	metadata.forEach((m, index) => {
		const arrow = index === 0 ? '' : '> ';
		const fileName = m?.fileName.replace('file://', '').replace(basePath, '') || '';
		const functionName = m?.functionName ? ` | ${m?.functionName}` : '';
		const lineNumber = m?.lineNumber ? `:${m.lineNumber}` : '';
		const columnNumber = m?.columnNumber ? `:${m.columnNumber}` : '';
		if (fileName) {
			stackError = `${stackError}${arrow}[${fileName}${functionName}${lineNumber}${columnNumber}] `;
		}
	});

	return stackError + e.message;
};
