// src/routes/+page.server.ts

import { fail, type Actions } from '@sveltejs/kit';
import { sendCodeEmail } from '$lib/server/email';

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		if (typeof email !== 'string' || email.length < 3) {
			return fail(400, {
				success: false,
				error: 'Email is required'
			});
		}

		try {
			const result = await sendCodeEmail({
				email: email,
				code: '123456',
				intro: 'Further verification is required to access your account.'
			});

			console.log(result);

			return {
				success: true
			};
		} catch (error: unknown) {
			console.error('Error processing email request:', error);
			return fail(500, {
				success: false,
				error: 'Failed to process email request'
			});
		}
	}
} satisfies Actions;
