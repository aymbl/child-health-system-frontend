<template>
	<div class="page-container">
		<div class="page-header">
			<div>
				<h2 class="page-title">体检记录</h2>
				<p class="page-subtitle">查看当前家长关联儿童的体检信息</p>
			</div>
		</div>

		<el-card shadow="hover" class="table-card">
			<template #header>
				<div class="card-header">
					<span>体检记录列表</span>
					<el-tag type="warning" effect="light">共 {{ tableData.length }} 条</el-tag>
				</div>
			</template>

			<el-empty v-if="tableData.length === 0" description="暂无体检记录" :image-size="90" />

			<div v-else class="table-wrapper">
				<el-table :data="tableData" border stripe style="width: 100%">
					<el-table-column type="index" label="序号" width="70" align="center" />
					<el-table-column prop="childName" label="儿童姓名" min-width="110" align="center" />
					<el-table-column prop="doctorName" label="医生姓名" min-width="110" align="center" />

					<el-table-column label="体检日期" min-width="160" align="center">
						<template #default="scope">
							{{ formatDateTime(scope.row.checkDate || scope.row.check_date) }}
						</template>
					</el-table-column>

					<el-table-column prop="height" label="身高(cm)" width="100" align="center" />
					<el-table-column prop="weight" label="体重(kg)" width="100" align="center" />

					<el-table-column label="心率" width="100" align="center">
						<template #default="scope">
							{{ scope.row.heartRate || scope.row.heart_rate || '-' }}
						</template>
					</el-table-column>

					<el-table-column label="血压" width="120" align="center">
						<template #default="scope">
							{{ scope.row.bloodPressure || scope.row.blood_pressure || '-' }}
						</template>
					</el-table-column>

					<el-table-column prop="result" label="体检结果" min-width="180" show-overflow-tooltip />
					<el-table-column prop="advice" label="医生建议" min-width="220" show-overflow-tooltip />
				</el-table>
			</div>
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
		getCheckRecordsByParentId
	} from '@/api/checkRecord'
	import {
		formatDateTime
	} from '@/utils/format'

	const tableData = ref([])

	const loadData = async () => {
		try {
			const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
			const res = await getCheckRecordsByParentId(userInfo.id)
			tableData.value = res.data || []
		} catch (error) {
			console.error('加载体检记录失败：', error)
			ElMessage.error('加载体检记录失败')
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

	.table-wrapper {
		overflow-x: auto;
	}
</style>