<script setup lang="ts">
import { ElMessage } from "element-plus"
import { reactive, ref } from "vue"

// 订单数据接口
interface Order {
  id: number
  orderNo: string
  productName: string
  userName: string
  amount: number
  status: string
}

// 假数据
const orderList = ref<Order[]>([
  { id: 1, orderNo: "DD001", productName: "苹果", userName: "张三", amount: 10, status: "已完成" },
  { id: 2, orderNo: "DD002", productName: "香蕉", userName: "李四", amount: 6, status: "处理中" },
  { id: 3, orderNo: "DD003", productName: "橙子", userName: "王五", amount: 12, status: "已取消" }
])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref("新增订单")
const currentOrder = reactive<Order>({
  id: 0,
  orderNo: "",
  productName: "",
  userName: "",
  amount: 0,
  status: "处理中"
})
let editId = -1 // -1 表示新增，否则为编辑的订单id

// 删除弹窗相关
const deleteDialogVisible = ref(false)
let deleteIndex = -1

// 新增订单
function addOrder() {
  dialogTitle.value = "新增订单"
  // 重置表单
  currentOrder.id = 0
  currentOrder.orderNo = ""
  currentOrder.productName = ""
  currentOrder.userName = ""
  currentOrder.amount = 0
  currentOrder.status = "处理中"
  editId = -1
  dialogVisible.value = true
}

// 编辑订单
function editOrder(row: Order) {
  dialogTitle.value = "编辑订单"
  Object.assign(currentOrder, row)
  editId = row.id
  dialogVisible.value = true
}

// 保存订单
function saveOrder() {
  if (editId === -1) {
    // 新增：生成新id
    const newId = Math.max(...orderList.value.map(o => o.id), 0) + 1
    const newOrder: Order = {
      id: newId,
      orderNo: currentOrder.orderNo,
      productName: currentOrder.productName,
      userName: currentOrder.userName,
      amount: currentOrder.amount,
      status: currentOrder.status
    }
    orderList.value.push(newOrder)
    ElMessage.success("新增成功")
  } else {
    // 编辑：找到对应索引替换
    const index = orderList.value.findIndex(o => o.id === editId)
    if (index !== -1) {
      orderList.value[index] = { ...currentOrder }
      ElMessage.success("保存成功")
    }
  }
  dialogVisible.value = false
}

// 删除订单（打开确认弹窗）
function deleteOrder(index: number) {
  deleteIndex = index
  deleteDialogVisible.value = true
}

// 确认删除
function confirmDelete() {
  if (deleteIndex !== -1) {
    orderList.value.splice(deleteIndex, 1)
    ElMessage.success("删除成功")
    deleteDialogVisible.value = false
    deleteIndex = -1
  }
}
</script>

<template>
  <div>
    <h2>订单列表</h2>
    <el-button type="primary" @click="addOrder">
      新增订单
    </el-button>
    <el-table :data="orderList" border style="margin-top: 20px">
      <el-table-column prop="orderNo" label="订单号" width="180" />
      <el-table-column prop="productName" label="商品" />
      <el-table-column prop="userName" label="用户" />
      <el-table-column prop="amount" label="金额(元)" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '已完成' ? 'success' : row.status === '处理中' ? 'warning' : 'danger'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row, $index }">
          <el-button size="small" @click="editOrder(row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="deleteOrder($index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑/新增弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
      <el-form :model="currentOrder" label-width="80px">
        <el-form-item label="订单号">
          <el-input v-model="currentOrder.orderNo" />
        </el-form-item>
        <el-form-item label="商品">
          <el-input v-model="currentOrder.productName" />
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="currentOrder.userName" />
        </el-form-item>
        <el-form-item label="金额">
          <el-input-number v-model="currentOrder.amount" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="currentOrder.status">
            <el-option label="处理中" value="处理中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已取消" value="已取消" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveOrder">
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 删除确认弹窗 -->
    <el-dialog v-model="deleteDialogVisible" title="确认删除" width="30%" center>
      <span>确定要删除该订单吗？</span>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">
          取消
        </el-button>
        <el-button type="danger" @click="confirmDelete">
          确定删除
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
