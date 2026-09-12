<template>
  <div class="inventory-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>物料库存管理</span>
          <el-button type="primary" size="small" @click="handleCreate">添加物料</el-button>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="物料编码">
          <el-input v-model="queryParams.code" placeholder="请输入物料编码" clearable />
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input v-model="queryParams.name" placeholder="请输入物料名称" clearable />
        </el-form-item>
        <el-form-item label="仓库">
          <el-select v-model="queryParams.warehouse" placeholder="请选择" clearable style="width: 120px">
            <el-option label="原料仓" value="raw" />
            <el-option label="成品仓" value="finished" />
            <el-option label="半成品仓" value="semi" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 库存列表 -->
      <el-table :data="inventory" style="width: 100%" stripe>
        <el-table-column prop="code" label="物料编码" width="150" />
        <el-table-column prop="name" label="物料名称" width="180" />
        <el-table-column prop="spec" label="规格型号" width="120" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="warehouse" label="仓库" width="100">
          <template #default="{ row }">
            <el-tag>{{ getWarehouseText(row.warehouse) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="库存数量" width="100">
          <template #default="{ row }">
            <span :class="{ 'low-stock': row.quantity < row.minQuantity }">{{ row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="minQuantity" label="最低库存" width="100" />
        <el-table-column prop="lastUpdate" label="最后更新" width="120" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleStockIn(row)">入库</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
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

const queryParams = reactive({
  code: '',
  name: '',
  warehouse: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const inventory = ref([
  { id: 1, code: 'M-001', name: '钢材A3', spec: 'Φ20mm', unit: 'kg', warehouse: 'raw', quantity: 5000, minQuantity: 1000, lastUpdate: '2024-09-12' },
  { id: 2, code: 'M-002', name: '铝合金板', spec: '2mm', unit: '张', warehouse: 'raw', quantity: 800, minQuantity: 200, lastUpdate: '2024-09-11' },
  { id: 3, code: 'P-001', name: '成品A型零件', spec: '标准型', unit: '件', warehouse: 'finished', quantity: 150, minQuantity: 100, lastUpdate: '2024-09-12' },
  { id: 4, code: 'P-002', name: '成品B型组件', spec: '大型', unit: '套', warehouse: 'finished', quantity: 45, minQuantity: 50, lastUpdate: '2024-09-10' },
])

const loadData = () => {
  console.log('加载库存列表', queryParams)
}

const resetQuery = () => {
  queryParams.code = ''
  queryParams.name = ''
  queryParams.warehouse = ''
  loadData()
}

const getWarehouseText = (warehouse: string) => {
  const texts: Record<string, string> = {
    'raw': '原料仓',
    'finished': '成品仓',
    'semi': '半成品仓'
  }
  return texts[warehouse] || warehouse
}

const handleCreate = () => {
  ElMessage.info('添加物料功能开发中...')
}

const handleEdit = (row: any) => {
  ElMessage.info('编辑物料功能开发中...')
}

const handleStockIn = (row: any) => {
  ElMessage.info(`物料 ${row.code} 入库功能开发中...`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.inventory-page {
  padding: 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
.filter-form {
  margin-bottom: 20px;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.low-stock {
  color: #f56c6c;
  font-weight: bold;
}
</style>
