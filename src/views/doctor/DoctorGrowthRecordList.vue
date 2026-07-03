<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">我负责的成长记录</h2>
        <p class="page-subtitle">查看我负责儿童的成长变化记录</p>
      </div>
      <el-button type="primary" @click="handleAdd">新增成长记录</el-button>
    </div>

    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="儿童 ID">
          <el-input v-model="searchForm.childId" placeholder="输入儿童 ID" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item label="记录日期">
          <el-date-picker v-model="searchForm.recordDate" type="date" placeholder="选择记录日期" value-format="YYYY-MM-DD" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover" class="table-card">
      <template #header>
        <div class="card-header">
          <span>我负责的成长记录</span>
          <el-tag type="info" effect="light">共 {{ tableData.length }} 条</el-tag>
        </div>
      </template>

      <el-empty v-if="!loading && tableData.length === 0" description="暂无我负责的成长记录" :image-size="90" />

      <el-table v-else :data="tableData" border stripe v-loading="loading" style="width: 100%">
        <el-table-column prop="id" label="记录 ID" width="90" align="center" />
        <el-table-column prop="childId" label="儿童 ID" width="100" align="center" />
        <el-table-column label="记录日期" min-width="140" align="center">
          <template #default="{ row }">{{ formatDateTime(row.recordDate) || '-' }}</template>
        </el-table-column>
        <el-table-column prop="height" label="身高(cm)" width="120" align="center" />
        <el-table-column prop="weight" label="体重(kg)" width="120" align="center" />
        <el-table-column prop="remark" label="记录说明" min-width="220" show-overflow-tooltip />
        <el-table-column label="创建时间" min-width="180" align="center">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getGrowthRecordList } from '@/api/growthRecord'
import { formatDateTime } from '@/utils/format'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
const searchForm = reactive({ childId: '', recordDate: '' })

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      doctorId: userInfo.id,
      childId: searchForm.childId || undefined,
      recordDate: searchForm.recordDate || undefined
    }
    const res = await getGrowthRecordList(params)
    tableData.value = res.code === 1 ? (res.data || []) : []
    if (res.code !== 1) ElMessage.error(res.message || '查询失败')
  } catch (error) {
    console.error('查询成长记录失败：', error)
    ElMessage.error('查询成长记录失败')
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchForm.childId = ''
  searchForm.recordDate = ''
  loadData()
}

const handleAdd = () => {
  router.push('/doctor/growthRecordAdd')
}

const handleEdit = row => {
  router.push(`/doctor/growthRecordEdit/${row.id}`)
}

onMounted(loadData)
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; font-size: 14px; color: #909399; }
.search-card, .table-card { border-radius: 12px; }
.search-card { margin-bottom: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-size: 17px; font-weight: 700; }
</style>
