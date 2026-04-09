<script setup lang="ts">
import { ref } from "vue"

const recordList = ref([
  { productName: "苹果", quantity: 200, operator: "采购员A", createTime: "2025-03-16 14:30" },
  { productName: "香蕉", quantity: 150, operator: "采购员B", createTime: "2025-03-15 11:20" },
  { productName: "橙子", quantity: 180, operator: "采购员A", createTime: "2025-03-14 09:45" }
])
</script>

<template>
  <div>
    <h2>入库记录</h2>
    <el-table :data="recordList" border>
      <el-table-column prop="productName" label="商品名称" />
      <el-table-column prop="quantity" label="入库数量" width="120" />
      <el-table-column prop="operator" label="操作人" width="120" />
      <el-table-column prop="createTime" label="入库时间" width="180" />
    </el-table>
  </div>
</template>
