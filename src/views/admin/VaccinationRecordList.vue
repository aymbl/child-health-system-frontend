<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">接种记录查看</h2>
        <p class="page-subtitle">查看系统内已完成接种记录，用于接种结果查询和档案协调。</p>
      </div>
    </div>

    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="儿童姓名">
          <el-input v-model="searchForm.childName" placeholder="请输入儿童姓名" clearable style="width: 180px" />
        </el-form-item>

        <el-form-item label="疫苗名称">
          <el-input v-model="searchForm.vaccineName" placeholder="请输入疫苗名称" clearable style="width: 180px" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 150px">
            <el-option label="已接种" value="已接种" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-alert
        title="接种记录表示已经完成的接种结果；待确认、已确认、已过期等流程状态请在疫苗提醒总览中查看。"
        type="info"
        :closable="false"
        show-icon
        class="flow-tip"
      />

      <el-empty v-if="tableData.length === 0" description="暂无接种记录数据" :image-size="90" />

      <el-table v-else :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="childName" label="儿童姓名" width="120" align="center" />
        <el-table-column prop="vaccineName" label="疫苗名称" min-width="160" align="center" />
        <el-table-column label="接种日期" width="130" align="center">
          <template #default="{ row }">{{ formatDate(row.vaccinationDate) }}</template>
        </el-table-column>
        <el-table-column label="下次接种日期" width="130" align="center">
          <template #default="{ row }">{{ formatDate(row.nextDueDate) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="success">{{ row.status || '已接种' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="doctorName" label="医生" width="120" align="center" />
        <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import request from '@/api/request'
import { formatDate } from '@/utils/format'

const searchForm = reactive({
  childName: '',
  vaccineName: '',
  status: ''
})

const tableData = ref([])

const loadData = async () => {
  try {
    const res = await request.get('/vaccinationRecords', { params: searchForm })
    tableData.value = res.data || []
  } catch (error) {
    console.error('加载接种记录失败：', error)
  }
}

const resetSearch = () => {
  searchForm.childName = ''
  searchForm.vaccineName = ''
  searchForm.status = ''
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.page-container { padding: 20px; }
.page-header { margin-bottom: 20px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; color: #909399; font-size: 14px; }
.search-card { margin-bottom: 20px; }
.flow-tip { margin-bottom: 16px; }
</style>
