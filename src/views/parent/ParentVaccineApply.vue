<template>
  <div class="page-container">
    <section class="apply-banner">
      <div class="banner-copy">
        <el-tag type="success" effect="dark" round>疫苗申请</el-tag>
        <h2>疫苗接种申请</h2>
        <p>选择孩子、负责医生和计划接种日期，提交后等待医生确认。</p>
      </div>
      <img class="banner-image" src="/parent-home-banner.png" alt="疫苗申请横幅" />
    </section>

    <div class="page-header">
      <div>
        <h2 class="page-title">疫苗申请</h2>
        <p class="page-subtitle">为我的孩子提交疫苗接种申请，并选择负责医生处理。</p>
      </div>
    </div>

    <div class="form-layout">
      <el-card class="form-card" shadow="hover">
        <template #header>
          <div class="form-header">
            <span>申请信息</span>
            <small>请填写疫苗名称和计划接种日期</small>
          </div>
        </template>

        <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
          <el-form-item label="选择孩子" prop="childId">
            <el-select v-model="form.childId" placeholder="请选择孩子" style="width: 100%">
              <el-option v-for="child in children" :key="child.id" :label="child.name" :value="child.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="选择医生" prop="doctorId">
            <el-select v-model="form.doctorId" placeholder="请选择负责医生" style="width: 100%" filterable>
              <el-option
                v-for="doctor in doctors"
                :key="doctor.id"
                :label="doctor.realName || doctor.username"
                :value="doctor.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="疫苗名称" prop="vaccineName">
            <el-input v-model="form.vaccineName" placeholder="请输入疫苗名称，例如乙肝疫苗、流感疫苗" />
          </el-form-item>

          <el-form-item label="计划日期" prop="scheduledDate">
            <el-date-picker
              v-model="form.scheduledDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择计划接种日期"
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="备注">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="4"
              placeholder="可填写接种需求、注意事项或其他备注"
            />
          </el-form-item>

          <el-form-item class="form-actions">
            <el-button type="primary" :loading="submitting" @click="handleApply">提交疫苗申请</el-button>
            <el-button @click="router.push('/parent/parentVaccineReminder')">返回疫苗提醒</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <aside class="side-panel">
        <div class="side-title">申请说明</div>
        <div class="side-item">
          <span class="side-index">1</span>
          <p>提交后记录进入待确认状态，负责医生会根据计划日期进行确认或拒绝。</p>
        </div>
        <div class="side-item">
          <span class="side-index">2</span>
          <p>确认后的疫苗提醒会展示在疫苗申请与提醒列表中，便于按时查看。</p>
        </div>
        <div class="side-item">
          <span class="side-index">3</span>
          <p>完成接种后，医生录入接种记录，健康档案中可查看最近接种情况。</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getChildrenByParentId } from '@/api/child'
import { getDoctorOptions } from '@/api/user'
import { applyVaccineReminder } from '@/api/vaccineReminder'

const router = useRouter()
const formRef = ref()
const submitting = ref(false)
const children = ref([])
const doctors = ref([])
const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}')

const form = reactive({
  childId: null,
  doctorId: null,
  vaccineName: '',
  scheduledDate: '',
  remark: ''
})

const rules = {
  childId: [{ required: true, message: '请选择孩子', trigger: 'change' }],
  doctorId: [{ required: true, message: '请选择负责医生', trigger: 'change' }],
  vaccineName: [{ required: true, message: '请输入疫苗名称', trigger: 'blur' }],
  scheduledDate: [{ required: true, message: '请选择计划接种日期', trigger: 'change' }]
}

const loadOptions = async () => {
  const [childRes, doctorRes] = await Promise.all([
    getChildrenByParentId(currentUser.id),
    getDoctorOptions()
  ])
  children.value = childRes.data || []
  doctors.value = doctorRes.data || []
}

const handleApply = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      await applyVaccineReminder(form)
      ElMessage.success('疫苗申请已提交，请等待医生确认')
      router.push('/parent/parentVaccineReminder')
    } catch (error) {
      ElMessage.error(error?.message || error?.response?.data?.message || '疫苗申请提交失败')
    } finally {
      submitting.value = false
    }
  })
}

onMounted(loadOptions)
</script>

<style scoped>
.page-container { min-height: 100%; }
.apply-banner { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(240px, 360px); gap: 24px; align-items: center; margin-bottom: 20px; padding: 24px 28px; border-radius: 8px; background: linear-gradient(135deg, rgba(236, 250, 241, 0.96), rgba(255, 255, 255, 0.94)); box-shadow: 0 12px 28px rgba(31, 35, 41, 0.07); }
.banner-copy h2 { margin: 12px 0 10px; font-size: 32px; color: #2f3540; }
.banner-copy p { margin: 0; color: #606977; line-height: 1.8; }
.banner-image { width: 100%; max-height: 210px; object-fit: contain; }
.page-header { margin-bottom: 20px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0 0; font-size: 14px; color: #909399; }
.form-layout { display: grid; grid-template-columns: minmax(0, 760px) minmax(240px, 320px); gap: 20px; align-items: start; }
.form-card { border-radius: 8px; }
.form-header { display: flex; justify-content: space-between; align-items: center; gap: 12px; font-size: 18px; font-weight: 700; color: #303133; }
.form-header small { font-size: 13px; font-weight: 400; color: #909399; }
.form-actions :deep(.el-form-item__content) { display: flex; gap: 12px; }
.side-panel { border-radius: 8px; padding: 18px; background: #ffffff; border: 1px solid #ebeef5; box-shadow: 0 10px 24px rgba(31, 35, 41, 0.05); }
.side-title { margin-bottom: 14px; font-size: 17px; font-weight: 700; color: #303133; }
.side-item { display: flex; gap: 12px; padding: 12px 0; border-top: 1px solid #f0f2f5; }
.side-item:first-of-type { border-top: none; padding-top: 0; }
.side-index { flex: 0 0 28px; width: 28px; height: 28px; line-height: 28px; border-radius: 8px; text-align: center; color: #1f7a4d; background: #e7f7ee; font-weight: 700; }
.side-item p { margin: 0; color: #606977; line-height: 1.7; font-size: 14px; }
@media (max-width: 1024px) {
  .apply-banner, .form-layout { grid-template-columns: 1fr; }
  .banner-image { max-height: 190px; }
}
</style>
