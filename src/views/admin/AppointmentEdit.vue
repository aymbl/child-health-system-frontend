<template>
	<div class="page-container">
		<h2 class="page-title">编辑预约</h2>

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
					<el-button type="primary" @click="handleSubmit">保存修改</el-button>
					<el-button @click="loadAppointmentDetail">重置为原数据</el-button>
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
		ElMessage
	} from 'element-plus'
	import {
		useRoute,
		useRouter
	} from 'vue-router'
	import {
		getAppointmentById,
		updateAppointment
	} from '@/api/appointment'

	const route = useRoute()
	const router = useRouter()
	const formRef = ref()

	const form = reactive({
		id: '',
		parentId: '',
		childId: '',
		doctorId: '',
		appointmentTime: '',
		status: '',
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

	const loadAppointmentDetail = async () => {
		try {
			const id = route.params.id
			const res = await getAppointmentById(id)
			const data = res.data

			form.id = data.id
			form.parentId = data.parentId ?? data.parent_id ?? ''
			form.childId = data.childId ?? data.child_id ?? ''
			form.doctorId = data.doctorId ?? data.doctor_id ?? ''
			form.appointmentTime = data.appointmentTime || data.appointment_time || ''
			form.status = data.status || ''
			form.remark = data.remark || ''
		} catch (error) {
			console.error('获取预约详情失败：', error)
		}
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

				console.log('编辑预约提交数据：', submitData)

				await updateAppointment(submitData)

				ElMessage.success('修改成功')
				router.push('/admin/appointment-list')
			} catch (error) {
				console.error('修改预约失败：', error)
			}
		})
	}

	const goBack = () => {
		router.push('/admin/appointment-list')
	}

	onMounted(() => {
		loadAppointmentDetail()
	})
</script>

<style scoped>
	.page-container {
		min-height: 100%;
	}

	.page-title {
		margin: 0 0 20px 0;
	}
</style>