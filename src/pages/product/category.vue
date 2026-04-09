<script setup lang="ts">
import { ref } from "vue"

const categoryList = ref([
  { id: 1, name: "电子产品", sort: 1, status: "启用" },
  { id: 2, name: "服装鞋帽", sort: 2, status: "启用" },
  { id: 3, name: "食品生鲜", sort: 3, status: "启用" },
  { id: 4, name: "家居用品", sort: 4, status: "停用" }
])
</script>

<template>
  <div>
    <h2>商品分类</h2>
    <el-table :data="categoryList" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="sort" label="排序" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '启用' ? 'success' : 'danger'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
