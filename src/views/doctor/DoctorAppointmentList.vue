<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">体检预约处理</h2>
        <p class="page-subtitle">处理分配给我的体检预约申请，确认后可在体检记录中录入本次体检结果。</p>
      </div>
    </div>

    <el-card shadow="hover" class="table-card">
      <template #header>
        <div class="card-header">
          <span>待处理体检预约</span>
          <el-tag type="primary" effect="light">共 {{ tableData.length }} 条</el-tag>
        </div>
      </template>

      <el-empty v-if="!loading && tableData.length === 0" description="暂无我负责的体检预约" :image-size="90" />

      <el-table v-else v-loading="loading" :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="childName" label="儿童姓名" min-width="120" align="center" />
        <el-table-column prop="parentName" label="家长姓名" min-width="120" align="center" />
        <el-table-column prop="appointmentTime" label="体检预约时间" min-width="180" align="center" />
        <el-table-column label="当前状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">{{ row.status || '未知' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip />
        <el-table-column label="处理动作" width="240" align="center" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === '待确认'">
              <el-button type="primary" link @click="handleDoctorAction(row, 'confirm')">确认体检预约</el-button>
              <el-button type="danger" link @click="handleDoctorAction(row, 'reject')">拒绝体检预约</el-button>
            </template>
            <el-button v-else-if="canComplete(row.status)" type="success" link @click="handleDoctorAction(row, 'complete')">
              完成体检
            </el-button>
            <span v-else class="no-action">无需处理</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  doctorCompleteAppointment,
  doctorConfirmAppointment,
  doctorRejectAppointment,
  getMyDoctorAppointments
} from '@/api/appointment'
import { formatDateTime } from '@/utils/format'

const loading = ref(false)
const tableData = ref([])

const canComplete = status => status === '已确认' || status === '待就诊'

const getStatusTagType = (status) => {
  if (status === '待确认') return 'warning'
  if (status === '已确认' || status === '待就诊') return 'primary'
  if (status === '已拒绝') return 'danger'
  if (status === '已完成') return 'success'
  if (status === '已取消') return 'info'
  return 'info'
}

const loadAppointmentList = async () => {
  loading.value = true
  try {
    const res = await getMyDoctorAppointments()
    const list = res.data || []
    tableData.value = list.map((item) => ({
      id: item.id,
      childName: item.childName || '',
      parentName: item.parentName || '',
      appointmentTime: formatDateTime(item.appointmentTime || item.appointment_time || ''),
      status: item.status || '',
      remark: item.remark || ''
    }))
  } catch (error) {
    console.error('加载医生体检预约列表失败：', error)
    ElMessage.error('加载体检预约列表失败')
  } finally {
    loading.value = false
  }
}

const actionConfig = {
  confirm: {
    message: '确认接受这条体检预约申请吗？',
    success: '体检预约已确认，请在体检记录中录入本次体检结果',
    request: doctorConfirmAppointment
  },
  reject: {
    message: '确认拒绝这条体检预约申请吗？',
    success: '体检预约已拒绝',
    request: doctorRejectAppointment
  },
  complete: {
    message: '确认将该体检预约标记为已完成吗？',
    success: '体检已完成',
    request: doctorCompleteAppointment
  }
}

const handleDoctorAction = async (row, action) => {
  const config = actionConfig[action]
  try {
    await ElMessageBox.confirm(config.message, '提示', { type: 'warning' })
    await config.request(row.id)
    ElMessage.success(config.success)
    loadAppointmentList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('体检预约处理失败：', error)
      ElMessage.error(error?.message || '体检预约处理失败')
    }
  }
}

onMounted(loadAppointmentList)
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { margin-bottom: 20px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; font-size: 14px; color: #909399; }
.table-card { border-radius: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-size: 17px; font-weight: 700; }
.no-action { color: #909399; }
</style>
