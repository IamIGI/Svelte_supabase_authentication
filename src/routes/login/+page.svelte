<script>
	import AuthForm from '$components/AuthForm.svelte';

	let { form } = $props();
	$inspect(form);
</script>

<AuthForm isRegistration={false} {form} />
