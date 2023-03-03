import { Card, Collapsible, Icon, Layout, Page, Stack, TextContainer } from '@shopify/polaris';
import { ChevronDownMinor, ChevronRightMinor } from '@shopify/polaris-icons';
import { useCallback, useState } from 'react';

const FaqItem = ({ question, answer }) => {
	const [open, setOpen] = useState(false);
	const handleToggle = useCallback(() => setOpen((open) => !open), []);
	return (
		<Card>
			<Card.Section>
				<div style={{ width: '100% ' }}>
					<Stack distribution={'trailing'} alignment={'center'} wrap={false}>
						<Stack.Item fill>
							<TextContainer>
								<h1 style={{ fontWeight: 'bold', fontSize: '1rem' }}>{question}</h1>
							</TextContainer>
						</Stack.Item>
						<Stack.Item>
							<div onClick={handleToggle}>
								{open ? <Icon source={ChevronDownMinor} /> : <Icon source={ChevronRightMinor} />}
							</div>
						</Stack.Item>
					</Stack>
				</div>
				<Collapsible
					open={open}
					id="basic-collapsible"
					transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
					expandOnPrint
				>
					<div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
						<TextContainer>
							<p>{answer}</p>
						</TextContainer>
					</div>
				</Collapsible>
			</Card.Section>
		</Card>
	);
};

const FaqListMock: {
	question: string;
	answer: string;
}[] = [
	{
		question: `1 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam`,
		answer: `1 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus mauris ultrices eros in. 
		Urna porttitor rhoncus dolor purus. A pellentesque sit amet porttitor eget dolor morbi non. Sed elementum tempus egestas sed sed. 
		Sodales ut eu sem integer vitae justo eget magna. Nec dui nunc mattis enim ut. Dapibus ultrices in iaculis nunc sed augue lacus. 
		Varius duis at consectetur lorem donec massa sapien. Lectus sit amet est placerat in egestas erat. Tortor aliquam nulla facilisi cras fermentum odio eu. 
		Integer malesuada nunc vel risus. Maecenas ultricies mi eget mauris pharetra et ultrices. Tempus urna et pharetra pharetra massa.`,
	},
	{
		question: `2 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam`,
		answer: `2 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus mauris ultrices eros in. 
		Urna porttitor rhoncus dolor purus. A pellentesque sit amet porttitor eget dolor morbi non. Sed elementum tempus egestas sed sed. 
		Sodales ut eu sem integer vitae justo eget magna. Nec dui nunc mattis enim ut. Dapibus ultrices in iaculis nunc sed augue lacus. 
		Varius duis at consectetur lorem donec massa sapien. Lectus sit amet est placerat in egestas erat. Tortor aliquam nulla facilisi cras fermentum odio eu. 
		Integer malesuada nunc vel risus. Maecenas ultricies mi eget mauris pharetra et ultrices. Tempus urna et pharetra pharetra massa.`,
	},
	{
		question: `3 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam`,
		answer: `3 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus mauris ultrices eros in. 
		Urna porttitor rhoncus dolor purus. A pellentesque sit amet porttitor eget dolor morbi non. Sed elementum tempus egestas sed sed. 
		Sodales ut eu sem integer vitae justo eget magna. Nec dui nunc mattis enim ut. Dapibus ultrices in iaculis nunc sed augue lacus. 
		Varius duis at consectetur lorem donec massa sapien. Lectus sit amet est placerat in egestas erat. Tortor aliquam nulla facilisi cras fermentum odio eu. 
		Integer malesuada nunc vel risus. Maecenas ultricies mi eget mauris pharetra et ultrices. Tempus urna et pharetra pharetra massa.`,
	},
	{
		question: `4 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam`,
		answer: `4 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus mauris ultrices eros in. 
		Urna porttitor rhoncus dolor purus. A pellentesque sit amet porttitor eget dolor morbi non. Sed elementum tempus egestas sed sed. 
		Sodales ut eu sem integer vitae justo eget magna. Nec dui nunc mattis enim ut. Dapibus ultrices in iaculis nunc sed augue lacus. 
		Varius duis at consectetur lorem donec massa sapien. Lectus sit amet est placerat in egestas erat. Tortor aliquam nulla facilisi cras fermentum odio eu. 
		Integer malesuada nunc vel risus. Maecenas ultricies mi eget mauris pharetra et ultrices. Tempus urna et pharetra pharetra massa.`,
	},
];
const Faq = () => {
	return (
		<Page>
			<Layout>
				<Layout.Section>
					{FaqListMock.map((e) => (
						<FaqItem key={e.question} {...e} />
					))}
				</Layout.Section>
			</Layout>
		</Page>
	);
};

export default Faq;
