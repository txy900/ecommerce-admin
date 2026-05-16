import type { User } from "@/http/apis/user"
import { ElMessage } from "element-plus"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import {
  createUserApi,
  deleteUserApi,
  getUserListApi,
  updateUserApi

} from "@/http/apis/user"

export const useUserDataStore = defineStore(
  "userData",
  () => {
    const list = ref<User[]>([])
    const loading = ref(false)

    const totalUsers = computed(() => list.value.length)

    async function fetchList() {
      loading.value = true
      try {
        const response = await getUserListApi()
        list.value = response.data
        return response.data
      } catch (error) {
        ElMessage.error("获取用户列表失败")
        throw error
      } finally {
        loading.value = false
      }
    }

    async function create(data: Omit<User, "id" | "createTime">) {
      loading.value = true
      try {
        const response = await createUserApi(data)
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

    async function update(id: number, data: Partial<User>) {
      loading.value = true
      try {
        const response = await updateUserApi(id, data)
        const index = list.value.findIndex(u => u.id === id)
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

    async function deleteUser(id: number) {
      loading.value = true
      try {
        await deleteUserApi(id)
        const index = list.value.findIndex(u => u.id === id)
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

    return {
      list,
      loading,
      totalUsers,
      fetchList,
      create,
      update,
      deleteUser
    }
  },
  {
    persist: false
  }
)
