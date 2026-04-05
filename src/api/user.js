import request from './request'

// 查询用户列表（按角色）
export function getUserList(role) {
	return request({
		url: '/users',
		method: 'get',
		params: {
			role
		}
	})
}

// 根据ID查询用户详情
export function getUserById(id) {
	return request({
		url: `/users/${id}`,
		method: 'get'
	})
}

// 新增用户
export function addUser(data) {
	return request({
		url: '/users',
		method: 'post',
		data
	})
}

// 修改用户
export function updateUser(data) {
	return request({
		url: '/users',
		method: 'put',
		data
	})
}

// 删除用户
export function deleteUserById(id) {
	return request({
		url: `/users/${id}`,
		method: 'delete'
	})
}