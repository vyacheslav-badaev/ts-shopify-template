import { billingConfig, shopify } from '../services/shopify.js';
import { clientSideRedirection } from '../services/utils.js';
import { RequestHandler } from 'express';

export const ensureHasBilling: () => RequestHandler = () => async (req, res, next) => {
	const { shop } = req.query as { shop: string };
	const sessionId = shopify.api.session.getOfflineId(shop);
	const session = await shopify.config.sessionStorage.loadSession(sessionId);

	const hasPayment = await shopify.api.billing.check({
		session,
		plans: Object.keys(billingConfig),
		isTest: process.env.NODE_ENV !== 'production',
	});

	if (hasPayment) {
		next();
	} else {
		// Either request payment now (if single plan) or redirect to plan selection page (if multiple plans available), e.g.
		const confirmationUrl = await shopify.api.billing.request({
			session,
			plan: Object.keys(billingConfig)[0],
			isTest: process.env.NODE_ENV !== 'production',
		});

		if (req.query.embedded === '1') {
			return clientSideRedirection(req, res, confirmationUrl);
		}
		return res.redirect(confirmationUrl);
	}
};
