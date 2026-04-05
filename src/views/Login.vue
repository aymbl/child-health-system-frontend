<template>
	<div class="login-page">
		<div class="login-mask"></div>

		<div class="login-wrapper">
			<div class="login-left">
				<div class="login-left-mask">
					<div class="login-left-content">
						<h1>儿童健康管理系统</h1>
						<p>Child Health Management System</p>
					</div>
				</div>
			</div>

			<div class="login-right">
				<el-card class="login-card" shadow="hover">
					<div class="login-header">
						<h2>用户登录</h2>
						<p>请选择登录身份并输入账号信息</p>
					</div>

					<el-form ref="formRef" :model="form" :rules="rules" label-width="78px" hide-required-asterisk
						class="login-form">
						<el-form-item label="用户名" prop="username">
							<el-input v-model="form.username" placeholder="请输入用户名" size="large" clearable />
						</el-form-item>

						<el-form-item label="密　码" prop="password">
							<el-input v-model="form.password" type="password" show-password placeholder="请输入密码"
								size="large" @keyup.enter="handleLogin" />
						</el-form-item>

						<el-form-item prop="loginType" class="login-type-item">
							<el-radio-group v-model="form.loginType" class="login-type-group">
								<el-radio label="admin">管理端</el-radio>
								<el-radio label="doctor">医生端</el-radio>
								<el-radio label="parent">家长端</el-radio>
							</el-radio-group>
						</el-form-item>

						<el-form-item class="login-btn-item">
							<el-button type="primary" size="large" class="login-btn" @click="handleLogin">
								登录
							</el-button>
						</el-form-item>
					</el-form>
				</el-card>
			</div>
		</div>
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
		login
	} from '@/api/auth'

	const router = useRouter()
	const formRef = ref()

	const form = reactive({
		loginType: 'admin',
		username: '',
		password: ''
	})

	const rules = {
		loginType: [{
			required: true,
			message: '请选择登录身份',
			trigger: 'change'
		}],
		username: [{
			required: true,
			message: '请输入用户名',
			trigger: 'blur'
		}],
		password: [{
			required: true,
			message: '请输入密码',
			trigger: 'blur'
		}]
	}

	const roleTextMap = {
		admin: '管理端',
		doctor: '医生端',
		parent: '家长端'
	}

	const handleLogin = () => {
		formRef.value.validate(async (valid) => {
			if (!valid) return

			try {
				const res = await login({
					username: form.username,
					password: form.password
				})

				const user = res.data

				if (user.role !== form.loginType) {
					ElMessage.error(`该账号不属于${roleTextMap[form.loginType]}`)
					return
				}

				localStorage.setItem('userInfo', JSON.stringify(user))
				ElMessage.success('登录成功')

				if (user.role === 'admin') {
					router.push('/admin/dashboard')
				} else if (user.role === 'doctor') {
					router.push('/doctor/home')
				} else if (user.role === 'parent') {
					router.push('/parent/home')
				} else {
					ElMessage.error('用户角色不正确')
				}
			} catch (error) {
				console.error('登录失败：', error)
			}
		})
	}
</script>

<style scoped>
	.login-page {
		position: relative;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		background: url('/login-bg.jpg') no-repeat center center;
		background-size: cover;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.login-mask {
		position: absolute;
		inset: 0;
		background: rgba(30, 41, 59, 0.28);
	}

	.login-wrapper {
		position: relative;
		z-index: 2;
		width: 1100px;
		max-width: 94%;
		height: 620px;
		display: flex;
		border-radius: 24px;
		overflow: hidden;
		box-shadow: 0 16px 45px rgba(0, 0, 0, 0.18);
		background: rgba(255, 255, 255, 0.94);
		backdrop-filter: blur(4px);
	}

	.login-left {
		width: 50%;
		position: relative;
		background-image: url('/login-side.png');
		background-repeat: no-repeat;
		background-size: cover;
		background-position: 95% center;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		overflow: hidden;
	}

	.login-left-mask {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg,
				rgba(58, 123, 213, 0.28),
				rgba(0, 210, 255, 0.12));
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 105px;
		box-sizing: border-box;
	}

	.login-left-content {
		width: 100%;
		text-align: center;
		padding: 0 30px;
		box-sizing: border-box;
	}

	.login-left-content h1 {
		font-size: 34px;
		margin: 0 0 16px 0;
		font-weight: 700;
		color: #ffffff;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
	}

	.login-left-content p {
		font-size: 16px;
		margin: 0;
		color: #f8fbff;
		opacity: 0.98;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
	}

	.login-right {
		width: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 30px;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 0.96);
	}

	.login-card {
		width: 100%;
		max-width: 460px;
		border-radius: 16px;
		border: none;
		box-shadow: none;
		background: transparent;
	}

	.login-header {
		text-align: center;
		margin-bottom: 34px;
	}

	.login-header h2 {
		margin: 0 0 12px 0;
		font-size: 30px;
		color: #1f2937;
		font-weight: 700;
	}

	.login-header p {
		margin: 0;
		font-size: 14px;
		color: #6b7280;
	}

	.login-form {
		margin-top: 10px;
	}

	.login-type-item {
		margin-top: 4px;
		margin-bottom: 22px;
	}

	.login-btn-item {
		margin-top: 8px;
		margin-bottom: 0;
	}

	.login-btn {
		width: 100%;
		border-radius: 10px;
		font-size: 16px;
		letter-spacing: 2px;
	}

	.login-type-group {
		display: flex;
		justify-content: center;
		gap: 24px;
		width: 100%;
	}

	:deep(.el-form-item) {
		margin-bottom: 24px;
	}

	:deep(.el-form-item__label) {
		font-size: 15px;
		color: #374151;
		font-weight: 500;
		letter-spacing: 1px;
	}

	:deep(.el-input__wrapper) {
		border-radius: 10px;
	}

	:deep(.el-radio__input.is-checked + .el-radio__label) {
		color: #409eff;
		font-weight: 600;
	}

	@media screen and (max-width: 900px) {
		.login-wrapper {
			width: 94%;
			height: auto;
			flex-direction: column;
		}

		.login-left,
		.login-right {
			width: 100%;
		}

		.login-left {
			min-height: 260px;
		}

		.login-left-mask {
			padding-top: 70px;
		}

		.login-left-content h1 {
			font-size: 28px;
		}

		.login-right {
			padding: 24px 20px 30px;
		}

		.login-type-group {
			gap: 12px;
			flex-wrap: wrap;
		}
	}
</style>