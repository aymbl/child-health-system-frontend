<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">我的问卷</h2>
        <p class="page-subtitle">查看我提交过的儿童健康随访问卷</p>
      </div>
      <el-button type="primary" @click="router.push('/parent/questionnaire-add')">填写问卷</el-button>
    </div>

    <el-card class="table-card" shadow="hover">
      <el-empty v-if="!loading && tableData.length === 0" :image="emptyRecordsImage" :image-size="150" description="暂无问卷记录" />
      <el-table v-else v-loading="loading" :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="childName" label="孩子姓名" min-width="120" align="center" />
        <el-table-column prop="submittedAt" label="提交时间" min-width="180" align="center" />
        <el-table-column prop="summary" label="摘要" min-width="260" show-overflow-tooltip />
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }"><el-button type="primary" link @click="openDetail(row.id)">详情</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="问卷详情" width="760px">
      <div v-if="detailData" class="detail-box">
        <div class="detail-grid">
          <div><strong>孩子姓名：</strong>{{ detailData.childName || '-' }}</div>
          <div><strong>提交时间：</strong>{{ detailData.submittedAt || '-' }}</div>
        </div>
        <div v-for="item in detailAnswers" :key="item.key" class="detail-section">
          <div class="detail-label">{{ item.label }}</div>
          <div class="detail-content">{{ item.answer || '未填写' }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getMyQuestionnaires, getQuestionnaireDetail } from '@/api/questionnaire'

const router = useRouter()
const loading = ref(false)
const tableData = ref([])
const detailVisible = ref(false)
const detailData = ref(null)
const emptyRecordsImage = '/empty-records.png'

const questionMeta = {
  sleep_quality: '最近一周孩子睡眠情况如何？',
  appetite: '最近食欲如何？',
  mental_status: '最近精神状态如何？',
  recent_discomfort: '最近是否有发热、咳嗽、腹泻等不适？',
  daily_adjustment: '是否按医生建议进行饮食或作息调整？',
  parent_remark: '家长是否还有其他需要补充说明的情况？'
}

const detailAnswers = computed(() => {
  if (!detailData.value?.answersJson) return []
  try {
    const answers = typeof detailData.value.answersJson === 'string' ? JSON.parse(detailData.value.answersJson) : detailData.value.answersJson
    return Object.keys(questionMeta).map((key) => ({ key, label: questionMeta[key], answer: answers?.[key] || '' }))
  } catch (error) {
    console.error('解析问卷答案失败：', error)
    return []
  }
})

const loadList = async () => {
  loading.value = true
  try {
    const res = await getMyQuestionnaires()
    tableData.value = res.data || []
  } catch (error) {
    console.error('加载我的问卷失败：', error)
  } finally {
    loading.value = false
  }
}

const openDetail = async (id) => {
  try {
    const res = await getQuestionnaireDetail(id)
    detailData.value = res.data || null
    detailVisible.value = true
  } catch (error) {
    console.error('加载问卷详情失败：', error)
  }
}

onMounted(loadList)
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; gap: 12px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; font-size: 14px; color: #909399; }
.table-card { border-radius: 18px; }
.detail-box { display: flex; flex-direction: column; gap: 16px; }
.detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 20px; color: #606266; }
.detail-section { display: flex; flex-direction: column; gap: 8px; }
.detail-label { font-size: 13px; color: #909399; }
.detail-content { line-height: 1.8; color: #303133; background: #fafafa; border-radius: 8px; padding: 14px; white-space: pre-wrap; word-break: break-word; }
</style>
