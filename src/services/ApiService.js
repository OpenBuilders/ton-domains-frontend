import axios from 'axios'

import { AuthService } from './AuthService'
import { LocalStorageService } from './LocalStorageService'

export default function authHeader() {
  const accessToken = AuthService.getCredentials().accessToken

  if (accessToken) {
    return { Authorization: 'Bearer ' + accessToken }
  } else {
    return {}
  }
}

const apiHost = process.env.REACT_APP_API_ENDPOINT

axios.interceptors.response.use(
  (response) => {
    const transformedResponse = {
      ok: response.data.ok,
    }

    const error = response.data.error
    const data = response.data.data

    if (error) {
      transformedResponse.error = error
    }

    if (data) {
      transformedResponse.data = data
    }

    return transformedResponse
  },
  (error) => {
    let errorCode = 'something-went-wrong'

    if (!error.status && error.message === 'Network Error') {
      errorCode = 'network-error'
    }

    if (error.response && error.response.status === 401) {
      AuthService.clearCredentials()
      LocalStorageService.setItem('walletAddress', null)
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth'
      }
    }

    return {
      ok: false,
      data: null,
      error: errorCode,
    }
  }
)

export const ApiService = {
  get: ({ endpoint, params }) => {
    // use this to avoid backend
    // if (endpoint === '/domains') {
    //   return new Promise((resolve) => {
    //     resolve({ data: domainsMock, ok: true, error: false })
    //   })
    // }

    const response = axios({
      method: 'GET',
      url: `${apiHost}${endpoint}`,
      headers: { ...authHeader() },
      params,
    })

    response.catch((error) => {
      console.log('catch', error)
    })

    return response
  },
  post: ({ endpoint, data }) => {
    const response = axios({
      method: 'POST',
      url: `${apiHost}${endpoint}`,
      headers: { ...authHeader() },
      data: {
        ...data,
      },
    })

    response.catch((error) => {
      console.log('catch', error)
    })

    return response
  },

  delete: ({ endpoint }) => {
    const response = axios({
      method: 'DELETE',
      url: `${apiHost}${endpoint}`,
      headers: { ...authHeader() },
    })

    response.catch((error) => {
      console.log('catch', error)
    })

    return response
  },
}
