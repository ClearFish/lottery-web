<template>
    <div class="big_box">
        <div class="pie">
            <div class="slice" 
                :class="{anislice:index == stepIndex}"
                v-for="(item,index) in PRIZELIST" 
                :key="index"
                :style="{ backgroundColor: item.bgColor,
                        color: item.color,
                        transform: `rotate(${index * 45}deg) skewY(-45deg)`}"
            >
                <div class="content">
                    <img v-if="item.imageId" :src="item.imageId" alt=""/>
                    <p class="title" v-if="item.number" :style="{color:item.color}">{{item.number}}</p>
                </div>
            </div>
        </div>
        <div class="center_bg" @click="handleStart" v-if="!showAddNum">
            <p class="title">{{$t('turnable.DRAW')}}</p>
            <p>{{turnCounts}} {{$t('turnable.left')}}</p>
        </div>
        <div class="center_bg"  v-else>
            <p>+{{addNum}}</p>
        </div>
        <div class="bottom_box"></div>
        <div class="bg_box"></div>
        <div class="pointer_box"></div>
        <img src="@/assets/turnable/game2_light.png" alt="" class="light1">
        <img src="@/assets/turnable/game2_caishen.png" alt="" class="caishen">
    </div>
</template>
<script lang="ts" setup >
import {ref,onMounted,defineEmits} from "vue"
import { $t } from '@/locales'
import gift1 from "@/assets/turnable/game2_1.png"
import gift2 from "@/assets/turnable/game2_coin.png"
import { showToast, showDialog } from 'vant'
import LuckyWheel from './luck.js';
import {promotionsList,promotionsReceive} from '@/api/promotions'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
const PRIZELIST:any = ref([
    { bgColor: '#006D00', color: '#FFF', imageId: '',number:"10k" },
    { bgColor: '#EFF0D1', color: '#000000', imageId: '',number:"50k" },
    { bgColor: '#006D00', color: '#FFF', imageId: '',number:"300k" },
    { bgColor: '#EFF0D1', color: '#000000', imageId: '',number:"500k" },
    { bgColor: '#006D00', color: '#FFF', imageId: gift1 },
    { bgColor: '#EFF0D1', color: '#000000', imageId: '',number:"1,500k" },
    { bgColor: '#006D00', color: '#FFF', imageId: '',number:"3,000k" },
    { bgColor: '#EFF0D1', color: '#000000', imageId:'',number:"9,999k"},
])
const luckyWheelRef:any = ref(null)
const lists = ref([])
const turnCounts = ref(0)
const noStart = ref(false)
const chanceLists = ref([])
const hasFinished = ref([])
const showAnimation = ref(false)
const stepIndex :any= ref(null)
const choseItem:any = ref({})
const showAddNum:any = ref(false)
const addNum:any = ref(0)
const emit = defineEmits(['openDialog','nowTasks'])
onMounted(()=>{
    getData()
    luckyWheelRef.value =  new LuckyWheel({
        selector: '.pie',
        segsLen: PRIZELIST.value.length,
        onFinished: (index) => {
            console.log(index)
            stepIndex.value = index;
            showAddNum.value = true
            setTimeout(()=>{
                stepIndex.value = null;
                showAddNum.value = false;
                emit('openDialog',choseItem.value);
                cacluteRes()
            },1500)
        },
    });
})
const handleStart=()=> {
    if(!userStore.isLoggedIn) {
        showToast($t('invite.Please_Login_First'))
        setTimeout(()=>{
            router.push({ path: "/auth",query:{mode:'login'} })
        },2000)
    }else if(turnCounts.value == 0) {
        // uni.showToast({
        //     icon:'none',
        //     title:this.$t('There are currently no rotatable times')
        // })
        showToast($t('invite.There_are_currently_no_rotatable_times'))
    }else {
        if(!userStore.userInfo.is_mobile) {
            // this.showAuthen = true
            showDialog({
                title: $t('profile.mobilevertify'),
                message: $t('turnable.Please_verify_your_phone_number_first'),
                confirmButtonText: $t('common.confirm'),
                cancelButtonText: $t('common.cancel')
            }).then(() => {
                try {
                    // 跳转到登录页面
                    router.push({ name: 'Settings' })
                } catch (error) {
                    console.error('取消认证:', error)
                    
                }
            }).catch(() => {
                // 用户取消退出
            })
        }else {
            luckyWheelRef.value.play();
            turnCounts.value --;
            setTimeout(()=>{
                handleEnd()
            },5000)
        }
    }
}
const handleEnd = ()=> {
    let stopIndex = PRIZELIST.value.findIndex(item=>item.number == Number(choseItem.value.bonus));
    console.log(stopIndex,"1")
    let step;
    if(stopIndex != -1) {
            step = stopIndex;
    }else {
        step = 4
    }
    luckyWheelRef.value.stop(step); 
}
const getData=()=>{
    promotionsList({group_id:20}).then((res:any)=>{
        let lists = res.rows.reverse();
        let chanceLists = lists.map(item=>{
            if(item.completed>= item.schedule && !item.receive) {
                return item
            }
        })
        // console.log(chanceLists,lists,"1")
        let nowTaks = lists.find(item=>!item.receive && item.completed < item.schedule)
        emit('nowTasks',nowTaks)
        chanceLists.value = chanceLists.filter(item=>item);
        if(chanceLists.value && chanceLists.value.length) {
            choseItem.value = chanceLists.value[0];
            addNum.value = choseItem.value.addBonous
        }else {
            choseItem.value = {};
            addNum.value = 0;
        }
        turnCounts.value = chanceLists.filter(item=>item).length
    })
}
const cacluteRes=()=> {
    promotionsReceive({id:choseItem.value.id}).then(res=>{
         getData();
    })
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
</style>
<style lang="less" scoped>
.big_box {
  width: 278px;
  height: 278px;
  text-align: center;
  margin: 30px auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
//   padding-top: 60px;
  margin-top: 0;
  box-sizing: border-box;
    // 扇形布局核心样式
  .pie {
    width: 254px;
    height: 254px;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    transform: rotate(0deg);
    z-index: 2;
    .slice {
      overflow: hidden;
      position: absolute;
      top: 0;
      right: 0;
      width: 50%;
      height: 50%;
      // css 画扇形 https://www.jianshu.com/p/3ab7e71ff810
      transform-origin: 0% 100%;
      text-align: left;
      display: flex;
      .content {
        // transform-origin: 0% 100%;
        // skew 效果反转 https://www.v2ex.com/t/394630
        // transform: skewY(45deg) rotate(-45deg);
        transform: skewY(45deg) rotate(-69deg);
        width: 100%;
        position: absolute;
        left: -32px;
        bottom: 42px;
        text-align: center;
        padding-right: 15px;
        box-sizing: border-box;
        font-weight: bolder;
        font-size: 14px;
        img {
          width: 30px;
          height: auto;
          margin-top: 20px;
          margin-left: 20px;
        }
      }
        
    }
    .anislice {
        // background-color: #000 !important;
        animation: show 1s linear infinite;
        .title {
            color: #C9B27C !important;
        }

    }
  }
  .center_bg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      background: url("@/assets/turnable/game2_draw.png") no-repeat center;
      background-size: 100% 100%;
      width: 84px;
      height: 84px;
      z-index: 5;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .title {
        color: #6B2409;
        font-family: Archive;
        font-size: 16px;
        font-weight: 600;
      }
      p {
        color: #6B2409;
        font-size: 14px;
        font-weight: 500;
      }
    }
    .bottom_box {
        width: 142px;
        height: 117px;
        background:url("@/assets/turnable/pie_bottom.png") no-repeat center;
        background-size: 100% 100%;
        position: absolute;
        bottom: -75px;
        left: 50%;
        transform: translateX(-50%);
    }
  .bg_box {
    width: 100%;
    height: 100%;
    background: url("@/assets/turnable/game2_bg.png") no-repeat center;
    background-size: 100% 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .pointer_box {
    position: absolute;
    left: 50%;
    background: url("@/assets/turnable/game2_point.png") no-repeat center;
    background-size: 100% 100%;
    transform: translateX(-50%);
    width: 15px;
    height: 34px;
    z-index: 4;
    top: 0;
  }
  .roate_box {
    width: 456px;
    height: 456px;
    position: absolute;
    left: 50%;
    top: 0;
    background: url("@/assets/turnable/spinBg.png") no-repeat center;
    background-size: 100% 100%;
    animation: drawBgImg 20s linear infinite;
  }
  @keyframes drawBgImg {
    0% {
        transform:translateX(-50%) rotate(0);
    }
    100% {
        transform:translateX(-50%) rotate(1turn);
    }
  }
  .light1 {
    position: absolute;
    width: 244px;
    height: 244px;
    z-index: 3;
    animation: buling 0.5s linear infinite;
  }
  .light2 {
    position: absolute;
    width: 278px;
    height: 278px;
    z-index: 3;
    // transform: rotateZ(14deg);
  }
  @keyframes buling {
    0% {
        opacity: 0.2;
    }
    100% {
        opacity: 1;
    }
  }
  @keyframes show {
     0% {
        background-color: #000;
    }
    100% {
        background-color: #EFF0D1;
    }
  }
  .caishen {
    position: absolute;
    z-index: 3;
    left: 50%;
    transform: translateX(-50%);
    bottom:-90px;
    width: 375px;
    height: auto;
  }
  ::v-deep {
    .authen_box {
        flex: none;
    }
  }
}
</style>