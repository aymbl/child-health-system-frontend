<template>
	<div class="page-container">
		<div class="page-header">
			<div>
				<h2 class="page-title">我的孩子</h2>
				<p class="page-subtitle">查看当前家长关联的儿童信息</p>
			</div>
		</div>

		<el-card shadow="hover" class="table-card">
			<template #header>
				<div class="card-header">
					<span>孩子信息列表</span>
					<el-tag type="success" effect="light">共 {{ tableData.length }} 条</el-tag>
				</div>
			</template>

			<el-empty v-if="tableData.length === 0" description="暂无孩子信息" :image-size="90" />

			<el-table v-else :data="tableData" border stripe style="width: 100%">
				<el-table-column type="index" label="序号" width="70" align="center" />
				<el-table-column prop="name" label="姓名" min-width="100" align="center" />
				<el-table-column prop="gender" label="性别" width="80" align="center" />

				<el-table-column label="出生日期" min-width="140" align="center">
					<template #default="scope">
						{{ formatDateTime(scope.row.birthDate || scope.row.birth_date) || '-' }}
					</template>
				</el-table-column>

				<el-table-column label="血型" width="100" align="center">
					<template #default="scope">
						{{ scope.row.bloodType || scope.row.blood_type || '-' }}
					</template>
				</el-table-column>

				<el-table-column label="过敏史" min-width="180" show-overflow-tooltip>
					<template #default="scope">
						{{ scope.row.allergyHistory || scope.row.allergy_history || '无' }}
					</template>
				</el-table-column>

				<el-table-column label="出生身高(cm)" width="120" align="center">
					<template #default="scope">
						{{ scope.row.birthHeight || scope.row.birth_height || '-' }}
					</template>
				</el-table-column>

				<el-table-column label="出生体重(kg)" width="120" align="center">
					<template #default="scope">
						{{ scope.row.birthWeight || scope.row.birth_weight || '-' }}
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
		ElMessage
	} from 'element-plus'
	import {
		getChildrenByParentId
	} from '@/api/child'
	import {
		formatDateTime
	} from '@/utils/format'

	const tableData = ref([])

	const loadData = async () => {
		try {
			const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
			const res = await getChildrenByParentId(userInfo.id)
			tableData.value = res.data || []
		} catch (error) {
			console.error('加载孩子信息失败：', error)
			ElMessage.error('加载孩子信息失败')
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