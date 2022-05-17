<script>
	import Card, { Content, Media, MediaContent } from '@smui/card';
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import {
		getProducts,
		createProduct,
		readProduct,
		updateProduct,
		deleteProduct
	} from '../api/product';
	import Dialog from '../components/Dialog.svelte';
	import { isOverlayOpen } from '../stores/OverlayStore';
	import Button, { Label } from '@smui/button';

	import * as Yup from 'yup';

	import { isLoggedIn } from '../stores/store';
	import { onMount } from 'svelte';

	let productos = [];
	let form = false; //true para crear producto, false para editar producto

	onMount(() => {
		isLoggedIn();
	});
	let schema = Yup.object().shape({
		name: Yup.string().required('Producto requerido'),
		uprice: Yup.number()
			.required('Precio requerido')
			.min(0, 'El precio debe ser mayor a 0')
			.typeError('El precio debe ser un numero')
	});

	let product = { name: '', uprice: '', image: '' };
	let errors = {};

	const validateForm = async () => {
		try {
			console.log(product);
			await schema.validate(product, { abortEarly: false });

			errors = {};
		} catch (err) {
			errors = extractErrors(err);
		}
	};
	function extractErrors(err) {
		return err.inner.reduce((acc, err) => {
			return { ...acc, [err.path]: err.message };
		}, {});
	}

	//Get Products

	const mostrarProductos = async () => {
		try {
			const response = await getProducts();
			productos = response.data;
			console.log(productos);
		} catch (error) {
			console.log(error);
		}
	};

	const sendProducts = () => {
		if (validateForm()) {
			try {
				form ? addProduct() : editProduct();
			} catch (error) {
				return error;
			}
		}
	};
	const addProduct = async () => {
		if (validateForm()) {
			try {
				const producToAdd = new FormData();
				producToAdd.append('name', product.name);
				producToAdd.append('uprice', product.uprice);
				producToAdd.append('image', product.image);
				const response = await createProduct(producToAdd);
				console.log(response);
			} catch (error) {
				console.log(error);
			}
			mostrarProductos();
		}
	};
	const editProduct = async () => {
		if (validateForm()) {
			try {
				const id = product._id;
				const producToEdit = new FormData();
				producToEdit.append('name', product.name);
				producToEdit.append('uprice', product.uprice);
				producToEdit.append('image', product.image);
				const response = await updateProduct(id, producToEdit);
			} catch (error) {
				console.log(error);
			}
			mostrarProductos();
		}
	};

	const removeProduct = async (id) => {
		try {
			const response = await deleteProduct(id);
			const index = productos.findIndex((product) => product._id === id);
			const newProductsList = productos.slice(0);
			newProductsList.splice(index, 1);
			productos = newProductsList;
		} catch (error) {
			return error;
		}
	};

	const openAddForm = async () => {
		form = true;
		product = { name: '', uprice: '', image: '' };
		isOverlayOpen.set(true);
	};
	const openEditForm = async (id) => {
		form = false;
		const response = await readProduct(id);
		product = response.data;
		isOverlayOpen.set(true);
	};

	mostrarProductos();
</script>

<svelte:head>
	<title>Productos</title>
</svelte:head>

{#if $isOverlayOpen}
	<Dialog>
		<form {schema} on:submit|preventDefault={sendProducts}>
			<div class="mb-8">
				<label for="name">Producto:</label>
				<Textfield
					class="w-full"
					name="name"
					type="text"
					variant="outlined"
					bind:value={product.name}
				>
					<Icon class="material-icons" slot="trailingIcon">inventory_2</Icon>
				</Textfield>
				<div class="error">
					{#if errors.name}{errors.name}{/if}
				</div>
			</div>
			<div class="mb-8">
				<label for="uprice">Precio:</label>
				<Textfield
					class="w-full"
					type="text"
					name="uprice"
					variant="outlined"
					bind:value={product.uprice}
				>
					<Icon class="material-icons" slot="trailingIcon">attach_money</Icon>
				</Textfield>
				<div class="error">
					{#if errors.uprice}{errors.uprice}{/if}
				</div>
			</div>
			<div class="mb-8">
				<label for="image">Imagen</label>
				<input
					type="file"
					name="image"
					on:change={(e) => {
						product.image = e.target.files[0];
					}}
				/>
				<div class="error">
					{#if errors.image}{errors.image}{/if}
				</div>
			</div>

			{#if form}
				<!--Agregar-->

				<Button class="w-full" type="submit" color="secondary" variant="outlined">
					<Label>Enviar</Label>
				</Button>
			{:else}
				<!--Editar-->
				<Button class="w-full" type="submit" color="secondary" variant="outlined">
					<Label>Editar</Label>
				</Button>
			{/if}
		</form>
	</Dialog>
{/if}

<h3 class="ml-12 mt-6 text-4xl font-serif font-bold">Lista de Productos</h3>
<div>
	<div class="grid grid-cols-1  lg:grid-cols-3 gap-4 m-12">
		{#each productos as producto}
			<Card>
				<Media aspectRatio="16x9">
					<MediaContent>
						<img src={'https://backend-mesn.herokuapp.com/' + producto.image} alt={producto.name} />
						<h2
							class="mdc-typography--headline6"
							style="color: #fff; position: absolute; bottom: 16px; left: 16px; margin: 0;"
						>
							{producto.name}
						</h2>
					</MediaContent>
				</Media>

				<Content style="color: #888;">
					<p>{producto.name}</p>
					Precio:${producto.uprice}
				</Content>
				<div class="p-2 absolute grid grid-cols-2 gap-1">
					<button
						class="bg-yellow-600 text-white rounded-full"
						on:click={() => {
							openEditForm(producto._id);
						}}><Icon class="material-icons ">edit</Icon></button
					>
					<button
						class="bg-red-700 text-white p-1  rounded-full right-0 "
						on:click={removeProduct(producto._id)}
						><Icon class="material-icons">delete</Icon></button
					>
				</div>
			</Card>
		{/each}
	</div>
	<button
		class="bg-yellow-700 text-white p-3 bottom-0 rounded-full my-4 right-0 fixed z-40"
		on:click={openAddForm}><Icon class="material-icons">add</Icon></button
	>
</div>

<style>
	label {
		display: block;
	}

	.error {
		color: red;
		font-weight: 400;
	}
	img {
		max-height: 100%;
		margin: 0 auto;
	}
</style>
