import type { AxiosInstance, AxiosRequestConfig } from "axios"
import { getToken } from "@@/utils/local-storage"
import axios from "axios"
import { ElMessage } from "element-plus" // 仅保留 ElMessage
import { get, merge } from "lodash-es"
import { useUserStore } from "@/pinia/stores/user"

/** 退出登录并强制刷新页面（会重定向到登录页） */
function logout() {
  useUserStore().logout()
  location.reload()
}

// 原生 loading 实现（不依赖 Element Plus 实例）
let loadingElement: HTMLDivElement | null = null
let requestCount = 0

function showLoading() {
  if (requestCount === 0) {
    loadingElement = document.createElement("div")
    loadingElement.style.position = "fixed"
    loadingElement.style.top = "0"
    loadingElement.style.left = "0"
    loadingElement.style.width = "100%"
    loadingElement.style.height = "100%"
    loadingElement.style.backgroundColor = "rgba(0,0,0,0.5)"
    loadingElement.style.display = "flex"
    loadingElement.style.justifyContent = "center"
    loadingElement.style.alignItems = "center"
    loadingElement.style.zIndex = "9999"
    loadingElement.innerHTML = "<div style=\"background:#fff; padding:20px; border-radius:8px;\">加载中...</div>"
    document.body.appendChild(loadingElement)
  }
  requestCount++
}

function hideLoading() {
  requestCount--
  if (requestCount <= 0) {
    requestCount = 0
    if (loadingElement) {
      loadingElement.remove()
      loadingElement = null
    }
  }
}

/** 创建请求实例 */
function createInstance() {
  const instance = axios.create()

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 开启 loading（可排除某些请求，例如在 config.headers 中设置 hideLoading: true）
      if (!config.headers?.hideLoading) {
        showLoading()
      }
      return config
    },
    (error) => {
      hideLoading()
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      hideLoading()
      const apiData = response.data
      const responseType = response.config.responseType
      if (responseType === "blob" || responseType === "arraybuffer") return apiData

      const code = apiData.code
      if (code === undefined) {
        ElMessage.error("非本系统的接口")
        return Promise.reject(new Error("非本系统的接口"))
      }

      switch (code) {
        case 0:
          return apiData
        case 401:
          logout()
          return Promise.reject(new Error("登录已过期"))
        default:
          ElMessage.error(apiData.message || "Error")
          return Promise.reject(new Error(apiData.message || "Error"))
      }
    },
    (error) => {
      hideLoading()
      const status = get(error, "response.status")
      const message = get(error, "response.data.message")
      switch (status) {
        case 400:
          error.message = "请求错误"
          break
        case 401:
          error.message = message || "未授权"
          logout()
          break
        case 403:
          error.message = message || "拒绝访问"
          break
        case 404:
          error.message = "请求地址出错"
          break
        case 408:
          error.message = "请求超时"
          break
        case 500:
          error.message = "服务器内部错误"
          break
        case 501:
          error.message = "服务未实现"
          break
        case 502:
          error.message = "网关错误"
          break
        case 503:
          error.message = "服务不可用"
          break
        case 504:
          error.message = "网关超时"
          break
        case 505:
          error.message = "HTTP 版本不受支持"
          break
        default:
          if (!message) error.message = "请求失败"
      }
      ElMessage.error(error.message)
      return Promise.reject(error)
    }
  )
  return instance
}

/** 创建请求方法 */
function createRequest(instance: AxiosInstance) {
  return <T>(config: AxiosRequestConfig): Promise<T> => {
    const token = getToken()
    const defaultConfig: AxiosRequestConfig = {
      baseURL: import.meta.env.VITE_BASE_URL,
      headers: {
        "Authorization": token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json"
      },
      data: {},
      timeout: 5000,
      withCredentials: false
    }
    const mergeConfig = merge(defaultConfig, config)
    return instance(mergeConfig)
  }
}

const instance = createInstance()
export const request = createRequest(instance)
