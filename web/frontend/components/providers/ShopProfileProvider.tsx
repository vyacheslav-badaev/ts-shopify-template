import React, { useMemo } from 'react';
import { useAppQuery } from '../../hooks';
import { Banner, Frame, Loading } from '@shopify/polaris';
import { IShopProfile } from '../../types/shop.interface';
import { useLocation } from 'react-router-dom';

export const ShopProfileContext = React.createContext<IShopProfile>(undefined);

export default function ShopProfileProvider({ children }) {
	const location = useLocation();
	const { data, status } = useAppQuery<IShopProfile, Error>({
		url: '/api/profile',
		fetchInit: {},
		reactQueryOptions: {},
	});
	const dataValue = useMemo(() => data, [data]);

	if (location.pathname === '/exit-iframe') {
		console.log('location2', location);
		return <>{children}</>;
	}

	if (status === 'error') {
		return (
			<Frame>
				<div style={{ margin: '2rem' }}>
					<Banner status={'critical'} title={'Fetch profile error'}>
						<p>API Server Error. Contact with support</p>
					</Banner>
				</div>
			</Frame>
		);
	}

	if (status === 'loading') {
		return (
			<Frame>
				<Loading />
			</Frame>
		);
	}

	return <ShopProfileContext.Provider value={dataValue}>{children}</ShopProfileContext.Provider>;
}
