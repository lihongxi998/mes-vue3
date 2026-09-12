<template>
  <div class="quality-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="今日质检" :value="stats.todayInspection" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="合格数" :value="stats.passCount" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <el-statistic title="不合格数" :value="stats.failCount" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
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
          <span>质量检验记录</span>
          <el-button type="primary" size="small" @click="handleCreate">新增检验</el-button>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="批次号">
          <el-input v-model="queryParams.batchNo" placeholder="请输入批次号" clearable />
        </el-form-item>
        <el-form-item label="检验结果">
          <el-select v-model="queryParams.result" placeholder="请选择" clearable style="width: 120px">
            <el-option label="合格" value="pass" />
            <el-option label="不合格" value="fail" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 检验列表 -->
      <el-table :data="records" style="width: 100%" stripe>
        <el-table-column prop="recordNo" label="检验编号" width="150" />
        <el-table-column prop="batchNo" label="批次号" width="150" />
        <el-table-column prop="product" label="产品" />
        <el-table-column prop="quantity" label="检验数量" width="100" />
        <el-table-column prop="passQty" label="合格数" width="100" />
        <el-table-column prop="failQty" label="不合格数" width="100" />
        <el-table-column prop="result" label="结果" width="100">
          <template #default="{ row }">
            <el-tag :type="row.result === 'pass' ? 'success' : 'danger'">
              {{ row.result === 'pass' ? '合格' : '不合格' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="inspector" label="检验员" width="100" />
        <el-table-column prop="inspectionDate" label="检验日期" width="120" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click="handleDetail(row)">详情</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const stats = reactive({
  todayInspection: 45,
  passCount: 42,
  failCount: 3,
  get passRate() {
    return this.todayInspection > 0 ? (this.passCount / this.todayInspection) * 100 : 0
  }
})

const queryParams = reactive({
  batchNo: '',
  result: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const records = ref([
  { id: 1, recordNo: 'QC-2024-001', batchNo: 'B-2024-001', product: 'A型零件', quantity: 100, passQty: 98, failQty: 2, result: 'pass', inspector: '张工', inspectionDate: '2024-09-12' },
  { id: 2, recordNo: 'QC-2024-002', batchNo: 'B-2024-002', product: 'B型组件', quantity: 50, passQty: 48, failQty: 2, result: 'pass', inspector: '李工', inspectionDate: '2024-09-12' },
  { id: 3, recordNo: 'QC-2024-003', batchNo: 'B-2024-003', product: 'C型配件', quantity: 200, passQty: 195, failQty: 5, result: 'fail', inspector: '王工', inspectionDate: '2024-09-11' },
])

const loadData = () => {
  console.log('加载检验记录', queryParams)
}

const resetQuery = () => {
  queryParams.batchNo = ''
  queryParams.result = ''
  loadData()
}

const handleCreate = () => {
  ElMessage.info('新增检验功能开发中...')
}

const handleDetail = (row: any) => {
  ElMessage.info(`查看检验详情: ${row.recordNo}`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.quality-page {
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
