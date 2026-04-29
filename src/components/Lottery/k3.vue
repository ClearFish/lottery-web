<template>
    <div class="content">
        <div class="recently" v-if="isFollow">
            <div
                class="container"
                v-if="recentReuslt && recentReuslt.result && recentReuslt.result.length"
            >
                <div class="peroid">
                    <div>{{ recentReuslt.issue_no }}</div>
                    <div class="showMore" @click="showLotteryResult">{{$t("fllowup.More")}}</div>
                    <div class="showMore trend" @click="showTrend">
                        <img :src="trendIcon" alt="" />
                    </div>
                </div>
                <div class="flex-item-1 flex-rcc third">{{sumWin(recentReuslt.result)}}</div>
                <div class="flex-item-1 flex-rcc third">
                    {{
                        sumWin(recentReuslt.result) > 10
                            ? $t("fllowup.winGobig")
                            : $t("fllowup.winGosmall")
                    }}
                </div>
                <div class="flex-item-1 flex-rcc third more_width">
                    {{
                    sumWin(recentReuslt.result) % 2 === 0
                        ? $t("fllowup.k3even")
                        : $t("fllowup.k3odd")
                    }}
                </div>
                <div class="flex-item-1 flex-rcc third">
                    <div
                        v-for="(i, index) in recentReuslt.result"
                        :key="index"
                        class="icon-num"
                    >
                        <img :src="`/static/game/dice_show${i}.min.png`" />
                    </div>
                </div>
            </div>
        </div>
        <div class="page-box">
            <div class="period-title">
                <span class="left_icon">{{ $t("lottery.timeText3") }}</span>
                <span>{{ showMask ? $t("lottery.timeText2") : $t("lottery.timeText1") }}</span>
            </div>
            <div class="period-span">
                <div class="period_box">
                    <span class="txt">{{ gameTime.issue_no }}</span>
                    <div class="showMore trend" @click="showTrend" v-if="!isFollow">
                        <img :src="trendIcon" alt="" />
                    </div>
                </div>
                <div>
                <van-count-down
                    :time="time"
                    ref="countDownBet"
                    format="mm:ss"
                    @change="onChange"
                    @finish="finish"
                >
                    <template #default>
                        <div class="time flex flex-item-col-center">
                            <span class="time__custom__item time__custom__item1">0</span>
                            <span class="time__custom__item">{{ timeData.minutes }}</span>
                            <span class="time__custom__item">:</span>
                            <span class="time__custom__item">{{ timeData.seconds1 }}</span>
                            <span class="time__custom__item time__custom__item2">{{ timeData.seconds2}}</span>
                        </div>
                    </template>
                </van-count-down>
                </div>
            </div>
        </div>
        <!-- 游戏 -->
        <div class="gameBox flex-rcc" v-if="!isFollow">
            <div class="slot-inner">
                <div class="d5-slot-box">
                <div class="slot-column">
                    <img
                    :src="`/static/game/dice${firstNum}.png`"
                    :class="animation1 ? 'dice addanimation' : 'dice'"
                    />
                </div>
                <div class="slot-column">
                    <img
                    :src="`/static/game/dice${secondNum}.png`"
                    :class="animation2 ? 'dice addanimation' : 'dice'"
                    />
                </div>
                <div class="slot-column">
                    <img
                    :src="`/static/game/dice${thirdNum}.png`"
                    :class="animation3 ? 'dice addanimation' : 'dice'"
                    />
                </div>
                </div>
            </div>
        </div>
         <!-- 菜单 -->
        <div class="bet-box flex flex-col">
            <div class="k3-bet-content-sum" v-if="tabAction === 0">
                <template v-if="tabList[0].plays && tabList[0].plays.length > 0">
                    <div
                        class="item flex-cc"
                        v-for="(item,index) in tabList[0].plays"
                        :key="index"
                        :class="{ action: selectList.includes(keyText(item.play_code)) }"
                        @click="select('TotalDicePlay', item)"
                    >
                        <div class="itembox flex-cc">
                            <span>{{ keyText(item.play_code) }}</span>
                            <span class="des">{{ $t("lottery.k3odds") }} {{ item.odds }}</span>
                            <div class="select-icon flex-cc">
                                <van-icon name="success" size="9" color="#3487F6" bold/>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <div v-else-if="tabAction === 1" class="k3-bet-content-two">
                <div class="title">
                    {{ $t("lottery.k3type2text1") }}：{{ $t("lottery.k3odds") }}
                    {{ gameInfo.odds.DoubleDicePlay[11] }}
                </div>
                <div class="num-box flex flex-sb">
                <div
                    class="num-box-item flex-rcc"
                    v-for="i in numListTwo"
                    :key="i"
                    :class="{ action: selectList.includes(keyText(i)) }"
                    @click="select('DoubleDicePlay', i)"
                >
                    {{ i }}
                    <div class="select-icon flex-cc">
                        <van-icon name="success" size="9" color="#3487F6" bold/>
                    </div>
                </div>
                </div>
                <div class="des">*{{ $t("lottery.k3type2text1rule") }}</div>
                <div class="title">
                    {{ $t("lottery.k3type2text2") }}：{{ $t("lottery.k3odds") }}
                    {{ gameInfo.odds.DoubleDicePlay[112] }}
                </div>
                <div class="num-box flex flex-sb">
                    <div
                        class="num-box-item flex-rcc colorRed"
                        v-for="i in numListTwo"
                        :key="i"
                        :class="{ actionRed: bothNum.includes(i) }"
                        @click="selectboth('DoubleDicePlay', i)"
                    >
                        {{ i }}
                        <div class="select-icon flex-cc">
                            <van-icon name="success" size="9" color="#3487F6" bold/>
                        </div>
                    </div>
                </div>
                <div class="num-box flex flex-sb">
                <div
                    class="num-box-item flex-rcc colorGreen"
                    v-for="i in 6"
                    :key="i"
                    :class="{ actionGreen: oddNum.includes(i) }"
                    @click="selectodd('DoubleDicePlay', i)"
                >
                    {{ i }}
                    <div class="select-icon flex-cc">
                        <van-icon name="success" size="9" color="#3487F6" bold/>
                    </div>
                </div>
                </div>
                <div class="des">*{{ $t("lottery.k3type2text2rule") }}</div>
            </div>

            <div v-else-if="tabAction === 2" class="k3-bet-content-two">
                <div class="title"
                >{{ $t("lottery.k3type3text1") }}：{{ $t("lottery.k3odds") }}
                {{ gameInfo.odds.IdenticalDicePlay[111] }}</div
                >
                <div class="num-box flex flex-sb">
                <div
                    class="num-box-item flex-rcc"
                    v-for="i in numListThree"
                    :key="i"
                    :class="{ action: threeNum.includes(i) }"
                    @click="selectThreeNum('IdenticalDicePlay', i)"
                >
                    {{ i }}
                    <div class="select-icon flex-cc">
                        <van-icon name="success" size="9" color="#3487F6" bold/>
                    </div>
                </div>
                </div>
                <div class="des">*{{ $t("lottery.k3type3text1rule") }}</div>
                <div class="title"
                >{{ $t("lottery.k3type3text2") }}：{{ $t("lottery.k3odds") }}
                {{ gameInfo.odds.IdenticalDicePlay.AAA }}</div
                >
                <div class="num-box flex flex-sb">
                <div
                    class="num-box-item flex-rcc num-box-item3 colorRed"
                    :class="{ actionRed: isThree }"
                    @click="selectThree('IdenticalDicePlay')"
                >
                    {{ $t("lottery.k3type3text2") }}
                    <div class="select-icon flex-cc">
                        <van-icon name="success" size="9" color="#3487F6" bold/>
                    </div>
                </div>
                </div>
                <div class="des">*{{ $t("lottery.k3type3text2rule") }}</div>
            </div>

            <div v-else class="k3-bet-content-two">
                <div
                class="title"
                v-if="
                    gameInfo.odds !== null &&
                    gameInfo.odds &&
                    gameInfo.odds.DifferentDicePlay
                "
                >{{ $t("lottery.k3type4text1") }}：{{ $t("lottery.k3odds") }}
                {{ gameInfo.odds.DifferentDicePlay.Three }}</div
                >
                <div class="num-box flex flex-sb">
                <div
                    class="num-box-item flex-rcc"
                    v-for="i in 6"
                    :key="i"
                    :class="{ action: threeDiffNum.includes(i) }"
                    @click="selectThreeDiffNum('DifferentDicePlay', i)"
                >
                    {{ i }}
                    <div class="select-icon flex-cc">
                        <van-icon name="success" size="9" color="#3487F6" bold/>
                    </div>
                </div>
                </div>
                <div class="des">*{{ $t("lottery.k3type4text1rule") }}</div>
                <div
                class="title"
                v-if="
                    gameInfo.odds &&
                    gameInfo.odds.DifferentDicePlay &&
                    gameInfo.odds.DifferentDicePlay
                "
                >{{ $t("lottery.k3type4text2") }}：{{ $t("lottery.k3odds") }}
                {{ gameInfo.odds.DifferentDicePlay.Straight }}</div
                >
                <div class="num-box flex flex-sb">
                <div
                    class="num-box-item flex-rcc num-box-item3 colorRed"
                    :class="{ actionRed: isThreeConNum }"
                    @click="selectThreeConNum"
                >
                    {{ $t("lottery.k3type4text2") }}
                    <div class="select-icon flex-cc">
                        <van-icon name="success" size="9" color="#3487F6" bold/>
                    </div>
                </div>
                </div>
                <div class="des">*{{ $t("lottery.k3type4text2rule") }}</div>
                <div
                class="title"
                v-if="
                    gameInfo.odds &&
                    gameInfo.odds.DifferentDicePlay &&
                    gameInfo.odds.DifferentDicePlay
                "
                >{{ $t("lottery.k3type4text3") }}：{{ $t("lottery.k3odds") }}
                {{ gameInfo.odds.DifferentDicePlay.Two }}</div
                >
                <div class="num-box flex flex-sb">
                <div
                    class="num-box-item flex-rcc"
                    v-for="i in 6"
                    :key="i"
                    :class="{ action: twoDiffNum.includes(i) }"
                    @click="selectTwoDiffNum('DifferentDicePlay', i)"
                >
                    {{ i }}
                    <div class="select-icon flex-cc">
                        <van-icon name="success" size="9" color="#3487F6" bold/>
                    </div>
                </div>
                </div>
                <div class="des">*{{ $t("lottery.k3type4text3rule") }}</div>
            </div>

            <div class="flex">
                <div
                    class="flex-rcc tabItem"
                    v-for="item in tabList"
                    :key="item.value"
                    :class="{ tabAction: tabAction === item.value }"
                    @click="tabChange(item)"
                    >
                {{ item.label }}
                </div>
            </div>
            <!-- 代理游戏 -->
            <div
                class="flex"
                style="margin-top: 10px"
                v-if="agentGameList.length > 1"
            >
                <div
                class="agent-item"
                :class="Number(gameId) === item.game_id ? 'red-agent-item' : ''"
                v-for="(item, index) in agentGameList"
                :key="index"
                >{{ item.agent_alias }}</div
                >
            </div>
            <div class="mask-box flex-rcc" v-if="showMask">
                <div class="countTimeBox rihht-1">{{ timeData.seconds1 }}</div>
                <div class="countTimeBox">{{ timeData.seconds2 }}</div>
            </div>
        </div>
        <!-- 底部弹窗 -->
        <van-popup
            :show="show"
            round
            :mode="isFollow ? 'center' : 'bottom'"
            class="popupStyle"
            :class="isFollow ? 'follow_popup' : ''"
            safeAreaInsetBottom
            >
            <div class="popupBox">
                <div class="head">
                    <div class="box-header colorBSize">
                        <div class="con"
                        >{{ gameTypes[currentTime].label }}{{ $t("minute") }}</div
                        >
                        <div class="popup-bet-box">
                        <div class="flex flex-col">
                            <template v-if="tabAction === 0">
                            <div class="flex flex-warp flex-item-col-center">
                                <span class="name">{{ $t("lottery.popupcell0") }}：</span>
                                <div
                                    v-for="(i, index) in selectList"
                                    :key="index"
                                    class="select-num"
                                >{{ i }}</div
                                >
                            </div>
                            </template>

                            <template v-if="tabAction === 1">
                            <template v-if="selectList.length > 0">
                                <div class="flex flex-warp flex-item-col-center">
                                <span class="name"
                                    >{{ $t("lottery.k3type2text1") }}：</span
                                >
                                <div
                                    v-for="(i, index) in selectList"
                                    :key="index"
                                    class="select-num actionViolet"
                                >{{ i }}</div
                                >
                                </div>
                            </template>

                            <template v-if="bothNum.length > 0 && oddNum.length > 0">
                                <div class="flex flex-warp flex-item-col-center">
                                <span class="name"
                                    >{{ $t("lottery.k3type2text2") }}：</span
                                >
                                <div
                                    v-for="(i, index) in bothNum"
                                    :key="index"
                                    class="flex flex-warp flex-item-col-center"
                                >
                                    <span
                                    class="li actionRedGreen"
                                    v-for="(j, index1) in oddNum"
                                    :key="index1"
                                    >{{ i }} {{ j }}</span
                                    >
                                </div>
                                </div>
                            </template>
                            </template>
                            <!-- 模式三 -->
                            <template v-if="tabAction === 2">
                            <div class="flex-col">
                                <template v-if="threeNum.length > 0">
                                <div class="flex flex-warp flex-item-col-center">
                                    <span class="name"
                                    >{{ $t("lottery.k3type3text1") }}：</span
                                    >
                                    <div
                                    v-for="(i, index) in threeNum"
                                    :key="index"
                                    class="select-num actionViolet"
                                    >{{ i }}</div
                                    >
                                </div>
                                </template>
                                <template v-if="isThree">
                                <div class="actionRed">{{
                                    $t("lottery.k3type3text2")
                                }}</div>
                                </template>
                            </div>
                            </template>

                            <!-- 模式四 -->
                            <template v-if="tabAction === 3">
                            <div class="flex-col">
                                <template v-if="threeDiffNum.length >= 3">
                                <div class="flex flex-warp flex-item-col-center">
                                    <span class="name"
                                    >{{ $t("lottery.k3type4text1") }}：</span
                                    >
                                    <div
                                    v-for="(i, index) in groupThree"
                                    :key="index"
                                    class="select-num actionViolet"
                                    >
                                    {{ i }}
                                    </div>
                                </div>
                                </template>
                                <template v-if="isThreeConNum">
                                <div class="actionRed">{{
                                    $t("lottery.k3type4text2")
                                }}</div>
                                </template>
                                <template v-if="twoDiffNum.length >= 2">
                                <div class="flex flex-warp flex-item-col-center">
                                    <span class="name"
                                    >{{ $t("lottery.k3type4text3") }}：</span
                                    >
                                    <div
                                    v-for="(i, index) in groupTwo"
                                    :key="index"
                                    class="select-num actionViolet"
                                    >
                                    {{ i }}
                                    </div>
                                </div>
                                </template>
                            </div>
                            </template>
                        </div>
                        </div>
                    </div>
                </div>
                <div class="info">
                <div class="item">
                    <span class="name">{{$t('lottery.Balance')}}</span>
                    <div class="list_item">
                        <div  class="item_box">
                            <span class="label">₫</span>
                            <span class="value">{{userStore.balance}}</span>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <span class="name">{{ $t("lottery.popupcell2") }}</span>
                    <div class="flex flex-item-col-center">
                    <div
                        v-for="(i, index) in moneyList"
                        :key="index"
                        class="monItem"
                        :class="{ action: form.money == i.value }"
                        @click="cutMon(i)"
                        >{{ i.label }}</div
                    >
                    </div>
                </div>
                <div class="item">
                    <span class="name">{{ $t("lottery.popupcell3") }}</span>
                    <div class="number_box">
                        <van-stepper
                            v-model="form.size"
                            theme="round"
                            @change="valChange"
                        >
                        </van-stepper>
                    </div>
                </div>
                <div class="item liBox">
                    <div
                    class="li"
                    v-for="i in liList"
                    :key="i"
                    :class="{ action: form.size === i }"
                    @click="rateChange(i)"
                    >X{{ i }}</div
                    >
                </div>
                </div>

                <div class="foot">
                <div class="left flex-rcc" @click="cancel">{{
                    $t("lottery.popupbtn1")
                }}</div>
                <div class="right flex-rcc" @click="postBet"
                    >{{ $t("lottery.popupbtn2") }} {{ sum }}</div
                >
                </div>
            </div>
        </van-popup>
        <van-overlay
            :show="showLoading"
            :opacity="0.6"
            class-name="flex-rcc"
            z-index="99999999"
            >
            <van-loading color="#3498db"></van-loading>
        </van-overlay>
        <Trend ref="trendRef" :currentTime="currentTime"/>
    </div>
</template>
<script setup lang="ts">
// @ts-nocheck
import { ref, defineEmits, watch,onMounted,computed } from "vue"
import miment from "miment";
import { getTimes,getGameAgentAlias,getGame,getResult,bet,getResultByGameCodeAndPeriod   } from '@/api/lottery'
import { showToast } from 'vant'
import { $t } from '@/locales'
import trendIcon from "@/assets/lottery/trend-icon.svg"
import Trend from "@/components/follow-up/k3trend.vue"
import { useUserStore } from '@/store/modules/user'
import { useSystemStore } from '@/store/modules/system'
const systemStore = useSystemStore()
const userStore = useUserStore() 
const props = defineProps({
    gameId:{
        default: () => {
            return '' as any ;
        }
    },
    followInfo:{
        default: () => {
            return {} as any;
        }
    },
    isFollow:{
        default: () => {
            return true;
        }
    }
})
const game_code = computed(()=>systemStore.game_code)
const recentReuslt = ref({})
const trendRef = ref(null)
const showMask = ref(false)
const currentTime = ref(0)
// 开奖时间
const gameTime = ref({})
const form:any = ref({
    game_code: systemStore.game_code,
    issue_no: "",
    pk: "",
    play_type_code: "",
    play_code: "",
    bet_info: [""],
    bet_amount: ""
})
const tabList = ref(
    [
        { value: 0, label: $t("lottery.k3menu1"),keyVal:'TotalDicePlay',plays:[] },
        { value: 1, label: $t("lottery.k3menu2"),keyVal:'DoubleDicePlay',plays:[] },
        { value: 2, label: $t("lottery.k3menu3"),keyVal:'IdenticalDicePlay',plays:[] },
        { value: 3, label: $t("lottery.k3menu4"),keyVal:'DifferentDicePlay',plays:[] },
    ]
)
const sum = ref(1)
const timer = ref(null)
const showLoading = ref(false)
const gameInfo = ref({})
const userFollow = ref(false)
const followBetInfo = ref({})
const tabAction = ref(0)
const show = ref(false)
const selectList = ref([])
const selectArrList = ref([])
const bothNum = ref([]);
const oddNum = ref([]);
const threeNum = ref([]);
const threeDiffNum = ref([]);
const agentGameList = ref([])
const countDownBet = ref(null)
const countDown = ref(null)
const countTime = ref(0)
const animation1 = ref(true)
const animation2 = ref(true)
const animation3 = ref(true)
const timer1 = ref(null)
const timer2 = ref(null)
const resultTimer = ref(null)
const time = ref(1000*60)
const timeData = ref({})
const firstNum = ref(1)
const secondNum = ref(1)
const thirdNum = ref(1)
const numListTwo = ref([11, 22, 33, 44, 55, 66])
const numListThree= ref([111, 222, 333, 444, 555, 666])
const isThree = ref(false)
const twoDiffNum = ref([])
const isThreeConNum = ref([])
const groupTwo = ref([])
const groupThree = ref([])
const moneyList = ref([
    { label: "1K", value: "1000" },
    { label: "10K", value: "10000" },
    { label: "100K", value: "100000" },
    { label: "500K", value: "500000" },
    { label: "1000K", value: "1000000" },
    { label: "5000K", value: "5000000" },
])
const liList = ref([1, 3, 9, 27, 81, 243, 729,2187])
const rate = ref(1)
const agree = ref([1])
const winInfo = ref({})
const game_id = ref(null)
const gameTypes = ref([
    {value: 1,label: '1',gameids:[1,5,9]},
	{value: 3,label: '3',gameids:[2,6,10]},
	{value: 5,label: '5',gameids:[3,7,11]},
	{value: 10,label: '10',gameids:[4,8,12]}
])
const emit = defineEmits(["showLotteryResult","updata","upDataLog"]);
const init = ()=>{
    sum.value = 0;
    form.value.game_code = systemStore.game_code
    form.value.issue_no = ''
    form.value.pk = ''
    form.value.play_type_code = ''
    form.value.play_code = ''
    form.value.bet_info = [""]
    form.value.bet_amount = ''
    const configs = Array.isArray(systemStore.gameConfig) ? systemStore.gameConfig : []
	if (!configs.length) return
    let gameDetail = configs.find((item:any)=>item.game_code == systemStore.game_code)
	if (!gameDetail) gameDetail = configs[0]
	if (!systemStore.game_code && gameDetail?.game_code) {
		systemStore.setGameCode(gameDetail.game_code)
		form.value.game_code = gameDetail.game_code
	}

	if (!gameDetail?.id) return
	game_id.value = gameDetail.id
	currentTime.value = gameTypes.value.findIndex((item:any)=>item.gameids.indexOf(gameDetail.id)!=-1)
	if (currentTime.value < 0) currentTime.value = 0

    showMask.value = false;
}
const getGameData = () =>{
    showLoading.value = true;
    getGame({ game_code: game_code.value }).then((res:any) => {
        gameInfo.value = res.data;
        tabList.value.map((item:any)=>{
            let itemObj = res.data.find((ite:any)=>ite.play_type_code == item.keyVal);
            item.plays = [...itemObj.plays];
            return item;
        })
        // console.log(tabList.value,"tabList.value")
        showLoading.value = false;
        if (userFollow.value) {
          // 用户跟投
          toFollow();
        }
      });
}
// 游戏开奖时间
const getTime = (isEnd) => {
    getTimes({game_code: game_code.value}).then((res) => {
        gameTime.value = res.data
        form.value.issue_no = res.data.issue_no
        if (isEnd) {
            // 倒计时结束查结果更新记录
            getResultData(gameTime.value.previous_issue_no, isEnd);
        }else {
            comOpenTime(gameTime.value.current_time,gameTime.value.exit_time)
        }
    })
}


const sumWin = (value)=>{
    let arr = [];
    let sum = 0;
    if (Array.isArray(value)) {
        arr = value;
    } else {
        arr = value.split(",");
    }
    arr.map((v) => {
        sum = sum + Number(v);
    });
    return sum;
}
const setRecentRes=(result)=> {
    recentReuslt.value = result;
}
const currencyChange=()=> {
    let findObj = balances.value.find((item:any) => item.currency == form.value.currency);
}
const showLotteryResult = ()=>{
    emit("showLotteryResult");
}
const showTrend = ()=>{
    trendRef.value && trendRef.value.showTrend(game_code.value)
}
const followBet=(info:any)=> {
    console.log(info,'info')
    followBetInfo.value = info;
    userFollow.value = true;
    form.value.size = info.size;
    form.value.money = info.money;
    form.value.bet_amount = info.bet_amount;
}


const toFollow = () =>{
    let info = followBetInfo.value;
      let tabNum = {
        TotalDicePlay: 0,
        DoubleDicePlay: 1,
        IdenticalDicePlay: 2,
        DifferentDicePlay: 3,
      };
      tabAction.value = tabNum[info.play_group];
      if (tabAction.value == 0) {
        select("TotalDicePlay", info.bet_play);
      } else if (tabAction.value == 1) {
        if (info.bet_play.length == 2) {
          select("DoubleDicePlay", info.bet_play);
        } else {
          selectboth("DoubleDicePlay", info.bet_play.substr(0, 2));
          selectodd("DoubleDicePlay", info.bet_play.substr(2));
        }
      } else if (tabAction.value == 2) {
        if (info.bet_play == "AAA") {
          selectThree("IdenticalDicePlay");
        } else {
          selectThreeNum("IdenticalDicePlay", info.bet_play);
        }
      } else {
        if (info.bet_play == "Three") {
          info.bet_info.map((item) => {
            selectThreeDiffNum("DifferentDicePlay", item);
          });
        } else if (info.bet_play == "Straight") {
          selectThreeConNum();
        } else {
          info.bet_info.map((item) => {
            selectTwoDiffNum("DifferentDicePlay", item);
          });
        }
      }
}
// 选择总和
const select =(group, key)=> {
    form.value.play_group = group;
    const key1 = keyText(key);
    if (!show.value) show.value = true;
    if (selectList.value.length === 0) {
        selectList.value.push(key1);
        selectArrList.value.push(key);
    } else {
        const index = selectList.value.findIndex((v) => v === key1);
        if (index < 0) {
            selectList.value.push(key1);
            selectArrList.value.push(key);
        } else {
            selectList.value.splice(index, 1);
            selectArrList.value.splice(index, 1);
        }
    }
    if (tabAction.value === 0) {
        if (selectList.value.length === 0) show.value = false;
    } else if (tabAction.value === 1) {
        if (selectList.value.length === 0 && (bothNum.value.length === 0 || oddNum.value.length === 0)) {
            show.value = false;
        }
    }
}
// 双数选择
const selectboth=(name, i)=> {
    form.value.play_group = name;
    if (oddNum.value.length > 0) {
        const yu = i % 10;
        let index = oddNum.value.findIndex((v) => v === yu);
        if (index > -1) oddNum.value.splice(index, 1);
    }
    if (bothNum.value.length === 0) {
        bothNum.value.push(i);
    } else {
        const index = bothNum.value.findIndex((v) => v === i);
        if (index < 0) {
            bothNum.value.push(i);
        } else {
            bothNum.value.splice(index, 1);
        }
    }
    if (bothNum.value.length > 0 && oddNum.value.length > 0 && !show.value)  show.value = true;
    if ((bothNum.value.length === 0 || oddNum.value.length === 0) && selectList.value.length === 0) show.value = false;
}
// 单数选择
const selectodd =(name, i)=> {
    form.value.play_group = name;
    if (bothNum.value.length > 0) {
    const sum = i * 11;
    let index = bothNum.value.findIndex((v) => v === sum);
    if (index > -1) bothNum.value.splice(index, 1);
    }
    if (oddNum.value.length === 0) {
    oddNum.value.push(i);
    } else {
    const index = oddNum.value.findIndex((v) => v === i);
    if (index < 0) {
        oddNum.value.push(i);
    } else {
        oddNum.value.splice(index, 1);
    }
    }
    if (bothNum.value.length > 0 && oddNum.value.length > 0 && !show.value)
    show.value = true;
    if (
    (bothNum.value.length === 0 || oddNum.value.length === 0) &&
    selectList.value.length === 0
    )
    show.value = false;
}
// 模式三 三数选择相同
const selectThreeNum=(name, i)=> {
    form.value.play_group = name;
    if (!show.value) show.value = true;
    if (threeNum.value.length === 0) {
        threeNum.value.push(i);
    } else {
        const index = threeNum.value.findIndex((v) => v === i);
    if (index < 0) {
        threeNum.value.push(i);
    } else {
        threeNum.value.splice(index, 1);
    }
    }
    if (show.value) {
        let num = isThree.value ? 1 : 0;
        let newnum = threeNum.value.length + num;
        sum.value = newnum * form.value.size * form.value.money;
    }
    if (threeNum.value.length === 0) show.value = false;
}
// 模式三  三个相同数按钮
const selectThree=(name)=> {
    form.value.play_group = name;
    isThree.value = !isThree.value;
    if (isThree.value) {
        show.value = true;
    } else {
    if (threeNum.value.length === 0) {
        show.value = false;
    }
    }
    if (show.value) {
        let num = isThree.value ? 1 : 0;
        let newnum = threeNum.value.length + num;
        sum.value = newnum * form.value.size * form.value.money;
    }
}
// 模式四 三个不同数字
const selectThreeDiffNum=(name, i)=> {
    form.value.play_group = name;
    if (threeDiffNum.value.length === 0) {
        threeDiffNum.value.push(i);
    } else {
        const index = threeDiffNum.value.findIndex((v) => v === i);
    if (index < 0) {
        threeDiffNum.value.push(i);
    } else {
        threeDiffNum.value.splice(index, 1);
    }
    }
    if (threeDiffNum.value.length >= 3) {
        groupThree.value = [];
        for (let i = 0; i <= threeDiffNum.value.length; i++) {
            for (let j = 0; j <= threeDiffNum.value.length; j++) {
            if (
                threeDiffNum.value[i] < threeDiffNum.value[j] &&
                threeDiffNum.value[j]
            ) {
                for (let h = 0; h <= threeDiffNum.value.length; h++) {
                if (
                    threeDiffNum.value[j] < threeDiffNum.value[h] &&
                    threeDiffNum.value[h]
                ) {
                    let str = `${threeDiffNum.value[i]}${threeDiffNum.value[j]}${threeDiffNum.value[h]}`;
                    groupThree.value.push(str);
                }
                }
            }
            }
        }
    }
    if (show.value) {
        if (twoDiffNum.value.length < 2 && !isThreeConNum.value &&threeDiffNum.value.length < 3) {
            show.value = false;
        }
        let num = isThreeConNum.value ? 1 : 0;
        let newnum = groupThree.value.length + num + groupTwo.value.length;
        sum.value = newnum * form.value.size * form.value.money;
    }
    if (threeDiffNum.value.length >= 3) show.value = true;
}
 // 模式四 两个不同数字
const selectTwoDiffNum=(name, i)=> {
    form.value.play_group = name;
    if (twoDiffNum.value.length === 0) {
        twoDiffNum.value.push(i);
    } else {
        const index = twoDiffNum.value.findIndex((v) => v === i);
        if (index < 0) {
            twoDiffNum.value.push(i);
        } else {
            twoDiffNum.value.splice(index, 1);
        }
    }
    if (twoDiffNum.value.length >= 2) {
        groupTwo.value = [];
    for (let i = 0; i <= twoDiffNum.value.length; i++) {
        for (let j = 0; j <= twoDiffNum.value.length; j++) {
        if (twoDiffNum.value[i] < twoDiffNum.value[j] && twoDiffNum.value[j]) {
            let str = `${twoDiffNum.value[i]}${twoDiffNum.value[j]}`;
            groupTwo.value.push(str);
        }
        }
    }
    }
    if (show.value) {
        if (twoDiffNum.value.length < 2 && !isThreeConNum.value && threeDiffNum.value.length < 3) {
            show.value = false;
        }
        let num = isThree.value ? 1 : 0;
        let newnum = threeNum.value.length + num;
        sum.value = newnum * form.value.size * form.value.money;
    }
    if (twoDiffNum.value.length >= 2) show.value = true;
}
const keyText =(num)=> {
    let str = "";
    switch (num) {
    case "Big":
        str = $t("lottery.winGobig");
        break;
    case "Small":
        str = $t("lottery.winGosmall");
        break;
    case "Odd":
        str = $t("lottery.k3odd");
        break;
    case "Even":
        str = $t("lottery.k3even");
        break;
    default:
        str = num;
        break;
    }
    return str;
}
// 模式四 连续三个数字
const selectThreeConNum=()=> {
    isThreeConNum.value = !isThreeConNum.value;
    if (isThreeConNum.value) {
    show.value = true;
    } else {
    if (threeDiffNum.value.length < 3 && twoDiffNum.value.length < 2) {
        show.value = false;
    }
    }
    if (show.value) {
    let num = isThreeConNum.value ? 1 : 0;
    let newnum = groupThree.value.length + num + groupTwo.value.length;
    sum.value = newnum * form.value.size * form.value.money;
    }
}
// 获取代理游戏列表
const getGameAgentList=()=> {
    getGameAgentAlias({ game_name: gameInfo.value.game_name }).then((res) => {
        agentGameList.value = res;
    });
}

const getResultData = async(previous_period, isEnd)=>{
    let params = {
		game_code: systemStore.game_code,
		issue_no: previous_period
	}
    let res = await getResultByGameCodeAndPeriod(params);
    if(res.data !== null) {
        getCurrentIssueWinNumber(res.data.result, isEnd);
        emit("updata");
    }
}
// 获取本局结果
const getCurrentIssueWinNumber=(arr, isEnd)=> {
    let timerArr;
    if (isEnd) {
        timerArr = [0, 300, 600];
    } else {
        timerArr = [800, 1500, 2000];
    }
    setTimeout(() => {
        clearInterval(timer.value);
        firstNum.value = arr[0];
        animation1.value = false;
    }, timerArr[0]);
    setTimeout(() => {
        clearInterval(timer1.value);
        secondNum.value = arr[1];
        animation2.value = false;
    }, timerArr[1]);
    setTimeout(() => {
        clearInterval(timer2.value);
        thirdNum.value = arr[2];
        animation3.value = false;
    }, timerArr[2]);
}
// 切换金额
const cutMon=(i)=> {
    form.value.money = i.value;
    let newNum = 0;
    if (tabAction.value === 0) {
    // 第一种
        newNum = selectList.value.length;
    } else if (tabAction.value === 1) {
        const bothlength = bothNum.value.length;
        const oddlength = oddNum.value.length;
        const selectlength = selectList.value.length;
        newNum = bothlength * oddlength + selectlength;
    } else if (tabAction.value === 2) {
    let num = isThree.value ? 1 : 0;
        newNum = threeNum.value.length + num;
    } else {
        let num = isThreeConNum.value ? 1 : 0;
        newNum = groupThree.value.length + num + groupTwo.value.length;
    }
        sum.value = newNum * form.value.size * form.value.money;
}
// 数量change
const valChange=(e:any)=> {
    let newNum = 0;
    if (tabAction.value === 0) {
    // 第一种
        newNum = selectList.value.length;
    } else if (tabAction.value === 1) {
        const bothlength = bothNum.value.length;
        const oddlength = oddNum.value.length;
        const selectlength = selectList.value.length;
        newNum = bothlength * oddlength + selectlength;
    } else if (tabAction.value === 2) {
        let num = isThree.value ? 1 : 0;
        newNum = threeNum.value.length + num;
    } else {
        let num = isThreeConNum.value ? 1 : 0;
        let newNum = groupThree.value.length + num + groupTwo.value.length;
    }
    sum.value = newNum * e * form.value.money;
}
// 倍率
const rateChange=(i)=> {
    form.value.size = i;
    let newNum = 0;
    if (tabAction.value === 0) {
    // 第一种
        newNum = selectList.value.length;
    } else if (tabAction.value === 1) {
        const bothlength = bothNum.value.length;
        const oddlength = oddNum.value.length;
        const selectlength = selectList.value.length;
        newNum = bothlength * oddlength + selectlength;
    } else if (tabAction.value === 2) {
        let num = isThree.value ? 1 : 0;
        newNum = threeNum.value.length + num;
    } else {
        let num = isThreeConNum.value ? 1 : 0;
        newNum = groupThree.value.length + num + groupTwo.value.length;
    }
    sum.value = newNum * form.value.size * form.value.money;
}
// tab切换
const tabChange=(item)=> {
    tabAction.value = item.value;
    cancel();
}
const sumSelect2=()=> {
    let arr = [...selectArrList.value];
    bothNum.value.map((i) => {
    oddNum.value.map((v) => {
        let newNum = String(i) + String(v);
        arr.push(newNum);
    });
    });
    return arr;
}
const postBet=()=> {
    let arr = [];
    if (tabAction.value === 0) {
        // 选项一总数
        arr = [...selectArrList.value];
    } else if (tabAction.value === 1) {
        arr = sumSelect2();
    } else if (tabAction.value === 2) {
        arr = [...threeNum.value];
    if (isThree.value) {
        arr.push("AAA");
    }
    } else {
    // 模式四
    if (threeDiffNum.value.length >= 3) {
        arr.push("Three");
    }
    if (isThreeConNum.value) {
        arr.push("Straight");
    }
    if (twoDiffNum.value.length >= 2) {
        arr.push("Two");
    }
    }
    form.value.bet_amount = sum.value / arr.length;
    // if(tabAction.value!==3){
    arr.map(async(v, index) => {
        form.value.bet_play = v;
        if (tabAction.value === 3) {
            if (v === "Three" || v === "Two") {
                form.value.bet_info = [];
                if (v === "Three") {
                    form.value.bet_info = threeDiffNum.value;
                } else {
                    form.value.bet_info = twoDiffNum.value;
                }
            } else {
                if (form.value.bet_info || form.value.bet_info >= 0) {
                    delete form.value.bet_info;
                }
            }
        }
        let paramas:any;
        if (props.isFollow) {
            if (props.followInfo.isLunch) {
                paramas = {
                    identification: props.followInfo.identification, //用户标识号
                    peerId: props.followInfo.groupId || props.followInfo.gameId, //群id(发跟投自定义消息时使用)
                    peerType: props.followInfo.groupType, //群类型(发跟投自定义消息时使用)
                    isFollow: true,
                    ...form.value,
                };
            } else {
                paramas = {
                    identification: props.followInfo.identification, //用户标识号
                    peerId: props.followInfo.betInfo.peer_id, //群id(发跟投自定义消息时使用)
                    peerType: props.followInfo.betInfo.peer_type, //群类型(发跟投自定义消息时使用)
                    isFollow: false,
                    ...form.value,
                };
            }
        } else {
            paramas = form.value;
        }
        showLoading.value = true;
        try {
            await bet(paramas);
            if(index === arr.length - 1) {
                cancel();
                showToast($t('lottery.gametoast'));
                emit("upDataLog");
            }
        }catch(error) {
            showToast(error.msg)
        }finally {
            showLoading.value = false;
        }
    });
}
const closePopup=()=> {
    init();
}
const cancel=()=> {
    selectArrList.value = [];
    selectList.value = [];
    bothNum.value = [];
    oddNum.value = [];
    threeNum.value = [];
    threeDiffNum.value = [];
    twoDiffNum.value = [];
    groupThree.value = [];
    groupTwo.value = [];
    isThree.value = false;
    isThreeConNum.value = false;
    show.value = false;
    init();
}
const onChange=(e)=> {
    let str = (e.seconds/10).toFixed(1)
	let arr:any = str.split('.')
	timeData.value = e
	timeData.value.seconds1 = arr[0]
	timeData.value.seconds2 = arr[1];
	if(e.minutes == 0 && e.seconds <6) {
		showMask.value = true;
		if(show.value) {
			show.value = false
		}
        setAnimation();
	}else {
		showMask.value = false
	}
	if(e.minutes == 0 && e.seconds == 0 && arr[0] == '0' && arr[1] == '0') {
		showMask.value = false
	}
}

const finish=()=> {
    // emit("music", this.timeGap);
    resetCountDown()
    getTime(true)
   
}
const resetCountDown = ()=>{
    let numeGameid = {
        5:1000*60,
        6:1000*60*3,
        7:1000*60*5,
        8:1000*60*10
    }
    time.value = numeGameid[game_id.value]
    countDownBet.value && countDownBet.value.reset()
}
const comOpenTime=(star, end)=> {
    let arr = miment().distance(star, end).format("mm,ss", true).split(",");
    time.value = (Number(arr[0]) * 60 + Number(arr[1])) * 1000;
}

const setAnimation=()=> {
    animation1.value = true;
    animation2.value = true;
    animation3.value = true;
}
onMounted(()=>{
    init()
    getGameData()
    getTime()
})
watch(
    () => selectList.value, (nV:any, oV:any) => {
        const length = selectList.value.length;
        if (tabAction.value === 0) {
            // 第一种总数
            if (length > 0) {
            sum.value = length * form.value.size * form.value.money;
            }
        } else if (tabAction.value === 1) {
            // 第二种 2数相同或2+1
            if (length > 0) {
            if (bothNum.value.length > 0 && oddNum.value.length > 0) {
                let newNum = bothNum.value.length * oddNum.value.length + length;
                sum.value = newNum * form.value.size * form.value.money;
            } else {
                sum.value = length * form.value.size * form.value.money;
            }
            }
        }
    },{deep: true,immediate: true,}
)
watch(
    () => bothNum.value, (nV:any, oV:any) => {
        const bothlength = bothNum.value.length;
        const oddlength = oddNum.value.length;
        const selectlength = selectList.value.length;
        let newNum = bothlength * oddlength + selectlength;
        sum.value = newNum * form.value.size * form.value.money;
    },
    {deep: true,immediate: true}
)
watch(
    () => oddNum.value, (nV:any, oV:any) => {
        const bothlength = bothNum.value.length;
        const oddlength = oddNum.value.length;
        const selectlength = selectList.value.length;
        let newNum = bothlength * oddlength + selectlength;
        sum.value = newNum * form.value.size * form.value.money;
    },{deep: true,immediate: true}
)
defineExpose({
    setAnimation,
    getCurrentIssueWinNumber,
    setRecentRes,
    followBet 
})
</script>
<style lang="less" scoped>
// 两列上下左右居中
.flex-cc{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

// 一行上下左右居中
.flex-rcc{
  display: flex;
  align-items: center;
  justify-content: center;
}

// 子元素两端对齐均分
.flex-sb{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content {
  margin-top: 14px;
  padding: 0 9px;
  box-sizing: border-box;
  .recently {
    width: 100%;
    height: 42px;
    background: #fff;
    border-radius: 6px;
    margin-bottom: 10px;
    .container {
      display: flex;
      align-items: center;
      height: 42px;
      color: #77819b;
      padding: 0 2px;
      justify-content: space-between;
      .peroid {
        flex: 2;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        .showMore {
          font-size: 10px;
          border-radius: 4px;
          padding: 2px;
          color: #fff;
          background: linear-gradient(180deg, #5EAFEF 0%, #3487F6 100%);
          height: 20px;
        }
        .trend {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 16px;
          }
        }
      }
      .result_word {
        flex: 1;
        span-align: center;
      }
      .third {
        font-size: 10px;
      }
      .more_width {
        flex: 1.5;
      }
    }
    .icon-num {
      width: 20px;
      height: 20px;
      img {
        width: 100%;
      }
      margin-right: 4px;
    }
  }
  .page-box {
    width: 100%;
    border-radius: 8px;
    position: relative;
    background: #fff;
    box-shadow:  0 4px 12px rgba(88, 184, 253, 0.3);
    padding: 10px;
    box-sizing: border-box;
    box-sizing: border-box;
    .period-title {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 13px;
      font-weight: 400;
      color: #77819B;
      margin-bottom: 4px;
      position: relative;
      font-weight: 500;
      font-size: 14px;
      .left_icon {
        font-weight: 500;
        font-size: 14px;
        color: #3e2404;
        width: 110px;
        height: 26px;
        background: linear-gradient(180deg, #5EAFEF 0%, #3487F6 100%);
        color:#fff;
        border-radius: 8px 0 8px 0;
        position: absolute;
        left: -10px;
        top: -10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .period-span {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 20px;
      font-weight: 700;
      color: #77819B;
      .period_box {
        display: flex;
        align-items: center;
        gap: 6px;
        .showMore {
          font-size: 10px;
          border-radius: 4px;
          padding: 2px;
          color: #fff;
          background: linear-gradient(180deg, #5EAFEF 0%, #3487F6 100%);
          height: 20px;
        }
        .trend {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 16px;
          }
        }
      }
      .txt {
        font-size: 18px;
        font-weight: 700;
      }
      .time__custom__item {
        width: 30px;
        height: 45px;
        background: url("/static/game/remintime_bg.png") no-repeat center;
        background-size: 100% 100%;
        font-size: 20px;
        margin-left: 5px;
        font-weight: 900;
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
      }
    }
  }
  .gameBox {
    margin-top:10px;
    .slot-inner {
        padding: 9px;
        box-sizing: border-box;
        background: #00b977;
        display: inline-block;
        border-radius: 6px;
        position: relative;
        margin-bottom: 10px;
        .d5-slot-box {
        box-sizing: border-box;
        padding: 5px 0;
        background: linear-gradient(180deg, #003b26, #005226);
        border-radius: 2px;
        display: inline-block;
        position: relative;
        }
        .d5-slot-box::before {
            position: absolute;
            top: 38px;
            width: 0;
            height: 0;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            content: "";
            z-index: 3;
            left: -1px;
            border-right: 18px solid transparent;
            border-left: 18px solid #00b977;
        }
        .d5-slot-box::after {
            position: absolute;
            top: 38px;
            width: 0;
            height: 0;
            border-top: 6px solid transparent;
            border-bottom: 6px solid transparent;
            content: "";
            z-index: 3;
            right: -1px;
            border-left: 18px solid transparent;
            border-right: 18px solid #00b977;
        }
        .slot-column {
            display: inline-block;
            width: 82px;
            height: 80px;
            border-radius: 3px;
            overflow: hidden;
            background: #333;
            margin-right: 3px;
            vertical-align: bottom;
            text-align: center;
        .dice {
            width: 72px;
            height: 78px;
            line-height: 78px;
            margin: 0 auto 7px;
        }
        .addanimation {
            animation: rotate 0.8s infinite ease-in;
        }
        @keyframes rotate {
            0% {
            transform: rotateZ(180deg);
            }

            20% {
            transform: rotateZ(360deg);
            }

            40% {
            transform: rotateZ(180deg);
            }

            60% {
            transform: rotateZ(360deg);
            }

            80% {
            transform: rotateZ(180deg);
            }

            100% {
            transform: rotateZ(360deg);
            }
        }
    }
    .slot-column::before {
      box-shadow: inset 0 -6px 3px 0 rgba(0, 0, 0, 0.3),
        inset 0 6px 3px 0 rgba(0, 0, 0, 0.3);
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 101%;
      height: 101%;
      content: "";
      z-index: 2;
    }
  }
}
  .bet-box {
    margin-top: 9px;
    position: relative;
    min-height: 280px;
    .k3-bet-content-sum {
        margin-left: -2px;
        margin-right: -2px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .item {
            color: #fff;
            font-weight: 600;
            font-size: 14px;
            flex: 0 0 25%;
            padding: 0 2px;
            box-sizing: border-box;
            margin-bottom: 5px;
                .itembox {
                    width: 100%;
                    height: 46px;
                    padding: 9px 1px;
                    box-sizing: border-box;
                    border-radius: 4px;
                    color: #666666;
                    background: rgba(66, 66, 66, 0.1);
                    position: relative;
                    .select-icon {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background-color: #fff;
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        display: none;
                    }
                }
                .des {
                    font-size: 8px;
                }
        }

        .action {
            .itembox {
                color: #fff !important;
                background-image: linear-gradient(180deg, #5EAFEF 0%, #3487F6 100%);
            }
            .select-icon {
                padding-top: 2px;
                box-sizing: border-box;
                display: flex !important;
            }
        }
    }
    .k3-bet-content-two {
        .title {
            font-size: 13px;
            color: #5c616d;
        }
        .num-box {
            margin-top: 7px;
            .num-box-item {
                flex: 0 0 15%;
                height: 37px;
                line-height: 37px;
                text-align: center;
                color: #fff;
                font-size: 12px;
                border-radius: 4px;
                background-color: rgba(235, 67, 221, 0.6);
                position: relative;
                .select-icon {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: #fff;
                    position: absolute;
                    bottom: 5px;
                    right: 5px;
                    display: none;
                }
            }
        .num-box-item3 {
            flex: 1;
            width: 100% !important;
        }
        .action {
            background-color: #eb43dd;
            .select-icon {
                display: flex;
                padding-top: 2px;
                box-sizing: border-box;
            }
        }
        .colorRed {
            background-color: rgba(251, 78, 78, 0.6);
        }
        .actionRed {
            background-color: #fb4e4e;
            .select-icon {
                display: flex;
                padding-top: 2px;
                box-sizing: border-box;
            }
        }
        .colorGreen {
            background-color: rgba(92, 186, 71, 0.6);
        }
        .actionGreen {
            background-color: #5cba47;
            .select-icon {
                display: flex;
                padding-top: 2px;
                box-sizing: border-box;
            }
        }
        }
        .des {
            margin: 7px 0;
            font-size: 11px;
            color: #f03737;
        }
    }
        .tabItem {
            width: 25%;
            height: 37px;
            font-size: 11px;
            background-image: linear-gradient(180deg, #FCFDFF 0%, #E4EDFE 53%, #F4F7FE 100%);
            color: #77819B;
            border-right: 1px solid #cdcdcd;
            padding: 0 4px;
            box-sizing: border-box;
            &:first-child {
            border-radius: 4px 0 0 4px;
            }
            &:last-child {
            border-radius: 0 4px 4px 0;
            }
        }
        .tabAction {
            color: #fff;
            background-image: linear-gradient(180deg, #5EAFEF 0%, #3487F6 100%);
        }
    }
    .popupStyle {
        background: none;
        max-height: none;
    }
    .popupBox {
        color: #303133;
        font-size: 14px;
        .head {
            .box-header {
                border-radius: 14px 14px 0 0;
                width: 100%;
                background-image: linear-gradient(123deg, #5EAFEF 0%, #3487F6 98%);
                border-radius: 30px 30px 0 0;
                background-size: 100% 100%;
                position: relative;
                .con {
                    font-weight: 600;
                    text-align: center;
                    color: #fff;
                    font-size: 18px;
                    height: 40px;
                    line-height: 40px;
                    position: relative;
                    &::before {
                        content: "";
                        position: absolute;
                        width: 14px;
                        height: 10px;
                        background:url("/static/game/title_fake.svg") no-repeat center;
                        background-size: 100% 100%;
                        left: 110px;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                    &::after {
                        content: "";
                        position: absolute;
                        width: 14px;
                        height: 10px;
                        background:url("/static/game/title_fake.svg") no-repeat center;
                        background-size: 100% 100%;
                        right: 110px;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
            }
        }
        .info {
            padding: 0 14px 14px;
            box-sizing: border-box;
            background: #fff;
            margin-top: -4px;
            .item {
                margin-top: 12px;
                .name {
                    font-weight: 500;
                    font-size: 15px;
                    color: #77819B;
                    position: relative;
                    padding-left: 10px;
                    margin-bottom: 4px;
                    display: block;
                    &::before {
                        content: "";
                        width: 4px;
                        height: 4px;
                        background: #3487F6;
                        border-radius: 4px;
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
                .monItem {
                    text-align: center;
                    padding: 0 9px;
                    box-sizing: border-box;
                    margin-left: 4px;
                    background-color: rgba(66, 66, 66, 0.1);
                    border-radius: 18px;
                    color: #666666;
                    height:28px;
                    line-height: 28px;
                    font-weight: 500;
                    font-size: 12px;
                }
                .action {
                    background-color: #3487F6 !important;
                    color: #fff !important;
                }
                .rule {
                    color: #2150A4;
                    font-size: 14px;
                    margin-left: 20px;
                }
                &:first-child {
                    margin-top: 0;
                }
                .list_item {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    .item_box {
                        display: flex;
                        gap: 8px;
                        color: #333333;
                        font-size: 15px;
                        font-weight: 500;
                        .label {
                            opacity: 0.6;
                        }
                    }
                }
                .number_box {
                    :deep(.van-stepper){
                        .van-stepper__input {
                            width: 80px;
                            height: 30px;
                            background: #f0f0f0;
                            border-radius: 4px;
                        }
                    }
                }
            }
            .liBox {
                display: flex;
                flex-direction: row;
                // justify-content: flex-end;
                height: auto;
                .li {
                    height: 28px;
                    line-height: 28px;
                    text-align: center;
                    font-size: 11px;
                    padding: 0 7px;
                    margin-left: 4px;
                    background-color: #f0f0f0;
                    color: #333;
                }
                .action {
                    color: #fff !important;
                    background-color: #3487F6 !important;
                }
            }
            .balanceWord {
                font-weight: 700;
                font-size: 16px;
                color: #8a4b27;
            }
        }
        .foot {
            width: 100%;
            height: 100px;
            padding: 20px 14px;
            padding-bottom: 34px;
            margin-top: -2px;
            display: flex;
            // line-height: 37px;
            text-align: center;
            gap: 10px;
            font-size: 13px;
            background: #fff;
            .left {
                width: 128px;
                height: 45px;
                background: #ffffff;
                border: 1px solid #3487F6;
                border-radius: 6px;
                font-weight: 900;
                font-size: 16px;
                color: #3487F6;
            }
            .right {
                flex: 1;
                height: 45px;
                background-image: linear-gradient(180deg, #5EAFEF 0%, #3487F6 100%);
                border-radius: 6px;
                font-weight: 900;
                font-size: 16px;
                color: #fff;
            }
        }
    }
    .popup-bet-box {
        text-align: center;
        width: 100%;
        background-image: linear-gradient(180deg, #ffffffb3 0%, #FFFFFF 100%);
        border: 1px solid #FFFFFF;
        border-bottom:  none;
        border-radius: 30px 30px 0 0;
        padding:16px 0;
        font-size: 18px;
        font-weight: 700;
        position: relative;
        justify-content: center;
        display: flex;
        .select-num {
            height: 18px;
            line-height: 13px;
            border-radius: 2px;
            padding: 2px 9px;
            box-sizing: border-box;
            font-size: 11px;
            margin: 1px 3px;
            background-color: #ccc;
        }
        .actionViolet {
            color: #fff;
            background-color: #eb43dd;
        }
        .actionRedGreen {
            height: 16px;
            line-height: 16px;
            border-radius: 2px;
            padding: 2px 9px;
            box-sizing: border-box;
            font-size: 11px;
            margin: 1px 3px;
            color: #fff;
            background-color: #fb4e4e;
            background-image: linear-gradient(90deg, #fb4e4e 50%, #5cba47 70%);
        }
        .actionRed {
            margin-top: 10px;
            margin-bottom: 10px;
            padding: 6px 10px;
            box-sizing: border-box;
            color: #fff;
            background-color: #fb4e4e;
            display: inline-block;
        }
    }
    .mask-box {
        width: 100%;
        height: 100%;
        border-radius: 15px;
        background-color: rgba(0, 0, 0, 0.6);
        position: absolute;
        top: 0;
        left: 0;
        .countTimeBox {
            display: inline-block;
            border-radius: 14px;
            padding: 0 14px;
            box-sizing: border-box;
            background-color: #4899FB;
            font-size: 150px;
            color: #fff;
            font-weight: bold;
            margin-right: 18px;
        }
        .rihht-1 {
            // margin-right: 13px;
        }
    }
}
</style>