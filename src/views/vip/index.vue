<template>
  <div class="vip-page">
    <!-- 头部信息 -->
    <div class="vip-header">
      <div class="header-content">
        <div class="user-info">
          <div class="level-display">
            <span class="level-text">{{ $t('vip.level' as any) }} {{ userStore.userInfo?.level || 0 }}</span>
          </div>
          <div class="level-name">{{ vipData.name || 'VIP0' }}</div>
          <div class="invite-code" @click="copyInviteCode">
            <span class="invite-code-text">{{ $t('vip.inviteCode' as any) }}: {{ vipData.invite_code }}</span>
            <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="invite-link" @click="copyInviteLink">
            <span class="invite-link-text">{{ $t('vip.inviteLink' as any) }}: {{ vipData.link }}</span>
            <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- 统计数据 -->
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-value">{{ formatAmount(vipData.recharge_amount) }}</div>
          <div class="stat-label">{{ $t('vip.rechargeAmount' as any) }}</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">{{ formatAmount(vipData.day_bet_amount) }}</div>
          <div class="stat-label">{{ $t('vip.bettingAmount' as any) }}</div>
        </div>
      </div>
    </div>

    <!-- VIP等级列表 -->
    <div class="vip-levels">
      <div class="levels-header">
        <h3>{{ $t('vip.levelRules' as any) }}</h3>
        <div class="rules-info">
          <p>{{ $t('vip.rule1' as any) }}</p>
          <p>{{ $t('vip.rule2' as any) }}</p>
        </div>
      </div>
      
      <div class="levels-table">
        <div class="table-header">
          <div class="header-cell">{{ $t('vip.grade' as any) }}</div>
          <div class="header-cell">{{ $t('vip.recharge' as any) }}</div>
          <div class="header-cell">{{ $t('vip.betting' as any) }}</div>
          <div class="header-cell withdraw-header">{{ $t('vip.withdrawMax' as any) }} / {{ $t('vip.withdrawNumber' as any) }}</div>
        </div>
        
        <div class="table-body">
          <div 
            v-for="(level, index) in levelList" 
            :key="index"
            class="table-row"
            :class="{ 'current-level': level.level === vipData.level }"
          >
            <div class="cell level-cell">
              <div class="level-badge">
                <span class="level-number">{{ $t('vip.level' as any) }} {{ level.level }}</span>
              </div>
            </div>
            <div class="cell">{{ formatAmount(level.promotion_money) }}</div>
            <div class="cell">{{ formatAmount(level.day_bet_amount) }}</div>
            <div class="cell withdraw-cell">
              <div class="withdraw-info">
                <div class="withdraw-item">
                  <span class="withdraw-label">{{ $t('vip.withdrawMax' as any) }}</span>
                  <span class="withdraw-value">{{ formatAmount(level.withdraw_max) }}</span>
                </div>
                <div class="withdraw-item">
                  <span class="withdraw-label">{{ $t('vip.withdrawNumber' as any) }}</span>
                  <span class="withdraw-value">{{ level.withdraw_number || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { getUserLevelList } from '@/api/sms'
import { $t, $locale } from '@/locales'
import { showToast } from 'vant'

const userStore = useUserStore()

// VIP数据
const vipData = ref<any>({})
const levelList = ref<any[]>([])

// 获取当前语言
const currentLocale = computed(() => $locale.value)

// 格式化金额显示（支持多语言）
const formatAmount = (amount: string | number) => {
  if (!amount) return '0'
  const num = parseFloat(amount.toString())
  const locale = currentLocale.value
  
  // 中文使用万、亿
  if (locale === 'zh-cn') {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(1) + $t('common.unitHundredMillion')
    } else if (num >= 10000) {
      return (num / 10000).toFixed(1) + $t('common.unitTenThousand')
    } else {
      return num.toLocaleString()
    }
  } 
  // 英文和越南语使用 K、M、B
  else {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + $t('common.unitBillion')
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + $t('common.unitMillion')
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + $t('common.unitThousand')
    } else {
      return num.toLocaleString()
    }
  }
}

// 复制邀请码
const copyInviteCode = async () => {
  if (!vipData.value.invite_code) return
  
  try {
    await navigator.clipboard.writeText(vipData.value.invite_code)
    showToast($t('vip.inviteCodeCopied' as any))
  } catch (error) {
    // 降级方案：使用传统方法复制
    const textArea = document.createElement('textarea')
    textArea.value = vipData.value.invite_code
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showToast($t('vip.inviteCodeCopied' as any))
  }
}

// 复制邀请链接
const copyInviteLink = async () => {
  if (!vipData.value.link) return
  
  try {
    await navigator.clipboard.writeText(vipData.value.link)
    showToast($t('vip.inviteLinkCopied' as any))
  } catch (error) {
    // 降级方案：使用传统方法复制
    const textArea = document.createElement('textarea')
    textArea.value = vipData.value.link
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showToast($t('vip.inviteLinkCopied' as any))
  }
}

// 加载VIP等级列表
const loadVipLevels = async () => {
  try {
    const res = await getUserLevelList()
    if (res) {
      vipData.value = res || {}
      levelList.value = res?.rows || []
    }
  } catch (error) {
    console.error('加载VIP等级失败:', error)
  }
}

onMounted(() => {
  loadVipLevels()
})
</script>

<style scoped>
.vip-page {
  min-height: 100vh;
  background: #fff;
  color: #333;
}

.vip-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.header-content {
  margin-bottom: 20px;
}

.user-info {
  text-align: center;
}

.level-display {
  margin-bottom: 10px;
}

.level-text {
  font-size: 24px;
  font-weight: 700;
  color: #F9DCBA;
}

.level-name {
  font-size: 18px;
  font-weight: 600;
  color: #BA7D65;
  margin-bottom: 10px;
}

.invite-code, .invite-link {
  font-size: 14px;
  color: #F9DCBA;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 5px 0;
  position: relative;
  max-width: 100%;
  overflow: hidden;
}

.invite-code:hover, .invite-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.02);
}

.copy-icon {
  margin-left: 8px;
  opacity: 0.8;
  flex-shrink: 0;
}

.invite-code-text, .invite-link-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
}

.stats-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #F9DCBA;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 13px;
  color: #F9DCBA;
  opacity: 0.8;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(249, 220, 186, 0.3);
}

.vip-levels {
  padding: 15px;
  background: #fff;
  margin: -20px 15px 20px;
  border-radius: 10px;
  position: relative;
  z-index: 1;
}

.levels-header {
  margin-bottom: 20px;
}

.levels-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.rules-info {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

.rules-info p {
  margin: 5px 0;
}

.levels-table {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #F9E2C6;
  width: 100%;
}

.table-header {
  display: flex;
  background: #FCDFCD;
  border-radius: 10px 10px 0 0;
}

.header-cell {
  flex: 1;
  padding: 10px 4px;
  text-align: center;
  font-weight: 700;
  color: #BA7D65;
  border-right: 1px solid #CB917A;
  font-size: 11px;
  word-break: break-word;
  line-height: 1.3;
}

.header-cell.withdraw-header {
  flex: 1.2;
  font-size: 10px;
  line-height: 1.3;
}

.header-cell:last-child {
  border-right: none;
}

.table-body {
  border: 1px solid #F9DEDE;
  border-top: none;
  border-radius: 0 0 10px 10px;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #F9DEDE;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:nth-child(even) {
  background: #FFF5F4;
}

.table-row.current-level {
  background: #E8F5E8;
  border: 2px solid #4CAF50;
}

.cell {
  flex: 1;
  padding: 10px 4px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #CB917A;
  color: #333;
  font-size: 11px;
  word-break: break-word;
}

.cell.withdraw-cell {
  flex: 1.2;
  padding: 8px 4px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cell:last-child {
  border-right: none;
}

.level-cell {
  justify-content: center;
}

.level-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
}

.level-number {
  font-size: 10px;
}

.withdraw-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.withdraw-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.withdraw-label {
  font-size: 9px;
  color: #999;
  line-height: 1.2;
}

.withdraw-value {
  font-size: 11px;
  font-weight: 600;
  color: #333;
  line-height: 1.2;
}
</style>
