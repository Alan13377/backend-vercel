<script>
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import Button, { Label } from '@smui/button';
	import Swal from 'sweetalert2/dist/sweetalert2.js';

	import 'sweetalert2/src/sweetalert2.scss';
	import { getProducts } from '../api/product';
	import { onMount } from 'svelte';
	import { createOrder } from '../api/order';

	import { isLoggedIn } from '../stores/store';

	let myProducts = [];
	let producto = '';
	let order = { products: [], total: 0 };

	onMount(async () => {
		isLoggedIn();
		try {
			const response = await getProducts();
			myProducts = response.data;

			console.log(myProducts);
		} catch (error) {
			return error;
		}
	});
	const agregarOrden = (product) => {
		if (!order.products.includes(product)) {
			product.quantity = 1;
			product.amount = product.quantity * product.uprice;
			order.products = [...order.products, product];
		}
	};

	const removeOrder = (index) => {
		let tempOrder = order.products.slice(0);
		tempOrder.splice(index, 1);
		order.products = tempOrder;
	};

	const makeOrder = async () => {
		try {
			const response = await createOrder(order);
			order = { products: [], total: 0 };
			Swal.fire({
				icon: 'success',
				title: 'Orden Generada',
				text: response.data.message
			});
		} catch (error) {
			return error;
		}
	};
	/* A reactive statement that updates the `searchProducts` variable whenever the `producto` variable changes. */
	$: searchProducts = myProducts.filter((product) => product.name.toLowerCase().includes(producto));

	/* A reactive statement that updates the total amount of the order. */
	$: {
		let suma = 0;
		for (let product of order.products) {
			if (isNaN(product.amount)) product.amount = 0;
			suma += product.amount;
		}
		order.total = Number(suma.toFixed(2));
	}
</script>

<svelte:head>
	<title>Orders</title>
</svelte:head>
<h3 class="ml-12 mt-6 text-4xl font-serif font-bold">Ordenes</h3>

<div class="grid grid-cols-1 md:grid-cols-2 gap-y-20 gap-x-12 p-8">
	<div class="col-span-1	">
		<Textfield class="w-full mb-8" name="name" type="text" variant="outlined" bind:value={producto}>
			<Icon class="material-icons" slot="leadingIcon">search</Icon>
		</Textfield>

		<table class="table-fixed ">
			<tr>
				<th class="w-1/2">Producto</th>
				<th class="w-1/2">Precio Unitario</th>
				<th class="w-1/6">Agregar</th>
			</tr>
			<tbody>
				{#each searchProducts as product}
					<tr>
						<td class="border px-4 py-2">{product.name}</td>
						<td class="border px-4 py-2">{product.uprice}</td>
						<td class="border px-4 py-2"
							><Button on:click={() => agregarOrden(product)}>
								<Icon class="material-icons">add_shopping_cart</Icon>
							</Button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="col-span-1">
		<h5 class="mb-4 font-bold ">Orden</h5>
		<form on:submit|preventDefault={makeOrder}>
			<table class="table-fixed">
				<thead>
					<tr>
						<th class="w-1/2 px-4 py-2">Producto</th>
						<th class="w-1/2 px-4 py-2">Cantidad</th>
						<th class="w-1/2 px-4 py-2">Precio</th>
						<th class="w-1/2 px-4 py-2">Monto</th>
						<th class="w-1/2 px-4 py-2">Remover</th>
					</tr></thead
				>
				<tbody>
					{#each order.products as { name, quantity, uprice, amount }, index}
						<tr>
							<td class="border px-4 py-2">{name}</td>
							<td class="border px-4 py-2">
								<input
									bind:value={quantity}
									on:input={() => Number((amount = quantity * uprice).toFixed(2))}
									type="number"
									min="1"
									required
									class="w-1/2"
								/>
							</td>
							<td class="border px-4 py-2">{uprice}</td>
							<td class="border px-4 py-2">{amount}</td>
							<td>
								<Button on:click={() => removeOrder(index)}>
									<Icon class="material-icons">remove_shopping_cart</Icon>
								</Button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="m-10 grid grid-cols-2">
				<p>Total: <span class="font-bold">{order.total}</span></p>
				<Button type="submit" class="m-auto">Generar</Button>
			</div>
		</form>
	</div>
</div>
