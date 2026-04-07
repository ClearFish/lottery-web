<template>
    <div class="info_box">
        <div class="container">
            <div class="top_info">
                <div class="number_info">{{countInfo.YesterDayRebateAmount}}</div>
                <div class="sub_title">{{ $t('invite.yester_commision') }}</div>
                <div class="number_intro">{{ $t('invite.Upgrade_the_level') }}</div>
            </div>
            <div class="info_content">
                <div class="left">
                    <div class="top_title">{{ $t('invite.Direct_Subordinates') }}</div>
                    <div class="bottom_contet">
                        <div class="item_c">
                            <div class="info">{{countInfo.YesterDayRegisterNumber}}</div>
                            <div class="label">{{ $t('invite.Number_Register') }}</div>
                        </div>
                        <div class="item_c">
                            <div class="info">{{countInfo.YesterDayPayCount}}</div>
                            <div class="label">{{ $t('invite.Deposit_Number') }}</div>
                        </div>
                        <div class="item_c">
                            <div class="info">{{countInfo.YesterDayPayAmount}}</div>
                            <div class="label">{{ $t('invite.Deposit_Amount') }}</div>
                        </div>
                        <div class="item_c">
                            <div class="info">{{countInfo.YesterDayOneRecharge}}</div>
                            <div class="label">{{ $t('invite.Number_first_deposit') }}</div>
                        </div>
                    </div>
                </div>
                <div class="left">
                    <div class="top_title">{{ $t('invite.Team_Subordinates') }}</div>
                    <div class="bottom_contet">
                        <div class="item_c">
                            <div class="info">{{countInfo.YesterDayTeamRegisterNumber}}</div>
                            <div class="label">{{ $t('invite.Number_Register') }}</div>
                        </div>
                        <div class="item_c">
                            <div class="info">{{countInfo.YesterDayTeamPayAmount}}</div>
                            <div class="label">{{ $t('invite.Deposit_Number') }}</div>
                        </div>
                        <div class="item_c">
                            <div class="info">{{countInfo.YesterDayTeamPayCount}}</div>
                            <div class="label">{{ $t('invite.Deposit_Amount') }}</div>
                        </div>
                        <div class="item_c">
                            <div class="info">{{countInfo.YesterDayTeamOneRecharge}}</div>
                            <div class="label">{{ $t('invite.Number_first_deposit') }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="link_btn" @click="copyLink">{{ $t('invite.Invitation_Link') }}</div>
            <div class="promotion_box">
                <div class="title_content">
                    <img src="@/assets/inviteinfo/wallet.png" alt="">
                    <div class="word">{{ $t('invite.Promotion_Data') }}</div>
                </div>
                <div class="info_cont">
                    <div class="left_c">
                        <div class="item_c" @click="getReward">
                            <div class="value">{{sharDetails.invite_balance && sharDetails.invite_balance.length && sharDetails.invite_balance[0].balance}} VND</div>
                            <div class="label">{{ $t('invite.Deposit_Reward') }}</div>
                        </div>
                    </div>
                    <div class="left_c">
                        <div class="item_c">
                            <div class="value">{{sharDetails.total_invite &&  sharDetails.total_invite.SYSTEM &&  sharDetails.total_invite.SYSTEM.balance}} VND</div>
                            <div class="label">{{ $t('invite.Historical_bonuses') }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="menus_box">
                <div class="menus_item" v-for="(item,index) in menuList" :key="index" @click="actItem(item)">
                    <div class="item_left">
                        <img :src="item.icon"/>
                        <div class="item_word">{{ item.name }} <text v-if="item.showCode" style="margin-left:12px">{{sharDetails.invite_code}}</text></div>
                    </div>
                    <van-icon name="arrow" size="18" color="#B9BDC6"></van-icon>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script lang="ts" setup>
import {ref,onMounted} from "vue"
import {rebateInfo,getShare } from '@/api/promotions'
import { useUserStore } from '@/store/modules/user'
import { $t } from '@/locales'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'
import Icon1 from "@/assets/inviteinfo/icon1.png"
import Icon2 from "@/assets/inviteinfo/icon2.png"
import Icon3 from "@/assets/inviteinfo/icon3.png"
import Icon4 from "@/assets/inviteinfo/icon4.png"
import Icon5 from "@/assets/inviteinfo/icon5.png"
import Icon6 from "@/assets/inviteinfo/icon6.png"
import Icon7 from "@/assets/inviteinfo/icon7.png"
const userStore = useUserStore()
const router = useRouter()

const menuList:any = ref(
    [
        {name:$t('invite.Deposit_Bonus'),icon:Icon1,url:'/deposit-bonus'},
        {name:$t('invite.Copy_Invitation_Code'),icon:Icon2,url:'',showCode:true},
        {name:$t('invite.Subordinate_Data'),icon:Icon3,url:'/inviteinfo-report'},
        {name:$t('invite.Invitation_Rules'),icon:Icon4,url:'/invite-rules'},
        {name:$t('invite.Rebate_Ratio'),icon:Icon7,url:'/invite-rebate'}
    ]   
)
const countInfo:any = ref({})
const sharDetails:any = ref({})
const systemInfo:any =ref({})
onMounted(()=>{
    getData()
    getShares()
})
const getData=()=>{
    rebateInfo().then(res=>{
        countInfo.value = res 
    })
}
const getReward=()=> {
    if (!userStore.userInfo?.isWithdrawPwd) {
        console.log('未设置密码')
        router.push({ name: 'Settings' })
    }else {
        router.push({ name: 'Withdraw' })
    }
}
const getShares=()=> {
    getShare().then((res:any)=>{
        sharDetails.value = res;
        res.bonus.SYSTEM.canGet = Number(res.bonus.SYSTEM.not_received_bonus) > 0;
        res.bonus.USDT.canGet = Number(res.bonus.USDT.not_received_bonus) > 0;
        systemInfo.value = res.bonus.SYSTEM
    })
}
const copyLink=async()=> {
    let url = window.location.origin +'/?sharecode='+ userStore.userInfo?.invite_code
    try {
        await navigator.clipboard.writeText(url)
        showToast($t('deposit.copiedToClipboard'))
    } catch (error) {
        showToast($t('deposit.copyFailed'))
    }
}
const actItem=async(item:any)=> {
    if(item.url) {
       router.push(item.url)
    }else {
        try {
            await navigator.clipboard.writeText(userStore.userInfo?.invite_code)
            showToast($t('deposit.copiedToClipboard'))
        } catch (error) {
            showToast($t('deposit.copyFailed'))
        }
    }
}
</script>
<style lang="less" scoped>
@font-face {
    font-family: 'Archive';
    src: url("@/assets/font/Archive.otf");
}
@font-face {
    font-family: Radnickdemo;
    src: url("@/assets/font/Radnickdemo-vmqLM.otf");
}
.info_box {
    box-sizing: border-box;
    padding-bottom: 90px;
    background: #fff;
    position: relative;
    .container {
        padding: 0 16px;
        box-sizing: border-box;
        padding-top: 10px;
    }
    .top_box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        color: #fff;
        font-size: 16px;
        font-weight: 700;
        background:#0f1923;
        padding:0 16px;
        box-sizing:border-box;
        position: fixed;
        top: 0;
        left: 0;
    }
    .top_info {
        display: flex;
        flex-direction: column;
        align-items: center;
        .number_info {
            font-size: 28px;
            color: #241B3A;
            font-weight: 700;
        }
        .sub_title {
            padding: 4px 14px;
            background: rgba(67, 77, 252, 0.15);
            color: #434DFC;
            font-family: "Archive";
            font-size: 12px;
            margin-top: 4px;
            border-radius: 15px;
        }
        .number_intro {
            font-size: 12px;
            margin-top: 4px;
            color: #858996;
        }
    }
    .info_content{
        display: flex;
        width: 100%;
        gap: 8px;
        justify-content: space-between;
        margin-top: 15px;
        .left {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            .top_title {
                font-family: 'Radnickdemo';
                color: #3EAFFE;
                font-size: 12px;
                width:144px;
                height: 44px;
                background:url("@/assets/inviteinfo/title_bg.png") no-repeat center;
                background-size: 100% 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .bottom_contet {
                width: 100%;
                height: 210px;
                // background:url("@/static/inviteinfo/content_bg.png") no-repeat center;
                // background-size: 100% 100%;
                background-image: linear-gradient(134deg, #A5D9FE 0%, #0699FF 100%);
                border-radius: 10px;
                margin-top: -10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                .item_c {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0 16px;
                    .info {
                        font-size: 16px;
                        color: #fff;
                        font-weight: 900;
                        height: 24px;
                        line-height: 24px;
                    }
                    .label {
                        font-size: 12px;
                        color: #fff;
                        text-align: center;
                    }
                }
            }
            &:last-child {
                .top_title {
                    color: #937BF8;
                }
                .top_title {
                    background:url("@/assets/inviteinfo/title_bg2.png") no-repeat center;
                    background-size: 100% 100%;
                }
                .bottom_contet {
                    background-image: linear-gradient(136deg, #C89FFF 0%, #7768F4 100%);
                    border-radius: 10px;
                }
            }
        }
    }
    .link_btn {
        width: 100%;
        margin-top: 15px;
        height: 40px;
        border-radius: 20px;
        background-image: linear-gradient(180deg, #6B77FD 0%, #080EF9 100%);
        color: #fff;
        text-align: center;
        line-height: 40px;
        font-size: 15px;
        font-weight: 900;
    }
    .promotion_box {
        margin-top: 15px;
        // background: url("@/static/inviteinfo/promotion.png") no-repeat center;
        // background-size: 100% 100%;
        background: #EFF4F8;
        width: 100%;
        // height: 182px;
        padding: 10px 20px;
        box-sizing: border-box;
        .title_content {
            display: flex;
            align-items: center;
            color: #3C4395;
            font-size: 14px;
            font-family: 'Radnickdemo';
            gap: 10px;
            img {
                width: 16px;
                height: 21px;
            }
        }
        .info_cont {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            padding-top: 10px;
            // &::after {
            //     content: "";
            //     width: 100%;
            //     height: 0.5px;
            //     background: #fcc2787d;
            //     position: absolute;
            //     left: 0;
            //     top: 50%;
            //     transform: translateY(-50%);
            // }
            // &::before {
            //     content: "";
            //     width: 1px;
            //     height: 72px;
            //     background: #fcc2787d;
            //     position: absolute;
            //     left: 50%;
            //     top: 50%;
            //     transform: translate(-50%,-50%);
            // }
            .left_c {
                flex: 1;
                display: flex;
                flex-direction: column;
                .item_c {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    height: 62px;
                    .value {
                        color: #333333;
                        font-weight: 700;
                        font-size: 16px;
                    }
                    .label {
                        font-size: 12px;
                        color: #858996;
                        text-align: center;
                        margin-top: 5px;
                        padding: 0 10px;
                    }
                }
            }
            .add_margin {
                margin-top: 6px;
            }
        }
    }
    .menus_box {
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        width: 100%;
        gap:10px;
        .menus_item {
            display: flex;
            padding: 0 18px;
            box-sizing: border-box;
            background: #EFF4F8;
            height: 60px;
            justify-content: space-between;
            align-items: center;
            font-weight: 400;
            font-size: 14px;
            color: #333333;
            border-radius: 8px;
            .item_left {
                display: flex;
                align-items: center;
                gap: 11px;
                img {
                    width: 16px;
                }

            }
        }
    }
}
</style>