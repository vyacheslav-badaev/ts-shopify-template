import { BrowserRouter } from 'react-router-dom';
import { NavigationMenu } from '@shopify/app-bridge-react';
import Routes from './Routes';

import { AppBridgeProvider, PolarisProvider, QueryProvider } from './components';
import ShopProfileProvider from './components/providers/ShopProfileProvider';
import { Frame } from '@shopify/polaris';

export default function App() {
	// Any .tsx or .jsx files in /pages will become a route
	// See documentation for <Routes /> for more info

	const pages = import.meta.globEager('./pages/**/!(*.test.[jt]sx)*.([jt]sx)');

	return (
		<PolarisProvider>
			<BrowserRouter>
				<AppBridgeProvider>
					<QueryProvider>
						<Frame>
							<ShopProfileProvider>
								<NavigationMenu
									navigationLinks={[
										{
											label: 'Billing',
											destination: '/billing',
										},
										{
											label: 'FAQ',
											destination: '/faq',
										},
									]}
								/>
								<Routes pages={pages} />
							</ShopProfileProvider>
						</Frame>
					</QueryProvider>
				</AppBridgeProvider>
			</BrowserRouter>
		</PolarisProvider>
	);
}
