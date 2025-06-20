import { Html, Container, Section, Text } from '@react-email/components';
import React from 'react';

interface EmailTemplateProps {
	children: React.ReactNode;
}

export default function EmailTemplate({ children }: EmailTemplateProps) {
	return (
		<Html lang="en">
			<Section style={{ backgroundColor: '#1a202c', color: '#fff', padding: '40px 0' }}>
				<Container
					style={{
						maxWidth: 600,
						margin: '0 auto',
						background: '#2d3748',
						borderRadius: 8,
						boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
						padding: 32
					}}
				>
					{/* Header */}
					<Section
						style={{ borderBottom: '1px solid #334155', paddingBottom: 16, marginBottom: 32 }}
					>
						<Text style={{ fontSize: 24, fontWeight: 'bold', color: '#60a5fa', margin: 0 }}>
							ACME Inc.
						</Text>
					</Section>
					{/* Main Content */}
					{children}
					{/* Footer */}
					<Section style={{ borderTop: '1px solid #334155', marginTop: 40, paddingTop: 16 }}>
						<Text style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
							© {new Date().getFullYear()} ACME Inc. All rights reserved.
						</Text>
						<Text style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
							<a
								href="https://example.com/terms"
								style={{ color: '#94a3b8', textDecoration: 'underline', marginRight: 12 }}
							>
								Terms
							</a>
							<a
								href="https://example.com/privacy"
								style={{ color: '#94a3b8', textDecoration: 'underline', marginRight: 12 }}
							>
								Privacy
							</a>
							<a
								href="https://example.com/contact"
								style={{ color: '#94a3b8', textDecoration: 'underline' }}
							>
								Contact
							</a>
						</Text>
					</Section>
				</Container>
			</Section>
		</Html>
	);
}
