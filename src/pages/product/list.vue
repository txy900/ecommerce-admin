<script setup lang="ts">
import { ElMessage } from "element-plus"
import { reactive, ref } from "vue"

// 假数据
const productList = ref([
  { id: 1, name: "苹果", price: 5, stock: 100, status: "上架" },
  { id: 2, name: "香蕉", price: 3, stock: 50, status: "上架" },
  { id: 3, name: "橙子", price: 6, stock: 80, status: "下架" }
])

// 编辑弹窗相关
const dialogVisible = ref(false)
const currentProduct = reactive({ id: 0, name: "", price: 0, stock: 0, status: "" })
let editIndex = -1

// 删除弹窗相关（新加）
const deleteDialogVisible = ref(false)
let deleteIndex = -1

function addProduct() {
  const newId = Math.max(...productList.value.map(p => p.id), 0) + 1
  productList.value.push({
    id: newId,
    name: "新商品",
    price: 0,
    stock: 0,
    status: "下架"
  })
  ElMessage.success("已添加，请编辑")
}

function editProduct(row: any) {
  editIndex = productList.value.findIndex(p => p.id === row.id)
  Object.assign(currentProduct, row)
  dialogVisible.value = true
}

function saveProduct() {
  if (editIndex !== -1) {
    productList.value[editIndex] = { ...currentProduct }
    ElMessage.success("保存成功")
  }
  dialogVisible.value = false
}

// 删除：打开自定义弹窗（修改后）
function deleteProduct(index: number) {
  deleteIndex = index
  deleteDialogVisible.value = true
}

// 确认删除（新加）
function confirmDelete() {
  if (deleteIndex !== -1) {
    productList.value.splice(deleteIndex, 1)
    ElMessage.success("删除成功")
    deleteDialogVisible.value = false
    deleteIndex = -1
  }
}
</script>

<template>
  <div>
    <h2>商品列表</h2>
    <el-button type="primary" @click="addProduct">
      新增商品
    </el-button>
    <el-table :data="productList" border style="margin-top: 20px">
      <el-table-column prop="name" label="商品名称" />
      <el-table-column prop="price" label="价格(元)" />
      <el-table-column prop="stock" label="库存" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === '上架' ? 'success' : 'danger'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row, $index }">
          <el-button size="small" @click="editProduct(row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="deleteProduct($index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑商品弹窗 -->
    <el-dialog v-model="dialogVisible" title="编辑商品" width="30%">
      <el-form :model="currentProduct">
        <el-form-item label="商品名称">
          <el-input v-model="currentProduct.name" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="currentProduct.price" :min="0" />
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="currentProduct.stock" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="currentProduct.status">
            <el-option label="上架" value="上架" />
            <el-option label="下架" value="下架" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveProduct">
          保存
        </el-button>
      </template>
    </el-dialog>

    <!-- 删除确认弹窗（新加） -->
    <el-dialog v-model="deleteDialogVisible" title="确认删除" width="30%" center>
      <span>确定要删除该商品吗？</span>
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
