<template>
    <div class="first_box">
        <div class="tabs_list">
            <div class="tabs_container">
                <div class="tab_item" v-for="(item,index) in tabs" 
                    @click="choseTab(item,index)" :key="index" :class="chosedId == item.id?'active_item' :''">
                    <div class="label">{{item.title}}</div>
                </div>
            </div>
        </div>
        <div class="list_box">
            <div class="list_item" v-for="(item,index) in depositList" :key="index">
                <div class="top_item">
                    <div class="left_top">
                        <div class="value">{{item.title}}</div>
                    </div>
                    <div class="right_top" v-if="item.bonus_text.indexOf('%') == -1">+{{numberFormat(item.bonus_text)}} {{item.symbo}}</div>
                    <div class="right_top" v-else>{{item.bonus_text}}</div>
                </div>
                <p v-html="item.synopsis" class="center_word"/>
                <div class="bottom_con">
                    <div class="left_bottom">
                        <div class="number">{{item.completed}}/{{item.schedule}}</div>
                        <div class="progress">
                            <div class="progress_now" :style="{width:(item.completed/item.schedule)*100+'%'}"></div>
                        </div>
                    </div>
                    <div class="right_bottom" v-if="item.completed>=item.schedule">
                        <div v-if="item.receive" class="btn received">{{$t('promotionactivity.RECEIVED')}}</div>
                        <div v-else class="btn right_1" @click="receiveBonous(item)">{{$t('promotionactivity.Get_Now')}}</div>
                    </div>
                        <div class="right_bottom" v-else>
                        <div class="btn" @click="toDeposit">{{$t("promotionactivity.mine_card_btn2")}}</div>
                        </div>
                </div>
            </div>
        </div>
        <div class="rules_box">
            <div class="title">{{$t('promotionactivity.Activity_Rules')}}</div>
            <div class="rule_content first_child">{{$t('promotionactivity.first_deposit_rules1')}}</div>
            <div class="rule_content">{{$t('promotionactivity.first_deposit_rules2')}}</div>
            <div class="rule_content">{{$t('promotionactivity.first_deposit_rules3')}}</div>
            <div class="rule_content">{{$t('promotionactivity.first_deposit_rules4')}}</div>
            <div class="rule_content">{{$t('promotionactivity.first_deposit_rules5')}}</div>
            <div class="rule_content">{{$t('promotionactivity.first_deposit_rules6')}}</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { promotionsList,promotionsReceive } from '@/api/promotions'
import {ref,onMounted,nextTick,computed} from "vue"
import { getSite } from '@/api/slide'
import { $t } from '@/locales'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import {useSiteStore} from "@/store/modules/site"
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const {siteInfo} = useSiteStore()
const router = useRouter()


const depositList:any = ref([]);
const bonousList:any = ref(
    [
        {
            currency:'SYSTEM',
            symbo:'VND'
        },
        {
            currency:'USDT',
            symbo:'USDT'
        }
    ]
)
const tabs:any = ref(
    [
        {title:$t('promotionactivity.First_Deposit'),id:''},
        {title:$t('promotionactivity.Second_Deposit'),id:''},
        {title:$t('promotionactivity.Third_Deposit'),id:''},
    ]
)
const chosedId:any = ref(0)
const numberFormat=(number:any)=> {
    if(number%1000 == 0) {
        // 能被1000整除转为K
        return (number/1000).toLocaleString()+'K'
    }else{
        return number.toLocaleString()
    }
}
const choseTab=(item:any,index:any)=>{
    chosedId.value = item.id;
    getList(item.id)
}
const getList = async(id:any)=> {
    let res:any = await promotionsList({group_id:id});
    depositList.value = res?.rows.reverse().map(item=>{
        let symbalObj = bonousList.value.find(ite=>ite.currency == item.currency);
        item.symbo = symbalObj.symbo;
        return item
    })
}
const receiveBonous=async(item:any)=> {
    let bonousInfo = bonousList.value.find(ite=>ite.currency == item.currency);
    item.symbo = bonousInfo.symbo;
    try{
      await promotionsReceive({id:item.id});
      showToast($t('promotionactivity.Successfully_received')+ numberFormat(item.bonus) + item.symbo)
    }catch(error) {
        showToast(error.msg)
    }finally{
        getList(chosedId.value)
    }
}
const toDeposit=()=> {
    if(userStore.isLoggedIn && !userStore.userInfo) {
        router.push({ path: "/auth",query:{mode:'register'} })
    }else {
        router.push({ path: "/profile/deposit"})
    }
}
const getSites = async()=>{
    let res = await getSite();
    let activity_group_id = res.activity_group_id;
    if(activity_group_id.indexOf('=') == -1) {
        let lists = activity_group_id.split(',');
        chosedId.value = lists[0]
        tabs.value.map((item,index)=>item.id = lists[index])
        tabs.value = tabs.value.filter(item=>item.id)
        getList(lists[0])
    }else {
        let lists = activity_group_id.split(',');
        let arr = []
        lists.map((item:any)=>{
            let obj:any = {};
            obj.title = item.split('=')[0];
            obj.id = item.split('=')[1];
            arr.push(obj)
        })
        tabs.value = arr;
        chosedId.value = tabs.value[0].id;
        getList(chosedId.value)
    }
}
onMounted(()=>{
    getSites()
})
</script>
<style lang="less" scoped>
.first_box {
    background:linear-gradient(90deg, #EEFBFF 0%, #C3F0FF 100%);
    min-height: 100vh;
    padding-bottom: 20px;
    .tabs_list {
        width: 100%;
        height: 36px;
        display: flex;
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        padding: 0 10px;
        box-sizing: border-box;
        .tabs_container{
            width: 100%;
            display: flex;
            overflow-x: auto;
            gap: 16px;
        }
        .tab_item {
            flex: 1;
            display: flex;
            flex-shrink: 0;
            justify-content: center;
            align-items: center;
            color:#999999;
            font-size: 14px;
        }
        .active_item{
            color: #58B8FD ;
            border-bottom: 2px solid #58B8FD ;
        }
    }
    .list_box {
        padding: 10px;
        box-sizing: border-box;
        .list_item {
            width: 100%;
            padding: 10px 8px;
            box-sizing: border-box;
            background: #fff;
            border-radius: 8px;
            margin-bottom: 10px;
            .top_item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .left_top {
                    display: flex;
                    align-items: center;
                    .label {
                        font-weight: 500;
                        font-size: 13px;
                        color: #333333;
                    }
                    .value {
                        font-weight: 900;
                        font-size: 14px;
                        margin-left: 3px;
                        color: #58B8FD;
                    }
                }
                .right_top {
                    font-weight: 900;
                    font-size: 13px;
                    color: #FF5254;
                }
            }
            .center_word {
                margin-top: 8px;
                font-weight: 400;
                font-size: 12px;
                color: #999999;
                line-height: 14px;
            }
            .bottom_con {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 10px;
                gap: 15px;
                .left_bottom {
                    flex: 1;
                    .number {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        font-weight: 400;
                        font-size: 12px;
                        color: #666666;
                    }
                    .progress {
                        width: 100%;
                        height: 10px;
                        background: #E8E8E8;
                        border-radius: 5px;
                        margin-top: 4px;
                        .progress_now {
                            background: #58B8FD;
                            border-radius: 5px;
                            height: 100%;
                        }
                    }
                }
                .right_bottom {
                    width: 70px;
                    height: 26px;
                    .btn {
                        width: 100%;
                        height: 100%;
                        border-radius: 4px;
                        border: 1px solid #58B8FD;
                        font-weight: 400;
                        font-size: 13px;
                        color: #58B8FD;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .received {
                        background: #DFF7FF;
                        color: #58B8FD;
                    }
                    .right_1 {
                        background: #58B8FD;
                        color: #fff;
                    }
                }
            }
        }
    }
    .rules_box {
        width: calc(100% - 20px);
        border-radius: 4px;
        margin: 0 auto;
        margin-top: 20px;
        padding: 10px;
        box-sizing: border-box;
        border: 2px solid #60C5F8;
        position: relative;
        .title {
            position: relative;
            display: flex;
            justify-content: center;
            z-index: 2;
            // margin-bottom: 20px;
            height: 39px;
            width: 262px;
            background: url("@/assets/promotions/dialog_title.svg") no-repeat center;
            border-radius: 16px 16px 0 0;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: -17px;
            text-align: center;
            line-height: 32px;
            color: #fff;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .rule_content {
            margin-bottom: 16px;
            color: #666;
            font-size: 14px;
            padding-left: 20px;
            box-sizing: border-box;
            position: relative;
            &::before {
                content: "";
                width: 8px;
                height: 8px;
                background: linear-gradient(135deg,#58B8FD , #58B8FD );
                position: absolute;
                top: 4px;
                left: 5px;
                transform: rotate(45deg);
            }
        }
        .first_child {
            margin-top: 20px;
        }
    }
}
</style>