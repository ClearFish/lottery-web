<template>
	<div class="content">
		<div class="page-box">
			<div class="last-round">
				<div>
					<div>{{$t("lottery.text5d")}}</div>
					<div class="showMore" @click="showLotteryResult" v-if="isFollow">{{$t("fllowup.More")}}</div>
				</div>
				<div class="round-num" v-for="(item,index) in winInfo.result" :key="index">
					<div class="num-scroll-box">{{item}}</div>
					<div class="word-index">{{indexList[index]}}</div>
				</div>
				<div>=</div>
				<div class="round-num red">
					<div class="num-scroll-box">{{sum_num}}</div>
				</div>
			</div>
			<div class="time_cont">
				<div class="period-title">
					<span class="left_icon">{{$t("lottery.timeText3")}}</span>
					<span>
						<!-- {{(timeData.minutes=== 0 && timeData.seconds<11 &&timeData.seconds>0)? 
							$t("lottery.timeText2'): $t("lottery.timeText1')}} -->
						{{
						showMask ? 
						$t("lottery.timeText2"): $t("lottery.timeText1")
						}}	
					</span>
				</div>
				
				<div class="period-span">
					<span class="txt">{{gameTime.period}}</span>
					<div>
						<van-count-down 
								:time="time" 
								ref="countDownBet" 
								format="mm:ss" 
								@change="onChange"
								@finish="finish">
								<template #default>
									<div class="time flex flex-item-col-center">
										<span class="time__custom__item time__custom__item1">0</span>
										<span class="time__custom__item">{{ timeData.minutes }}</span>
										<span class="time__custom__item">:</span>
										<span class="time__custom__item">{{ timeData.seconds1 }}</span>
										<span class="time__custom__item time__custom__item2">{{ timeData.seconds2 }}</span>
									</div>
								</template>
						</van-count-down>
					</div>
				</div>
			</div>
		</div>
		<div class="a-text-center"  v-if="!isFollow">
			<div class="slot-inner">
				<div class="d5-slot-box">
					<div class="slot-column slot-column-first">
						<div :class="addanimation ? 'slot-transform addanimation':'slot-transform'">
							<div v-for="(a,index1) in 9" :key="index1">
								<div class="slot-num" style="width:50px;height: 50px;line-height: 50px;margin: 0 auto 5px;" v-for="(item,index) in 10" :key="index">{{index}}</div>
							</div>
						</div>
					</div>
					<div class="slot-column">
						<div :class="addanimation ? 'slot-transform addanimation':'slot-transform'">
							<div v-for="(a,index1) in 9" :key="index1">
								<div class="slot-num" style="width:50px;height: 50px;line-height: 50px;margin: 0 auto 5px;" v-for="(item,index) in 10" :key="index">{{index}}</div>
							</div>
						</div>
					</div>
					<div class="slot-column">
						<div :class="addanimation ? 'slot-transform addanimation':'slot-transform'">
							<div v-for="(a,index1) in 9" :key="index1">
								<div class="slot-num" style="width:50px;height: 50px;line-height: 50px;margin: 0 auto 5px;" v-for="(item,index) in 10" :key="index">{{index}}</div>
							</div>
						</div>
					</div>
					<div class="slot-column">
						<div :class="addanimation ? 'slot-transform addanimation':'slot-transform'">
							<div v-for="(a,index1) in 9" :key="index1">
								<div class="slot-num" style="width:50px;height: 50px;line-height: 50px;margin: 0 auto 5px;" v-for="(item,index) in 10" :key="index">{{index}}</div>
							</div>
						</div>
					</div>
					<div class="slot-column">
						<div :class="addanimation ? 'slot-transform addanimation':'slot-transform'">
							<div v-for="(a,index1) in 9" :key="index1">
								<div class="slot-num" style="width:50px;height: 50px;line-height: 50px;margin: 0 auto 5px;" v-for="(item,index) in 10" :key="index">{{index}}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 投注区 -->
		<div class="tzBox">
			<div class="tabBox flex">
				<div class="tabItem" v-for="(i,index) in tabList" :key="index" :class="{'action': tabCurrent===index}" @click="tabCut(index)">
					{{i}}
				</div>
			</div>
			<div class="bet-box add_padding">
				<div class="flex-sb" v-if="gameInfo.odds && Object.keys(gameInfo.odds).length > 0">
					<div class="bet-type-btn flex-sb" @click="select('Big')">
						<span>{{$t("lottery.winGobig")}}</span>
						<span>{{gameInfo.odds.SumPlay.Big}}</span>
					</div>
					<div class="bet-type-btn flex-sb" @click="select('Small')">
						<span>{{$t("lottery.winGosmall")}}</span>
						<span>{{gameInfo.odds.SumPlay.Small}}</span>
					</div>
					<div class="bet-type-btn flex-sb" @click="select('Odd')">
						<span>{{$t("lottery.k3odd")}}</span>
						<span>{{gameInfo.odds.SumPlay.Odd}}</span>
					</div>
					<div class="bet-type-btn flex-sb" @click="select('Even')">
						<span>{{$t("lottery.k3even")}}</span>
						<span>{{gameInfo.odds.SumPlay.Even}}</span>
					</div>
				</div>
				<template v-if="gameInfo.odds && Object.keys(gameInfo.odds.Ball1Play).length > 0">
					<div class="flex-sb flex-warp" v-if="tabCurrent<5">
						<div class="bet-num-line flex-cc" v-for="(item,index) in gameInfo.odds.Ball1Play" :key="index" @click="select(index)">
							<template v-if="index<10">
								<div class="round">{{index}}</div>
								<span>{{item}}</span>
							</template>
						</div>
					</div>
				</template>
	
			</div>
			
			<!-- 代理游戏 -->
			<div class="flex" style="margin-top: 20px;" v-if="agentGameList.length>1">
				<div class="agent-item" :class="{'red-agent-item': Number(gameId)===item.game_id}" v-for="(item,index) in agentGameList" :key="index">{{item.agent_alias}}</div>
			</div>
			<div class="mask-box flex-rcc" v-if="showMask">
				<div class="countTimeBox rihht-1">{{timeData.seconds1}}</div>
				<div class="countTimeBox">{{timeData.seconds2}}</div>
			</div>	
		</div>
		<!-- 底部弹窗 -->
		<van-popup :show="show" 
				class="popupStyle" 
				round :mode="'center'"  
				:class="'follow_popup'" 
				safeAreaInsetBottom>
			<div class="popupBox">
				<div class="head">
					<div class="box-header colorBSize">
						<div class="con">{{gameTypes[currentTime].label}}{{ $t("lottery.minute") }}</div>
					</div>
					<div class="bet-box">
						<div class="tabBox flex">
							<div class="tabItem" v-for="(i,index) in tabList" :key="index" :class="{'action': tabCurrent===index}" @click="tabCut(index)">
								{{i}}
							</div>
						</div>
						
						<div class="flex-sb" v-if="Object.keys(gameInfo).length>0">
							<div class="bet-type-btn flex-sb" :class="{'active0':playType.includes('Big')}" @click="select('Big')">
								<span>{{$t("lottery.winGobig")}}</span>
								<span>{{gameInfo.odds.SumPlay.Big}}</span>
							</div>
							<div class="bet-type-btn flex-sb" :class="{'active1':playType.includes('Small')}" @click="select('Small')">
								<span>{{$t("lottery.winGosmall")}}</span>
								<span>{{gameInfo.odds.SumPlay.Small}}</span>
							</div>
							<div class="bet-type-btn flex-sb" :class="{'active2':playType.includes('Odd')}" @click="select('Odd')">
								<span>{{$t("lottery.k3odd")}}</span>
								<span>{{gameInfo.odds.SumPlay.Odd}}</span>
							</div>
							<div class="bet-type-btn flex-sb" :class="{'active3':playType.includes('Even')}" @click="select('Even')">
								<span>{{$t("lottery.k3even")}}</span>
								<span>{{gameInfo.odds.SumPlay.Even}}</span>
							</div>
						</div>
											
						<template v-if="Object.keys(gameInfo).length>0">
							<div class="flex-sb flex-warp" v-if="tabCurrent<5">
								<div class="bet-num-line flex-cc" v-for="(item,index) in gameInfo.odds.Ball1Play" :key="index"   @click="select(index)">
									<template v-if="index<10">
										<div class="round" :class="{'activeNum': playType.includes(index)}">{{index}}</div>
										<span>{{item}}</span>
									</template>
								</div>
							</div>
						</template>
					</div>
				</div>
				<div class="info">
					<div class="item">
						<span class="name">{{$t("lottery.Balance")}}</span>
						<div class="list_item">
							<div class="item_box">
								<span class="label">₫</span>
                            	<span class="value">{{userStore.balance}}</span>
							</div>
						</div>
					</div>
					<div class="item">
						<span class="name">{{$t("lottery.popupcell2")}}</span>
						<div class="flex flex-item-col-center">
							<div v-for="(i,index) in moneyList" :key="index" 
							class="monItem" :class="{'action':form.money == i.value}" @click="cutMon(i)">{{i.label}}</div>
							<!-- <div class="monItem" :class="{'action':isAllin}" @click="allIn">all in</div> -->
						</div>
					</div>
					<div class="item">
						<span class="name">{{$t("lottery.popupcell3")}}</span>
						<div class="number_box">
							<van-stepper
								v-model="form.size" 
								theme="round"
								@change="valChange">
							</van-stepper>
						</div>
					</div>
					<div class="item liBox">
						<div class="li" v-for="i in liList" :key="i" :class="{'action': form.size === i}" @click="rateChange(i)">X{{i}}</div>
					</div>
				</div>
				<div class="foot">
					<div class="left flex-rcc" @click="cancel">{{$t("lottery.popupbtn1")}}</div>
					<div class="right flex-rcc" @click="postBet">{{$t("lottery.popupbtn2")}}  {{sum}}</div>
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
	</div>
</template>

<script setup lang="ts">
import miment from 'miment'
import { ref, defineEmits, watch } from "vue"
import { getTimes, getGame, bet, getResult, getGameAgentAlias } from '@/api/lottery'
import { showToast } from 'vant'
import { $t } from '@/locales'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore() 
const props = defineProps({
	gameId:{
        default: () => {
            return '' as any;
        }
    },
	currentTime:{
        default: () => {
            return '' as any;
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
    },
	noThree:{
        default: () => {
            return true;
        }
    }
})


const show = ref(false)
const timmer = ref(null)
const time = ref()
const timeData:any = ref({})
const indexList = ref(['A','B','C','D','E'])
const win_num = ref('1,8,2,3,6')
const tabCurrent = ref(0)
const moneyList = ref(
	[
		{label:'1K',value:'1000'},
		{label:'10K',value:'10000'},
		{label:'100K',value:'100000'},
		{label:'500K',value:'500000'},
		{label:'1000K',value:'1000000'},
		{label:'5000K',value:'5000000'}
	]
)
const liList = ref([1,3,9,27,81,243,729,2187])
const form:any = ref(
	{
		game_id: null, // 游戏id
		currency: 'SYSTEM', // 币种
		period: null, // 期号
		play_group: null, // 玩法组名
		bet_play: null, // 玩法
		bet_amount: 1000, // 下注金额
		money: 1000,
		size: 1,
	}
)
const playType = ref([])
const sum = ref(1)
const agree = ref([1])
const gameInfo:any = ref({})
const gameTime:any = ref({})
const winInfo:any = ref({})
const sum_num = ref(0)
const agentGameList = ref([]) // 代理游戏列表
const showMask = ref(false)
const addanimation = ref(false)
const gameTypes = ref([{value: 1,label: '1'},{value: 3,label: '3'},{value: 5,label: '5'},{value: 10,label: '10'}])
const followBetInfo:any = ref({})
const userFollow = ref(false)
const showLoading = ref(false)
const tabList = ref(['A','B','C','D','E',"Tổng"])
const countDownBet = ref(null)
const resultTimer = ref(null)

const emit = defineEmits(["showLotteryResult","updata","upDataLog",]);
const showLotteryResult=()=> {
	emit('showLotteryResult')
}
const followBet=(info)=> {
	followBetInfo.value = info;
	userFollow.value = true;
	form.value.size = info.size;
	form.value.money = info.money;
	form.value.bet_amount = info.bet_amount;
}
// 获取上期结果
const getPreWinNumber=()=>{
	let params = {
		game_id: props.gameId,
		period: gameInfo.value.times.previous_period
	}
	getResult(params).then(res=>{
		winInfo.value = res
		sum_num.value = sumWin(winInfo.value.result)
	})
}
// 获取游戏信息
const getGameData=()=>{
	getGame({game_id: props.gameId}).then((res) =>{
		gameInfo.value = res
		console.log(gameInfo.value,"gameinfo")
		if(userFollow.value) {
			// 用户跟投
			let info = followBetInfo.value
			const arr = Object.keys(gameInfo.value && gameInfo.value.odds)
			tabCurrent.value = arr.findIndex(item=>item == info.play_group)
			select(info.bet_play)
		}
		getPreWinNumber()
		getGameAgentList()
	})
}
// 获取代理游戏列表
const getGameAgentList=()=>{
	getGameAgentAlias({game_name: gameInfo.value.game_name}).then(res=>{
		agentGameList.value = res
	})
}
// 游戏开奖时间
const getTime=(isEnd?:boolean)=>{
	getTimes({game_id: props.gameId}).then((res:any)=>{
		gameTime.value = res
		form.value.period = res.period
		if(isEnd){ // 倒计时结束查结果更新记录
			getResultData(gameTime.value.previous_period)
		}else {
			comOpenTime(gameTime.value.current_time,gameTime.value.end_time)
		}
	})
}
		
// 获取本期开奖
const getResultData=async(previous_period)=>{
	let params = {
		game_id: props.gameId,
		period: previous_period
	}
	clearInterval(resultTimer.value)
	try {
		let res:any = await getResult(params);
		if(res != null) {
			winInfo.value = res
			sum_num.value = sumWin(winInfo.value.result)
			start(res.result)
			emit('updata')
		}
	}catch(error) {
		resultTimer.value = setInterval(async()=>{
			let res:any = await getResult(params);
			if(res != null) {
				clearInterval(resultTimer.value)
				winInfo.value = res
				sum_num.value = sumWin(winInfo.value.result)
				start(res.result)
				emit('updata')
			}
		},1000)
	}
	
}
		
// 下注
const postBet=()=>{
	form.value.bet_amount = sum.value/playType.value.length
	let length = playType.value.length-1
	console.log('playType.value', playType.value)
	playType.value.map(async(v,index)=>{
		form.value.bet_play = v
		let paramas;
		if(props.isFollow) {	
			if(props.followInfo.isLunch) {
				paramas = {
					identification: props.followInfo.identification,     //用户标识号
					peerId:props.followInfo.groupId || props.followInfo.gameId,              //群id(发跟投自定义消息时使用)
					peerType:props.followInfo.groupType,                  //群类型(发跟投自定义消息时使用)
					isFollow:true,
					...form.value
				}
			}else {
				paramas = {
					identification: props.followInfo.identification,     //用户标识号
					peerId: props.followInfo.betInfo.peer_id, //群id(发跟投自定义消息时使用)
					peerType: props.followInfo.betInfo.peer_type, //群类型(发跟投自定义消息时使用)
					isFollow:false,
					...form.value
				}
			}
		}else {
			paramas = form.value
		}
		showLoading.value = true
		try {
			await bet(paramas);
			if(index === length) {
				cancel();
				showToast($t('lottery.gametoast'))
				emit('upDataLog')
			}
		}catch(error) {
			showToast(error.msg)
		}finally {
			showLoading.value = false
		}
		// bet(paramas).then(res=>{
		// 	if(index === length){
		// 		cancel()
		// 		if(res.code == 1) {
		// 			showToast($t('lottery.gametoast'))
		// 		}else {
		// 			showToast(res.msg)
		// 		}
		// 		showLoading.value = false	
		// 		emit('upDataLog')
		// 	}
		// })
	})
	
}
const start=(numbers:any)=> {
	addanimation.value = false
	let boxs:any = document.querySelectorAll(".slot-transform");
	console.log('boxs',boxs)
	for(var i=0; i<5; i++){
		boxs[i].style.transition = '.5s';  
		boxs[i].style.transform = 'translateY('+ -535 + "px)";
	}  
	console.log(numbers,'[[[[]]]]')
	if(numbers){
		setTimeout(()=>{
			for(var i=0; i<5; i++){
				boxs[i].style.transform = 'translateY('+ (-3835 +  -55* numbers[i]) + "px)"; //2185 
				boxs[i].style.transition = (i+1) * 200 + "ms";  
			} 
		},100)
	}
}
const onChange=(e)=> {
	let str = (e.seconds/10).toFixed(1)
	let arr = str.split('.')
	timeData.value = e
	timeData.value.seconds1 = arr[0]
	timeData.value.seconds2 = arr[1]
	if(arr[0] == '0' && Number(arr[1]) < 6) {
		showMask.value = true;
		addanimation.value = true;
		if(show.value) {
			show.value = false
		}
	}else {
		showMask.value = false
	}
	if(arr[0] == '0' && arr[1] == '0') {
		showMask.value = false
	}
}

// 计时结束事件
const finish=()=>{
	resetCountDown()
	getTime(true)
}
const resetCountDown = ()=>{
    let numeGameid = {
        9:1000*60,
        10:1000*60*3,
        11:1000*60*5,
        12:1000*60*10
    }
    time.value = numeGameid[props.gameId]
	countDownBet.value && countDownBet.value.reset()
}
const keyWinNumber=(value)=>{
	return value.split(',')
}
//菜单切换
const tabCut=(index)=>{
	playType.value = []
	tabCurrent.value=index
	form.value.play_group = index
}
// 求和
const sumWin=(value)=>{
	let arr =  []
	arr = value
	let sum = 0
	arr.map(v=>{
		sum = sum + Number(v)
	})
	return sum
}
const select=(index)=>{
	const arr = Object.keys(gameInfo.value.odds)
	form.value.play_group = arr[tabCurrent.value]
	if(isNaN(Number(index))){ // 非数字
		if(playType.value.length===0){
			playType.value.push(index)
		}else{
			const key = playType.value.findIndex(v=>{ return v===index })
			if(key<0){
				playType.value.push(index)
				if(index==="Big"){
					deleteIndex('Small')
				}else if(index==="Small"){
					deleteIndex('Big')
				}else if(index==="Odd"){
					deleteIndex('Even')
				}else{
					deleteIndex('Odd')
				}
			}else{
				playType.value.splice(key,1)
			}
		}
	}else{ // 数字
		if(playType.value.length===0){
			playType.value.push(index)
		}else{
			const key = playType.value.findIndex(v=>{ return v===index })
			if(key<0){
				playType.value.push(index)
			}else{
				playType.value.splice(key,1)
			}
		}
	}	
	
	sum.value = form.value.size  * form.value.money * playType.value.length
	show.value = true
}
//删除方法
const deleteIndex=(key)=>{
	let newIndex = playType.value.findIndex(v=>{ return v===key })
	if(newIndex>=0){
		playType.value.splice(newIndex,1)
	}
}
// 切换金额
const cutMon=(i)=>{
	form.value.money = i.value
	sum.value = form.value.size * form.value.money * playType.value.length
}
// 数量change
const valChange=(e:any)=>{
	sum.value = e * form.value.money * playType.value.length
}
// 倍率
const rateChange=(i)=>{
	form.value.size = i
	sum.value = form.value.size  * form.value.money * playType.value.length
}
const closePopup=()=>{
	init()
}
const init=()=>{
	if(!userFollow.value) {
	sum.value = 0
	playType.value = []
	form.value.play_group = null
	form.value.bet_play = null
	form.value.bet_amount = 1000
	form.value.money = 1000
	form.value.size = 1
	showMask.value = false
	}
}
const cancel=()=>{
	init()
	show.value = false
}
// 计算距开奖时间剩余秒数
const comOpenTime=(star,end)=>{
	console.time()
	let arr = (miment().distance(star, end).format('mm,ss',true)).split(',')
	time.value = (Number(arr[0])*60 +Number(arr[1])) *1000
	console.timeEnd()
}

watch(
    ()=>props.gameId, (newV:any,oldV:any) => {
        if (newV) {
            form.value.game_id = newV;
            init();
            getGameData();
            getTime();
        }
    },{immediate: true}
)
defineExpose({
	followBet,
	start 
})
</script>

<style lang="less" scoped>
.flex-warp {
  flex-wrap: wrap;
}
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
.mask-box{
	width: 100%;
	height: 100%;
	border-radius: 15px;
	background-color: rgba(0, 0, 0, .6);
	position: absolute;
	top: 0;
	left: 0;
	.countTimeBox{
		display: inline-block;
		border-radius: 14px;
		padding: 0 14px;
		box-sizing:border-box;
		background-color: #4899FB;
		font-size: 150px;
		color: #fff;
		font-weight: bold;
		margin-right: 18px;
	}
}
.number_box {
	::v-deep {
		.u-number-box__input {
			background-color: #f0f0f0 !important;
			color: #303133 !important;
			// border:1px solid #cdcdcd;
			width: 80px !important;
			font-weight: 500;
			font-size: 15px;
			color: #333333;
		}
		.u-number-box {
			.u-number-box__slot {
				background: #f0f0f0;
				color: #EF233B !important;
				// border: 4px solid #f0f0f0;
				border-radius: 43px;
				display: flex;
				// justify-content: center;
				align-items: center;
				height: 43px;
				width: 43px;
				margin-right: -10px;
				padding-right: 5px;
				padding-top: 6px;
				box-sizing:border-box;
				.minus {
					width: 30px;
					height: 30px;
					background: #fff;
					border-radius: 30px;
					display: flex;
					justify-content: center;
					align-items: center;
				}
				&:last-child {
					margin-right: 0;
					margin-left: -10px;
					padding-left: 8px;
					box-sizing:border-box;
				}
			}
		}
	}
}
.content {
	margin-top: 14px;
	padding: 0 9px;
	box-sizing:border-box;
	.page-box{
		position: relative;
		.last-round{
			text-align: center;
			padding: 10px;
			box-sizing:border-box;
			background: #fff;
			border-radius: 8px;
			padding-bottom: 20px;
			box-sizing:border-box;
			// border-bottom: 0.5px solid #f1f3fb;
			margin-bottom: 12px;
			height: 65px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #77819B;
			.round-num {
				width: 37px;
				height: 37px;
				line-height: 35px;
				border-radius: 50%;
				border: 0.5px solid rgba(255,255,255,0.5);
				color: #666666;
				background: rgba(66, 66, 66, 0.1);
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-direction: column;
			}
			.red{
				border: none;
				color: #fff;
				line-height: 37px;
				background: #3487f6;
			}
			.word-index{
				line-height: 15px;
				color: #9da7b3;
				font-size: 13px;
				font-weight: 400;
			}
			.showMore {
				font-size: 10px;
				border-radius: 4px;
				padding: 2px;
				color: #fff;
				background: linear-gradient(180deg, #5EAFEF 0%, #3487F6 100%);
				height: 20px;
			}
		}
		.time_cont {
			border-radius: 8px;
			background: #fff;
			box-shadow:  0 4px 12px rgba(88, 184, 253, 0.3);
			padding: 10px;
			box-sizing:border-box;
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
					color: #3E2404;
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
			.period-span{
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 18px;
				font-weight: 700;
				color: #77819B;
				.txt{
					font-size: 18px;
				}
				.time__custom__item{
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
					color:#fff
				}
			}
		}
	}
	.a-text-center {
		text-align: center;
		margin-top:10px;
		.slot-inner {
			padding: 9px;
			box-sizing:border-box;
			background: #00b977;
			display: inline-block;
			border-radius: 6px;
			position: relative;
			margin-bottom: 10px;
		}
		.slot-inner:before {
			left: -5px;
			border-radius: 5px 0 0 5px;
			position: absolute;
			top: 40px;
			width: 5px;
			height: 28px;
			content: "";
			background: #008b59;
		}
		.slot-inner:after {
			position: absolute;
			top: 40px;
			width: 5px;
			height: 28px;
			content: "";
			background: #008b59;
			right: -5px;
			border-radius: 0 5px 5px 0;
		}
		.d5-slot-box {
			padding: 5px 0;
			box-sizing:border-box;
			background: -webkit-gradient(linear,left top,left bottom,from(#003b26),to(#005226));
			background: linear-gradient(180deg,#003b26,#005226);
			border-radius: 2px;
			display: inline-block;
			position: relative;
		}
		.d5-slot-box:before {
			left: -0.5px;
			border-right: 18px solid transparent;
			border-left: 18px solid #00b977;
			position: absolute;
			top: 38px;
			width: 0;
			height: 0;
			border-top: 6px solid transparent;
			border-bottom: 6px solid transparent;
			content: "";
			z-index: 3;
		}
		.d5-slot-box:after {
			right: -0.5px;
			border-left: 18px solid transparent;
			border-right: 18px solid #00b977;
			position: absolute;
			top: 38px;
			width: 0;
			height: 0;
			border-top: 6px solid transparent;
			border-bottom: 6px solid transparent;
			content: "";
			z-index: 3;
		}
		
		.slot-column-first {
			margin-left: 5px;
		}
		.slot-column {
			display: inline-block;
			width: 54px;
			height: 80px;
			border-radius: 3px;
			overflow: hidden;
			background: #333;
			margin-right: 3px;
			vertical-align: bottom;
			position: relative;
			text-align: center;	
		}
		.slot-transform {
			
			// transform:rotateX(120deg);
			// transition: rotateX() ease-out 2s;
		}
		.addanimation {
			animation: transup .5s infinite ease-in;
			@keyframes transup {
				0% {
					transform: translateY(-55px)
				}

				10% {
					transform: translateY(-110px);
				}

				20% {
					transform: translateY(-165px);
				}

				30% {
					transform: translateY(-220px);
				}

				40% {
					transform: translateY(-275px);
				}
				50% {
					transform: translateY(-330px);
				}
				60% {
					transform: translateY(-385px);
				}
				70% {
					transform: translateY(-440px);
				}
				80% {
					transform: translateY(-495px);
				}
				90% {
					transform: translateY(-550px);
				}
				100% {
					transform: translateY(-605px);
				}
				
			}
		}
		.slot-num {
			// width: 50px !important;
			// height: 50px !important;
			// line-height: 50px !important;
			background: #e1e1ec;
			border-radius: 50%;
			font-size: 28px;
			color: rgba(0,0,0,.4);
			font-weight: 700;
			// margin: 0 auto 5px;
			// background: #00e065;
			// color: #fff;
		}
		.slot-column-first .slot-num{
			background: #00e065;
			color: #fff;			
		}
	}
	.tabBox{
		width: 100%;
		margin-top: 18px;
		margin-bottom: 9px;
		border-bottom: 1px solid #c7c7cc;
		.tabItem{
			width: 37px;
			height: 37px;
			line-height: 37px;
			background: rgba(66, 66, 66, 0.1);
			font-size: 15px;
			font-weight: 700;
			color: #666;
			border-radius: 17px 17px 0 0;
			position: relative;
			margin-right: 7px;
			text-align: center;
		}
		.action{
			background-color: #3487F6;
			color: #fff;
		}
		.action::after{
			background: radial-gradient(circle at 100% 0,rgba(204,0,0,0) 9px,#EF233B 10px);
			right: -9px;
			z-index: 9;
		}
	}
	.tzBox{
		position: relative;
		background: #fff;
		border-radius: 14px;
		padding: 10px 0;
		box-sizing:border-box;
		margin-top: 14px;
		.tabBox {
			margin-top: 0 !important;
		}
		.add_padding {
			padding: 0 10px;
			box-sizing: border-box;
		}
	}
	.bet-box{
		overflow: hidden;
		position: relative;
		min-height: 100px;
		}
	.bet-num-line{
		width: 20%;
		font-weight: 400;
		font-size: 11px;
		line-height: 11px;
		color: #6b7581;
		margin-bottom: 15px;
		.round{
			width: 37px;
			height: 37px;
			line-height: 37px;
			border: 1px solid #ceced8;
			border-radius: 50%;
			color: #9da7b3;
			font-size: 14px;
			text-align: center;
			font-weight: 500;
			margin-bottom: 2px;
		}
	}
	.bet-type-btn{
		// width: 65px;
		height: 32px;
		line-height: 32px;
		background: rgba(66, 66, 66, 0.1);
		border-radius: 5px;
		color: #666;
		margin-bottom: 14px;
		padding: 0 5px;
		box-sizing:border-box;
		font-size: 14px;
		font-weight: 500;
	}
}
.popupStyle{
	background: none;
    max-height: none;
}
.van-popup {
	background: none !important;
}
.popupBox{
	color: #303133;
	font-size: 14px;
	.head{
		background-image: linear-gradient(123deg, #5EAFEF 0%, #3487F6 98%);
		border-radius: 30px 30px 0 0;
		.box-header{
			border-radius: 14px 14px 0 0;
			width: 100%;
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
					left: 130px;
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
					right: 130px;
					top: 50%;
					transform: translateY(-50%);
				}
			}	
		}
		.bet-box {
			// margin-top: 18px;
			padding: 10px !important;
			box-sizing:border-box;
			box-sizing: border-box;
			overflow: hidden;
			position: relative;
			min-height: 100px;
			background: linear-gradient(180deg, #ffffffb3 0%, #FFFFFF 100%);
			margin-top: -2px;
			border-radius: 30px 30px 0 0;
		}
	} 
	.info{
		padding: 0 14px 14px;
		background: #fff;
		margin-top: -4px;
		.item{
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
			.monItem{
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
			}
			.action{
				background-color: #3487F6!important;
				color: #fff!important;
			}
			.rule{
				color: #2150A4;
				font-size: 14px;
				margin-left: 20px;
			}
			&:first-child {
				margin-top:0
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
		.liBox{
			display: flex;
			flex-direction: row;
			// justify-content: flex-end;
			height: auto;
			.li{
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
				color: #fff!important;
				background-color: #3487F6!important;
			}
		}
		.balanceWord {
			font-weight: 700;
			font-size: 16px;
			color: #8a4b27;
		}
	}
	.foot{
		width: 100%;
		height: 100px;
		padding: 20px 14px;
		box-sizing:border-box;
		padding-bottom: 34px;
		margin-top: -2px;
		display: flex;
		// line-height: 37px;
		text-align: center;
		gap: 10px;
		font-size: 13px;
		background: #fff;
		.left{
			width: 128px;
			height: 45px;
			background: #FFFFFF;
			border: 1px solid #3487F6;
			border-radius: 6px;
			font-weight: 900;
			font-size: 16px;
			color: #3487F6;
		}
		.right{
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
.follow_popup {
	.popupBox {
		.foot {
			border-radius: 0 0 20px 20px;
		}
	}
}
.activeNum{
	background: #3487F6;
	border: 1px solid #3487F6;
	color: #fff !important;
}
.active0{
	background: #3487F6 !important;
}
.active1{
	background: #fff !important;
	border: 1px solid #3487F6 !important;
	color: #3487F6 !important;
}
.active2{
	background: #3487F6 !important;
	color: #fff !important;
}
.active3{
	background: #fff !important;
	border: 1px solid #3487F6 !important;
	color: #3487F6 !important;
}
.agent-item {
line-height: 26px;
text-align: center;
padding: 0 5px;
box-sizing:border-box;
border: 0.5px solid #fff;
color: #fff;
border-radius: 9px;
font-size: 13px;
margin-left: 4px;
box-shadow: 0 0 5px 1px rgba(92,186,71,.72);
background-color: #3fa628;
}
.red-agent-item {
background-color: #fb4e4e;
box-shadow: 0 0 5px 1px rgba(183, 71, 71, 0.72);
}
</style>