<template>
	<div class="page-container">
		<h2 class="page-title">预约管理</h2>

		<el-card class="search-card">
			<el-form :inline="true" :model="searchForm">
				<el-form-item label="家长ID">
					<el-input v-model="searchForm.parentId" placeholder="请输入家长ID" clearable />
				</el-form-item>

				<el-form-item label="儿童ID">
					<el-input v-model="searchForm.childId" placeholder="请输入儿童ID" clearable />
				</el-form-item>

				<el-form-item label="状态">
					<el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 160px">
						<el-option label="待确认" value="待确认" />
						<el-option label="已确认" value="已确认" />
						<el-option label="待就诊" value="待就诊" />
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="handleSearch">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card class="table-card">
			<div class="table-header">
				<el-button type="primary" @click="handleAdd">新增预约</el-button>
			</div>

			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="id" label="预约ID" width="90" />
				<el-table-column prop="parentId" label="家长ID" width="100" />
				<el-table-column prop="childId" label="儿童ID" width="100" />
				<el-table-column prop="doctorId" label="医生ID" width="100" />
				<el-table-column prop="appointmentTime" label="预约时间" width="180" />
				<el-table-column prop="status" label="预约状态" width="120" />
				<el-table-column prop="remark" label="备注" min-width="180" />
				<el-table-column label="操作" width="220" fixed="right">
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
		getAppointmentList,
		deleteAppointmentById
	} from '@/api/appointment'

	const router = useRouter()

	const searchForm = reactive({
		parentId: '',
		childId: '',
		status: ''
	})

	const currentPage = ref(1)
	const pageSize = ref(10)
	const total = ref(0)
	const tableData = ref([])

	const loadAppointmentList = async () => {
		try {
			const res = await getAppointmentList({
				parentId: searchForm.parentId,
				childId: searchForm.childId,
				status: searchForm.status
			})

			console.log('预约列表接口返回数据：', res)

			const list = res.data || []

			tableData.value = list.map(item => ({
				id: item.id,
				parentId: item.parentId || item.parent_id,
				childId: item.childId || item.child_id,
				doctorId: item.doctorId || item.doctor_id,
				appointmentTime: item.appointmentTime || item.appointment_time || '',
				status: item.status || '',
				remark: item.remark || ''
			}))

			total.value = tableData.value.length
		} catch (error) {
			console.error('获取预约列表失败：', error)
		}
	}

	const handleSearch = () => {
		loadAppointmentList()
	}

	const handleReset = () => {
		searchForm.parentId = ''
		searchForm.childId = ''
		searchForm.status = ''
		loadAppointmentList()
	}

	const handleAdd = () => {
		router.push('/admin/appointment-add')
	}

	const handleEdit = (row) => {
		router.push(`/admin/appointment-edit/${row.id}`)
	}

	const handleDelete = (row) => {
		ElMessageBox.confirm(
			`确定要删除预约“${row.id}”吗？`,
			'删除确认', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}
		).then(async () => {
			await deleteAppointmentById(row.id)
			ElMessage.success('删除成功')
			loadAppointmentList()
		}).catch(() => {})
	}

	onMounted(() => {
		loadAppointmentList()
	})
</script>

<style scoped>
	.page-container {
		min-height: 100%;
	}

	.page-title {
		margin: 0 0 20px 0;
	}

	.search-card {
		margin-bottom: 20px;
	}

	.table-card {
		margin-bottom: 20px;
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