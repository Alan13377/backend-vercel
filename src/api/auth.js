import API from '../services/api';

export const signUp = async (requets) => {
	try {
		const response = await API.post('/signup', requets);
		return response;
	} catch (error) {
		return error;
	}
};
export const signIn = async (requets) => {
	try {
		const response = await API.post('/signin', requets);
		return response;
	} catch (error) {
		return error;
	}
};
