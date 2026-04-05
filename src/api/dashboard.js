import request from './request'

export function getDashboardStats() {
	return request({
		url: '/dashboard/stats',
		method: 'get'
	})
}

export function getRecentAppointments() {
	return request({
		url: '/dashboard/recent-appointments',
		method: 'get'
	})
}

export function getLatestNotices() {
	return request({
		url: '/dashboard/latest-notices',
		method: 'get'
	})
}