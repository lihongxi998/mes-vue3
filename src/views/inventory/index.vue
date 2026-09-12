<template>
  <div class="inventory-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>库存管理</span>
          <el-button type="primary" size="small" @click="handleCreate">添加库存</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="物料编码">
          <el-input v-model="queryParams.matCode" placeholder="请输入物料编码" clearable />
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input v-model="queryParams.matName" placeholder="请输入物料名称" clearable />
        </el-form-item>
        <el-form-item label="仓库">
          <el-select v-model="queryParams.warehouseName" placeholder="请选择仓库" clearable>
            <el-option v-for="w in warehouses" :key="w.id" :label="w.name" :value="w.name" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="inventory" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="matCode" label="物料编码" width="150" />
        <el-table-column prop="matName" label="物料名称" width="180" />
        <el-table-column prop="spec" label="规格型号" width="120" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="warehouseName" label="仓库" width="120" />
        <el-table-column prop="locationCode" label="货位" width="100" />
        <el-table-column prop="quantity" label="库存数量" width="100">
          <template #default="{ row }">
            <span :class="{ 'low-stock': row.quantity < row.minQuantity }">{{ row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="minQuantity" label="最低库存" width="100" />
        <el-table-column prop="lastUpdate" label="最后更新" width="140" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleStockIn(row)">入库</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="loadData"
        @current-change="loadData"
        class="pagination"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { listStockInfo, listAllWarehouse } from '@/api/wms'

const loading = ref(false)
const warehouses = ref<any[]>([])

const queryParams = reactive({
  matCode: '',
  matName: '',
  warehouseName: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const inventory = ref<any[]>([])

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    const res: any = await listStockInfo(params)
    inventory.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error: any) {
    console.error('加载库存列表失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const loadWarehouses = async () => {
  try {
    const res: any = await listAllWarehouse()
    warehouses.value = res?.list || res || []
  } catch (e) {
    console.error('加载仓库列表失败:', e)
  }
}

const resetQuery = () => {
  Object.assign(queryParams, { matCode: '', matName: '', warehouseName: '' })
  pagination.page = 1
  loadData()
}

const handleCreate = () => {
  ElMessage.info('添加库存功能开发中...')
}

const handleEdit = (row: any) => {
  ElMessage.info('编辑库存功能开发中...')
}

const handleStockIn = (row: any) => {
  ElMessage.info(`物料 ${row.matCode} 入库功能开发中...`)
}

onMounted(() => {
  loadWarehouses()
  loadData()
})
</script>

<style scoped>
.inventory-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
.low-stock { color: #f56c6c; font-weight: bold; }
</style>
