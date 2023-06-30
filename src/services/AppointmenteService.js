import { request } from './request';

const url = '/appointment'

export function CreateAgendamento (data) {
  return request({
    url,
    method: 'post',
    data
  })
}

export function ListAgendamento (params) {
  return request({
    url,
    method: 'get',
    params
  })
}

export function UpdateAgendamento (data, appointmentId) {
  return request({
    url: `${url}/${appointmentId}`,
    method: 'put',
    data
  })
}

export function DeleteAgendamento (appointmentId) {
  return request({
    url: `${url}/${appointmentId}`,
    method: 'delete'
  })
}
