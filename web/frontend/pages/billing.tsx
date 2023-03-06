import { useCallback, useContext, useState } from 'react';
import { Layout, Loading, Page, SettingToggle, TextContainer } from '@shopify/polaris';
import { useAppQuery } from '../hooks';
import { useAppMutation } from '../hooks/useAppMutation';
import { Toast, useAppBridge } from '@shopify/app-bridge-react';
import { ShopProfileContext } from '../components/providers/ShopProfileProvider';
import { IPlan } from '../types/plan.interface';
import { Redirect } from '@shopify/app-bridge/actions';

export default function Billing() {
	const app = useAppBridge();
	const shopContext = useContext(ShopProfileContext);
	const [toastProps, setToastProps] = useState({ content: null, error: false });
	const [changeRequest, setChangeRequest] = useState(false);

	const { data: plansData, isLoading } = useAppQuery<{ [key: string]: IPlan }, Error>({
		url: '/api/billing-plans',
		fetchInit: {},
		reactQueryOptions: {},
	});

	const { mutateAsync: handleChange, isLoading: isLoadingPopulate } = useAppMutation<
		{ confirmationUrl: string },
		Error
	>({
		url: '/api/billing-plan-change',
		fetchInit: {
			method: 'POST',
		},
		reactMutationOptions: {
			onError: () => {
				setToastProps({
					content: 'There was an error change plan',
					error: true,
				});
			},
		},
	});

	const handleToggle = useCallback(async (plan) => {
		setChangeRequest(true);
		const { confirmationUrl = null } = await handleChange({ plan: plan });
		if (!confirmationUrl) {
			setToastProps({
				content: 'Server side error',
				error: true,
			});
			return;
		}
		const redirect = Redirect.create(app);
		redirect.dispatch(Redirect.Action.REMOTE, confirmationUrl);
	}, []);

	const planList = plansData ? Object.entries(plansData) : [];
	const currentPlan = shopContext.dataValue.billingPlan;
	const toastMarkup = toastProps.content && !isLoading && (
		<Toast {...toastProps} onDismiss={() => setToastProps({ content: null, error: false })} />
	);

	if (isLoading) return <Loading />;

	return (
		<Page>
			{toastMarkup}
			{changeRequest && <Loading />}
			<Layout>
				<Layout.Section>
					{planList.map(([planName, planData]) => {
						return (
							<SettingToggle
								key={planName}
								action={{
									disabled: changeRequest,
									content:
										planName.toLowerCase() === currentPlan.toLowerCase() ? 'Current' : 'Change',
									onAction: () =>
										planName.toLowerCase() !== currentPlan.toLowerCase()
											? handleToggle(planName)
											: null,
								}}
								enabled={planName.toLowerCase() === currentPlan.toLowerCase()}
							>
								<TextContainer>
									{planName.toUpperCase()} - {planData.amount} {planData.currencyCode}
								</TextContainer>
							</SettingToggle>
						);
					})}
				</Layout.Section>
			</Layout>
		</Page>
	);
}
