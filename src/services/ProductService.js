import { request } from './request';

const url = '/products'

export function CreateProduct (data) {
  return request({
    url,
    method: 'post',
    data
  })
}

export function ListProducts () {
  return request({
    url,
    method: 'get'
  })
}

export function UpdateProduct (data, productId) {
  return request({
    url: `${url}/${productId}`,
    method: 'put',
    data
  })
}

export function DeleteProduct (productId) {
  return request({
    url: `${url}/${productId}`,
    method: 'delete'
  })
}
