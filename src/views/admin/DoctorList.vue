<template>
	<div class="page-container">
		<h2 class="page-title">医生管理</h2>

		<el-card class="table-card">
			<div class="table-header">
				<el-button type="primary" @click="handleAdd">新增医生</el-button>
			</div>

			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="id" label="ID" width="80" />
				<el-table-column prop="username" label="用户名" width="140" />
				<el-table-column prop="realName" label="姓名" width="120" />
				<el-table-column prop="phone" label="手机号" width="150" />
				<el-table-column prop="email" label="邮箱" min-width="180" />
				<el-table-column prop="gender" label="性别" width="80" />
				<el-table-column prop="status" label="状态" width="100">
					<template #default="scope">
						<el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
							{{ scope.row.status === 1 ? '启用' : '禁用' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180" fixed="right">
					<template #default="scope">
						<el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
						<el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
		ElMessage,
		ElMessageBox
	} from 'element-plus'
	import {
		getUserList,
		deleteUserById
	} from '@/api/user'

	const router = useRouter()
	const tableData = ref([])

	const loadDoctorList = async () => {
		try {
			const res = await getUserList('doctor')
			tableData.value = res.data || []
		} catch (error) {
			console.error('获取医生列表失败：', error)
		}
	}

	const handleAdd = () => {
		router.push('/admin/doctor-add')
	}

	const handleEdit = (row) => {
		router.push(`/admin/doctor-edit/${row.id}`)
	}

	const handleDelete = (row) => {
		ElMessageBox.confirm(
			`确定要删除医生“${row.username}”吗？`,
			'删除确认', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}
		).then(async () => {
			await deleteUserById(row.id)
			ElMessage.success('删除成功')
			loadDoctorList()
		}).catch(() => {})
	}

	onMounted(() => {
		loadDoctorList()
	})
</script>

<style scoped>
	.page-container {
		min-height: 100%;
	}

	.page-title {
		margin: 0 0 20px 0;
	}

	.table-card {
		margin-bottom: 20px;
	}

	.table-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
	}
</style>