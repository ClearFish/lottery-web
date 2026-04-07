<template>
	<div class="bg">
         <div class="top_head">
            <div class="left">
                <van-icon name="arrow-left" size="22" color="#fff" @click="back"></van-icon>
            </div>
                <van-icon name="orders-o" color="#fff" bold size="30" @click="toRecord"></van-icon>
         </div>
        <div class="main" :class="langVal == 'yuenan' ? 'main_v' : ''">
            <div class="container">
                <div class="content_box">
                    <div class="container_box">
                        <div class="text_gift">
                            <img src="@/assets/giftcode/gift_tittle_v.png" alt="" v-if="langVal == 'yuenan'">
                            <img src="@/assets/giftcode/gift_tittle.png" alt="" v-else>
                        </div>
                        <div class="center_desc">
                            <img src="@/assets/giftcode/desc_v.png" alt="" v-if="langVal == 'yuenan'">
                            <img src="@/assets/giftcode/desc.png" alt="" v-else>
                        </div>
                        <div class="input_box">
                            <van-field 
                                :placeholder="$t('promotionactivity.enter_gift_code')" 
                                color="#757575" 
                                :border="false" 
                                placeholderStyle="color:#757575"
                                v-model="giftCode" />
                        </div>
                        <div class="btn_box">
                            <van-button :text="$t('promotionactivity.submit')" class="btn" @click="submit"></van-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <van-popup :show="show" class="rulePopup" >
            <div class="receive_box">
                <div class="title">
                    <div class="center_text">
                        <img src="@/assets/giftcode/dialog_title.png" alt="">
                    </div>
                    <div class="info_detail">
                        {{$t("promotionactivity.already_received")}}
                        <text class="amount">{{giftSymbol}}{{receiveNum}}</text>
                    </div>
                </div>
                <div class="info">
                    <div>{{$t("promotionactivity.Receive_a_Gift")}}</div>
                    <div class="add_margin">{{$t('promotionactivity.Best_Wishes')}}</div>
                </div>
                 <div class="rule-btn">
                    <div class="btn" @click="receiveGift">{{$t("promotionactivity.Receive")}}</div>
                </div>
            </div>
        </van-popup>
	</div>
</template>

<script  lang="ts" setup>
import { redenvelope } from '@/api/promotions'
import {ref,onMounted} from "vue"
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { $t } from '@/locales'
const giftCode:any = ref('')
const show:any = ref(false)
const receiveNum:any = ref('')
const giftSymbol:any = ref('VND')
const langVal:any = ref('yuenan')
const router = useRouter()

const back=()=> {
    router.back();
}
const toRecord=()=> {
    router.push('/giftcode/record');
}
const submit=async()=>{
    if(!giftCode.value) {
        showToast($t('promotionactivity.enter_gift_code'))
    }else {
        let obj = {
            receive_code:giftCode.value
        }
        try {
            let res:any = await redenvelope(obj);
            show.value = true;
            receiveNum.value = res?.receive_amount
            giftSymbol.value = res?.currency_symbol
        }catch(error) {
            showToast(error.msg)
        }
    }
    
}
const receiveGift=()=> {
    show.value = false
}
</script>

<style lang="less" scoped>
.bg {
    padding: 0px !important;
    height: 100vh;
    background: #090909;
    position: relative;
    .top_head {
        position: absolute;
        left: 0;
        top: 0;
        height: 50px;
        width: 100%;
        display: flex;
        padding: 0 10px;
        box-sizing: border-box;
        z-index: 20;
        justify-content: space-between;
        align-items: center;
    }
    .top_nav {
        background: #090909;
        color: #fff;
        height: 50px;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
.main {
    background: url("@/assets/giftcode/gift_bg.png") no-repeat center;
    background-size: 100% 100%;
    height: 100vh;
    position: relative;
    .container {
        // padding: 24px;
        .top_con {
            .title {
                color: #f9e8e8;
                font-size: 22px;
                margin-bottom: 8px;
            }
            .content {
                color: #f9e8e8;
                font-size: 16px;
            }
        }
        .content_box {
            // padding: 10px;
            box-sizing: border-box;
            .container_box {
                width: 92%;
                height: 400px;
                padding: 30px 15px;
                background: url("@/assets/giftcode/gift_bottom.png") no-repeat top;
                background-size: 100% 100%;
                position: absolute;
                bottom: 70px;
                left: 50%;
                transform: translateX(-50%);
                .center_desc {
                    position: absolute;
                    width: 100%;
                    left: 0;
                    top: 41%;
                    height: 187px;
                    transform: translateY(-50%);
                    img {
                        width: 100%;
                        height: auto;
                    }
                }
                .text_gift {
                    text-align: center;
                    font-size: 22px;
                    padding-top: 20px;
                    img {
                        width: 152px;
                        height: 24px;
                        margin: 0 auto;
                    }
                }
                .input_box {
                    margin-top: 180px;
                     ::v-deep .van-cell  {
                        width: 80%;
                        margin: 0 auto;
                        background-color: #433F3E;
                        padding: 4px 10px !important;
                        border-radius: 8px;
                        margin-bottom: 10px;
                        font-size: 12px !important;
                        height: 43px;
                        .van-field__body {
                            height: 100%;
                        }
                    }
                }
                .btn_box {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    margin-top: 25px;
                    .btn {
                        background-image: linear-gradient(to bottom, #FFE0C6 0%, #F9AD74 100%);
                        color: #653105;
                        font-weight: 600;
                        border: none !important;
                        width: 186px;
                        height: 46px;
                        border-radius:23px;
                    }
                }
            }
            @media screen and (min-width:450px){
                .container_box {
                    height: 600px;
                    .text_gift {
                        padding-top: 50px;
                    }
                    .input_box {
                        margin-top: 335px;
                    }
                }
            }
        }

    }
}
.rulePopup {
    // ::v-deep {
    //     .u-popup__content {
    //         width: 90%;
    //         height: 350px;
    //         background: url("@/assets/giftcode/gift_dialog.png") no-repeat center;
    //         background-size: 100% 100%;
    //         display: flex;
    //         justify-content: center;
    //         align-items: center;
    //     }
    // }
     width: 90%;
    height: 350px;
    background: url("@/assets/giftcode/gift_dialog.png") no-repeat center;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    box-sizing: border-box;
    .receive_box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 85px;
        .title {
            // background: #f2413b;
            border-radius: 15px 15px 0 0 ;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .center_text {
                width: 174px;
                img {
                    width: 100%;
                    height: auto;
                }
            }
            .info_detail {
                width: 90%;
                box-sizing: border-box;
                color: #333333;
                border-radius: 4px;
                line-height: 20px;
                font-size: 15px;
                display: block;
                margin-top: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid #E4C3A8;
                .amount {
                    color: #BC110B;
                    margin-left: 4px;
                }
            }
            view {
                display: flex;
                justify-content: center;
            }
            .add_margin {
                margin-top: 10px;
            }
        }
        .info {
            box-sizing: border-box;
            color: #75160A;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding: 10px 0;
            .addfont {
                font-size: 18px;
                font-weight: 600;
            }


        }
        .rule-btn {
            margin-top: 35px;
            .btn {
                width: 148px;
                height: 37px;
                background-image: linear-gradient(180deg, #FFD73A 0%, #FFBA16 100%);
                border: 2px solid #FFF6CF;
                box-shadow: 0 3px 6px 3px #48000033;
                border-radius: 18.5px;
                font-weight: 900;
                font-size: 15px;
                color: #75160A;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
}
.main_v {
    background: url("@/assets/giftcode/gift_bg_v.png") no-repeat center;
    background-size: 100% 100%;
}
</style>