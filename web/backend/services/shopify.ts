import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import { BillingInterval, LATEST_API_VERSION } from '@shopify/shopify-api';
import { shopifyApp } from '@shopify/shopify-app-express';
import { SQLiteSessionStorage } from '@shopify/shopify-app-session-storage-sqlite';
import { restResources } from '@shopify/shopify-api/rest/admin/2023-01';
import { IFetchShopData } from '../types/shop';
import { Session } from '@shopify/shopify-api/lib/session/session';

const DB_PATH = `${process.cwd()}/database.sqlite`;

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const billingConfig = {
	'My Shopify One-Time Charge': {
		// This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
		amount: 5.0,
		currencyCode: 'USD',
		interval: BillingInterval.OneTime,
	},
};

export const shopifyContextOffline = shopifyApp({
	api: {
		apiKey: process.env.SHOPIFY_API_KEY,
		apiSecretKey: process.env.SHOPIFY_API_SECRET,
		scopes: (process?.env?.SCOPES || '').split(',').map((s) => s.trim().toLowerCase()),
		apiVersion: LATEST_API_VERSION,
		restResources,
		billing: undefined, // or replace with billingConfig above to enable example billing
	},
	auth: {
		path: '/api/auth',
		callbackPath: '/api/auth/callback',
	},
	webhooks: {
		path: '/api/webhooks',
	},
	// This should be replaced with your preferred storage strategy
	sessionStorage: new SQLiteSessionStorage(DB_PATH),
});

export const shopifyContextOnline = shopifyApp({
	api: {
		apiKey: process.env.SHOPIFY_API_KEY,
		apiSecretKey: process.env.SHOPIFY_API_SECRET,
		scopes: (process?.env?.SCOPES || '').split(',').map((s) => s.trim().toLowerCase()),
		apiVersion: LATEST_API_VERSION,
		restResources,
		billing: undefined, // or replace with billingConfig above to enable example billing
	},
	auth: {
		path: '/api/auth',
		callbackPath: '/api/auth/callback',
	},
	webhooks: {
		path: '/api/webhooks',
	},
	useOnlineTokens: true,
	// This should be replaced with your preferred storage strategy
	sessionStorage: new SQLiteSessionStorage(DB_PATH),
});

export const fetchShopData = async (session: Session) => {
	try {
		const shopify = session.isOnline ? shopifyContextOnline : shopifyContextOffline;
		const FETCH_SHOP_QUERY = `
          query {
              shop {
                id
                myshopifyDomain
                contactEmail
                currencyCode
                description
                email
                name
                ianaTimezone
                orderNumberFormatPrefix
                orderNumberFormatSuffix
                timezoneAbbreviation
                timezoneOffset
                url
                plan {
                  displayName
                  shopifyPlus
                  partnerDevelopment
                }
                primaryDomain {
                  id
                  host
                }
              }
            }`;

		const client = new shopify.api.clients.Graphql({ session });
		const res = await client.query<IFetchShopData>({
			data: {
				query: FETCH_SHOP_QUERY,
				variables: {},
			},
		});

		return res.body?.data?.shop;
	} catch (e) {
		// logger.error('fetchShopData error:' + e.message);
		// logger.error('fetchShopData error session:' + session);
		return null;
	}
};
