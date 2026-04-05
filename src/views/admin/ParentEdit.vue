<template>
	<div class="page-container">
		<h2 class="page-title">编辑家长</h2>

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
		getUserById,
		updateUser
	} from '@/api/user'

	const route = useRoute()
	const router = useRouter()
	const formRef = ref()

	const form = reactive({
		id: '',
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

	const loadDetail = async () => {
		try {
			const id = route.params.id
			const res = await getUserById(id)
			const data = res.data

			form.id = data.id
			form.username = data.username
			form.password = data.password
			form.realName = data.realName
			form.phone = data.phone
			form.email = data.email
			form.gender = data.gender
			form.role = 'parent'
			form.status = data.status
		} catch (error) {
			console.error('获取家长详情失败：', error)
		}
	}

	const handleSubmit = () => {
		formRef.value.validate(async (valid) => {
			if (!valid) return

			try {
				await updateUser(form)
				ElMessage.success('修改成功')
				router.push('/admin/parent-list')
			} catch (error) {
				console.error('修改家长失败：', error)
			}
		})
	}

	const goBack = () => {
		router.push('/admin/parent-list')
	}

	onMounted(() => {
		loadDetail()
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