<template>
  <div class="quality-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="今日待检" :value="stats.pendingCount" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="合格数" :value="stats.passCount" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="不合格数" :value="stats.failCount" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="合格率">
            <template #suffix>%</template>
            <template #defaultValue>{{ stats.passRate.toFixed(2) }}</template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span>质检待检列表</span>
          <el-button type="primary" size="small" @click="handleCreate">新增检验</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="批次号">
          <el-input v-model="queryParams.no" placeholder="请输入批次号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="records" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="no" label="检验编号" width="150" />
        <el-table-column prop="workorderNo" label="工单编号" width="150" />
        <el-table-column prop="productName" label="产品" />
        <el-table-column prop="quantity" label="检验数量" width="100" />
        <el-table-column prop="inspectType" label="检验类型" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : 'success'">
              {{ row.status === 'pending' ? '待检验' : '已检验' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click="handleInspect(row)">检验</el-button>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { listQcPending } from '@/api/mes'

const loading = ref(false)

const stats = reactive({
  pendingCount: 12,
  passCount: 42,
  failCount: 3,
  get passRate() {
    const total = this.passCount + this.failCount
    return total > 0 ? (this.passCount / total) * 100 : 0
  }
})

const queryParams = reactive({
  no: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const records = ref<any[]>([])

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    const res: any = await listQcPending(params)
    records.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error: any) {
    console.error('加载质检列表失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  queryParams.no = ''
  pagination.page = 1
  loadData()
}

const handleCreate = () => {
  ElMessage.info('新增检验功能开发中...')
}

const handleInspect = (row: any) => {
  ElMessage.info(`检验编号: ${row.no}`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.quality-page { padding: 0; }
.stat-card { text-align: center; }
.stat-card :deep(.el-statistic__head) { font-size: 14px; color: #909399; }
.stat-card :deep(.el-statistic__content) { font-size: 28px; font-weight: bold; color: #303133; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
