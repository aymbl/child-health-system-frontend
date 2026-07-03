<template>
	<div class="page-container">
		<div class="page-header">
			<div>
				<h2 class="page-title">儿童健康档案</h2>
				<p class="page-subtitle">查看儿童基础信息、体检记录、成长记录与趋势图</p>
			</div>
			<el-button @click="goBack">返回</el-button>
		</div>

		<!-- 顶部概览卡片 -->
		<div class="summary-grid">
			<el-card class="summary-card">
				<div class="summary-label">儿童姓名</div>
				<div class="summary-value">{{ childInfo?.name || '暂无' }}</div>
			</el-card>

			<el-card class="summary-card">
				<div class="summary-label">体检记录数</div>
				<div class="summary-value">{{ checkRecordList.length }}</div>
			</el-card>

			<el-card class="summary-card">
				<div class="summary-label">成长记录数</div>
				<div class="summary-value">{{ growthRecordList.length }}</div>
			</el-card>

			<el-card class="summary-card">
				<div class="summary-label">最近体检日期</div>
				<div class="summary-value small-text">{{ latestCheckDate }}</div>
			</el-card>
		</div>

		<!-- 儿童基础信息 -->
		<el-card class="section-card" v-loading="loadingChild">
			<template #header>
				<div class="card-header">儿童基础信息</div>
			</template>

			<el-descriptions v-if="childInfo" :column="2" border class="desc-box">
				<el-descriptions-item label="儿童ID">{{ childInfo.id }}</el-descriptions-item>
				<el-descriptions-item label="姓名">{{ childInfo.name }}</el-descriptions-item>

				<el-descriptions-item label="性别">{{ childInfo.gender }}</el-descriptions-item>
				<el-descriptions-item label="出生日期">
					{{ formatDateTime(childInfo.birthDate || childInfo.birth_date) || '暂无' }}
				</el-descriptions-item>

				<el-descriptions-item label="家长ID">
					{{ childInfo.parentId || childInfo.parent_id || '暂无' }}
				</el-descriptions-item>
				<el-descriptions-item label="血型">
					{{ childInfo.bloodType || childInfo.blood_type || '暂无' }}
				</el-descriptions-item>

				<el-descriptions-item label="过敏史">
					{{ childInfo.allergyHistory || childInfo.allergy_history || '暂无' }}
				</el-descriptions-item>
				<el-descriptions-item label="出生身高">
					{{ formatBirthHeight }}
				</el-descriptions-item>

				<el-descriptions-item label="出生体重">
					{{ formatBirthWeight }}
				</el-descriptions-item>
				<el-descriptions-item label="备注">
					{{ childInfo.remark || '暂无' }}
				</el-descriptions-item>
			</el-descriptions>

			<el-empty v-else description="暂无儿童信息" />
		</el-card>

		<!-- 最近一次体检摘要 -->
		<el-card class="section-card" v-if="latestCheckRecord">
			<template #header>
				<div class="card-header">最近一次体检摘要</div>
			</template>

			<div class="latest-box">
				<div class="latest-item">
					<span class="latest-label">体检日期</span>
					<span class="latest-value">{{ formatDateTime(latestCheckRecord.checkDate) }}</span>
				</div>
				<div class="latest-item">
					<span class="latest-label">身高</span>
					<span class="latest-value">
						{{ latestCheckRecord.height ? latestCheckRecord.height + ' cm' : '暂无' }}
					</span>
				</div>
				<div class="latest-item">
					<span class="latest-label">体重</span>
					<span class="latest-value">
						{{ latestCheckRecord.weight ? latestCheckRecord.weight + ' kg' : '暂无' }}
					</span>
				</div>
				<div class="latest-item">
					<span class="latest-label">体检结果</span>
					<span class="latest-value">{{ latestCheckRecord.result || '暂无' }}</span>
				</div>
			</div>
		</el-card>

		<!-- 体检记录 -->
		<el-card class="section-card" v-loading="loadingCheck">
			<template #header>
				<div class="card-header">体检记录</div>
			</template>

			<el-table v-if="checkRecordList.length > 0" :data="checkRecordList" border stripe class="data-table">
				<el-table-column prop="id" label="ID" width="70" />
				<el-table-column label="体检日期" width="180">
					<template #default="scope">
						{{ formatDateTime(scope.row.checkDate) || '-' }}
					</template>
				</el-table-column>
				<el-table-column prop="height" label="身高(cm)" width="110" />
				<el-table-column prop="weight" label="体重(kg)" width="110" />
				<el-table-column prop="temperature" label="体温(℃)" width="110" />
				<el-table-column prop="heartRate" label="心率" width="100" />
				<el-table-column prop="bloodPressure" label="血压" width="120" />
				<el-table-column prop="result" label="体检结果" min-width="160" />
				<el-table-column prop="suggestion" label="医生建议" min-width="240" show-overflow-tooltip />
			</el-table>

			<el-empty v-else description="暂无体检记录" />
		</el-card>

		<!-- 最近一次成长记录摘要 -->
		<el-card class="section-card" v-if="latestGrowthRecord">
			<template #header>
				<div class="card-header">最近一次成长记录摘要</div>
			</template>

			<div class="latest-box">
				<div class="latest-item">
					<span class="latest-label">记录日期</span>
					<span class="latest-value">{{ formatDateTime(latestGrowthRecord.recordDate) }}</span>
				</div>
				<div class="latest-item">
					<span class="latest-label">身高</span>
					<span class="latest-value">
						{{ latestGrowthRecord.height ? latestGrowthRecord.height + ' cm' : '暂无' }}
					</span>
				</div>
				<div class="latest-item">
					<span class="latest-label">体重</span>
					<span class="latest-value">
						{{ latestGrowthRecord.weight ? latestGrowthRecord.weight + ' kg' : '暂无' }}
					</span>
				</div>
				<div class="latest-item">
					<span class="latest-label">备注</span>
					<span class="latest-value">{{ latestGrowthRecord.remark || '暂无' }}</span>
				</div>
			</div>
		</el-card>

		<!-- 健康风险提示 -->
		<el-card class="section-card">
			<template #header>
				<div class="card-header">健康风险提示</div>
			</template>

			<div v-if="riskTips.length > 0" class="risk-tip-list">
				<el-alert v-for="(item, index) in riskTips" :key="index" :title="item" type="warning" :closable="false"
					show-icon class="risk-alert" />
			</div>

			<el-empty v-else description="当前暂无明显风险提示" />
		</el-card>

		<!-- 成长趋势图 -->
		<el-card class="section-card">
			<template #header>
				<div class="card-header">成长趋势图</div>
			</template>

			<div v-if="growthRecordList.length > 0" class="chart-wrapper">
				<div ref="heightChartRef" class="chart-box"></div>
				<div ref="weightChartRef" class="chart-box"></div>
			</div>

			<el-empty v-else description="暂无成长趋势数据" />
		</el-card>

		<!-- 成长记录 -->
		<el-card class="section-card" v-loading="loadingGrowth">
			<template #header>
				<div class="card-header">成长记录</div>
			</template>

			<el-table v-if="growthRecordList.length > 0" :data="growthRecordList" border stripe class="data-table">
				<el-table-column prop="id" label="ID" width="70" />
				<el-table-column label="记录日期" width="160">
					<template #default="scope">
						{{ formatDateTime(scope.row.recordDate) || '-' }}
					</template>
				</el-table-column>
				<el-table-column prop="height" label="身高(cm)" width="120" />
				<el-table-column prop="weight" label="体重(kg)" width="120" />
				<el-table-column prop="remark" label="备注" min-width="240" show-overflow-tooltip />
				<el-table-column label="创建时间" min-width="180">
					<template #default="scope">
						{{ formatDateTime(scope.row.createdAt) || '-' }}
					</template>
				</el-table-column>
				<el-table-column label="更新时间" min-width="180">
					<template #default="scope">
						{{ formatDateTime(scope.row.updatedAt) || '-' }}
					</template>
				</el-table-column>
			</el-table>

			<el-empty v-else description="暂无成长记录" />
		</el-card>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed,
		nextTick,
		onBeforeUnmount
	} from 'vue'
	import {
		useRoute,
		useRouter
	} from 'vue-router'
	import {
		ElMessage
	} from 'element-plus'
	import * as echarts from 'echarts'

	import {
		getChildById
	} from '@/api/child'
	import {
		getCheckRecordsByChildId
	} from '@/api/checkRecord'
	import {
		getGrowthRecordByChildId
	} from '@/api/growthRecord'
	import {
		formatDateTime
	} from '@/utils/format'

	const route = useRoute()
	const router = useRouter()

	const childInfo = ref(null)
	const checkRecordList = ref([])
	const growthRecordList = ref([])

	const loadingChild = ref(false)
	const loadingCheck = ref(false)
	const loadingGrowth = ref(false)

	const childId = route.params.childId

	const heightChartRef = ref(null)
	const weightChartRef = ref(null)

	let heightChartInstance = null
	let weightChartInstance = null

	const formatBirthHeight = computed(() => {
		const value = childInfo.value?.birthHeight || childInfo.value?.birth_height
		return value ? `${value} cm` : '暂无'
	})

	const formatBirthWeight = computed(() => {
		const value = childInfo.value?.birthWeight || childInfo.value?.birth_weight
		return value ? `${value} kg` : '暂无'
	})

	const latestCheckRecord = computed(() => {
		return checkRecordList.value.length > 0 ? checkRecordList.value[0] : null
	})

	const latestGrowthRecord = computed(() => {
		return growthRecordList.value.length > 0 ? growthRecordList.value[0] : null
	})

	const latestCheckDate = computed(() => {
		return formatDateTime(latestCheckRecord.value?.checkDate) || '暂无'
	})

	const sortedGrowthRecordList = computed(() => {
		return [...growthRecordList.value].sort((a, b) => {
			const dateA = new Date(a.recordDate).getTime()
			const dateB = new Date(b.recordDate).getTime()
			return dateA - dateB
		})
	})

	const riskTips = computed(() => {
		const tips = []

		if (childInfo.value) {
			const bloodType = childInfo.value.bloodType || childInfo.value.blood_type
			const allergyHistory = childInfo.value.allergyHistory || childInfo.value.allergy_history

			if (!bloodType) {
				tips.push('儿童血型信息尚未完善，建议补充基础健康档案。')
			}

			if (!allergyHistory) {
				tips.push('儿童过敏史信息尚未填写，建议补充过敏相关情况。')
			}
		}

		if (latestCheckRecord.value) {
			const record = latestCheckRecord.value

			if (record.temperature && Number(record.temperature) > 37.3) {
				tips.push(`最近体检体温为 ${record.temperature}℃，存在体温偏高情况，建议持续观察。`)
			}

			if (record.heartRate && (Number(record.heartRate) > 120 || Number(record.heartRate) < 60)) {
				tips.push(`最近体检心率为 ${record.heartRate}，存在异常波动风险，建议结合实际情况复查。`)
			}

			if (record.result && /异常|偏高|偏低|风险|问题/.test(record.result)) {
				tips.push('最近一次体检结果包含异常或风险提示信息，建议重点关注并复查。')
			}
		} else {
			tips.push('当前暂无体检记录，建议及时完善儿童体检数据。')
		}

		if (growthRecordList.value.length === 0) {
			tips.push('当前暂无成长记录，建议定期补充身高和体重数据。')
		} else if (growthRecordList.value.length < 2) {
			tips.push('成长记录数量较少，暂时难以形成稳定趋势，建议持续补充记录。')
		}

		if (latestGrowthRecord.value) {
			if (!latestGrowthRecord.value.height || !latestGrowthRecord.value.weight) {
				tips.push('最近一次成长记录的身高或体重数据不完整，建议补充完整。')
			}
		}

		return tips
	})

	const loadChildInfo = async () => {
		loadingChild.value = true
		try {
			const res = await getChildById(childId)
			if (res.code === 1) {
				childInfo.value = res.data
			} else {
				ElMessage.error(res.message || '查询儿童信息失败')
			}
		} catch (error) {
			ElMessage.error('查询儿童信息失败')
		} finally {
			loadingChild.value = false
		}
	}

	const loadCheckRecords = async () => {
		loadingCheck.value = true
		try {
			const res = await getCheckRecordsByChildId(childId)
			if (res.code === 1) {
				checkRecordList.value = res.data || []
			} else {
				ElMessage.error(res.message || '查询体检记录失败')
			}
		} catch (error) {
			ElMessage.error('查询体检记录失败')
		} finally {
			loadingCheck.value = false
		}
	}

	const loadGrowthRecords = async () => {
		loadingGrowth.value = true
		try {
			const res = await getGrowthRecordByChildId(childId)
			if (res.code === 1) {
				growthRecordList.value = res.data || []
				if (growthRecordList.value.length > 0) {
					await renderCharts()
				}
			} else {
				ElMessage.error(res.message || '查询成长记录失败')
			}
		} catch (error) {
			ElMessage.error('查询成长记录失败')
		} finally {
			loadingGrowth.value = false
		}
	}

	const renderHeightChart = () => {
		if (!heightChartRef.value || sortedGrowthRecordList.value.length === 0) return

		if (heightChartInstance) {
			heightChartInstance.dispose()
		}

		heightChartInstance = echarts.init(heightChartRef.value)

		const xData = sortedGrowthRecordList.value.map(item => formatDateTime(item.recordDate))
		const yData = sortedGrowthRecordList.value.map(item => item.height)

		heightChartInstance.setOption({
			title: {
				text: '身高趋势图',
				left: 'center'
			},
			tooltip: {
				trigger: 'axis'
			},
			grid: {
				left: 50,
				right: 30,
				top: 60,
				bottom: 50
			},
			xAxis: {
				type: 'category',
				data: xData,
				name: '日期'
			},
			yAxis: {
				type: 'value',
				name: '身高(cm)'
			},
			series: [{
				name: '身高',
				type: 'line',
				data: yData,
				smooth: true
			}]
		})
	}

	const renderWeightChart = () => {
		if (!weightChartRef.value || sortedGrowthRecordList.value.length === 0) return

		if (weightChartInstance) {
			weightChartInstance.dispose()
		}

		weightChartInstance = echarts.init(weightChartRef.value)

		const xData = sortedGrowthRecordList.value.map(item => formatDateTime(item.recordDate))
		const yData = sortedGrowthRecordList.value.map(item => item.weight)

		weightChartInstance.setOption({
			title: {
				text: '体重趋势图',
				left: 'center'
			},
			tooltip: {
				trigger: 'axis'
			},
			grid: {
				left: 50,
				right: 30,
				top: 60,
				bottom: 50
			},
			xAxis: {
				type: 'category',
				data: xData,
				name: '日期'
			},
			yAxis: {
				type: 'value',
				name: '体重(kg)'
			},
			series: [{
				name: '体重',
				type: 'line',
				data: yData,
				smooth: true
			}]
		})
	}

	const renderCharts = async () => {
		await nextTick()
		renderHeightChart()
		renderWeightChart()
	}

	const goBack = () => {
		router.back()
	}

	onMounted(() => {
		loadChildInfo()
		loadCheckRecords()
		loadGrowthRecords()
	})

	onBeforeUnmount(() => {
		if (heightChartInstance) {
			heightChartInstance.dispose()
			heightChartInstance = null
		}
		if (weightChartInstance) {
			weightChartInstance.dispose()
			weightChartInstance = null
		}
	})
</script>

<style scoped>
	.page-container {
		padding: 20px;
		background: #f5f7fa;
		min-height: 100%;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20px;
	}

	.page-title {
		margin: 0;
		font-size: 30px;
		font-weight: 700;
		color: #303133;
	}

	.page-subtitle {
		margin: 8px 0 0;
		font-size: 14px;
		color: #909399;
	}

	.summary-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-bottom: 20px;
	}

	.summary-card {
		border-radius: 12px;
	}

	.summary-label {
		font-size: 14px;
		color: #909399;
		margin-bottom: 10px;
	}

	.summary-value {
		font-size: 24px;
		font-weight: 700;
		color: #303133;
		word-break: break-word;
	}

	.summary-value.small-text {
		font-size: 18px;
	}

	.section-card {
		margin-bottom: 20px;
		border-radius: 12px;
	}

	.card-header {
		font-size: 18px;
		font-weight: 600;
		color: #303133;
	}

	.desc-box {
		margin-top: 6px;
	}

	.latest-box {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
	}

	.latest-item {
		background: #f8fafc;
		border: 1px solid #ebeef5;
		border-radius: 10px;
		padding: 16px;
	}

	.latest-label {
		display: block;
		font-size: 13px;
		color: #909399;
		margin-bottom: 8px;
	}

	.latest-value {
		display: block;
		font-size: 16px;
		font-weight: 600;
		color: #303133;
		line-height: 1.6;
		word-break: break-word;
	}

	.chart-wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	.chart-box {
		width: 100%;
		height: 360px;
		background: #fff;
		border-radius: 10px;
	}

	.risk-tip-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.risk-alert {
		border-radius: 10px;
	}

	.data-table {
		margin-top: 4px;
	}

	@media (max-width: 1200px) {

		.summary-grid,
		.latest-box {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 992px) {
		.chart-wrapper {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {

		.summary-grid,
		.latest-box {
			grid-template-columns: 1fr;
		}

		.page-header {
			flex-direction: column;
			gap: 12px;
		}
	}
</style>