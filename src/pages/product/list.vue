<script setup lang="ts">
import { ElMessage } from "element-plus"
import { onMounted, reactive, ref } from "vue"

// 定义商品类型
interface Product {
  id: number
  name: string
  price: number
  stock: number
  status: "上架" | "下架"
}

// localStorage 的 key
const STORAGE_KEY = "ecommerce_products"

// 响应式数据
const productList = ref<Product[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref("")
const currentProduct = reactive<Product>({
  id: 0,
  name: "",
  price: 0,
  stock: 0,
  status: "上架"
})
let editId = -1

// 删除弹窗
const deleteDialogVisible = ref(false)
let deleteIndex = -1

// 保存数据到 localStorage
function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productList.value))
}

// 加载数据（初始化）
function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    productList.value = JSON.parse(stored)
  } else {
    // 默认数据
    productList.value = [
      { id: 1, name: "苹果", price: 5, stock: 100, status: "上架" },
      { id: 2, name: "香蕉", price: 3, stock: 50, status: "上架" },
      { id: 3, name: "橙子", price: 6, stock: 80, status: "下架" }
    ]
    saveToLocalStorage()
  }
}

// 新增商品
function addProduct() {
  dialogTitle.value = "新增商品"
  // 重置表单
  currentProduct.id = 0
  currentProduct.name = ""
  currentProduct.price = 0
  currentProduct.stock = 0
  currentProduct.status = "上架"
  editId = -1
  dialogVisible.value = true
}

// 编辑商品
function editProduct(row: Product) {
  dialogTitle.value = "编辑商品"
  Object.assign(currentProduct, row)
  editId = row.id
  dialogVisible.value = true
}

// 保存商品（新增或编辑）
function saveProduct() {
  if (editId === -1) {
    // 新增：生成新 id
    const newId = Math.max(...productList.value.map(p => p.id), 0) + 1
    const newProduct: Product = {
      id: newId,
      name: currentProduct.name,
      price: currentProduct.price,
      stock: currentProduct.stock,
      status: currentProduct.status
    }
    productList.value.push(newProduct)
    ElMessage.success("新增成功")
  } else {
    // 编辑：找到索引替换
    const index = productList.value.findIndex(p => p.id === editId)
    if (index !== -1) {
      productList.value[index] = { ...currentProduct }
      ElMessage.success("保存成功")
    }
  }
  dialogVisible.value = false
  saveToLocalStorage() // 保存到 localStorage
}

// 删除商品（打开确认框）
function deleteProduct(index: number) {
  deleteIndex = index
  deleteDialogVisible.value = true
}

// 确认删除
function confirmDelete() {
  if (deleteIndex !== -1) {
    productList.value.splice(deleteIndex, 1)
    ElMessage.success("删除成功")
    deleteDialogVisible.value = false
    deleteIndex = -1
    saveToLocalStorage() // 保存到 localStorage
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
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
      <el-table-column label="操作" width="180">
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

    <!-- 编辑/新增弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
      <el-form :model="currentProduct" label-width="80px">
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

    <!-- 删除确认弹窗 -->
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
