<template>
	<div class="page-container">
		<h2 class="page-title">疫苗接种记录</h2>

		<el-card shadow="never">
			<el-table :data="tableData" border stripe style="width: 100%">
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="childName" label="儿童姓名" width="120" align="center" />
				<el-table-column prop="vaccineName" label="疫苗名称" min-width="160" align="center" />
				<el-table-column label="接种日期" width="130" align="center">
					<template #default="scope">
						{{ formatDate(scope.row.vaccinationDate) }}
					</template>
				</el-table-column>
				<el-table-column label="下次接种日期" width="130" align="center">
					<template #default="scope">
						{{ formatDate(scope.row.nextDueDate) }}
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" width="100" align="center">
					<template #default="scope">
						<el-tag :type="scope.row.status === '已接种' ? 'success' : 'warning'">
							{{ scope.row.status }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="doctorName" label="医生" width="120" align="center" />
				<el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
			</el-table>
		</el-card>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import request from '@/api/request'
	import {
		formatDate
	} from '@/utils/format'

	const tableData = ref([])

	const loadData = async () => {
		const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
		if (!userInfo.id) return

		const res = await request.get(`/vaccinationRecords/parent/${userInfo.id}`)
		tableData.value = res.data || []
	}

	onMounted(() => {
		loadData()
	})
</script>

<style scoped>
	.page-container {
		padding: 20px;
	}

	.page-title {
		margin-bottom: 20px;
		font-size: 22px;
		font-weight: bold;
		color: #303133;
	}
</style>