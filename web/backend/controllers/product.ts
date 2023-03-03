import { productCreator, shopify } from '../services/shopify.js';
import { Response } from 'express';

export const getProductsCount = async (_req: Request, res: Response) => {
	try {
		const countData = await shopify.api.rest.Product.count({
			session: res.locals.shopify.session,
		});

		res.status(200).send(countData);
	} catch (e) {
		if (e instanceof Error) {
			console.error('Error: ', e.message);
			res.status(500).send({ error: e.message });
		}
	}
};

export const createNewProducts = async (
	_req: Omit<Request, 'body'> & { body: { count: number } },
	res: Response
) => {
	let status = 200;
	let error = '';
	const { count = 5 }: { count: number } = _req.body;

	try {
		await productCreator(res.locals.shopify.session, count);
	} catch (e) {
		if (e instanceof Error) {
			console.error(`Failed to process products/create: ${e.message}`);
			status = 500;
			error = e.message;
		}
	}

	res.status(status).send({ success: status === 200, error });
};
