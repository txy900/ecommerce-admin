import { request } from "../axios"

export interface Product {
  id: number
  name: string
  price: number
  stock: number
  status: string
}

export const getProductList = () => request<Product[]>({ url: "/products", method: "get" })

export function addProduct(data: Omit<Product, "id">) {
  return request<Product>({ url: "/products", method: "post", data })
}

export function updateProduct(id: number, data: Partial<Product>) {
  return request<Product>({ url: `/products/${id}`, method: "put", data })
}

export function deleteProduct(id: number) {
  return request({ url: `/products/${id}`, method: "delete" })
}
