import { request } from "../axios"

export interface User {
  id: number
  username: string
  email: string
  role: string
  status: string
  createTime: string
}

export interface UserListResponse {
  code: number
  data: User[]
  message: string
}

export interface UserResponse {
  code: number
  data: User
  message: string
}

export interface EmptyResponse {
  code: number
  message: string
}

export const getUserListApi = () => request<UserListResponse>({ url: "/users", method: "get" })

export function createUserApi(data: Omit<User, "id" | "createTime">) {
  return request<UserResponse>({ url: "/users", method: "post", data })
}

export function updateUserApi(id: number, data: Partial<User>) {
  return request<UserResponse>({ url: `/users/${id}`, method: "put", data })
}

export function deleteUserApi(id: number) {
  return request<EmptyResponse>({ url: `/users/${id}`, method: "delete" })
}
