<template>
  <div class="material-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>物料管理</span>
          <el-button type="primary" size="small" @click="handleCreate">添加物料</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="物料编码">
          <el-input v-model="queryParams.code" placeholder="请输入物料编码" clearable />
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input v-model="queryParams.name" placeholder="请输入物料名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="materials" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="code" label="物料编码" width="150" />
        <el-table-column prop="name" label="物料名称" width="180" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="spec" label="规格型号" width="120" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { listMdItem, delMdItem } from '@/api/mes'

const loading = ref(false)

const queryParams = reactive({
  code: '',
  name: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const materials = ref<any[]>([])

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    const res: any = await listMdItem(params)
    materials.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error: any) {
    console.error('加载物料列表失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  Object.assign(queryParams, { code: '', name: '' })
  pagination.page = 1
  loadData()
}

const handleCreate = () => {
  ElMessage.info('添加物料功能开发中...')
}

const handleEdit = (row: any) => {
  ElMessage.info('编辑物料功能开发中...')
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该物料吗？', '提示', { type: 'warning' })
    await delMdItem(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.material-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
