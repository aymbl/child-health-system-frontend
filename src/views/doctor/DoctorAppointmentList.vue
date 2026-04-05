<template>
	<div class="page-container">
		<div class="page-header">
			<div>
				<h2 class="page-title">我的预约</h2>
				<p class="page-subtitle">查看当前医生关联的预约记录</p>
			</div>
		</div>

		<el-card shadow="hover" class="table-card">
			<template #header>
				<div class="card-header">
					<span>预约记录列表</span>
					<el-tag type="primary" effect="light">共 {{ tableData.length }} 条</el-tag>
				</div>
			</template>

			<el-empty v-if="tableData.length === 0" description="暂无预约记录" :image-size="90" />

			<el-table v-else :data="tableData" border stripe style="width: 100%">
				<el-table-column type="index" label="序号" width="70" align="center" />
				<el-table-column prop="childName" label="儿童姓名" min-width="120" align="center" />
				<el-table-column prop="parentName" label="家长姓名" min-width="120" align="center" />
				<el-table-column prop="appointmentTime" label="预约时间" min-width="180" align="center" />

				<el-table-column label="状态" width="110" align="center">
					<template #default="scope">
						<el-tag v-if="scope.row.status === '待确认'" type="warning">待确认</el-tag>
						<el-tag v-else-if="scope.row.status === '已确认'" type="primary">已确认</el-tag>
						<el-tag v-else-if="scope.row.status === '待就诊'" type="success">待就诊</el-tag>
						<el-tag v-else type="info">{{ scope.row.status || '未知' }}</el-tag>
					</template>
				</el-table-column>

				<el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip />
			</el-table>
		</el-card>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import {
		getAppointmentsByDoctorId
	} from '@/api/appointment'
	import {
		formatDateTime
	} from '@/utils/format'

	const tableData = ref([])

	const loadAppointmentList = async () => {
		try {
			const userInfoStr = localStorage.getItem('userInfo')
			const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {}

			if (!userInfo.id) return

			const res = await getAppointmentsByDoctorId(userInfo.id)
			const list = res.data || []

			tableData.value = list.map(item => ({
				id: item.id,
				childName: item.childName || '',
				parentName: item.parentName || '',
				appointmentTime: formatDateTime(item.appointmentTime || item.appointment_time || ''),
				status: item.status || '',
				remark: item.remark || ''
			}))
		} catch (error) {
			console.error('获取医生预约列表失败：', error)
		}
	}

	onMounted(() => {
		loadAppointmentList()
	})
</script>

<style scoped>
	.page-container {
		min-height: 100%;
	}

	.page-header {
		margin-bottom: 20px;
	}

	.page-title {
		margin: 0;
		font-size: 28px;
		font-weight: 700;
		color: #303133;
	}

	.page-subtitle {
		margin: 8px 0 0 0;
		font-size: 14px;
		color: #909399;
	}

	.table-card {
		border-radius: 12px;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 17px;
		font-weight: 700;
	}
</style>