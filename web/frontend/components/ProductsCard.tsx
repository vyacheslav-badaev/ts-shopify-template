import { useState } from 'react';
import { Card, DisplayText, Heading, TextContainer, TextStyle } from '@shopify/polaris';
import { Toast } from '@shopify/app-bridge-react';
import { useAppQuery } from '../hooks';
import { useAppMutation } from '../hooks/useAppMutation';

export function ProductsCard() {
	const emptyToastProps = { content: null, error: false };
	const [toastProps, setToastProps] = useState(emptyToastProps);

	const {
		data,
		refetch: refetchProductCount,
		isLoading: isLoadingCount,
		isRefetching: isRefetchingCount,
	} = useAppQuery<{ count: number }, Error>({
		url: '/api/products/count',
		fetchInit: {},
		reactQueryOptions: {},
	});

	const { mutate: handlePopulate, isLoading: isLoadingPopulate } = useAppMutation({
		url: '/api/products/create',
		fetchInit: {
			method: 'POST',
			body: JSON.stringify({ count: 10 }),
		},
		reactMutationOptions: {
			onSuccess: async () => {
				await refetchProductCount();
				setToastProps({ content: '5 products created!', error: false });
			},
			onError: () => {
				setToastProps({
					content: 'There was an error creating products',
					error: true,
				});
			},
		},
	});

	const toastMarkup = toastProps.content && !isRefetchingCount && (
		<Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
	);

	return (
		<>
			{toastMarkup}
			<Card
				title="Product Counter"
				sectioned
				primaryFooterAction={{
					content: 'Populate 10 products',
					onAction: handlePopulate,
					loading: isLoadingCount || isLoadingPopulate,
				}}
			>
				<TextContainer spacing="loose">
					<p>
						Sample products are created with a default title and price. You can remove them at any
						time.
					</p>
					<Heading element="h4">
						TOTAL PRODUCTS
						<DisplayText size="medium">
							<TextStyle variation="strong">
								{isLoadingCount || isLoadingPopulate ? '-' : data.count}
							</TextStyle>
						</DisplayText>
					</Heading>
				</TextContainer>
			</Card>
		</>
	);
}
