<template>
  <div class="profile-page">
    <!-- 用户信息卡片 -->
    <div class="user-card-wrapper">
      <UserCard v-if="userStore.userInfo" :user="userStore.userInfo" />
    </div>

    <!-- 账户余额 -->
    <div class="balance-section">
      <div class="balance-card">
        <div class="balance-header">
          <div class="card-icon">
             <img :src="WalletIcon" class="wallet_icon"/>
          </div>
          <div class="card-content">
            <div class="card-label">{{ $t('profile.balance') }}</div>
            <div class="card-value">₫{{ userStore.balance }}</div>
          </div>
          <div class="refresh-btn" @click="refreshBalance" :class="{ 'refreshing': isRefreshing }">
            <van-icon name="replay" size="16" />
          </div>
        </div>
        <div class="balance-actions">
          <button class="action-btn withdraw-btn" @click="gotoPage('Withdraw')">
             <img :src="GreenWallet" alt="" class="wallet_icon">
            {{ $t('profile.withdraw') }}
          </button>
          <button class="action-btn deposit-btn" @click="gotoPage('Deposit')">
            <van-icon name="add-o" size="16" />
            {{ $t('profile.deposit') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 分享推广 -->
    <div class="share-section">
      <div class="share-card">
        <div class="share-header">
          <div class="share-title">{{ $t('promotion.invite') }}</div>
          <div class="share-details" @click="gotoPage('Team')">{{ $t('profile.team') }}</div>
        </div>
        <div class="share-content">
          <div class="share-icon">
            <van-icon name="friends-o" size="24" color="#fff" />
          </div>
          <div class="share-actions">
            <button class="copy-link-btn" @click="copyInviteLink">
              {{ $t('promotion.share') }}
            </button>
            <button class="share-btn" @click="shareInviteLink">
              {{ $t('profile.share') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 收益概览 -->
    <div class="earnings-overview">
      <h3 class="section-title">{{ $t('profile.earningsOverview') }}</h3>
      <div class="earnings-cards">
        <div class="earnings-card" @click="gotoPage('Earnings')">
          <div class="card-icon">
             <img :src="VNDCoin" alt="" class="coin_icon">
          </div>
          <div class="card-content">
            <div class="card-label">{{ $t('profile.totalEarnings') }}</div>
            <div class="card-value">₫{{ userStore.totalEarnings }}</div>
          </div>
        </div>
        <div class="earnings-card" @click="gotoPage('Earnings')">
          <div class="card-icon">
            <van-icon name="star-o" size="20" color="#1890ff" />
          </div>
          <div class="card-content">
            <div class="card-label">{{ $t('profile.todayEarnings') }}</div>
            <div class="card-value">₫{{ userStore.todayEarnings }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="function-menu">
      <van-cell-group inset>
        <van-cell 
          :title="$t('profile.myTeam')" 
          icon="friends-o" 
          is-link 
          @click="gotoPage('Team')"
        />
        <van-cell 
          :title="$t('profile.earningsRecord')" 
          icon="gold-coin-o" 
          is-link 
          @click="gotoPage('Earnings')"
        >
          <template #icon>
            <img :src="EarningRecord" style="width:16px;margin-right:12px"/>
          </template>
        </van-cell>
        <van-cell 
          :title="$t('profile.withdrawManagement')" 
          icon="balance-o" 
          is-link 
          @click="gotoPage('Withdraw')"
        >
        <template #icon>
            <img :src="WithdrawReport" style="width:16px;margin-right:12px"/>
          </template>
        </van-cell>
        <van-cell 
          :title="$t('profile.withdrawRecords')" 
          icon="records-o" 
          is-link 
          @click="gotoPage('WithdrawRecords')"
        />
        <van-cell 
          :title="$t('deposit.Recordtitle')" 
          icon="records-o" 
          is-link 
          @click="gotoPage('DepositRcord')"
        >
        <template #icon>
            <img :src="DepositRecordIcon" style="width:16px;margin-right:12px"/>
          </template>
        </van-cell>
        <van-cell 
          :title="$t('home.lotreRecord')" 
          icon="setting-o" 
          is-link 
          @click="gotoPage('lotreRecord')"
        >
          <template #icon>
            <img :src="BetRecordIcon" style="width:16px;margin-right:12px"/>
          </template>
        </van-cell>
        <van-cell 
          :title="$t('profile.helpManual')" 
          icon="question-o" 
          is-link 
          @click="gotoPage('Help')"
        />
        <van-cell 
          :title="$t('profile.messageNotification')" 
          icon="envelop-o" 
          is-link 
          @click="gotoPage('Message')"
        />
        <!-- <van-cell 
          title="PWA状态" 
          icon="apps-o" 
          is-link 
          @click="gotoPage('PWAStatus')"
        /> -->
        <van-cell 
          :title="$t('profile.settings')" 
          icon="setting-o" 
          is-link 
          @click="gotoPage('Settings')"
        />
        <van-cell 
          :title="$t('profile.agent')" 
          icon="setting-o" 
          is-link 
          @click="gotoPage('Agent')"
        >
          <template #icon>
            <img :src="AgentIcon" style="width:16px;margin-right:12px"/>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 语言设置 -->
    <div class="language-section">
      <LanguageSwitcher />
    </div>

    <!-- 下载App -->
    <div class="download-app-section">
      <van-cell-group inset>
        <van-cell 
          :title="$t('profile.downloadApp')" 
          icon="down" 
          is-link 
          @click="handleDownloadAppClick"
        />
      </van-cell-group>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <van-button 
        type="danger" 
        size="large" 
        block 
        @click="handleLogout"
      >
        {{ $t('profile.logout') }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { showConfirmDialog, showToast } from 'vant'
import UserCard from '@/components/UserCard/index.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher/index.vue'
import { $t } from '@/locales'
import { handleDownloadApp } from '@/utils/pwa'
import AgentIcon from "@/assets/profile/agent.svg"
import DepositRecordIcon from "@/assets/profile/recharge_Report.svg"
import BetRecordIcon from "@/assets/profile/betting_report.svg"
import WalletIcon from "@/assets/profile/wallet.svg"
import GreenWallet from "@/assets/profile/green_wallet.svg"
import VNDCoin from "@/assets/profile/voin_vnd.svg"
import EarningRecord from "@/assets/profile/earing_record.svg"
import WithdrawReport from "@/assets/profile/withdraw_report.svg"

const router = useRouter()
const userStore = useUserStore()

// 刷新状态
const isRefreshing = ref(false)

const gotoPage = (name:string)=>{
   router.push({ name})
}

// 复制邀请链接
const copyInviteLink = async () => {
  if (userStore.userInfo?.invite_code) {
    const baseUrl = window.location.origin
    const inviteLink = `${baseUrl}/#/auth?mode=register&invite_code=${userStore.userInfo.invite_code}`

    try {
      await navigator.clipboard.writeText(inviteLink)
      showToast($t('profile.inviteLinkCopied'))
    } catch (error) {
      // 降级方案：使用传统方法复制
      const textArea = document.createElement('textarea')
      textArea.value = inviteLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      showToast($t('profile.inviteLinkCopied'))
    }
  } else {
    showToast($t('profile.inviteCodeUnavailable'))
  }
}

// 分享邀请链接
const shareInviteLink = async () => {
  if (userStore.userInfo?.invite_code) {
    const baseUrl = window.location.origin
    const inviteLink = `${baseUrl}/#/auth?mode=register&invite_code=${userStore.userInfo.invite_code}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: $t('profile.inviteFriends'),
          text: $t('profile.inviteText'),
          url: inviteLink
        })
      } catch (error) {
        // 用户取消分享或分享失败，降级到复制链接
        copyInviteLink()
      }
    } else {
      // 不支持原生分享，降级到复制链接
      copyInviteLink()
    }
  } else {
    showToast($t('profile.inviteCodeUnavailable'))
  }
}
// 刷新余额
const refreshBalance = async () => {
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

const handleDownloadAppClick = () => {
  handleDownloadApp()
}

const handleLogout = () => {
  showConfirmDialog({
    title: $t('profile.confirmLogout'),
    message: $t('profile.confirmLogoutMessage')
  }).then(() => {
    userStore.logout()
    showToast($t('profile.loggedOut'))
    router.push({ name: 'Auth' })
  }).catch(() => {
    // 用户取消
  })
}

onMounted(() => {
  // 确保用户已登录
  if (!userStore.isLoggedIn) {
    router.push({ name: 'Auth' })
  }
  
  // 刷新余额
   userStore.fetchUserInfo()
})
</script>

<style scoped>
.profile-page {
  padding-bottom: 60px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

.user-card-wrapper {
  margin: 16px;
}

.earnings-overview {
  margin: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.earnings-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.earnings-card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 80px;
  justify-content: center;
}

.earnings-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.earnings-card .card-icon {
  margin-bottom: 8px;
}
.card-icon .wallet_icon {
  width: 24px;
  height:24px
}
.card-icon .coin_icon {
  width: 20px;
  height:20px;
}
.earnings-card .card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.earnings-card .card-label {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
  line-height: 1.2;
}

.earnings-card .card-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .earnings-cards {
    gap: 6px;
  }
  
  .earnings-card {
    padding: 8px;
    min-height: 70px;
  }
  
  .earnings-card .card-icon {
    margin-bottom: 6px;
  }
  
  .earnings-card .card-label {
    font-size: 10px;
  }
  
  .earnings-card .card-value {
    font-size: 12px;
  }
}

.balance-section {
  margin: 16px;
}
.balance-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.balance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.balance-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.balance-header .card-icon {
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.balance-header .card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.balance-header .card-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
  font-weight: 500;
}

.balance-header .card-value {
  font-size: 22px;
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

.refresh-btn:hover {
  background: #e2e8f0;
  color: #475569;
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

.balance-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.withdraw-btn {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  color: #059669;
  border: 1px solid #bbf7d0;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.1);
}

.withdraw-btn:hover {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
}
.withdraw-btn .wallet_icon {
  width: 16px;
  height: 16px;
}
.deposit-btn {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  color: #2563eb;
  border: 1px solid #93c5fd;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
}

.deposit-btn:hover {
  background: linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.2);
}

.share-section {
  margin: 16px;
}

.share-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.share-title {
  font-size: 16px;
  font-weight: 600;
  color: #3b82f6;
  text-shadow: 0 1px 2px rgba(59, 130, 246, 0.1);
}

.share-details {
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: color 0.3s ease;
  font-weight: 500;
}

.share-details:hover {
  color: #3b82f6;
}

.share-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.share-icon {
  width: 48px;
  height: 48px;
  background: #2563eb;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.share-actions {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.copy-link-btn {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #3b82f6;
  border-radius: 24px;
  padding: 10px 18px;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
}

.copy-link-btn:hover {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
}

.share-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 24px;
  padding: 10px 18px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.share-btn:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.function-menu {
  margin: 16px 0;
}

.language-section {
  margin: 16px 0;
}

.download-app-section {
  margin: 16px 0;
}

.logout-section {
  margin: 20px 16px;
}

:deep(.van-cell) {
  padding: 16px;
}

:deep(.van-cell__title) {
  font-weight: 500;
}

:deep(.van-cell__left-icon) {
  margin-right: 12px;
  color: #3b82f6;
}
</style>
