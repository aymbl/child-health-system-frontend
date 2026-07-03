import request from './request'

export function getCheckRecordsByParentId(parentId) {
	return request({
		url: '/checkRecords/parent/' + parentId,
		method: 'get'
	})
}

export function applyCheckRecord(data) {
	return request({
		url: '/checkRecords/apply',
		method: 'post',
		data
	})
}

export function deleteCheckRecordById(id) {
	return request({
		url: '/checkRecords/' + id,
		method: 'delete'
	})
}

export function getCheckRecordList(params) {
	return request({
		url: '/checkRecords',
		method: 'get',
		params
	})
}

export function getCheckRecordsByChildId(childId) {
	return request({
		url: '/checkRecords/child/' + childId,
		method: 'get'
	})
}

export function getCheckRecordsByDoctorId(doctorId) {
	return request({
		url: '/checkRecords/doctor/' + doctorId,
		method: 'get'
	})
}

export function addCheckRecord(data) {
	return request({
		url: '/checkRecords',
		method: 'post',
		data
	})
}

export function getCheckRecordById(id) {
	return request({
		url: '/checkRecords/' + id,
		method: 'get'
	})
}

export function updateCheckRecord(data) {
	return request({
		url: '/checkRecords',
		method: 'put',
		data
	})
}
