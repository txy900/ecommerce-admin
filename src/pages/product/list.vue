<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus"
import { ElMessage } from "element-plus"
import { onMounted, reactive, ref } from "vue"

interface Product {
  id: number
  name: string
  price: number
  stock: number
  status: "上架" | "下架"
}

const STORAGE_KEY = "ecommerce_products"
const productList = ref<Product[]>([])

// 表单相关
const formRef = ref<FormInstance>()
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

// 校验规则
const rules: FormRules = {
  name: [
    { required: true, message: "商品名称不能为空", trigger: "blur" },
    { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
  ],
  price: [
    { required: true, message: "价格不能为空", trigger: "blur" },
    { type: "number", min: 0, message: "价格必须大于等于 0", trigger: "blur" }
  ],
  stock: [
    { required: true, message: "库存不能为空", trigger: "blur" },
    { type: "number", min: 0, message: "库存必须大于等于 0", trigger: "blur" }
  ],
  status: [
    { required: true, message: "请选择状态", trigger: "change" }
  ]
}

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(productList.value))
}

function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    productList.value = JSON.parse(stored)
  } else {
    productList.value = [
      { id: 1, name: "苹果", price: 5, stock: 100, status: "上架" },
      { id: 2, name: "香蕉", price: 3, stock: 50, status: "上架" },
      { id: 3, name: "橙子", price: 6, stock: 80, status: "下架" }
    ]
    saveToLocalStorage()
  }
}

function addProduct() {
  dialogTitle.value = "新增商品"
  currentProduct.id = 0
  currentProduct.name = ""
  currentProduct.price = 0
  currentProduct.stock = 0
  currentProduct.status = "上架"
  editId = -1
  dialogVisible.value = true
  // 清除校验
  formRef.value?.clearValidate()
}

function editProduct(row: Product) {
  dialogTitle.value = "编辑商品"
  Object.assign(currentProduct, row)
  editId = row.id
  dialogVisible.value = true
  formRef.value?.clearValidate()
}

async function saveProduct() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    if (editId === -1) {
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
      const index = productList.value.findIndex(p => p.id === editId)
      if (index !== -1) {
        productList.value[index] = { ...currentProduct }
        ElMessage.success("保存成功")
      }
    }
    dialogVisible.value = false
    saveToLocalStorage()
  } catch (error) {
    console.log("表单验证失败", error)
  }
}

function deleteProduct(index: number) {
  deleteIndex = index
  deleteDialogVisible.value = true
}

function confirmDelete() {
  if (deleteIndex !== -1) {
    productList.value.splice(deleteIndex, 1)
    ElMessage.success("删除成功")
    deleteDialogVisible.value = false
    deleteIndex = -1
    saveToLocalStorage()
  }
}

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
      <el-form ref="formRef" :model="currentProduct" :rules="rules" label-width="80px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="currentProduct.name" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="currentProduct.price" :min="0" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="currentProduct.stock" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
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

    <!-- 删除确认弹窗（保持不变） -->
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
