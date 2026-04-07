<template>
    <div class="bettward_box">
        <van-nav-bar :title="$t('promotionactivity.Betting_rewards')" fixed left-text="" left-arrow @click-left="onClickLeft">
            <template #right>
                <van-icon name="orders-o" size="20" @click="toRecord"/>
            </template>
        </van-nav-bar>
        <div class="tabs_list">
            <div class="tabs_container">
                <div class="tab_item" v-for="(item,index) in tabs" @click="choseTab(item,index)" :key="index" :class="chosedId == item.id?'active_item' :''">
                    <div class="label">{{item.title}}</div>
                </div>
            </div>
        </div>
        <div class="list_box">
            <div class="loading-overlay" v-if="loading">
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <div class="loading-text">{{ $t('sign.Loading') }}</div>
                </div>
            </div>
            <div v-else>
                <div class="list_item" v-for="(item,index) in dataList" :key="index">
                    <div class="top_title">
                        <div class="left_title">{{ item.title }}</div>
                        <div v-if="item.completed>=item.schedule" class="status status_fin">{{ $t('promotionactivity.Finished') }}</div>
                        <div v-else class="status">{{ $t('promotionactivity.Unfinished') }}</div>
                    </div>
                    <div class="goal">
                        <img src="@/assets/promotions/sports_betting.svg" alt="">
                        <div class="goal_title">{{ $t('promotionactivity.Betting_Bonus') }}</div>
                        <div class="goal_value">{{item.completed}}/{{item.schedule}}</div>
                    </div>
                    <div class="desc">{{item.synopsis}}</div>
                    <div class="bonus_box">
                        <div class="bonus_title">{{ $t('promotionactivity.Award_amount') }}</div>
                        <div class="bonus_value">
                            <img src="@/assets/promotions/wallet.svg" alt="">
                            <div class="value_con">{{numberFormat(item.bonus)}} {{item.symbo}}</div>
                        </div>
                    </div>
                    <div class="bottom_act">
                        <div class="bttom_btn completed_btn" v-if="item.completed>=item.schedule">
                            <div v-if="item.receive" class="btn received">{{$t('promotionactivity.RECEIVED')}}</div>
                            <div v-else class="btn right_1" @click="receiveBonous(item)">{{$t('promotionactivity.Get_Now')}}</div>
                        </div>
                        <div class="bttom_btn" v-else @click="toHome">{{ $t('promotionactivity.Go_to_play') }}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 领取结果 -->
        <div class="get_bonosbox">
            <van-popup   
                    :show="show"
            >
                <div class="slot-content transfer_content">
                    <div class="content_box">
                        <div class="top_head">
                            <img src="@/assets/game/betinfo/top_info.png" alt="" class="top_img">
                            <div class="title_info"></div>
                        </div>
                        <div  class="content_con">
                            <div class="center_container">
                                <div class="congra_box">
                                    <img src="@/assets/game/betinfo/title_word.png" alt="" class="con_word">
                                </div>
                                <div class="bet_cont">
                                    <div class="title_bet">{{$t('sign.Bonous')}}</div>
                                    <div class="number">{{numberFormat(getBonus)}} {{getSymbo}}</div>
                                </div>
                            </div>
                        </div> 
                        <div class="bottom_btn">
                            <van-icon name="cross" color="#fff"  @click="show=false" size="28"></van-icon>
                        </div>
                    </div>
                </div>
            </van-popup>
        </div>
        <FloatingService />
    </div>
</template>
<script lang="ts" setup>
import { promotionsList,promotionsReceive } from '@/api/promotions'
import {ref,onMounted,nextTick,computed} from "vue"
import FloatingService from '@/components/FloatingService/index.vue'
import { getSite } from '@/api/slide'
import { $t } from '@/locales'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import {useSiteStore} from "@/store/modules/site"
import { useUserStore } from '@/store/modules/user'

const router = useRouter()

const dataList:any = ref([])
const bonousList:any = ref([
    {currency:'SYSTEM',symbo:'VND'},
    {currency:'USDT',symbo:'USDT'}
])
const show:any = ref(false)
const getSymbo:any = ref('VND')
const getBonus:any = ref('')
const tabs:any = ref([
    {label:'Today',id:''},
    // {label:'Yseterday',id:40},
    {label:'This Month',id:''},
    {label:'Last Week',id:''},
    // {label:'Last Month',id:''},
    {label:'Lucky Month',id:''},
])
const chosedId:any = ref(4)
const loading:any = ref(false)
const tabObj:any = ref({})
onMounted(()=>{
    getSites()
})
const onClickLeft = ()=>{
    router.go(-1)
}
const getSites = async()=>{
    let res = await getSite();
    let bet_group_id = res.bet_group_id;
    console.log('bet_group_id',bet_group_id)
    if(bet_group_id.indexOf('=') == -1) {
        let lists = bet_group_id.split(',');
        chosedId.value = lists[0]
        tabs.value.map((item,index)=>item.id = lists[index])
        tabs.value = tabs.value.filter(item=>item.id)
        console.log(tabs.value,"222")
        getData(lists[0])
    }else {
        let lists = bet_group_id.split(',');
        let arr = []
        lists.map((item:any)=>{
            let obj:any = {};
            obj.title = item.split('=')[0];
            obj.id = item.split('=')[1];
            arr.push(obj)
        })
        tabs.value = arr;
        chosedId.value = tabs.value[0].id;
        console.log(tabs.value,"222")
        getData(chosedId.value)
    }
}
const numberFormat=(number)=> {
    if(number%1000 == 0) {
        // 能被1000整除转为K
        return (number/1000).toLocaleString()+'K'
    }else{
        return number.toLocaleString()
    }
}
const toRecord=()=>{
   router.push('/promotion-activity/receiverecords')
}
const choseTab=(item,index)=> {
   chosedId.value = item.id;
    tabObj.value = item
    getData(item.id)
}
const getData=async(id:any)=> {
    loading.value = true
    let res:any = await promotionsList({group_id:id});
    dataList.value = res.rows.map(item=>{
        let symbalObj = bonousList.value.find(ite=>ite.currency == item.currency);
        item.symbo = symbalObj.symbo;
        return item
    })
    loading.value = false
}
const receiveBonous=async(item:any)=> {
    let bonousInfo = bonousList.value.find(ite=>ite.currency == item.currency);
    item.symbo = bonousInfo.symbo;
    try {
        await promotionsReceive({id:item.id});
        getSymbo.value = item.symbo
        getBonus.value = item.bonus
        show.value = true
        dataList.value = [];
        getData(chosedId.value)
    }catch(error) {
        showToast(error.msg)
    }finally{
        dataList.value = [];
        getData(chosedId.value)
    }
}
const toHome=()=>{
    router.push('/')
}
</script>
<style lang="less" scoped>
.bettward_box {
    background: #F5F7FA;
    min-height: 100vh;
    padding-bottom: 20px;
    padding-top: 56px;
    .top_container {
        padding: 20px 10px;
        padding-top: 0;
        display: flex;
        align-items: center;
        background-image: linear-gradient(180deg, #58B8FD 15%, #FFFFFF 100%);
        margin-block: -1px;
        gap: 15px;
        .left_bg {
            img {
                width: 104px;
                height: 104px;
            }
        }
        .right_word {
            color: #fff;
            .ttile {
                font-size: 16px;
                color: #fff;
                font-weight: 800;
                margin-bottom: 10px;
            }
            .content {
                font-display: 12px;
                margin-bottom: 5px;
            }
        }
    }
    .list_box {
        margin-top: 20px;
        padding: 0 10px;
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
        .list_item {
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 1px 1px #d0d0ed5c;
            margin-bottom: 16px;
          .top_title {
            display: flex;
            justify-content: space-between;
            padding-right: 10px;
            box-sizing: border-box;
            height: 36px;
            border-bottom: 1px solid #cdcdcd;
            align-items: center;
            .left_title {
                padding: 0 10px;
                background: #58B8FD;
                border-radius: 10px 0 10px 0;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                font-weight: 600;
                height: 100%;
            }
            .status {
                padding: 4px 6px;
                font-size: 12px;
                color: #63CAF3;
                border: 1px solid #63CAF3;
                border-radius: 4px;
            }
            .status_fin {
                color: #00BA82;
                border: 1px solid #00BA82;
            }
          }
          .goal {
            display: flex;
            align-items: center;
            margin-top: 10px;
            padding: 0 10px;
            box-sizing: border-box;
            img {
                width: 18px;
                height: 18px;
            }
            .goal_title {
                margin-right: 10px;
                color: #666;
            }
            .goal_value {
                color: #17A8C9;
            }
          } 
          .desc {
            margin-top: 10px;
            color: #666;
            font-size: 14px;
            padding: 0 10px;
          }
          .bonus_box {
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
            box-sizing: border-box;
            margin-top: 10px;
            border-bottom: 1px solid #cdcdcd;
            padding-bottom: 10px;
            .bonus_title {
                color: #666;
            }
            .bonus_value {
                display: flex;
                align-items: center;
                color: #ff7d06;
                img {
                    width: 20px;
                    height: 20px;
                }
            }
          } 
          .bottom_act {
            padding: 10px;
            box-sizing: border-box;
            .bttom_btn {
                width: 80%;
                margin: 0 auto;
                height: 34px;
                text-align: center;
                line-height: 34px;
                 background-image: linear-gradient(180deg, #58B8FD 0%, #3B7FF8 100%);
                color: #fff;
                font-size: 16px;
                font-weight: 600;
                border-radius: 30px;
            }
            .completed_btn {
                background-image: none;
                color: #006889;
                border: 1px solid #006889;
                .right_1 {
                    background-image: linear-gradient(180deg, #58B8FD 0%, #006889 100%);
                    color: #fff;
                    border-radius: 30px;
                }
                .received {
                    background: #006889;
                    color: #fff;
                    border-radius: 30px;
                }
            }
          }
        }
    }
    .get_bonosbox {
        width: 100%;
        ::v-deep {
        .van-popup {
            overflow: initial !important;
                overflow: initial !important;
                width: 100%;
                background: none !important;
                .transfer_content {
                    padding:  0 23px;
                    background-size: 100% 100%;
                    .content_box {
                        min-height: 450px;
                        padding: 12px 25px 25px 25px;
                        position: relative;
                        border-radius: 6px;
                        box-sizing:border-box;
                        border-radius: 10px;
                        box-sizing:border-box;
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
                                height: 43px;
                                background:  #EF233B;
                                position: absolute;
                                bottom: 10px;
                                width: 295px;
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
                                left: -24px;
                                top: 26px;
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
                                right: -24px;
                                top: 26px;
                                z-index: -1;
                                background: url("@/assets/game/betinfo/title_fake.png") no-repeat center;
                                background-size: 100% 100%;
                            }
                            .title_bet {
                                font-family: buttersans-Regular;
                                font-size: 15.4px;
                                color: #861508;
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
                        }
                        .content_con {
                            height: 310px;
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
                                border-radius: 11px;
                                padding-top: 70px;
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
                    }
                    .bottom_btn {
                        position: absolute;
                        bottom: -30px;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                }
        }
    }
    }
    .tabs_list {
        width: 100%;
        height: 36px;
        display: flex;
        border-bottom: 1px solid #41445366;
        padding: 0 10px;
        box-sizing: border-box;
        .tabs_container{
            width: 100%;
            display: flex;
            overflow-x: auto;
            gap: 16px;
        }
        .tab_item {
            min-width: 30%;
            display: flex;
            flex-shrink: 0;
            
            justify-content: center;
            align-items: center;
            color: rgba(0,0,0,0.5);
            font-size: 14px;
            &:last-child {
                // width: 105px;
                flex: none;
            }
        }
        .active_item{
            color: #3B7FF8;
            border-bottom: 2px solid #3B7FF8;
        }
    }
}
</style>