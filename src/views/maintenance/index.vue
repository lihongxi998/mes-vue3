<template>
  <div class="maintenance-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>设备维护记录</span>
          <el-button type="primary" size="small" @click="handleCreate">新增维护记录</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="设备编号">
          <el-input v-model="queryParams.machineryCode" placeholder="请输入设备编号" clearable />
        </el-form-item>
        <el-form-item label="维护类型">
          <el-select v-model="queryParams.repairType" placeholder="请选择" clearable style="width: 120px">
            <el-option label="定期维护" value="regular" />
            <el-option label="故障维修" value="repair" />
            <el-option label="保养" value="maintenance" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="records" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="no" label="记录编号" width="150" />
        <el-table-column prop="machineryCode" label="设备编号" width="150" />
        <el-table-column prop="machineryName" label="设备名称" width="150" />
        <el-table-column prop="repairType" label="维护类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ getRepairTypeText(row.repairType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="faultDescription" label="故障描述" />
        <el-table-column prop="repairPerson" label="维护人员" width="100" />
        <el-table-column prop="repairTime" label="维护日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : 'warning'">
              {{ row.status === 'completed' ? '已完成' : '进行中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
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
import { ElMessage } from 'element-plus'
import { listRepair } from '@/api/mes'

const loading = ref(false)

const queryParams = reactive({
  machineryCode: '',
  repairType: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const records = ref<any[]>([])

const getRepairTypeText = (type: string) => {
  const texts: Record<string, string> = {
    'regular': '定期维护',
    'repair': '故障维修',
    'maintenance': '保养'
  }
  return texts[type] || type
}

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    const res: any = await listRepair(params)
    records.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error: any) {
    console.error('加载维护记录失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  Object.assign(queryParams, { machineryCode: '', repairType: '' })
  pagination.page = 1
  loadData()
}

const handleCreate = () => {
  ElMessage.info('新增维护记录功能开发中...')
}

const handleView = (row: any) => {
  ElMessage.info(`查看维护详情: ${row.no}`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.maintenance-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
