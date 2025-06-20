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
