<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">我的反馈</h2>
        <p class="page-subtitle">查看我提交的用户建议、系统反馈和医生反馈</p>
      </div>
      <el-button type="primary" @click="goAdd">新增反馈</el-button>
    </div>

    <el-card class="table-card" shadow="hover">
      <el-empty v-if="!loading && tableData.length === 0" :image="emptyFeedbackImage" :image-size="150" description="暂无我的反馈" />
      <el-table v-else v-loading="loading" :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column label="类型" width="120" align="center">
          <template #default="{ row }"><el-tag :type="typeTagType(row.type)">{{ typeLabel(row.type) }}</el-tag></template>
        </el-table-column>
        <el-table-column label="关联对象" width="140" align="center">
          <template #default="{ row }">{{ relatedTargetLabel(row) }}</template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }"><el-tag :type="statusTagType(row.status)">{{ statusLabel(row.status) }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="createdAt" label="提交时间" width="180" align="center" />
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }"><el-button type="primary" link @click="openDetail(row.id)">详情</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="反馈详情" width="760px">
      <div v-if="detailData" class="detail-box">
        <div class="detail-grid">
          <div><strong>类型：</strong>{{ typeLabel(detailData.type) }}</div>
          <div><strong>关联对象：</strong>{{ relatedTargetLabel(detailData) }}</div>
          <div><strong>状态：</strong>{{ statusLabel(detailData.status) }}</div>
          <div><strong>提交时间：</strong>{{ detailData.createdAt || '-' }}</div>
        </div>
        <div class="detail-section"><div class="detail-label">标题</div><div class="detail-content">{{ detailData.title }}</div></div>
        <div class="detail-section"><div class="detail-label">内容</div><div class="detail-content">{{ detailData.content }}</div></div>
        <div class="detail-section"><div class="detail-label">管理员回复</div><div class="detail-content">{{ detailData.replyContent || '暂无回复' }}</div></div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getFeedbackDetail, getMyFeedback } from '@/api/feedback'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const detailVisible = ref(false)
const detailData = ref(null)
const emptyFeedbackImage = '/empty-feedback.png'

const typeLabel = (type) => ({ suggestion: '用户建议', system: '系统反馈', doctor: '医生反馈' }[type] || type || '-')
const statusLabel = (status) => ({ pending: '待处理', processing: '处理中', replied: '已回复', closed: '已关闭' }[status] || status || '-')
const typeTagType = (type) => ({ suggestion: 'primary', system: 'warning', doctor: 'success' }[type] || 'info')
const statusTagType = (status) => ({ pending: 'warning', processing: 'primary', replied: 'success', closed: 'info' }[status] || 'info')

const relatedTargetLabel = (row) => {
  if (!row) return '-'
  if (row.type === 'system') return '系统'
  if (row.type === 'doctor') return row.targetDoctorName || '医生'
  return '—'
}

const loadList = async () => {
  loading.value = true
  try {
    const res = await getMyFeedback()
    tableData.value = res.data || []
  } catch (error) {
    console.error('加载我的反馈失败：', error)
  } finally {
    loading.value = false
  }
}

const openDetail = async (id) => {
  try {
    const res = await getFeedbackDetail(id)
    detailData.value = res.data || null
    detailVisible.value = true
  } catch (error) {
    console.error('加载反馈详情失败：', error)
  }
}

const goAdd = () => router.push('/parent/feedback-add')

onMounted(loadList)
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; font-size: 14px; color: #909399; }
.table-card { border-radius: 18px; }
.detail-box { display: flex; flex-direction: column; gap: 16px; }
.detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 20px; color: #606266; }
.detail-section { display: flex; flex-direction: column; gap: 8px; }
.detail-label { font-size: 13px; color: #909399; }
.detail-content { line-height: 1.8; color: #303133; background: #fafafa; border-radius: 8px; padding: 14px; white-space: pre-wrap; word-break: break-word; }
</style>
