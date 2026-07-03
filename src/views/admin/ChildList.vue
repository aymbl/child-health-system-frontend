<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">儿童信息总览</h2>
        <p class="page-subtitle">查看系统内儿童基础信息，用于后台查询、档案浏览和全局协调。</p>
      </div>
    </div>

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
      <el-empty v-if="tableData.length === 0" description="暂无儿童信息数据" :image-size="90" />

      <el-table v-else :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="儿童 ID" width="90" />
        <el-table-column prop="name" label="儿童姓名" width="120" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="birthDate" label="出生日期" width="140" />
        <el-table-column prop="parentName" label="家长姓名" width="120" />
        <el-table-column prop="phone" label="联系电话" width="150" />
        <el-table-column prop="bloodType" label="血型" width="100" />
        <el-table-column prop="allergyHistory" label="过敏史" min-width="160" />
        <el-table-column label="查看" width="120" fixed="right" align="center">
          <template #default="scope">
            <el-button size="small" type="success" @click="handleHealthProfile(scope.row)">健康档案</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box" v-if="tableData.length > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          background
          layout="total, prev, pager, next"
          :total="total"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getChildList } from '@/api/child'
import { useRouter } from 'vue-router'

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
    ElMessage.error('获取儿童列表失败')
  }
}

const handleSearch = () => loadChildList()

const handleReset = () => {
  searchForm.name = ''
  searchForm.gender = ''
  loadChildList()
}

const handleHealthProfile = row => router.push(`/admin/healthProfile/${row.id}`)

onMounted(loadChildList)
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { margin-bottom: 20px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; color: #909399; font-size: 14px; }
.search-card { margin-bottom: 20px; }
.table-card { margin-bottom: 20px; }
.pagination-box { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
