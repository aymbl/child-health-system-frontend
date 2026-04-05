import request from './request'

export function getNoticeList(params) {
	return request({
		url: '/notices',
		method: 'get',
		params
	})
}

export function getNoticeById(id) {
	return request({
		url: `/notices/${id}`,
		method: 'get'
	})
}

export function addNotice(data) {
	return request({
		url: '/notices',
		method: 'post',
		data
	})
}

export function updateNotice(data) {
	return request({
		url: '/notices',
		method: 'put',
		data
	})
}

export function deleteNoticeById(id) {
	return request({
		url: `/notices/${id}`,
		method: 'delete'
	})
}