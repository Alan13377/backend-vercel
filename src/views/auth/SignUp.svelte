<script>
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import Button, { Label } from '@smui/button';

	import * as auth from '../../api/auth';
	import * as Yup from 'yup';

	import Swal from 'sweetalert2/dist/sweetalert2.js';
	import 'sweetalert2/src/sweetalert2.scss';

	import { goto } from '$app/navigation';

	let schema = Yup.object().shape({
		name: Yup.string().required('Nombre requerido'),
		email: Yup.string().required('Email requerido').email(),
		password: Yup.string().required('Contraseña requerido')
	});

	let user = { name: '', email: '', password: '' };

	let errors = {};

	const validateForm = async () => {
		try {
			console.log(user);
			await schema.validate(user, { abortEarly: false });

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

	const registrarSesion = async () => {
		if (validateForm()) {
			try {
				const response = await auth.signUp(user);
				if (response.status == 400 || 500) {
					Swal.fire({
						icon: 'error',
						title: 'Oops...',
						text: response.data.message
					});
				}
				if (response.status == 200) {
					Swal.fire({
						icon: 'success',
						title: 'Registrado',
						text: response.data.message
					});
					localStorage.setItem('token', response.data);
					goto('/productos');
				}
			} catch (error) {
				return error;
			}
		}
	};
</script>

<div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 p-8">
	<div class="col-span-1 sm:col-start-2 md:col-start-2">
		<div class="border-dotted border-2 border-gray-600 rounded p-8 form">
			<form {schema} on:submit|preventDefault={registrarSesion}>
				<div class="mb-8">
					<label name="Name" for="">Usuario:</label>
					<Textfield type="text" variant="outlined" bind:value={user.name}>
						<Icon class="material-icons" slot="trailingIcon">account_circle</Icon>
					</Textfield>
					<div class="error">
						{#if errors.name}{errors.name}{/if}
					</div>
				</div>
				<div class="mb-8">
					<label for="">Correo:</label>
					<Textfield type="email" variant="outlined" bind:value={user.email}>
						<Icon class="material-icons" slot="trailingIcon">contact_mail</Icon>
					</Textfield>
					<div class="error">
						{#if errors.email}{errors.email}{/if}
					</div>
				</div>
				<div class="mb-8">
					<label for="">Contraseña</label>
					<Textfield type="password" variant="outlined" bind:value={user.password}>
						<Icon class="material-icons" slot="trailingIcon">lock</Icon>
					</Textfield>
					<div class="error">
						{#if errors.password}{errors.password}{/if}
					</div>
				</div>
				<Button type="submit" color="secondary" variant="outlined">
					<Label>Registrarse</Label>
				</Button>

				<Label><a href="/signin">Iniciar Sesion</a></Label>
			</form>
		</div>
	</div>
</div>

<style>
	label {
		display: block;
	}

	.form {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.error {
		display: block;
		color: red;
	}
</style>
