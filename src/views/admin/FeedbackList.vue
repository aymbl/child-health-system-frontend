<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">反馈管理</h2>
        <p class="page-subtitle">查看全部反馈，统一回复并跟进处理状态</p>
      </div>
    </div>

    <el-card class="search-card" shadow="hover">
      <el-form :inline="true">
        <el-form-item label="类型">
          <el-select v-model="filters.type" placeholder="全部类型" clearable style="width: 180px">
            <el-option label="用户建议" value="suggestion" />
            <el-option label="系统反馈" value="system" />
            <el-option label="医生反馈" value="doctor" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 180px">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已回复" value="replied" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadList">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="hover">
      <el-empty v-if="!loading && tableData.length === 0" :image="emptyFeedbackImage" :image-size="150" description="暂无反馈数据" />
      <el-table v-else v-loading="loading" :data="pagedData" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column label="类型" width="120" align="center">
          <template #default="{ row }"><el-tag :type="typeTagType(row.type)">{{ typeLabel(row.type) }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="userName" label="提交人" width="140" align="center" />
        <el-table-column label="关联对象" width="140" align="center">
          <template #default="{ row }">{{ relatedTargetLabel(row) }}</template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }"><el-tag :type="statusTagType(row.status)">{{ statusLabel(row.status) }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="createdAt" label="提交时间" width="180" align="center" />
        <el-table-column label="操作" width="240" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDetail(row.id)">详情</el-button>
            <el-button type="success" link @click="openReply(row)">回复</el-button>
            <el-button type="warning" link @click="openStatus(row)">改状态</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-box" v-if="tableData.length > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[10, 20, 50]"
          :total="tableData.length"
        />
      </div>
    </el-card>

    <el-dialog v-model="detailVisible" title="反馈详情" width="760px">
      <div v-if="detailData" class="detail-box">
        <div class="detail-grid">
          <div><strong>ID：</strong>{{ detailData.id }}</div>
          <div><strong>类型：</strong>{{ typeLabel(detailData.type) }}</div>
          <div><strong>提交人：</strong>{{ detailData.userName || '-' }}</div>
          <div><strong>关联对象：</strong>{{ relatedTargetLabel(detailData) }}</div>
          <div><strong>状态：</strong>{{ statusLabel(detailData.status) }}</div>
          <div><strong>提交时间：</strong>{{ detailData.createdAt || '-' }}</div>
        </div>
        <div class="detail-section"><div class="detail-label">标题</div><div class="detail-content">{{ detailData.title }}</div></div>
        <div class="detail-section"><div class="detail-label">内容</div><div class="detail-content">{{ detailData.content }}</div></div>
        <div class="detail-section"><div class="detail-label">回复</div><div class="detail-content">{{ detailData.replyContent || '暂无回复' }}</div></div>
      </div>
    </el-dialog>

    <el-dialog v-model="replyVisible" title="回复反馈" width="620px">
      <el-form label-width="80px">
        <el-form-item label="标题"><el-input :model-value="replyRow?.title || ''" disabled /></el-form-item>
        <el-form-item label="回复内容"><el-input v-model="replyForm.replyContent" type="textarea" :rows="5" maxlength="500" show-word-limit /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyVisible = false">取消</el-button>
        <el-button type="primary" :loading="replyLoading" @click="submitReply">提交回复</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="statusVisible" title="修改状态" width="420px">
      <el-form label-width="80px">
        <el-form-item label="标题"><el-input :model-value="statusRow?.title || ''" disabled /></el-form-item>
        <el-form-item label="新状态">
          <el-select v-model="statusForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已回复" value="replied" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="statusVisible = false">取消</el-button>
        <el-button type="primary" :loading="statusLoading" @click="submitStatus">保存状态</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getFeedbackDetail, getFeedbackList, replyFeedback, updateFeedbackStatus } from '@/api/feedback'

const loading = ref(false)
const tableData = ref([])
const detailVisible = ref(false)
const detailData = ref(null)
const replyVisible = ref(false)
const statusVisible = ref(false)
const replyLoading = ref(false)
const statusLoading = ref(false)
const replyRow = ref(null)
const statusRow = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const emptyFeedbackImage = '/empty-feedback.png'

const filters = reactive({ type: '', status: '' })
const replyForm = reactive({ replyContent: '' })
const statusForm = reactive({ status: '' })

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return tableData.value.slice(start, start + pageSize.value)
})

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
    const res = await getFeedbackList({ type: filters.type || undefined, status: filters.status || undefined })
    tableData.value = res.data || []
    currentPage.value = 1
  } catch (error) {
    console.error('加载反馈列表失败：', error)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.type = ''
  filters.status = ''
  loadList()
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

const openReply = (row) => {
  replyRow.value = row
  replyForm.replyContent = row.replyContent || ''
  replyVisible.value = true
}

const submitReply = async () => {
  if (!replyRow.value) return
  if (!replyForm.replyContent.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }
  replyLoading.value = true
  try {
    await replyFeedback(replyRow.value.id, { replyContent: replyForm.replyContent.trim() })
    ElMessage.success('回复成功')
    replyVisible.value = false
    loadList()
  } catch (error) {
    console.error('回复反馈失败：', error)
  } finally {
    replyLoading.value = false
  }
}

const openStatus = (row) => {
  statusRow.value = row
  statusForm.status = row.status || 'pending'
  statusVisible.value = true
}

const submitStatus = async () => {
  if (!statusRow.value || !statusForm.status) {
    ElMessage.warning('请选择状态')
    return
  }
  statusLoading.value = true
  try {
    await updateFeedbackStatus(statusRow.value.id, { status: statusForm.status })
    ElMessage.success('状态修改成功')
    statusVisible.value = false
    loadList()
  } catch (error) {
    console.error('修改反馈状态失败：', error)
  } finally {
    statusLoading.value = false
  }
}

onMounted(loadList)
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { margin-bottom: 20px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; font-size: 14px; color: #909399; }
.search-card { margin-bottom: 20px; border-radius: 18px; }
.table-card { border-radius: 18px; }
.pagination-box { display: flex; justify-content: flex-end; margin-top: 20px; }
.detail-box { display: flex; flex-direction: column; gap: 16px; }
.detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 20px; color: #606266; }
.detail-section { display: flex; flex-direction: column; gap: 8px; }
.detail-label { font-size: 13px; color: #909399; }
.detail-content { line-height: 1.8; color: #303133; background: #fafafa; border-radius: 8px; padding: 14px; white-space: pre-wrap; word-break: break-word; }
</style>
