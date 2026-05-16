<script setup lang="ts">
import type { Order } from "@/http/apis/order"
import { ElMessage } from "element-plus"
import { computed, onMounted, reactive, ref } from "vue"
import { useOrderStore } from "@/pinia/stores/order"
import { useProductStore } from "@/pinia/stores/product"

const orderStore = useOrderStore()
const productStore = useProductStore()

const dialogVisible = ref(false)
const formRef = ref()
const submitLock = ref(false)
const newOrderForm = reactive({
  productId: null as number | null,
  quantity: 1,
  userName: ""
})

const selectedProduct = computed(() => productStore.list.find(p => p.id === newOrderForm.productId))
const totalAmount = computed(() => (selectedProduct.value?.price || 0) * newOrderForm.quantity)

async function createOrder() {
  if (submitLock.value) return
  submitLock.value = true

  try {
    const product = selectedProduct.value
    if (!product) {
      ElMessage.warning("请选择商品")
      return
    }
    if (!newOrderForm.userName) {
      ElMessage.warning("请输入用户名")
      return
    }
    if (newOrderForm.quantity <= 0) {
      ElMessage.warning("数量必须大于0")
      return
    }
    if (product.stock < newOrderForm.quantity) {
      ElMessage.error(`库存不足，当前库存：${product.stock}`)
      return
    }

    await orderStore.create({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: newOrderForm.quantity,
      totalAmount: totalAmount.value,
      userName: newOrderForm.userName,
      status: "待处理"
    })

    dialogVisible.value = false
    newOrderForm.productId = null
    newOrderForm.quantity = 1
    newOrderForm.userName = ""
  } catch (error) {
    console.error("创建订单失败", error)
  } finally {
    setTimeout(() => {
      submitLock.value = false
    }, 1000)
  }
}

async function handleShip(order: Order) {
  try {
    await orderStore.update(order.id, { status: "已发货" })
  } catch (error) {
    console.error("发货失败", error)
  }
}

async function handleComplete(order: Order) {
  try {
    await orderStore.update(order.id, { status: "已完成" })
  } catch (error) {
    console.error("完成订单失败", error)
  }
}

async function handleDelete(id: number) {
  try {
    await orderStore.deleteOrder(id)
  } catch (error) {
    console.error("删除订单失败", error)
  }
}

onMounted(() => {
  orderStore.fetchList()
  productStore.fetchList()
})
</script>

<template>
  <div>
    <h2>订单列表</h2>
    <el-button type="primary" @click="dialogVisible = true">
      新增订单
    </el-button>
    <el-table :data="orderStore.list" border :loading="orderStore.loading">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="productName" label="商品" />
      <el-table-column prop="price" label="单价" />
      <el-table-column prop="quantity" label="数量" />
      <el-table-column prop="totalAmount" label="总金额" />
      <el-table-column prop="userName" label="用户" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '已完成' ? 'success' : row.status === '已发货' ? 'warning' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column label="操作" width="240">
        <template #default="{ row }">
          <el-button size="small" @click="handleShip(row)" v-if="row.status === '待处理'" type="success">
            发货
          </el-button>
          <el-button size="small" @click="handleComplete(row)" v-if="row.status === '已发货'" type="primary">
            完成
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="创建订单" width="30%">
      <el-form ref="formRef" :model="newOrderForm" label-width="80px">
        <el-form-item label="商品" required>
          <el-select v-model="newOrderForm.productId" placeholder="请选择商品" style="width: 100%">
            <el-option v-for="p in productStore.list" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" required>
          <el-input v-model.number="newOrderForm.quantity" type="number" min="1" />
        </el-form-item>
        <el-form-item label="用户名" required>
          <el-input v-model="newOrderForm.userName" />
        </el-form-item>
        <el-form-item label="单价">
          <span>{{ selectedProduct?.price || 0 }} 元</span>
        </el-form-item>
        <el-form-item label="总金额">
          <span>{{ totalAmount }} 元</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createOrder" :disabled="submitLock">
          创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
