import { Session } from '@shopify/shopify-api/lib/session/session';

export {};

declare global {
	interface Window {
		__SHOPIFY_DEV_HOST: string;
	}

	namespace Express {
		interface Locals extends Record<string, any> {
			shopify: {
				session: Session;
			};
		}
	}
}
