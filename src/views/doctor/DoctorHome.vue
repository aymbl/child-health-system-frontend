<template>
	<div class="page-container">
		<div class="top-bar">
			<div>
				<h2 class="page-title">医生首页</h2>
				<p class="page-subtitle">欢迎回来，{{ currentUser.realName || currentUser.username || '医生' }}</p>
			</div>
		</div>

		<el-card class="welcome-card" shadow="hover">
			<div class="welcome-title">欢迎使用医生端工作台</div>
			<div class="welcome-content">
				当前登录医生：{{ currentUser.realName || currentUser.username || '医生' }}
			</div>
			<div class="welcome-tip">
				你可以在这里查看自己的预约信息、管理体检记录以及查看系统通知。
			</div>
		</el-card>

		<el-row :gutter="20" class="stat-row">
			<el-col :span="8">
				<el-card class="stat-card" shadow="hover">
					<div class="stat-label">我的预约</div>
					<div class="stat-value">{{ appointmentCount }}</div>
					<div class="stat-desc">当前关联预约总数</div>
				</el-card>
			</el-col>

			<el-col :span="8">
				<el-card class="stat-card" shadow="hover">
					<div class="stat-label">体检记录</div>
					<div class="stat-value">{{ checkRecordCount }}</div>
					<div class="stat-desc">当前管理记录总数</div>
				</el-card>
			</el-col>

			<el-col :span="8">
				<el-card class="stat-card" shadow="hover">
					<div class="stat-label">最新通知</div>
					<div class="stat-value">{{ noticeList.length }}</div>
					<div class="stat-desc">首页展示最近 5 条</div>
				</el-card>
			</el-col>
		</el-row>

		<el-row :gutter="20" class="content-row">
			<el-col :span="16">
				<el-card class="notice-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span>最新通知</span>
							<el-button type="primary" link @click="router.push('/doctor/notices')">查看更多</el-button>
						</div>
					</template>

					<div v-if="noticeList.length > 0">
						<div v-for="item in noticeList" :key="item.id" class="notice-item"
							@click="router.push('/doctor/notices')">
							<div class="notice-main">
								<div class="notice-title">{{ item.title }}</div>
								<div class="notice-content-preview">{{ item.content }}</div>
							</div>
							<div class="notice-time">{{ formatDateTime(item.createdAt || item.created_at) }}</div>
						</div>
					</div>

					<el-empty v-else description="暂无通知" :image-size="80" />
				</el-card>
			</el-col>

			<el-col :span="8">
				<el-card class="quick-card" shadow="hover">
					<template #header>
						<div class="card-header">
							<span>快捷入口</span>
						</div>
					</template>

					<div class="quick-list">
						<div class="quick-item" @click="router.push('/doctor/appointments')">
							<div class="quick-title">我的预约</div>
							<div class="quick-desc">查看当前医生相关预约</div>
						</div>

						<div class="quick-item" @click="router.push('/doctor/check-records')">
							<div class="quick-title">体检记录管理</div>
							<div class="quick-desc">查看和维护体检记录</div>
						</div>

						<div class="quick-item" @click="router.push('/doctor/check-record-add')">
							<div class="quick-title">新增体检记录</div>
							<div class="quick-desc">快速录入新的体检信息</div>
						</div>

						<div class="quick-item" @click="router.push('/doctor/notices')">
							<div class="quick-title">通知查看</div>
							<div class="quick-desc">查看系统发布的通知公告</div>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup>
	import {
		computed,
		ref,
		onMounted
	} from 'vue'
	import {
		useRouter
	} from 'vue-router'
	import {
		getAppointmentsByDoctorId
	} from '@/api/appointment'
	import {
		getCheckRecordsByDoctorId
	} from '@/api/checkRecord'
	import {
		getNoticeList
	} from '@/api/notice'
	import {
		formatDateTime
	} from '@/utils/format'

	const router = useRouter()

	const currentUser = computed(() => {
		const str = localStorage.getItem('userInfo')
		return str ? JSON.parse(str) : {}
	})

	const appointmentCount = ref(0)
	const checkRecordCount = ref(0)
	const noticeList = ref([])

	const loadAppointmentCount = async () => {
		try {
			const res = await getAppointmentsByDoctorId(currentUser.value.id)
			appointmentCount.value = (res.data || []).length
		} catch (error) {
			console.error('加载预约数量失败：', error)
			appointmentCount.value = 0
		}
	}

	const loadCheckRecordCount = async () => {
		try {
			const res = await getCheckRecordsByDoctorId(currentUser.value.id)
			checkRecordCount.value = (res.data || []).length
		} catch (error) {
			console.error('加载体检记录数量失败：', error)
			checkRecordCount.value = 0
		}
	}

	const loadNoticeList = async () => {
		try {
			const res = await getNoticeList()
			noticeList.value = (res.data || []).slice(0, 5)
		} catch (error) {
			console.error('加载通知失败：', error)
		}
	}

	onMounted(() => {
		loadAppointmentCount()
		loadCheckRecordCount()
		loadNoticeList()
	})
</script>

<style scoped>
	.page-container {
		min-height: 100%;
	}

	.top-bar {
		margin-bottom: 20px;
	}

	.page-title {
		margin: 0;
		font-size: 32px;
		font-weight: 700;
		color: #222;
	}

	.page-subtitle {
		margin: 8px 0 0 0;
		font-size: 14px;
		color: #909399;
	}

	.welcome-card {
		margin-bottom: 20px;
		border-radius: 12px;
	}

	.welcome-title {
		font-size: 24px;
		font-weight: 700;
		margin-bottom: 12px;
		color: #303133;
	}

	.welcome-content {
		font-size: 16px;
		color: #606266;
		line-height: 1.8;
	}

	.welcome-tip {
		margin-top: 8px;
		font-size: 14px;
		color: #909399;
	}

	.stat-row,
	.content-row {
		margin-bottom: 20px;
	}

	.stat-card {
		border-radius: 12px;
	}

	.stat-label {
		font-size: 14px;
		color: #909399;
		margin-bottom: 14px;
	}

	.stat-value {
		font-size: 32px;
		font-weight: 700;
		color: #303133;
		line-height: 1;
		margin-bottom: 10px;
	}

	.stat-desc {
		font-size: 13px;
		color: #b0b3b8;
	}

	.notice-card,
	.quick-card {
		border-radius: 12px;
		min-height: 360px;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 18px;
		font-weight: 700;
	}

	.notice-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 14px 0;
		border-bottom: 1px solid #ebeef5;
		cursor: pointer;
		gap: 16px;
		transition: all 0.2s;
	}

	.notice-item:hover {
		background: #fafafa;
		padding-left: 8px;
		padding-right: 8px;
		border-radius: 8px;
	}

	.notice-item:last-child {
		border-bottom: none;
	}

	.notice-main {
		flex: 1;
		min-width: 0;
	}

	.notice-title {
		font-size: 15px;
		font-weight: 600;
		color: #303133;
		margin-bottom: 8px;
	}

	.notice-content-preview {
		font-size: 13px;
		color: #909399;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.notice-time {
		flex-shrink: 0;
		font-size: 12px;
		color: #909399;
	}

	.quick-list {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.quick-item {
		padding: 16px;
		border: 1px solid #ebeef5;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.quick-item:hover {
		border-color: #409eff;
		transform: translateY(-2px);
		box-shadow: 0 6px 18px rgba(64, 158, 255, 0.08);
	}

	.quick-title {
		font-size: 15px;
		font-weight: 600;
		color: #303133;
		margin-bottom: 6px;
	}

	.quick-desc {
		font-size: 13px;
		color: #909399;
		line-height: 1.6;
	}
</style>