import request from './request'

export function login(data) {
	return request({
		url: '/users/login',
		method: 'post',
		data
	})
}