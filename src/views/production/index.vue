<template>
  <div class="workorder-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>工单管理</span>
          <div class="header-actions">
            <el-button type="success" size="small" @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="工单编码">
          <el-input v-model="queryParams.workorderCode" placeholder="请输入工单编码" clearable />
        </el-form-item>
        <el-form-item label="工单名称">
          <el-input v-model="queryParams.workorderName" placeholder="请输入工单名称" clearable />
        </el-form-item>
        <el-form-item label="产品编号">
          <el-input v-model="queryParams.productCode" placeholder="请输入产品编号" clearable />
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="queryParams.productName" placeholder="请输入产品名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="workorders" v-loading="loading" style="width: 100%" stripe row-key="id" default-expand-all>
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="workorderCode" label="工单编码" width="180">
          <template #default="{ row }">
            <el-button size="small" type="text" @click="handleDetail(row)">{{ row.workorderCode }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="workorderName" label="工单名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="productCode" label="产品编号" width="130" />
        <el-table-column prop="productName" label="产品名称" width="150" />
        <el-table-column prop="clientName" label="客户名称" width="150" />
        <el-table-column prop="quantity" label="计划数量" width="100" align="center" />
        <el-table-column prop="quantityProduced" label="已完成数量" width="120" align="center" />
        <el-table-column label="进度" width="180" align="center">
          <template #default="{ row }">
            <el-progress :percentage="row.quantity > 0 ? Math.min(100, Math.round(row.quantityProduced / row.quantity * 100)) : 0" :stroke-width="14" :text-inside="true" />
          </template>
        </el-table-column>
        <el-table-column prop="statusLabel" label="工单状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.statusLabel || getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="计划开始" width="120" align="center" />
        <el-table-column prop="endDate" label="计划完成" width="120" align="center" />
        <el-table-column prop="workshopName" label="所属车间" width="120" align="center" />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleFinish(row)" v-if="row.status !== 'completed'">完成</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.pageNo"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { listWorkorder, dofinish } from '@/api/mes'

const loading = ref(false)

const queryParams = reactive({
  workorderCode: '',
  workorderName: '',
  productCode: '',
  productName: ''
})

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})

const workorders = ref<any[]>([])

const getStatusType = (status: string) => {
  const map: Record<string, any> = { 'pending': 'info', 'producing': 'warning', 'completed': 'success' }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = { 'pending': '待排产', 'producing': '生产中', 'completed': '已完成' }
  return map[status] || status
}

const loadData = async () => {
  loading.value = true
  try {
    const params = { ...queryParams, pageNo: pagination.pageNo, pageSize: pagination.pageSize }
    const res: any = await listWorkorder(params)
    workorders.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error: any) {
    console.error('加载工单列表失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  Object.assign(queryParams, { workorderCode: '', workorderName: '', productCode: '', productName: '' })
  pagination.pageNo = 1
  loadData()
}

const handleDetail = (row: any) => {
  ElMessage.info(`查看工单详情: ${row.workorderCode}`)
}

const handleFinish = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要完成该工单吗？', '提示', { type: 'warning' })
    await dofinish(row.id)
    ElMessage.success('工单已完成')
    loadData()
  } catch (e: any) {
    if (e !== 'cancel') ElMessage.error(e.message || '操作失败')
  }
}

const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

onMounted(() => { loadData() })
</script>

<style scoped>
.workorder-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.header-actions { display: flex; gap: 8px; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
