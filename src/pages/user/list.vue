<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus"
import { ElMessage } from "element-plus"
import { onMounted, reactive, ref } from "vue"

interface User {
  id: number
  username: string
  email: string
  role: string
  status: string
  createTime: string
}

const STORAGE_KEY = "ecommerce_users"
const userList = ref<User[]>([])

const formRef = ref<FormInstance>()
const dialogVisible = ref(false)
const dialogTitle = ref("")
const currentUser = reactive<User>({
  id: 0,
  username: "",
  email: "",
  role: "普通用户",
  status: "启用",
  createTime: ""
})
let editId = -1

const deleteDialogVisible = ref(false)
let deleteIndex = -1

function getCurrentTime() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
}

const rules: FormRules = {
  username: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
  ],
  email: [
    { required: true, message: "邮箱不能为空", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
  ],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }]
}

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userList.value))
}

function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    userList.value = JSON.parse(stored)
  } else {
    userList.value = [
      { id: 1, username: "admin", email: "admin@example.com", role: "管理员", status: "启用", createTime: "2025-01-10 09:00" },
      { id: 2, username: "zhang_san", email: "zhangsan@example.com", role: "普通用户", status: "启用", createTime: "2025-02-15 14:20" },
      { id: 3, username: "li_si", email: "lisi@example.com", role: "普通用户", status: "停用", createTime: "2025-03-01 10:30" },
      { id: 4, username: "wang_wu", email: "wangwu@example.com", role: "VIP", status: "启用", createTime: "2025-03-10 16:45" }
    ]
    saveToLocalStorage()
  }
}

function addUser() {
  dialogTitle.value = "新增用户"
  currentUser.id = 0
  currentUser.username = ""
  currentUser.email = ""
  currentUser.role = "普通用户"
  currentUser.status = "启用"
  currentUser.createTime = ""
  editId = -1
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

function editUser(row: User) {
  dialogTitle.value = "编辑用户"
  Object.assign(currentUser, row)
  editId = row.id
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

async function saveUser() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    if (editId === -1) {
      const newId = Math.max(...userList.value.map(u => u.id), 0) + 1
      const newUser: User = {
        id: newId,
        username: currentUser.username,
        email: currentUser.email,
        role: currentUser.role,
        status: currentUser.status,
        createTime: getCurrentTime()
      }
      userList.value.push(newUser)
      ElMessage.success("新增成功")
    } else {
      const index = userList.value.findIndex(u => u.id === editId)
      if (index !== -1) {
        const updatedUser = { ...currentUser, createTime: userList.value[index].createTime }
        userList.value[index] = updatedUser
        ElMessage.success("保存成功")
      }
    }
    dialogVisible.value = false
    saveToLocalStorage()
  } catch (error) {
    console.log("表单验证失败", error)
  }
}

function deleteUser(index: number) {
  deleteIndex = index
  deleteDialogVisible.value = true
}

function confirmDelete() {
  if (deleteIndex !== -1) {
    userList.value.splice(deleteIndex, 1)
    ElMessage.success("删除成功")
    deleteDialogVisible.value = false
    deleteIndex = -1
    saveToLocalStorage()
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div>
    <h2>用户列表</h2>
    <el-button type="primary" @click="addUser">
      新增用户
    </el-button>
    <el-table :data="userList" border style="margin-top: 20px">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '启用' ? 'success' : 'danger'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="180" />
      <el-table-column label="操作" width="180">
        <template #default="{ row, $index }">
          <el-button size="small" @click="editUser(row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="deleteUser($index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
      <el-form ref="formRef" :model="currentUser" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="currentUser.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="currentUser.email" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="currentUser.role">
            <el-option label="管理员" value="管理员" />
            <el-option label="普通用户" value="普通用户" />
            <el-option label="VIP" value="VIP" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="currentUser.status">
            <el-option label="启用" value="启用" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveUser">
          保存
        </el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="deleteDialogVisible" title="确认删除" width="30%" center>
      <span>确定要删除该用户吗？</span>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">
          取消
        </el-button>
        <el-button type="danger" @click="confirmDelete">
          确定删除
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
