<template>
	<div class="page-container">
		<h2 class="page-title">儿童信息管理</h2>

		<el-card class="search-card">
			<el-form :inline="true" :model="searchForm">
				<el-form-item label="儿童姓名">
					<el-input v-model="searchForm.name" placeholder="请输入儿童姓名" clearable />
				</el-form-item>

				<el-form-item label="性别">
					<el-select v-model="searchForm.gender" placeholder="请选择性别" clearable style="width: 150px">
						<el-option label="男" value="男" />
						<el-option label="女" value="女" />
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
				<el-button type="primary" @click="handleAdd">新增儿童</el-button>
			</div>

			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="id" label="儿童ID" width="80" />
				<el-table-column prop="name" label="儿童姓名" width="120" />
				<el-table-column prop="gender" label="性别" width="80" />
				<el-table-column prop="birthDate" label="出生日期" width="140" />
				<el-table-column prop="parentName" label="家长姓名" width="120" />
				<el-table-column prop="phone" label="联系电话" width="150" />
				<el-table-column prop="bloodType" label="血型" width="100" />
				<el-table-column prop="allergyHistory" label="过敏史" min-width="160" />

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
		getChildList,
		deleteChildById
	} from '@/api/child'
	import {
		useRouter
	} from 'vue-router'

	const router = useRouter()

	const searchForm = reactive({
		name: '',
		gender: ''
	})

	const currentPage = ref(1)
	const pageSize = ref(10)
	const total = ref(0)
	const tableData = ref([])

	const loadChildList = async () => {
		try {
			const res = await getChildList({
				name: searchForm.name,
				gender: searchForm.gender
			})

			console.log('儿童列表接口返回数据：', res)

			const list = res.data || []

			tableData.value = list.map(item => ({
				id: item.id,
				name: item.name,
				gender: item.gender,
				birthDate: item.birthDate || item.birth_date,
				parentName: item.parentName || item.parent_name || '',
				phone: item.phone || '',
				bloodType: item.bloodType || item.blood_type,
				allergyHistory: item.allergyHistory || item.allergy_history
			}))

			total.value = tableData.value.length
		} catch (error) {
			console.error('获取儿童列表失败：', error)
		}
	}

	const handleSearch = () => {
		loadChildList()
	}

	const handleReset = () => {
		searchForm.name = ''
		searchForm.gender = ''
		loadChildList()
	}

	const handleAdd = () => {
		router.push('/admin/child-add')
	}

	const handleEdit = (row) => {
		router.push(`/admin/child-edit/${row.id}`)
	}

	const handleDelete = (row) => {
		ElMessageBox.confirm(
			`确定要删除儿童“${row.name}”吗？`,
			'删除确认', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}
		).then(async () => {
			await deleteChildById(row.id)
			ElMessage.success('删除成功')
			loadChildList()
		}).catch(() => {})
	}

	onMounted(() => {
		loadChildList()
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