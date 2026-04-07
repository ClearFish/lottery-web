<template>
        <van-popup   
            :show="show"
            round
            position="top"
    >
        <div class="slot-content transfer_content">
            <div class="content_box">
                <div class="top_head">
                    <img :src="TopInfoBg" alt="" class="top_img"/>
                    <div class="title_info"></div>
                </div>
                <div v-if="lotteryInfo.result && lotteryInfo.result.length" class="content_con">
                    <div class="center_container">
                        <div class="congra_box">
                            <!-- <img src="@/assets/game/betinfo/title_word.png" alt="" class="con_word"> -->
                                <p>{{ $t('lottery.congratulation') }}</p>
                        </div>
                        <div class="infoTop" v-if="gameType == 'win'">
                            <div class="result_word">{{$t('lottery.tablek3th5')}}:</div>
                            <div class="left_color">
                                <div v-if="[2,4,6,8].includes(Number(lotteryInfo.result[0]))" class="result_word red">{{$t('lottery.Red')}}</div>
                                <div v-if="[1,3,7,9].includes(Number(lotteryInfo.result[0]))" class="result_word green">{{$t('lottery.Green')}}</div>
                                <div v-if="lotteryInfo.result[0] == 0" class="zero"></div>
                                <div v-if="lotteryInfo.result[0] == 5" class="five"></div>
                            </div>
                            <div class="result_content result_content_win">
                                <div>{{lotteryInfo.result[0]}}</div>
                            </div>
                            <div class="size_info">
                                <div v-if="lotteryInfo.result[0] > 4" class="big">{{$t('lottery.winGobig')}}</div>
                                <div v-else class="small">{{$t('lottery.winGosmall')}}</div>
                            </div>
                        </div>
                        <div class="infoTop" v-if="gameType == '5d'">
                            <div class="result_content result_content_5d">
                                <div class="result" :class="{'other_fake':index == 4}" v-for="(item,index) in lotteryInfo.result" :key="index">
                                    {{item}}
                                    <text class="game_typeindex">{{game5d[index]}}</text>
                                </div>
                                <div class="sum_5d">{{lotteryInfo.sum_num}}</div>
                            </div>
                        </div>
                        <div class="infoTop" v-if="gameType == 'k3'">
                            <div class="result_content result_content_k3">
                                <div class="result" v-for="(item,index) in lotteryInfo.result" :key="index">
                                    <img :src="`/static/game/dice${item}.png`"/>
                                </div>
                            </div>
                        </div>
                        <div class="bet_cont">
                            <div class="title_bet">{{$t('sign.Bonous')}}</div>
                            <div class="number">{{winNum}}VND</div>
                            <div class="game_item">
                                <div class="title">{{$t('promotionactivity.period')}}</div>
                                <div class="game_typs">{{typeFilter(lotteryInfo.game_id)}}</div>
                                <div class="content">{{lotteryInfo.period}}</div>
                            </div>
                        </div>
                    </div>
                </div> 
                <div class="bottom_btn">
                    <van-icon name="close" color="#fff"  @click="closeDialog" size="28"/>
                </div>
            </div>
        </div>
    </van-popup>
</template>
<script lang="ts" setup>
// @ts-nocheck
import { ref } from "vue"
import { periodBetRecord } from '@/api/lottery'
import TopInfoBg from "@/assets/game/betinfo/top_info.png"
const show:any = ref(false);
const game5d:any = ref(['A','B','C','D','E']);
const lotteryInfo:any = ref();
const betInfo:any = ref([]);
const timer:any = ref(null);
const winNum:any = ref('0.00');
const props = defineProps({
    gameType:{
        default: () => {
            return '' as any ;
        }
    }
})
const typeFilter=(type:any)=> {
    let obj = {
        '1':"1 min",
        '2':"3 min",
        '3':"5 min",
        '4':"10 min"
    }
    return obj[type]
}
const open = async(requestinfo:any,info:any)=> {
    let res = await periodBetRecord(requestinfo);
    lotteryInfo.value = info;
    betInfo.value = res.rows;
    if(res.rows && res.rows.length >0) {
        let amount = 0
        amount = res.rows.reduce((amount:any,item:any)=>Number(amount)+Number(item.net_amount),amount)
        winNum.value = amount.toFixed(2)
    }else {
        winNum.value = 0
    }
    show.value = true;
    setTimeout(()=>{
        show.value = false
    },5000)
}
const closeDialog =()=> {
    show.value = false
}
</script>
<style lang="less" scoped>
@font-face {
    font-family: 'buttersans-Regular';
    src: url("@/assets/font/buttersans-Regular.otf");
}
@font-face {
    font-family: 'Archive';
    src: url("@/assets/font/Archive.otf");
}

.van-popup {
    overflow: initial !important;
    width: 100%;
    // padding: 0 23px;
    background: none !important;
    .transfer_content {
        padding:  0 23px;
        background-size: 100% 100%;
        .content_box {
            min-height: 370px;
            padding: 12px 25px 25px 25px;
            position: relative;
            border-radius: 6px;
            box-sizing:border-box;
            // background: #fff;
            border-radius: 10px;
            box-sizing:border-box;
            // background: url("@/assets/game/new/bet_bg.png") no-repeat center;
            // background-size: 100% 100%;
            max-width: 380px;
            border-radius: 30px;
            margin: 0 auto;
            .top_head {
                width: 100%;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                position: relative;
                .top_img {
                    width: 98%;
                    height: auto;
                    position: relative;
                    z-index: 2;
                }
                .title_info {
                    width: 300px;
                    height: 43px;
                    background:  #EF233B;
                    position: absolute;
                    bottom: 15px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding-bottom: 24px;
                    z-index: 5;
                    &::after {
                        content: "";
                        width: 123px;
                        height: 29px;
                        background: url("@/assets/header_logo.png") no-repeat center;
                        background-size: 100% 100%;
                        position: absolute;
                        left: 50%;
                        top:50%;
                        transform: translate(-50%,-50%);
                    }
                }
            }
            .top_title {   
                color: #fff;
                font-weight: 900;
                font-size: 22px;
                display: flex;
                justify-content: center;
                position: relative;
                z-index: 2;
                padding-top: 20px;
                margin-top: -12px;
            }
            .infoTop {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                z-index: 2;
                gap: 10px;
                margin-top: 10px;
                .result_word {
                    font-family: 'buttersans-Regular';
                    font-size: 18px;
                    color: #8A4B27;
                    font-weight: 400;
                }
                .result_content {
                    width: 39px;
                    height: 39px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 40px;
                    // border: 2px solid #FD2423;
                    padding: 2px;
                    box-sizing:border-box;
                    position: relative;
                    z-index: 2;
                    .result {
                        font-weight: 900;
                        font-size: 40px;
                        color: #fff;
                        width: 100%;
                        border-radius: 40px;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                            position: relative;
                        z-index: 2;
                    }
                    
                }
                .result_content_win {
                    // margin-top: 40px;
                    width: 39px;
                    height: 39px;
                    // background: #fff;
                    border-radius: 8px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                        position: relative;
                    z-index: 2;
                    background: #000;
                    border-radius: 20px;
                    color: #fff;
                    img {
                        width: 39px;
                        height: 39px;
                    }
                }
                // .isZero {
                //     .result {
                //         background-image: linear-gradient(to bottom right, #fb4e4e 50%, #eb43dd 0) !important;
                //     }
                // }
                // .isodd {
                //     .result {
                //         background: #FD2423;
                //     }
                // }
                // .isOne {
                //     border-color: #5cba47;
                //     .result {
                //         background: #5cba47;
                //     }
                // }
                // .isFive {
                //     border-color: #5cba47;
                //     .result {
                //         background-image: linear-gradient(to bottom right, #5cba47 50%, #eb43dd 0) !important;
                //     }
                // }
                .left_color {
                    width: 66px;
                    height: 39px;
                    .result_word {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 14px;
                        color: #fff;
                        font-family: Archive;
                    }
                    .red {
                        width: 100%;
                        height: 100%;
                        background: #FF4126;
                        border-radius: 6px;
                    }
                    .green {
                        width: 100%;
                        height: 100%;
                        background: #60B000;
                        border-radius: 6px;
                    }
                    .zero {
                        width: 100%;
                        height: 100%;
                        background: #FF4126;
                        border-radius: 6px;
                        position: relative;
                        &::after {
                            content: "";
                            width: 50%;
                            height: 100%;
                            background: #8C31D1;
                            border-radius: 0 6px 6px 0;
                            position: absolute;
                            top: 0;
                            right: 0;

                        }
                    }
                    .five {
                        width: 100%;
                        height: 100%;
                        background: #60B000;
                        border-radius: 6px;
                        position: relative;
                        &::after {
                            content: "";
                            width: 50%;
                            height: 100%;
                            background: #8C31D1;
                            border-radius: 0 6px 6px 0;
                            position: absolute;
                            top: 0;
                            right: 0;

                        }
                    }
                }
                .size_info {
                    width: 45px;
                    height: 39px;
                    .big {
                        width: 100%;
                        height: 100%;
                        background: #FF9C0D;
                        border-radius: 6px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-weight: 600;
                        font-size: 14px;
                        color: #FFFFFF;
                    }
                    .small {
                        width: 100%;
                        height: 100%;
                        background: #8DC9FF;
                        border-radius: 6px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-weight: 600;
                        font-size: 14px;
                        color: #FFFFFF;
                    }
                }
                .result_content_5d {
                    width: 100%;
                    border: none;
                    gap: 15px;
                    .result {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        border: 0.5px solid #000;
                        color: #000;
                        background: #f4f4f4;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-weight: normal;
                        font-size: 18px;
                        position: relative;
                        &::after {
                            content: "+";
                            position: absolute;
                            right: -15px;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                        .game_typeindex {
                            position: absolute;
                            bottom: -25px;
                        }
                    }
                    .other_fake {
                        &::after {
                            content: "=";
                        }
                    }
                    .sum_5d {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        color: #fff;
                        background: #FD2423;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-weight: normal;
                        font-size: 18px;
                    }
                }
                .result_content_k3 {
                        width: 100%;
                    border: none;
                    gap: 15px;
                    .result {
                        width: 50px;
                        height: 50px;
                    }
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .bet_cont {
                width: 90%;
                margin: 0 auto;
                margin-top: 10px;
                height: 110px;
                background:  url("@/assets/game/betinfo/bet_infog.png") no-repeat center;
                background-size: 100% 100%;
                padding: 14px;
                margin-top: 30px;
                &::before {
                    content: "";
                    width: 25px;
                    height: 40px;
                    position: absolute;
                    left: -20px;
                    top: 50px;
                    z-index: -1;
                    background: url("@/assets/game/betinfo/title_fake.png") no-repeat center;
                    background-size: 100% 100%;
                    transform: rotateY(180deg)
                }
                &::after {
                    content: "";
                    width: 25px;
                    height: 40px;
                    position: absolute;
                    right: -20px;
                    top: 50px;
                    z-index: -1;
                    background: url("@/assets/game/betinfo/title_fake.png") no-repeat center;
                    background-size: 100% 100%;
                }
                .title_bet {
                    font-family: buttersans-Regular;
                    font-size: 15.4px;
                    color: #8A4B27;
                    text-align: center;
                }
                .number {
                    font-weight: 400;
                    font-size: 26.4px;
                    color: #D22A2A;
                    text-align: center;
                    font-family: Archive;
                    background-image: linear-gradient(to bottom, #EFF3E8, #EAEFB2);
                    -webkit-background-clip: text;
                    color: transparent;
                }
                .game_item {
                    display: flex;
                    justify-content: center;
                    gap: 4px;
                    font-weight: 600;
                    font-size: 12px;
                    color: #fff;
                    opacity: 0.6;
                    margin-top: 10px;
                }
            }
            .content_con {
                height: 358px;
                background: url("@/assets/game/betinfo/info_content.png") no-repeat center;
                background-size: 100% 100%;
                position: absolute;
                top: 130px;
                width: 90%;
                left: 50%;
                transform: translateX(-50%);
                z-index: 4;
                padding: 8px;
                .center_container {
                    // background: linear-gradient(180deg, #F3E3C9 0%, #F3CF97 100%);
                    border-radius: 11px;
                    padding-top: 90px;
                    height: 100%;
                    .congra_box {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        margin-bottom: 20px;
                        .con_word {
                            width: 80%;
                            height: auto;
                        }
                         font-size: 16px;
                        color: #861508;
                        font-family: 'buttersans-Regular';
                        font-weight: 600;
                    }
                    .title_word {
                        height: 19px;
                        font-family: Archive;
                        font-size: 15.4px;
                        color: #861508;
                        text-align: center;
                    }
                }
            }
            .gameInfo {
                width: 100%;
                // padding: 0 20px;
                box-sizing: border-box;
                margin-top: 20px;
                position: relative;
                z-index: 2;
                .game_item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 400;
                    font-weight: 500;
                    font-size: 15px;
                    color: #fff;
                    background: #DFF9E9;
                    border-radius: 4px;
                    .title {
                        width: 81px;
                        height: 45px;
                        // background: url("@/assets/game/new/peroid_bg.png") no-repeat center;
                        // background-size: 100% 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .content {
                        flex: 1;
                        height: 45px;
                        // background: #fff;
                        color: #333333;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 4px;
                    }
                }
            }
            .bet_info {
                margin-top: 20px;
                position: relative;
                z-index: 2;
                .bet_title {
                    display: flex;
                    height: 35px;
                    align-items: center;
                    text {
                        flex: 1;
                        font-weight: 400;
                        font-size: 16px;
                        color: #666666;
                        display: flex;
                        justify-content: center;
                    }
                }
                .bet_content {
                    max-height: 260px;
                    overflow: scroll;
                }
                .bte_item {
                    display: flex;
                    height: 35px;
                    align-items: center;
                    text {
                        flex: 1;
                        font-weight: 400;
                        font-size: 16px;
                        color: #666666;
                        display: flex;
                        justify-content: center;
                    }
                    .add_weight {
                        color: #000;
                        font-weight: 500;
                    }
                    &:nth-child(2n-1) {
                        background: #DFF9E9;
                    }
                    .addcolor_Small {
                        color: #5cba47;
                    }
                    .addcolor_Big{
                        color: #ffc511;
                    }
                    .addcolor_Red {
                        color: #fb4e4e;
                    }
                    .addcolor_Green {
                        color: #5cba47;
                    }
                    .addcolor_Violet {
                        color: #db5fd1;;
                    }
                    .isOdd {
                        color: #FD2423;
                    }
                    .isOne {
                        color: #5cba47;
                    }
                }
            }
            .no_bet {
                padding: 20px 0;
                box-sizing:border-box;
                text-align: center;
            }
        }
        .bottom_btn {
            position: absolute;
            bottom: -180px;
            left: 50%;
            transform: translateX(-50%);
        }
    }
}
</style>