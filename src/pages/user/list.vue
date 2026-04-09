<script setup lang="ts">
import { ref } from "vue"

const userList = ref([
  { id: 1, username: "admin", email: "admin@example.com", role: "管理员", status: "启用", createTime: "2025-01-10 09:00" },
  { id: 2, username: "zhang_san", email: "zhangsan@example.com", role: "普通用户", status: "启用", createTime: "2025-02-15 14:20" },
  { id: 3, username: "li_si", email: "lisi@example.com", role: "普通用户", status: "停用", createTime: "2025-03-01 10:30" },
  { id: 4, username: "wang_wu", email: "wangwu@example.com", role: "VIP", status: "启用", createTime: "2025-03-10 16:45" }
])
</script>

<template>
  <div>
    <h2>用户列表</h2>
    <el-table :data="userList" border>
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
    </el-table>
  </div>
</template>
