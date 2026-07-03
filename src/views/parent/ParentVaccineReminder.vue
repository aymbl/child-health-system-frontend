<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">疫苗提醒查看</h2>
        <p class="page-subtitle">查看孩子的疫苗申请进度、接种安排和系统提醒状态。</p>
      </div>
      <div class="header-actions">
        <el-button @click="handleRefreshStatus">刷新提醒状态</el-button>
        <el-button type="primary" @click="router.push('/parent/vaccine-apply')">发起疫苗申请</el-button>
      </div>
    </div>

    <el-alert
      class="tip-alert"
      title="刷新提醒状态只会重新计算已确认且超过计划日期的提醒，不代表人工发起新的提醒。"
      type="info"
      show-icon
      :closable="false"
    />

    <el-card shadow="never">
      <el-empty v-if="tableData.length === 0" description="暂无疫苗提醒" :image-size="90" />

      <el-table v-else :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="childName" label="儿童姓名" width="120" align="center" />
        <el-table-column prop="doctorName" label="负责医生" width="120" align="center">
          <template #default="{ row }">{{ row.doctorName || '待分配' }}</template>
        </el-table-column>
        <el-table-column prop="vaccineName" label="疫苗名称" min-width="160" align="center" />
        <el-table-column label="计划接种日期" width="130" align="center">
          <template #default="{ row }">{{ formatDate(row.scheduledDate) }}</template>
        </el-table-column>
        <el-table-column label="提醒日期" width="130" align="center">
          <template #default="{ row }">{{ formatDate(row.reminderDate) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ row.status || '未设置' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="实际接种日期" width="130" align="center">
          <template #default="{ row }">{{ formatDate(row.vaccinatedDate) }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getVaccineRemindersByParentId, refreshExpiredVaccineReminders } from '@/api/vaccineReminder'
import { formatDate } from '@/utils/format'

const router = useRouter()
const tableData = ref([])

const statusType = status => {
  if (status === '待确认') return 'warning'
  if (status === '已确认') return 'primary'
  if (status === '已拒绝') return 'danger'
  if (status === '已接种') return 'success'
  if (status === '已过期') return 'danger'
  return 'info'
}

const loadData = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const res = await getVaccineRemindersByParentId(userInfo.id)
    tableData.value = res.data || []
  } catch (error) {
    console.error('加载疫苗提醒失败：', error)
    ElMessage.error('加载疫苗提醒失败')
  }
}

const handleRefreshStatus = async () => {
  try {
    await refreshExpiredVaccineReminders()
    ElMessage.success('提醒状态已刷新')
    loadData()
  } catch (error) {
    console.error('刷新提醒状态失败：', error)
    ElMessage.error('刷新提醒状态失败')
  }
}

onMounted(loadData)
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.page-title { margin-bottom: 0; font-size: 22px; font-weight: bold; color: #303133; }
.page-subtitle { margin: 8px 0 0 0; font-size: 14px; color: #909399; }
.header-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
.tip-alert { margin-bottom: 16px; }
</style>
