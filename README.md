Let's face it, creating email templates is a pain. 😩 Only God know why email clients don't simply follow modern web standards (for styling anyway). For this reason, many devs opt to outsource this to services that provide both no-code email templates as well as mass distribution services. But that's a terrible waste of money. You can do it yourself!

For React / Next.js users, there is a fantastic package called `react-email` that allows crafting emails from a set of standard (headless) components that you can fully style with plain css, styled components or even TailwindCSS. React-email takes the guess work out of remembering the complex system of tables and ridiculous gymnastics needed to craft emails that will look both beautiful as well as consistent in all email clients.

There's a new player in town in the full-stack web framework market called Sveltekit. Well, it's not exactly new. It's now on major version 5. I call it *new* in the sense that I now consider it fully production ready. In the following months and years, I truly believe we are going to see a mass exodus of React / Next.js developers migrating to Sveltekit. It's unbelievably fast and ships **far** less code to the client--and it's just so much fun to use!

One of the current problems that Sveltekit is facing is it's going through some growing pains. There were a lot of breaking changes in the 4 to 5 transition that caused many of the NPM packages for Svelte/Sveltekit to become broken as well. Some of these packages have also been all but abandoned by their creators, which is, unfortunately, an all-to-common occurrence. One of the aforementioned packages was `svelte-email`, the Sveltekit-equivalent of `react-email`. Too bad.

But I have some great news: running React inside of Sveltekit (even server side) is super easy! I know, it's mind-blowing right? 🤯

So with that being said, in this tutorial, I'm going to show you how to:

1. Bootstrap a fresh Sveltekit project
2. Install React and React-email dependencies
3. Use AWS Simple Email Service to send our email for nearly free

A couple of things to bear in mind, though, before we begin: this project is designed to work only on Node.js servers. This will not work using Sveltekit-Cloudflare adapter. It *may* work on Vercel, but I have not tested it. Links to the demo project source code and other resources are available at the bottom of this article.

Ok, let's get started!

## Bootstrapping Sveltekit

Whether you're new to Sveltekit or have previous experience with it, there is a new CLI tool called `sv` that is recommend by Sveltekit to spin up a new project. It's as easy as:

```bash
pnpx sv create svelte-react-email
```

It will provide you with a series of options. The one's I'm using for this project is:

1. Sveltekit minimal
2. Yes, using Typescript syntax
3. prettier
4. eslint
5. tailwindcss
6. sveltekit-adapters
7. devtools-json
8. adapter: node
9. pnpm

## Install Dependencies

We'll need React, React-Email and AWS to create our email system:

```bash
pnpm i react react-email @react-email/components @react-email/render \
@aws-sdk/client-ses
```

And if you're using Typescript:

```bash
pnpm i -D @types/node @types/react
```

React-email does use the `sharp` library to render emails, so you may get an  `approve-builds` notice when using `pnpm`.

Next we need to tell Typescript that we're using React JSX. Add the following to your `tsconfig.json`:

```json
{
	"jsx": "react-jsx"
}
```

Lastly, let's create a `.env` file to hold our AWS credentials:

```bash
AWS_ACCESS_KEY_ID="your key ID"
AWS_SECRET_ACCESS_KEY="your secret access key"
```

After adding environment variables in Sveltekit, you'll want to run `pnpm prepare`, which creates both types as well as an importable constant to use in your code, which I personally think is a much better (and more type-safe) system.

## Creating our Mailing Library

Let's create a new file in `src/lib/server/email.tsx`:

```ts
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

const Source = 'ACME Inc. <noreply@example.com>';

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
```

This will give us a function that we can simply pass our recipients, subject and React-Email component to to send our emails.

## Creating Email Components

Now that our mailing library is complete and ready to accept and send emails, the next step is to create a template that we will reuse for all our emails:

```ts
// src/lib/emails/EmailTemplate.tsx

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
							ACME Inc
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
```

Now that we have a template with our header and footer, let's create an email for sending one-time codes:

```ts
// src/lib/emails/CodeEmail.tsx

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
```

## Testing

Ok, that wasn't too painful, was it? Now let's create a simple form in Svelte with a server-side form action to test our email:

```ts
<script lang="ts">
	// src/routes/+page.svelte

	import { enhance } from '$app/forms';
	import { cn } from '$lib/css-tools';

	let { form } = $props();
	let email = $state('');
	let loading = $state(false);
	let success = $state('');
</script>

<div class="flex flex-col justify-center items-center bg-gray-50 p-4 min-h-screen">
	<div class="bg-white shadow-lg p-8 rounded-lg w-full max-w-md text-center">
		<h1 class="mb-4 font-bold text-gray-900 text-3xl">Email Testing Dashboard</h1>
		<p class="mb-8 text-gray-600">
			Use this interface to test your email templates and sending functionality.
		</p>

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				success = '';
				return async ({ result, update }) => {
					await update();
					console.log(result);
					if (result.type === 'success' && result.data?.success) {
						success = 'Email sent successfully';
					}
					loading = false;
				};
			}}
			class="flex flex-col gap-4"
		>
			<input type="email" name="email" placeholder="joe@example.com" bind:value={email} />
			<button
				type="submit"
				class={cn(
					'flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 hover:bg-blue-700',
					'font-medium text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none',
					'transition-colors duration-200',
					{
						'cursor-not-allowed opacity-50': loading
					}
				)}
				disabled={loading}
			>
				{#if loading}
					<svg class="mr-3 w-5 h-5 text-white animate-spin" viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
							fill="none"
						/>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					<span>Loading...</span>
				{:else}
					<span>Send Test Email</span>
				{/if}
			</button>
			{#if success}
				<p class="text-green-500">{success}</p>
			{/if}
			{#if form?.error}
				<p class="text-red-500">{form.error}</p>
			{/if}
		</form>
	</div>
</div>
```

And lastly, our action handler:

```ts
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
```

That's it! Now just enter your email, click the button and you should receive a beautifully formatted email. Try it in both a desktop mail client as well as web clients like Gmail or Yahoo! mail.

## Resources

- [GitHub Repo](https://github.com/designly1/svelte-react-email)
- [Sveltekit Form Actions Docs](https://svelte.dev/docs/kit/form-actions)
- [React-Email](https://react.email/)

### Thank You!

Thank you for taking the time to read my article and I hope you found it useful (or at the very least, mildly entertaining). For more great information about web dev, systems administration and cloud computing, please read the [Designly Blog](https://blog.designly.biz). Also, please leave your comments! I love to hear thoughts from my readers.

If you want to support me, please follow me on [Spotify](https://open.spotify.com/album/2fq9S51ULwPmRM6EdCJAaJ?si=USeZDsmYSKSaGpcrSJJsGg) or [SoundCloud](https://soundcloud.com/jaysudo1/tracks)!

Please also feel free to check out my [Portfolio Site](https://jay.yaa.bz)

Looking for a web developer? I'm available for hire! To inquire, please fill out a [contact form](https://designly.biz/contact).