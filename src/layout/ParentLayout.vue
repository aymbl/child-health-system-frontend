<template>
	<div class="layout-container">
		<aside class="sidebar">
			<div class="logo">家长端</div>

			<el-menu router :default-active="$route.path" class="menu" background-color="#304156" text-color="#bfcbd9"
				active-text-color="#409EFF">
				<el-menu-item index="/parent/home">
					<span>家长首页</span>
				</el-menu-item>

				<el-menu-item index="/parent/children">
					<span>我的孩子</span>
				</el-menu-item>

				<el-menu-item index="/parent/appointments">
					<span>我的预约</span>
				</el-menu-item>

				<el-menu-item index="/parent/check-records">
					<span>体检记录</span>
				</el-menu-item>

				<el-menu-item index="/parent/notices">
					<span>通知公告</span>
				</el-menu-item>
			</el-menu>
		</aside>

		<div class="main-container">
			<header class="header">
				<div>家长服务平台</div>
				<div class="header-right">
					<span>欢迎你，{{ currentUser.realName || currentUser.username || '家长' }}</span>
					<el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
				</div>
			</header>

			<main class="content">
				<router-view />
			</main>
		</div>
	</div>
</template>

<script setup>
	import {
		computed
	} from 'vue'
	import {
		useRouter
	} from 'vue-router'

	const router = useRouter()

	const currentUser = computed(() => {
		const str = localStorage.getItem('userInfo')
		return str ? JSON.parse(str) : {}
	})

	const handleLogout = () => {
		localStorage.removeItem('userInfo')
		router.push('/login')
	}
</script>

<style scoped>
	.layout-container {
		display: flex;
		height: 100vh;
		overflow: hidden;
		background-color: #f5f7fa;
	}

	.sidebar {
		width: 220px;
		min-width: 220px;
		max-width: 220px;
		flex: 0 0 220px;
		overflow-y: auto;
		overflow-x: hidden;
		background: #304156;
	}

	.logo {
		height: 60px;
		line-height: 60px;
		text-align: center;
		font-size: 18px;
		font-weight: bold;
		color: #fff;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.menu {
		border-right: none;
		width: 100%;
	}

	.main-container {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.header {
		height: 60px;
		flex-shrink: 0;
		background-color: #fff;
		border-bottom: 1px solid #ebeef5;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20px;
		box-sizing: border-box;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.content {
		flex: 1;
		min-width: 0;
		overflow: auto;
		padding: 20px;
		box-sizing: border-box;
	}
</style>