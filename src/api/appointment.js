import request from './request'

export function getAppointmentList(params) {
	return request({
		url: '/appointments',
		method: 'get',
		params
	})
}

export function getAppointmentById(id) {
	return request({
		url: `/appointments/${id}`,
		method: 'get'
	})
}

export function addAppointment(data) {
	return request({
		url: '/appointments',
		method: 'post',
		data
	})
}

export function updateAppointment(data) {
	return request({
		url: '/appointments',
		method: 'put',
		data
	})
}

export function deleteAppointmentById(id) {
	return request({
		url: `/appointments/${id}`,
		method: 'delete'
	})
}

export function getAppointmentsByDoctorId(doctorId) {
	return request({
		url: `/appointments/doctor/${doctorId}`,
		method: 'get'
	})
}

export function getAppointmentsByParentId(parentId) {
	return request({
		url: `/appointments/parent/${parentId}`,
		method: 'get'
	})
}