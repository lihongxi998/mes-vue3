<template>
  <div class="material-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>物料管理</span>
          <el-button type="primary" size="small" @click="handleCreate">添加物料</el-button>
        </div>
      </template>
      
      <!-- 筛选条件 -->
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="物料编码">
          <el-input v-model="queryParams.code" placeholder="请输入物料编码" clearable />
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input v-model="queryParams.name" placeholder="请输入物料名称" clearable />
        </el-form-item>
        <el-form-item label="物料分类">
          <el-select v-model="queryParams.category" placeholder="请选择" clearable style="width: 120px">
            <el-option label="原材料" value="raw" />
            <el-option label="辅料" value="auxiliary" />
            <el-option label="半成品" value="semi" />
            <el-option label="成品" value="finished" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 物料列表 -->
      <el-table :data="materials" style="width: 100%" stripe>
        <el-table-column prop="code" label="物料编码" width="150" />
        <el-table-column prop="name" label="物料名称" width="180" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">
            <el-tag>{{ getCategoryText(row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="规格型号" width="120" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="stock" label="当前库存" width="100" />
        <el-table-column prop="minStock" label="最低库存" width="100" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const queryParams = reactive({
  code: '',
  name: '',
  category: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const materials = ref([
  { id: 1, code: 'M-001', name: '钢材A3', category: 'raw', spec: 'Φ20mm', unit: 'kg', stock: 5000, minStock: 1000 },
  { id: 2, code: 'M-002', name: '铝合金板', category: 'raw', spec: '2mm', unit: '张', stock: 800, minStock: 200 },
  { id: 3, code: 'F-001', name: '成品A型零件', category: 'finished', spec: '标准型', unit: '件', stock: 150, minStock: 100 },
  { id: 4, code: 'A-001', name: '切削液', category: 'auxiliary', spec: '20L/桶', unit: '桶', stock: 25, minStock: 10 },
])

const loadData = () => {
  console.log('加载物料列表', queryParams)
}

const resetQuery = () => {
  queryParams.code = ''
  queryParams.name = ''
  queryParams.category = ''
  loadData()
}

const getCategoryText = (category: string) => {
  const texts: Record<string, string> = {
    'raw': '原材料',
    'auxiliary': '辅料',
    'semi': '半成品',
    'finished': '成品'
  }
  return texts[category] || category
}

const handleCreate = () => {
  ElMessage.info('添加物料功能开发中...')
}

const handleEdit = (row: any) => {
  ElMessage.info('编辑物料功能开发中...')
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除该物料吗？', '提示', { type: 'warning' })
    .then(() => {
      ElMessage.success('删除成功')
      loadData()
    })
    .catch(() => {})
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.material-page {
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
