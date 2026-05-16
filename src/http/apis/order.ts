import { request } from "../axios"

export interface Order {
  id: number
  productId: number
  productName: string
  price: number
  quantity: number
  totalAmount: number
  userName: string
  status: "待处理" | "已发货" | "已完成"
  createTime: string
}

export interface OrderListResponse {
  code: number
  data: Order[]
  message: string
}

export interface OrderResponse {
  code: number
  data: Order
  message: string
}

export interface EmptyResponse {
  code: number
  message: string
}

export const getOrderListApi = () => request<OrderListResponse>({ url: "/orders", method: "get" })

export function createOrderApi(data: Omit<Order, "id" | "createTime">) {
  return request<OrderResponse>({ url: "/orders", method: "post", data })
}

export function updateOrderApi(id: number, data: Partial<Order>) {
  return request<OrderResponse>({ url: `/orders/${id}`, method: "put", data })
}

export function deleteOrderApi(id: number) {
  return request<EmptyResponse>({ url: `/orders/${id}`, method: "delete" })
}
