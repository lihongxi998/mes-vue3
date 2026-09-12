<template>
  <div class="scheduling-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>生产排程</span>
          <el-button type="primary" size="small" @click="handleCreate">新建排程</el-button>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="订单号">
          <el-input v-model="queryParams.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="排程状态">
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
      
      <!-- 排程列表 -->
      <el-table :data="schedules" style="width: 100%" stripe>
        <el-table-column prop="scheduleNo" label="排程编号" width="150" />
        <el-table-column prop="orderNo" label="订单编号" width="150" />
        <el-table-column prop="product" label="产品名称" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="machine" label="生产设备" width="120" />
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
    
    <!-- 新建/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="订单编号">
          <el-input v-model="form.orderNo" placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item label="产品">
          <el-input v-model="form.product" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="form.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="生产设备">
          <el-select v-model="form.machine" placeholder="请选择设备" style="width: 100%">
            <el-option label="CNC-001" value="CNC-001" />
            <el-option label="CNC-002" value="CNC-002" />
            <el-option label="LATH-001" value="LATH-001" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="form.startDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="form.endDate" type="date" placeholder="选择日期" style="width: 100%" />
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
import { ElMessage } from 'element-plus'

const queryParams = reactive({
  orderNo: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const schedules = ref([
  { id: 1, scheduleNo: 'SCH-2024-001', orderNo: 'MO-2024-001', product: 'A型零件', quantity: 500, machine: 'CNC-001', startDate: '2024-09-15', endDate: '2024-09-18', status: 'scheduled' },
  { id: 2, scheduleNo: 'SCH-2024-002', orderNo: 'MO-2024-002', product: 'B型组件', quantity: 200, machine: 'CNC-002', startDate: '2024-09-16', endDate: '2024-09-20', status: 'pending' },
  { id: 3, scheduleNo: 'SCH-2024-003', orderNo: 'MO-2024-003', product: 'C型配件', quantity: 1000, machine: 'LATH-001', startDate: '2024-09-17', endDate: '2024-09-19', status: 'scheduling' },
])

const dialogVisible = ref(false)
const dialogTitle = ref('新建排程')
const form = reactive({
  id: null as number | null,
  orderNo: '',
  product: '',
  quantity: 1,
  machine: '',
  startDate: '',
  endDate: ''
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

const loadData = () => {
  console.log('加载排程列表', queryParams)
}

const resetQuery = () => {
  queryParams.orderNo = ''
  queryParams.status = ''
  loadData()
}

const handleCreate = () => {
  dialogTitle.value = '新建排程'
  Object.assign(form, { id: null, orderNo: '', product: '', quantity: 1, machine: '', startDate: '', endDate: '' })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑排程'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleExecute = (row: any) => {
  ElMessage.success(`排程 ${row.scheduleNo} 已开始执行`)
}

const handleSubmit = () => {
  ElMessage.success(dialogTitle.value === '新建排程' ? '创建成功' : '保存成功')
  dialogVisible.value = false
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.scheduling-page {
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
