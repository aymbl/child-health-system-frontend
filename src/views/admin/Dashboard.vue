<template>
	<div class="page-container">
		<h2 class="page-title">系统首页</h2>

		<div class="card-container">
			<el-card class="data-card">
				<div class="card-title">儿童总数</div>
				<div class="card-value">{{ stats.childCount }}</div>
			</el-card>

			<el-card class="data-card">
				<div class="card-title">今日预约</div>
				<div class="card-value">{{ stats.todayAppointmentCount }}</div>
			</el-card>

			<el-card class="data-card">
				<div class="card-title">体检记录</div>
				<div class="card-value">{{ stats.checkRecordCount }}</div>
			</el-card>
		</div>

		<div class="bottom-container">
			<el-card class="bottom-card">
				<template #header>
					<div class="bottom-title">最近预约</div>
				</template>

				<el-table :data="recentAppointments" border style="width: 100%">
					<el-table-column prop="id" label="ID" width="70" />
					<el-table-column prop="childName" label="儿童姓名" width="120" />
					<el-table-column prop="doctorName" label="医生姓名" width="120" />
					<el-table-column label="预约时间" min-width="180">
						<template #default="scope">
							{{ formatDateTime(scope.row.appointmentTime) }}
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" width="100" />
				</el-table>
			</el-card>

			<el-card class="bottom-card">
				<template #header>
					<div class="bottom-title">最新通知</div>
				</template>

				<el-table :data="latestNotices" border style="width: 100%">
					<el-table-column prop="id" label="ID" width="70" />
					<el-table-column prop="title" label="通知标题" min-width="220" show-overflow-tooltip />
					<el-table-column label="发布时间" width="180">
						<template #default="scope">
							{{ formatDateTime(scope.row.createdAt) }}
						</template>
					</el-table-column>
				</el-table>
			</el-card>
		</div>
	</div>
</template>

<script setup>
	import {
		reactive,
		ref,
		onMounted
	} from 'vue'
	import {
		getDashboardStats,
		getRecentAppointments,
		getLatestNotices
	} from '@/api/dashboard'
	import {
		formatDateTime
	} from '@/utils/format'

	const stats = reactive({
		childCount: 0,
		todayAppointmentCount: 0,
		checkRecordCount: 0
	})

	const recentAppointments = ref([])
	const latestNotices = ref([])

	const loadDashboardStats = async () => {
		try {
			const res = await getDashboardStats()
			const data = res.data || {}

			stats.childCount = data.childCount || 0
			stats.todayAppointmentCount = data.todayAppointmentCount || 0
			stats.checkRecordCount = data.checkRecordCount || 0
		} catch (error) {
			console.error('获取首页统计数据失败：', error)
		}
	}

	const loadRecentAppointments = async () => {
		try {
			const res = await getRecentAppointments()
			recentAppointments.value = res.data || []
		} catch (error) {
			console.error('获取最近预约失败：', error)
		}
	}

	const loadLatestNotices = async () => {
		try {
			const res = await getLatestNotices()
			latestNotices.value = res.data || []
		} catch (error) {
			console.error('获取最新通知失败：', error)
		}
	}

	onMounted(() => {
		loadDashboardStats()
		loadRecentAppointments()
		loadLatestNotices()
	})
</script>

<style scoped>
	.page-container {
		min-height: 100%;
	}

	.page-title {
		margin: 0 0 20px 0;
	}

	.card-container {
		display: flex;
		gap: 20px;
		margin-bottom: 20px;
		flex-wrap: wrap;
	}

	.data-card {
		width: 300px;
	}

	.card-title {
		font-size: 18px;
		color: #333;
		margin-bottom: 16px;
	}

	.card-value {
		font-size: 40px;
		font-weight: bold;
		color: #222;
	}

	.bottom-container {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
	}

	.bottom-card {
		flex: 1;
		min-width: 480px;
	}

	.bottom-title {
		font-size: 18px;
		font-weight: 500;
	}
</style>