<template>
	<div class="page-container">
		<div class="page-header">
			<div>
				<h2 class="page-title">我的预约</h2>
				<p class="page-subtitle">查看当前家长的预约记录与状态</p>
			</div>
		</div>

		<el-card shadow="hover" class="table-card">
			<template #header>
				<div class="card-header">
					<span>预约记录</span>
					<el-tag type="primary" effect="light">共 {{ tableData.length }} 条</el-tag>
				</div>
			</template>

			<el-empty v-if="tableData.length === 0" description="暂无预约记录" :image-size="90" />

			<el-table v-else :data="tableData" border stripe style="width: 100%">
				<el-table-column type="index" label="序号" width="70" align="center" />
				<el-table-column prop="childName" label="儿童姓名" min-width="120" align="center" />
				<el-table-column prop="doctorName" label="医生姓名" min-width="120" align="center" />

				<el-table-column label="预约时间" min-width="180" align="center">
					<template #default="scope">
						{{ formatDateTime(scope.row.appointmentTime || scope.row.appointment_time) }}
					</template>
				</el-table-column>

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
		ElMessage
	} from 'element-plus'
	import {
		getAppointmentsByParentId
	} from '@/api/appointment'
	import {
		formatDateTime
	} from '@/utils/format'

	const tableData = ref([])

	const loadData = async () => {
		try {
			const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
			const res = await getAppointmentsByParentId(userInfo.id)
			tableData.value = res.data || []
		} catch (error) {
			console.error('加载预约记录失败：', error)
			ElMessage.error('加载预约记录失败')
		}
	}

	onMounted(() => {
		loadData()
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