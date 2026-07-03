<template>
	<div class="page-container">
		<h2 class="page-title">新增成长记录</h2>

		<el-card shadow="hover">
			<el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 700px">
				<el-form-item label="儿童ID" prop="childId">
					<el-input v-model="form.childId" placeholder="请输入儿童ID" />
				</el-form-item>

				<el-form-item label="记录日期" prop="recordDate">
					<el-date-picker v-model="form.recordDate" type="date" placeholder="请选择记录日期"
						value-format="YYYY-MM-DD" style="width: 100%" />
				</el-form-item>

				<el-form-item label="身高(cm)" prop="height">
					<el-input v-model="form.height" placeholder="请输入身高" />
				</el-form-item>

				<el-form-item label="体重(kg)" prop="weight">
					<el-input v-model="form.weight" placeholder="请输入体重" />
				</el-form-item>

				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" type="textarea" :rows="4" placeholder="请输入备注" />
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="handleSubmit">提交</el-button>
					<el-button @click="goBack">返回</el-button>
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
		addGrowthRecord
	} from '@/api/growthRecord'

	const router = useRouter()
	const formRef = ref()

	const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

	const form = reactive({
		childId: '',
		doctorId: userInfo.id,
		recordDate: '',
		height: '',
		weight: '',
		remark: ''
	})

	const rules = {
		childId: [{
			required: true,
			message: '请输入儿童ID',
			trigger: 'blur'
		}],
		recordDate: [{
			required: true,
			message: '请选择记录日期',
			trigger: 'change'
		}]
	}

	const handleSubmit = () => {
		formRef.value.validate(async (valid) => {
			if (!valid) return

			try {
				const payload = {
					childId: form.childId ? Number(form.childId) : null,
					doctorId: form.doctorId,
					recordDate: form.recordDate,
					height: form.height ? Number(form.height) : null,
					weight: form.weight ? Number(form.weight) : null,
					remark: form.remark
				}

				const res = await addGrowthRecord(payload)
				if (res.code === 1) {
					ElMessage.success('新增成功')
					router.push('/doctor/growthRecordList')
				} else {
					ElMessage.error(res.message || '新增失败')
				}
			} catch (error) {
				ElMessage.error('新增成长记录失败')
			}
		})
	}

	const goBack = () => {
		router.back()
	}
</script>

<style scoped>
	.page-container {
		min-height: 100%;
	}

	.page-title {
		margin: 0 0 20px 0;
		font-size: 28px;
		font-weight: 700;
		color: #303133;
	}
</style>