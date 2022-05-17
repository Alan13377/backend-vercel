<script>
	import Button, { Label } from '@smui/button';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';

	let token = '';

	if (browser) {
		token = localStorage.getItem('token');
	}

	function signOut() {
		localStorage.removeItem('token');
		goto('/signin', { replace: true });
	}
</script>

<div class="barra">
	<h2>Sistema</h2>
	<nav class="navegacion">
		{#if token}
			<a class="navegacion_enlace" href="/productos">Productos</a>
			<a class="navegacion_enlace" href="/orders">Ordenes</a>
			<a class="navegacion_enlace" href="/makeorder">Crear Orden</a>
			<Button on:click={signOut}>Salir</Button>
		{:else}
			<a class="navegacion_enlace" href="/">Registrar</a>
			<a class="navegacion_enlace" href="/signin">Iniciar Sesion</a>
		{/if}
	</nav>
</div>

<style>
	.barra {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem;
		background-color: black;
		color: white;
		font-size: 20px;
		font-weight: bold;
	}
	.navegacion {
		display: flex;
		gap: 2rem;
	}
	.navegacion_enlace {
		display: block;
		text-align: center;
		text-decoration: none;
		color: white;
	}
	.navegacion_enlace:hover {
		color: bisque;
	}
</style>
