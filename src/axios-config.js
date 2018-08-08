import axios from 'axios'
import { refreshToken } from './commands/commands'
import { getAuthContentFromData } from './utils'
function axiosConfig (context) {
  axios.interceptors.response.use(null, async error => {
    const { config: { url, method, data }, response: { status } } = error
    if (status !== 401 || url.includes('refreshToken')) {
      return Promise.reject(error)
    }
    const cache = context.globalState.get('cache')
    const { data: authorization } = await refreshToken(cache.refreshToken)
    const authContent = getAuthContentFromData(authorization)
    Object.assign(cache, authContent)
    context.globalState.update('cache', cache)
    const { tokenType, accessToken } = cache
    axios.defaults.headers.common['Authorization'] = `${tokenType} ${accessToken}`

    axios({
      method,
      url,
      data
    })
  })
}

export default axiosConfig
