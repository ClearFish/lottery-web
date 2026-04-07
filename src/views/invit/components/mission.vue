<template>
    <div class="bg_box" :class="locked ? 'locked' : ''">
        <div class="shar_box">
           <div class="share_container">
                <div class="title_box">
                    {{$t('promotionactivity.Share_to_your_friend')}}
                </div>
                 <div class="label">{{$t('promotionactivity.Invitation_URL')}}</div>
                <div class="content_box">
                    <div class="left_content">
                       
                        <div class="url_content" @click="copy(userStore.userInfo?.invite_code)">
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
        <div class="list_box">
            <div class="list_container">
                <div v-if="list && list.length" class="list_box">
                    <div class="item_box" v-for="(item,index) in list" :key="index">
                        <div class="first_box">
                            <div class="img_box">
                                <img :src="Icon0" alt="" v-if="index==0"/>
                                <img :src="Icon1" alt="" v-else-if="index==1"/>
                                <img :src="Icon2" alt="" v-else-if="index==2"/>
                                <img :src="Icon3" alt="" v-else-if="index==3"/>
                                <img :src="Icon4" alt="" v-else-if="index==4"/>
                                <img src="@/assets/invite/icon_5.png" alt="" v-else/>
                            </div>
                            <div class="center">
                                <div class="content">{{item.synopsis}}</div>
                                <div class="bonous">
                                    <img src="@/assets/invite/rewords_icon.svg" alt="">
                                    <div>{{item.bonus}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="right_box">
                            <div class="progress">
                                <div class="hase_done">{{item.completed}}/</div>
                                <div>{{item.schedule}}</div>
                            </div>
                            <div v-if="item.completed>=item.schedule">
                                <div v-if="item.receive" class="right received">{{$t("promotionactivity.Received")}}</div>
                                <div v-else class="right right_1" @click="receiveBonous(item)">{{$t("promotionactivity.Receive")}}</div>
                            </div>
                            <div v-else>
                                <div class="right">{{$t("promotionactivity.Incomplete")}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="loading && !list.length" class="no_data">
                    <div class="loading-overlay">
                        <div class="loading-spinner">
                            <div class="spinner"></div>
                            <div class="loading-text">{{ $t('common.loading') }}</div>
                        </div>
                    </div>
                </div>
                <div v-else class="no_data">
                    <van-empty  :description="$t('followActivity.noActivity')"/>
                </div>
            </div>
        </div>
        <div class="word_c">
            <div class="rules_box">
                <div class="title">{{ $t('promotionactivity.Activity_Rules') }}</div>
                <div class="rule_content first_child">{{$t('invite.The_members_with_multiple')}}</div>
                <div class="rule_content">{{$t('invite.We_reserves_the_right')}}</div>
                <div class="rule_content">{{$t('invite.Activity_start_time')}}2024/10/10</div>
                <div class="rule_content">{{$t('invite.Activity_end_time')}}2026/10/10</div>
            </div>
        </div>
        <van-popup :show="show" class="rulePopup" round  mode="center" @close="show = false">
            <div class="slot-content transfer_content">
                <div class="content_box">
                    <div class="top_content">
                        <img src="@/assets/invite/title.png" alt="" class="top_bg">
                        <div class="top_title">{{$t('promotionactivity.Congratulations')}}</div>
                    </div>
                    <div class="middle_content">
                        <div class="content_item">{{$t("promotionactivity.Best_Wishes")}}</div>
                         <div class="info_detail">
                            {{$t("promotionactivity.already_received")}}
                            <text class="amount">{{receiveItem.bonus}}{{receiveItem.symbo}}</text>
                        </div>
                        <div class="bottom_btn">
                            <div class="left right" @click="getBonous">{{$t('promotionactivity.Receive')}}</div>
                        </div>
                    </div>
                </div>
			</div>
        </van-popup>
        <ShareDialog ref="share" @closeShare="closeShare"/>
    </div>
</template>
<script lang="ts" setup>
import {ref,onMounted} from "vue"
import {promotionsList,promotionsReceive,promotionsGroup } from '@/api/promotions'
import {identifierFS } from '@/api/auth'
import ShareDialog from "@/components/Share/index.vue"
import { useUserStore } from '@/store/modules/user'
import { showToast } from 'vant'
import QrcodeVue from "qrcode.vue"
import { $t } from '@/locales'
import Icon0 from "@/assets/invite/icon_0.png"
import Icon1 from "@/assets/invite/icon_1.png"
import Icon2 from "@/assets/invite/icon_2.png"
import Icon3 from "@/assets/invite/icon_3.png"
import Icon4 from "@/assets/invite/icon_4.png"
import { useRouter } from 'vue-router'
import { useSiteStore } from "@/store/modules/site";

const baseUrl = window.location.origin

const userStore = useUserStore()
const siteStore = useSiteStore()
const router = useRouter()

const list:any = ref([])
const totalBonous:any = ref('')
const collapseVal:any = ref(['0'])
const show:any = ref(false)
const receiveItem:any = ref({})
const bonousList:any = ref([{currency:'SYSTEM', symbo:'VND'},{currency:'USDT',symbo:'USDT'}])
const groupList:any = ref([])
const missionType:any = ref(1)
const choseType:any = ref({})
const originList:any = ref([])
const loading:any = ref(false)
const totalAmount:any = ref(null)
const locked:any = ref(false)
const share:any = ref(null)

onMounted(()=>{
    getList()
    getGroup()
})
const showSharDialog =()=> {
    locked.value = true
    share.value && share.value.open(3)
}
const toTeam=()=> {
    // uni.redirectTo({
    //     url:"/pages/invite/index?type=2"
    // })
     router.push('/invite?type=Bonous')
}
const closeShare=()=> {
    locked.value = false
}
const copy=async(url:any)=> {
    try {
        await navigator.clipboard.writeText(url)
        showToast($t('deposit.copiedToClipboard'))
    } catch (error) {
        showToast($t('deposit.copyFailed'))
    }
}
const getList=()=> {
    loading.value = true
    promotionsList({group_id:missionType.value}).then((res:any)=>{
        originList.value = res.rows;
        list.value = res.rows;
        totalBonous.value = res.total_bonus;
        loading.value = false
    })
}
const getGroup=()=> {
    promotionsGroup().then(res=>{
        groupList.value = res;
        let amount = 0
        amount = res.reduce((amount,item)=>Number(amount)+Number(item.total_bonus),amount)
        totalAmount.value = amount.toString().indexOf('.') == -1 ? amount + '.00' : amount
        choseType.value = groupList.value.find(item=>item.group_id == missionType.value)

    })
}
const choseItem=(item)=> {
    choseType.value = item;
    missionType.value = item.group_id;
    list.value = [];
    getList()
}
const receiveBonous=(item)=> {
    console.log(item);
    if(!item.receive) {
        let bonousInfo = bonousList.value.find(ite=>ite.currency == item.currency);
        item.symbo = bonousInfo.symbo;
        receiveItem.value = item;
        show.value = true
    }else {
        return
    }
}
const getBonous=async()=> {
    let item = receiveItem.value
    let identifyParams:any;
    // if(!siteStore.deviceId) {
    //     let visitorDataId = visitorData.data.value?.visitorId
    //     siteStore.setDeviceId(visitorDataId)
    //     localStorage.setItem('deviceId',visitorDataId)
    //     identifyParams = {
    //         identifier:visitorDataId
    //     }
    // }else {
       
    // }
     identifyParams = {
            identifier:siteStore.deviceId
        }
    try {
        await identifierFS(identifyParams);
        try {
            await promotionsReceive({id:item.id});
            showToast($t('invite.receive_success'))
            list.value = []
            getList()
        }catch(error) {
            showToast(error.msg)
        }finally {
            show.value = false
        }
        
    }catch(error) {
        showToast(error.msg)
    }
    
}
</script>
<style lang="less" scoped>
.bg_box {
    background: #fff !important;
    min-height: 100vh;
    padding-top: 0px !important;
    // padding-bottom: 60px;
    .shar_box {
        padding: 10px 20px;
        box-sizing: border-box;
        background: #fff;
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
    .word_c {
        padding:  0 20px;
        background:#fff;
        padding-bottom:90px;
        .rules_box {
            width: 100%;
            border-radius: 4px;
            padding: 10px;
            box-sizing: border-box;
            border: 2px solid #60C5F8;
            position: relative;
            .title {
                position: relative;
                display: flex;
                justify-content: center;
                z-index: 2;
                // margin-bottom: 20px;
                height: 39px;
                width: 262px;
                background: url("@/assets/promotions/dialog_title.svg") no-repeat center;
                border-radius: 16px 16px 0 0;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                top: -17px;
                text-align: center;
                line-height: 32px;
                color: #fff;
                font-weight: 600;
                margin-bottom: 20px;
            }
            .rule_content {
                margin-bottom: 16px;
                color: #666;
                font-size: 14px;
                padding-left: 20px;
                box-sizing: border-box;
                position: relative;
                &::before {
                    content: "";
                    width: 8px;
                    height: 8px;
                    background: linear-gradient(135deg,#58B8FD , #58B8FD );
                    position: absolute;
                    top: 4px;
                    left: 5px;
                    transform: rotate(45deg);
                }
            }
            .first_child {
                margin-top: 20px;
            }
        }
    }
    .list_box {
        background:#fff;
        padding:10px;
        box-sizing: border-box;
        padding-bottom: 20px;
        .title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
        }
        .list_container {
            background: #fff;
            // box-shadow: 0 0.08rem 0.64rem 0.02667rem hsla(0,0%,87.1%,.79);
            border-radius: 10px;
            // padding: 10px 0;
            // margin-top: 12px;
            min-height: 60vh;
            .container_top {
                padding: 0 10px;
                box-sizing: border-box;
                .amount_box {
                    font-size: 18px;
                    margin: 10px 0;
                    font-size: 800;
                    color: #000;
                }
                
                
            }
            .no_data {
                min-height: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
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
        .item_box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            box-sizing: border-box;
            width: 100%;
            background-image: linear-gradient(180deg,#f3f7fb 0,#e0e9f1);
            border-radius: 8px;
            margin-bottom: 10px;
            .first_box {
                display: flex;
                align-items: center;
                .img_box {
                    img {
                        width: 68px;
                        height: 68px;
                    }
                }
                .center {
                    color: #666;
                    font-size: 12px;
                    font-weight: 800;
                }
                .bonous {
                    display: flex;
                    align-items: center;
                    margin-top: 8px;
                    gap: 5px;
                    img {
                        width: 13px;
                        height: 13px;
                    }
                }
            }
            .right_box {
                .progress {
                    display: flex;
                    justify-content: flex-end;
                    font-size: 12px;
                    color: #666;
                    align-items: flex-end;
                    .hase_done {
                        color: #3487F6;
                        font-weight: 600;
                        font-size: 16px;
                    }
                }
                .right {
                    margin-top: 4px;
                    // width: 82px;
                    padding: 0 4px;
                    height: 28px;
                    border-radius: 4px;
                    // background: #666;
                    background-image: linear-gradient(113deg,#43cbff,#3487F6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 12px;
                    font-weight: 800;
                    color: #fff;
                }
                .right_1 {
                    background-image: linear-gradient(113deg,#43cbff,#9708cc);
                }
            }
        }
    }
    ::v-deep {
        .u-page__item__title__slot-title {
            display: flex;
            .left {
                width: 26px;
                height: 26px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAAGXcA1uAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAADiNXWtAAADK0lEQVRIDa1WTWhTQRCe2fwYSrVRG1trRRERxJ+DWA9Wa2ykd8Fe61EExZNX8e5JFLzn2oIHb4XaoPbg70EUD4oUbKs1tU20Sm3y3jjfvuwjSZukYBfC7s7PtzNvv5kNk45fQ0O72js6CoyFlH7PQ2ggwSIchcGzJ7Dhn+f7xUmNWxDJDGNTPHe6jw2/cApfqI/ha8R/7YRuNsnHT9/AwgkAY0yiO9wvXhg4ls+cOeQEvJROJyNcWnICnbPbJqcumwiVr1QJsRwppPtPGma5VaewW/XgwXUVbZPPnpPQTadEhMnc1CubIIQIgql00BBniOWqKlJC/CRKdHuVuYS0YGcdgiDoJQQNh57mUWyMkW/U8x6p4b6GxhUFwjKe+H/1oA+tjJ0+CCm4jxsqHHGK+hnos6met2HSMNDE92vinfXGMDwyOroKeY2DDA/HFxa/7o8Jt/uGSzGTmN86Pv69GiB0AE3iIrGyfkYmGVCa5Un4gU8yIRT7tD2Xs5wMcrB3S9cVad0cxJdTPsc/wskgbuVqupExwgFrcalYG5sk0x1smg0wAHVTVQjNzFWndCn5K10bdtBkU8aX2IYdQMQSy3LFQWZaBERgbeeO3dMGt+gLX2zhkAXFWW/b3sNyJtNV9lb2GpaHml1vjbPS2ifKoXggD2/6vdJiT37ueI2xbvSWF/TCpp08dHACzHDuyed71iNitZ1bA3QulZpzBHVyzDUHuFSg0K+X1rvSEqlLCcqaoR9Y+C7ShDgaSXxpn5iwTRR7e4BN98e3o+T7RqnVkLNwaDGyWpf3yBh/dmf3O2TEKLGifss4c6RM/ljriFscoT04SubSqojXoYwwqF+4oCz/HxxI3BtgEQHboDlYsdY85s0Y6B/AAbZB58HGNhQsNmE4LGAbtDWLqd1qE7ADiAoWsC2LXPMNqNm6NzUNpFKZruDCOnBPG4uwdsRrCjLSFGitMqut9756y5qeXW1rDzLeAdSEpa6g4PRHclijScE2+Mb6uAnlokw5UBLcFz/y2T0GDjPMwAmqZ9TIcrGYXPH+6L8HswUNFXpcHl7QRKStYP8DVd6wal+3/gfBLVPpxGyf5QAAAABJRU5ErkJggg==') no-repeat center;
                background-size: 100% 100%;
                color: #fff;
                margin-right: 10px;
            }
            .center_left_top {
                display: flex;
                gap: 4px;
                align-items: center;
                width: 60%;
                margin-right: 10px;
            }
            .recharge_box {
                width: 100%;
            }
            .center_right {
                width: 100px;
                .progress_title {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
                .progress {
                    width: 100%;
                    border-radius: 4px;
                    height: 8px;
                    background: #cecece;
                    margin-top: 4px;
                    .value_container {
                        height: 100%;
                        border-radius: 4px;
                        background: #6bbe58;
                    }
                }
            }

        }
        .center_left {
                color: #98999a;
                margin-top: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                .details {
                    font-size: 12px;
                }
                .right {
                    color: rgb(255, 255, 255);
                    background: rgb(181, 181, 181);
                    border-color: rgb(181, 181, 181);
                    box-shadow: 0 0 0.21333rem 0.02667rem #b5b5b5;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20px;
                    height: 30px;
                    width: 92px;
                }
                .right_1 {
                    background: #f2413b;
                     border-color: #f2413b;
                      box-shadow: 0 0 0.21333rem 0.02667rem #f2413b;
                }
                .received {
                    background: rgba(255,200,0,0.7);
                    border-color: rgb(255,200,0,0.7);
                    box-shadow: 0 0 0.21333rem 0.02667rem rgba(255,200,0,0.7);
                }
        }
        .recharge_left {
            display: block;
            .details {
                margin-bottom: 12px;
            }
            .recharde_btn {
                display: flex;
                justify-content: flex-end;
            }
        }
        .u-cell__right-icon-wrap{
            display: none !important;
        }
    }
    ::v-deep {
        .rulePopup {
            overflow: initial !important;
            width: 100%;
            max-width: 580px;
            background: none !important;
            .transfer_content {
                padding:  0 10px;
                .content_box {
                    position: relative;
                    border-radius: 6px;
                    background: transparent;
                    border-radius: 10px;
                    padding: 0 20px;
                    box-sizing: border-box;
                    max-width: 580px;
                    .top_cancle {
                        display: flex;
                        justify-content: flex-end;

                    }
                    .top_content {
                        width: 100%;
                        border-radius: 10px 10px 0 0;
                        background: #fff;
                        height: 118px;
                        margin-top: 30px;
                        position: relative;
                        .top_bg {
                            // width: 60%;
                            height: 146px;
                            position: absolute;
                            top: -28px;
                            right: -12px;
                        }
                        .welcome_bg {
                            width: 232px;
                            height: 43px;
                            position: absolute;
                            left: 20px;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                        .top_title {
                            position: absolute;
                            left: 20px;
                            top: 50%;
                            transform: translateY(-50%);
                            font-size: 30px;
                            font-weight: 800;
                            text-shadow: 7px 1px 5px #000;
                            color: #4395F4;
                        }
                    }
                    .middle_content {
                        background: #F1F6FF;
                        border-radius: 0 0 10px 10px;
                        padding: 16px;
                        box-sizing: border-box;
                    }
                    .info_detail {
                        color: #666;
                        font-size: 16px;
                        .amount {
                            font-weight: 700;
                            color: #ffc700;
                            margin-left: 10px;
                        }
                    }
                    .content_item {
                        font-weight: 400;
                        font-size: 14px;
                        color: #8a8a8a;
                        position: relative;
                        z-index: 4;
                        margin-bottom: 15px;
                    }
                    .bottom_btn {
                        margin-top: 25px;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        .left {
                            width: 49%;
                            height: 35px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 20px;
                            background:#474c51;
                            color: #fff;
                            font-size: 15px;
                        }
                        .right {
                            background: #3B7FF8;
                            color: #fff;
                        }
                    }
                }
            }
    
        .center_text {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        }
    }
}
.locked {
    overflow: hidden;
    min-height: 0 !important;
    height: 80vh;
}
</style>