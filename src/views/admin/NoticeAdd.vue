<template>
  <div class="page-container">
    <h2 class="page-title">新增通知</h2>

    <el-card shadow="hover" class="form-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" style="max-width: 700px">
        <el-form-item label="通知标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入通知标题" />
        </el-form-item>

        <el-form-item label="通知分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择通知分类" style="width: 100%">
            <el-option label="系统通知" value="系统通知" />
            <el-option label="健康提醒" value="健康提醒" />
            <el-option label="活动公告" value="活动公告" />
          </el-select>
        </el-form-item>

        <el-form-item label="是否置顶" prop="isTop">
          <el-switch v-model="form.isTop" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <el-form-item label="通知内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入通知内容" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="goBack">返回列表</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { addNotice } from '@/api/notice'

const router = useRouter()
const formRef = ref()

const form = reactive({
  title: '',
  content: '',
  category: '系统通知',
  isTop: 0
})

const rules = {
  title: [{ required: true, message: '请输入通知标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入通知内容', trigger: 'blur' }],
  category: [{ required: true, message: '请选择通知分类', trigger: 'change' }]
}

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      await addNotice({
        ...form,
        publisherId: 1,
        status: 1
      })

      ElMessage.success('新增成功')
      router.push('/admin/notice-list')
    } catch (error) {
      console.error('新增通知失败：', error)
      ElMessage.error('新增通知失败')
    }
  })
}

const handleReset = () => {
  formRef.value.resetFields()
  form.category = '系统通知'
  form.isTop = 0
}

const goBack = () => {
  router.push('/admin/notice-list')
}
</script>

<style scoped>
.page-container {
  min-height: 100%;
}

.page-title {
  margin: 0 0 20px 0;
  font-size: 28px;
  font-weight: 700;
  color: #303133;
}

.form-card {
  border-radius: 12px;
}
</style>
