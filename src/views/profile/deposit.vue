<template>
  <div class="deposit-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">{{ $t('deposit.title') }}</h2>
      <p class="page-desc">{{ $t('deposit.subtitle') }}</p>
    </div>

    <!-- 币种选择 -->
    <div class="currency-section">
      <h3 class="section-title">{{ $t('deposit.selectCurrency') }}</h3>
      <div class="currency-list">
        <div 
          v-for="currency in currencyList" 
          :key="currency.id"
          class="currency-item"
          :class="{ active: selectedCurrency === currency.id }"
          @click="selectCurrency(currency)"
        >
          <!-- <div class="currency-icon">
            <van-icon name="gold-coin-o" size="24" color="#ff6b35" />
          </div> -->
          <div class="currency-name">{{ currency.group_name }}</div>
          <van-icon 
            v-if="selectedCurrency === currency.id" 
            name="success" 
            size="18" 
            color="#52c41a" 
          />
        </div>
      </div>
    </div>

    <!-- 支付方式 -->
    <div class="payment-section" v-if="paymentMethods.length > 0">
      <h3 class="section-title">{{ $t('deposit.paymentMethod') }}</h3>
      <div class="payment-list">
        <div 
          v-for="method in paymentMethods" 
          :key="method.id"
          class="payment-item"
          :class="{ active: selectedPayment === method.id }"
          @click="selectPayment(method)"
        >
          <div class="payment-info">
            <div class="payment-name">{{ method.pay_title }}</div>
            <div class="payment-desc">{{ method.pay_code }} - {{ method.currency_symbol }}</div>
          </div>
          <van-icon 
            v-if="selectedPayment === method.id" 
            name="success" 
            size="18" 
            color="#52c41a" 
          />
        </div>
      </div>
    </div>

    <!-- 充值金额 -->
    <div class="amount-section">
      <h3 class="section-title">{{ $t('deposit.amount') }}</h3>
      <div v-if="minMoney || maxMoney" class="amount-hint">
        {{ $t('deposit.amountHint', { min: formatMoney(minMoney), max: formatMoney(maxMoney) }) }}
      </div>
      <div class="amount-presets">
        <div 
          v-for="preset in amountPresets" 
          :key="preset.value"
          class="amount-preset"
          :class="{ active: selectedAmount === preset.value }"
          @click="selectAmount(preset.value)"
        >
          {{ preset.label }}
        </div>
      </div>
      <div class="amount-input">
        <van-field
          v-model="customAmount"
          type="number"
          :placeholder="$t('deposit.amountPlaceholder')"
          :rules="amountRules"
          @input="onCustomAmountInput"
        >
          <template #left-icon>
            <span class="currency-symbol">{{ currencySymbol }}</span>
          </template>
        </van-field>
      </div>
    </div>

    <!-- 收款信息 -->
    <div class="receiver-section" v-if="receiverInfo">
      <h3 class="section-title">{{ $t('deposit.receiverInfo') }}</h3>
      <div class="receiver-card">
        <div class="receiver-item">
          <span class="label">{{ $t('deposit.bankName') }}</span>
          <span class="value">{{ receiverInfo.bank_name || $t('deposit.pending') }}</span>
        </div>
        <div class="receiver-item">
          <span class="label">{{ $t('deposit.accountName') }}</span>
          <span class="value">{{ receiverInfo.name || $t('deposit.pending') }}</span>
        </div>
        <div class="receiver-item">
          <span class="label">{{ $t('deposit.cardNumber') }}</span>
          <span class="value copyable" @click="copyToClipboard(receiverInfo.bank_card || '')">
            {{ receiverInfo.bank_card || $t('deposit.pending') }}
            <van-icon name="copy" size="14" />
          </span>
        </div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="submit-section">
      <van-button 
        type="primary" 
        size="large" 
        block 
        :loading="submitting"
        :disabled="!isAmountValid"
        @click="submitDeposit"
      >
        {{ $t('deposit.submitDeposit') }}
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed,onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { showToast, showConfirmDialog } from 'vant'
import { getEpayList, epaySubmit } from '@/api/service'
import { $t } from '@/locales'
import DepositRecordsButton from "./components/DepositRecordsButton.vue"
import { useNavBarRight } from '@/composables/useNavBar'

const router = useRouter()
const navBarRight = useNavBarRight()

// 状态管理
const currencyList = ref<any[]>([])
const paymentMethods = ref<any[]>([])
const selectedCurrency = ref(0)
const selectedPayment = ref<number>(0)
const selectedAmount = ref(0)
const customAmount = ref('')
const receiverInfo = ref<any>(null)
const submitting = ref(false)
const minMoney = ref<number>(0)
const maxMoney = ref<number>(0)
const currencySymbol = ref<string>('')

// 金额预设
const amountPresets = ref([
  { value: 200, label: '200' },
  { value: 500, label: '500' },
  { value: 1000, label: '1K' },
  { value: 2000, label: '2K' },
  { value: 5000, label: '5K' },
  { value: 10000, label: '10K' }
])

// 表单验证规则
const amountRules = [
  { required: true, message: $t('deposit.amountPlaceholder') },
  { pattern: /^\d+$/, message: $t('deposit.enterValidAmount') },
  { 
    validator: (value: string) => {
      const amount = parseFloat(value)
      if (minMoney.value && amount < minMoney.value) {
        return $t('deposit.amountTooLow', { min: formatMoney(minMoney.value) })
      }
      if (maxMoney.value && amount > maxMoney.value) {
        return $t('deposit.amountTooHigh', { max: formatMoney(maxMoney.value) })
      }
      return true
    }
  }
]

// 计算属性
const finalAmount = computed(() => {
  return selectedAmount.value || parseFloat(customAmount.value) || 0
})

const formatMoney = (val: number) => {
  if (!val) return '—'
  if (val >= 100000000) return `${Math.round(val / 1000000)}M`
  if (val >= 1000000) return `${Math.round(val / 1000) / 1000}M`
  if (val >= 1000) return `${Math.round(val / 1000)}K`
  return `${val}`
}

const isAmountValid = computed(() => {
  const amount = finalAmount.value
  if (!amount) return false
  if (minMoney.value && amount < minMoney.value) return false
  if (maxMoney.value && amount > maxMoney.value) return false
  return true
})

const limitErrorText = computed(() => {
  const amount = finalAmount.value
  if (!amount) return ''
  if (minMoney.value && amount < minMoney.value) return `金额低于最低限额 ${formatMoney(minMoney.value)}`
  if (maxMoney.value && amount > maxMoney.value) return `金额超过最高限额 ${formatMoney(maxMoney.value)}`
  return ''
})

// 选择币种
const selectCurrency = (currency: any) => {
  selectedCurrency.value = currency.id as number
  // 获取该币种的支付方式
  getPaymentMethods(selectedCurrency.value)
}

// 选择支付方式
const selectPayment = (method: any) => {
  selectedPayment.value = method.id
  
  // 更新金额预设
  if (method.money_preset) {
    const presets = Object.entries(method.money_preset).map(([value, label]) => ({
      value: parseInt(value),
      label: label as string
    }))
    amountPresets.value = presets
  }
  
  // 设置限额与币种符号
  minMoney.value = method.min_money || 0
  maxMoney.value = method.max_money || 0
  currencySymbol.value = method.currency_symbol || ''
  
  // 重置已选金额
  selectedAmount.value = 0
  customAmount.value = ''
  
  // 设置收款信息
  receiverInfo.value = method.receiver_info && method.receiver_info.length > 0 
    ? method.receiver_info[0] 
    : null
}

// 选择金额
const selectAmount = (amount: number) => {
  selectedAmount.value = amount
  customAmount.value = amount.toString()
}

// 手动输入金额时清除预设选择
const onCustomAmountInput = () => {
  selectedAmount.value = 0
}

// 获取支付方式
const getPaymentMethods = async (currencyId: number) => {
  try {
    const res = await getEpayList()
    if (res && res.list) {
      // 根据group_id过滤支付方式
      const filteredMethods = (res.list as any[]).filter((method: any) => method.group_id === currencyId)
      paymentMethods.value = filteredMethods
      if (filteredMethods.length > 0) {
        selectPayment(filteredMethods[0])
      } else {
        receiverInfo.value = null
        amountPresets.value = []
      }
    }
  } catch (error) {
    console.error('获取支付方式失败:', error)
    showToast(error.msg || $t('deposit.getPaymentMethodsFailed'))
  }
}

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast($t('deposit.copiedToClipboard'))
  } catch (error) {
    showToast($t('deposit.copyFailed'))
  }
}

// 提交充值
const submitDeposit = async () => {
  if (!selectedCurrency.value) {
    showToast($t('deposit.selectCurrencyFirst'))
    return
  }
  
  if (!selectedPayment.value) {
    showToast($t('deposit.selectPaymentFirst'))
    return
  }
  
  if (finalAmount.value <= 0) {
    showToast($t('deposit.enterValidAmount'))
    return
  }

  // 验证金额范围
  if (minMoney.value && finalAmount.value < minMoney.value) {
    showToast($t('deposit.amountTooLow', { min: formatMoney(minMoney.value) }))
    return
  }
  
  if (maxMoney.value && finalAmount.value > maxMoney.value) {
    showToast($t('deposit.amountTooHigh', { max: formatMoney(maxMoney.value) }))
    return
  }

  try {
    await showConfirmDialog({
      title: $t('deposit.confirmDeposit'),
      message: $t('deposit.confirmMessage', { currency: currencySymbol.value, amount: finalAmount.value })
    })

    submitting.value = true

    const formData = {
      id: selectedPayment.value,
      money: finalAmount.value,
      frontend: {
        bank_name: receiverInfo.value?.bank_name || '',
        name: receiverInfo.value?.name || '',
        bank_card: receiverInfo.value?.bank_card || ''
      }
    }

    const res = await epaySubmit(formData)
    
    if (res && res.link) {
      // 打开支付链接
      window.open(res.link, '_blank')
      showToast($t('deposit.jumpingToPayment'))
    } else {
      showToast($t('deposit.depositSubmitted'))
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('提交充值失败:', error)
      showToast(error.msg || $t('deposit.submitFailed'))
    }
  } finally {
    submitting.value = false
  }
}

// 初始化
const initDeposit = async () => {
  try {
    const res = await getEpayList()
    if (res && res.group) {
      currencyList.value = res.group as any[]
      if (res.group.length > 0) {
        selectCurrency(res.group[0])
      }
    }
  } catch (error) {
    console.error('获取充值信息失败:', error)
    showToast(error.msg || $t('deposit.getDepositInfoFailed'))
  }
}

onMounted(() => {
  navBarRight.value = DepositRecordsButton
  initDeposit()
})
onUnmounted(() => {
  // 清理导航栏右侧按钮
  navBarRight.value = null
})
</script>

<style scoped>
.deposit-page {
  padding: 16px;
  padding-bottom: 60px;
  background: #f5f5f5;
  min-height: 100vh;
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

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.currency-section,
.payment-section,
.amount-section,
.receiver-section {
  margin-bottom: 24px;
}

.currency-list,
.payment-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.currency-item,
.payment-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.currency-item:hover,
.payment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.currency-item.active,
.payment-item.active {
  border-color: #52c41a;
  background: #f6ffed;
}

.currency-icon {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 8px;
}

.currency-name {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.payment-info {
  flex: 1;
}

.payment-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.payment-desc {
  font-size: 12px;
  color: #666;
}

.amount-hint {
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #52c41a;
}

.amount-presets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.amount-preset {
  background: white;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.amount-preset:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.amount-preset.active {
  border-color: #52c41a;
  background: #f6ffed;
  color: #52c41a;
}

.amount-input {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.currency-symbol {
  font-size: 16px;
  font-weight: 500;
  color: #666;
  margin-right: 8px;
}

.receiver-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
}

.receiver-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.receiver-item:last-child {
  border-bottom: none;
}

.receiver-item .label {
  font-size: 14px;
  color: #666;
}

.receiver-item .value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.receiver-item .value.copyable {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #52c41a;
}

.receiver-item .value.copyable:hover {
  text-decoration: underline;
}

.submit-section {
  margin-top: 32px;
}

:deep(.van-field) {
  padding: 16px;
}

:deep(.van-field__control) {
  font-size: 16px;
}
</style>
