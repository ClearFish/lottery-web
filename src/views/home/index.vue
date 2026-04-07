<template>
  <div class="home-page">
    <!-- Banner轮播图 -->
     <HomerHeader/>
     <div class="banner_box">
       <van-swipe class="banner-swipe" :autoplay="3000" indicator-color="white">
         <van-swipe-item v-for="banner in banners" :key="banner.id" @click="clickSwipe(banner)">
           <div class="banner-item" :style="{ backgroundImage: `url(${banner.image})` }">
             <div class="banner-content">
               <h2 class="banner-title">{{ banner.title }}</h2>
               <p class="banner-subtitle">{{ banner.subtitle }}</p>
             </div>
           </div>
         </van-swipe-item>
       </van-swipe>
     </div>
     <div class="top_nav">
      <div class="nav_item" v-for="(item,index) in topList" :key="index" @click="toPage(item.url)">
        <img :src="item.icon" alt="">
        <p class="title">{{ item.name }}</p>
      </div>
     </div>
      <van-notice-bar left-icon="volume" :text="noticeVal" class="notice_bar" background="#ffffff" scrollable  color="#42404C">
        <template #left-icon>
          <img :src="Bell" alt="" style="width:24px"/>
        </template>
      </van-notice-bar>
     <GameHall/>
    <!-- 悬浮客服 -->
    <FloatingService />
    <!-- 手机验证弹窗（仅首次注册后弹出一次） -->
    <MobileVerify 
      v-model:show="showMobileVerify"
      @success="handleMobileVerifySuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,nextTick } from 'vue'
import { useUserStore } from '@/store/modules/user'
import {useSiteStore} from "@/store/modules/site"
import { activity,getSite } from '@/api/slide'
import FloatingService from '@/components/FloatingService/index.vue'
import HomerHeader from "./components/header.vue"
import GameHall from "./components/game-hall.vue"
import PromotionIcon from "@/assets/home/activity.gif"
import MyteamIcon from "@/assets/home/myteam.gif"
import SignIcon from "@/assets/home/sign.gif"
import ProblemIcon from "@/assets/home/commo_problem.gif"
import { useRouter,useRoute } from 'vue-router'
import { $t } from '@/locales'
import Bell from "@/assets/game/bell.png"
import MobileVerify from '@/components/MobileVerify/index.vue'

const userStore = useUserStore()
const siteStore = useSiteStore()
const router = useRouter()
const route = useRoute()

const banners = ref<any>([])
const noticeVal = ref<string>('')
const topList = ref([
  {name:$t('home.promotionTitle'),icon:PromotionIcon,url:'/promotion-activity'},
  {name:$t('home.myTeamTitle'),icon:MyteamIcon,url:'/invite?type=InviteInfo'},
  {name:$t('home.signTitle'),icon:SignIcon,url:'/sign-today'},
  {name:$t('home.helpManual'),icon:ProblemIcon,url:'/help'}
])

// 手机验证弹窗
const showMobileVerify = ref(false)
// 检查是否需要弹出手机验证（仅首次注册后弹出一次）
const checkMobileVerify = () => {
  const needVerify = localStorage.getItem('need_mobile_verify')
  if (needVerify === 'true' && userStore.isLoggedIn && userStore.userInfo && !userStore.userInfo.is_mobile) {
    showMobileVerify.value = true
    // 弹出后清除标记，后续不再弹出
    localStorage.removeItem('need_mobile_verify')
  }
}
const handleMobileVerifySuccess = () => {
  showMobileVerify.value = false
  // 刷新用户信息
  userStore.fetchUserInfo()
}

const toPage = (url:string) =>{
  router.push(url)
}
const clickSwipe = (item:any)=>{
  console.log(item,"222")
  if(item.id == 13) {
    router.push('/')
  }else {
    router.push('/promotion-activity/details?id='+item.id)
  }
}
onMounted(async () => {
  // 解析 URL 查询参数
  const urlParams = new URLSearchParams(window.location.search)
  const sharecode = urlParams.get('sharecode')
  
  if (sharecode) {
    const newUrl = `${window.location.origin}${window.location.pathname}#/auth?mode=register&invite_code=${sharecode}`
    window.location.replace(newUrl)
    return // 中断后续逻辑
  }

  // 如果用户已登录但没有用户信息，则获取用户信息
  // 注意：userStore 初始化时会自动获取用户信息，这里只需要等待即可
  if (userStore.isLoggedIn && !userStore.userInfo) {
    try {
      await userStore.fetchUserInfo()
    } catch (error) {
      console.log('获取用户信息失败:', error)
    }
  }
  // 检查是否需要弹出手机验证（仅首次注册后）
  checkMobileVerify()

  // // 使用已封装的 API 对接
  if(siteStore.banneList && siteStore.banneList.length) {
    banners.value = siteStore.banneList
  }else {
    try {
      // 轮播图（已由拦截器返回 data）
      const adv = await activity() as any
      banners.value = (adv.rows || []).map((b: any, idx: number) => ({
        title: '',
        subtitle: '',
        image: b.image,
        id:b.id
      }))
      siteStore.setBannerList(banners.value)
    } catch (_) {
      console.error(_,'获取轮播图失败')
    }
  }
  
  if(siteStore.siteInfo && siteStore.siteInfo.notice) {
    noticeVal.value = siteStore.siteInfo.notice
    console.log(siteStore.siteInfo.notice)
  }else {
    try {
      // 轮播图（已由拦截器返回 data）
      const res = await getSite() as any
      nextTick(()=>{
        noticeVal.value = res.notice
      })
      siteStore.setSiteInfo(res)
    } catch (_) {
      console.error('获取配置失败')
    }
  }
})
</script>

<style scoped lang="less">
.home-page {
  padding-bottom: 60px;
  padding-top: 60px;
}
.banner_box {
  padding: 10px;
  padding-top: 0px;
  box-sizing: border-box;
}
.banner-swipe {
  height: 140px;
  border-radius: 10px;
}

.banner-item {
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.banner-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
}

.banner-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.banner-subtitle {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}
.top_nav {
  display: flex;
  padding: 0 10px;
  box-sizing: border-box;
  .nav_item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 12px;
    img{
      width: 54px;
      height: 44px;
    }
    p {
      font-size: 10px;
      color: #7c848c;
      font-weight: 600;
    }
  }
}
</style>
