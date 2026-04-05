<template>
	<div class="page-container">
		<h2 class="page-title">体检管理</h2>

		<el-card class="search-card">
			<el-form :inline="true" :model="searchForm">
				<el-form-item label="儿童ID">
					<el-input v-model="searchForm.childId" placeholder="请输入儿童ID" clearable />
				</el-form-item>

				<el-form-item label="医生ID">
					<el-input v-model="searchForm.doctorId" placeholder="请输入医生ID" clearable />
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="handleSearch">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card class="table-card">
			<div class="table-header">
				<el-button type="primary" @click="handleAdd">新增体检记录</el-button>
			</div>

			<div class="table-wrapper">
				<el-table :data="tableData" border style="min-width: 1700px; width: 100%">
					<el-table-column prop="id" label="记录ID" width="90" />
					<el-table-column prop="childId" label="儿童ID" width="90" />
					<el-table-column prop="childName" label="儿童姓名" width="110" />
					<el-table-column prop="doctorId" label="医生ID" width="90" />
					<el-table-column prop="doctorName" label="医生姓名" width="110" />
					<el-table-column prop="checkDate" label="体检时间" width="170" />
					<el-table-column prop="height" label="身高(cm)" width="90" />
					<el-table-column prop="weight" label="体重(kg)" width="90" />
					<el-table-column prop="temperature" label="体温(℃)" width="90" />
					<el-table-column prop="heartRate" label="心率" width="80" />
					<el-table-column prop="bloodPressure" label="血压" width="90" />
					<el-table-column prop="result" label="体检结果" min-width="160" show-overflow-tooltip />
					<el-table-column prop="suggestion" label="建议" min-width="160" show-overflow-tooltip />
					<el-table-column prop="remark" label="备注" min-width="140" show-overflow-tooltip />
					<el-table-column label="操作" width="180" fixed="right">
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
			</div>

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
		getCheckRecordList,
		getCheckRecordsByChildId,
		getCheckRecordsByDoctorId,
		deleteCheckRecordById
	} from '@/api/checkRecord'

	const router = useRouter()

	const searchForm = reactive({
		childId: '',
		doctorId: ''
	})

	const currentPage = ref(1)
	const pageSize = ref(10)
	const total = ref(0)
	const tableData = ref([])

	const loadCheckRecordList = async () => {
		try {
			const res = await getCheckRecordList()

			console.log('体检列表接口返回数据：', res)

			const list = res.data || []

			tableData.value = list.map(item => ({
				id: item.id,
				childId: item.childId || item.child_id || '',
				childName: item.childName || item.child_name || '',
				doctorId: item.doctorId || item.doctor_id || '',
				doctorName: item.doctorName || item.doctor_name || '',
				checkDate: item.checkDate || item.check_date || '',
				height: item.height || '',
				weight: item.weight || '',
				temperature: item.temperature || '',
				heartRate: item.heartRate || item.heart_rate || '',
				bloodPressure: item.bloodPressure || item.blood_pressure || '',
				result: item.result || '',
				suggestion: item.suggestion || '',
				remark: item.remark || ''
			}))

			total.value = tableData.value.length
		} catch (error) {
			console.error('获取体检列表失败：', error)
		}
	}

	const handleSearch = async () => {
		try {
			if (searchForm.childId) {
				const res = await getCheckRecordsByChildId(searchForm.childId)
				const list = res.data || []

				tableData.value = list.map(item => ({
					id: item.id,
					childId: item.childId || item.child_id || '',
					childName: item.childName || item.child_name || '',
					doctorId: item.doctorId || item.doctor_id || '',
					doctorName: item.doctorName || item.doctor_name || '',
					checkDate: item.checkDate || item.check_date || '',
					height: item.height || '',
					weight: item.weight || '',
					temperature: item.temperature || '',
					heartRate: item.heartRate || item.heart_rate || '',
					bloodPressure: item.bloodPressure || item.blood_pressure || '',
					result: item.result || '',
					suggestion: item.suggestion || '',
					remark: item.remark || ''
				}))

				total.value = tableData.value.length
				return
			}

			if (searchForm.doctorId) {
				const res = await getCheckRecordsByDoctorId(searchForm.doctorId)
				const list = res.data || []

				tableData.value = list.map(item => ({
					id: item.id,
					childId: item.childId || item.child_id || '',
					childName: item.childName || item.child_name || '',
					doctorId: item.doctorId || item.doctor_id || '',
					doctorName: item.doctorName || item.doctor_name || '',
					checkDate: item.checkDate || item.check_date || '',
					height: item.height || '',
					weight: item.weight || '',
					temperature: item.temperature || '',
					heartRate: item.heartRate || item.heart_rate || '',
					bloodPressure: item.bloodPressure || item.blood_pressure || '',
					result: item.result || '',
					suggestion: item.suggestion || '',
					remark: item.remark || ''
				}))

				total.value = tableData.value.length
				return
			}

			loadCheckRecordList()
		} catch (error) {
			console.error('查询体检记录失败：', error)
		}
	}

	const handleReset = () => {
		searchForm.childId = ''
		searchForm.doctorId = ''
		loadCheckRecordList()
	}

	const handleAdd = () => {
		router.push('/admin/check-record-add')
	}

	const handleEdit = (row) => {
		router.push(`/admin/check-record-edit/${row.id}`)
	}

	const handleDelete = (row) => {
		ElMessageBox.confirm(
			`确定要删除体检记录“${row.id}”吗？`,
			'删除确认', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}
		).then(async () => {
			await deleteCheckRecordById(row.id)
			ElMessage.success('删除成功')
			loadCheckRecordList()
		}).catch(() => {})
	}

	onMounted(() => {
		loadCheckRecordList()
	})
</script>

<style scoped>
	.page-container {
		min-height: 100%;
		min-width: 0;
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

	.table-wrapper {
		width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
	}

	.pagination-box {
		display: flex;
		justify-content: flex-end;
		margin-top: 20px;
	}
</style>