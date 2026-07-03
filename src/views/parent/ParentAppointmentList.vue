<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">我的体检预约</h2>
        <p class="page-subtitle">查看当前账号提交的体检预约申请和处理状态。</p>
      </div>
      <el-button type="primary" @click="router.push('/parent/appointment-apply')">发起体检预约</el-button>
    </div>

    <el-card shadow="hover" class="table-card">
      <template #header>
        <div class="card-header">
          <span>体检预约记录</span>
          <el-tag type="primary" effect="light">共 {{ tableData.length }} 条</el-tag>
        </div>
      </template>

      <el-empty v-if="tableData.length === 0" description="暂无体检预约记录" :image-size="90" />

      <el-table v-else :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="childName" label="儿童姓名" min-width="120" align="center" />
        <el-table-column prop="doctorName" label="医生姓名" min-width="120" align="center" />
        <el-table-column label="体检预约时间" min-width="180" align="center">
          <template #default="{ row }">
            {{ formatDateTime(row.appointmentTime || row.appointment_time) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ row.status || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="canCancel(row.status)"
              type="danger"
              link
              @click="handleCancelAppointment(row)"
            >
              取消体检预约
            </el-button>
            <span v-else class="no-action">无需处理</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAppointmentsByParentId, parentCancelAppointment } from '@/api/appointment'
import { formatDateTime } from '@/utils/format'

const router = useRouter()
const tableData = ref([])

const canCancel = status => status === '待确认' || status === '已确认' || status === '待就诊'

const getStatusTagType = status => {
  if (status === '待确认') return 'warning'
  if (status === '已确认' || status === '待就诊') return 'primary'
  if (status === '已拒绝') return 'danger'
  if (status === '已完成') return 'success'
  if (status === '已取消') return 'info'
  return 'info'
}

const loadData = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const res = await getAppointmentsByParentId(userInfo.id)
    tableData.value = res.data || []
  } catch (error) {
    console.error('加载体检预约记录失败：', error)
    ElMessage.error('加载体检预约记录失败')
  }
}

const handleCancelAppointment = async row => {
  try {
    await ElMessageBox.confirm('确定取消这条体检预约吗？', '提示', { type: 'warning' })
    await parentCancelAppointment(row.id)
    ElMessage.success('体检预约已取消')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消体检预约失败：', error)
      ElMessage.error(error?.message || '取消体检预约失败')
    }
  }
}

onMounted(loadData)
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0 0; font-size: 14px; color: #909399; }
.table-card { border-radius: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-size: 17px; font-weight: 700; }
.no-action { color: #909399; }
</style>
