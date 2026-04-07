<template>
    <van-popup v-model:show="showDialog" position="center" round closeable :style="{ width: '90%', maxWidth: '400px' }"
        @close="handleClose">
        <div class="mobile-verify-dialog">
            <div class="dialog-header">
                <h3>{{ $t('settings.mobileVerify') }}</h3>
            </div>

            <div class="dialog-content">
                <!-- 如果用户已有手机号，显示验证界面 -->
                <div v-if="userStore.userInfo?.mobile" class="verify-existing">
                    <p class="verify-text">{{ $t('settings.verifyExistingMobile') }}</p>
                    <p class="mobile-display">+{{ userStore.userInfo.area_code }} {{ userStore.userInfo.mobile }}</p>

                    <van-field v-model="verifyCode" :placeholder="$t('settings.enterVerifyCode')" type="number"
                        maxlength="6" class="verify-input">
                        <template #button>
                            <van-button size="small" type="primary" :disabled="isSendingCode || countdown > 0"
                                @click="sendVerifyCode">
                                {{ isSendingCode ? $t('settings.sending') : (countdown > 0 ? `${countdown}s` :
                                $t('settings.sendCode')) }}
                            </van-button>
                        </template>
                    </van-field>
                </div>

                <!-- 如果用户没有手机号，显示绑定界面 -->
                <div v-else class="bind-new">
                    <p class="bind-text">{{ $t('settings.bindNewMobile') }}</p>

                    <van-field v-model="newMobile" :placeholder="$t('settings.enterMobileNumber')" type="tel"
                        class="mobile-input" />

                    <van-field v-model="bindCode" :placeholder="$t('settings.enterVerifyCode')" type="number"
                        maxlength="6" class="verify-input">
                        <template #button>
                            <van-button size="small" type="primary" :disabled="isSendingCode || countdown > 0"
                                @click="sendBindCode">
                                {{ isSendingCode ? $t('settings.sending') : (countdown > 0 ? `${countdown}s` :
                                $t('settings.sendCode')) }}
                            </van-button>
                        </template>
                    </van-field>
                </div>

                <div class="dialog-actions">
                    <van-button type="primary" block :loading="isVerifying" @click="handleVerify">
                        {{ userStore.userInfo?.mobile ? $t('settings.verify') : $t('settings.bind') }}
                    </van-button>
                </div>
            </div>
        </div>
    </van-popup>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { showToast } from 'vant'
import { $t } from '@/locales'
import { useUserStore } from '@/store/modules/user'
import { smsSend, smsCheck, smsVerify, bindMobile } from '@/api/sms'

interface Props {
    show: boolean
}

interface Emits {
    (e: 'update:show', value: boolean): void
    (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const userStore = useUserStore()

// 表单数据
const verifyCode = ref('')
const newMobile = ref('')
const bindCode = ref('')

// 状态
const isSendingCode = ref(false)
const isVerifying = ref(false)
const countdown = ref(0)

// 计算属性
const showDialog = computed({
    get: () => props.show,
    set: (value) => emit('update:show', value)
})

// 监听弹窗关闭，重置表单
watch(() => props.show, (newVal) => {
    if (!newVal) {
        resetForm()
    }
})

// 重置表单
const resetForm = () => {
    verifyCode.value = ''
    newMobile.value = ''
    bindCode.value = ''
    isSendingCode.value = false
    isVerifying.value = false
    countdown.value = 0
}

// 关闭弹窗
const handleClose = () => {
    emit('update:show', false)
}

// 发送验证码（验证已有手机号）
const sendVerifyCode = async () => {
    if (!userStore.userInfo?.mobile) {
        showToast($t('settings.noMobileNumber'))
        return
    }

    try {
        isSendingCode.value = true
        const res = await smsSend({
            mobile: userStore.userInfo.mobile,
            event: 'phone',
            area_code: String(userStore.userInfo.area_code || '84')
        })

        showToast($t('settings.codeSent'))
        startCountdown()
    } catch (error) {
        console.error('发送验证码失败:', error)
        showToast(error.msg || $t('settings.sendCodeFailed'))
    } finally {
        isSendingCode.value = false
    }
}

// 发送验证码（绑定新手机号）
const sendBindCode = async () => {
    if (!newMobile.value) {
        showToast($t('settings.enterMobileNumber'))
        return
    }

    try {
        isSendingCode.value = true
        const res = await smsSend({
            mobile: newMobile.value,
            event: 'bind',
            area_code: '84' // 默认越南区号
        })

        showToast($t('settings.codeSent'))
        startCountdown()
    } catch (error) {
        console.error('发送验证码失败:', error)
        showToast(error.msg || $t('settings.sendCodeFailed'))
    } finally {
        isSendingCode.value = false
    }
}

// 开始倒计时
const startCountdown = () => {
    countdown.value = 60
    const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
            clearInterval(timer)
        }
    }, 1000)
}

// 处理验证
const handleVerify = async () => {
    if (userStore.userInfo?.mobile) {
        // 验证已有手机号
        if (!verifyCode.value) {
            showToast($t('settings.enterVerifyCode'))
            return
        }

        try {
            isVerifying.value = true
            const res = await smsVerify({
                captcha: verifyCode.value,
                event: 'phone'
            })

            showToast($t('settings.verifySuccess'))
            emit('success')
            handleClose()
            // 刷新用户信息
            await userStore.fetchUserInfo()
        } catch (error) {
            console.error('验证失败:', error)
            showToast(error.msg || $t('settings.verifyFailed'))
        } finally {
            isVerifying.value = false
        }
    } else {
        // 绑定新手机号
        if (!newMobile.value || !bindCode.value) {
            showToast($t('settings.enterMobileAndCode'))
            return
        }

        try {
            isVerifying.value = true
            const res = await bindMobile({
                mobile: newMobile.value,
                area_code: '84',
                captcha: bindCode.value
            })

            showToast($t('settings.bindSuccess'))
                emit('success')
                handleClose()
                // 刷新用户信息
                await userStore.fetchUserInfo()
        } catch (error) {
            console.error('绑定失败:', error)
            showToast(error.msg || $t('settings.bindFailed'))
        } finally {
            isVerifying.value = false
        }
    }
}
</script>

<style scoped>
.mobile-verify-dialog {
    padding: 20px;
}

.dialog-header {
    text-align: center;
    margin-bottom: 20px;
}

.dialog-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
}

.verify-text,
.bind-text {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #666;
}

.mobile-display {
    margin: 0 0 15px 0;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    text-align: center;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 6px;
}

.mobile-input,
.verify-input {
    margin-bottom: 15px;
}

.dialog-actions {
    margin-top: 20px;
}
</style>
