import { goto } from '$app/navigation';

export const isLoggedIn = () => {
	const token = localStorage.getItem('token');

	if (!token) goto('/signin', { replace: true });
};
