<template>
  <div class="home-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="待处理订单" :value="stats.pendingOrders">
            <template #prefix>
              <el-icon color="#409eff"><Document /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="今日排程" :value="stats.todaySchedules" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="质检合格率">
            <template #suffix>%</template>
            <template #defaultValue>{{ stats.qualityRate.toFixed(2) }}</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="设备运行率">
            <template #suffix>%</template>
            <template #defaultValue>{{ stats.equipmentRate.toFixed(2) }}</template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>待办事项</span>
          </template>
          <el-empty v-if="!todosLoading && todoList.length === 0" description="暂无待办事项" />
          <el-empty v-else-if="todosLoading" description="加载中..." />
          <el-list v-else :data="todoList" style="max-height: 300px; overflow-y: auto">
            <el-list-item v-for="item in todoList" :key="item.id">
              <el-tag :type="item.type === 'urgent' ? 'danger' : 'warning'" size="small">{{ item.type === 'urgent' ? '紧急' : '普通' }}</el-tag>
              <span style="margin-left: 10px">{{ item.content }}</span>
            </el-list-item>
          </el-list>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最新公告</span>
          </template>
          <el-timeline>
            <el-timeline-item v-for="item in announcements" :key="item.id" :timestamp="item.date" placement="top">
              {{ item.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card style="margin-top: 20px">
      <template #header>
        <span>快捷操作</span>
      </template>
      <el-space wrap>
        <el-button type="primary" @click="$router.push('/production')">
          <el-icon><Document /></el-icon>
          新建订单
        </el-button>
        <el-button type="success" @click="$router.push('/scheduling')">
          <el-icon><Calendar /></el-icon>
          生产排程
        </el-button>
        <el-button type="warning" @click="$router.push('/quality')">
          <el-icon><Check /></el-icon>
          质量检验
        </el-button>
        <el-button type="info" @click="$router.push('/inventory')">
          <el-icon><Box /></el-icon>
          库存查询
        </el-button>
        <el-button @click="$router.push('/equipment')">
          <el-icon><Setting /></el-icon>
          设备管理
        </el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Document, Calendar, Check, Box, Setting } from '@element-plus/icons-vue'
import { listWorkorder, listQcPending, listMachinery } from '@/api/mes'

const stats = reactive({
  pendingOrders: 0,
  todaySchedules: 0,
  qualityRate: 98.5,
  equipmentRate: 95.2
})

const todosLoading = ref(false)
const todoList = ref<any[]>([])
const announcements = ref([
  { id: 1, date: '2024-09-12', content: '系统升级完成，新增设备管理模块' },
  { id: 2, date: '2024-09-10', content: '生产订单 MO-2024-005 已排程' },
  { id: 3, date: '2024-09-08', content: '质量管理模块上线' }
])

const loadStats = async () => {
  try {
    const [orderRes, qcRes, machineryRes] = await Promise.all([
      listWorkorder({ status: 'producing' }),
      listQcPending({}),
      listMachinery({ status: 'running' })
    ])
    
    stats.pendingOrders = orderRes?.total || 0
    stats.todaySchedules = orderRes?.list?.filter((o: any) => o.startDate === new Date().toISOString().split('T')[0]).length || 0
    stats.qualityRate = qcRes?.list ? (qcRes.list.filter((q: any) => q.status === 'pass').length / qcRes.list.length * 100) : 98.5
    stats.equipmentRate = machineryRes?.list ? (machineryRes.list.length / (machineryRes.total || 1) * 100) : 95.2
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

const loadTodos = async () => {
  todosLoading.value = true
  try {
    const res: any = await listWorkorder({ status: 'pending' })
    todoList.value = (res?.list || []).map((o: any) => ({
      id: o.id,
      type: 'urgent',
      content: `订单 ${o.no} 待排产`
    }))
  } catch (error) {
    console.error('加载待办事项失败:', error)
  } finally {
    todosLoading.value = false
  }
}

onMounted(() => {
  loadStats()
  loadTodos()
})
</script>

<style scoped>
.home-page { padding: 0; }
.stat-card { text-align: center; }
.stat-card :deep(.el-statistic__head) { font-size: 14px; color: #909399; }
.stat-card :deep(.el-statistic__content) { font-size: 28px; font-weight: bold; color: #303133; }
</style>
