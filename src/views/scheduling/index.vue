<template>
  <div class="scheduling-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>生产排程</span>
          <el-button type="primary" size="small" @click="handleCreate">新建排程</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="排程编号">
          <el-input v-model="queryParams.no" placeholder="请输入排程编号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="待排产" value="pending" />
            <el-option label="排产中" value="scheduling" />
            <el-option label="已排产" value="scheduled" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="schedules" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="no" label="排程编号" width="150" />
        <el-table-column prop="workorderNo" label="工单编号" width="150" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="machineryName" label="生产设备" width="120" />
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleExecute(row)">执行</el-button>
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
    
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="工单编号">
          <el-select v-model="form.workorderId" placeholder="请选择工单" style="width: 100%">
            <el-option label="MO-2024-001" :value="1" />
            <el-option label="MO-2024-002" :value="2" />
            <el-option label="MO-2024-003" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="生产设备">
          <el-select v-model="form.machineryId" placeholder="请选择设备" style="width: 100%">
            <el-option label="CNC-001" :value="1" />
            <el-option label="CNC-002" :value="2" />
            <el-option label="LATH-001" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="form.startDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="form.endDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="待排产" value="pending" />
            <el-option label="排产中" value="scheduling" />
            <el-option label="已排产" value="scheduled" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { listWorkorder } from '@/api/mes'

const loading = ref(false)
const submitLoading = ref(false)

const queryParams = reactive({
  no: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const schedules = ref<any[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('新建排程')
const form = reactive({
  id: null as number | null,
  no: '',
  workorderId: null as number | null,
  workorderNo: '',
  machineryId: null as number | null,
  machineryName: '',
  startDate: '',
  endDate: '',
  status: 'pending'
})

const getStatusType = (status: string) => {
  const types: Record<string, any> = {
    'pending': 'warning',
    'scheduling': 'info',
    'scheduled': 'primary',
    'completed': 'success'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'pending': '待排产',
    'scheduling': '排产中',
    'scheduled': '已排产',
    'completed': '已完成'
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
    const res: any = await listWorkorder(params)
    schedules.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error: any) {
    console.error('加载排程列表失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  Object.assign(queryParams, { no: '', status: '' })
  pagination.page = 1
  loadData()
}

const handleCreate = () => {
  dialogTitle.value = '新建排程'
  Object.assign(form, { id: null, no: '', workorderId: null, workorderNo: '', machineryId: null, machineryName: '', startDate: '', endDate: '', status: 'pending' })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑排程'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleExecute = (row: any) => {
  ElMessage.success(`排程 ${row.no} 已开始执行`)
}

const handleSubmit = async () => {
  submitLoading.value = true
  try {
    ElMessage.success(dialogTitle.value === '新建排程' ? '创建成功' : '保存成功')
    dialogVisible.value = false
    loadData()
  } catch (error: any) {
    ElMessage.error(error.message || '操作失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.scheduling-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
