import { Card, Heading, Image, Layout, Link, Page, Stack, TextContainer } from '@shopify/polaris';
import { TitleBar } from '@shopify/app-bridge-react';

import { GlobalStyles, trophyImage } from '../assets';

import { ProductsCard } from '../components';
import { useContext } from 'react';
import { ShopProfileContext } from '../components/providers/ShopProfileProvider';

export default function HomePage() {
	const shopContext = useContext(ShopProfileContext);
	return (
		<Page narrowWidth>
			<TitleBar title="Template App Example" primaryAction={null} />
			<Layout>
				<Layout.Section>
					<div className={GlobalStyles.exampleWrapper}>
						<Card sectioned>
							<Stack wrap={false} spacing="extraTight" distribution="trailing" alignment="center">
								<Stack.Item fill>
									<TextContainer spacing="loose">
										<Heading>
											Welcome {shopContext.dataValue.name}, Nice work on building a Shopify app 🎉
										</Heading>
										<p>
											Your app is ready to explore! It contains everything you need to get started
											including the{' '}
											<Link url="https://polaris.shopify.com/" external>
												Polaris design system
											</Link>
											,{' '}
											<Link url="https://shopify.dev/api/admin-graphql" external>
												Shopify Admin API
											</Link>
											, and{' '}
											<Link url="https://shopify.dev/apps/tools/app-bridge" external>
												App Bridge
											</Link>{' '}
											UI library and components.
										</p>
										<p>
											Ready to go? Start populating your app with some sample products to view and
											test in your store.{' '}
										</p>
										<p>
											Learn more about building out your app in{' '}
											<Link
												url="https://shopify.dev/apps/getting-started/add-functionality"
												external
											>
												this Shopify tutorial
											</Link>{' '}
											📚{' '}
										</p>
									</TextContainer>
								</Stack.Item>
								<Stack.Item>
									<div style={{ padding: '0 20px' }}>
										<Image
											source={trophyImage}
											alt="Nice work on building a Shopify app"
											width={120}
										/>
									</div>
								</Stack.Item>
							</Stack>
						</Card>
					</div>
				</Layout.Section>
				<Layout.Section>
					<ProductsCard />
				</Layout.Section>
			</Layout>
		</Page>
	);
}
