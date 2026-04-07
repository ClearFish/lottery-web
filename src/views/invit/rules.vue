<template>
    <div class="big_box">
        <div class="top_box">
            <img src="@/assets/promotions/title.png" alt="" class="title_bg" v-if="langVal != 'yuenan'">
            <div class="sub_title">{{$t('invite.This_activity_is_valid')}}</div>
        </div>
        <div class="container_box">
            <div class="item_box">
                <div class="top_step">01</div>
                <div class="content">{{$t('invite.activity_rules_01')}}</div>
            </div>
            <div class="item_box">
                <div class="top_step">02</div>
                <div class="content">{{$t('invite.activity_rules_02')}}</div>
            </div>
            <div class="item_box">
                <div class="top_step">03</div>
                <div class="content"></div>
            </div>
            <div class="item_box">
                <div class="top_step">04</div>
                <div class="content">{{$t('invite.activity_rules_04')}}</div>
            </div>
            <div class="item_box">
                <div class="top_step">05</div>
                <div class="content">{{$t('invite.activity_rules_05')}}</div>
            </div>
            <div class="table_box">
                <div class="title_con">
                    <div class="title_item">{{$t('invite.Rebate_level')}}</div>
                    <div class="title_item">{{$t('invite.Day_Betting')}}</div>
                    <div class="title_item">{{$t('invite.Team_Betting')}}</div>
                    <div class="title_item">{{$t('invite.Team_Deposit')}}</div>
                </div>
                <div class="table_con">
                    <div class="table_item">
                        <van-collapse :border="false" v-model="activeIndex">
                            <van-collapse-item  v-for="(item,index) in lists" :key="index" :name="index">
                                 <template #title>
                                    <div  class="item_title">
                                        <div class="con lv">
                                            <van-icon name="arrow" color="#EF7C4F" size="12" :class="activeIndex == index ? 'trun_down':''"></van-icon>
                                            <div class="lv_num">L{{item.level}}</div>
                                        </div>
                                        <div class="con">{{item.day_bet_money}}</div>
                                        <div class="con">{{item.team_pay_count}}</div>
                                        <div class="con">{{item.team_pay_money}}</div>
                                    </div>
                                 </template>
                                <div class="item_con">
                                    <div class="item_list_box">
                                        <div class="con_title">
                                            <div class="title_item">{{$t('invite.Local')}}</div>
                                            <div class="title_item">{{$t('invite.lottery')}}</div>
                                            <div class="title_item">{{$t('invite.Cards')}}</div>
                                            <div class="title_item">{{$t('invite.Live')}}</div>
                                            <div class="title_item">{{$t('invite.Sports')}}</div>
                                            <div class="title_item">{{$t('invite.Chess')}}</div>
                                        </div>
                                        <div class="con_container">
                                            <div class="container_item" v-for="(ite,inx) in item.odds_json" :key="inx+'odd'">
                                                <div class="con_ite">{{ite.local_odds}}</div>
                                                <div class="con_ite">{{ite.lottery_odds}}</div>
                                                <div class="con_ite">{{ite.card_odds}}</div>
                                                <div class="con_ite">{{ite.live_odds}}</div>
                                                <div class="con_ite">{{ite.sports_odds}}</div>
                                                <div class="con_ite">{{ite.slots_odds}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- <div slot="right-icon"></div> -->
                            </van-collapse-item>
                        </van-collapse>
                    </div>
                </div>
            </div>
            <div class="item_box">
                <div class="top_step">06</div>
                <div class="content">{{$t('invite.activity_rules_06')}}</div>
            </div>
            <div class="item_box">
                <div class="top_step">07</div>
                <div class="content">{{$t('invite.activity_rules_07')}}</div>
            </div>
            <div class="item_box">
                <div class="top_step">08</div>
                <div class="content">{{$t('invite.activity_rules_08')}}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {ref,onMounted} from "vue"
import {rebateConfig } from '@/api/promotions'
import { $t } from '@/locales'
const lists:any = ref([]);
const activeIndex:any = ref([0]);
const langVal:any = ref('yuenan')
onMounted(()=>{
    getConfig()
})
const getConfig = async()=>{
    let res = await rebateConfig();
    lists.value = res
}
// const changeColl=(index:any)=> {
//     console.log(index)
//     if(index == activeIndex.value) {
//         activeIndex.value = null
//     }else {
//         activeIndex.value = index
//     }
// }
</script>
<style lang="less" scoped>
@font-face {
    font-family: CrimsonText-Bold;
    src: url("@/assets/font/CrimsonText-Bold.ttf");
}
@font-face {
    font-family: PlayfairDisplaySC-Bold;
    src: url("@/assets/font/PlayfairDisplaySC-Bold.ttf");
}
.big_box {
    width: 100%;
    min-height: 100vh;
    padding-bottom: 20px;
    background: #fff;
    background-size: 100% 100%;
    .top_box {
        width: 100%;
        position: relative;
        padding: 0 20px;
        padding-top: 25px;
        box-sizing: border-box;
        z-index: 1;
        .title_bg {
            width: 100%;
            height: auto;
        }
        .sub_title {
            text-align: center;
            font-family: CrimsonText-Bold;
            font-weight: 600;
            font-size: 18px;
            color: #F3553B;
            margin-top: 6px;
        }
        &::after {
            content: "";
            width: 346px;
            height: 353px;
            background: url("@/assets/promotions/top_bg1.png") no-repeat center;
            background-size: 100% 100%;
            position: absolute;
            right: 0;
            top: 90px;
            z-index: 1;
        }
    }
    .container_box {
        position: relative;
        z-index: 2;
        padding: 0 16px;
        margin-top: 203px;
        .item_box {
            width: 100%;
            margin-bottom: 15px;
            .top_step {
                font-size: 24px;
                color: #FFFFFF;
                font-family: PlayfairDisplaySC-Bold;
                height: 35px;
                background: #FFFFFF;
                background-image: linear-gradient(131deg,#DD352A  0%, #FFBE71 100%);
                box-shadow: inset 0 -1px 3px 0 #0000004d;
                border-radius: 10px 10px 0 0;
                text-align: center;
                line-height: 35px;
                
            }
            .content{
                padding: 10px;
                border-radius: 0 0 10px 10px;
                background-image: linear-gradient(134deg, #F4FAEE 0%, #FBEAD9 100%);
                font-size: 13px;
                color: #666666;
            }
        }
        .table_box {
            width: 100%;
            margin-bottom: 15px;
            .title_con {
                height: 35px;
                background: #FFFFFF;
                background-image: linear-gradient(131deg,#DD352A  0%, #FFBE71 100%);
                box-shadow: inset 0 -1px 3px 0 #0000004d;
                border-radius: 10px 10px 0 0;
                text-align: center;
                display: flex;
                align-items: center;
                .title_item {
                    flex: 1;
                    font-size: 10px;
                    color: #FFFFFF;
                    text-align: center;
                    line-height: 35px;
                }
            }
            .table_con {
                padding: 10px 0;
                border-radius: 0 0 10px 10px;
                background-image: linear-gradient(134deg, #F4FAEE 0%, #FBEAD9 100%);
                .table_item {
                    
                    :deep(.van-collapse) {
                            .van-cell__right-icon {
                                display: none !important;
                            }
                            .item_title {
                                display: flex;
                                height: 36px;
                                align-items: center;
                                .con {
                                    flex: 1;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    font-weight: 700;
                                    font-size: 14px;
                                    color: #666666;
                                    &.lv {
                                        display: flex;
                                        align-items: center;
                                        gap: 4px;
                                        .lv_num {
                                            width: 53px;
                                            height: 21px;
                                            background: url("@/assets/promotions/lv_bg.png") no-repeat center;
                                            background-size: 100% 100%;
                                            font-size: 11px;
                                            color: #FFEA91;
                                            padding-left: 28px;
                                            line-height: 21px;
                                        }
                                        .u-icon {
                                             transition: all 0.3s linear 0s;
                                        }
                                        .trun_down {
                                            transform-origin: center center;
                                            transform: rotateZ(90deg);
                                        }
                                    }
                                }
                            }
                            .item_con {
                                padding: 0 6px;
                                .item_list_box {
                                    border: 1px solid #FFBC70;
                                    border-radius: 6px;
                                    background: #fff;
                                    .con_title {
                                        width: 100%;
                                        display: flex;
                                        height: 44px;
                                        align-items: center;
                                        border-bottom: 1px solid #FFBC70;
                                        .title_item {
                                            flex: 1;
                                            text-align: center;
                                            font-weight: 700;
                                            font-size: 12px;
                                            color: #666666;
                                        }
                                    }
                                    .con_container {
                                        width: 100%;
                                        font-size: 10px;
                                        .container_item {
                                            width: 100%;
                                            display: flex;
                                            height: 44px;
                                            align-items: center;
                                            .con_ite {
                                                flex: 1;
                                                text-align: center;
                                                font-weight: 900;
                                                font-size: 10px;
                                                color: #666666;
                                            }
                                        }
                                    }
                                }
                            }
                            .u-cell--clickable {
                                background: none !important;
                            }
                        }
                    &:nth-child(2n) {
                        ::v-deep {
                            .van-collapse {
                                .u-cell {
                                    background: #FFFFFF;
                                }
                                .u-cell--clickable {
                                    background: #FFFFFF !important;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>