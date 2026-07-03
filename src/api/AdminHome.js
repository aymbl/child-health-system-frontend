import request from './request'

export function getAdminHomeStats() {
	return request({
		url: '/adminhome/stats',
		method: 'get'
	})
}

export function getRecentAppointments() {
	return request({
		url: '/adminhome/recent-appointments',
		method: 'get'
	})
}

export function getLatestNotices() {
	return request({
		url: '/adminhome/latest-notices',
		method: 'get'
	})
}