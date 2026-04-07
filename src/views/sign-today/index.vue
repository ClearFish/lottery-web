<template>
    <div class="box">
        <div v-if="!showLoading">
            <div class="top_container">
                <div class="avatar_box">
                     <img 
                        v-if="userStore.userInfo?.avatar && userStore.userInfo?.avatar.trim() !== ''" 
                        class="avatar"
                        :src="userStore.userInfo?.avatar" 
                        :alt="userStore.userInfo?.username"
                        @error="handleImageError"
                    />
                     <div class="avatar-placeholder" v-else>
                        {{ getInitials(userStore.userInfo?.nickname || userStore.userInfo?.username) }}
                    </div>
                </div>
                <div class="in_box">
                    <text class="login_title">{{userStore.userInfo?.mobile}}</text>
                    <div class="content_box">
                        <div class="money_box">
                            <div class="money" v-for="(item,key) in userStore.userInfo?.Balances" :key="key">
                                <text class="money_content">{{ item.balance }}</text>
                                <text class="money_title">{{ item.symbo }}</text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="top_pad">
                <div class="top_cont">
                    <div class="top_item" v-for="(item,index) in topList" :key="index">
                        <div class="value">{{item.value}}</div>
                        <div class="title">{{item.name}}</div>
                    </div>
                </div>
            </div>
            <div class="intro_cont">
                <div class="top_intro">
                    <div class="top_left">
                        <img src="@/assets/signin/gift.png" alt="">
                        <div class="word">
                            <div>{{$t('sign.Login_Bonous')}}</div>
                            <div class="sub_title">
                                <div>{{$t('sign.Sign_in_today')}}</div>
                                <img src="@/assets/signin/question.svg" alt="" @click="showTips(todaySign,0)">
                            </div>
                        </div>
                    </div>
                    <div class="top_right" @click="toSign">
                        {{$t('sign.Sign_in')}}
                    </div>
                </div>
                <div class="detail_cont">
                    <div class="detail_box">
                        <div class="left">
                            <div>{{$t('sign.Minimum_bet_amount')}}:</div>
                            <div class="amount">{{todaySign.valid_bet}}VND</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sign_box">
                <div class="sign_list">
                    <div class="sign_item" v-for="(item,index) in dayList" :key="index">
                        <div class="top_con">
                            <div :style="item.hasSigned ? 'color:#f32246' :''">{{$t('sign.Day')}} {{item.schedule_day}}</div>
                            <img src="@/assets/signin/question.svg" alt="" @click="showTips(item,1)">
                        </div>
                        <div class="other">
                            <img src="@/assets/signin/coin.png" alt="">
                            <div>{{$t('sign.Bonous')}}: {{item.bonus}}VND</div>
                        </div>
                        <div class="signed_icon">
                            <img src="@/assets/signin/signed.svg" alt="" v-if="item.hasSigned">
                        </div>
                    </div>
                </div>
            </div>
            <div class="rule_box">
                <div class="title">{{$t('sign.Sign_Rules')}}</div>
                <div class="content">{{$t('sign.Sign_Rules')}}</div>
            </div>
        </div>
        <div class="loading-overlay" v-if="showLoading">
            <div class="loading-spinner">
                <div class="spinner"></div>
                <div class="loading-text">{{ $t('sign.Loading') }}</div>
            </div>
        </div>
        <van-popup 
                :show="tipsShow"
                class="rulePopup"
                round
                safeAreaInsetTop 
                safeAreaInsetBottom>

            <div class="container">
                <img src="@/assets/signin/close.jpg" alt="" @click="tipsShow = false">
                <div class="mind_box">
                    <div class="title">{{dayType == 0 ? $t('profile.today') : $t('sign.Day')+showItem.schedule_day}}</div>
                    <div class="content">
                        <div class="value">{{$t('sign.Minimum_bet_amount')}}: {{showItem.valid_bet}}VND</div>
                        <div class="reward">{{$t('promotionactivity.Reward')}}</div>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script lang='ts' setup>
import {ref,onMounted} from "vue"
import { $t } from '@/locales'
import {signinConfig,signinRecord,signinReceive} from '@/api/sign'
import { useUserStore } from '@/store/modules/user'
import { showToast } from 'vant'
const userStore = useUserStore()
const dayList:any = ref([])
const tipsShow:any = ref(false)
const showItem:any = ref({})
const dayType:any = ref(0)
const todaySign:any = ref({})
const showLoading:any = ref(false)
const topList = ref([
    {name:$t('sign.Sign_in_frequency'),value:''},
    {name:$t('sign.Continuous_times'),value:''},
    {name:$t('sign.Total_reward_collection'),value:''}
]) 
onMounted(()=>{
    getConfigRecord()
})
const showTips =(item:any,type:any)=> {
    showItem.value = item;
    dayType.value = type
    tipsShow.value = true
}
// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  // 显示默认头像
  const placeholder = img.nextElementSibling as HTMLElement
  if (placeholder) {
    placeholder.style.display = 'flex'
  }
}
// 获取用户名首字母
const getInitials = (name: string) => {
  if (!name) return 'U'
  return name.charAt(0).toUpperCase()
}
const getConfigRecord = async()=> {
    showLoading.value = true
    let resConfig:any = await signinConfig();
    let resRecord:any = await signinRecord();
    topList.value[0].value = resConfig.sigin_number;
    topList.value[1].value = resConfig.in_sigin_number;
    topList.value[2].value = resConfig.sigin_total_bonous;
    // dayList.value = resConfig.data.row;
    let rowRecord = resRecord.rows;
    resConfig.row.map(item=>{
        let findIndex = rowRecord.findIndex(ite=>ite.schedule_day == item.schedule_day);
        if(findIndex == -1) {
            item.hasSigned = false
        }else {
            item.hasSigned = true
        }
    })
    todaySign.value = resConfig.today_sigin
    dayList.value = resConfig.row;
    showLoading.value = false
    
}
const toSign=async()=> {
    try {
       await signinReceive();
      showToast($t('sign.sign_Success'))
      getConfigRecord()
    }catch(error){
        showToast(error.msg)
    }
}
</script>
<style lang="less" scoped>
.box {
    width: 100%;
    min-height: 100vh;
    background: #F5F5F9;
    padding-bottom: 4px;
    .top_container {
        width: 100%;
        height: 172px;
        background: url("@/assets/signin/top_bg.png") no-repeat center;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        padding-left: 10px;
        box-sizing: border-box;
        gap: 10px;
        .avatar_box {
            padding: 4px;
            box-sizing: border-box;
            background: #9fd2f9;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                width: 69px;
                height: 69px;
                border-radius: 50%;
            }
            .avatar-placeholder {
                width: 69px;
                height: 69px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                background: rgba(255, 255, 255, 0.2);
                font-size: 24px;
                font-weight: 700;
                color: white;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            }
        }
        .in_box {
            .login_title {
                font-size: 14px;
                font-weight: 600;
                color: #fff;
            }
            .content_box {
                margin-top: 10px;
                .money_box {
                    color: #fff;
                    font-size: 16px;
                    font-weight: 600;
                    .money {
                        display: flex;
                        gap: 6px;
                        align-items: center;
                    }
                }
            }
        }
    }
    .top_pad {
        padding: 0 20px;
        margin-top: -40px;
        box-sizing: border-box;
        .top_cont {
            width: 100%;
            background: #fff;
            border-radius: 12px;
            padding: 16px 0;
            box-sizing: border-box;
            display: flex;
            .top_item {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                row-gap: 8px;
                border-right: 1px solid #b3b3b3;
                .title {
                    color: #b3b3b3;
                    font-size: 12px;
                    padding: 0 8px;
                    text-align: center;
                    // height: 32px;
                }
                .value {
                    font-weight: 900;
                    font-size: 16px;
                }
                &:last-child {
                    border-right: none;
                    .value {
                        color: #e539ff;
                    }
                }
                &:nth-child(1) {
                    .value {
                        color: #2476ff;
                    }
                }
                &:nth-child(2) {
                    .value {
                        color: #fe3b44;
                    }
                }
            }
        }
    }
    .intro_cont {
        margin-top: 10px;
        background: #fff;
        padding-bottom: 20px;
        .top_intro {
            width: 100%;
            border-top: 1px solid #b3b3b3;
        }
        .top_intro {
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .top_left {
                display: flex;
                align-items: center;
                gap: 6px;
                img {
                    width: 43px;
                    height: 38px;
                }
                .word {
                    font-size: 12px;
                    color: #fe3b44;
                    font-weight: 800;
                    .sub_title {
                        display: flex;
                        align-items: center;
                        color: #999;
                        font-size: 10px;
                        font-weight: 600;
                        gap: 4px;
                        img {
                            width: 14px;
                            height: 14px;
                        }
                    }
                }
            }
            .top_right {
                width: 90px;
                flex-shrink: 0;
                padding: 8px 9px;
                border-radius: 40px;
                background: linear-gradient(90deg,#f8493f,#fd603f);
                display: flex;
                justify-content: center;
                color: #fff;
                font-size: 12px;
                font-weight: 600;
            }
        }
        .detail_cont {
            padding: 0 20px;
            box-sizing: border-box;
            .detail_box {
                border-radius: 8px;
                padding: 16px;
                background: #fff8f1;
                display: flex;
                box-sizing: border-box;
                .left {
                    color: #6f6f6f;
                    font-size: 14px;
                    .amount {
                        color: #f32246;
                        margin-top: 4px;
                    }
                }
            }
        }
    }
    .sign_box {
        margin-top: 10px;
        background: #fff;
        padding:  20px;
        padding-bottom: 10px;
        box-sizing: border-box;
        .sign_list {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 5%;
            flex-wrap: wrap;
            .sign_item {
                width: 30%;
                border-radius: 4px;
                box-sizing: border-box;
                padding: 10px;
                background: #f9f6ef;
                margin-bottom: 12px;
                height: 130px;
                position: relative;
                .top_con {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 12px;
                    color: #6e6e6e;
                    img {
                        width: 14px;
                        height: 14px;
                    }
                }
                .other {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: #f94b3f;
                    gap: 8px;
                    margin-top: 16px;
                    font-size: 12px;
                    img {
                        width: 38px;
                        height: 38px;
                        margin: 0 auto;
                    }
                }
                .signed_icon {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    border-radius: 0 0 4px 0;
                    img {
                        width: 32px;
                        height: 32px;
                        border-radius: 0 0 4px 0;
                    }
                }
            }
        }
    }
    .rule_box {
        margin-top: 10px;
        width: 100%;
        background: #fff;
        padding: 20px;
        box-sizing: border-box;
        .title {
            font-size: 16px;
            color: #f94b3f;
            font-weight: 600;
        }
        .content {
            color: #6e6e6e;
            font-size: 14px;
        }
    }
    ::v-deep {
        .rulePopup {
            background: transparent;
            .container {
                width: 320px;
                height: 380px;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                img {
                    width: 32px;
                    height: 32px;
                    position: absolute;
                    top: 0;
                    right: 0;
                }
                .mind_box {
                    width: 220px;
                    height: 280px;
                    background: #f9f6ef;
                    border-radius: 4px;
                    padding: 20px;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 30px;
                    .title {
                        color: #656565;
                        font-size: 22px;
                        font-weight: 700;
                    }
                    .content {
                        .value {
                            color: #f94b3f;
                            text-align: center;
                        }
                        .reward {
                            color: #6e6e6e;
                            font-size: 18px;
                            font-weight: 600;
                            text-align: center;
                            margin-top: 16px;
                        }
                    }
                }
            }
        }
    }
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }

    .loading-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }

    .spinner {
        width: 60px;
        height: 60px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .loading-text {
        font-size: 14px;
        color: #666;
    }
}
</style>