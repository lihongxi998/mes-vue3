<template>
  <div class="home-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="待处理订单" :value="24">
            <template #prefix>
              <el-icon color="#409eff"><Document /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="今日排程" :value="18" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="质检合格率" :value="98.5">
            <template #suffix>%</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="设备运行率" :value="95.2">
            <template #suffix>%</template>
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
          <el-empty description="暂无待办事项" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最新公告</span>
          </template>
          <el-timeline>
            <el-timeline-item timestamp="2024-09-12" placement="top">
              系统升级完成，新增设备管理模块
            </el-timeline-item>
            <el-timeline-item timestamp="2024-09-10" placement="top">
              生产订单 MO-2024-005 已排程
            </el-timeline-item>
            <el-timeline-item timestamp="2024-09-08" placement="top">
              质量管理模块上线
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
import { Document, Calendar, Check, Box, Setting } from '@element-plus/icons-vue'
</script>

<style scoped>
.home-page {
  padding: 0;
}

.stat-card {
  text-align: center;
}

.stat-card :deep(.el-statistic__head) {
  font-size: 14px;
  color: #909399;
}

.stat-card :deep(.el-statistic__content) {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}
</style>
