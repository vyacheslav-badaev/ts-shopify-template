import { Request, Response } from 'express';
import { billingConfig, shopify } from '../services/shopify.js';
import { logger } from '../services/logger.js';
import { prepareErrorMessage } from '../services/utils.js';

export const getBillingPlans = async (_req: Request, res: Response) => {
	try {
		res.status(200).send(billingConfig);
	} catch (e) {
		if (e instanceof Error) {
			logger.error(prepareErrorMessage(e));
			res.status(500).send({
				error: e.message,
			});
		}
	}
};

export const changeBillingPlan = async (
	_req: Omit<Request, 'body'> & { body: { plan: string } },
	res: Response
) => {
	try {
		const { plan = null } = _req.body;
		const session = res.locals.shopify.session;

		if (!plan) {
			throw new Error('Plan is empty');
		}

		const confirmationUrl = await shopify.api.billing.request({
			session,
			plan,
			isTest: process.env.NODE_ENV !== 'production',
		});

		res.status(200).send({
			confirmationUrl,
		});
	} catch (e) {
		if (e instanceof Error) {
			logger.error(prepareErrorMessage(e));
			res.status(500).send({
				error: e.message,
			});
		}
	}
};
