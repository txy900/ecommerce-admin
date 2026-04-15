import { defineStore } from "pinia"
import { computed, ref } from "vue"

export interface Product {
  id: number
  name: string
  price: number
  stock: number
  status: "上架" | "下架"
}

export const useProductStore = defineStore(
  "product",
  () => {
    // 数据
    const products = ref<Product[]>([
      { id: 1, name: "苹果", price: 5, stock: 100, status: "上架" },
      { id: 2, name: "香蕉", price: 3, stock: 50, status: "上架" },
      { id: 3, name: "橙子", price: 6, stock: 80, status: "下架" }
    ])

    // 计算属性
    const totalProducts = computed(() => products.value.length)
    const totalStock = computed(() => products.value.reduce((sum, p) => sum + p.stock, 0))
    const onSaleCount = computed(() => products.value.filter(p => p.status === "上架").length)
    const offSaleCount = computed(() => products.value.filter(p => p.status === "下架").length)

    // 方法
    function addProduct(product: Omit<Product, "id">) {
      const newId = Math.max(...products.value.map(p => p.id), 0) + 1
      products.value.push({ id: newId, ...product })
    }

    function updateProduct(id: number, updated: Partial<Product>) {
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = { ...products.value[index], ...updated }
      }
    }

    function deleteProduct(id: number) {
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value.splice(index, 1)
      }
    }

    function reduceStock(productId: number, quantity: number) {
      const product = products.value.find(p => p.id === productId)
      if (product && product.stock >= quantity) {
        product.stock -= quantity
        return true
      }
      return false
    }

    return {
      products,
      totalProducts,
      totalStock,
      onSaleCount,
      offSaleCount,
      addProduct,
      updateProduct,
      deleteProduct,
      reduceStock
    }
  },
  {
    persist: true // 自动保存到 localStorage
  }
)
