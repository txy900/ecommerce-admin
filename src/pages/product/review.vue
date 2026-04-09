<script setup lang="ts">
import { ref } from "vue"

const reviewList = ref([
  { userName: "张三", productName: "苹果", rating: 5, content: "非常好吃，新鲜！", createTime: "2025-03-15 10:30" },
  { userName: "李四", productName: "香蕉", rating: 4, content: "不错，就是有点青", createTime: "2025-03-14 15:20" },
  { userName: "王五", productName: "橙子", rating: 5, content: "汁多味甜", createTime: "2025-03-12 09:15" }
])
</script>

<template>
  <div>
    <h2>商品评价</h2>
    <el-table :data="reviewList" border>
      <el-table-column prop="userName" label="用户" width="120" />
      <el-table-column prop="productName" label="商品" />
      <el-table-column prop="rating" label="评分" width="100">
        <template #default="{ row }">
          <el-rate v-model="row.rating" disabled />
        </template>
      </el-table-column>
      <el-table-column prop="content" label="评价内容" />
      <el-table-column prop="createTime" label="评价时间" width="180" />
    </el-table>
  </div>
</template>
