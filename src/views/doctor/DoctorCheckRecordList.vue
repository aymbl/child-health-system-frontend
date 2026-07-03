<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">我负责的体检记录</h2>
        <p class="page-subtitle">录入和维护当前由我负责的儿童体检结果与处理建议，已确认体检预约会在下方提示录入。</p>
      </div>
      <el-button type="primary" @click="openAddDialog">新增体检记录</el-button>
    </div>

    <el-card v-if="pendingCheckAppointments.length > 0" shadow="hover" class="pending-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>待录入体检记录</span>
            <el-tag type="warning" effect="light">共 {{ pendingCheckAppointments.length }} 条</el-tag>
          </div>
          <span class="header-tip">以下体检预约已确认，请完成体检后录入正式体检结果。</span>
        </div>
      </template>

      <el-table :data="pendingCheckAppointments" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="childName" label="儿童姓名" min-width="120" align="center" />
        <el-table-column prop="parentName" label="家长姓名" min-width="120" align="center" />
        <el-table-column prop="appointmentTimeText" label="体检预约时间" min-width="180" align="center" />
        <el-table-column prop="status" label="预约状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag type="primary">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="预约备注" min-width="220" show-overflow-tooltip />
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openAddDialogFromAppointment(row)">录入体检记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="hover" class="table-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span>体检记录列表</span>
            <el-tag type="warning" effect="light">共 {{ tableData.length }} 条</el-tag>
          </div>
        </div>
      </template>

      <el-empty v-if="!loading && tableData.length === 0" description="暂无我负责的体检记录" :image-size="90" />

      <el-table v-else v-loading="loading" :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="childName" label="儿童姓名" min-width="120" align="center" />
        <el-table-column prop="checkDateText" label="体检时间" min-width="180" align="center" />
        <el-table-column prop="height" label="身高(cm)" width="100" align="center" />
        <el-table-column prop="weight" label="体重(kg)" width="100" align="center" />
        <el-table-column prop="temperature" label="体温(℃)" width="100" align="center" />
        <el-table-column prop="heartRate" label="心率" width="90" align="center" />
        <el-table-column prop="bloodPressure" label="血压" width="100" align="center" />
        <el-table-column prop="result" label="体检结果" min-width="180" show-overflow-tooltip />
        <el-table-column prop="suggestion" label="处理建议" min-width="180" show-overflow-tooltip />
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEditDialog(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="680px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="儿童 ID" prop="childId">
          <el-input v-model="form.childId" placeholder="请输入儿童 ID" />
        </el-form-item>

        <el-form-item label="体检时间" prop="checkDate">
          <el-date-picker
            v-model="form.checkDate"
            type="datetime"
            value-format="YYYY-MM-DDTHH:mm:ss"
            placeholder="请选择体检时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="身高(cm)" prop="height">
          <el-input v-model="form.height" placeholder="请输入身高" />
        </el-form-item>

        <el-form-item label="体重(kg)" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入体重" />
        </el-form-item>

        <el-form-item label="体温(℃)" prop="temperature">
          <el-input v-model="form.temperature" placeholder="请输入体温" />
        </el-form-item>

        <el-form-item label="心率" prop="heartRate">
          <el-input v-model="form.heartRate" placeholder="请输入心率" />
        </el-form-item>

        <el-form-item label="血压">
          <el-input v-model="form.bloodPressure" placeholder="例如 110/70" />
        </el-form-item>

        <el-form-item label="体检结果" prop="result">
          <el-input v-model="form.result" type="textarea" :rows="3" placeholder="请输入体检结果" />
        </el-form-item>

        <el-form-item label="处理建议">
          <el-input v-model="form.suggestion" type="textarea" :rows="3" placeholder="请输入处理建议" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addCheckRecord, getCheckRecordsByDoctorId, updateCheckRecord } from '@/api/checkRecord'
import { doctorCompleteAppointment, getMyDoctorAppointments } from '@/api/appointment'
import { formatDateTime } from '@/utils/format'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const pendingCheckAppointments = ref([])
const dialogVisible = ref(false)
const formRef = ref()
const isEdit = ref(false)

const emptyForm = () => ({
  id: '',
  childId: '',
  checkDate: '',
  height: '',
  weight: '',
  temperature: '',
  heartRate: '',
  bloodPressure: '',
  result: '',
  suggestion: '',
  remark: '',
  sourceAppointmentId: null
})

const form = reactive(emptyForm())

const dialogTitle = computed(() => isEdit.value ? '编辑体检记录' : '新增体检记录')

const rules = {
  childId: [{ required: true, message: '请输入儿童 ID', trigger: 'blur' }],
  checkDate: [{ required: true, message: '请选择体检时间', trigger: 'change' }],
  height: [{ required: true, message: '请输入身高', trigger: 'blur' }],
  weight: [{ required: true, message: '请输入体重', trigger: 'blur' }],
  temperature: [{ required: true, message: '请输入体温', trigger: 'blur' }],
  heartRate: [{ required: true, message: '请输入心率', trigger: 'blur' }],
  result: [{ required: true, message: '请输入体检结果', trigger: 'blur' }]
}

const normalizeDateTimeForPicker = (value) => {
  if (!value) return ''
  return String(value).replace(' ', 'T')
}

const resetForm = () => {
  Object.assign(form, emptyForm())
  formRef.value?.clearValidate?.()
}

const loadCheckRecordList = async () => {
  loading.value = true
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    if (!userInfo.id) return
    const res = await getCheckRecordsByDoctorId(userInfo.id)
    const list = res.data || []
    tableData.value = list.map((item) => ({
      id: item.id,
      childId: item.childId || item.child_id || '',
      childName: item.childName || '',
      checkDate: normalizeDateTimeForPicker(item.checkDate || item.check_date || ''),
      checkDateText: formatDateTime(item.checkDate || item.check_date || ''),
      height: item.height || '',
      weight: item.weight || '',
      temperature: item.temperature || '',
      heartRate: item.heartRate || item.heart_rate || '',
      bloodPressure: item.bloodPressure || item.blood_pressure || '',
      result: item.result || '',
      suggestion: item.suggestion || '',
      remark: item.remark || ''
    }))
  } catch (error) {
    console.error('加载医生体检记录失败：', error)
    ElMessage.error('加载体检记录失败')
  } finally {
    loading.value = false
  }
}

const loadPendingCheckAppointments = async () => {
  try {
    const res = await getMyDoctorAppointments()
    const list = res.data || []
    pendingCheckAppointments.value = list
      .filter(item => item.status === '已确认' || item.status === '待就诊')
      .map(item => {
        const appointmentTime = item.appointmentTime || item.appointment_time || ''
        return {
          id: item.id,
          childId: item.childId || item.child_id || '',
          childName: item.childName || item.child_name || '',
          parentName: item.parentName || item.parent_name || '',
          appointmentTime: normalizeDateTimeForPicker(appointmentTime),
          appointmentTimeText: formatDateTime(appointmentTime),
          status: item.status || '',
          remark: item.remark || ''
        }
      })
  } catch (error) {
    console.error('加载待录入体检预约失败：', error)
  }
}

const openAddDialog = () => {
  resetForm()
  isEdit.value = false
  dialogVisible.value = true
}

const openAddDialogFromAppointment = (appointment) => {
  resetForm()
  isEdit.value = false
  Object.assign(form, {
    childId: appointment.childId,
    checkDate: appointment.appointmentTime,
    remark: appointment.remark ? `来自体检预约：${appointment.remark}` : '来自已确认体检预约',
    sourceAppointmentId: appointment.id
  })
  dialogVisible.value = true
}

const openEditDialog = (row) => {
  resetForm()
  isEdit.value = true
  Object.assign(form, {
    id: row.id,
    childId: row.childId,
    checkDate: row.checkDate,
    height: row.height,
    weight: row.weight,
    temperature: row.temperature,
    heartRate: row.heartRate,
    bloodPressure: row.bloodPressure,
    result: row.result,
    suggestion: row.suggestion,
    remark: row.remark
  })
  dialogVisible.value = true
}

const buildPayload = () => ({
  id: form.id || undefined,
  childId: Number(form.childId),
  checkDate: form.checkDate,
  height: Number(form.height),
  weight: Number(form.weight),
  temperature: Number(form.temperature),
  heartRate: Number(form.heartRate),
  bloodPressure: form.bloodPressure,
  result: form.result,
  suggestion: form.suggestion,
  remark: form.remark
})

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const payload = buildPayload()
      if (isEdit.value) {
        await updateCheckRecord(payload)
        ElMessage.success('体检记录已更新')
      } else {
        await addCheckRecord(payload)
        if (form.sourceAppointmentId) {
          await doctorCompleteAppointment(form.sourceAppointmentId)
          ElMessage.success('体检记录已新增，体检预约已同步完成')
        } else {
          ElMessage.success('体检记录已新增')
        }
      }
      dialogVisible.value = false
      loadCheckRecordList()
      loadPendingCheckAppointments()
    } catch (error) {
      console.error('保存体检记录失败：', error)
      ElMessage.error(error?.message || '保存体检记录失败')
    } finally {
      submitting.value = false
    }
  })
}

onMounted(() => {
  loadCheckRecordList()
  loadPendingCheckAppointments()
})
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; font-size: 14px; color: #909399; }
.pending-card { margin-bottom: 20px; border-radius: 12px; }
.table-card { border-radius: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.header-left { display: flex; align-items: center; gap: 12px; font-size: 17px; font-weight: 700; }
.header-tip { color: #909399; font-size: 13px; font-weight: 400; }
</style>
