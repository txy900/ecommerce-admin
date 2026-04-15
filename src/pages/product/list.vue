<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus"
import type { Product } from "@/pinia/stores/product"
import { ElMessage } from "element-plus"
import { computed, reactive, ref } from "vue"
import { useProductStore } from "@/pinia/stores/product"

const productStore = useProductStore()

// 搜索关键字
const searchKeyword = ref("")
// 当前页码
const currentPage = ref(1)
// 每页条数
const pageSize = ref(5)

// 过滤后的商品列表（根据搜索关键字）
const filteredProducts = computed(() => {
  if (!searchKeyword.value.trim()) {
    return productStore.products
  }
  return productStore.products.filter(p =>
    p.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 分页后的商品列表
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

// 搜索
function handleSearch() {
  currentPage.value = 1 // 重置到第一页
}

// 重置搜索
function resetSearch() {
  searchKeyword.value = ""
  currentPage.value = 1
}

// 每页条数变化
function handleSizeChange(val: number) {
  pageSize.value = val
  currentPage.value = 1
}

// 页码变化
function handleCurrentChange(val: number) {
  currentPage.value = val
}

// 以下是你原有的表单逻辑，保持不变
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

const deleteDialogVisible = ref(false)
let deleteId = -1

const rules: FormRules = {
  name: [{ required: true, message: "请输入商品名称" }],
  price: [{ required: true, message: "请输入价格" }],
  stock: [{ required: true, message: "请输入库存" }]
}

function addProduct() {
  dialogTitle.value = "新增商品"
  editId = -1
  Object.assign(currentProduct, { id: 0, name: "", price: 0, stock: 0, status: "上架" })
  dialogVisible.value = true
}

function editProduct(row: Product) {
  dialogTitle.value = "编辑商品"
  editId = row.id
  Object.assign(currentProduct, row)
  dialogVisible.value = true
}

async function saveProduct() {
  await formRef.value?.validate()
  if (editId === -1) {
    const { id, ...data } = currentProduct
    productStore.addProduct(data)
    ElMessage.success("新增成功")
  } else {
    productStore.updateProduct(editId, currentProduct)
    ElMessage.success("更新成功")
  }
  dialogVisible.value = false
  // 新增/编辑后重置搜索和页码（可选）
  resetSearch()
}

function deleteProduct(id: number) {
  deleteId = id
  deleteDialogVisible.value = true
}

function confirmDelete() {
  productStore.deleteProduct(deleteId)
  ElMessage.success("删除成功")
  deleteDialogVisible.value = false
  // 删除后重置搜索和页码（可选）
  if (filteredProducts.value.length === 1 && currentPage.value > 1) {
    currentPage.value--
  }
  resetSearch()
}
</script>

<template>
  <div>
    <h2>商品列表</h2>
    <!-- 搜索栏 -->
    <div style="margin-bottom: 20px; display: flex; gap: 10px;">
      <el-input
        v-model="searchKeyword"
        placeholder="请输入商品名称"
        clearable
        style="width: 200px"
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      />
      <el-button type="primary" @click="handleSearch">
        搜索
      </el-button>
      <el-button type="success" @click="resetSearch">
        重置
      </el-button>
      <el-button type="primary" @click="addProduct" style="margin-left: auto;">
        新增商品
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="paginatedProducts" border>
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
        <template #default="{ row }">
          <el-button size="small" @click="editProduct(row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="deleteProduct(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :total="filteredProducts.length"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑/新增弹窗（保持不变） -->
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

    <!-- 删除确认弹窗 -->
    <el-dialog v-model="deleteDialogVisible" title="确认删除" width="30%" center>
      <span>确定删除该商品吗？</span>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">
          取消
        </el-button>
        <el-button type="danger" @click="confirmDelete">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
