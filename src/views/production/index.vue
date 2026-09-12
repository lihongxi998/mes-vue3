<template>
  <div class="production-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>生产订单管理</span>
          <el-button type="primary" size="small" @click="handleCreate">新建订单</el-button>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="订单号">
          <el-input v-model="queryParams.orderNo" placeholder="请输入订单号" clearable />
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
      
      <!-- 订单列表 -->
      <el-table :data="orders" style="width: 100%" stripe>
        <el-table-column prop="orderNo" label="订单编号" width="180" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="client" label="客户" width="120" />
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="完成日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleDetail(row)">详情</el-button>
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
        <el-form-item label="产品名称">
          <el-input v-model="form.productName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="form.quantity" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model="form.client" placeholder="请输入客户名称" />
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

const orders = ref([
  { id: 1, orderNo: 'MO-2024-001', productName: 'A型零件', quantity: 500, client: '客户A', startDate: '2024-09-15', endDate: '2024-09-20', status: 'producing' },
  { id: 2, orderNo: 'MO-2024-002', productName: 'B型组件', quantity: 200, client: '客户B', startDate: '2024-09-18', endDate: '2024-09-25', status: 'pending' },
  { id: 3, orderNo: 'MO-2024-003', productName: 'C型配件', quantity: 1000, client: '客户C', startDate: '2024-09-10', endDate: '2024-09-12', status: 'completed' },
])

const dialogVisible = ref(false)
const dialogTitle = ref('新建订单')
const form = reactive({
  id: null as number | null,
  orderNo: '',
  productName: '',
  quantity: 1,
  client: '',
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

const loadData = () => {
  console.log('加载订单列表', queryParams)
}

const resetQuery = () => {
  queryParams.orderNo = ''
  queryParams.status = ''
  loadData()
}

const handleCreate = () => {
  dialogTitle.value = '新建订单'
  Object.assign(form, { id: null, orderNo: '', productName: '', quantity: 1, client: '', startDate: '', endDate: '', status: 'pending' })
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '编辑订单'
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDetail = (row: any) => {
  ElMessage.info(`查看订单详情: ${row.orderNo}`)
}

const handleSubmit = () => {
  ElMessage.success(dialogTitle.value === '新建订单' ? '创建成功' : '保存成功')
  dialogVisible.value = false
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.production-page {
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
</style>
