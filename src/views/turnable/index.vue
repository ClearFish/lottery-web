<template>
    <div class="home_box" :class="locked ? 'lock_box' : ''">
        <div class="out_box">
            <div class="top_container">
                <div class="top_box">
                    <div class="money_box">
                        <p class="moner"> {{ $t('turnable.BONUS') }} </p>
                        <p class="bonous_num">3,000K<span class="money_dw">VND</span></p>
                    </div>
                </div>
                <div class="needCash">
                    <div class="word_c">
                        {{ $t('promotion.invite') }} <span class="needCashNum">{{tasking.schedule-tasking.completed || ''}}</span> {{ $t('turnable.people_to_register') }} <span class="needCashNum">1</span> {{ $t('turnable.chance_to_draw') }}
                    </div>
                </div>
            </div>
            <img src="@/assets/turnable/left_coin.png" alt="" class="left_coin">
            <img src="@/assets/turnable/right_coin.png" alt="" class="right_coin">
        </div>
        <div class="game_box">
            <Game2 @openDialog="openDialog"  @nowTasks="nowTasks"/>
        </div>
        <div class="share_box" >
            <p class="value">{{ $t('promotionactivity.Invitation_URL') }}</p>
            <div class="url_box">{{ baseUrl +'/?sharecode='+ userStore.userInfo?.invite_code }}</div>
            <div class="bottom_btn">
                <div class="left invite" @click="showShare">{{ $t('turnable.Invite_friends') }}</div>
                <div class="left" @click="copy(baseUrl +'/?sharecode='+ userStore.userInfo?.invite_code)">{{ $t('turnable.Copy_link') }}</div>
            </div>
            <img src="@/assets/turnable/sz_bg.png" alt="" class="right_sz">
        </div>
        <div class="list_box">
            <div class="top_title">
                <p>{{ $t('turnable.People_who_just_received') }}</p>
            </div>
            <div class="scroll_content">
                <div class="scroll_box">
                <div class="scroll_cont">
                    <div class="item" v-for="(item,index) in scrollList" :key="index">
                    <p>{{item.account}}</p>
                    <p>{{item.name}}</p>
                    <div class="bonous_num">
                        <p>+{{item.bonous}}</p>
                        VND
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div class="rule_box">
            <p class="title">{{ $t('turnable.Rules') }}</p>
            <p class="content">1. {{ $t('turnable.rules_1') }} </p>
            <p class="content">2. {{ $t('turnable.rules_2') }} </p>
            <p class="content">3. {{ $t('turnable.rules_3') }}</p>
        </div>
        <ShareDialog ref="share" @closeShare="closeShare"/>
        <!-- overlay-style="background:rgba(0,0,0,0.3)" -->
        <van-popup :show="isShowProgress"  position="center"   @close="isShowProgress = false" class="congration_pop">
            <view class="congration_container">
                <view class="top_cont">
                    <!-- <img src="@/assets/turnable/congratulations.png" alt=""> -->
                     {{ $t('turnable.congratulations') }}
                </view>
                <view class="sub_cont">
                    <view>{{ $t('turnable.YOU_GOT') }}</view>
                    <view class="number">{{Number(resultObj.bonus)}}</view>
                    <view>VND</view>
                </view>
                <view class="center_bg">
                    <img src="@/assets/turnable/center_bg.png" alt="">
                </view>
                <view class="bottom_close">
                    <van-icon color="#fff" name="cross" size="32" @click="isShowProgress = false"/>
                </view>
            </view>
        </van-popup>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Game2 from "./components/game2.vue" 
import ShareDialog from "@/components/Share/index.vue"
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { $t } from '@/locales'
import { showToast } from 'vant'
const baseUrl = window.location.origin
const userStore = useUserStore()
const router = useRouter()
const leftVal = ref('-10px')
const scrollList = ref([
    {account:'+84 446****674',name:'người dùng vừa nhận được',bonous:"500k"},
    {account:'+84 656****621',name:'người dùng vừa nhận được',bonous:"10k"},
    {account:'+84 193****622',name:'người dùng vừa nhận được',bonous:"300k"},
    {account:'+84 126****663',name:'người dùng vừa nhận được',bonous:"1500k"},
    {account:'+84 631****674',name:'người dùng vừa nhận được',bonous:"3000k"},
    {account:'+84 467****424',name:'người dùng vừa nhận được',bonous:"10k"},
    {account:'+84 264****674',name:'người dùng vừa nhận được',bonous:"300k"},
    {account:'+84 634****621',name:'người dùng vừa nhận được',bonous:"1500k"},
    {account:'+84 446****674',name:'người dùng vừa nhận được',bonous:"3000k"},
    {account:'+84 267****346',name:'người dùng vừa nhận được',bonous:"50k"},
    {account:'+84 446****674',name:'người dùng vừa nhận được',bonous:"10k"},
    {account:'+84 744****631',name:'người dùng vừa nhận được',bonous:"50k"},
    {account:'+84 474****126',name:'người dùng vừa nhận được',bonous:"3000k"},
    {account:'+84 466****674',name:'người dùng vừa nhận được',bonous:"150k"},
    {account:'+84 446****314',name:'người dùng vừa nhận được',bonous:"10k"},
    {account:'+84 312****446',name:'người dùng vừa nhận được',bonous:"9,999k"},
    {account:'+84 432****231',name:'người dùng vừa nhận được',bonous:"500k"},
    {account:'+84 901****678',name:'người dùng vừa nhận được',bonous:"300k"},
    {account:'+84 347****567',name:'người dùng vừa nhận được',bonous:"10k"},
    {account:'+84 437****230',name:'người dùng vừa nhận được',bonous:"3000k"}
])
const progress = ref('0.00')
const release = ref(500)
const currentVal = ref(0)
const isShowProgress:any = ref(false)
const resultObj:any = ref({})
const tasking:any = ref({})
const locked:any = ref(false)
const share:any = ref(null)

const closeShare=()=> {
    locked.value = false
}
const nowTasks=(item)=>{
     tasking.value = item
}
        
const openDialog = (item)=> {
     resultObj.value = item
     isShowProgress.value = true;
}
const showShare=()=> {
    if(userStore.isLoggedIn) {
        locked.value = true
       share.value && share.value.open(2)
    }else {
        router.push({ path: "/auth",query:{mode:'login'} })
    }
}
const copy=async(url:any)=> {
    try {
        await navigator.clipboard.writeText(url)
        showToast($t('deposit.copiedToClipboard'))
    } catch (error) {
        showToast($t('deposit.copyFailed'))
    }
}
</script>
<style scoped>
@font-face {
    font-family: SWICC;
    src: url("@/assets/font/SWISSC.TTF");
}
@font-face {
    font-family: Archive;
    src: url("@/assets/font/Archive.otf");
}
@font-face {
    font-family: Radnickdemo;
    src: url("@/assets/font/Radnickdemo-vmqLM.otf");
}

</style>
<style lang="less" scoped>
.home_box {
  width: 100%;
  height: 100%;
  padding: 50px 0;
   background: linear-gradient(180deg,#fcfdff,#e4edfe 53%,#f4f7fe) !important;
  overflow: hidden;
  padding-top: 0 !important;
    .top_title_head {
        display: flex;
        padding-left: 10px;
        box-sizing: border-box;
        gap:4px;
        font-size: 20px;
        font-weight: 700;
        align-items: center;
        color: #333;
        margin: 8px 0;
        img {
            width: 21px;
            height: 21px;
        }
    }
  .top_nav {
    width: 100%;
    background: #1B1B25;
    height: 50px;
    display: flex;
    justify-content:space-between;
    align-items: center;
    padding:0 16px;
    box-sizing: border-box;
    font-family: SWICC;
    .left {
        display: flex;
        align-items: center;
        gap: 6px;
       
    }
    .center {
        color: #333;
        font-size: 16px;
        font-weight: 800;
    }
    .right {
        color: #333;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
    }
  }
  .out_box {
    width: 100%;
    background: url("@/assets/turnable/top_fire.png") no-repeat center;
    position: relative;
    background-size: cover;
    animation-name: slide;
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-fill-mode:forwards;
    animation-timing-function: linear ;
    .left_coin {
        position: absolute;
        left: 0;
        top: 100px;
        width: 43px;
        height: auto;
    }
    .right_coin {
        position: absolute;
        right: 0;
        top: 50px;
        width: 50px;
        height: auto;
    }
  }
  .top_container {
    padding: 0 10px;
    border-radius: 8px;
    width: 90%;
    margin: 0 auto;
    box-sizing: border-box;
    position: relative;
    .top_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 178px;
      background: url('@/assets/turnable/top_cont.png') no-repeat center;
      background-size:100%  100%;
      .left_img {
        width: 52px;
        height: 37px;
      }
      .money_box {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        gap: 4px;
        // font-family: SWICC;
        margin-top: -40px;
      }
      .moner {
        // font-family: Archive;
        font-size: 16px;
        color: #C55537;
      }
      .bonous_num {
        color: #FF352B;
        font-size: 28px;
        font-weight: 700;
        text-shadow: 0 1px 4px #FFCE17;
        .money_dw {
            font-size: 20px;
            margin-left: 2px;
        }
      }
      .scar {
        padding: 4px 12px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        font-weight: 700;
        color: #333;
        // font-family: SWICC;
        background: #efb423 linear-gradient(90deg,#49a319,#2b8b2f);
        img {
          width: 15px;
          height: 15px;
        }
      }
    }
    .center_box {
      margin-top: 8px;
      .title{
        color: #333;
        text-align: right;
      }
      .progress {
        width: 100%;
        height: 10px;
        border-radius: 5px;
        background: #6ddf38;
        position: relative;
        .point {
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background: #333;
          position: absolute;
          top: 0px;
        }
      }
    }
    .needCash {
      color: #fff;
      text-align: center;
      width: 95%;
      margin: 0 auto;
      margin-top: -85px;
      height: 115px;
      background: url('@/assets/turnable/word_cont.png') no-repeat center;
      background-size:100%  100%;
    //   font-family: SWICC;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding: 40px 25px;
      padding-top: 15px;
      box-sizing: border-box;
      text-align: center;
      justify-content: center;
      .needCashNum {
        color: #fff;
        font-weight: 600;
        margin: 0 4px;
      }
    }

  }
  .expre_time {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(135, 149, 177);
    .value {
      color: #333;
      margin-left: 4px;
    }
  }
  .game_box {
    min-height: 380px;
    background: url('@/assets/turnable/pie_firebg.png') no-repeat center;
    background-size: cover;
    animation-name: slide;
    animation-duration: 2.5s;
    animation-iteration-count: infinite;
    animation-fill-mode:forwards;
    animation-timing-function: linear ;
  }
  .share_box {
    padding: 16px 23px;
    width: 85%;
    margin: 0 auto;
    background: url('@/assets/turnable/share_bg.png') no-repeat center;
    background-size: 100% 100%;
    border-radius: 4px;
    color: #333333;
    font-size: 14px;
    box-sizing: border-box;
    position: relative;
    .value {
        font-size: 15px;
        font-weight: 600;
    }
    .url_box {
        width: 100%;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(248, 147, 79, 0.15);
        border: 1px solid #CF6849;
        margin-top: 16px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 400;
        word-break: break-all;
    }
    .bottom_btn {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        margin-top: 16px;
        .left {
            flex: 1;
            height: 36px;
            background-image: linear-gradient(180deg, #F95A30 2%, #C90501 100%);
            border-radius: 17.5px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 14px;
        }
        .invite {
            text-align: center;
            padding: 0 6px;
        }
    }
    .right_sz {
        position: absolute;
        width: 37px;
        height: 32px;
        top: 20px;
        right: -20px;
    }
  }
  .list_box {
    width: 90%;
    margin: 0 auto;
    margin-top: 20px;
    .top_title {
      display: flex;
      width: 100%;
      height: 40px;
      align-items: center;
    //   background: #202124;
    //   font-family: SWICC;
      p {
        flex: 1;
        color: #333;
        text-align: center;
        font-size: 16px;
      }
    }
    .scroll_content {
      width: 100%;
      .scroll_box {
        height: 200px;
        overflow: hidden;
        .scroll_cont {
          height: 100%;
          // transition-timing-function: linear;
          // transition-duration: 12s;
          // transform: translateY(-600px);
          animation-name: scrollY;
          animation-duration: 8s;
          animation-iteration-count: infinite;
          animation-fill-mode:forwards;
          animation-timing-function: linear ;
          .item {
            display: flex;
            justify-content: space-between;
            height: 40px;
            align-items: center;
            padding: 0 10px;
            box-sizing: border-box;
            color: #333;
            // font-family: SWICC;
            font-size: 12px;
          }
          .bonous_num {
            color: #F7E371;
            font-size: 12px;
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
  .congration_pop {
    background: transparent;
    max-width: 380px;
    width: 90%;
    border-radius: 10px;
    background: transparent;
    .congration_container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .top_cont {
            display: flex;
            justify-content: center;
            img {
                width: 285px;
                height: auto;
            }
            font-family: Radnickdemo;
            font-size: 30px;
            background-image:-webkit-linear-gradient(180deg,#FCEE90,#FFF5CB); 
            -webkit-background-clip:text; 
            -webkit-text-fill-color:transparent; 
            font-weight: 700;
        }
        .sub_cont {
            display: flex;
            gap: 10px;
            justify-content: center;
            align-items: center;
            margin-top: 23px;
            font-family: Radnickdemo;
            font-size: 16px;
            background-image:-webkit-linear-gradient(180deg,#FCEE90,#FFF5CB); 
            -webkit-background-clip:text; 
            -webkit-text-fill-color:transparent; 
            .number {
                font-size: 34px;
                background-image:-webkit-linear-gradient(bottom,#FF9595,#E70000); 
                -webkit-background-clip:text; 
                -webkit-text-fill-color:transparent; 
            }
        }
        .center_bg {
            width: 261px;
            height: 247px;
            position: relative;
            margin-top: 10px;
            overflow: hidden;
            img {
                width: 243px;
                height: auto;
                position: relative;
                z-index: 2;
            }
            &::after {
                content: "";
                position: absolute;
                width: 100%;
                height: 1080px;
                background: url('@/assets/turnable/center_point.png') no-repeat center;
                background-size: contain;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%);
                z-index: 1;
            }
        }
    }
  }
  .rule_box {
    width: 90%;
    border-radius: 4px;
    margin: 0 auto;
    // background: #232327;
    border-radius: 4px;
    // padding: 16px 8px;
    box-sizing: border-box;
    font-family: SWICC;
    margin-top: 20px;
    .title {
        color: #333;
        font-size: 16px;
        text-align: center;
        font-weight: 600;
    }
    .content {
        margin: 16px 8px;
        color: #333;
        font-size: 14px;
    }
  }
}
@keyframes scrollY {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-600px);
  }
}
@keyframes slide {
  from {
   background-position: bottom; 
  }
  to {
    background-position: top; 
  }
}
.lock_box {
    height: 90vh;
}
</style>