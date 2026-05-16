import { request } from "../axios"

export interface Product {
  id: number
  name: string
  price: number
  stock: number
  status: "上架" | "下架"
}

export interface ProductListResponse {
  code: number
  data: Product[]
  message: string
}

export interface ProductResponse {
  code: number
  data: Product
  message: string
}

export interface EmptyResponse {
  code: number
  message: string
}

export const getProductListApi = () => request<ProductListResponse>({ url: "/products", method: "get" })

export function createProductApi(data: Omit<Product, "id">) {
  return request<ProductResponse>({ url: "/products", method: "post", data })
}

export function updateProductApi(id: number, data: Partial<Product>) {
  return request<ProductResponse>({ url: `/products/${id}`, method: "put", data })
}

export function deleteProductApi(id: number) {
  return request<EmptyResponse>({ url: `/products/${id}`, method: "delete" })
}
