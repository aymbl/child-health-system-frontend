<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">体检记录查看</h2>
        <p class="page-subtitle">查看系统内全部体检记录，用于查询、分页浏览和必要协调。</p>
      </div>
    </div>

    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="儿童 ID">
          <el-input v-model="searchForm.childId" placeholder="输入儿童 ID" clearable />
        </el-form-item>

        <el-form-item label="医生 ID">
          <el-input v-model="searchForm.doctorId" placeholder="输入医生 ID" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="hover">
      <el-empty
        v-if="!loading && tableData.length === 0"
        description="暂无体检记录数据"
        :image-size="90"
      />

      <el-table
        v-else
        v-loading="loading"
        :data="pagedData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="记录 ID" width="90" align="center" />
        <el-table-column prop="childId" label="儿童 ID" width="90" align="center" />
        <el-table-column prop="childName" label="儿童姓名" width="110" align="center" />
        <el-table-column prop="doctorId" label="医生 ID" width="90" align="center" />
        <el-table-column prop="doctorName" label="医生姓名" width="110" align="center" />
        <el-table-column prop="checkDate" label="体检时间" width="170" align="center" />
        <el-table-column prop="height" label="身高(cm)" width="95" align="center" />
        <el-table-column prop="weight" label="体重(kg)" width="95" align="center" />
        <el-table-column prop="temperature" label="体温(℃)" width="95" align="center" />
        <el-table-column prop="heartRate" label="心率" width="90" align="center" />
        <el-table-column prop="bloodPressure" label="血压" width="100" align="center" />
        <el-table-column prop="result" label="体检结果" min-width="180" show-overflow-tooltip />
        <el-table-column prop="suggestion" label="处理建议" min-width="180" show-overflow-tooltip />
        <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
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
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getCheckRecordList,
  getCheckRecordsByChildId,
  getCheckRecordsByDoctorId
} from '@/api/checkRecord'

const searchForm = reactive({ childId: '', doctorId: '' })
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const tableData = ref([])

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return tableData.value.slice(start, start + pageSize.value)
})

const mapList = (list) =>
  list.map((item) => ({
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

const updateTable = (list) => {
  tableData.value = mapList(list || [])
  total.value = tableData.value.length
  currentPage.value = 1
}

const loadCheckRecordList = async () => {
  loading.value = true
  try {
    const res = await getCheckRecordList()
    updateTable(res.data)
  } catch (error) {
    console.error('获取体检记录列表失败：', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = async () => {
  loading.value = true
  try {
    if (searchForm.childId) {
      const res = await getCheckRecordsByChildId(searchForm.childId)
      updateTable(res.data)
      return
    }

    if (searchForm.doctorId) {
      const res = await getCheckRecordsByDoctorId(searchForm.doctorId)
      updateTable(res.data)
      return
    }

    await loadCheckRecordList()
  } catch (error) {
    console.error('查询体检记录失败：', error)
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  searchForm.childId = ''
  searchForm.doctorId = ''
  loadCheckRecordList()
}

onMounted(loadCheckRecordList)
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; font-size: 14px; color: #909399; }
.search-card { margin-bottom: 20px; border-radius: 12px; }
.table-card { border-radius: 12px; }
.pagination-box { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
