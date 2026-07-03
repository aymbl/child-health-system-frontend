import request from './request'

export function getUserList(role) {
  return request({
    url: '/users',
    method: 'get',
    params: { role }
  })
}

export function getUserById(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  })
}

export function addUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/users',
    method: 'put',
    data
  })
}

export function deleteUserById(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

export function getDoctorOptions() {
  return request({
    url: '/users/doctors/options',
    method: 'get'
  })
}

export function getMyProfile() {
  return request({
    url: '/users/me',
    method: 'get'
  })
}

export function updateMyProfile(data) {
  return request({
    url: '/users/me/profile',
    method: 'put',
    data
  })
}

export function forgotPassword(data) {
  return request({
    url: '/users/forgot-password',
    method: 'post',
    data
  })
}

export function changePassword(data) {
  return request({
    url: '/users/change-password',
    method: 'put',
    data
  })
}
