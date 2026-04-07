<template>
    <div class="promotion_box" :class="locked ? 'locked_box' : ''">
        <div class="tab_box">
            <div class="tab_item" v-for="(item,index) in tabList" :key="index" @click="toPath(item)" :class="index == 2 ? 'referal_box' :''">
                <div class="img_box">
                    <img :src="item.v_icon" alt="">
                </div>
                <div class="title">{{item.name}}</div>
            </div>
        </div>
        <div class="shar_box">
            <div class="share_container">
                <div class="title_box">
                    {{$t('promotionactivity.Share_to_your_friend')}}
                </div>
                 <div class="label">{{$t('promotionactivity.Invitation_URL')}}</div>
                <div class="content_box">
                    <div class="left_content">
                       
                        <div class="url_content" @click="copy(baseUrl +'/?sharecode='+userStore.userInfo?.invite_code)">
                            <div class="ur_box">{{baseUrl +'/?sharecode='+ userStore.userInfo?.invite_code}}</div>
                            <img src="@/assets/promotions/copy.svg" alt="" @click="copy(baseUrl +'/?sharecode='+ userStore.userInfo?.invite_code)">
                        </div>
                        <div class="bottom_aciton">
                            <div class="share" @click="showSharDialog">{{$t('promotionactivity.tabber_share')}}</div>
                            <div class="share my_team" @click="toTeam">{{$t('promotionactivity.My_Team')}}</div>
                        </div>
                    </div>
                    <div class="right_content" @click="showSharDialog" v-if="userStore.userInfo?.invite_code">
                        <QrcodeVue :value="userStore.userInfo?.invite_code" />
                    </div>
                </div>
            </div>
        </div>
        <div class="annouce_box">
            <div class="annouce_item" v-for="(item,index) in announceList" :key="index" @click="toPath(item)">
                <img :src="item.img" alt="">
                <div class="title">{{item.name}}</div>
                <div class="conent">{{item.content}}</div>
            </div>
        </div>
        <div class="container">
            <div class="list_container">
                <div class="list_item" v-for="(item,index) in lists" :key="index" @click="toDetails(item)">
                    <img :src="item.image" alt="">
                    <div class="content_box">
                        <text class="tiitle">{{item.title}}</text>
                        <div class="action">
                            <div class="more_box" @click="toDetails(item)">{{$t('promotionactivity.More')}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ShareDialog ref="share" @closeShare="closeShare"/>
    </div>
</template>
<script lang="ts" setup>
import {ref,onMounted} from "vue"
import { $t } from '@/locales'
import Tabe1 from "@/assets/promotions/tab_1.png"
import Tabe2 from "@/assets/promotions/tab_2.png"
import Tabe3 from "@/assets/promotions/tab_3.png"
import Tabe4 from "@/assets/promotions/tab_4.png"
import Announce1 from "@/assets/promotions/gift_banner.png"
import Announce2 from "@/assets/promotions/bonous_banner.png"
import { activity,invite_balance } from '@/api/promotions'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import QrcodeVue from "qrcode.vue"
import ShareDialog from "@/components/Share/index.vue"
import path from "path"

const baseUrl = window.location.origin
const router = useRouter()
const userStore = useUserStore()

const tabList = ref([
    {name:$t('promotionactivity.promotion_deposit'),v_icon:Tabe1,url:'/deposit-bonus'},
    {name:$t('promotionactivity.Betting_Reward'),v_icon:Tabe2,url:"/promotion-activity/bettingrewars"},
    {name:$t('promotionactivity.Invitation_Bonus'),v_icon:Tabe3,url:'/invite?type=Mission'},
    {name:$t('promotionactivity.Lucky_Spin'),v_icon:Tabe4,url:"/turnable"}
])
const announceList =  ref([
    {name:$t('promotionactivity.Gifts'),content:$t('promotionactivity.Enter_th_gift_codes'),img:Announce1,url:'/giftcode'},
    {name:$t('promotionactivity.Attendance_Bonus'),content:$t('promotionactivity.The_more_consecutive_days'),img:Announce2,url:'/sign-today'}
])
const lists:any = ref([])
const show = ref(false)
const locked = ref(false)
const share = ref(null)

const toPath = (item:any)=>{
    router.push(item.url)
}
const showSharDialog =()=> {
    locked.value = true
    share.value && share.value.open(3)
}
const closeShare=()=> {
    locked.value = false
}
const toTeam =()=> {
    // "/pages/invite/index?type=2"
    router.push('/invite?type=Bonous')
}
const copy=async(url:any)=> {
    try {
        await navigator.clipboard.writeText(url)
        showToast($t('deposit.copiedToClipboard'))
    } catch (error) {
        showToast($t('deposit.copyFailed'))
    }
}
const getActivity=()=>{
    activity().then((res:any) =>{
        lists.value = res.rows;
    })
}
const toDetails=(item)=> {
    if(item.id == 12) {
        // uni.navigateTo({
        //     url:'/pages/t'
        // });
        router.push('')
    }else if(item.id == 13) {
        //     uni.navigateTo({
        //     url:'/pages/t2'
        // });
        router.push('')
    }else if(item.id == 16) {
        window.open('https://t.me/LICVIP_official')
    }else {
        // uni.navigateTo({
        //     url:'/pages/activity/index?id='+item.id
        // })
        router.push('/promotion-activity/details?id='+item.id)
    }
}
onMounted(()=>{
    getActivity()
})
</script>
<style lang="less" scoped>
.promotion_box {
    background: #fff;
    color: #77819B;
    min-height: 100vh;
    .tab_box {
        padding: 0 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        .tab_item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 90px;
            .img_box {
                width: 46px;
                height: 46px;
                img {
                    width: 46px;
                    height: 46px;
                }
            }
            .title {
                width: 52px;
                color: #333;
                font-size: 12px;
                text-align: center;
                line-height: 14px;
                margin-top: 2px
            }
        }
        .referal_box {
            .img_box {
                background-image: linear-gradient(180deg, #0AC1DA 0%, #3AE1C9 100%);
                border-radius: 8px;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: 24px;
                    height: 24px;
                }
            }
        }
    }
    .shar_box {
        padding: 10px;
        margin-top: 10px;
        box-sizing: border-box;
        .share_container {
            background: linear-gradient(180deg,#5eafef,#3487f6);;
            border-radius: 6px;
            padding: 12px;
            box-sizing: border-box;
            .title_box {
                display: flex;
                justify-content: center;
                height: 20px;
                line-height: 20px;
                font-family: Radnickdemo;
                font-size: 14px;
                 background: linear-gradient(to right, #FFD2A6, #FEE9D2); /*设置渐变的方向从左到右 颜色从ff0000到ffff00*/
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                img {
                    width: 155px;
                    height: 20px;
                }
            }
            .label {
                color: #fff;
            }
            .content_box {
                display: flex;
                align-items: center;
                gap: 10px;
                .left_content {
                    width: calc(100% - 100px);
                    .label {
                        font-size: 14px;
                        color: #666666;
                    }
                    .url_content {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 10px;
                        background: #fff;
                        border-radius: 4px;
                        padding: 10px 8px;
                        font-size: 14px;
                        color: #666666;
                        margin-top: 8px;
                        .ur_box {
                            width: 90%;
                            word-break: break-all;
                        }
                        img {
                            width: 14px;
                            height: 14px;
                        }
                    }
                    .bottom_aciton {
                        display: flex;
                        justify-content: space-between;
                        gap: 10px;
                        margin-top: 10px;
                        .share {
                            flex:1;
                            height: 36px;
                            border-radius: 4px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            color: #3A3329;
                            font-size: 14px;
                            background-image: linear-gradient(90deg, #FFE3B8 0%, #FED594 100%);
                        }
                        .my_team {
                           background-image: linear-gradient(90deg, #FFE3B8 0%, #FED594 100%);
                        }
                    }
                }
                .right_content {
                    width: 95px;
                    height: 95px;
                }
            }
        }
    }
    .annouce_box {
        margin-top: 15px;
        padding: 0 10px;
        display: flex;
        gap: 10px;
        .annouce_item {
            width: 49%;
            border-radius: 6px;
            background: #FFFFFF;
            box-shadow: 0 2px 4px 4px #0068890d;
            padding-bottom: 10px;
            img {
                width: 100%;
                height: auto;
                border-radius: 6px 6px 0 0;
            }
            .title {
                padding-left: 8px;
                box-sizing: border-box;
                font-weight: 600;
                font-size: 16px;
                color: #333333;
            }
            .conent {
                padding-left: 8px;
                padding-right: 12px;
                box-sizing: border-box;
                font-weight: 400;
                font-size: 13px;
                color: #666666;
            }
        }
    }
    .container {
        padding: 10px;
        .top_title {
            display: flex;
            gap:16px;
            font-size: 20px;
            font-weight: 700;
            img {
                width: 24px;
                height: 24px;
            }
        }
        .list_container {
            margin-top: 10px;
            .list_item {
                margin-bottom: 10px;
                img {
                    width: 100%;
                    height: auto;
                    border-radius: 4px;
                }
                .content_box {
                    padding-left: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    .tiitle {
                        font-size: 16px;
                        width: 80%;
                        color: #333333;
                    }
                    .action {
                        display: flex;
                    }
                    .more_box {
                        padding: 5px 15px;
                        font-size: 12px;
                        color: #fff;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: #4E75E2;
                        border-radius: 4px;
                        flex-shrink: 0;
                        margin-top: 6px;
                        font-weight: 800;
                    }
                }
            }
        }
    }
}
.locked_box {
    overflow: hidden;
    min-height: 0;
    height: 100vh;
}
</style>