export interface ISession {
	id: string;
	shop: string;
	state: string;
	isOnline: boolean;
	scope?: string;
	accessToken: string;
	expires?: Date;
}
