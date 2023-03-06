import { join } from 'path';
import { readFileSync } from 'fs';
import express from 'express';
import serveStatic from 'serve-static';
import { shopify } from './backend/services/shopify.js';
import GDPRWebhookHandlers from './backend/webhooks/gdpr.js';
import UninstallWebhookHandlers from './backend/webhooks/uninstall.js';
import BillingWebhookHandlers from './backend/webhooks/billing.js';
import protectedApiRouter from './backend/router.js';
import afterAuth from './backend/middlewares/afterAuth.js';
import { WebhookHandlersParam } from '@shopify/shopify-app-express/build/ts/webhooks/types';
import { registerWebhooks } from './backend/services/utils.js';
import { ensureHasBilling } from './backend/middlewares/ensureHasBilling.js';
import { logger } from './backend/services/logger.js';

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
	process.env.NODE_ENV === 'production'
		? `${process.cwd()}/frontend/dist`
		: `${process.cwd()}/frontend/`;
const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
	shopify.config.auth.callbackPath,
	shopify.auth.callback(),
	afterAuth(),
	shopify.redirectToShopifyOrAppRoot()
);
app.post(
	shopify.config.webhooks.path,
	shopify.processWebhooks({
		webhookHandlers: {
			...GDPRWebhookHandlers,
			...UninstallWebhookHandlers,
			...BillingWebhookHandlers,
		} as WebhookHandlersParam,
	})
);

// All endpoints after this point will require an active session
app.use('/api', shopify.validateAuthenticatedSession(), express.json(), protectedApiRouter);
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use('/*', shopify.ensureInstalledOnShop(), ensureHasBilling(), (_req, res) => {
	return res
		.status(200)
		.set('Content-Type', 'text/html')
		.send(readFileSync(join(STATIC_PATH, 'index.html')));
});

app.listen(PORT, async () => {
	// dev env re-register webhooks for dev store
	// after restart ngrok update domain everytime
	// that's why webhooks crash
	if (process.env.NODE_ENV === 'development' && process.env.DEV_STORE) {
		await registerWebhooks(process.env.DEV_STORE);
	}
	logger.info('Server was started on port: ' + PORT);
});
