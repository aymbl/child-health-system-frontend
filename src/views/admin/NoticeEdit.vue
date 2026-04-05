<template>
	<div class="page-container">
		<h2 class="page-title">编辑通知</h2>

		<el-card>
			<el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 700px">
				<el-form-item label="通知标题" prop="title">
					<el-input v-model="form.title" placeholder="请输入通知标题" />
				</el-form-item>

				<el-form-item label="通知内容" prop="content">
					<el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入通知内容" />
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="handleSubmit">保存修改</el-button>
					<el-button @click="loadNoticeDetail">重置为原数据</el-button>
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
		getNoticeById,
		updateNotice
	} from '@/api/notice'

	const route = useRoute()
	const router = useRouter()
	const formRef = ref()

	const form = reactive({
		id: '',
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

	const loadNoticeDetail = async () => {
		try {
			const id = route.params.id
			const res = await getNoticeById(id)
			const data = res.data

			form.id = data.id
			form.title = data.title
			form.content = data.content
		} catch (error) {
			console.error('获取通知详情失败：', error)
		}
	}

	const handleSubmit = () => {
		formRef.value.validate(async (valid) => {
			if (!valid) {
				return
			}

			try {
				await updateNotice({
					...form
				})

				ElMessage.success('修改成功')
				router.push('/admin/notice-list')
			} catch (error) {
				console.error('修改通知失败：', error)
			}
		})
	}

	const goBack = () => {
		router.push('/admin/notice-list')
	}

	onMounted(() => {
		loadNoticeDetail()
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