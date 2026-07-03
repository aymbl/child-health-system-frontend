<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">我的孩子</h2>
        <p class="page-subtitle">查看当前家长关联的儿童信息，并进入健康档案查看详情。</p>
      </div>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增孩子
      </el-button>
    </div>

    <el-card shadow="hover" class="table-card">
      <template #header>
        <div class="card-header">
          <span>孩子信息列表</span>
          <el-tag type="success" effect="light">共 {{ tableData.length }} 条</el-tag>
        </div>
      </template>

      <el-empty v-if="tableData.length === 0" description="暂无孩子信息" :image-size="90" />

      <el-table v-else :data="tableData" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="name" label="姓名" min-width="100" align="center" />
        <el-table-column prop="gender" label="性别" width="80" align="center" />
        <el-table-column label="出生日期" min-width="140" align="center">
          <template #default="scope">{{ formatDateTime(scope.row.birthDate || scope.row.birth_date) || '-' }}</template>
        </el-table-column>
        <el-table-column label="血型" width="100" align="center">
          <template #default="scope">{{ scope.row.bloodType || scope.row.blood_type || '-' }}</template>
        </el-table-column>
        <el-table-column label="过敏史" min-width="180" show-overflow-tooltip>
          <template #default="scope">{{ scope.row.allergyHistory || scope.row.allergy_history || '无' }}</template>
        </el-table-column>
        <el-table-column label="出生身高(cm)" width="120" align="center">
          <template #default="scope">{{ scope.row.birthHeight || scope.row.birth_height || '-' }}</template>
        </el-table-column>
        <el-table-column label="出生体重(kg)" width="120" align="center">
          <template #default="scope">{{ scope.row.birthWeight || scope.row.birth_weight || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right" align="center">
          <template #default="scope">
            <el-button type="primary" link @click="handleHealthProfile(scope.row)">健康档案</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="新增孩子" width="600px" @close="resetForm">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="儿童姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入儿童姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="form.gender" placeholder="请选择性别" style="width: 100%">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker v-model="form.birthDate" type="date" placeholder="请选择出生日期" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="血型" prop="bloodType">
          <el-select v-model="form.bloodType" placeholder="请选择血型" style="width: 100%">
            <el-option label="A" value="A" />
            <el-option label="B" value="B" />
            <el-option label="AB" value="AB" />
            <el-option label="O" value="O" />
          </el-select>
        </el-form-item>
        <el-form-item label="过敏史" prop="allergyHistory">
          <el-input v-model="form.allergyHistory" placeholder="请输入过敏史，没有可填无" />
        </el-form-item>
        <el-form-item label="出生身高(cm)" prop="birthHeight">
          <el-input v-model="form.birthHeight" placeholder="请输入出生身高" type="number" />
        </el-form-item>
        <el-form-item label="出生体重(kg)" prop="birthWeight">
          <el-input v-model="form.birthWeight" placeholder="请输入出生体重" type="number" />
        </el-form-item>
        <el-form-item label="既往病史" prop="medicalHistory">
          <el-input v-model="form.medicalHistory" placeholder="请输入既往病史，没有可填无" />
        </el-form-item>
        <el-form-item label="家族病史" prop="familyHistory">
          <el-input v-model="form.familyHistory" placeholder="请输入家族病史，没有可填无" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getChildrenByParentId, addChild } from '@/api/child'
import { formatDateTime } from '@/utils/format'

const router = useRouter()
const tableData = ref([])
const dialogVisible = ref(false)
const formRef = ref()

const form = reactive({
  name: '',
  gender: '',
  birthDate: '',
  bloodType: '',
  allergyHistory: '',
  birthHeight: '',
  birthWeight: '',
  medicalHistory: '',
  familyHistory: '',
  remark: ''
})

const rules = {
  name: [{ required: true, message: '请输入儿童姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  birthDate: [{ required: true, message: '请选择出生日期', trigger: 'change' }]
}

const loadData = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
    const res = await getChildrenByParentId(userInfo.id)
    tableData.value = res.data || []
  } catch (error) {
    console.error('加载孩子信息失败：', error)
    ElMessage.error('加载孩子信息失败')
  }
}

const handleAdd = () => {
  dialogVisible.value = true
}

const handleHealthProfile = (row) => {
  router.push(`/parent/health-profile/${row.id}`)
}

const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      await addChild({ ...form, parentId: userInfo.id })
      ElMessage.success('新增成功')
      dialogVisible.value = false
      loadData()
    } catch (error) {
      console.error('新增失败：', error)
      ElMessage.error('新增失败')
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
}

onMounted(loadData)
</script>

<style scoped>
.page-container { min-height: 100%; }
.page-header { margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.page-title { margin: 0; font-size: 28px; font-weight: 700; color: #303133; }
.page-subtitle { margin: 8px 0 0 0; font-size: 14px; color: #909399; }
.table-card { border-radius: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-size: 17px; font-weight: 700; }
</style>
