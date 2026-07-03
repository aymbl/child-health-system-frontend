<template>
  <div class="page-container">
    <section class="banner-card">
      <div class="banner-copy">
        <el-tag type="success" effect="dark" round>随访问卷</el-tag>
        <h2>填写固定随访问卷</h2>
        <p>请根据孩子近期情况如实填写，提交后医生可查看与其相关的问卷结果。</p>
      </div>
      <img class="banner-image" src="/questionnaire-banner.png" alt="随访问卷横幅" />
    </section>

    <div class="page-header">
      <div>
        <h3 class="page-title">随访问卷</h3>
        <p class="page-subtitle">请根据孩子近期情况如实填写</p>
      </div>
    </div>

    <el-card class="form-card" shadow="hover">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="选择孩子" prop="childId">
          <el-select v-model="form.childId" placeholder="请选择孩子" style="width: 100%">
            <el-option v-for="child in children" :key="child.id" :label="child.name" :value="child.id" />
          </el-select>
        </el-form-item>

        <template v-for="question in questions" :key="question.key">
          <el-form-item :label="question.label" :prop="`answers.${question.key}`">
            <el-radio-group v-if="question.type === 'radio'" v-model="form.answers[question.key]">
              <el-radio v-for="option in question.options || []" :key="option" :value="option">{{ option }}</el-radio>
            </el-radio-group>
            <el-input v-else v-model="form.answers[question.key]" type="textarea" :rows="4" :placeholder="`请输入${question.label}`" />
          </el-form-item>
        </template>

        <el-form-item>
          <el-button @click="router.push('/parent/questionnaires')">返回我的问卷</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">提交问卷</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getChildrenByParentId } from '@/api/child'
import { getCurrentQuestionnaireTemplate, submitQuestionnaire } from '@/api/questionnaire'

const router = useRouter()
const formRef = ref()
const submitting = ref(false)
const children = ref([])
const template = ref(null)
const questions = ref([])
const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}')

const form = reactive({
  childId: null,
  answers: {}
})

const rules = computed(() => {
  const dynamicRules = {
    childId: [{ required: true, message: '请选择孩子', trigger: 'change' }]
  }
  for (const question of questions.value) {
    if (question.required) {
      dynamicRules[`answers.${question.key}`] = [{
        required: true,
        message: `请填写${question.label}`,
        trigger: question.type === 'radio' ? 'change' : 'blur'
      }]
    }
  }
  return dynamicRules
})

const parseQuestions = (questionsJson) => {
  if (!questionsJson) return []
  try {
    return typeof questionsJson === 'string' ? JSON.parse(questionsJson) : questionsJson
  } catch (error) {
    console.error('解析问卷题目失败：', error)
    return []
  }
}

const buildSummary = () => {
  const answers = form.answers
  const parts = []
  if (answers.sleep_quality) parts.push(`睡眠：${answers.sleep_quality}`)
  if (answers.appetite) parts.push(`食欲：${answers.appetite}`)
  if (answers.mental_status) parts.push(`精神：${answers.mental_status}`)
  return parts.length > 0 ? parts.join('，') : '已提交随访问卷'
}

const loadPageData = async () => {
  const [templateRes, childRes] = await Promise.all([
    getCurrentQuestionnaireTemplate(),
    getChildrenByParentId(currentUser.id)
  ])
  template.value = templateRes.data || null
  questions.value = parseQuestions(template.value?.questionsJson)
  children.value = childRes.data || []
  for (const question of questions.value) {
    if (!(question.key in form.answers)) form.answers[question.key] = ''
  }
}

const handleSubmit = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    await submitQuestionnaire({
      templateId: template.value.id,
      childId: form.childId,
      answersJson: JSON.stringify(form.answers),
      summary: buildSummary()
    })
    ElMessage.success('问卷提交成功')
    router.push('/parent/questionnaires')
  } catch (error) {
    console.error('提交问卷失败：', error)
  } finally {
    submitting.value = false
  }
}

onMounted(loadPageData)
</script>

<style scoped>
.page-container { min-height: 100%; padding-bottom: 24px; background: linear-gradient(180deg, rgba(241, 252, 246, 0.86), rgba(255, 255, 255, 0.98)), url('/dashboard-bg.png') center top / cover no-repeat; }
.banner-card { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(260px, 360px); gap: 24px; align-items: center; margin-bottom: 20px; padding: 24px 28px; border-radius: 8px; background: linear-gradient(135deg, rgba(236, 250, 241, 0.96), rgba(255, 255, 255, 0.94)); box-shadow: 0 12px 28px rgba(31, 35, 41, 0.07); }
.banner-copy h2 { margin: 12px 0 10px; font-size: 32px; color: #2f3540; }
.banner-copy p { margin: 0; color: #6b7280; line-height: 1.8; }
.banner-image { width: 100%; max-height: 210px; object-fit: contain; }
.page-header { margin-bottom: 18px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0; font-size: 14px; color: #909399; }
.form-card { max-width: 920px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.78); box-shadow: 0 10px 24px rgba(31, 35, 41, 0.05); }
@media (max-width: 1024px) { .banner-card { grid-template-columns: 1fr; } }
</style>
