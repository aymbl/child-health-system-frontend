import request from './request'

export function getCurrentQuestionnaireTemplate() {
  return request({
    url: '/questionnaires/template/current',
    method: 'get'
  })
}

export function submitQuestionnaire(data) {
  return request({
    url: '/questionnaires/submit',
    method: 'post',
    data
  })
}

export function getMyQuestionnaires() {
  return request({
    url: '/questionnaires/my',
    method: 'get'
  })
}

export function getDoctorQuestionnaires() {
  return request({
    url: '/questionnaires/doctor/me',
    method: 'get'
  })
}

export function getQuestionnaireDetail(id) {
  return request({
    url: `/questionnaires/${id}`,
    method: 'get'
  })
}
