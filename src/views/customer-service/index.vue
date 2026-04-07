<template>
  <div class="customer-service-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">{{ $t('customerService.title') }}</h2>
      <p class="page-desc">{{ $t('customerService.subtitle') }}</p>
    </div>

    <!-- 客服列表 -->
    <div class="service-list">
      <van-cell-group inset>
        <van-cell 
          v-for="service in serviceList" 
          :key="service.id"
          :title="service.title" 
          is-link 
          @click="handleServiceClick(service)"
        >
          <template #icon>
            <div class="service-icon">
              <img 
                v-if="service.icon" 
                :src="service.icon" 
                :alt="service.title"
                class="icon-image"
              />
              <van-icon v-else name="service-o" size="24" />
            </div>
          </template>
          <template #right-icon>
            <van-icon name="arrow" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 空状态 -->
    <van-empty 
      v-if="!loading && serviceList.length === 0" 
      :description="$t('customerService.noServices')"
      image="service-o"
    />

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="loading-center" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { $t } from '@/locales'

const router = useRouter()

// 客服列表
const serviceList = ref<any[]>([])
const loading = ref(false)

// 获取客服列表
const fetchServiceList = async () => {
  loading.value = true
  try {
    const { getServiceStatus } = await import('@/api/service')
    const res = await getServiceStatus({})
    
    // 处理接口返回的数据
    if ((res as any)?.rows && Array.isArray((res as any).rows)) {
      serviceList.value = (res as any).rows.map((service: any) => ({
        id: service.id,
        title: service.title,
        icon: service.icon,
        url: service.url,
        agent_id: service.agent_id,
        created_at: service.created_at
      }))
    } else {
      serviceList.value = []
    }
  } catch (error) {
    console.error('获取客服列表失败:', error)
    serviceList.value = []
    showToast(error.msg || $t('customerService.getServiceListFailed'))
  } finally {
    loading.value = false
  }
}

// 处理客服点击
const handleServiceClick = (service: any) => {
  if (!service.url) {
    showToast($t('customerService.linkUnavailable'))
    return
  }

  // 判断URL类型并处理
  if (service.url.startsWith('http://') || service.url.startsWith('https://')) {
    // 外部链接，直接打开
    window.open(service.url, '_blank')
  } else if (service.url.startsWith('/#')) {
    // 内部链接，在当前窗口打开
    const cleanUrl = service.url.replace('/#', '')
    window.location.href = cleanUrl
  } else {
    // 其他情况，尝试直接打开
    window.open(service.url, '_blank')
  }
}

onMounted(() => {
  fetchServiceList()
})
</script>

<style scoped>
.customer-service-page {
  padding: 16px;
  padding-bottom: 60px;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.service-list {
  margin-bottom: 24px;
}

.service-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  margin-right: 12px;
  overflow: hidden;
}

.icon-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loading-center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

:deep(.van-cell) {
  padding: 16px;
}

:deep(.van-cell__title) {
  font-weight: 500;
  font-size: 16px;
}

:deep(.van-cell__left-icon) {
  margin-right: 12px;
}
</style>
