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

// export function UpdateProduct (data, productId) {
//   return request({
//     url: `${url}/${productId}`,
//     method: 'put',
//     data
//   })
// }

// export function DeleteProduct (productId) {
//   return request({
//     url: `${url}/${productId}`,
//     method: 'delete'
//   })
// }
