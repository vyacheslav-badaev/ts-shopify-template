import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import {
	BillingInterval,
	BillingReplacementBehavior,
	GraphqlQueryError,
	LATEST_API_VERSION,
} from '@shopify/shopify-api';
import { shopifyApp } from '@shopify/shopify-app-express';
import { MongoDBSessionStorage } from '@shopify/shopify-app-session-storage-mongodb';
import { restResources } from '@shopify/shopify-api/rest/admin/2023-01';
import { IFetchShopData } from '../types/shop';
import { Session } from '@shopify/shopify-api/lib/session/session';
import { randomPrice, randomTitle } from './utils.js';
import { BillingConfig } from '@shopify/shopify-api/lib/billing/types';

dotenv.config();

const DB_NAME = process.env?.DATABASE_DB_NAME || 'shopify-app';
const DB_PATH = new URL(process.env?.DATABASE_URL_BASE);

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
export const billingConfig: BillingConfig = {
	basic: {
		// This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
		amount: 5.0,
		currencyCode: 'USD',
		interval: BillingInterval.Every30Days,
		trialDays: 14,
		replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
	},
	standard: {
		// This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
		amount: 15.0,
		currencyCode: 'USD',
		interval: BillingInterval.Every30Days,
		trialDays: null,
		replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
	},
	pro: {
		// This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
		amount: 15.0,
		currencyCode: 'USD',
		interval: BillingInterval.Every30Days,
		trialDays: null,
		replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
	},
};

export const shopify = shopifyApp({
	api: {
		apiKey: process.env.SHOPIFY_API_KEY,
		apiSecretKey: process.env.SHOPIFY_API_SECRET,
		scopes: (process?.env?.SCOPES || '').split(',').map((s) => s.trim().toLowerCase()),
		apiVersion: LATEST_API_VERSION,
		restResources,
		billing: billingConfig,
	},
	auth: {
		path: '/api/auth',
		callbackPath: '/api/auth/callback',
	},
	webhooks: {
		path: '/api/webhooks',
	},
	// This should be replaced with your preferred storage strategy
	sessionStorage: new MongoDBSessionStorage(DB_PATH, DB_NAME),
});

export const FETCH_SHOP_QUERY = `
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
	}
`;

export const fetchShopData = async (session: Session) => {
	try {
		const client = new shopify.api.clients.Graphql({ session });
		const res = await client.query<IFetchShopData>({
			data: {
				query: FETCH_SHOP_QUERY,
				variables: {},
			},
		});

		return res.body?.data?.shop;
	} catch (e) {
		if (e instanceof Error) {
			console.error('Error:', e.message);
		}
		return null;
	}
};

export const CREATE_PRODUCTS_MUTATION = `
  mutation populateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
      }
    }
  }
`;

export async function productCreator(session: Session, count = 5) {
	const client = new shopify.api.clients.Graphql({ session });

	try {
		for (let i = 0; i < count; i++) {
			await client.query({
				data: {
					query: CREATE_PRODUCTS_MUTATION,
					variables: {
						input: {
							title: `${randomTitle()}`,
							variants: [{ price: randomPrice() }],
						},
					},
				},
			});
		}
	} catch (error) {
		if (error instanceof GraphqlQueryError) {
			throw new Error(`${error.message}\n${JSON.stringify(error.response, null, 2)}`);
		} else {
			throw error;
		}
	}
}
