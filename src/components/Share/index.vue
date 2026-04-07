<template>
    <div class="share">
       <van-popup :show="isShowShare" zIndex="10080" position="bottom" @close="isShowShare = false" class="share_pop">
            <div class="close_con">
                <img src="@/assets/promotions/share/close.svg" alt="" @click="closeShare">
            </div>
           <div class="sharep_box">
                <div class="top_c">
                    <div class="title_c">
                        <img src="@/assets/promotions/share/title1.svg" alt="">
                        <img src="@/assets/promotions/share/title2.svg" alt="">
                    </div>
                    <div class="qrcode_c">
                        <div class="img">
                            <img src="@/assets/promotions/share/human.png" alt="">
                        </div>
                        <div class="qrcode">
                            <QrcodeVue :value="userStore.userInfo?.invite_code" :size="127"/>
                             <div class="invite_code">
                                {{ $t('promotionactivity.invite_code') }}:{{ userStore.userInfo?.invite_code }}
                             </div>
                        </div>
                    </div>
                </div>
                <div class="box_1 top_margin">
                    <div class="sharep_top">
                        <text>1. {{ $t('promotionactivity.Inviting_friends_withdrawals') }}</text>
                    </div>
                    <div class="list_box">
                        <div v-for="(item,index) in shareLists" :key="index" class="list_item" @click="sharePlatform(item)">
                            <img :src="item.img" alt="">
                            <div class="name">{{item.name}}</div>
                        </div>
                    </div>
                    <div class="sharurl_box" @click="copy(baseUrl +'/?sharecode='+ userStore.userInfo?.invite_code)">
                        <div class="content">{{baseUrl +'/?sharecode='+ userStore.userInfo?.invite_code}}</div>
                        <div class="copy" @click="copy(baseUrl +'/?sharecode='+ userStore.userInfo?.invite_code)">
                            <img src="@/assets/promotions/share/copy.svg" alt="">
                        </div>
                    </div>
                </div>
                <div class="box_1 add_margin">
                    <div class="sharep_top add_margin">
                        <text>2. {{ $t('promotionactivity.Send_invitation_help') }}</text>
                    </div>
                    <div class="bottom_container">
                        <div class="top_list">
                            <div class="lsit_item" v-for="(item,index) in sendNum" :key="index" :style="hasSharedIndex && index <= hasSharedIndex ? 'opacity:0.5' :'opacity :1'">{{item}}</div>
                        </div>
                        <div class="bottom_action">
                            <div class="left">
                                <div class="word" @click="toWhatApp">
                                    <div>{{$t('promotionactivity.Enviar_Mensagem')}}</div>
                                    <div class="bot">
                                        <!-- <div>no</div> -->
                                        <div class="name">WhatsAPP</div>
                                    </div>
                                </div>
                                <img src="@/assets/turnable/whatsapp.svg" alt="">
                            </div>
                            <div class="left" @click="toSendMessage">
                                <img src="@/assets/turnable/sms.png" alt="">
                                <div class="word">
                                    <div>{{$t('promotionactivity.Enviar_Mensagem')}}</div>
                                    <div class="name">SMS</div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
           </div>
		</van-popup>
    </div>
</template>
<script lang="ts" setup>
import QrcodeVue from "qrcode.vue"
import {ref,onMounted,defineEmits,defineExpose} from "vue"
import { useUserStore } from '@/store/modules/user'
import { assignmobileList } from '@/api/promotions'
import { showToast } from 'vant'
import { $t } from '@/locales'
import Icon1 from "@/assets/turnable/mais.svg"
import Icon2 from "@/assets/turnable/facebook.png"
import Icon3 from "@/assets/turnable/WhatsApp.png"
import Icon4 from "@/assets/turnable/telegram.png"
import Icon5 from "@/assets/turnable/Twitter.png"
import Icon6 from "@/assets/turnable/email.png"

const userStore = useUserStore()
const baseUrl = window.location.origin

const isShowShare = ref(false)
const sendNum:any = ref([])
const sharWord:any = ref('Get 20000 VND for free')
const  hasSharedIndex:any = ref(null)
const shareLinkUrl = ref('')
const emit = defineEmits(["closeShare"]);
const shareLists = ref([
    {name:'Mais',img:Icon1,link:''},
    {name:'Facebook',img:Icon2,link:'"https://m.facebook.com/sharer/sharer.php'},
    {name:'WhatsApp',img:Icon3,link:"https://wa.me/"},
    {name:'Telegram',img:Icon4,link:'https://t.me/share'},
    {name:'Twitter',img:Icon5,link:'https://twitter.com/intent/tweet'},
    {name:'Email',img:Icon6,link:'mailto:'},
])

const closeShare =()=> {
    isShowShare.value = false
    emit('closeShare')
}
const getList=()=> {
    assignmobileList().then((res:any)=>{
        sendNum.value = res?.rows.map(item=>item.area_code+item.mobile);
    })
}
const copy=async(url:any)=> {
    try {
        await navigator.clipboard.writeText(url)
        showToast($t('deposit.copiedToClipboard'))
    } catch (error) {
        showToast($t('deposit.copyFailed'))
    }
}
const sharePlatform=(item:any)=> {
    let link:any,title:any;
    if(item.link) {
        switch(item.name) {
            case 'Twitter' :
                title = 'VIB-BET';
                link = shareLinkUrl.value;
                window.open(`https://twitter.com/intent/tweet?url=` + encodeURIComponent(link)+'&text='+encodeURIComponent(sharWord.value));
            break;
            case 'Facebook':
                link = shareLinkUrl.value;
                window.open("https://m.facebook.com/sharer/sharer.php?u=" +encodeURIComponent(link) + "&t="+ encodeURIComponent(sharWord.value));
            break;
            case 'Telegram':
                link = shareLinkUrl.value;
                window.open("https://t.me/share?url="+encodeURIComponent(link)+"&text="+sharWord.value)
            break;
            case 'Email':
                link = shareLinkUrl.value;
                window.open(`mailto:?subject=${sharWord.value}&body=` + encodeURIComponent(link));
            break;
            case 'WhatsApp':
                link = shareLinkUrl.value;
                window.open(`https://api.whatsapp.com/send?text=` + encodeURIComponent(sharWord.value)+' '+encodeURIComponent(link));
            break;
            default:break
        }
    }else {
        // 唤起浏览器分享 Mais
        navigator.share({
            title:'VIB-BET',
            text:sharWord.value,
            url:shareLinkUrl.value
        })
    }
}
const toWhatApp=()=> {
    let index:any = Number(localStorage.getItem('shaerIndex')) || 0
    const phoneNumber = sendNum.value[index]
    const link = sharWord.value + ' ' + shareLinkUrl.value
    window.open("https://wa.me/"+phoneNumber+'?text='+link);
    console.log(index++,'111')
    if(index == 19) {
        localStorage.setItem('shaerIndex',(0).toString())
    }else {
        localStorage.setItem('shaerIndex',(index++).toString())
    }
}
const toSendMessage=()=> {
    let phones = sendNum.value.join(', ');
    window.open(`sms:/open?addresses=${phones}&body=Get 20000 VND for free ${shareLinkUrl.value}`)
}
const open=(type:any)=> {
    getList()
    isShowShare.value = true
    hasSharedIndex.value = Number(localStorage.getItem('shaerIndex'))
    shareLinkUrl.value = window.location.origin +'/?sharecode='+ userStore.userInfo?.invite_code
}
defineExpose({
    open
})
</script>
<style scoped>
@font-face {
    font-family: SWICC;
    src: url("@/assets/font/SWISSC.TTF");
}
</style>
<style lang="less" scoped>
.share {
    font-family: SWICC;
    // height: 100vh;
    ::v-deep {
        .van-popup {
            max-width: 600px;
            left: 50%;
            transform: translateX(-50%);
            // height: 100%;
            // min-height: 100vh;
            height: 100%;
            flex: none !important;
            overflow: auto;
            background: #0F1923;
        }
    }
    ::v-deep {
        .van-overlay {
            height: 100%;
            background: #0F1923;
            justify-content: flex-end;
        }
    }
    .share_pop {
        width: 100%;
       display: flex;
       flex-direction: column;
        .close_con {
            display: flex;
            justify-content: flex-end;
            height: 48px;
            align-items: center;
            padding: 0 16px;
            box-sizing: border-box;
            img {
                width: 21px;
            }
        }
        .sharep_box {
            flex: 1;
            width: 100%;
            padding: 10px;
            padding-bottom: 20px;
            // background: #0F1923;
            flex: 1;
            background: url('@/assets/promotions/share/big_bg.png') no-repeat center;
            background-size: 100% 100%;
            padding-top: 26px;
            box-sizing: border-box;
            .top_c {
                .title_c {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    position: relative;
                   z-index: 1;
                }
                .qrcode_c {
                    position:relative;
                    display: flex;
                    margin-top: 14px;
                    .img {
                        width: 216px;
                        height: 282px;
                        img {
                            width: 100%;
                        }
                    }
                    .qrcode {
                        width: 147px;
                        height: 174px;
                        background: url("@/assets/promotions/share/ercode_bg.png") no-repeat center;
                        background-size: 100% 100%;
                        position: relative;
                        padding: 10px;
                        .invite_code {
                            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
                            background: linear-gradient(180deg, #C6F889 50%, #2CF3A4 93.18%);
                            background-clip: text;
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            font-size: 12px;
                            font-weight: 800;
                            text-align: center;
                            margin-top: 10px;
                        }
                    }
                }
            }
            .box_1 {
                border: 1px solid #1DF8A2;
                border-radius: 10px;
                padding:15px 6px;
                box-sizing: border-box;
                background: #000814;
                position: relative;
                z-index: 2;
            }
            .top_margin {
                margin-top: -40px;
            }
            .add_margin {
                margin-top: 15px;
            }
            .sharep_top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #fff;
                margin-bottom: 10px;
            }
            .list_box {
                display: flex;
                justify-content: space-around;
                align-items: center;
                .list_item {
                    width: 16%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    img {
                        width: 42px;
                        height: 42px
                    }
                    .name {
                        font-size: 12px;
                        color: #fff;
                    }
                }
            }
            .sharurl_box {
                width: 100%;
                padding:14px 10px;
                background: #FFF;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 16px;
                border-radius: 6px;
                .content {
                    font-size: 12px;
                    color: grey;
                }
                .copy {
                    color: #40a1de;
                    font-size: 12px;
                }
            }
            .bottom_container {
                background: #000;
                margin-top: 8px;
                padding: 10px;
                .top_list {
                    display: flex;
                    flex-wrap: wrap;
                    .lsit_item {
                        width: 25%;
                        font-size: 10px;
                        color: #8f8f8f;
                    }
                }
                .bottom_action {
                    display: flex;
                    margin-top: 10px;
                    gap: 10px;
                    .left {
                        flex: 1;
                        padding: 10px 0;
                        background: #fff;
                        justify-content: center;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        img {
                            width: 35px;
                            height: 35px;
                        }
                        .word {
                            font-size: 12px;
                            color: #000;
                        }
                        .bot {
                            font-size: 12px;
                            display: flex;
                            align-items: flex-end;

                        }
                        .name {
                            font-size: 14px;
                            font-weight: bold;
                            font-family: SWISSC-BT;
                        }
                    }
                }
            }
        }
        .add_margin {
            margin-top: 16px;
        }
  }
}
</style>