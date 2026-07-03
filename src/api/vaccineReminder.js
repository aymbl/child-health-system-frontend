import request from './request'

export function getVaccineReminderList(params) {
  return request({
    url: '/vaccineReminders',
    method: 'get',
    params
  })
}

export function getVaccineRemindersByParentId(parentId) {
  return request({
    url: '/vaccineReminders/parent/' + parentId,
    method: 'get'
  })
}

export function getMyDoctorVaccineApplications() {
  return request({
    url: '/vaccineReminders/doctor/me',
    method: 'get'
  })
}

export function applyVaccineReminder(data) {
  return request({
    url: '/vaccineReminders/apply',
    method: 'post',
    data
  })
}

export function doctorConfirmVaccineApplication(id) {
  return request({
    url: `/vaccineReminders/${id}/doctor-confirm`,
    method: 'put'
  })
}

export function doctorRejectVaccineApplication(id) {
  return request({
    url: `/vaccineReminders/${id}/doctor-reject`,
    method: 'put'
  })
}

export function refreshExpiredVaccineReminders() {
  return request({
    url: '/vaccineReminders/refreshExpired',
    method: 'put'
  })
}
