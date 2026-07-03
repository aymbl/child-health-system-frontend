<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">疫苗申请与接种记录</h2>
        <p class="page-subtitle">处理分配给我的疫苗申请，并在完成接种后录入接种记录。</p>
      </div>
    </div>

    <el-card shadow="hover" class="table-card">
      <template #header>
        <div class="card-header">
          <span>我的疫苗申请</span>
          <el-tag type="warning" effect="light">待确认 {{ pendingApplications.length }}</el-tag>
        </div>
      </template>

      <el-empty v-if="!applicationLoading && applications.length === 0" description="暂无分配给我的疫苗申请" :image-size="90" />

      <el-table v-else v-loading="applicationLoading" :data="applications" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="childName" label="儿童姓名" width="120" align="center" />
        <el-table-column prop="vaccineName" label="疫苗名称" min-width="160" align="center" />
        <el-table-column label="计划日期" width="130" align="center">
          <template #default="{ row }">{{ formatDate(row.scheduledDate) }}</template>
        </el-table-column>
        <el-table-column label="提醒日期" width="130" align="center">
          <template #default="{ row }">{{ formatDate(row.reminderDate) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="applicationStatusType(row.status)">{{ row.status || '未设置' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === '待确认'">
              <el-button type="primary" link @click="handleApplicationAction(row, 'confirm')">确认</el-button>
              <el-button type="danger" link @click="handleApplicationAction(row, 'reject')">拒绝</el-button>
            </template>
            <el-button v-else-if="row.status === '已确认' || row.status === '已过期'" type="success" link @click="openRecordDialog(row)">
              录入接种记录
            </el-button>
            <span v-else class="muted-text">无需处理</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="hover" class="table-card">
      <template #header>
        <div class="card-header">
          <span>我负责的接种记录</span>
          <el-tag type="success" effect="light">共 {{ records.length }} 条</el-tag>
        </div>
      </template>

      <el-empty v-if="!recordLoading && records.length === 0" description="暂无我负责的接种记录" :image-size="90" />

      <el-table v-else v-loading="recordLoading" :data="records" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="childName" label="儿童姓名" width="120" align="center" />
        <el-table-column prop="vaccineName" label="疫苗名称" min-width="160" align="center" />
        <el-table-column label="接种日期" width="130" align="center">
          <template #default="{ row }">{{ formatDate(row.vaccinationDate) }}</template>
        </el-table-column>
        <el-table-column label="下次到期" width="130" align="center">
          <template #default="{ row }">{{ formatDate(row.nextDueDate) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }"><el-tag type="success">{{ row.status || '已接种' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
      </el-table>
    </el-card>

    <el-dialog v-model="recordDialogVisible" title="录入接种记录" width="620px" destroy-on-close>
      <el-form ref="recordFormRef" :model="recordForm" :rules="recordRules" label-width="120px">
        <el-form-item label="儿童">
          <el-input :model-value="selectedApplication?.childName" disabled />
        </el-form-item>
        <el-form-item label="疫苗名称">
          <el-input v-model="recordForm.vaccineName" disabled />
        </el-form-item>
        <el-form-item label="接种日期" prop="vaccinationDate">
          <el-date-picker v-model="recordForm.vaccinationDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="下次接种日期">
          <el-date-picker v-model="recordForm.nextDueDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="recordForm.remark" type="textarea" :rows="3" placeholder="请输入接种说明或备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="recordDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="recordSubmitting" @click="handleSaveRecord">保存接种记录</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'
import {
  doctorConfirmVaccineApplication,
  doctorRejectVaccineApplication,
  getMyDoctorVaccineApplications
} from '@/api/vaccineReminder'
import { formatDate } from '@/utils/format'

const applicationLoading = ref(false)
const recordLoading = ref(false)
const applications = ref([])
const records = ref([])
const recordDialogVisible = ref(false)
const recordSubmitting = ref(false)
const recordFormRef = ref()
const selectedApplication = ref(null)

const recordForm = reactive({
  childId: '',
  vaccineName: '',
  vaccinationDate: '',
  nextDueDate: '',
  status: '已接种',
  remark: ''
})

const recordRules = {
  vaccinationDate: [{ required: true, message: '请选择接种日期', trigger: 'change' }]
}

const pendingApplications = computed(() => applications.value.filter(item => item.status === '待确认'))

const applicationStatusType = status => {
  if (status === '待确认') return 'warning'
  if (status === '已确认') return 'primary'
  if (status === '已拒绝') return 'danger'
  if (status === '已接种') return 'success'
  if (status === '已过期') return 'danger'
  return 'info'
}

const loadApplications = async () => {
  applicationLoading.value = true
  try {
    const res = await getMyDoctorVaccineApplications()
    applications.value = res.data || []
  } finally {
    applicationLoading.value = false
  }
}

const loadRecords = async () => {
  recordLoading.value = true
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const res = await request.get(`/vaccinationRecords/doctor/${userInfo.id}`)
    records.value = res.data || []
  } finally {
    recordLoading.value = false
  }
}

const handleApplicationAction = async (row, action) => {
  const isConfirm = action === 'confirm'
  try {
    await ElMessageBox.confirm(isConfirm ? '确认接受该疫苗申请吗？' : '确认拒绝该疫苗申请吗？', '提示', { type: 'warning' })
    if (isConfirm) {
      await doctorConfirmVaccineApplication(row.id)
      ElMessage.success('疫苗申请已确认')
    } else {
      await doctorRejectVaccineApplication(row.id)
      ElMessage.success('疫苗申请已拒绝')
    }
    loadApplications()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('处理疫苗申请失败')
    }
  }
}

const openRecordDialog = row => {
  selectedApplication.value = row
  Object.assign(recordForm, {
    childId: row.childId,
    vaccineName: row.vaccineName,
    vaccinationDate: '',
    nextDueDate: '',
    status: '已接种',
    remark: row.remark || ''
  })
  recordDialogVisible.value = true
}

const handleSaveRecord = () => {
  recordFormRef.value.validate(async valid => {
    if (!valid) return
    recordSubmitting.value = true
    try {
      await request.post('/vaccinationRecords', recordForm)
      ElMessage.success('接种记录已保存')
      recordDialogVisible.value = false
      loadApplications()
      loadRecords()
    } catch (error) {
      ElMessage.error(error?.message || '保存接种记录失败')
    } finally {
      recordSubmitting.value = false
    }
  })
}

onMounted(() => {
  loadApplications()
  loadRecords()
})
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { margin-bottom: 20px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; font-size: 14px; color: #909399; }
.table-card { border-radius: 12px; margin-bottom: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.muted-text { color: #909399; }
</style>
