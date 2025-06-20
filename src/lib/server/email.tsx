import React from 'react';
import { render } from '@react-email/render';
import CodeEmail from '../emails/CodeEmail';

import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '$env/static/private';

function getClient() {
	return new SESClient({
		credentials: {
			accessKeyId: AWS_ACCESS_KEY_ID,
			secretAccessKey: AWS_SECRET_ACCESS_KEY
		},
		region: 'us-east-2'
	});
}

const Source = 'ACME Inc. <noreply@xisms.app>';

interface SendCodeEmailProps {
	email: string;
	code: string;
	intro?: string;
}

export async function sendCodeEmail({ email, code, intro }: SendCodeEmailProps) {
	const client = getClient();
	const html = await render(<CodeEmail code={code} intro={intro} />);
	const command = new SendEmailCommand({
		Source,
		Destination: {
			ToAddresses: [email]
		},
		Message: {
			Subject: {
				Data: 'Your XiSMS Code'
			},
			Body: {
				Html: {
					Data: html
				}
			}
		}
	});
	const response = await client.send(command);
	return response;
}

interface SendEmailProps {
	email: string;
	subject: string;
	reactComponent: React.ReactElement;
}

export async function sendEmail({ email, subject, reactComponent }: SendEmailProps) {
	const client = getClient();
	const html = await render(reactComponent);
	const command = new SendEmailCommand({
		Source,
		Destination: {
			ToAddresses: [email]
		},
		Message: {
			Subject: {
				Data: subject
			},
			Body: {
				Html: {
					Data: html
				}
			}
		}
	});
	const response = await client.send(command);
	return response;
}
