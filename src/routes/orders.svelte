<script>
	import { getOrders } from '../api/order';
	import { onMount } from 'svelte';
	import Card from '@smui/card';
	import Button, { Label } from '@smui/button';
	import { isLoggedIn } from '../stores/store';
	import NavBar from '../components/NavBar.svelte';

	let orders = [];

	onMount(async () => {
		isLoggedIn();
		try {
			const response = await getOrders();
			orders = response.data;
			for (let order of orders) {
				var date = new Date(order.date),
					day = ('0' + date.getDate()).slice(-2),
					mnth = ('0' + (date.getMonth() + 1)).slice(-2),
					hor = ('0' + date.getHours()).slice(-2),
					min = ('0' + date.getMinutes()).slice(-2);
				order.date = [day, '-', mnth, '-', date.getFullYear(), ' at ', hor, ':', min].join('');
				console.log(orders);
			}
		} catch (error) {
			return error;
		}
	});
</script>

<svelte:head>
	<title>Orders</title>
</svelte:head>
<NavBar />
<h3 class="ml-12 mt-6 text-4xl font-serif font-bold">Ordenes</h3>

<div>
	<div class="grid grid-cols-1  lg:grid-cols-3 gap-4 m-12">
		{#each orders as orden}
			<Card>
				<div class="m-3">{orden.date}</div>
				<Button on:click={window.open('https://backend-mesn.herokuapp.com/' + orden.file)}>
					<Label>Ver</Label>
				</Button>
			</Card>
		{/each}
	</div>
</div>
