import axios from 'axios'
import { Notify } from 'quasar'

const service = () => {
  const tokenAuth = JSON.parse(localStorage.getItem('token'))
  const token = 'Bearer ' + tokenAuth
  const api = axios.create({
    baseURL: process.env.API,
    headers: {
      Accept: 'application/json',
      Authorization: token
    }
  })

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        Notify.create({
          position: 'top',
          type: 'negative',
          html: true,
          progress: true,
          message: error.response.data.message
        })
      }

      return Promise.reject(error)
    }
  )

  return api
}

export async function request({ url, method, params, data }) {
  const request = service()
  let responseData = {}

  const requestConfig = {
    url,
    params,
    method,
    data
  }

  try {
    const response = await request.request(requestConfig)
    responseData = response
  } catch (error) {
    return Promise.reject(error)
  }
  return responseData
}
