<template>
	<div class="page-container">
		<div class="page-header">
			<div>
				<h2 class="page-title">体检记录管理</h2>
				<p class="page-subtitle">查看并维护当前医生负责的体检记录</p>
			</div>
		</div>

		<el-card shadow="hover" class="table-card">
			<template #header>
				<div class="card-header">
					<div class="header-left">
						<span>体检记录列表</span>
						<el-tag type="warning" effect="light">共 {{ tableData.length }} 条</el-tag>
					</div>
					<el-button type="primary" @click="handleAdd">新增体检记录</el-button>
				</div>
			</template>

			<el-empty v-if="tableData.length === 0" description="暂无体检记录" :image-size="90" />

			<el-table v-else :data="tableData" border stripe style="width: 100%">
				<el-table-column type="index" label="序号" width="70" align="center" />
				<el-table-column prop="childName" label="儿童姓名" min-width="120" align="center" />
				<el-table-column prop="checkDate" label="体检时间" min-width="180" align="center" />
				<el-table-column prop="height" label="身高(cm)" width="100" align="center" />
				<el-table-column prop="weight" label="体重(kg)" width="100" align="center" />
				<el-table-column prop="temperature" label="体温(℃)" width="100" align="center" />
				<el-table-column prop="heartRate" label="心率" width="90" align="center" />
				<el-table-column prop="bloodPressure" label="血压" width="100" align="center" />
				<el-table-column prop="result" label="体检结果" min-width="180" show-overflow-tooltip />
				<el-table-column prop="suggestion" label="建议" min-width="180" show-overflow-tooltip />

				<el-table-column label="操作" width="100" fixed="right" align="center">
					<template #default="scope">
						<el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
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
		useRouter
	} from 'vue-router'
	import {
		getCheckRecordsByDoctorId
	} from '@/api/checkRecord'
	import {
		formatDateTime
	} from '@/utils/format'

	const router = useRouter()
	const tableData = ref([])

	const loadCheckRecordList = async () => {
		try {
			const userInfoStr = localStorage.getItem('userInfo')
			const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {}

			if (!userInfo.id) return

			const res = await getCheckRecordsByDoctorId(userInfo.id)
			const list = res.data || []

			tableData.value = list.map(item => ({
				id: item.id,
				childName: item.childName || '',
				checkDate: formatDateTime(item.checkDate || item.check_date || ''),
				height: item.height || '',
				weight: item.weight || '',
				temperature: item.temperature || '',
				heartRate: item.heartRate || item.heart_rate || '',
				bloodPressure: item.bloodPressure || item.blood_pressure || '',
				result: item.result || '',
				suggestion: item.suggestion || ''
			}))
		} catch (error) {
			console.error('获取医生体检记录失败：', error)
		}
	}

	const handleAdd = () => {
		router.push('/doctor/check-record-add')
	}

	const handleEdit = (row) => {
		router.push(`/doctor/check-record-edit/${row.id}`)
	}

	onMounted(() => {
		loadCheckRecordList()
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
		gap: 16px;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 17px;
		font-weight: 700;
	}
</style>