// mock/auth.ts
import type { MockMethod } from "vite-plugin-mock"

export default [
  // 验证码
  {
    url: "/api/v1/auth/captcha",
    method: "get",
    response: () => ({
      code: 0,
      data: {
        captchaKey: "mock-captcha-key",
        captchaImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZm9udC1zaXplPSIyMCI+MjM0NTwvdGV4dD48L3N2Zz4="
      },
      message: "success"
    })
  },
  // 登录
  {
    url: "/api/v1/auth/login",
    method: "post",
    response: ({ body }: { body: any }) => {
      const { username, password } = body
      if (username && password) {
        return {
          code: 0,
          data: {
            token: `mock-token-${Date.now()}`,
            userInfo: { id: 1, username, roles: ["admin"] }
          },
          message: "登录成功"
        }
      }
      return { code: 400, message: "用户名或密码不能为空" }
    }
  },
  // 获取当前用户信息（关键！）
  {
    url: "/api/v1/users/me",
    method: "get",
    response: () => ({
      code: 0,
      data: {
        id: 1,
        username: "admin",
        email: "admin@example.com",
        roles: ["admin"],
        avatar: ""
      },
      message: "success"
    })
  },
  // 获取用户信息（兼容旧路径）
  {
    url: "/api/v1/auth/user-info",
    method: "get",
    response: () => ({
      code: 0,
      data: { id: 1, username: "admin", roles: ["admin"], avatar: "" },
      message: "success"
    })
  },
  // 退出登录
  {
    url: "/api/v1/auth/logout",
    method: "post",
    response: () => ({ code: 0, data: null, message: "退出成功" })
  }
] as MockMethod[]
