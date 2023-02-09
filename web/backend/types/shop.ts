export interface IFetchShopData {
	data: {
		shop: {
			id: string;
			myshopifyDomain: string;
			contactEmail: string;
			currencyCode: string;
			description: string;
			email: string;
			name: string;
			ianaTimezone: string;
			timezoneOffset: string;
			orderNumberFormatPrefix: string;
			orderNumberFormatSuffix: string;
			timezoneAbbreviation: string;
			url: string;
			plan: {
				displayName: string;
				shopifyPlus: boolean;
				partnerDevelopment: boolean;
			};
			primaryDomain: {
				id: string;
				host: string;
			};
		};
	};
}
