<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">体检预约总览</h2>
        <p class="page-subtitle">查看系统内全部体检预约及状态，用于后台查询、统计和必要协调。</p>
      </div>
    </div>

    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="家长 ID">
          <el-input v-model="searchForm.parentId" placeholder="请输入家长 ID" clearable />
        </el-form-item>

        <el-form-item label="儿童 ID">
          <el-input v-model="searchForm.childId" placeholder="请输入儿童 ID" clearable />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 160px">
            <el-option label="待确认" value="待确认" />
            <el-option label="已确认" value="已确认" />
            <el-option label="待就诊" value="待就诊" />
            <el-option label="已拒绝" value="已拒绝" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已取消" value="已取消" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="hover">
      <el-alert
        title="后台仅提供体检预约总览，家长申请和医生处理是主流程。"
        type="info"
        :closable="false"
        show-icon
        class="flow-tip"
      />

      <el-empty v-if="tableData.length === 0" description="暂无体检预约数据" :image-size="90" />

      <el-table v-else :data="tableData" border stripe style="width: 100%">
        <el-table-column prop="id" label="预约 ID" width="90" align="center" />
        <el-table-column prop="parentId" label="家长 ID" width="100" align="center" />
        <el-table-column prop="childId" label="儿童 ID" width="100" align="center" />
        <el-table-column prop="doctorId" label="医生 ID" width="100" align="center" />
        <el-table-column prop="appointmentTime" label="体检预约时间" width="180" align="center" />
        <el-table-column label="预约状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ row.status || '未知' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
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
import { getAppointmentList } from '@/api/appointment'

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
    console.error('获取体检预约列表失败：', error)
    ElMessage.error('获取体检预约列表失败')
  }
}

const handleSearch = () => loadAppointmentList()

const handleReset = () => {
  searchForm.parentId = ''
  searchForm.childId = ''
  searchForm.status = ''
  loadAppointmentList()
}

const getStatusTagType = status => {
  if (status === '待确认') return 'warning'
  if (status === '已确认' || status === '待就诊') return 'primary'
  if (status === '已拒绝') return 'danger'
  if (status === '已完成') return 'success'
  if (status === '已取消') return 'info'
  return 'info'
}

onMounted(loadAppointmentList)
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { margin-bottom: 20px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; color: #909399; font-size: 14px; }
.search-card { margin-bottom: 20px; border-radius: 12px; }
.table-card { margin-bottom: 20px; border-radius: 12px; }
.flow-tip { margin-bottom: 16px; }
.pagination-box { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
