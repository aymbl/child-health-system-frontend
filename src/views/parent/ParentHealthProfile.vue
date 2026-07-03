<template>
  <div class="page-container">
    <section class="profile-banner">
      <div class="banner-copy">
        <el-tag type="success" round effect="dark">健康档案</el-tag>
        <h2>儿童健康档案</h2>
        <p>查看孩子的基础资料、最近体检记录、成长记录、接种记录和近期疫苗提醒。</p>
      </div>
      <img class="banner-image" src="/health-profile-banner.png" alt="健康档案横幅" />
    </section>

    <div class="page-header">
      <div>
        <h3 class="page-title">{{ childInfo?.name || '健康档案' }}</h3>
        <p class="page-subtitle">档案查看模式，仅展示当前家长可查看的孩子信息。</p>
      </div>
      <el-button @click="router.push('/parent/children')">返回我的孩子</el-button>
    </div>

    <el-row :gutter="20" class="summary-row">
      <el-col :xs="24" :sm="12" :xl="6"><el-card class="summary-card"><div class="summary-label">孩子姓名</div><div class="summary-value">{{ childInfo?.name || '暂无' }}</div></el-card></el-col>
      <el-col :xs="24" :sm="12" :xl="6"><el-card class="summary-card"><div class="summary-label">最近体检日期</div><div class="summary-value small">{{ latestCheckDate }}</div></el-card></el-col>
      <el-col :xs="24" :sm="12" :xl="6"><el-card class="summary-card"><div class="summary-label">成长记录数</div><div class="summary-value">{{ growthRecordList.length }}</div></el-card></el-col>
      <el-col :xs="24" :sm="12" :xl="6"><el-card class="summary-card"><div class="summary-label">接种记录数</div><div class="summary-value">{{ vaccinationRecordList.length }}</div></el-card></el-col>
    </el-row>

    <el-card class="section-card" v-loading="loading">
      <template #header><div class="section-title">孩子基础信息</div></template>
      <el-descriptions v-if="childInfo" :column="2" border>
        <el-descriptions-item label="姓名">{{ childInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ childInfo.gender || '-' }}</el-descriptions-item>
        <el-descriptions-item label="出生日期">{{ formatDate(childInfo.birthDate || childInfo.birth_date) || '-' }}</el-descriptions-item>
        <el-descriptions-item label="血型">{{ childInfo.bloodType || childInfo.blood_type || '-' }}</el-descriptions-item>
        <el-descriptions-item label="过敏史">{{ childInfo.allergyHistory || childInfo.allergy_history || '无' }}</el-descriptions-item>
        <el-descriptions-item label="出生身高">{{ (childInfo.birthHeight || childInfo.birth_height) ? `${childInfo.birthHeight || childInfo.birth_height} cm` : '-' }}</el-descriptions-item>
        <el-descriptions-item label="出生体重">{{ (childInfo.birthWeight || childInfo.birth_weight) ? `${childInfo.birthWeight || childInfo.birth_weight} kg` : '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注">{{ childInfo.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
      <el-empty v-else :image="emptyRecordsImage" :image-size="150" description="暂无孩子基础信息" />
    </el-card>

    <el-card class="section-card">
      <template #header><div class="section-title">最近体检记录</div></template>
      <el-empty v-if="recentCheckRecords.length === 0" :image="emptyRecordsImage" :image-size="150" description="暂无体检记录" />
      <el-table v-else :data="recentCheckRecords" border stripe style="width: 100%">
        <el-table-column label="体检日期" width="160" align="center"><template #default="{ row }">{{ formatDateTime(row.checkDate || row.check_date) }}</template></el-table-column>
        <el-table-column prop="doctorName" label="医生" width="120" align="center" />
        <el-table-column prop="height" label="身高(cm)" width="100" align="center" />
        <el-table-column prop="weight" label="体重(kg)" width="100" align="center" />
        <el-table-column prop="result" label="体检结果" min-width="180" show-overflow-tooltip />
        <el-table-column prop="suggestion" label="医生建议" min-width="220" show-overflow-tooltip />
      </el-table>
    </el-card>

    <el-card class="section-card">
      <template #header><div class="section-title">最近成长记录</div></template>
      <el-empty v-if="recentGrowthRecords.length === 0" :image="emptyRecordsImage" :image-size="150" description="暂无成长记录" />
      <el-table v-else :data="recentGrowthRecords" border stripe style="width: 100%">
        <el-table-column label="记录日期" width="160" align="center"><template #default="{ row }">{{ formatDate(row.recordDate) }}</template></el-table-column>
        <el-table-column prop="height" label="身高(cm)" width="120" align="center" />
        <el-table-column prop="weight" label="体重(kg)" width="120" align="center" />
        <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip />
      </el-table>
    </el-card>

    <el-card class="section-card">
      <template #header><div class="section-title">最近接种记录</div></template>
      <el-empty v-if="recentVaccinationRecords.length === 0" :image="emptyRecordsImage" :image-size="150" description="暂无接种记录" />
      <el-table v-else :data="recentVaccinationRecords" border stripe style="width: 100%">
        <el-table-column prop="vaccineName" label="疫苗名称" min-width="160" align="center" />
        <el-table-column label="接种日期" width="130" align="center"><template #default="{ row }">{{ formatDate(row.vaccinationDate) }}</template></el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center" />
        <el-table-column prop="doctorName" label="医生" width="120" align="center" />
        <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
      </el-table>
    </el-card>

    <el-card class="section-card">
      <template #header><div class="section-title">近期疫苗提醒</div></template>
      <el-empty v-if="recentVaccineReminders.length === 0" :image="emptyServiceImage" :image-size="150" description="暂无疫苗提醒" />
      <el-table v-else :data="recentVaccineReminders" border stripe style="width: 100%">
        <el-table-column prop="vaccineName" label="疫苗名称" min-width="160" align="center" />
        <el-table-column label="应接种日期" width="130" align="center"><template #default="{ row }">{{ formatDate(row.scheduledDate) }}</template></el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center" />
        <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getChildById } from '@/api/child'
import { getCheckRecordsByParentId } from '@/api/checkRecord'
import { getGrowthRecordByChildId } from '@/api/growthRecord'
import { getVaccinationRecordsByParentId } from '@/api/vaccinationRecord'
import { getVaccineRemindersByParentId } from '@/api/vaccineReminder'
import { formatDate, formatDateTime } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const childInfo = ref(null)
const checkRecordList = ref([])
const growthRecordList = ref([])
const vaccinationRecordList = ref([])
const vaccineReminderList = ref([])

const emptyRecordsImage = '/empty-records.png'
const emptyServiceImage = '/empty-service.png'
const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}')
const childId = Number(route.params.childId)

const sortByDateDesc = (list, field) => [...list].sort((a, b) => new Date(b[field] || 0) - new Date(a[field] || 0))

const recentCheckRecords = computed(() => sortByDateDesc(checkRecordList.value, 'checkDate').slice(0, 5))
const recentGrowthRecords = computed(() => sortByDateDesc(growthRecordList.value, 'recordDate').slice(0, 5))
const recentVaccinationRecords = computed(() => sortByDateDesc(vaccinationRecordList.value, 'vaccinationDate').slice(0, 5))
const recentVaccineReminders = computed(() => sortByDateDesc(vaccineReminderList.value, 'scheduledDate').slice(0, 5))
const latestCheckDate = computed(() => {
  const latest = recentCheckRecords.value[0]
  return latest ? formatDate(latest.checkDate || latest.check_date) : '暂无'
})

const loadData = async () => {
  loading.value = true
  try {
    const [childRes, checkRes, growthRes, vaccinationRes, reminderRes] = await Promise.all([
      getChildById(childId),
      getCheckRecordsByParentId(currentUser.id),
      getGrowthRecordByChildId(childId),
      getVaccinationRecordsByParentId(currentUser.id),
      getVaccineRemindersByParentId(currentUser.id)
    ])

    childInfo.value = childRes.data || null
    checkRecordList.value = (checkRes.data || []).filter(item => Number(item.childId || item.child_id) === childId)
    growthRecordList.value = growthRes.data || []
    vaccinationRecordList.value = (vaccinationRes.data || []).filter(item => Number(item.childId || item.child_id) === childId)
    vaccineReminderList.value = (reminderRes.data || []).filter(item => Number(item.childId || item.child_id) === childId)
  } catch (error) {
    console.error('加载健康档案失败：', error)
    ElMessage.error(error?.message || error?.response?.data?.message || '加载健康档案失败')
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.page-container { min-height: 100%; }
.profile-banner { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(260px, 380px); gap: 24px; align-items: center; margin-bottom: 20px; padding: 24px 28px; border-radius: 24px; background: linear-gradient(135deg, rgba(236, 250, 241, 0.96), rgba(255, 255, 255, 0.94)); box-shadow: 0 16px 38px rgba(31, 35, 41, 0.07); }
.banner-copy h2 { margin: 12px 0 10px; font-size: 32px; color: #2f3540; }
.banner-copy p { margin: 0; color: #6b7280; line-height: 1.8; }
.banner-image { width: 100%; max-height: 220px; object-fit: contain; }
.page-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 20px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; color: #909399; font-size: 14px; }
.summary-row { margin-bottom: 20px; }
.summary-card, .section-card { border-radius: 18px; }
.summary-label { font-size: 14px; color: #909399; margin-bottom: 10px; }
.summary-value { font-size: 26px; font-weight: 700; color: #303133; }
.summary-value.small { font-size: 18px; }
.section-card { margin-bottom: 20px; box-shadow: 0 12px 30px rgba(31, 35, 41, 0.05); }
.section-title { font-size: 18px; font-weight: 700; color: #303133; }
@media (max-width: 1024px) { .profile-banner { grid-template-columns: 1fr; } }
</style>
