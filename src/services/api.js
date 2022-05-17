import axios from 'axios';

/* Creating a new instance of the axios library with the base URL set to the localhost. */
const axiosApi = axios.create({
	/* baseURL: 'http://localhost:4000/' */
	baseURL: 'https://backend-mesn.herokuapp.com/'
});

/**
 * This function makes an API request using the axios library, and returns the response or an error.
 * @param method - The HTTP method to use (GET, POST, PUT, DELETE, etc.)
 * @param url - The url of the endpoint you're trying to hit.
 * @param request - {
 * @returns The return value of the catch block.
 */
const apiRequest = async (method, url, request) => {
	try {
		const headers = { Authorization: localStorage.getItem('token') };
		const response = await axiosApi({ method, url, headers, data: request });
		return response;
	} catch (error) {
		return error.response;
	}
};

/**
 * It makes a POST request to the given URL with the given request body
 * @param url - The URL to make the request to.
 * @param request - The request object that contains the data to be sent to the server.
 */
const post = (url, request) => apiRequest('post', url, request);

const put = (url, request) => apiRequest('put', url, request);

const get = (url) => apiRequest('get', url);

const deleteRequest = (url) => apiRequest('delete', url);

const API = {
	post,
	get,
	put,
	delete: deleteRequest
};

export default API;
