<template>
	<div class="page-container">
		<div class="page-header">
			<div>
				<h2 class="page-title">新增反馈</h2>
				<p class="page-subtitle">提交建议、系统问题或与医生服务相关的反馈</p>
			</div>
		</div>

		<el-card class="form-card" shadow="hover">
			<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="反馈类型" prop="type">
					<el-select v-model="form.type" placeholder="请选择反馈类型" style="width: 320px" @change="handleTypeChange">
						<el-option label="用户建议" value="suggestion" />
						<el-option label="系统反馈" value="system" />
						<el-option label="医生反馈" value="doctor" />
					</el-select>
				</el-form-item>

				<el-form-item v-if="form.type === 'doctor'" label="选择医生" prop="targetDoctorId">
					<el-select
						v-model="form.targetDoctorId"
						filterable
						clearable
						placeholder="请选择医生"
						style="width: 320px"
						:loading="doctorLoading"
					>
						<el-option
							v-for="doctor in doctorOptions"
							:key="doctor.value"
							:label="doctor.label"
							:value="doctor.value"
						/>
					</el-select>
					<div class="field-tip">医生列表来自你当前可见的预约和体检记录数据。</div>
				</el-form-item>

				<el-form-item label="标题" prop="title">
					<el-input v-model="form.title" maxlength="100" show-word-limit placeholder="请输入反馈标题" />
				</el-form-item>

				<el-form-item label="反馈内容" prop="content">
					<el-input
						v-model="form.content"
						type="textarea"
						:rows="6"
						maxlength="1000"
						show-word-limit
						placeholder="请尽量描述清楚你的问题或建议"
					/>
				</el-form-item>

				<el-form-item>
					<el-button @click="goList">返回列表</el-button>
					<el-button type="primary" :loading="submitting" @click="submitForm">提交反馈</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createFeedback } from '@/api/feedback'
import { getAppointmentsByParentId } from '@/api/appointment'
import { getCheckRecordsByParentId } from '@/api/checkRecord'

const router = useRouter()
const formRef = ref()
const submitting = ref(false)
const doctorLoading = ref(false)
const doctorOptions = ref([])
const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}')

const form = reactive({
	type: 'suggestion',
	targetDoctorId: null,
	title: '',
	content: ''
})

const rules = {
	type: [{ required: true, message: '请选择反馈类型', trigger: 'change' }],
	targetDoctorId: [{
		validator: (_, value, callback) => {
			if (form.type === 'doctor' && !value) {
				callback(new Error('医生反馈必须选择医生'))
				return
			}
			callback()
		},
		trigger: 'change'
	}],
	title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
	content: [{ required: true, message: '请输入反馈内容', trigger: 'blur' }]
}

const normalizeDoctorOptions = (appointments, checkRecords) => {
	const doctorMap = new Map()

	for (const item of appointments || []) {
		const doctorId = item.doctorId ?? item.doctor_id
		const doctorName = item.doctorName ?? item.doctor_name
		if (doctorId && doctorName && !doctorMap.has(doctorId)) {
			doctorMap.set(doctorId, {
				value: doctorId,
				label: `${doctorName}（ID: ${doctorId}）`
			})
		}
	}

	for (const item of checkRecords || []) {
		const doctorId = item.doctorId ?? item.doctor_id
		const doctorName = item.doctorName ?? item.doctor_name
		if (doctorId && doctorName && !doctorMap.has(doctorId)) {
			doctorMap.set(doctorId, {
				value: doctorId,
				label: `${doctorName}（ID: ${doctorId}）`
			})
		}
	}

	doctorOptions.value = Array.from(doctorMap.values()).sort((a, b) => a.value - b.value)
}

const loadDoctorOptions = async () => {
	if (!currentUser.id) return
	doctorLoading.value = true
	try {
		const [appointmentRes, checkRes] = await Promise.all([
			getAppointmentsByParentId(currentUser.id),
			getCheckRecordsByParentId(currentUser.id)
		])
		normalizeDoctorOptions(appointmentRes.data || [], checkRes.data || [])
	} catch (error) {
		console.error('加载医生选择列表失败：', error)
		doctorOptions.value = []
	} finally {
		doctorLoading.value = false
	}
}

const handleTypeChange = () => {
	if (form.type !== 'doctor') {
		form.targetDoctorId = null
	}
}

const submitForm = async () => {
	if (!formRef.value) return
	await formRef.value.validate()

	submitting.value = true
	try {
		await createFeedback({
			type: form.type,
			targetDoctorId: form.type === 'doctor' ? form.targetDoctorId : null,
			title: form.title.trim(),
			content: form.content.trim()
		})
		ElMessage.success('反馈提交成功')
		router.push('/parent/feedback')
	} catch (error) {
		console.error('提交反馈失败：', error)
	} finally {
		submitting.value = false
	}
}

const goList = () => {
	router.push('/parent/feedback')
}

onMounted(() => {
	loadDoctorOptions()
})
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { margin-bottom: 20px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; font-size: 14px; color: #909399; }
.form-card { border-radius: 12px; max-width: 860px; }
.field-tip { margin-top: 6px; font-size: 12px; color: #909399; }
</style>
