<template>
	<div class="page-container">
		<h2 class="page-title">新增预约</h2>

		<el-card>
			<el-form ref="formRef" :model="form" :rules="rules" label-width="120px" style="max-width: 700px">
				<el-form-item label="家长ID" prop="parentId">
					<el-input v-model="form.parentId" placeholder="请输入家长ID" />
				</el-form-item>

				<el-form-item label="儿童ID" prop="childId">
					<el-input v-model="form.childId" placeholder="请输入儿童ID" />
				</el-form-item>

				<el-form-item label="医生ID" prop="doctorId">
					<el-input v-model="form.doctorId" placeholder="请输入医生ID" />
				</el-form-item>

				<el-form-item label="预约时间" prop="appointmentTime">
					<el-date-picker v-model="form.appointmentTime" type="datetime" placeholder="请选择预约时间"
						value-format="YYYY-MM-DDTHH:mm:ss" style="width: 100%" />
				</el-form-item>

				<el-form-item label="预约状态" prop="status">
					<el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
						<el-option label="待确认" value="待确认" />
						<el-option label="已确认" value="已确认" />
						<el-option label="待就诊" value="待就诊" />
					</el-select>
				</el-form-item>

				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" type="textarea" :rows="4" placeholder="请输入备注" />
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
		ElMessage
	} from 'element-plus'
	import {
		useRouter
	} from 'vue-router'
	import {
		addAppointment
	} from '@/api/appointment'

	const router = useRouter()
	const formRef = ref()

	const form = reactive({
		parentId: '',
		childId: '',
		doctorId: '',
		appointmentTime: '',
		status: '待确认',
		remark: ''
	})

	const rules = {
		parentId: [{
			required: true,
			message: '请输入家长ID',
			trigger: 'blur'
		}],
		childId: [{
			required: true,
			message: '请输入儿童ID',
			trigger: 'blur'
		}],
		doctorId: [{
			required: true,
			message: '请输入医生ID',
			trigger: 'blur'
		}],
		appointmentTime: [{
			required: true,
			message: '请选择预约时间',
			trigger: 'change'
		}],
		status: [{
			required: true,
			message: '请选择预约状态',
			trigger: 'change'
		}]
	}

	const handleSubmit = () => {
		formRef.value.validate(async (valid) => {
			if (!valid) {
				return
			}

			try {
				const submitData = {
					...form,
					parentId: Number(form.parentId),
					childId: Number(form.childId),
					doctorId: Number(form.doctorId)
				}

				console.log('新增预约提交数据：', submitData)

				await addAppointment(submitData)

				ElMessage.success('新增成功')
				router.push('/admin/appointment-list')
			} catch (error) {
				console.error('新增预约失败：', error)
			}
		})
	}

	const handleReset = () => {
		formRef.value.resetFields()
	}

	const goBack = () => {
		router.push('/admin/appointment-list')
	}
</script>

<style scoped>
	.page-container {
		min-height: 100%;
	}

	.page-title {
		margin: 0 0 20px 0;
	}
</style>