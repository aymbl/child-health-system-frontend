import request from './request'

export function login(data) {
	return request({
		url: '/users/login',
		method: 'post',
		data
	})
}

export function register(data) {
	return request({
		url: '/users/register',
		method: 'post',
		data
	})
}

export function logout() {
	return request({
		url: '/users/logout',
		method: 'post'
	})
}
