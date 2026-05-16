<script setup lang="ts">
import * as echarts from "echarts"
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import { useOrderStore } from "@/pinia/stores/order"
import { useProductStore } from "@/pinia/stores/product"
import { useUserDataStore } from "@/pinia/stores/user-data"

const productStore = useProductStore()
const orderStore = useOrderStore()
const userStore = useUserDataStore()

const totalProducts = computed(() => productStore.totalProducts)
const totalOrders = computed(() => orderStore.list.length)
const totalUsers = computed(() => userStore.totalUsers)
const totalStock = computed(() => productStore.totalStock)

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (!chartRef.value) return
  const products = productStore.list
  const productNames = products.slice(0, 5).map(p => p.name)
  const productStocks = products.slice(0, 5).map(p => p.stock)

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
        data: productStocks,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: "#409EFF"
        }
      }
    ]
  }

  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(option)
  window.addEventListener("resize", () => chartInstance?.resize())
}

function updateChart() {
  if (chartInstance) {
    const products = productStore.list
    const productNames = products.slice(0, 5).map(p => p.name)
    const productStocks = products.slice(0, 5).map(p => p.stock)
    chartInstance.setOption({
      xAxis: { data: productNames },
      series: [{ data: productStocks }]
    })
  }
}

onMounted(async () => {
  await Promise.all([
    productStore.fetchList(),
    orderStore.fetchList(),
    userStore.fetchList()
  ])
  initChart()
})

watch(
  () => productStore.list,
  () => {
    updateChart()
  },
  { deep: true }
)

watch(
  () => orderStore.list,
  () => {},
  { deep: true }
)

watch(
  () => userStore.list,
  () => {},
  { deep: true }
)

onUnmounted(() => {
  chartInstance?.dispose()
})
</script>

<template>
  <div>
    <h2>控制台</h2>
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

    <el-card style="margin-top: 20px">
      <div ref="chartRef" style="width: 100%; height: 400px;" />
    </el-card>
  </div>
</template>
