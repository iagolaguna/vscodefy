import axios from 'axios'
import { refreshToken } from './commands/commands'
function axiosConfig () {
  axios.interceptors.response.use(null, async error => {
    console.log(error)
    const { config: { url, method, data }, response: { status } } = error
    console.log(url, method, data, status)
    if (status !== 401 || url.includes('refreshToken')) {
      return Promise.reject(error)
    }
    await refreshToken()
    axios({
      method,
      url,
      data
    })
  })
}

export default axiosConfig
