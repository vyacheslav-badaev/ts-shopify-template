// @ts-check
import { join } from 'path';
import { readFileSync } from 'fs';
import express from 'express';
import serveStatic from 'serve-static';

import { shopifyContextOffline } from './backend/services/shopify.js';
import productCreator from './product-creator.js';
import GDPRWebhookHandlers from './gdpr.js';

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
	process.env.NODE_ENV === 'production'
		? `${process.cwd()}/frontend/dist`
		: `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopifyContextOffline.config.auth.path, shopifyContextOffline.auth.begin());
app.get(
	shopifyContextOffline.config.auth.callbackPath,
	shopifyContextOffline.auth.callback(),
	shopifyContextOffline.redirectToShopifyOrAppRoot()
);
app.post(
	shopifyContextOffline.config.webhooks.path,
	// @ts-ignore
	shopifyContextOffline.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this point will require an active session
app.use('/api/*', shopifyContextOffline.validateAuthenticatedSession());

app.use(express.json());

app.get('/api/products/count', async (_req, res) => {
	const countData = await shopifyContextOffline.api.rest.Product.count({
		session: res.locals.shopify.session,
	});
	res.status(200).send(countData);
});

app.get('/api/products/create', async (_req, res) => {
	let status = 200;
	let error = null;

	console.log('res.locals.shopify.session', res.locals.shopify.session);

	try {
		await productCreator(res.locals.shopify.session);
	} catch (e) {
		console.log(`Failed to process products/create: ${e.message}`);
		status = 500;
		error = e.message;
	}
	res.status(status).send({ success: status === 200, error });
});

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use('/*', shopifyContextOffline.ensureInstalledOnShop(), async (_req, res, _next) => {
	return res
		.status(200)
		.set('Content-Type', 'text/html')
		.send(readFileSync(join(STATIC_PATH, 'index.html')));
});

app.listen(PORT);
