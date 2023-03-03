import { fetchShopData } from '../services/shopify.js';
import { createNewShop, getShopByDomain, updateShopByDomain } from '../services/db-shop.js';
import { RequestHandler } from 'express';

const AfterAuth: () => RequestHandler = () => async (req, res, next) => {
	try {
		const session = res.locals.shopify.session;
		const shopShopify = await fetchShopData(session);
		const shopDb = await getShopByDomain(session.shop);

		if (!shopShopify) {
			throw new Error('Shopify API error. Can not fetch data for store ' + session.shop);
		}

		if (!shopDb) {
			await createNewShop({
				myshopifyDomain: shopShopify.myshopifyDomain,
				active: true,
				accessToken: session.accessToken,
				gid: shopShopify.id,
				name: shopShopify.name,
				contactEmail: shopShopify.contactEmail,
				currencyCode: shopShopify.currencyCode,
				description: shopShopify.description || '',
				email: shopShopify.email,
				primaryDomain: shopShopify.primaryDomain.host,
				url: shopShopify.url,
				billingPlan: null,
				subscriptionId: null,
				billingStatus: null,
			});
		} else {
			await updateShopByDomain(session.shop, {
				active: true,
				accessToken: session.accessToken,
				gid: shopShopify.id,
				name: shopShopify.name,
				contactEmail: shopShopify.contactEmail,
				currencyCode: shopShopify.currencyCode,
				description: shopShopify.description || '',
				email: shopShopify.email,
				primaryDomain: shopShopify.primaryDomain.host,
				url: shopShopify.url,
				billingPlan: null,
				subscriptionId: null,
				billingStatus: null,
			});
		}

		next();
	} catch (e) {
		if (e instanceof Error) {
			return res.status(400).send({
				error: e.message,
			});
		}
	}
};

export default AfterAuth;
