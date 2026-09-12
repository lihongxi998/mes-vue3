<template>
  <div class="production-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>生产订单管理</span>
          <el-button type="primary" size="small" @click="handleCreate">新建订单</el-button>
        </div>
      </template>
      <el-table :data="orders" style="width: 100%">
        <el-table-column prop="id" label="订单号" width="180" />
        <el-table-column prop="product" label="产品" />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default>
            <el-button size="small" type="primary">编辑</el-button>
            <el-button size="small" type="success">完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const orders = ref([
  { id: 'MO-2024-001', product: '产品A', quantity: 1000, status: '生产中', progress: 65 },
  { id: 'MO-2024-002', product: '产品B', quantity: 500, status: '待排产', progress: 0 },
  { id: 'MO-2024-003', product: '产品C', quantity: 800, status: '已完成', progress: 100 },
])

const getStatusType = (status: string) => {
  const types: Record<string, any> = {
    '生产中': 'primary',
    '待排产': 'warning',
    '已完成': 'success',
    '暂停': 'danger'
  }
  return types[status] || 'info'
}

const handleCreate = () => {
  ElMessage.info('新建生产订单功能开发中...')
}
</script>

<style scoped>
.production-page {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
</style>
