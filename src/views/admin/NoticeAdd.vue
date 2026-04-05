<template>
	<div class="page-container">
		<h2 class="page-title">新增通知</h2>

		<el-card>
			<el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 700px">
				<el-form-item label="通知标题" prop="title">
					<el-input v-model="form.title" placeholder="请输入通知标题" />
				</el-form-item>

				<el-form-item label="通知内容" prop="content">
					<el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入通知内容" />
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
		addNotice
	} from '@/api/notice'

	const router = useRouter()
	const formRef = ref()

	const form = reactive({
		title: '',
		content: ''
	})

	const rules = {
		title: [{
			required: true,
			message: '请输入通知标题',
			trigger: 'blur'
		}],
		content: [{
			required: true,
			message: '请输入通知内容',
			trigger: 'blur'
		}]
	}

	const handleSubmit = () => {
		formRef.value.validate(async (valid) => {
			if (!valid) {
				return
			}

			try {
				await addNotice({
					...form,
					publisherId: 1,
					status: 1
				})

				ElMessage.success('新增成功')
				router.push('/admin/notice-list')
			} catch (error) {
				console.error('新增通知失败：', error)
			}
		})
	}

	const handleReset = () => {
		formRef.value.resetFields()
	}

	const goBack = () => {
		router.push('/admin/notice-list')
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