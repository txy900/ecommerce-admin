<!-- <script setup lang="ts">
import { ref } from "vue"

// 模拟数据（实际可以从商品列表接口获取，这里写死）
const totalProducts = ref(12)
const totalStock = ref(1520)
const onSaleCount = ref(9)
const offSaleCount = ref(3)
</script>

<template>
  <div>
    <h2>商品数据统计</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center">
            <div style="font-size: 28px; color: #409EFF;">
              {{ totalProducts }}
            </div>
            <div>总商品数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center">
            <div style="font-size: 28px; color: #67C23A;">
              {{ totalStock }}
            </div>
            <div>总库存量</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center">
            <div style="font-size: 28px; color: #E6A23C;">
              {{ onSaleCount }}
            </div>
            <div>上架商品数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div style="text-align: center">
            <div style="font-size: 28px; color: #F56C6C;">
              {{ offSaleCount }}
            </div>
            <div>下架商品数</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template> -->

<script setup lang="ts">
import { useProductStore } from "@/pinia/stores/product"

const productStore = useProductStore()
</script>

<template>
  <div>
    <h2>商品数据统计</h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div style="text-align:center">
            <div style="font-size:28px;color:#409EFF">
              {{ productStore.totalProducts }}
            </div><div>总商品数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="text-align:center">
            <div style="font-size:28px;color:#67C23A">
              {{ productStore.totalStock }}
            </div><div>总库存量</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="text-align:center">
            <div style="font-size:28px;color:#E6A23C">
              {{ productStore.onSaleCount }}
            </div><div>上架商品数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="text-align:center">
            <div style="font-size:28px;color:#F56C6C">
              {{ productStore.offSaleCount }}
            </div><div>下架商品数</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
