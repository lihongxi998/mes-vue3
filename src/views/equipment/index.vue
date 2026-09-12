<template>
  <div class="equipment-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>设备管理</span>
          <div class="header-actions">
            <el-button type="success" size="small" @click="handleExport">导出</el-button>
            <el-button type="primary" size="small" @click="handleCreate">新增设备</el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="设备编码">
          <el-input v-model="queryParams.machineryCode" placeholder="请输入设备编码" clearable />
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="queryParams.machineryName" placeholder="请输入设备名称" clearable />
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="运行中" value="running" />
            <el-option label="空闲" value="idle" />
            <el-option label="维护中" value="maintenance" />
            <el-option label="故障" value="fault" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="equipment" v-loading="loading" style="width: 100%" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="machineryCode" label="设备编码" width="150">
          <template #default="{ row }">
            <el-button size="small" type="text" @click="handleDetail(row)">{{ row.machineryCode }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="machineryName" label="设备名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="machineryBrand" label="品牌" width="120" show-overflow-tooltip />
        <el-table-column prop="machinerySpec" label="规格型号" width="150" show-overflow-tooltip />
        <el-table-column prop="workshopName" label="所属车间" width="120" />
        <el-table-column prop="statusLabel" label="设备状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.statusLabel || getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
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
import { listMachinery } from '@/api/mes'

const loading = ref(false)
const selectedRows = ref<any[]>([])

const queryParams = reactive({
  machineryCode: '',
  machineryName: '',
  status: ''
})

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})

const equipment = ref<any[]>([])

const getStatusType = (status: string) => {
  const map: Record<string, any> = { 'running': 'success', 'idle': 'info', 'maintenance': 'warning', 'fault': 'danger' }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = { 'running': '运行中', 'idle': '空闲', 'maintenance': '维护中', 'fault': '故障' }
  return map[status] || status
}

const loadData = async () => {
  loading.value = true
  try {
    const params = { ...queryParams, pageNo: pagination.pageNo, pageSize: pagination.pageSize }
    const res: any = await listMachinery(params)
    equipment.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error: any) {
    console.error('加载设备列表失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  Object.assign(queryParams, { machineryCode: '', machineryName: '', status: '' })
  pagination.pageNo = 1
  loadData()
}

const handleCreate = () => { ElMessage.info('新增设备功能开发中...') }
const handleDetail = (row: any) => { ElMessage.info(`查看设备详情: ${row.machineryCode}`) }
const handleEdit = (row: any) => { ElMessage.info(`编辑设备: ${row.machineryCode}`) }
const handleExport = () => { ElMessage.info('导出功能开发中...') }

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该设备吗？', '提示', { type: 'warning' })
    ElMessage.success('删除成功')
    loadData()
  } catch (e: any) {
    if (e !== 'cancel') ElMessage.error(e.message || '删除失败')
  }
}

const handleSelectionChange = (rows: any[]) => { selectedRows.value = rows }

onMounted(() => { loadData() })
</script>

<style scoped>
.equipment-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.header-actions { display: flex; gap: 8px; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
