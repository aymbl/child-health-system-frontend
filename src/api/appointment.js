import request from './request'

export function getAppointmentList(params) {
	return request({
		url: '/appointments',
		method: 'get',
		params
	})
}

export function addAppointment(data) {
	return request({
		url: '/appointments',
		method: 'post',
		data
	})
}

export function getAppointmentById(id) {
	return request({
		url: `/appointments/${id}`,
		method: 'get'
	})
}

export function updateAppointment(data) {
	return request({
		url: '/appointments',
		method: 'put',
		data
	})
}

export function getAppointmentsByParentId(parentId) {
	return request({
		url: `/appointments/parent/${parentId}`,
		method: 'get'
	})
}

export function applyAppointment(data) {
	return request({
		url: '/appointments/apply',
		method: 'post',
		data
	})
}

export function getMyDoctorAppointments() {
	return request({
		url: '/appointments/doctor/me',
		method: 'get'
	})
}

export function doctorConfirmAppointment(id) {
	return request({
		url: `/appointments/${id}/doctor-confirm`,
		method: 'put'
	})
}

export function doctorRejectAppointment(id) {
	return request({
		url: `/appointments/${id}/doctor-reject`,
		method: 'put'
	})
}

export function doctorCompleteAppointment(id) {
	return request({
		url: `/appointments/${id}/doctor-complete`,
		method: 'put'
	})
}

export function parentCancelAppointment(id) {
	return request({
		url: `/appointments/${id}/parent-cancel`,
		method: 'put'
	})
}

export function deleteAppointmentById(id) {
	return request({
		url: `/appointments/${id}`,
		method: 'delete'
	})
}

export function updateAppointmentStatus(id, status) {
	return request({
		url: `/appointments/${id}/status`,
		method: 'put',
		data: { status }
	})
}

export function getAppointmentsByDoctorId(doctorId) {
	return request({
		url: `/appointments/doctor/${doctorId}`,
		method: 'get'
	})
}
