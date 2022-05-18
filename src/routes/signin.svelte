<script>
	import SignIn from '../views/auth/SignIn.svelte';
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
	<title>Iniciar Sesión</title>
</svelte:head>
<NavBar />
<SignIn />
