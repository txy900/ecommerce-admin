import type { Product } from "@/http/apis/product"
import { ElMessage } from "element-plus"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import {
  createProductApi,
  deleteProductApi,
  getProductListApi,

  updateProductApi
} from "@/http/apis/product"

export const useProductStore = defineStore(
  "product",
  () => {
    const list = ref<Product[]>([])
    const loading = ref(false)

    const totalProducts = computed(() => list.value.length)
    const totalStock = computed(() => list.value.reduce((sum, p) => sum + p.stock, 0))
    const onSaleCount = computed(() => list.value.filter(p => p.status === "上架").length)
    const offSaleCount = computed(() => list.value.filter(p => p.status === "下架").length)

    async function fetchList() {
      loading.value = true
      try {
        const response = await getProductListApi()
        list.value = response.data
        return response.data
      } catch (error) {
        ElMessage.error("获取商品列表失败")
        throw error
      } finally {
        loading.value = false
      }
    }

    async function create(data: Omit<Product, "id">) {
      loading.value = true
      try {
        const response = await createProductApi(data)
        list.value.push(response.data)
        ElMessage.success("新增成功")
        return response.data
      } catch (error) {
        ElMessage.error("新增失败")
        throw error
      } finally {
        loading.value = false
      }
    }

    async function update(id: number, data: Partial<Product>) {
      loading.value = true
      try {
        const response = await updateProductApi(id, data)
        const index = list.value.findIndex(p => p.id === id)
        if (index !== -1) {
          list.value[index] = response.data
        }
        ElMessage.success("更新成功")
        return response.data
      } catch (error) {
        ElMessage.error("更新失败")
        throw error
      } finally {
        loading.value = false
      }
    }

    async function deleteProduct(id: number) {
      loading.value = true
      try {
        await deleteProductApi(id)
        const index = list.value.findIndex(p => p.id === id)
        if (index !== -1) {
          list.value.splice(index, 1)
        }
        ElMessage.success("删除成功")
      } catch (error) {
        ElMessage.error("删除失败")
        throw error
      } finally {
        loading.value = false
      }
    }

    function reduceStock(productId: number, quantity: number) {
      const product = list.value.find(p => p.id === productId)
      if (product && product.stock >= quantity) {
        product.stock -= quantity
        return true
      }
      return false
    }

    return {
      list,
      loading,
      totalProducts,
      totalStock,
      onSaleCount,
      offSaleCount,
      fetchList,
      create,
      update,
      deleteProduct,
      reduceStock
    }
  },
  {
    persist: false
  }
)
