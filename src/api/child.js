import request from './request'

export function getChildList(params) {
	return request({
		url: '/children',
		method: 'get',
		params
	})
}

export function getChildById(id) {
	return request({
		url: `/children/${id}`,
		method: 'get'
	})
}

export function addChild(data) {
	return request({
		url: '/children',
		method: 'post',
		data
	})
}

export function updateChild(data) {
	return request({
		url: '/children',
		method: 'put',
		data
	})
}

export function deleteChildById(id) {
	return request({
		url: `/children/${id}`,
		method: 'delete'
	})
}

export function getChildrenByParentId(parentId) {
	return request({
		url: `/children/parent/${parentId}`,
		method: 'get'
	})
}