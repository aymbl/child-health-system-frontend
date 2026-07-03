<template>
  <div class="page-container">
    <section class="banner-card">
      <div class="banner-copy">
        <el-tag type="primary" effect="dark" round>随访问卷结果</el-tag>
        <h2>随访问卷结果</h2>
        <p>查看与我相关的家长随访问卷，快速了解孩子近期睡眠、食欲和健康状况。</p>
      </div>
      <img class="banner-image" src="/questionnaire-banner.png" alt="随访问卷结果横幅" />
    </section>

    <div class="page-header">
      <div>
        <h3 class="page-title">随访问卷结果</h3>
        <p class="page-subtitle">查看与我相关的家长随访问卷</p>
      </div>
    </div>

    <el-card class="table-card" shadow="hover">
      <el-empty v-if="!loading && tableData.length === 0" :image="emptyRecordsImage" :image-size="150" description="暂无与我相关的问卷结果" />
      <el-table v-else v-loading="loading" :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="childName" label="孩子姓名" min-width="120" align="center" />
        <el-table-column prop="parentName" label="家长姓名" min-width="120" align="center" />
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
          <div><strong>家长姓名：</strong>{{ detailData.parentName || '-' }}</div>
          <div><strong>提交时间：</strong>{{ detailData.submittedAt || '-' }}</div>
          <div><strong>摘要：</strong>{{ detailData.summary || '-' }}</div>
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
import { getDoctorQuestionnaires, getQuestionnaireDetail } from '@/api/questionnaire'

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
    const res = await getDoctorQuestionnaires()
    tableData.value = res.data || []
  } catch (error) {
    console.error('加载问卷结果失败：', error)
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
.banner-card { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(260px, 360px); gap: 24px; align-items: center; margin-bottom: 20px; padding: 24px 28px; border-radius: 24px; background: linear-gradient(135deg, rgba(236, 246, 255, 0.96), rgba(255, 255, 255, 0.94)); box-shadow: 0 16px 38px rgba(31, 35, 41, 0.07); }
.banner-copy h2 { margin: 12px 0 10px; font-size: 32px; color: #2f3540; }
.banner-copy p { margin: 0; color: #6b7280; line-height: 1.8; }
.banner-image { width: 100%; max-height: 210px; object-fit: contain; }
.page-header { margin-bottom: 20px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; font-size: 14px; color: #909399; }
.table-card { border-radius: 18px; }
.detail-box { display: flex; flex-direction: column; gap: 16px; }
.detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 20px; color: #606266; }
.detail-section { display: flex; flex-direction: column; gap: 8px; }
.detail-label { font-size: 13px; color: #909399; }
.detail-content { line-height: 1.8; color: #303133; background: #fafafa; border-radius: 8px; padding: 14px; white-space: pre-wrap; word-break: break-word; }
@media (max-width: 1024px) { .banner-card { grid-template-columns: 1fr; } }
</style>
