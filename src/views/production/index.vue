<template>
  <div class="production-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>生产订单管理</span>
          <el-button type="primary" size="small" @click="handleCreate">新建订单</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="订单号">
          <el-input v-model="queryParams.no" placeholder="请输入订单号" clearable />
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="queryParams.productName" placeholder="请输入产品名称" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="待排产" value="pending" />
            <el-option label="生产中" value="producing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已暂停" value="paused" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="orders" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="no" label="订单编号" width="180" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="completedQty" label="已完成" width="100" />
        <el-table-column prop="workshopName" label="车间" width="120" />
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="完成日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleDetail(row)">详情</el-button>
            <el-button v-if="row.status === 'producing'" size="small" type="success" @click="handleFinish(row)">完成</el-button>
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
        <el-form-item label="订单编号">
          <el-input v-model="form.no" placeholder="请输入订单编号" :disabled="!!form.id" />
        </el-form-item>
        <el-form-item label="产品">
          <el-select v-model="form.productId" placeholder="请选择产品" style="width: 100%">
            <el-option label="A型零件" :value="1" />
            <el-option label="B型组件" :value="2" />
            <el-option label="C型配件" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="form.quantity" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="车间">
          <el-select v-model="form.workshopId" placeholder="请选择车间" style="width: 100%">
            <el-option label="车间A" :value="1" />
            <el-option label="车间B" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="form.startDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="完成日期">
          <el-date-picker v-model="form.endDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="待排产" value="pending" />
            <el-option label="生产中" value="producing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已暂停" value="paused" />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { listWorkorder, addWorkorder, updateWorkorder, delWorkorder, dofinish } from '@/api/mes'

const loading = ref(false)
const submitLoading = ref(false)

const queryParams = reactive({
  no: '',
  productName: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const orders = ref<any[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('新建订单')
const form = reactive({
  id: null as number | null,
  no: '',
  productId: null as number | null,
  productName: '',
  quantity: 1,
  workshopId: null as number | null,
  workshopName: '',
  startDate: '',
  endDate: '',
  status: 'pending'
})

const getStatusType = (status: string) => {
  const types: Record<string, any> = {
    'pending': 'warning',
    'producing': 'primary',
    'completed': 'success',
    'paused': 'info'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    'pending': '待排产',
    'producing': '生产中',
    'completed': '已完成',
    'paused': '已暂停'
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
    orders.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error: any) {
    console.error('加载订单列表失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  Object.assign(queryParams, { no: '', productName: '', status: '' })
  pagination.page = 1
  loadData()
}

const handleCreate = () => {
  dialogTitle.value = '新建订单'
  Object.assign(form, { id: null, no: '', productId: null, productName: '', quantity: 1, workshopId: null, workshopName: '', startDate: '', endDate: '', status: 'pending' })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑订单'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDetail = (row: any) => {
  ElMessage.info(`查看订单详情: ${row.no}`)
}

const handleFinish = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要完成该订单吗？', '提示', { type: 'warning' })
    await dofinish(row.id)
    ElMessage.success('订单已完成')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

const handleSubmit = async () => {
  if (!form.no) {
    ElMessage.warning('请输入订单编号')
    return
  }
  submitLoading.value = true
  try {
    if (form.id) {
      await updateWorkorder(form)
      ElMessage.success('保存成功')
    } else {
      await addWorkorder(form)
      ElMessage.success('创建成功')
    }
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
.production-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
