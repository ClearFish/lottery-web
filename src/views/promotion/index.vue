<template>
  <div class="promotion-page">
    <!-- 推广海报 -->
    <div class="poster-section">
      <div class="poster-container">
        <div class="poster-content">
          <div class="poster-header">
            <h2 class="poster-title">{{ $t('promotion.inviteFriends') }}</h2>
            <p class="poster-subtitle">{{ $t('promotion.threeLevelDistribution') }}</p>
          </div>
          <div class="poster-qr">
            <div class="qr-code">
              <div class="qr-placeholder">
                <van-icon name="qr" size="48" color="#333" />
                <p>{{ $t('promotion.inviteQRCode') }}</p>
              </div>
            </div>
            <p class="qr-text">{{ $t('promotion.scanToRegister') }}</p>
          </div>
          <div class="poster-footer">
            <p class="invite-code">{{ $t('promotion.inviteCode') }}: {{ userStore.userInfo?.invite_code }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 推广统计 -->
    <div class="promotion-stats">
      <h3 class="section-title">{{ $t('promotion.promotionStats') }}</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ promotionStats.totalInvites }}</div>
          <div class="stat-label">{{ $t('promotion.totalInvites') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">₫{{ promotionStats.totalEarnings }}</div>
          <div class="stat-label">{{ $t('promotion.totalEarnings') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ promotionStats.level1Count }}</div>
          <div class="stat-label">{{ $t('promotion.level1Members') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ promotionStats.level2Count }}</div>
          <div class="stat-label">{{ $t('promotion.level2Members') }}</div>
        </div>
      </div>
    </div>

    <!-- 分享链接 -->
    <div class="share-section">
      <h3 class="section-title">{{ $t('promotion.shareLink') }}</h3>
      <div class="share-link">
        <van-field
          v-model="inviteUrl"
          :label="$t('promotion.inviteLink')"
          readonly
          left-icon="link"
        >
          <template #button>
            <van-button size="small" type="primary" @click="copyLink">
              {{ $t('promotion.copy') }}
            </van-button>
          </template>
        </van-field>
      </div>
    </div>

    <!-- 分享按钮 -->
    <div class="share-actions">
      <van-button 
        type="primary" 
        size="large" 
        block 
        @click="downloadPoster"
      >
        {{ $t('promotion.savePoster') }}
      </van-button>
      <van-button 
        type="default" 
        size="large" 
        block 
        @click="sharePoster"
      >
        {{ $t('promotion.sharePoster') }}
      </van-button>
    </div>

    <!-- 推广规则 -->
    <div class="promotion-rules">
      <h3 class="section-title">{{ $t('promotion.promotionRules') }}</h3>
      <div class="rules-content">
        <div class="rule-item">
          <van-icon name="user-o" />
          <span>{{ $t('promotion.level1Rule') }}{{ userStore.userInfo?.level_info?.invite_ratio?.['1'] || '5' }}{{ $t('promotion.percent') }}</span>
        </div>
        <div class="rule-item">
          <van-icon name="friends-o" />
          <span>{{ $t('promotion.level2Rule') }}{{ userStore.userInfo?.level_info?.invite_ratio?.['2'] || '3' }}{{ $t('promotion.percent') }}</span>
        </div>
        <div class="rule-item">
          <van-icon name="contact" />
          <span>{{ $t('promotion.level3Rule') }}{{ userStore.userInfo?.level_info?.invite_ratio?.['3'] || '1' }}{{ $t('promotion.percent') }}</span>
        </div>
        <div class="rule-item">
          <van-icon name="gold-coin-o" />
          <span>{{ $t('promotion.realTimeEarnings') }}</span>
        </div>
        <div class="rule-item">
          <van-icon name="star-o" />
          <span>{{ $t('promotion.currentLevel') }}{{ userStore.userInfo?.level_info?.name || 'VIP0' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { showToast } from 'vant'
import { $t } from '@/locales'

const userStore = useUserStore()

const inviteUrl = computed(() => {
  const baseUrl = window.location.origin
  return `${baseUrl}/#/auth?mode=register&invite_code=${userStore.userInfo?.invite_code || ''}`
})

const promotionStats = computed(() => ({
  totalInvites: 0, // 需要从API获取
  totalEarnings: parseFloat(userStore.userInfo?.total_profit || '0'),
  level1Count: 0, // 需要从API获取
  level2Count: 0, // 需要从API获取
  level3Count: 0  // 需要从API获取
}))

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(inviteUrl.value)
    showToast($t('promotion.linkCopied'))
  } catch (error) {
    showToast($t('promotion.copyFailed'))
  }
}

const downloadPoster = () => {
  showToast($t('promotion.posterDownloading'))
}

const sharePoster = () => {
  showToast($t('promotion.shareDeveloping'))
}
</script>

<style scoped>
.promotion-page {
  padding-bottom: 60px;
}

.poster-section {
  padding: 16px;
}

.poster-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 24px;
  color: white;
  text-align: center;
}

.poster-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.poster-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 24px 0;
}

.poster-qr {
  margin: 24px 0;
}

.qr-code {
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 12px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-placeholder {
  text-align: center;
  color: #333;
}

.qr-placeholder p {
  margin: 8px 0 0 0;
  font-size: 12px;
}

.qr-text {
  font-size: 14px;
  margin: 12px 0 0 0;
  opacity: 0.9;
}

.invite-code {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
}

.promotion-stats {
  padding: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.share-section {
  padding: 16px;
}

.share-link {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.share-actions {
  padding: 16px;
  display: flex;
  gap: 12px;
}

.share-actions .van-button {
  flex: 1;
}

.promotion-rules {
  padding: 16px;
}

.rules-content {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rule-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.rule-item:last-child {
  border-bottom: none;
}

.rule-item .van-icon {
  margin-right: 12px;
  color: #1890ff;
}

.rule-item span {
  font-size: 14px;
  color: #333;
}
</style>
