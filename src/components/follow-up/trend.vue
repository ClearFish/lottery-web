<template>
  <div class="lottery_box" v-if="show">
    <div class="followup_container">
        <div class="top_header">
            <div class="empty"></div>
            <div class="word">Win go ( {{ gameTypes[currentTime].label }} {{ $t("lottery.minute")}} )</div>
            <div class="icon"> 
                <van-icon name="cross" size="18" @click="closeHistory" class="close" color="#333"></van-icon>
            </div>
        </div>
        <div class="container">
            <div class="container_c">
                <div class="explain_box">
                    <div class="top_filter">
                        <div class="label">{{ $t('lottery.Big') }}:</div>
                        <div class="value big">B</div>
                    </div>  
                    <div class="top_filter">
                        <div class="label">{{ $t('lottery.Small') }}:</div>
                        <div class="value small">S</div>
                    </div>    
                </div>
                <div class="canvans_box">
                    <canvas ref="myCanvas2"  :style="{width: '304px', height: '150px'}" type="2d"></canvas >
                </div>
            </div>
        </div>
         <van-overlay
            :show="showLoading"
            :opacity="0.6"
            class-name="flex-rcc"
			z-index="99999999"
            >
            <van-loading color="#3498db"></van-loading>
        </van-overlay>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { resultRecord } from "@/api/lottery";
import { $t } from '@/locales'
import { ref,nextTick} from "vue"
const props = defineProps({
	currentTime:{
        default: () => {
            return '';
        }
    }
})
const gameTypes = ref(
    [
        { value: 1, label: "1" },
        { value: 3, label: "3" },
        { value: 5, label: "5" },
        { value: 10, label: "10" },
    ]
)
const show = ref(false)
const ctx = ref(null)
const renderVal:any = ref([])
const satVal:any = ref([])
const arrs:any = ref([])
const ctx2 = ref(null)
const renderVal2:any = ([])
const satVal2:any = ref([])
const showOdd = ref(false)
const showLoading = ref(false)
const myCanvas2 = ref(null)

const showTrend = async(gameId)=> {
    show.value = true
    nextTick(()=>{
        ctx2.value = myCanvas2.value.getContext('2d')
        initData(gameId)
    })
}
const initData=(gameId:any)=> {
    showLoading.value = true
    var newArr = [];
    resultRecord({game_id:gameId,pageIndex:1,pageSize:100}).then(res=>{
        arrs.value = res.rows
        
        let arrVal = res.rows.map(item=>{
            return item.result[0]
        })
        for(var i = 0;i<arrVal.length;i++) {
            if(i == 0) {
                newArr.push([arrVal[0]])
            }else {
                if(newArr[newArr.length-1][0] == arrVal[i]) {
                    newArr[newArr.length-1].push(arrVal[i])
                }else {
                    newArr.push([arrVal[i]])
                }
            }
        }
            console.log(newArr,"newArrnewArr")
        renderVal.value = newArr.slice(0,13).reverse();
        // initArr(2)
        // init(2);
        // initData2()
        setTimeout(()=>{
            initData2();
            showOdd.value = true;
            showLoading.value = false
        },1000)
    })
}
const initArr=(type:any)=> {
    var sat =[]
    var ctx = type == 1 ? ctx.value : ctx2.value;
    for (var i = 0; i < 15; i++) {
        ctx.moveTo(i*20+0.5, 0);
        ctx.lineTo(i*20+0.5, 120);
        for (var j = 0; j < 6; j++) {
            ctx.moveTo(0, j*20+0.5);
            ctx.lineTo(300, j*20+0.5);
            var obj = {
                copuied : false,
                seat:[]
            }
            obj.seat.push([i,j])
            sat.push(obj)
        }
    }
    ctx.moveTo(300+0.5, 0);
    ctx.lineTo(300+0.5, 120);
    ctx.moveTo(0, 120+0.5);
    ctx.lineTo(300, 120+0.5);
    ctx.lineWidth=1;
    ctx.strokeStyle="#c3c3c3";
    ctx.stroke();
    satVal.value = sat;
}
const init=(type:any)=> {
    console.log(type,"typeeee")
    let initArr = type == 1 ? renderVal.value : renderVal2.value;
    let moreRow = initArr.findIndex((item:any)=>item.length>6);
    let sats = satVal.value
    if(moreRow != -1) {
        let lessEight = initArr.slice(0,moreRow);
        let moreEight = initArr.slice(moreRow);
        console.log(lessEight,moreEight,"more")
        for(var i = 0;i<lessEight.length;i++) {
            if(lessEight[i].length == 1) {
                if(type == 1) {
                    renderCanvas(i,0,lessEight[i][0])
                }else {
                    renderCanvas2(i,0,lessEight[i][0])
                }
            }else {
                for(var j = 0;j<lessEight[i].length;j++) {
                    if(type ==1) {
                        renderCanvas(i,j,lessEight[i][0])
                    }else {
                        renderCanvas2(i,j,lessEight[i][0]);
                    }
                }
            }
        }
        for(var i = 0;i<moreEight.length;i++) {
            if(i == 0) {
                for(var j = 0;j<moreEight[0].length;j++) {
                    var num = j-5
                    var x = j > 5 ? moreRow + num : moreRow;
                    var y = j > 5 ? 5:j
                    if(type ==1) {
                        renderCanvas(x,y,moreEight[0][0])
                    }else {
                        renderCanvas2(x,y,moreEight[0][0]);
                    }
                    const cupiedIndex = sats.findIndex((item:any)=>item.seat.toString() == [x,y].toString());
                    if(cupiedIndex != -1) {
                        sats[cupiedIndex].copuied = true
                    }
                }
            }else {
                var x = moreRow + i;
                for(var j = 0;j<moreEight[i].length;j++) {
                    var length = moreEight[i].length
                    var y = j;
                    const cupiedIndex = sats.findIndex((item:any)=>item.seat.toString() == [x,y].toString());
                    if(sats[cupiedIndex] && sats[cupiedIndex].copuied) {
                        // console.log(x,y,"[[==]]",length,x);
                        var firstX = x+1;
                        var firstY = y-1;
                        var moreNum = length - y;
                        console.log(moreNum)
                        for(var k = 0;k<moreNum;k++) {
                            if(type ==1) {
                                renderCanvas(firstX+k > 14 ? 14 : firstX+k ,firstY,moreEight[i][0])
                            }else {
                                renderCanvas2(firstX+k > 14 ? 14 : firstX+k ,firstY,moreEight[i][0]);
                            }
                            var findindex = sats.findIndex((item:any)=>item.seat.toString() == [firstX+k > 14 ? 14: firstX+k,firstY].toString());
                            sats[findindex].copuied = true
                        }         
                        break;
                    }else {
                        var findindex = sats.findIndex((item:any)=>item.seat.toString() == [x,y].toString());
                        if(findindex == -1) {
                            var y = 5;
                            var moreNum = length - y;
                            console.log(x,y,moreNum,"000")
                            for(var k = 0;k<moreNum;k++) {
                                if(type ==1) {
                                    renderCanvas(x+k>14?14:x+k,5,moreEight[i][0])
                                }else {
                                    renderCanvas2(x+k>14?14:x+k,5,moreEight[i][0]);
                                }
                                var findindex = sats.findIndex((item:any)=>item.seat.toString() == [x+k>14?14:x+k,5].toString());
                                sats[findindex].copuied = true
                            }  
                        }else {
                            if(type ==1) {
                                renderCanvas(x,y,moreEight[i][0])
                            }else {
                                renderCanvas2(x,y,moreEight[i][0])
                            }
                            sats[findindex].copuied = true
                        }
                    }
                }
            }
        }
    }else {
        for(var i = 0;i<initArr.length;i++) {
            if(initArr[i].length == 1) {
                if(type ==1) {
                    renderCanvas(i,0,initArr[i][0])
                }else {
                    renderCanvas2(i,0,initArr[i][0])
                }
                
            }else {
                for(var j = 0;j<initArr[i].length;j++) {
                    if(type ==1) {
                        renderCanvas(i,j,initArr[i][0]);
                    }else {
                        renderCanvas2(i,j,initArr[i][0]);
                    }
                }
            }
        }
    }
}
const renderCanvas=(x:any,y:any,number:any)=>{
    const gcolor = '#5cba47'
    const rcolor = '#fb4e4e'
    const mcolor = "#eb43dd"
    let nummberColor = ''
    if(['1','3','7','9'].includes(number)) {
        nummberColor = gcolor
    }else if(['2','4','6','8'].includes(number)) {
        nummberColor = rcolor
    }
    const w = 20;
    if(number == '0' || number == '5') {
        // 上半圆
        ctx.value.beginPath();
        var a = 10+20*x;
        var b = 10+20*y;
        ctx.value.arc(10+20*x,10+20*y, 10, 0.75*Math.PI, 1.75*Math.PI);
        ctx.value.fillStyle = number == '0' ? rcolor : gcolor
        ctx.value.fill();

        // 下半圆
        ctx.value.beginPath();
        var a = 10+20*x;
        var b = 10+20*y;
        ctx.value.arc(10+20*x,10+20*y, 10, 1.75*Math.PI, 0.75*Math.PI);
        ctx.value.fillStyle = mcolor
        ctx.value.fill();
        
    }else {
        ctx.value.beginPath();
        ctx.value.fillStyle = nummberColor;
        ctx.value.arc(10+20*x,10+20*y, 10, 0, 2 * Math.PI);
        ctx.value.fill();
        
    }

    // 绘制文字
    ctx.value.font = "12px Arial"
    ctx.value.fillStyle = '#fff'
    ctx.value.textAlign = "center"
    ctx.value.fillText(number, 10+20*x,10+20*y);
    
}
const initData2=()=> {
    var newArr = [];
    var sortArr = []
    let arrVal = arrs.value.map((item:any)=>{
        return item.result[0]>4?'B':'S'
    })
    for(var i = 0;i<arrVal.length;i++) {
        if(i == 0) {
            newArr.push([arrVal[0]])
        }else {
            if(newArr[newArr.length-1][0] == arrVal[i]) {
                newArr[newArr.length-1].push(arrVal[i])
            }else {
                newArr.push([arrVal[i]])
            }
        }
    }
    renderVal2.value = newArr.slice(0,13).reverse();
    console.log(renderVal2.value,"renderVal2.value")
    initArr(2)
    init(2);
    // ctx2.value.draw()
}
const renderCanvas2=(x:any,y:any,number:any)=> {
    const gcolor = '#5cba47'
    const rcolor = '#ffc511'
    let nummberColor = number == 'B' ? rcolor : gcolor
    const w = 18;
    ctx2.value.beginPath();
    ctx2.value.fillStyle = nummberColor;
    ctx2.value.arc(10+20*x,10+20*y, 8, 0, 2 * Math.PI);
    ctx2.value.fill();

    // 绘制文字
    ctx2.value.font = "12px Arial"
    ctx2.value.fillStyle = '#fff'
    ctx2.value.textAlign = "center"
    ctx2.value.fillText(number, 10+20*x,15+20*y);
}
const closeHistory=()=> {
    show.value = false;
}
defineExpose({
    showTrend
})
</script>
<style lang="less" scoped>
.flex-rcc{
  display: flex;
  align-items: center;
  justify-content: center;
}
.lottery_box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 999990;
  .followup_container {
    width: 96%;
    max-width: 480px;
    padding:20px 8px;
    background: linear-gradient(180deg, #FCFDFF 0%, #E4EDFE 53%, #F4F7FE 100%);
    border-radius: 8px;
    // border: 1px solid #f0cc6d;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-height: 190px;
    z-index: 10001;
    .container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        .container_c {
            .explain_box {
                display: flex;
                justify-content: flex-end;
                color: #333333;
                font-size: 12px;
                gap: 10px;
                margin-bottom: 5px;
                .top_filter {
                    display: flex;
                    align-items: center;
                    gap:4px;
                    .value {
                        width: 20px;
                        height: 20px;
                        display: flex;
                        line-height: 20px;
                        text-align: center;
                        justify-content: center;
                        align-items: center;
                        border-radius: 10px;
                        color: #fff;
                    }
                    .big {
                        background: #ffc511;
                    }
                    .small {
                       background: #5cba47; 
                    }
                    .odd {
                        background: #EF233B;
                    }
                    .even {
                        background: #418DFC;
                    }
                }
            }
            .canvans_box {
                padding: 8px;
                border-radius: 6px;
                background: #fff;
                box-shadow: 0 4px 12px rgba(88, 184, 253, 0.3);
            }
        }
    }
    .top_header {
      display: flex;
      justify-content: space-between;
      color: #333333;
      font-weight: 600;
      margin-bottom: 16px;
      .icon {
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>