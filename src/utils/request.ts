import { Action, store } from '@/store'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
export default class HttpRequest {
  request
  constructor(baseUrl: string) {
    this.request = axios.create({
      baseURL: baseUrl,
    })
    this.request.interceptors.request.use(
      async config => {
        const index = config.baseURL?.indexOf('nftonshow')
        if (config.baseURL === import.meta.env.VITE_NftApi) {
          config.headers['token'] = `${store.state.nftToken}`
          config.headers['type'] = store.state.isApp ? '0' : '2'
          config.headers['metaId'] = store.state.userInfo?.metaId
        } else {
          const token = store.state.token ? store.state.token.access_token : null
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
          }
        }
        return config
      },
      function(error) {
        // 对请求错误做些什么
        return Promise.reject(error)
      }
    )
    // 添加响应拦截器
    this.request.interceptors.response.use(
      function(response) {
        // 对响应数据做点什么
        return response.data
      },
      function(error) {
        // const status = error.response.status
        console.log(error.response)
        let message
        if (error.response.data.error_description) {
          message = error.response.data.error_description
        } else if (error.response.data.message && error.response.data.message !== '') {
          message = error.response.data.message
        } else if (error.response.data.error && error.response.data.error !== '') {
          message = error.response.data.error
        }
        if (message) {
          ElMessage.error(message)
        }
        // 对响应错误做点什么
        return Promise.reject(error)
      }
    )
  }
}
