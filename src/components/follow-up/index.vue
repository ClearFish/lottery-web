<template>
    <div class="big_box" v-if="show">
        <div class="followup_container">
            <div class="top_header">
                <div class="empty"></div>
                <div class="word">{{$t('fllowup.Follow_Bet')}}</div>
                <div class="icon">
                    <van-icon name="cross" size="18" @click="closeFollow" class="close" color="#77819b"></van-icon>
                </div>
            </div>
            <div class="top_tabs">
                <div class="name_box">
                    <div class="tab_item" 
                        v-for="(item,index) in gameLists" 
                        :key="index" :class="gameIndex == index ? 'active_tab_item' :''"
                        @click="choseGame(item,index)"
                        >
                        <img :src="item.icon" alt="">
                        <div class="game_name">{{ item.title }}</div>
                    </div>
                </div>
                <div class="time_box">
                    <div class="tab_item time_item" 
                        v-for="(ite,inx) in chosedGame.types" :key="inx" 
                        :class="current == inx ? 'active_tab_item' :''"
                        @click="cutTime(inx)"
                        >
                        <div class="game_tiem">{{ $t('fllowup.'+ite.title) }}</div>
                    </div>
                </div>
            </div>
            <div class="game_con">
                <win
                    v-if="game_type === 0"
                    ref="winRef"
                    :noThree="noThree"
                    :gameId="params.game_id"
                    :currentTime="current"
                    :isFollow="true"
                    :followInfo="followInfo"
                    @updata="getResultRecord"
                    @upDataLog="getBetRecord"
                    @showLotteryResult="showLotteryResult"
                ></win>
                <lottery5d
                    v-if="game_type === 1"
                    :gameId="params.game_id"
                    :currentTime="current"
                    :isFollow="true"
                    :followInfo="followInfo"
                    @updata="getResultRecord"
                    @upDataLog="getBetRecord"
                    @showLotteryResult="showLotteryResult"
                    ref="d5Ref"
                ></lottery5d>
                <k3
                    v-if="game_type === 2"
                    :gameId="params.game_id"
                    :currentTime="current"
                    :isFollow="true"
                    :followInfo="followInfo"
                    @updata="getResultRecord"
                    @upDataLog="getBetRecord"
                    @showLotteryResult="showLotteryResult"
                    ref="k3Ref"
                ></k3>
            </div>
        </div>
        <LotteryResult ref="lotteryResultRef"/>
        
    </div>
</template>
<script setup lang="ts">
import win from "@/components/Lottery/win.vue";
import lottery5d from "@/components/Lottery/lottery5d.vue";
import k3 from "@/components/Lottery/k3.vue";
import { ref, defineEmits,onMounted,nextTick,defineExpose } from "vue"
import {betRecord,resultRecord} from "@/api/lottery";
import LotteryResult from "./lotteryReuslt.vue"
import { useUserStore } from '@/store/modules/user'
import k3Img from '@/assets/lottery/k3.png'
import winImg from '@/assets/lottery/win.png'
import d5Img from '@/assets/lottery/5d.png'
const userStore = useUserStore() 
const show = ref(false)
const gameLists = ref(
    [
        {
            title:'k3 Lotre',
            subTitle:'k3 Lotre',
            icon:k3Img,
            game_type:2,
            types:[
                {title:'min1_win_go',gameIntro:'K3Lotre1m',minType:1,game_id:5},
                {title:'min3_win_go',gameIntro:'K3Lotre3m',minType:3,game_id:6},
                {title:'min_5',gameIntro:'K3Lotre5m',minType:5,game_id:7},
                {title:'min_10',gameIntro:'K3Lotre10m',minType:10,game_id:8},
            ]
        },
        {   
            title:'Win go',
            subTitle:'wingo',
            icon:winImg,
            game_type:0,
            types:[
                {title:'min1_win_go',gameIntro:'Color1m',minType:1,game_id:1},
                {title:'min3_win_go',gameIntro:'Color3m',minType:3,game_id:2},
                {title:'min_5',gameIntro:'Color1m',minType:5,game_id:3},
                {title:'min_10',gameIntro:'Color1m',minType:10,game_id:4},
            ]
        },
        {
            title:'5D Lotre',
            subTitle:'5D Lotre',
            icon:d5Img,
            game_type:1,
            types:[
                {title:'min1_win_go',gameIntro:'Lotre5D1m',minType:1,game_id:9},
                {title:'min3_win_go',gameIntro:'Lotre5D3m',minType:3,game_id:10},
                {title:'min_5',gameIntro:'Lotre5D5m',minType:5,game_id:11},
                {title:'min_10',gameIntro:'Lotre5D10m',minType:10,game_id:12},
            ]
        }
    ]
)
const gameIndex = ref(0)
const chosedGame:any = ref({})
const game_type = ref(2)
const noThree = ref(false)
const params:any = ref({})
const current = ref(0)
const betParams:any = ref({})
const followInfo:any = ref({})
const winRef =  ref(null)
const d5Ref = ref(null)
const k3Ref = ref(null)
const lotteryResultRef = ref(null)
const emit = defineEmits(["closeFollow"]);
onMounted(() => {
  init()
})
const init=(data?:any)=> {
    console.log(data,"data")
    if(data && !data.isLunch) {
        let betInfo = data.betInfo;
        let games = gameLists.value;
        let findGamesIndex = games.findIndex(item=>{
            return item.types.find(ite=>ite.game_id == betInfo.game_id)
        })
        let findTypesIndex = games[findGamesIndex].types.findIndex(item=>item.game_id == betInfo.game_id)
        console.log(findGamesIndex,"findGamesIndex",findTypesIndex,games[findGamesIndex].types)
        chosedGame.value = games[findGamesIndex];
        params.value = {...games[findGamesIndex].types[findTypesIndex]}
        current.value = findTypesIndex;
        gameIndex.value = findGamesIndex;
        game_type.value = games[findGamesIndex].game_type;
        betParams.value.game_id = betInfo.game_id;
    }else {
        chosedGame.value = gameLists.value[0]
        params.value = {...chosedGame.value.types[0]}
        current.value = 0;
        gameIndex.value = 0;
        game_type.value = 2;
        betParams.value = {};
    }
}
const showFollow=(data:any)=> {
    show.value = true;
    followInfo.value = data;
    init(data);
    nextTick(()=>{
        if(data && !data.isLunch) {
            let betInfo = data.betInfo
            if(game_type.value == 0) {
                // wingo
                winRef.value && winRef.value.followBet(betInfo)
            }else if(game_type.value ==1) {
                // 5d
                d5Ref.value && d5Ref.value.followBet(betInfo)
            }else {
                // k3
                k3Ref.value && k3Ref.value.followBet(betInfo)
            }
        }
        getResultRecord()
    })
}
const closeFollow=()=> {
    show.value = false;
    emit('closeFollow')
}

const choseGame=(item,index)=> {
    gameIndex.value = index
    game_type.value = item.game_type;
    chosedGame.value = item;
    params.value = item.types[0]
    current.value = 0
    getResultRecord()
}
const cutTime=(key)=> {
    betParams.value.pageIndex = 1;
    params.value.pageIndex = 1;
    current.value = key;
    let game_id = 0;
    if (game_type.value === 0) {
        if (noThree.value) {
        // 不展示三分彩
            if (key === 0) {
                game_id = 1;
            } else {
                game_id = key + 2;
            }
        } else {
            game_id = key + 1;
        }
    } else if (game_type.value === 1) {
        game_id = 8 + key + 1;
    } else {
        game_id = 4 + key + 1;
    }
    params.value.game_id = game_id;
    betParams.value.game_id = game_id;
    getResultRecord();
}
const getBetRecord=()=> {
    closeFollow()
}
const getResultRecord=()=> {
    resultRecord(params.value).then(async(res) => {
        await userStore.fetchUserInfo()
        // 页面加在初始化中将结果数字
        if (game_type.value == 2) {
            if (k3Ref.value) {
                k3Ref.value.setAnimation();
                k3Ref.value.getCurrentIssueWinNumber(res.rows[0].result);
                k3Ref.value.setRecentRes(res.rows[0]);
            }
        }
        if(game_type.value == 1) {
            if (d5Ref.value) {
                // d5Ref.value.start(res.data.rows[0].result);
            }
        }
        if(game_type.value == 0) {
            winRef.value.setRecentRes(res.rows[0]);
        }
    });
}
const showLotteryResult=()=> {
    lotteryResultRef.value && lotteryResultRef.value.showResult(params.value.game_id,game_type.value)
}
defineExpose({
    showFollow
})
</script>
<style lang="less" scoped>
.big_box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99999;
}
.followup_container{
    width: 96%;
    max-width: 480px;
    padding: 8px;
    padding-bottom: 16px;
    background: linear-gradient(180deg, #fcfdff, #e4edfe 53%, #f4f7fe) ;
    border-radius: 8px;
    // border: 1px solid #F0CC6D;
    position: fixed;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    min-height: 420px;
    z-index: 10001;
    .top_header {
        display: flex;
        justify-content: space-between;
        color: #77819b;
        font-weight: 600;
        margin-bottom: 16px;
        .icon {
            width: 24px;
            height: 24px;
        }
    }
    .name_box {
        display: flex;
        .tab_item {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #77819b;
            height: 42px;
            line-height: 42px;
            justify-content: center;
            position: relative;
            img {
                width: 18px;
                height: auto;
            }
            &::before {
                content: "";
                width: 1px;
                height: 20px;
                background: #cdcdcd;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 0;
            }
            &:last-child {
                &::before {
                    content: "";
                    width: 0;
                }
            }
        }
        .active_tab_item {
            position: relative;
            &::after {
                content: "";
                width: 80%;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                bottom: 0;
                height: 3px;
                background: #3487f6;
            }
        }
    }
    .time_box {
        display: flex;
        gap: 8px;
        margin-top: 10px;
        justify-content: center;
        .tab_item {
            height: 38px;
            padding: 0 10px;
            flex-shrink: 0;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #58b8fd;
            line-height: 38px;
            font-size: 14px;
            font-weight: 600;
             border: 1px solid #58b8fd;
            gap: 10px;
            border-radius: 8px;
            img {
                width: 18px;
                height: auto;
            }
        }
        .active_tab_item {
            background: #58b8fd;
            color: #fff;
        }
    }
    
    
}
</style>