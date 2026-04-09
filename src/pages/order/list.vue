<script setup lang="ts">
import { ref } from "vue"

const orderList = ref([
  { orderNo: "DD001", productName: "苹果", userName: "张三", amount: 10, status: "已完成" },
  { orderNo: "DD002", productName: "香蕉", userName: "李四", amount: 6, status: "处理中" }
])
</script>

<template>
  <div>
    <h2>订单列表</h2>
    <el-table :data="orderList" border>
      <el-table-column prop="orderNo" label="订单号" />
      <el-table-column prop="productName" label="商品" />
      <el-table-column prop="userName" label="用户" />
      <el-table-column prop="amount" label="金额" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
