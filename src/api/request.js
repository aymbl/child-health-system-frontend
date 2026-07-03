import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: 'http://localhost:1314',
  timeout: 5000
})

request.interceptors.request.use(
  (config) => {
    // 统一为已登录请求补上 token，后端通过 Authorization 识别当前用户
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (response) => {
    const res = response.data

    // 当前项目后端统一返回 Result 结构，成功码兼容 200 / 1 两种写法
    if (res.code === 200 || res.code === 1) {
      return res
    }

    // 登录失效时直接清空本地登录态并回到登录页
    if (res.code === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    ElMessage.error(res.message || '请求失败')
    return Promise.reject(res)
  },
  (error) => {
    // 兜底处理真正的 HTTP 401，避免前端保留过期 token
    if (error.response?.status === 401 || error.response?.data?.code === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    ElMessage.error('请求失败，请检查后端服务是否启动')
    return Promise.reject(error)
  }
)

export default request
