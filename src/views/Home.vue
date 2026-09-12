<template>
  <div class="home">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>MES 生产管理系统 - 工作台</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-statistic title="今日订单" :value="268" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="生产进度" :value="85" suffix="%" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="合格率" :value="98.5" suffix="%" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="设备状态" :value="12" suffix="台运行" />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  padding: 20px;
}
.card-header {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}
</style>
