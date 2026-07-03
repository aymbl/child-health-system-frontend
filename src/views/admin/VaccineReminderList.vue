<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">疫苗提醒总览</h2>
        <p class="page-subtitle">总览系统内疫苗申请、接种安排和提醒状态，用于后台查询、查看和全局协调。</p>
      </div>
    </div>

    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="儿童姓名">
          <el-input v-model="searchForm.childName" placeholder="请输入儿童姓名" clearable style="width: 180px" />
        </el-form-item>

        <el-form-item label="疫苗名称">
          <el-input v-model="searchForm.vaccineName" placeholder="请输入疫苗名称" clearable style="width: 180px" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="待确认" value="待确认" />
            <el-option label="已确认" value="已确认" />
            <el-option label="已拒绝" value="已拒绝" />
            <el-option label="已接种" value="已接种" />
            <el-option label="已过期" value="已过期" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-empty v-if="tableData.length === 0" description="暂无疫苗提醒记录" :image-size="90" />

      <el-table v-else :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="childName" label="儿童姓名" width="120" align="center" />
        <el-table-column prop="doctorName" label="负责医生" width="120" align="center">
          <template #default="{ row }">{{ row.doctorName || '未分配' }}</template>
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
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getVaccineReminderList } from '@/api/vaccineReminder'
import { formatDate } from '@/utils/format'

const searchForm = reactive({
  childName: '',
  vaccineName: '',
  status: ''
})

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
    const res = await getVaccineReminderList(searchForm)
    tableData.value = res.data || []
  } catch (error) {
    console.error('加载疫苗提醒列表失败：', error)
    ElMessage.error('加载疫苗提醒列表失败')
  }
}

const resetSearch = () => {
  searchForm.childName = ''
  searchForm.vaccineName = ''
  searchForm.status = ''
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.page-container { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.page-title { margin: 0; font-size: 22px; font-weight: bold; color: #303133; }
.page-subtitle { margin: 8px 0 0; font-size: 14px; color: #909399; }
.search-card { margin-bottom: 20px; }
</style>
