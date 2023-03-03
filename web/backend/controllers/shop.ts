import { getShopByDomain } from '../services/db-shop.js';
import { Request, Response } from 'express';

export const getProfile = async (req: Request, res: Response) => {
	try {
		const session = res.locals.shopify.session;
		const shopDB = await getShopByDomain(session.shop);
		if (!shopDB) {
			throw new Error('Shop not exist in database');
		}
		delete shopDB.accessToken;
		res.status(200).send(shopDB);
	} catch (e) {
		if (e instanceof Error) {
			console.error('Error: ', e.message);
			res.status(500).send({
				error: e.message,
			});
		}
	}
};
