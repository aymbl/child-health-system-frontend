<template>
	<div class="page-container">
		<h2 class="page-title">通知公告管理</h2>

		<el-card class="search-card" shadow="hover">
			<el-form :inline="true" :model="searchForm">
				<el-form-item label="通知标题">
					<el-input v-model="searchForm.title" placeholder="请输入通知标题" clearable />
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="handleSearch">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card class="table-card" shadow="hover">
			<div class="table-header">
				<el-button type="primary" @click="handleAdd">新增通知</el-button>
			</div>

			<el-table :data="tableData" border stripe style="width: 100%">
				<el-table-column prop="id" label="通知ID" width="90" align="center" />
				<el-table-column prop="title" label="通知标题" min-width="180" show-overflow-tooltip />

				<el-table-column label="分类" width="120" align="center">
					<template #default="scope">
						<el-tag type="primary" effect="light">
							{{ scope.row.category || '系统通知' }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="置顶" width="90" align="center">
					<template #default="scope">
						<el-tag v-if="scope.row.isTop === 1" type="danger">置顶</el-tag>
						<el-tag v-else type="info">普通</el-tag>
					</template>
				</el-table-column>

				<el-table-column prop="content" label="通知内容" min-width="260" show-overflow-tooltip />

				<el-table-column label="发布时间" width="180" align="center">
					<template #default="scope">
						{{ formatDateTime(scope.row.createTime) }}
					</template>
				</el-table-column>

				<el-table-column label="操作" width="220" fixed="right" align="center">
					<template #default="scope">
						<el-button size="small" type="primary" @click="handleEdit(scope.row)">
							编辑
						</el-button>
						<el-button size="small" type="danger" @click="handleDelete(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<div class="pagination-box">
				<el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" background
					layout="total, prev, pager, next" :total="total" />
			</div>
		</el-card>
	</div>
</template>

<script setup>
	import {
		reactive,
		ref,
		onMounted
	} from 'vue'
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus'
	import {
		useRouter
	} from 'vue-router'
	import {
		getNoticeList,
		deleteNoticeById
	} from '@/api/notice'
	import {
		formatDateTime
	} from '@/utils/format'

	const router = useRouter()

	const searchForm = reactive({
		title: ''
	})

	const currentPage = ref(1)
	const pageSize = ref(10)
	const total = ref(0)
	const tableData = ref([])

	const loadNoticeList = async () => {
		try {
			const res = await getNoticeList({
				title: searchForm.title
			})

			const list = res.data || []

			tableData.value = list.map(item => ({
				id: item.id,
				title: item.title || '',
				content: item.content || '',
				category: item.category || '系统通知',
				isTop: item.isTop ?? item.is_top ?? 0,
				createTime: item.createTime || item.createdAt || item.created_at || ''
			}))

			total.value = tableData.value.length
		} catch (error) {
			console.error('获取通知列表失败：', error)
			ElMessage.error('获取通知列表失败')
		}
	}

	const handleSearch = () => {
		loadNoticeList()
	}

	const handleReset = () => {
		searchForm.title = ''
		loadNoticeList()
	}

	const handleAdd = () => {
		router.push('/admin/notice-add')
	}

	const handleEdit = (row) => {
		router.push(`/admin/notice-edit/${row.id}`)
	}

	const handleDelete = (row) => {
		ElMessageBox.confirm(
			`确定要删除通知“${row.title}”吗？`,
			'删除确认', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}
		).then(async () => {
			await deleteNoticeById(row.id)
			ElMessage.success('删除成功')
			loadNoticeList()
		}).catch(() => {})
	}

	onMounted(() => {
		loadNoticeList()
	})
</script>

<style scoped>
	.page-container {
		min-height: 100%;
	}

	.page-title {
		margin: 0 0 20px 0;
		font-size: 28px;
		font-weight: 700;
		color: #303133;
	}

	.search-card {
		margin-bottom: 20px;
		border-radius: 12px;
	}

	.table-card {
		margin-bottom: 20px;
		border-radius: 12px;
	}

	.table-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.pagination-box {
		display: flex;
		justify-content: flex-end;
		margin-top: 20px;
	}
</style>