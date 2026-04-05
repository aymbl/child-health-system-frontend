<template>
	<div class="page-container">
		<div class="page-header">
			<div>
				<h2 class="page-title">通知查看</h2>
				<p class="page-subtitle">查看系统发布的通知公告</p>
			</div>
		</div>

		<el-card shadow="hover" class="table-card">
			<template #header>
				<div class="card-header">
					<span>通知列表</span>
					<el-tag type="info" effect="light">共 {{ tableData.length }} 条</el-tag>
				</div>
			</template>

			<el-empty v-if="tableData.length === 0" description="暂无通知数据" :image-size="90" />

			<el-table v-else :data="tableData" border stripe style="width: 100%">
				<el-table-column type="index" label="序号" width="70" align="center" />
				<el-table-column prop="title" label="通知标题" min-width="220" show-overflow-tooltip />
				<el-table-column prop="publisherName" label="发布人" width="120" align="center" />
				<el-table-column prop="createdAt" label="发布时间" width="180" align="center" />

				<el-table-column label="操作" width="100" fixed="right" align="center">
					<template #default="scope">
						<el-button size="small" type="primary" @click="handleView(scope.row)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<el-dialog v-model="dialogVisible" title="通知详情" width="680px">
			<div class="detail-box">
				<div class="detail-title">{{ detail.title }}</div>
				<div class="detail-meta">
					<span>发布人：{{ detail.publisherName || '管理员' }}</span>
					<span>发布时间：{{ detail.createdAt }}</span>
				</div>
				<div class="detail-content">{{ detail.content }}</div>
			</div>

			<template #footer>
				<el-button @click="dialogVisible = false">关闭</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive,
		onMounted
	} from 'vue'
	import {
		getNoticeList,
		getNoticeById
	} from '@/api/notice'
	import {
		formatDateTime
	} from '@/utils/format'

	const tableData = ref([])
	const dialogVisible = ref(false)

	const detail = reactive({
		id: '',
		title: '',
		content: '',
		publisherName: '',
		createdAt: ''
	})

	const loadNoticeList = async () => {
		try {
			const res = await getNoticeList()
			const list = res.data || []

			tableData.value = list.map(item => ({
				id: item.id,
				title: item.title || '',
				publisherName: item.publisherName || '',
				createdAt: formatDateTime(item.createdAt || item.created_at || '')
			}))
		} catch (error) {
			console.error('获取通知列表失败：', error)
		}
	}

	const handleView = async (row) => {
		try {
			const res = await getNoticeById(row.id)
			const data = res.data || {}

			detail.id = data.id || ''
			detail.title = data.title || ''
			detail.content = data.content || ''
			detail.publisherName = data.publisherName || ''
			detail.createdAt = formatDateTime(data.createdAt || data.created_at || '')

			dialogVisible.value = true
		} catch (error) {
			console.error('获取通知详情失败：', error)
		}
	}

	onMounted(() => {
		loadNoticeList()
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

	.detail-box {
		padding: 4px 0;
	}

	.detail-title {
		font-size: 20px;
		font-weight: 700;
		color: #303133;
		margin-bottom: 12px;
	}

	.detail-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		font-size: 13px;
		color: #909399;
		margin-bottom: 16px;
	}

	.detail-content {
		line-height: 1.9;
		color: #606266;
		white-space: pre-wrap;
		word-break: break-word;
		background: #fafafa;
		padding: 16px;
		border-radius: 8px;
	}
</style>