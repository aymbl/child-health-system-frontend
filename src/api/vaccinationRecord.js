import request from './request'

export function getVaccinationRecordsByParentId(parentId) {
  return request({
    url: `/vaccinationRecords/parent/${parentId}`,
    method: 'get'
  })
}
