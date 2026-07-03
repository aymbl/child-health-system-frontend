<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">成长记录查看</h2>
        <p class="page-subtitle">查看系统内儿童成长记录，用于身高体重数据查询和档案协调。</p>
      </div>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="儿童 ID">
          <el-input v-model="searchForm.childId" placeholder="请输入儿童 ID" clearable style="width: 180px" />
        </el-form-item>

        <el-form-item label="医生 ID">
          <el-input v-model="searchForm.doctorId" placeholder="请输入医生 ID" clearable style="width: 180px" />
        </el-form-item>

        <el-form-item label="记录日期">
          <el-date-picker v-model="searchForm.recordDate" type="date" placeholder="请选择日期" value-format="YYYY-MM-DD" clearable style="width: 180px" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-empty v-if="!loading && tableData.length === 0" description="暂无成长记录数据" :image-size="90" />

      <el-table v-else :data="tableData" border stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="childId" label="儿童 ID" width="100" />
        <el-table-column prop="doctorId" label="医生 ID" width="100" />
        <el-table-column prop="recordDate" label="记录日期" width="140" />
        <el-table-column prop="height" label="身高(cm)" width="120" />
        <el-table-column prop="weight" label="体重(kg)" width="120" />
        <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="创建时间" min-width="180" />
        <el-table-column prop="updatedAt" label="更新时间" min-width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getGrowthRecordList } from '@/api/growthRecord'

const loading = ref(false)
const tableData = ref([])

const searchForm = reactive({
  childId: '',
  doctorId: '',
  recordDate: ''
})

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      childId: searchForm.childId || undefined,
      doctorId: searchForm.doctorId || undefined,
      recordDate: searchForm.recordDate || undefined
    }

    const res = await getGrowthRecordList(params)
    if (res.code === 1) {
      tableData.value = res.data || []
    } else {
      ElMessage.error(res.message || '查询失败')
    }
  } catch (error) {
    ElMessage.error('查询成长记录失败')
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchForm.childId = ''
  searchForm.doctorId = ''
  searchForm.recordDate = ''
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.page-container { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; color: #909399; font-size: 14px; }
.search-card { margin-bottom: 18px; }
</style>
