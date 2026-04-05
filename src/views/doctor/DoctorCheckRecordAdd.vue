<template>
	<div class="page-container">
		<div class="page-header">
			<div>
				<h2 class="page-title">新增体检记录</h2>
				<p class="page-subtitle">录入新的儿童体检信息</p>
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
					<el-button type="primary" @click="handleSubmit">提交</el-button>
					<el-button @click="handleReset">重置</el-button>
					<el-button @click="goBack">返回列表</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script setup>
	import {
		reactive,
		ref
	} from 'vue'
	import {
		useRouter
	} from 'vue-router'
	import {
		ElMessage
	} from 'element-plus'
	import {
		addCheckRecord
	} from '@/api/checkRecord'

	const router = useRouter()
	const formRef = ref()

	const form = reactive({
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

				await addCheckRecord(submitData)
				ElMessage.success('新增成功')
				router.push('/doctor/check-records')
			} catch (error) {
				console.error('新增体检记录失败：', error)
			}
		})
	}

	const handleReset = () => {
		formRef.value.resetFields()
	}

	const goBack = () => {
		router.push('/doctor/check-records')
	}
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