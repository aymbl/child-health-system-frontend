import request from './request'

export function createFeedback(data) {
	return request.post('/feedback', data)
}

export function getMyFeedback() {
	return request.get('/feedback/my')
}

export function getDoctorFeedback() {
	return request.get('/feedback/doctor/me')
}

export function getFeedbackList(params) {
	return request.get('/feedback', { params })
}

export function getFeedbackDetail(id) {
	return request.get(`/feedback/${id}`)
}

export function updateFeedbackStatus(id, data) {
	return request.put(`/feedback/${id}/status`, data)
}

export function replyFeedback(id, data) {
	return request.put(`/feedback/${id}/reply`, data)
}
