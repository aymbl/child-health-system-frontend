<template>
	<div class="page-container">
		<div class="page-header">
			<div>
				<h2 class="page-title">通知公告</h2>
				<p class="page-subtitle">查看系统发布的最新通知信息</p>
			</div>
		</div>

		<el-card shadow="hover" class="table-card">
			<template #header>
				<div class="card-header">
					<span>通知列表</span>
					<el-tag type="info" effect="light">共 {{ noticeList.length }} 条</el-tag>
				</div>
			</template>

			<el-form :inline="true" class="search-form">
				<el-form-item label="通知标题">
					<el-input v-model="queryParams.title" placeholder="请输入通知标题" clearable style="width: 220px"
						@keyup.enter="loadNoticeList" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="loadNoticeList">查询</el-button>
					<el-button @click="resetQuery">重置</el-button>
				</el-form-item>
			</el-form>

			<el-empty v-if="!loading && noticeList.length === 0" description="暂无通知数据" :image-size="90" />

			<el-table v-else :data="noticeList" border stripe v-loading="loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="70" align="center" />
				<el-table-column prop="title" label="通知标题" min-width="220" show-overflow-tooltip />
				<el-table-column prop="content" label="通知内容" min-width="260" show-overflow-tooltip />

				<el-table-column label="发布时间" width="180" align="center">
					<template #default="scope">
						{{ formatDateTime(scope.row.created_at) }}
					</template>
				</el-table-column>

				<el-table-column label="操作" width="100" align="center">
					<template #default="scope">
						<el-button type="primary" link @click="viewDetail(scope.row)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<el-dialog v-model="dialogVisible" title="通知详情" width="680px">
			<div class="detail-box">
				<div class="detail-title">{{ currentNotice.title }}</div>
				<div class="detail-time">
					发布时间：{{ formatDateTime(currentNotice.created_at) }}
				</div>
				<div class="detail-content">{{ currentNotice.content }}</div>
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
		onMounted
	} from 'vue'
	import {
		ElMessage
	} from 'element-plus'
	import {
		getNoticeList
	} from '@/api/notice'
	import {
		formatDateTime
	} from '@/utils/format'

	const loading = ref(false)
	const dialogVisible = ref(false)

	const queryParams = ref({
		title: ''
	})

	const noticeList = ref([])
	const currentNotice = ref({})

	const loadNoticeList = async () => {
		loading.value = true
		try {
			const res = await getNoticeList({
				title: queryParams.value.title
			})
			noticeList.value = res.data || []
		} catch (error) {
			console.error('加载通知列表失败：', error)
			ElMessage.error('加载通知列表失败')
		} finally {
			loading.value = false
		}
	}

	const resetQuery = () => {
		queryParams.value.title = ''
		loadNoticeList()
	}

	const viewDetail = (row) => {
		currentNotice.value = {
			...row
		}
		dialogVisible.value = true
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

	.search-form {
		margin-bottom: 18px;
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

	.detail-time {
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