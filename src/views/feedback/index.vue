<template>
  <div class="feedback-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>生产报工</span>
          <el-button type="primary" size="small" @click="handleCreate">新增报工</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="工单编号">
          <el-input v-model="queryParams.workorderNo" placeholder="请输入工单编号" clearable />
        </el-form-item>
        <el-form-item label="操作员">
          <el-input v-model="queryParams.operatorName" placeholder="请输入操作员" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="records" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="workorderNo" label="工单编号" width="180" />
        <el-table-column prop="operatorName" label="操作员" width="100" />
        <el-table-column prop="quantity" label="产量" width="100" />
        <el-table-column prop="qualifiedQty" label="合格数" width="100" />
        <el-table-column prop="unqualifiedQty" label="不合格数" width="100" />
        <el-table-column prop="feedbackTime" label="报工时间" width="150" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click="handleDetail(row)">详情</el-button>
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
    
    <el-dialog v-model="dialogVisible" title="新增报工" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="工单编号">
          <el-select v-model="form.workorderId" placeholder="请选择工单" style="width: 100%">
            <el-option label="MO-2024-001" :value="1" />
            <el-option label="MO-2024-002" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作员">
          <el-input v-model="form.operatorName" placeholder="请输入操作员" />
        </el-form-item>
        <el-form-item label="产量">
          <el-input-number v-model="form.quantity" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="合格数">
          <el-input-number v-model="form.qualifiedQty" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="不合格数">
          <el-input-number v-model="form.unqualifiedQty" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
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
import { listFeedback } from '@/api/mes'

const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)

const queryParams = reactive({
  workorderNo: '',
  operatorName: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const records = ref<any[]>([])

const form = reactive({
  id: null as number | null,
  workorderId: null as number | null,
  workorderNo: '',
  operatorId: null as number | null,
  operatorName: '',
  quantity: 0,
  qualifiedQty: 0,
  unqualifiedQty: 0,
  remark: ''
})

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    const res: any = await listFeedback(params)
    records.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error: any) {
    console.error('加载报工列表失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  Object.assign(queryParams, { workorderNo: '', operatorName: '' })
  pagination.page = 1
  loadData()
}

const handleCreate = () => {
  Object.assign(form, { id: null, workorderId: null, workorderNo: '', operatorId: null, operatorName: '', quantity: 0, qualifiedQty: 0, unqualifiedQty: 0, remark: '' })
  dialogVisible.value = true
}

const handleDetail = (row: any) => {
  ElMessage.info(`查看报工详情: ${row.workorderNo}`)
}

const handleSubmit = async () => {
  if (!form.workorderId || !form.operatorName) {
    ElMessage.warning('请填写完整信息')
    return
  }
  submitLoading.value = true
  try {
    ElMessage.success('报工成功')
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
.feedback-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
