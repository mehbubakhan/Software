import axios from 'axios'

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res: any) => res,
  (err: any) => {
    if(err.response){
      const code = err.response.status
      if(code === 401){
        // redirect to login for unauthorized
        try{ window.location.href = '/login' }catch(e){}
      }
      // attach friendly message
      const message = err.response.data?.message || err.message || 'Request failed'
      return Promise.reject(new Error(message))
    }
    return Promise.reject(err)
  }
)

export default api
