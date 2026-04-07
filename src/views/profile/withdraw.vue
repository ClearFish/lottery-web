<template>
  <div class="withdraw-page">
    <!-- 余额显示 -->
    <div class="balance-section">
      <div class="balance-card">
        <div class="balance-header">
          <div class="balance-info">
            <div class="balance-label">{{ $t('withdraw.availableBalance') }}</div>
            <div class="balance-amount">₫{{ userStore.balance.toFixed(2) }}</div>
          </div>
          <van-button 
            type="primary" 
            size="small" 
            plain 
            round
            @click="withdrawAll"
            class="withdraw-all-btn"
          >
            {{ $t('withdraw.withdrawAll') }}
          </van-button>
        </div>
       
      </div>
    </div>

    <!-- 币种选择 -->
    <div class="currency-section">
      <h3>{{ $t('withdraw.withdrawCurrency') }}</h3>
      <div class="currency-options">
        <div 
          v-for="option in currencyOptions" 
          :key="option.value"
          class="currency-option"
          :class="{ active: selectedCurrency === option.value }"
          @click="selectCurrency(option.value)"
        >
          <div class="currency-symbol">{{ option.text }}</div>
          <div class="currency-status" v-if="option.is_bank_bind">
            <van-icon name="success" size="14" color="#52c41a" />
            <span>{{ $t('withdraw.bound') }}</span>
          </div>
          <div class="currency-status" v-else>
            <van-icon name="warning" size="14" color="#ff4d4f" />
            <span>{{ $t('withdraw.notBound') }}</span>
          </div>
        </div>
      </div>
    </div>

   

    <!-- 提现账户管理 -->
    <div class="account-section">
      <div class="section-header">
        <h3>{{ $t('withdraw.withdrawAccount') }}</h3>
        <van-button 
          type="primary" 
          size="small" 
          plain 
          @click="showAddAccount = true"
        >
          {{ $t('withdraw.addAccount') }}
        </van-button>
      </div>
      
      <div v-if="bankList.length > 0" class="account-list">
        <div 
          v-for="account in bankList" 
          :key="account.user_bank_id"
          class="account-item"
          :class="{ active: selectedAccount?.user_bank_id === account.user_bank_id }"
          @click="selectAccount(account)"
        >
          <div class="account-info">
            <div class="account-type">{{ $t('withdraw.bank') }}</div>
            <div class="account-number">{{ maskAccountNumber(account.form.bank_card.value) }}</div>
            <div class="account-name">{{ account.form.real_name.value }}</div>
          </div>
          <van-icon 
            v-if="selectedAccount?.user_bank_id === account.user_bank_id" 
            name="success" 
            color="#1890ff" 
          />
        </div>
      </div>
      
      <div v-else class="no-accounts">
        <div class="empty-state">
          <van-icon name="credit-pay" size="28" color="#ccc" />
          <p class="empty-text">{{ $t('withdraw.noAccount') }}</p>
          <van-button 
            type="primary" 
            size="small" 
            @click="showAddAccount = true"
          >
            {{ $t('withdraw.addFirstAccount') }}
          </van-button>
        </div>
      </div>
    </div>

    <!-- 提现表单 -->
    <van-form @submit="handleWithdraw" class="withdraw-form">
      <van-cell-group inset>
        <van-cell :title="$t('withdraw.amount')" class="title_auto">
          <template #icon>
            <img :src="VNDIcon" class="coin_icon"/>
          </template>
          <template #value>
            <div>
              <van-field
                v-model="form.amount"
                name="amount"
                :placeholder="$t('withdraw.amountPlaceholder')"
                type="number"
                :rules="amountRules"
              />
              <!-- <p class="remind">{{$t('profile.withdraw_remind')}}</p> -->
            </div>
          </template>
        </van-cell>
        <!-- <van-field
          v-model="form.amount"
          name="amount"
          :label="$t('withdraw.amount')"
          :placeholder="$t('withdraw.amountPlaceholder')"
          type="number"
          :rules="amountRules"
          left-icon="gold-coin-o"
        >
          <template #left-icon>
            <img :src="VNDIcon" class="coin_icon"/>
          </template>
        </van-field> -->
        <van-field
          v-model="form.password"
          name="password"
          :label="$t('withdraw.password')"
          :placeholder="$t('withdraw.passwordPlaceholder')"
          type="password"
          :rules="passwordRules"
          left-icon="lock"
        />
      </van-cell-group>

     <!-- 提现限制信息 -->
     <div class="limits-section" v-if="withdrawLimits.min">
      <h3>{{ $t('withdraw.withdrawLimits') }}</h3>
      <div class="vipinfo">
        <p>{{$t('withdraw.vipinfo_now')}}:</p>
        <div class="user-level" @click="goToVip">{{ userStore.userInfo.level_info?.name || 'VIP0' }}</div>
      </div>
      <div class="limits-info">
        <div class="limit-item">
          <span class="label">{{ $t('withdraw.targetBetAmount') }}:</span>
          <span class="value" v-if="Number( withdrawLimits.arriveBet) > 0">{{ withdrawLimits.arriveBet.toLocaleString() }} VND</span>
          <span class="value" v-else>{{ $t('withdraw.no_limit') }} </span>
        </div>
        <div class="limit-item">
          <span class="label">{{ $t('withdraw.completedBet') }}:</span>
          <span class="value">{{ withdrawLimits.completedBet.toLocaleString() }} VND</span>
        </div>
        <div class="limit-item" v-if="withdrawLimits.min">
          <span class="label">{{ $t('withdraw.minAmount') }}:</span>
          <span class="value" v-if="Number(withdrawLimits.min) >0">{{ withdrawLimits.min.toLocaleString() }} VND</span>
          <span class="value" v-else>{{ $t('withdraw.no_limit') }} </span>
        </div>
        <div class="limit-item">
          <span class="label">{{ $t('withdraw.maxAmount') }}:</span>
          <span class="value" v-if="Number(withdrawLimits.max) >0">{{ withdrawLimits.max.toLocaleString() }} VND</span>
          <span class="value" v-else>{{ $t('withdraw.no_limit') }} </span>
        </div>
        
        
        <!-- <div class="limit-item" v-if="withdrawLimits.dayMax > 0">
          <span class="label">{{ $t('withdraw.dailyMaxWithdraw') }}:</span>
          <span class="value">{{ withdrawLimits.dayMax.toLocaleString() }} VND</span>
        </div> -->
        
       
        <div class="limit-item">
          <span class="label">{{ $t('withdraw.dailyWithdrawCount') }}:</span>
          <span class="value" v-if="Number(withdrawLimits.dailyWithdrawCount) >0">{{ withdrawLimits.dailyWithdrawCount }} {{ $t('withdraw.timesPerDay') }}</span>
          <span class="value" v-else>{{ $t('withdraw.no_limit') }} </span>
        </div>
      </div>
    </div>

      <!-- 提现按钮 -->
      <div class="withdraw-actions">
        <van-button 
          type="primary" 
          size="large" 
          block 
          :loading="submitting"
          :disabled="!canWithdraw"
          native-type="submit"
        >
          {{ $t('withdraw.confirmWithdraw') }}
        </van-button>
      </div>
    </van-form>

    <!-- 添加账户弹窗 -->
    <van-popup 
      v-model:show="showAddAccount" 
      position="bottom" 
      :style="{ height: '70%' }"
    >
      <div class="add-account-popup">
        <div class="popup-header">
          <h3>{{ $t('withdraw.addWithdrawAccount') }}</h3>
          <van-icon 
            name="cross" 
            size="20" 
            @click="showAddAccount = false"
            class="close-btn"
          />
        </div>
        
        <van-form @submit="handleAddAccount" class="add-account-form">
          <van-cell-group>
            <!-- 银行账户表单 -->
            <template v-if="selectedCurrency === 'SYSTEM'">
              <van-field
                v-model="newAccount.bankName"
                name="bankName"
                :label="$t('withdraw.bankName')"
                :placeholder="$t('withdraw.selectBank')"
                readonly
                is-link
                @click="showBankPicker = true"
                left-icon="credit-pay"
              />
              
              <van-field
                v-model="newAccount.account"
                name="account"
                :label="$t('withdraw.bankCardNumber')"
                :placeholder="$t('withdraw.bankCardNumberPlaceholder')"
                :rules="accountRules"
                left-icon="contact"
              />
              
              <van-field
                v-model="newAccount.realName"
                name="realName"
                :label="$t('withdraw.cardholderName')"
                :placeholder="$t('withdraw.cardholderNamePlaceholder')"
                :rules="realNameRules"
                left-icon="user-o"
              />
            </template>
            
            <!-- USDT账户表单 -->
            <template v-else-if="selectedCurrency === 'USDT'">
              <van-field
                v-model="newAccount.account"
                name="account"
                :label="$t('withdraw.walletAddress')"
                :placeholder="$t('withdraw.walletAddressPlaceholder')"
                :rules="walletAddressRules"
                left-icon="gold-coin-o"
                type="textarea"
                :rows="3"
              />
            </template>
          </van-cell-group>
          
          <div class="popup-actions">
            <van-button 
              type="primary" 
              size="large" 
              block 
              :loading="addingAccount"
              :disabled="!canAddAccount"
              native-type="submit"
            >
              {{ $t('withdraw.addAccount') }}
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>


    <!-- 银行选择器 -->
    <van-popup v-model:show="showBankPicker" position="bottom">
      <div v-if="availableBanks.length === 0" class="no-banks">
        <p>{{ $t('withdraw.noAvailableBanks') }}</p>
      </div>
      <van-picker
        v-else
        :columns="availableBanks.map(bank => ({ text: bank.bank_name, value: bank.bank_id }))"
        @confirm="onBankConfirm"
        @cancel="showBankPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { showToast, showConfirmDialog } from 'vant'
import { getBankInfo, bindBank, submitWithdraw } from '@/api/service'
import { $t } from '@/locales'
import { useNavBarRight } from '@/composables/useNavBar'
import WithdrawRecordsButton from '@/components/WithdrawRecordsButton.vue'
import VNDIcon from "@/assets/profile/vnd_icon.svg"

const router = useRouter()
const userStore = useUserStore()

// 导航栏右侧按钮
const navBarRight = useNavBarRight()

// 基础状态
const submitting = ref(false)
const addingAccount = ref(false)
const showAddAccount = ref(false)
const showBankPicker = ref(false)
const selectedAccount = ref<any>(null)

// 表单数据
const form = reactive({
  amount: '',
  password: ''
})

const newAccount = reactive({
  bankName: '',
  bankId: '',
  account: '',
  realName: ''
})

// 保存的账户列表
const savedAccounts = ref<any[]>([])

// 提现信息
const withdrawInfo = ref<any>({})
const bankList = ref<any[]>([])
const selectedCurrency = ref('SYSTEM')
const loading = ref(false)
const currencyOptions = ref<any[]>([])
const availableBanks = ref<any[]>([])
const withdrawLimits = ref<any>({})

const methodOptions = [
  { text: $t('withdraw.alipay'), value: 'alipay' },
  { text: $t('withdraw.wechat'), value: 'wechat' },
  { text: $t('withdraw.bank'), value: 'bank' }
]

// 验证规则
const amountRules = computed(() => [
  { required: true, message: $t('withdraw.amountRequired') },
  { 
    validator: (val: string) => {
      const amount = parseFloat(val)
      const minAmount = withdrawLimits.value.min || 0
      const maxAmount = withdrawLimits.value.max || 0
      return amount >= minAmount && amount <= maxAmount
    }, 
    message: $t('withdraw.amountRange', { min: withdrawLimits.value.min || 0, max: withdrawLimits.value.max || 0 }) 
  },
  { 
    validator: (val: string) => {
      const amount = parseFloat(val)
      return amount <= userStore.balance
    }, 
    message: $t('withdraw.amountExceedsBalance') 
  }
])

const passwordRules = [
  { required: true, message: $t('withdraw.passwordRequired') },
  { min: 6, message: $t('withdraw.passwordMinLength') }
]

const accountRules = [
  { required: true, message: $t('withdraw.accountRequired') }
]

const realNameRules = [
  { required: true, message: $t('withdraw.realNameRequired') },
  { pattern: /^[a-zA-Z\s]{2,50}$/, message: $t('withdraw.realNamePattern') }
]

const walletAddressRules = [
  { required: true, message: $t('withdraw.walletAddressRequired') },
  { min: 10, message: $t('withdraw.walletAddressMinLength') }
]

// 计算属性
const canWithdraw = computed(() => {
  return form.amount && 
         form.password &&
         selectedAccount.value &&
         parseFloat(form.amount) >= parseFloat(userStore.userInfo?.level_info?.withdraw_min || '100') &&
         parseFloat(form.amount) <= userStore.balance
})

const canAddAccount = computed(() => {
  if (selectedCurrency.value === 'SYSTEM') {
    // 银行账户需要银行名称、账户和真实姓名
    return newAccount.bankName && 
           newAccount.account && 
           newAccount.realName
  } else if (selectedCurrency.value === 'USDT') {
    // USDT只需要钱包地址
    return newAccount.account && newAccount.account.length >= 10
  }
  return false
})

const goToVip = ()=>{
  router.push({ name: 'Vip' })
}

// 方法
const withdrawAll = () => {
  form.amount = userStore.balance.toString()
}

const selectAccount = (account: any) => {
  selectedAccount.value = account
}

const getAccountTypeName = (type: string) => {
  const option = methodOptions.find(opt => opt.value === type)
  return option ? option.text : type
}

const maskAccountNumber = (account: string) => {
  if (account.length <= 4) return account
  return '*'.repeat(account.length - 4) + account.slice(-4)
}

const onBankConfirm = ({ selectedOptions }: any) => {
  newAccount.bankName = selectedOptions[0].text
  newAccount.bankId = selectedOptions[0].value
  showBankPicker.value = false
}

// 获取提现信息
const getWithdrawInfo = async () => {
  try {
    loading.value = true
    const res = await getBankInfo()
    console.log('getWithdrawInfo - API response:', res)
    
    if (res) {
      withdrawInfo.value = res
      console.log('getWithdrawInfo - withdrawInfo.value:', withdrawInfo.value)
      console.log('getWithdrawInfo - currency keys:', Object.keys(res.currency || {}))
      
      // 处理币种选项
      if (res.currency) {
        currencyOptions.value = Object.keys(res.currency).map(key => ({
          text: res.currency[key].symbo,
          value: key,
          is_bank_bind: res.currency[key].is_bank_bind
        }))
        console.log('getWithdrawInfo - currencyOptions:', currencyOptions.value)
      }
      
      // 设置当前币种的数据
      updateCurrencyData(selectedCurrency.value)
    } else {
      console.log('getWithdrawInfo - No data in response')
      // 如果API失败，使用默认数据
      currencyOptions.value = [
        { text: 'VND', value: 'SYSTEM', is_bank_bind: true },
        { text: 'USDT', value: 'USDT', is_bank_bind: false }
      ]
    }
  } catch (error) {
    console.error('Failed to get withdraw info:', error)
    // 使用默认数据
    currencyOptions.value = [
      { text: 'VND', value: 'SYSTEM', is_bank_bind: true },
      { text: 'USDT', value: 'USDT', is_bank_bind: false }
    ]
    showToast(error.msg || $t('withdraw.getWithdrawInfoFailed'))
  } finally {
    loading.value = false
  }
}

// 更新币种数据
const updateCurrencyData = (currency: string) => {
  const currencyData = withdrawInfo.value.currency?.[currency]
  console.log('updateCurrencyData - currency:', currency)
  console.log('updateCurrencyData - currencyData:', currencyData)
  
  if (currencyData) {
    const userBindBank = currencyData.user_bind_bank || []
    console.log('updateCurrencyData - user_bind_bank:', userBindBank)
    
    bankList.value = userBindBank
    availableBanks.value = currencyData.banks || []
    withdrawLimits.value = {
      min: userStore.userInfo?.level_info?.withdraw_min || 100000,
      max: userStore.userInfo?.level_info?.withdraw_max || 0,
      dayMax: currencyData.day_max_withdrawal || 0,
      completedBet: currencyData.completed_bet_amount || 0,
      arriveBet: currencyData.arrive_bet_amount || 0,
      // 7天内有效投注金额
      sevenDayValidBet: withdrawInfo.value.seven_day_valid_bet_amount || 0,
      // 每日提现次数限制（暂时使用固定值，后续可根据实际需求调整）
      dailyWithdrawCount: userStore.userInfo?.level_info?.withdraw_number || 0
    }
    
    console.log('updateCurrencyData - bankList.value after update:', bankList.value)
    
    // 如果有绑定的银行卡，设置为已选择的账户
    if (bankList.value.length > 0) {
      selectedAccount.value = bankList.value[0]
      console.log('updateCurrencyData - selectedAccount:', selectedAccount.value)
    } else {
      selectedAccount.value = null
      console.log('updateCurrencyData - no bank accounts')
    }
  } else {
    console.log('updateCurrencyData - no currencyData found')
  }
}

// 选择币种
const selectCurrency = (currency: string) => {
  selectedCurrency.value = currency
  updateCurrencyData(currency)
}

const handleAddAccount = async () => {
  if (!canAddAccount.value) {
    showToast($t('withdraw.completeAccountInfo'))
    return
  }

  addingAccount.value = true
  try {
    let res
    
    if (selectedCurrency.value === 'SYSTEM') {
      // 银行账户
      res = await bindBank({
        bank_id: newAccount.bankId,
        form:{
          bank_card: newAccount.account,
          real_name: newAccount.realName
        }
        
      })
    } else if (selectedCurrency.value === 'USDT') {
      // USDT钱包地址
      res = await bindBank({
        bank_id: 'USDT', // USDT使用特殊标识
        form: {
          bank_card: newAccount.account,
          real_name: 'USDT_WALLET' // USDT不需要真实姓名
        }
      })
    }
    
    // 重新获取提现信息
    await getWithdrawInfo()
      
      // 重置表单
      Object.assign(newAccount, {
        bankName: '',
        bankId: '',
        account: '',
        realName: ''
      })
      
      showAddAccount.value = false
      showToast($t('withdraw.accountAddedSuccess'))
  } catch (error) {
    console.error('Failed to add account:', error)
    showToast(error.msg || $t('withdraw.addFailedRetry'))
  } finally {
    addingAccount.value = false
  }
}

const handleWithdraw = async () => {
  if (!canWithdraw.value) {
    showToast($t('withdraw.completeWithdrawInfo'))
    return
  }

  const amount = parseFloat(form.amount)
  
  showConfirmDialog({
    title: $t('withdraw.confirmWithdraw'),
    message: $t('withdraw.confirmWithdrawMessage', { amount, accountType: getAccountTypeName(selectedAccount.value.type) })
  }).then(async () => {
    submitting.value = true
    try {
      const res = await submitWithdraw({
        money: amount,
        currency: 'SYSTEM',
        user_bank_id: selectedAccount.value.user_bank_id,
        password: form.password
      })
      
      if (res) {
        // 重新获取用户信息
        await userStore.fetchUserInfo()
        
        showToast($t('withdraw.withdrawSubmitted'))
        router.push({ name: 'WithdrawRecords' })
      } else {
        showToast(res?.msg || $t('withdraw.withdrawFailed'))
      }
    } catch (error) {
      console.error('Withdraw failed:', error)
      showToast(error.msg || $t('withdraw.withdrawFailedRetry'))
    } finally {
      submitting.value = false
    }
  }).catch(() => {
    // 用户取消
  })
}

// 初始化
onMounted(async () => {
  // 设置导航栏右侧按钮
  navBarRight.value = WithdrawRecordsButton
  // 获取提现信息
  await getWithdrawInfo()

  // 未设置提现密码则提示去设置
  try {
    if (!userStore.userInfo) {
      await userStore.fetchUserInfo()
    }
    if (!userStore.userInfo?.isWithdrawPwd) {
      showConfirmDialog({
        title: $t('withdraw.setPayPasswordTitle'),
        message: $t('withdraw.setPayPasswordRequired'),
        confirmButtonText: $t('withdraw.goSetPayPassword'),
        cancelButtonText: $t('common.cancel')
      }).then(() => {
        router.push({ name: 'Settings' })
      }).catch(() => {})
    }
  } catch (e) {
    // ignore
  }
})

onUnmounted(() => {
  // 清理导航栏右侧按钮
  navBarRight.value = null
})
</script>

<style scoped lang="less">
.withdraw-page {
  background: #ffffff;
  min-height: 100vh;
}

.balance-section {
  padding: 16px;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  border-radius: 0 0 20px 20px;
}

.balance-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.balance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.balance-info {
  flex: 1;
}

.balance-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
}

.balance-amount {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.withdraw-all-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 600;
  padding: 8px 16px;
  height: auto;
}

.balance-footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.balance-tips {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 12px;
}

/* 币种选择区域 */
.currency-section {
  background: white;
  margin: 0 16px 16px;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.currency-options {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.currency-option {
  flex: 1;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.currency-option.active {
  border-color: #1890ff;
  background: #e6f7ff;
}

.currency-symbol {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.currency-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
}

.loading-currency {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

.no-banks {
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

/* 提现限制区域 */
.limits-section {
  background: white;
  margin-top: 16px;
  /* margin: 0 16px 16px; */
  border-radius: 16px;
  padding: 20px 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.vipinfo {
  margin-top: 8px;
  display: flex;
  gap: 4px;
}
.user-level {
  background: rgba(0, 0, 0, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
.limits-info {
  margin-top: 12px;
  padding: 16px 6px;
  background: #f8f9fa;
  border-radius: 8px;
}

.limit-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.limit-item:last-child {
  margin-bottom: 0;
}

.limit-item .label {
  color: #666;
  font-size: 14px;
}

.limit-item .value {
  color: #333;
  font-weight: 600;
  font-size: 14px;
}

/* 账户管理区域 */
.account-section {
  background: white;
  margin: 0 16px 16px;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f3f4;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.no-accounts {
  padding: 20px 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
}

.empty-text {
  color: #999;
  font-size: 14px;
  margin: 0;
}

.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fafbfc;
  position: relative;
  overflow: hidden;
}

.account-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #e5e7eb;
  transition: all 0.3s ease;
}

.account-item:hover {
  border-color: #3b82f6;
  background: #f8faff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.account-item:hover::before {
  background: #3b82f6;
}

.account-item.active {
  border-color: #3b82f6;
  background: #f0f9ff;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
}

.account-item.active::before {
  background: #3b82f6;
}

.account-info {
  flex: 1;
}

.account-type {
  font-size: 17px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 6px;
}

.account-number {
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 4px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.account-name {
  font-size: 13px;
  color: #9ca3af;
  font-weight: 500;
}

.no-accounts {
  text-align: center;
  padding: 20px 20px;
  background: #f9fafb;
  border-radius: 12px;
  border: 2px dashed #d1d5db;
}

.withdraw-form {
  padding: 0 16px 20px;
}
.coin_icon {
  width:18px;
  height:18px
}
.withdraw-form {
  :deep(.title_auto) {
      .van-cell__title {
        margin-left: 4px;
        font-weight: 600;
        color: #374151;
        flex: none;
        margin-right: 24px;
      }
      .van-cell {
        border-bottom: none;
        padding: 0 ;
        &::after {
          border-bottom: none;
        }
      }
      .remind {
        text-align: left;
        line-height: 14px;
        font-size: 12px;
      }
  } 
}

.van-cell .title_class {
  margin-left: 4px;
}
.withdraw-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0px 10px;
}

.withdraw-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.withdraw-info ul {
  margin: 0;
  padding-left: 16px;
}

.withdraw-info li {
  margin-bottom: 6px;
  font-size: 14px;
  color: #666;
}

.withdraw-actions {
  padding: 0 16px 20px;
  margin-top: 10px;
}

/* 添加账户弹窗 */
.add-account-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f1f3f4;
  background: #fafbfc;
}

.popup-header h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}

.close-btn {
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #374151;
}

.add-account-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.popup-actions {
  padding: 20px;
  border-top: 1px solid #f1f3f4;
  background: #fafbfc;
}

/* 全局样式优化 */
:deep(.van-field__label) {
  font-weight: 600;
  color: #374151;
}

:deep(.van-field__left-icon) {
  color: #3b82f6;
}

:deep(.van-cell-group) {
  margin: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

:deep(.van-cell) {
  padding: 20px 16px;
  border-bottom: 1px solid #f1f3f4;
}

:deep(.van-cell:last-child) {
  border-bottom: none;
}

:deep(.van-button--primary) {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

:deep(.van-button--primary:active) {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

:deep(.van-button--primary.van-button--plain) {
  background: transparent;
  color: #3b82f6;
  border: 2px solid #3b82f6;
  box-shadow: none;
}

:deep(.van-button--primary.van-button--plain:active) {
  background: #f0f9ff;
  transform: none;
}

:deep(.van-picker) {
  background: white;
}

:deep(.van-picker__toolbar) {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f3f4;
}

:deep(.van-picker__confirm) {
  color: #3b82f6;
  font-weight: 600;
}

:deep(.van-picker__cancel) {
  color: #6b7280;
}

:deep(.van-popup) {
  border-radius: 20px 20px 0 0;
}

:deep(.van-empty) {
  padding: 40px 20px;
}

:deep(.van-empty__description) {
  color: #6b7280;
  font-size: 15px;
}
</style>
