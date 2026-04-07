<template>
    <div class="bonous_box">
        <div class="filter_box">
            <div class="bottom_filter">
                <div class="date_btn" @click="choseDate(0)" :class="quickType == 0 ?'chosed':''">7 {{$t('promotionactivity.Days')}}</div>
                <div class="date_btn" @click="choseDate(2)" :class="quickType == 2 ?'chosed':''">{{$t('promotionactivity.YesterDay')}}</div>
                <div class="date_btn" @click="choseDate(1)" :class="quickType == 1 ?'chosed':''">30 {{$t('promotionactivity.Days')}}</div>
                <div class="date_picker" :class="date ? 'date_chosed':''" @click="showDatePicker=true">
                    <van-icon name="notes-o" size="20"/>
                    <p>{{$t('invite.select_date')}}</p>
                </div>
            </div>
        </div>
        <div class="content_box">
            <div class="container">
                <div class="cont_item">
                    <div class="value">{{userInfo.registrNumber}}</div>
                    <div class="lable">{{$t('invite.Registration_quantity')}}</div>
                </div>
                <div class="cont_item">
                    <div class="value">{{rechargeInfo.totalNumber}}</div>
                    <div class="lable">{{$t('invite.Recharge_quantity')}}</div>
                </div>
                <div class="cont_item">
                    <div class="value">{{rechargeInfo.firstNumber}}</div>
                    <div class="lable">{{$t('invite.First_recharge_quantity')}}</div>
                </div>
                <div class="cont_item">
                    <div class="value">{{rechargeInfo.firstAmount}}</div>
                    <div class="lable">{{$t('invite.First_recharge_amount')}}</div>
                </div>
                <div class="cont_item">
                    <div class="value">{{rechargeInfo.twoNumber}}</div>
                    <div class="lable">{{$t('invite.times_2_recharge_quantity')}}</div>
                </div>
                <div class="cont_item">
                    <div class="value">{{rechargeInfo.twoAmount}}</div>
                    <div class="lable">{{$t('invite.times_2_recharge_amount')}}</div>
                </div>
                <div class="cont_item">
                    <div class="value">{{rechargeInfo.totalAmount}}</div>
                    <div class="lable">{{$t('invite.Recharge_amount')}}</div>
                </div>
                <div class="cont_item">
                    <div class="value">{{gameInfo.total_count}}</div>
                    <div class="lable">{{$t('invite.Number_of_bets')}}</div>
                </div>
                <div class="cont_item">
                    <div class="value">{{gameInfo.total_bet_amount}}</div>
                    <div class="lable">{{$t('invite.Total_betting_amount')}}</div>
                </div>
            </div>
        </div>
        <div class="list_box">
            <div class="list_item" v-for="(item,index) in lvList" :key="index">
                <div class="center_item">
                    <div class="title">{{$t('invite.Level')}}</div>
                    <div class="value">{{item.level}}</div>
                </div>
                <div class="center_item">
                    <div class="title">{{$t('invite.Number_of_Members')}}</div>
                    <div class="value other_color">{{item.user_count}}</div>
                </div>
                <div class="center_item">
                    <div class="title">{{$t('invite.Number_of_Deposit')}}</div>
                    <div class="value other_color">{{item.total_pay_count}}</div>
                </div>
                <div class="center_item">
                    <div class="title">{{$t('invite.Deposit_Amount')}}</div>
                    <div class="value other_color">{{item.total_pay_amount}}</div>
                </div>
                <div class="center_item">
                    <div class="title">{{$t('invite.Bet_Amount')}}</div>
                    <div class="value">{{item.total_bet_amount}}</div>
                </div>
            </div>
        </div>
        <van-popup :show="showTypes" position="bottom" round class="popupStyle" closeOnClickOverlay>
            <div class="container_box">
				<div class="top_action">
					<div @click="showTypes=false" class="cancle">{{$t('common.cancel')}}</div>
					<div class="sure" @click="confirm">{{$t('common.confirm')}}</div>
				</div>
				<div class="search_box">
					<div :class="itemChosedIndex == index ? 'search_item chosedItem':'search_item'" 
							v-for="(item,index) in scrollList" :key="index" 
							@click="choseItem(item,index)">{{item.name}}</div>
				</div>
			</div>
		</van-popup>
        <!-- 日期选择 -->
        <van-popup v-model:show="showDatePicker" position="bottom">
           <van-picker-group
            :tabs="[$t('promotionactivity.start_date'), $t('promotionactivity.end_date')]"
            @confirm="onConfirm"
            @cancel="showDatePicker=false"
            >
            <van-date-picker
                v-model="range[0]"
                :min-date="minDate"
                :max-date="maxDate"
            />
            <van-date-picker
                v-model="range[1]"
                :min-date="minDate"
                :max-date="maxDate"
            />
            </van-picker-group>
        </van-popup>
    </div>
</template>
<script lang="ts" setup>
import {ref,onMounted} from "vue"
import {Report } from '@/api/promotions'
import { $t } from '@/locales'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'
import miment from 'miment'

const showTypes:any = ref(false)
const scrollList:any = ref([
    {name:'LV 1',value:'1'},
    {name:'LV 2',value:'2'},
    {name:'LV 3',value:'3'},
    {name:'LV 4',value:'4'},
    {name:'LV 5',value:'5'},
    {name:'LV 6',value:'6'},
])
const lvList:any = ref([])
const itemChosedIndex:any = ref(0)
const date:any = ref('')
const quickType:any = ref(null)
const choseLv:any = ref('')
const params:any = ref({start_date:miment().format('YYYY-MM-DD') + ' 00:00',end_date:miment().format('YYYY-MM-DD') + ' 23:59'})
const gameInfo:any = ref({})
const userInfo:any = ref({})
const rechargeInfo:any = ref({})
const showDatePicker:any = ref(false)
const minDate = ref( new Date(2018, 0, 1))
const maxDate = ref( new Date())
const range:any = ref([])
onMounted(()=>{
    getData()
})
const onConfirm = async()=>{
    let start_date = range.value[0].join('-')+' 00:00';
    let end_date = range.value[1].join('-')+' 25:59';
    params.value.start_date = start_date;
    params.value.end_date = end_date;
    getData();
    showDatePicker.value = false
}
const getData=()=>{
    Report(params.value).then((res:any)=>{
        lvList.value = res.LReport;
        gameInfo.value = res.game;
        userInfo.value = res.user;
        rechargeInfo.value = res.recharge
    })
}
const choseDate=(type:any)=> {
    quickType.value = type;
    date.value = ''
    if(type == 0) {
        params.value.start_date = miment().add(-7,'DD').format('YYYY-MM-DD') + ' 00:00';
        params.value.end_date = miment().add(-1,'DD').format('YYYY-MM-DD') + ' 23:59'
    }else if(type ==1) {
        params.value.start_date = miment().add(-29,'DD').format('YYYY-MM-DD') + ' 00:00';
        params.value.end_date = miment().format('YYYY-MM-DD') + ' 23:59'
    }else {
        params.value.start_date = miment().add(-1,'DD').format('YYYY-MM-DD') + ' 00:00';
        params.value.end_date = miment().add(-1,'DD').format('YYYY-MM-DD') + ' 23:59'
    }
    getData()
}
const confirm=()=>{
    let val = scrollList.value[itemChosedIndex.value].value
    choseLv.value = val
    showTypes.value = false;
}
const choseItem=(item:any,index:any)=> {
    itemChosedIndex.value = index;
}
const dateChage=(val:any)=> {
    quickType.value = null
    params.value.start_date = val.split(' ')[0] + ' 00:00';
    params.value.end_date = val.split(' ')[0] + ' 23:59';
    getData()
}
const copyNumber=async(code:any)=> {
    try {
        await navigator.clipboard.writeText(code)
        showToast($t('deposit.copiedToClipboard'))
    } catch (error) {
        showToast($t('deposit.copyFailed'))
    }
}
</script>
<style lang="less" scoped>
.bonous_box {
    background: #fff;
    min-height:100vh;
    .filter_box {
        padding:10px;
        box-sizing: border-box;
        border-bottom: 1px solid #e4e4e4;
        .top_box {
            img {
                width: 24px;
                height: 24px;
            }
        }
        .bottom_filter {
            display: flex;
            gap: 10px;
            margin-top: 8px;
            justify-content: space-between;
            .left {
                width: 20%;
                display: flex;
                justify-content: space-between;
                padding: 6px;
                align-items: center;
                border: 1px solid #e4e4e4;
                border-radius: 4px;
                font-size: 12px;
            }
            .date_btn {
                width: 20%;
                font-size: 12px;
                border: 1px solid #e4e4e4;
                border-radius: 4px;
                display: flex;
                justify-content:center;
                align-items: center;
                height: 36px;
                &.chosed {
                    color: #fff;
                    border: none;
                    background: #0396ff;
                }
            }
            .date_picker {
                width: 40%;
                display: flex;
                padding:0 10px;
                box-sizing: border-box;
                align-items: center;
                height: 36px;
                border: 1px solid #e4e4e4;
                font-size: 12px;
                border-radius: 4px;
                gap: 12px;
            }
            .date_chosed {
                ::v-deep {
                    .uni-date {
                        background: #0396ff;
                        // border: none;
                        border-radius: 4px;
                        .uni-date-editor {
                            // border: none;
                            .uni-date-x--border {
                                border-color: #0396ff !important;
                            }
                            .uni-date-single {
                                 background: #0396ff;
                                 .u-icon--right {
                                    color: #fff;
                                 }
                                 .u-icon__icon {
                                    color: #fff !important;
                                 }
                            }
                            .uni-date__x-input {
                                color: #fff !important;
                            }
                            .uni-date__icon-clear {
                                .u-icon__icon {
                                    color: #fff !important;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .content_box {
        padding: 10px;
        box-sizing: border-box;
        .container {
            width: 100%;
            padding: 20px 10px;
            box-sizing: border-box;
            background-image: linear-gradient(108deg, #abdcff, #0396ff);
            border-radius: 8px;
            display: flex;
            flex-wrap: wrap;
            .cont_item {
                width: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                color: #fff;
                margin-bottom: 20px;
                position: relative;
                .lable {
                    font-size: 14px;
                    text-align: center;
                }
                .value {
                    font-weight: 700;
                    margin-bottom: 4px;
                }
                &:nth-child(2n-1) {
                    &::after {
                        content: "";
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 2px;
                        height: 80%;
                        background: rgba(255,255,255,0.5);
                    }
                }
            }
        }
    }
    .list_box {
        padding: 10px;
        box-sizing: border-box;
        .list_item {
            padding: 10px;
            box-sizing: border-box;
            border-radius: 10px;
            background-image: linear-gradient(180deg, #f3f7fb 0, #e0e9f1);
            margin-bottom: 10px;
            padding-bottom: 20px;
            .top {
                display: flex;
                gap: 20px;
                align-items: center;
                color: #666;
                font-size: 16px;
                font-weight: 700;
                border-bottom: 1px solid #666;
                padding: 10px 0;
                .copy {
                    width: 18px;
                    height: 18px;
                }
            }
            .center_item {
                display: flex;
                justify-content: space-between;
                height: 32px;
                align-items: center;
                .title {
                    color: #555;
                }
                .value {
                    color: #333;
                }
                .other_color {
                    color: #f3d47c;
                }
            }
        }
    }
    .popupStyle {
		.container_box {
			padding: 10px;
            box-sizing: border-box;
			.top_action {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10px 0;
				.cancle {
					color: rgb(144, 145, 147);;
				}
				.sure {
					color:rgb(60, 156, 255);
				}
			}
			.search_box {
				height: 240px;
				overflow-y: scroll;
				margin-top: 10px;
				.search_item {
					height: 44px;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #e4e4e4;
					font-size: 16px;
					color: rgb(144, 145, 147);
					&:first-child {
						border-top: 1px solid #e4e4e4;
					}
				}
				.chosedItem {
					color: #000;
					font-weight: bold;
				}
			}
		}
	}
}
</style>