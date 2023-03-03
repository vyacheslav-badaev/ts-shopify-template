export interface Subscription {
	app_subscription: {
		admin_graphql_api_id: string;
		name: string;
		status: 'ACTIVE' | 'CANCELLED' | 'DECLINED' | 'EXPIRED' | 'FROZEN' | 'PENDING';
		admin_graphql_api_shop_id: string;
		created_at: string;
		updated_at: string;
		currency: string;
		capped_amount: string;
	};
}
