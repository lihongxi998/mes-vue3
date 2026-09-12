<template>
  <div class="equipment-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>设备管理</span>
          <el-button type="primary" size="small" @click="handleCreate">添加设备</el-button>
        </div>
      </template>
      
      <!-- 筛选条件 -->
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
      
      <!-- 设备列表 -->
      <el-table :data="equipment" style="width: 100%" stripe>
        <el-table-column prop="code" label="设备编号" width="150" />
        <el-table-column prop="name" label="设备名称" width="180" />
        <el-table-column prop="model" label="型号" width="120" />
        <el-table-column prop="location" label="位置" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastMaintenance" label="上次维护" width="120" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="warning" @click="handleMaintenance(row)">维护</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
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
    
    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="设备编号">
          <el-input v-model="form.code" placeholder="请输入设备编号" />
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="form.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="form.model" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="位置">
          <el-input v-model="form.location" placeholder="请输入位置" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="运行中" value="running" />
            <el-option label="空闲" value="idle" />
            <el-option label="维护中" value="maintenance" />
            <el-option label="故障" value="fault" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const queryParams = reactive({
  name: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const equipment = ref([
  { id: 1, code: 'CNC-001', name: '数控加工中心', model: 'VMC-850', location: '车间A-01', status: 'running', lastMaintenance: '2024-09-01' },
  { id: 2, code: 'CNC-002', name: '数控车床', model: 'CK-6140', location: '车间A-02', status: 'idle', lastMaintenance: '2024-08-28' },
  { id: 3, code: 'LATH-001', name: '普通车床', model: 'CA6140', location: '车间B-01', status: 'maintenance', lastMaintenance: '2024-09-10' },
  { id: 4, code: 'MILL-001', name: '铣床', model: 'X62W', location: '车间B-02', status: 'fault', lastMaintenance: '2024-09-05' },
])

const dialogVisible = ref(false)
const dialogTitle = ref('添加设备')
const form = reactive({
  id: null as number | null,
  code: '',
  name: '',
  model: '',
  location: '',
  status: 'idle'
})

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

const loadData = () => {
  console.log('加载设备列表', queryParams)
}

const resetQuery = () => {
  queryParams.name = ''
  queryParams.status = ''
  loadData()
}

const handleCreate = () => {
  dialogTitle.value = '添加设备'
  Object.assign(form, { id: null, code: '', name: '', model: '', location: '', status: 'idle' })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑设备'
  Object.assign(form, row)
  dialogVisible.value = true
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

const handleSubmit = () => {
  ElMessage.success(dialogTitle.value === '添加设备' ? '添加成功' : '保存成功')
  dialogVisible.value = false
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.equipment-page {
  padding: 20px;
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
</style>
