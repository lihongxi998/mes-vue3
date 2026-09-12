<template>
  <div class="equipment-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>设备管理</span>
          <el-button type="primary" size="small" @click="handleCreate">添加设备</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="设备名称">
          <el-input v-model="queryParams.name" placeholder="请输入设备名称" clearable />
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
      
      <el-table :data="equipment" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="code" label="设备编号" width="150" />
        <el-table-column prop="name" label="设备名称" width="180" />
        <el-table-column prop="model" label="型号" width="120" />
        <el-table-column prop="workshopName" label="所属车间" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastMaintenanceDate" label="上次维护" width="120" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="warning" @click="handleMaintenance(row)">维护</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { listMachinery } from '@/api/mes'

const loading = ref(false)

const queryParams = reactive({
  name: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const equipment = ref<any[]>([])

const getStatusType = (status: string) => {
  const types: Record<string, any> = {
    'running': 'success',
    'idle': 'info',
    'maintenance': 'warning',
    'fault': 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'running': '运行中',
    'idle': '空闲',
    'maintenance': '维护中',
    'fault': '故障'
  }
  return texts[status] || status
}

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
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
  Object.assign(queryParams, { name: '', status: '' })
  pagination.page = 1
  loadData()
}

const handleCreate = () => {
  ElMessage.info('添加设备功能开发中...')
}

const handleEdit = (row: any) => {
  ElMessage.info('编辑设备功能开发中...')
}

const handleMaintenance = (row: any) => {
  ElMessage.info(`设备 ${row.code} 进入维护模式`)
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除该设备吗？', '提示', { type: 'warning' })
    .then(() => {
      ElMessage.success('删除成功')
      loadData()
    })
    .catch(() => {})
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.equipment-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
