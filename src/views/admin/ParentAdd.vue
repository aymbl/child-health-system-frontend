<template>
	<div class="page-container">
		<h2 class="page-title">新增家长</h2>

		<el-card>
			<el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 700px">
				<el-form-item label="用户名" prop="username">
					<el-input v-model="form.username" placeholder="请输入用户名" />
				</el-form-item>

				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password" placeholder="请输入密码" show-password />
				</el-form-item>

				<el-form-item label="姓名" prop="realName">
					<el-input v-model="form.realName" placeholder="请输入姓名" />
				</el-form-item>

				<el-form-item label="手机号" prop="phone">
					<el-input v-model="form.phone" placeholder="请输入手机号" />
				</el-form-item>

				<el-form-item label="邮箱" prop="email">
					<el-input v-model="form.email" placeholder="请输入邮箱" />
				</el-form-item>

				<el-form-item label="性别" prop="gender">
					<el-select v-model="form.gender" placeholder="请选择性别" style="width: 100%">
						<el-option label="男" value="男" />
						<el-option label="女" value="女" />
						<el-option label="其他" value="其他" />
					</el-select>
				</el-form-item>

				<el-form-item label="状态" prop="status">
					<el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
						<el-option label="启用" :value="1" />
						<el-option label="禁用" :value="0" />
					</el-select>
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
		addUser
	} from '@/api/user'

	const router = useRouter()
	const formRef = ref()

	const form = reactive({
		username: '',
		password: '',
		realName: '',
		phone: '',
		email: '',
		gender: '',
		role: 'parent',
		status: 1
	})

	const rules = {
		username: [{
			required: true,
			message: '请输入用户名',
			trigger: 'blur'
		}],
		password: [{
			required: true,
			message: '请输入密码',
			trigger: 'blur'
		}],
		realName: [{
			required: true,
			message: '请输入姓名',
			trigger: 'blur'
		}],
		phone: [{
			required: true,
			message: '请输入手机号',
			trigger: 'blur'
		}],
		email: [{
			required: true,
			message: '请输入邮箱',
			trigger: 'blur'
		}],
		gender: [{
			required: true,
			message: '请选择性别',
			trigger: 'change'
		}]
	}

	const handleSubmit = () => {
		formRef.value.validate(async (valid) => {
			if (!valid) return

			try {
				await addUser(form)
				ElMessage.success('新增成功')
				router.push('/admin/parent-list')
			} catch (error) {
				console.error('新增家长失败：', error)
			}
		})
	}

	const handleReset = () => {
		formRef.value.resetFields()
		form.role = 'parent'
		form.status = 1
	}

	const goBack = () => {
		router.push('/admin/parent-list')
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