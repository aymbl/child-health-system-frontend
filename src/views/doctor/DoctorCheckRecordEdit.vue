<template>
	<div class="page-container">
		<div class="page-header">
			<div>
				<h2 class="page-title">编辑体检记录</h2>
				<p class="page-subtitle">修改当前体检记录信息</p>
			</div>
		</div>

		<el-card shadow="hover" class="form-card">
			<el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="record-form">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="儿童ID" prop="childId">
							<el-input v-model="form.childId" placeholder="请输入儿童ID" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="体检时间" prop="checkDate">
							<el-date-picker v-model="form.checkDate" type="datetime" placeholder="请选择体检时间"
								value-format="YYYY-MM-DDTHH:mm:ss" style="width: 100%" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="身高(cm)" prop="height">
							<el-input v-model="form.height" placeholder="请输入身高" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="体重(kg)" prop="weight">
							<el-input v-model="form.weight" placeholder="请输入体重" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="体温(℃)" prop="temperature">
							<el-input v-model="form.temperature" placeholder="请输入体温" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="心率" prop="heartRate">
							<el-input v-model="form.heartRate" placeholder="请输入心率" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="血压" prop="bloodPressure">
							<el-input v-model="form.bloodPressure" placeholder="请输入血压" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="体检结果" prop="result">
					<el-input v-model="form.result" type="textarea" :rows="4" placeholder="请输入体检结果" />
				</el-form-item>

				<el-form-item label="建议" prop="suggestion">
					<el-input v-model="form.suggestion" type="textarea" :rows="4" placeholder="请输入建议" />
				</el-form-item>

				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="handleSubmit">保存修改</el-button>
					<el-button @click="loadDetail">重置为原数据</el-button>
					<el-button @click="goBack">返回列表</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script setup>
	import {
		reactive,
		ref,
		onMounted
	} from 'vue'
	import {
		useRoute,
		useRouter
	} from 'vue-router'
	import {
		ElMessage
	} from 'element-plus'
	import {
		getCheckRecordById,
		updateCheckRecord
	} from '@/api/checkRecord'

	const route = useRoute()
	const router = useRouter()
	const formRef = ref()

	const form = reactive({
		id: '',
		childId: '',
		doctorId: '',
		checkDate: '',
		height: '',
		weight: '',
		temperature: '',
		heartRate: '',
		bloodPressure: '',
		result: '',
		suggestion: '',
		remark: ''
	})

	const rules = {
		childId: [{
			required: true,
			message: '请输入儿童ID',
			trigger: 'blur'
		}],
		checkDate: [{
			required: true,
			message: '请选择体检时间',
			trigger: 'change'
		}],
		height: [{
			required: true,
			message: '请输入身高',
			trigger: 'blur'
		}],
		weight: [{
			required: true,
			message: '请输入体重',
			trigger: 'blur'
		}],
		temperature: [{
			required: true,
			message: '请输入体温',
			trigger: 'blur'
		}],
		heartRate: [{
			required: true,
			message: '请输入心率',
			trigger: 'blur'
		}]
	}

	const formatDateTimeForPicker = value => {
		if (!value) return ''
		return String(value).replace(' ', 'T').replace('.000+00:00', '')
	}

	const loadDetail = async () => {
		try {
			const id = route.params.id
			const res = await getCheckRecordById(id)
			const data = res.data

			form.id = data.id
			form.childId = data.childId ?? data.child_id ?? ''
			form.doctorId = data.doctorId ?? data.doctor_id ?? ''
			form.checkDate = formatDateTimeForPicker(data.checkDate || data.check_date || '')
			form.height = data.height ?? ''
			form.weight = data.weight ?? ''
			form.temperature = data.temperature ?? ''
			form.heartRate = data.heartRate ?? data.heart_rate ?? ''
			form.bloodPressure = data.bloodPressure ?? data.blood_pressure ?? ''
			form.result = data.result || ''
			form.suggestion = data.suggestion || ''
			form.remark = data.remark || ''
		} catch (error) {
			console.error('获取体检记录详情失败：', error)
		}
	}

	const handleSubmit = () => {
		formRef.value.validate(async valid => {
			if (!valid) return

			try {
				const userInfoStr = localStorage.getItem('userInfo')
				const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {}

				const submitData = {
					...form,
					doctorId: userInfo.id,
					childId: Number(form.childId),
					height: Number(form.height),
					weight: Number(form.weight),
					temperature: Number(form.temperature),
					heartRate: Number(form.heartRate)
				}

				await updateCheckRecord(submitData)
				ElMessage.success('修改成功')
				router.push('/doctor/check-records')
			} catch (error) {
				console.error('修改体检记录失败：', error)
			}
		})
	}

	const goBack = () => {
		router.push('/doctor/check-records')
	}

	onMounted(() => {
		loadDetail()
	})
</script>

<style scoped>
	.page-container {
		min-height: 100%;
	}

	.page-header {
		margin-bottom: 20px;
	}

	.page-title {
		margin: 0;
		font-size: 28px;
		font-weight: 700;
		color: #303133;
	}

	.page-subtitle {
		margin: 8px 0 0 0;
		font-size: 14px;
		color: #909399;
	}

	.form-card {
		border-radius: 12px;
	}

	.record-form {
		max-width: 900px;
	}
</style>