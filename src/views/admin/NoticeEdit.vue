<template>
  <div class="page-container">
    <h2 class="page-title">编辑通知</h2>

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
          <el-button type="primary" @click="handleSubmit">保存修改</el-button>
          <el-button @click="loadNoticeDetail">恢复原数据</el-button>
          <el-button @click="goBack">返回列表</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { getNoticeById, updateNotice } from '@/api/notice'

const route = useRoute()
const router = useRouter()
const formRef = ref()

const form = reactive({
  id: '',
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

const loadNoticeDetail = async () => {
  try {
    const id = route.params.id
    const res = await getNoticeById(id)
    const data = res.data || {}

    form.id = data.id || ''
    form.title = data.title || ''
    form.content = data.content || ''
    form.category = data.category || '系统通知'
    form.isTop = data.isTop ?? data.is_top ?? 0
  } catch (error) {
    console.error('获取通知详情失败：', error)
    ElMessage.error('获取通知详情失败')
  }
}

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      await updateNotice({
        ...form
      })

      ElMessage.success('修改成功')
      router.push('/admin/notice-list')
    } catch (error) {
      console.error('修改通知失败：', error)
      ElMessage.error('修改通知失败')
    }
  })
}

const goBack = () => {
  router.push('/admin/notice-list')
}

onMounted(() => {
  loadNoticeDetail()
})
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
