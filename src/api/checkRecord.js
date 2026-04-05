import request from './request'

// 查询全部体检记录
export function getCheckRecordList(params) {
	return request({
		url: '/checkRecords',
		method: 'get',
		params
	})
}

// 根据儿童ID查询体检记录
export function getCheckRecordsByChildId(childId) {
	return request({
		url: `/checkRecords/child/${childId}`,
		method: 'get'
	})
}

export function getCheckRecordsByParentId(parentId) {
	return request({
		url: `/checkRecords/parent/${parentId}`,
		method: 'get'
	})
}

// 根据医生ID查询体检记录
export function getCheckRecordsByDoctorId(doctorId) {
	return request({
		url: `/checkRecords/doctor/${doctorId}`,
		method: 'get'
	})
}

// 根据ID查询体检记录详情
export function getCheckRecordById(id) {
	return request({
		url: `/checkRecords/${id}`,
		method: 'get'
	})
}

// 新增体检记录
export function addCheckRecord(data) {
	return request({
		url: '/checkRecords',
		method: 'post',
		data
	})
}

// 修改体检记录
export function updateCheckRecord(data) {
	return request({
		url: '/checkRecords',
		method: 'put',
		data
	})
}

// 删除体检记录
export function deleteCheckRecordById(id) {
	return request({
		url: `/checkRecords/${id}`,
		method: 'delete'
	})
}