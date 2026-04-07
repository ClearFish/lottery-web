<template>
    <div class="header_box">
        <div class="left">
            <img :src="headerLogo" alt="" class="logo">
        </div>
        <div class="right">
            <div class="finance_info" v-if="userStore.isLoggedIn && userStore.userInfo">
                <div class="card-icon">
                    <img :src="WalletIcon"/>
                </div>
                <div class="card-value">₫{{ userStore.balance }}</div>
                <div class="refresh-btn" @click="refreshBalance" :class="{ 'refreshing': isRefreshing }">
                    <van-icon name="replay" size="16" />
                </div>
            </div>
            <div class="login_info" v-else>
                <div class="rigster" @click="toAuth('register')">{{ $t('auth.register') }}</div>
                <div class="login" @click="toAuth('login')">{{ $t('auth.login') }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import headerLogo from "@/assets/header_logo.png"
import { showToast } from 'vant'
import { $t } from '@/locales'
import { useRouter } from 'vue-router'
import WalletIcon from "@/assets/profile/wallet.svg"
const router = useRouter()
const userStore = useUserStore()
const isRefreshing = ref<boolean>(false)
const refreshBalance = async()=>{
    if (isRefreshing.value) return
  
  try {
    isRefreshing.value = true
    showToast($t('profile.refreshingBalance'))
    
    await userStore.fetchUserInfo()
    showToast($t('profile.balanceUpdated'))
  } catch (error) {
    console.error('刷新余额失败:', error)
    showToast(error.msg || $t('profile.refreshFailed'))
  } finally {
    isRefreshing.value = false
  }
}
const toAuth = async(type:string)=>{
    // type(0:注册 1:登录)
    router.push({ path: "/auth",query:{mode:type} })
}
</script>
<style lang="less" scoped>
.header_box {
    height: 50px;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 0 9px 0 rgba(66, 100, 241, .2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top:0;
    left: 0;
    z-index: 99;
    .left {
        .logo {
            height: 30px;
            width: auto;
        }
    }
    .right {
        .finance_info {
            display: flex;
            gap: 6px;
            align-items: center;
            .card-icon{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                img {
                    width: 16px;
                    height: 16px;
                }
            }
            .card-value{
                font-size: 18px;
                font-weight: 700;
                color: #10b981;
                text-shadow: 0 1px 2px rgba(16, 185, 129, 0.1);
            }
            .refresh-btn {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: #f1f5f9;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #64748b;
            }
            .refresh-btn.refreshing {
                animation: spin 1s linear infinite;
                background: #3b82f6;
                color: #fff;
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        }
        .login_info {
            display: flex;
            align-items: center;
            gap: 6px;
            .rigster {
                padding: 10px;
                color: #a5a7b2;
                font-size: 14px;
                font-weight: 500;
            }
            .login {
                padding:4px 10px;
                color: #fff;
                font-size: 14px;
                font-weight: 500;
                background: #1989fa;
                border-radius: 40px;
            }
        }
    }
}
</style>