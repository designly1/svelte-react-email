import { Section, Text, Container } from '@react-email/components';
import EmailTemplate from './EmailTemplate';
import React from 'react';

interface CodeEmailProps {
	intro?: string;
	code: string;
}

export default function CodeEmail({ intro, code }: CodeEmailProps) {
	return (
		<EmailTemplate>
			<Section>
				<Container>
					{intro && <Text style={{ fontSize: 18, marginBottom: 32 }}>{intro}</Text>}
					<Text style={{ fontSize: 18, marginBottom: 10 }}>Your code is:</Text>
					<Text
						style={{
							fontSize: 32,
							fontWeight: 'bold',
							letterSpacing: 2,
							color: '#fff',
							background: '#1e293b',
							padding: '16px 32px',
							borderRadius: 6,
							display: 'inline-block',
							marginBottom: 32
						}}
					>
						{code}
					</Text>
					<Text style={{ fontSize: 14, color: '#cbd5e1', marginTop: 16 }}>
						If you did not request this code, you can safely ignore this email.
					</Text>
				</Container>
			</Section>
		</EmailTemplate>
	);
}
