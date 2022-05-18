<script>
	import SignUp from '../views/auth/SignUp.svelte';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import NavBar from '../components/NavBar.svelte';
	let token = '';

	if (browser) {
		token = localStorage.getItem('token');
		if (token != null) {
			goto('/productos');
		}
	}
</script>

<svelte:head>
	<title>Registrase</title>
</svelte:head>
<NavBar />
<SignUp />
