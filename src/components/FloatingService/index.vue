<template>
  <div class="floating-service">
    <!-- 悬浮球 @dblclick="openIMChat" toSal  -->
    <div 
      class="floating-ball" 
      :class="{ 'active': showPopup }"
      @click="togglePopup"
      
    >
      <div class="ball-icon">
        <van-icon name="service-o" size="24" />
         <!-- <img :src="ServiceIcon" alt=""> -->
      </div>
      <!-- <div class="ball-text">
        <div class="ball-title">{{ $t('floatingService.customerService') }}</div>
        <div class="ball-subtitle">{{ $t('floatingService.online') }}</div>
      </div> -->
    </div>

    <!-- 客服弹窗 -->
    <van-popup 
      v-model:show="showPopup" 
      position="center" 
      round
      :style="{ width: '90%', maxWidth: '400px' }"
      :close-on-click-overlay="true"
    >
      <div class="service-popup">
        <!-- 弹窗头部 -->
        <div class="popup-header">
          <div class="header-avatar">
            <van-icon name="service-o" size="32" />
          </div>
          <div class="header-info">
            <h3 class="header-title">{{ $t('floatingService.serviceCenter') }}</h3>
            <p class="header-desc">{{ $t('floatingService.serviceDesc') }}</p>
          </div>
          <van-icon 
            name="cross" 
            size="20" 
            @click="closePopup"
            class="close-btn"
          />
        </div>

        <!-- 客服列表 -->
        <div class="service-list">
          <div class="service-item"  @click="toSal">
             <div class="service-icon">
              <img 
                :src="ServiceIcon"
                class="icon-image"
              />
            </div>
            <div class="service-content">
              <div class="service-title">Customer Support 24x7</div>
              <div class="service-desc">{{ $t('floatingService.clickToContact') }}</div>
            </div>
            <van-icon name="arrow" size="16" />
          </div>
          <div 
            v-for="service in serviceList" 
            :key="service.id"
            class="service-item"
            @click="handleServiceClick(service)"
          >
            <div class="service-icon">
              <img 
                v-if="service.icon" 
                :src="service.icon" 
                :alt="service.title"
                class="icon-image"
              />
              <van-icon v-else name="service-o" size="24" />
            </div>
            <div class="service-content">
              <div class="service-title">{{ service.title }}</div>
              <div class="service-desc">{{ $t('floatingService.clickToContact') }}</div>
            </div>
            <van-icon name="arrow" size="16" />
          </div>
        </div>

        <!-- 空状态 -->
        <!-- <van-empty 
          v-if="!loading && serviceList.length === 0" 
          :description="$t('floatingService.noServices')"
          image="service-o"
        /> -->

        <!-- 加载状态 -->
        <van-loading v-if="loading" class="loading-center" />
      </div>
    </van-popup>

      <!-- 聊天对话框 -->
      <ChatDialog
        :show="showChat"
        :chat-url="currentChatUrl"
        :domain="currentDomain"
        @close="closeChat"
      />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import ChatDialog from '@/components/ChatDialog/index.vue'
import { $t } from '@/locales'
import ServiceIcon from "@/assets/home/salesamrtly.png"
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const userStore = useUserStore()
// 配置开关：是否使用弹窗模式
const usePopupMode = ref(false) // false: 跳转页面, true: 弹窗模式

// 弹窗显示状态
const showPopup = ref(false)
const serviceList = ref<any[]>([])
const loading = ref(false)

// 聊天对话框状态
const showChat = ref(false)
const currentChatUrl = ref('')
const currentDomain = ref('')

const toSal = ()=>{
  ssq.push('chatOpen');
  closePopup()
}
const setUser=()=>{
  if(userStore.isLoggedIn) {
      ssq.push('setLoginInfo', {
          user_id:  userStore.userInfo.user_id, // 加密后的用户id, 必填！
          user_name:  userStore.userInfo.mobile, // 对应用户名，可在客户资料查看, 必填
          language: 'en-US', // 对应用户语言，可在客户资料查看
          phone:  userStore.userInfo.mobile, // 对应用户手机号，可在客户资料查看
          email: '', // 对应用户邮箱，可在客户资料查看
          description: '', // 对应用户的描述信息，例如套餐信息，可在客户资料查看
          label_names: ['vibbet','VIP'+ userStore.userInfo.level_info.level], // 对应用户标签，仅支持传系统已创建的标签值，可在客户资料查看
          update_label_type: 'update', // 标签传递方式 append-追加标签 update-覆盖之前的标签
          custom_fields_ext: {}, // 自定义字段，到项目设置的自定义字段中找到id和对应值进行填入（选择类型以数组形式传入），可在客户资料查看
      });
      localStorage.setItem('salesamrtlyLogin','isLogin')
  }
}
// 切换弹窗显示
const togglePopup = () => {
  showPopup.value = !showPopup.value
  if (showPopup.value && serviceList.value.length === 0) {
    fetchServiceList()
  }
  if(showPopup.value) {
    setUser()
  }
}


// 直接打开IM聊天
const openIMChat = () => {
  currentChatUrl.value = ''
  showChat.value = true
}

// 关闭弹窗
const closePopup = () => {
  showPopup.value = false
}

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
    showToast(error.msg || $t('floatingService.getServiceListFailed'))
  } finally {
    loading.value = false
  }
}

// 获取IM聊天链接（使用工具函数）
const getIMChatLinkLocal = async () => {
  const { getIMChatLink } = await import('@/utils/im-cache')
  const link = await getIMChatLink()
  return { link }
}

// 处理IM聊天逻辑
const handleIMChat = async (service: any) => {
  try {
    showToast($t('floatingService.connecting'))
    
    const res = await getIMChatLinkLocal()
    
    if (res && (res as any).link) {
      // 获取IM链接成功，直接使用聊天链接
      currentChatUrl.value = (res as any).link
      
      // 提取domain参数
      if (service.url.indexOf('domain') !== -1) {
        const urlParams = new URLSearchParams(service.url.split('?')[1])
        currentDomain.value = urlParams.get('domain') || ''
      }
      
      showChat.value = true
    } else {
      showToast($t('floatingService.getServiceLinkFailed'))
    }
  } catch (error) {
    console.error('获取IM链接失败:', error)
    showToast(error.msg || $t('floatingService.connectionFailed'))
  }
}

// 处理客服点击
const handleServiceClick = async (service: any) => {
  if (!service.url) {
    showToast($t('floatingService.serviceLinkUnavailable'))
    return
  }

  // 关闭弹窗
  closePopup()

  // 判断URL类型并处理
  if (service.url.indexOf('domain') !== -1 || service.url.indexOf('isChat') !== -1) {
    // IM聊天逻辑
    if (usePopupMode.value) {
      // 弹窗模式：获取IM链接并与service.url拼接
      await handleIMChat(service)
    } else {
      // 页面模式：跳转到聊天页面，传递参数
      // service.url格式: /#/?isChat=true&domain=vib5481062
      const hashPart = service.url.split('#')[1] // 获取 # 后面的部分
      console.log('hashPart:', hashPart)
      
      // 手动解析参数，因为URLSearchParams可能无法正确处理hash格式
      const queryString = hashPart.startsWith('/?') ? hashPart.substring(2) : hashPart
      console.log('queryString:', queryString)
      
      const params = new URLSearchParams(queryString)
      const domain = params.get('domain')
      const isChat = params.get('isChat')
      
      console.log('解析的参数 - domain:', domain, 'isChat:', isChat)
      
      // 跳转到聊天页面，传递参数
      router.push({
        name: 'Chat',
        query: {
          domain: domain,
          isChat: isChat
        }
      })
    }
  } else {
    // 外部链接处理
    const a = document.createElement('a')
    a.target = '_blank'
    a.href = service.url
    a.click()
  }
}

// 关闭聊天对话框
const closeChat = () => {
  showChat.value = false
  currentDomain.value = ''
}

// 暴露方法给父组件
defineExpose({
  togglePopup,
  openIMChat,
  closePopup
})
</script>

<style scoped>
.floating-service {
  position: fixed;
  bottom: 80px;
  right: 16px;
  z-index: 1000;
}

.floating-ball {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 25px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.floating-ball:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

.floating-ball.active {
  transform: scale(1.05);
}

.ball-icon {
  color: white;
  img {
    width: 50px;
    height: 50px;
  }
}

.ball-text {
  color: white;
  text-align: left;
}

.ball-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
}

.ball-subtitle {
  font-size: 11px;
  opacity: 0.8;
  line-height: 1.2;
}

.service-popup {
  padding: 20px;
}

.popup-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.header-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 12px;
}

.header-info {
  flex: 1;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
}

.header-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.close-btn {
  color: #999;
  cursor: pointer;
  padding: 4px;
}

.service-list {
  max-height: 300px;
  overflow-y: auto;
}

.service-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.service-item:hover {
  background-color: #f8f9fa;
}

.service-item:last-child {
  border-bottom: none;
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

.service-content {
  flex: 1;
}

.service-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.service-desc {
  font-size: 12px;
  color: #666;
}

.loading-center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

</style>
