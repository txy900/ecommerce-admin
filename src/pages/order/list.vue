<script setup lang="ts">
import { ElMessage } from "element-plus"
import { computed, reactive, ref } from "vue"
import { useOrderStore } from "@/pinia/stores/order"
import { useProductStore } from "@/pinia/stores/product"

const orderStore = useOrderStore()
const productStore = useProductStore()

const dialogVisible = ref(false)
const formRef = ref()
const newOrderForm = reactive({
  productId: null as number | null,
  quantity: 1,
  userName: ""
})

const selectedProduct = computed(() => productStore.products.find(p => p.id === newOrderForm.productId))
const totalAmount = computed(() => (selectedProduct.value?.price || 0) * newOrderForm.quantity)

function createOrder() {
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

  // 扣减库存
  const success = productStore.reduceStock(product.id, newOrderForm.quantity)
  if (!success) {
    ElMessage.error("扣减库存失败")
    return
  }

  // 创建订单
  orderStore.addOrder({
    productId: product.id,
    productName: product.name,
    price: product.price,
    quantity: newOrderForm.quantity,
    totalAmount: totalAmount.value,
    userName: newOrderForm.userName,
    status: "待处理"
  })

  ElMessage.success("订单创建成功")
  dialogVisible.value = false
  // 重置表单
  newOrderForm.productId = null
  newOrderForm.quantity = 1
  newOrderForm.userName = ""
}

function handleShip(order: any) {
  orderStore.updateOrderStatus(order.id, "已发货")
  ElMessage.success("订单已发货")
}

function handleComplete(order: any) {
  orderStore.updateOrderStatus(order.id, "已完成")
  ElMessage.success("订单已完成")
}

function handleDelete(id: number) {
  orderStore.deleteOrder(id)
  ElMessage.success("删除成功")
}
</script>

<template>
  <div>
    <h2>订单列表</h2>
    <el-button type="primary" @click="dialogVisible = true">
      新增订单
    </el-button>
    <el-table :data="orderStore.orders" border>
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

    <!-- 创建订单弹窗（简化版，避免复杂组件） -->
    <el-dialog v-model="dialogVisible" title="创建订单" width="30%">
      <el-form ref="formRef" :model="newOrderForm" label-width="80px">
        <el-form-item label="商品" required>
          <el-select v-model="newOrderForm.productId" placeholder="请选择商品" style="width: 100%">
            <el-option v-for="p in productStore.products" :key="p.id" :label="p.name" :value="p.id" />
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
        <el-button type="primary" @click="createOrder">
          创建
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
