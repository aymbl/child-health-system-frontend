import request from './request'

// 查询成长记录列表
export function getGrowthRecordList(params) {
	return request({
		url: '/growthRecords',
		method: 'get',
		params
	})
}

// 根据ID查询成长记录详情
export function getGrowthRecordById(id) {
	return request({
		url: `/growthRecords/${id}`,
		method: 'get'
	})
}

// 根据儿童ID查询成长记录
export function getGrowthRecordByChildId(childId) {
	return request({
		url: `/growthRecords/child/${childId}`,
		method: 'get'
	})
}

// 新增成长记录
export function addGrowthRecord(data) {
	return request({
		url: '/growthRecords',
		method: 'post',
		data
	})
}

// 修改成长记录
export function updateGrowthRecord(id, data) {
	return request({
		url: `/growthRecords/${id}`,
		method: 'put',
		data
	})
}

// 删除成长记录
export function deleteGrowthRecord(id) {
	return request({
		url: `/growthRecords/${id}`,
		method: 'delete'
	})
}