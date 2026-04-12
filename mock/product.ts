// mock/product.ts
import type { MockMethod } from "vite-plugin-mock"

// 初始商品数据
const products = [
  { id: 1, name: "苹果", price: 5, stock: 100, status: "上架" },
  { id: 2, name: "香蕉", price: 3, stock: 50, status: "上架" },
  { id: 3, name: "橙子", price: 6, stock: 80, status: "下架" }
]

export default [
  // 获取商品列表
  {
    url: "/products",
    method: "get",
    response: () => {
      return {
        code: 0,
        data: products,
        message: "success"
      }
    }
  },

  // 新增商品
  {
    url: "/products",
    method: "post",
    response: ({ body }: { body: any }) => {
      const newId = Math.max(...products.map(p => p.id), 0) + 1
      const newProduct = { id: newId, ...body }
      products.push(newProduct)
      return {
        code: 0,
        data: newProduct,
        message: "新增成功"
      }
    }
  },
  // 编辑商品
  {
    url: "/products/:id",
    method: "put",
    response: ({ query, body }: { query: any, body: any }) => {
      const id = Number.parseInt(query.id)
      const index = products.findIndex(p => p.id === id)
      if (index !== -1) {
        products[index] = { ...products[index], ...body }
        return { code: 0, data: products[index], message: "更新成功" }
      }
      return { code: 404, message: "商品不存在" }
    }
  },
  // 删除商品
  {
    url: "products/:id",
    method: "delete",
    response: ({ query }: { query: any }) => {
      const id = Number.parseInt(query.id)
      const index = products.findIndex(p => p.id === id)
      if (index !== -1) {
        products.splice(index, 1)
        return { code: 0, data: null, message: "删除成功" }
      }
      return { code: 404, message: "商品不存在" }
    }
  }
] as MockMethod[]
