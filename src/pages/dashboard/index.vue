<!-- <script lang="ts" setup>
import { useUserStore } from "@/pinia/stores/user"
import Admin from "./components/Admin.vue"
import Editor from "./components/Editor.vue"

const userStore = useUserStore()

const isAdmin = userStore.roles.includes("admin")
</script>

<template>
  <component :is="isAdmin ? Admin : Editor" />
</template> -->

<script setup lang="ts">
import * as echarts from "echarts"
import { computed, onMounted, onUnmounted, ref } from "vue"

// 从 localStorage 读取数据
function getProductList() {
  const stored = localStorage.getItem("ecommerce_products")
  if (stored) return JSON.parse(stored)
  return []
}

function getOrderList() {
  const stored = localStorage.getItem("ecommerce_orders")
  if (stored) return JSON.parse(stored)
  return []
}

function getUserList() {
  const stored = localStorage.getItem("ecommerce_users")
  if (stored) return JSON.parse(stored)
  return []
}

// 统计数据
const totalProducts = computed(() => getProductList().length)
const totalOrders = computed(() => getOrderList().length)
const totalUsers = computed(() => getUserList().length)
const totalStock = computed(() => {
  const products = getProductList()
  return products.reduce((sum: number, p: any) => sum + (p.stock || 0), 0)
})

// 图表
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  // 获取商品和订单数据用于图表展示（按名称或时间，这里简单展示前5个商品销量）
  const products = getProductList()
  const productNames = products.slice(0, 5).map((p: any) => p.name)
  const productSales = products.slice(0, 5).map((p: any) => p.stock || 0)

  const option = {
    title: {
      text: "商品库存排行（前5）"
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" }
    },
    xAxis: {
      type: "category",
      data: productNames,
      axisLabel: { rotate: 30 }
    },
    yAxis: {
      type: "value",
      name: "库存量"
    },
    series: [
      {
        name: "库存",
        type: "bar",
        data: productSales,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: "#409EFF"
        }
      }
    ]
  }

  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(option)
  // 响应式调整
  window.addEventListener("resize", () => chartInstance?.resize())
}

// 监听 localStorage 变化（当其他页面修改数据时，自动更新图表）
function handleStorageChange() {
  if (chartInstance) {
    const products = getProductList()
    const productNames = products.slice(0, 5).map((p: any) => p.name)
    const productSales = products.slice(0, 5).map((p: any) => p.stock || 0)
    chartInstance.setOption({
      xAxis: { data: productNames },
      series: [{ data: productSales }]
    })
  }
}

onMounted(() => {
  initChart()
  window.addEventListener("storage", handleStorageChange)
})

onUnmounted(() => {
  window.removeEventListener("storage", handleStorageChange)
  chartInstance?.dispose()
})
</script>

<template>
  <div>
    <h2>控制台</h2>
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center">
            <div style="font-size: 28px; color: #409EFF;">
              {{ totalProducts }}
            </div>
            <div>商品总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center">
            <div style="font-size: 28px; color: #67C23A;">
              {{ totalOrders }}
            </div>
            <div>订单总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center">
            <div style="font-size: 28px; color: #E6A23C;">
              {{ totalUsers }}
            </div>
            <div>用户总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center">
            <div style="font-size: 28px; color: #F56C6C;">
              {{ totalStock }}
            </div>
            <div>总库存量</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-card style="margin-top: 20px">
      <div ref="chartRef" style="width: 100%; height: 400px;" />
    </el-card>
  </div>
</template>
