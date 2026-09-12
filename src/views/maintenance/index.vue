<template>
  <div class="maintenance-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>设备维护记录</span>
          <el-button type="primary" size="small" @click="handleCreate">新增维护记录</el-button>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="设备编号">
          <el-input v-model="queryParams.equipmentCode" placeholder="请输入设备编号" clearable />
        </el-form-item>
        <el-form-item label="维护类型">
          <el-select v-model="queryParams.type" placeholder="请选择" clearable style="width: 120px">
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
      
      <!-- 维护记录列表 -->
      <el-table :data="records" style="width: 100%" stripe>
        <el-table-column prop="recordNo" label="记录编号" width="150" />
        <el-table-column prop="equipmentCode" label="设备编号" width="150" />
        <el-table-column prop="equipmentName" label="设备名称" width="150" />
        <el-table-column prop="type" label="维护类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ getTypeText(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="维护内容" />
        <el-table-column prop="maintainer" label="维护人员" width="100" />
        <el-table-column prop="date" label="维护日期" width="120" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const queryParams = reactive({
  equipmentCode: '',
  type: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const records = ref([
  { id: 1, recordNo: 'MT-2024-001', equipmentCode: 'CNC-001', equipmentName: '数控加工中心', type: 'regular', content: '更换润滑油，检查刀具磨损', maintainer: '维修工A', date: '2024-09-10' },
  { id: 2, recordNo: 'MT-2024-002', equipmentCode: 'CNC-002', equipmentName: '数控车床', type: 'repair', content: '主轴轴承更换', maintainer: '维修工B', date: '2024-09-08' },
  { id: 3, recordNo: 'MT-2024-003', equipmentCode: 'LATH-001', equipmentName: '普通车床', type: 'maintenance', content: '日常保养，清洁设备', maintainer: '维修工A', date: '2024-09-05' },
])

const loadData = () => {
  console.log('加载维护记录', queryParams)
}

const resetQuery = () => {
  queryParams.equipmentCode = ''
  queryParams.type = ''
  loadData()
}

const getTypeText = (type: string) => {
  const texts: Record<string, string> = {
    'regular': '定期维护',
    'repair': '故障维修',
    'maintenance': '保养'
  }
  return texts[type] || type
}

const handleCreate = () => {
  ElMessage.info('新增维护记录功能开发中...')
}

const handleView = (row: any) => {
  ElMessage.info(`查看维护详情: ${row.recordNo}`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.maintenance-page {
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
