<template>
    <div class="live-video-container">
        <!-- 视频标题 -->
        <div class="video-title">
            <div class="title-with-icon">
                <img src="/static/game/live_menu.png" alt="hot" class="hot-icon">
                <span class="title-text">GIỚI THIỆU TRÒ CHƠI HOT</span>
            </div>
            <div class="enter-btn" @click="onVideoClick">
                <div class="word">VÀO NGAY</div>
                 <!-- <van-icon name="arrow" size="12" color="#3B7FF8" /> -->
            </div>
        </div>

        <div class="video-wrapper">
            <!-- 音频控制按钮 -->
            <div class="audio-control-btn" @click.stop="toggleAudio">
                 <img src="/static/game/voice.svg" alt="" v-if="audioEnabledOnce"/>
                 <img src="/static/game/voice_off.svg" alt="" v-else/>
            </div>
            
            <!-- 阿里云播放器 -->
            <div class="video-click-wrapper" @click.stop="onVideoClick">
                <!-- <vue-aliplayer-v2 ref="aliPlayer" :source="videoUrl" :options="playerOptions"
                    @ready="onPlayerReady" @play="onPlayerPlay" @pause="onPlayerPause"
                    @ended="onPlayerEnded" @error="onPlayerError" @loadstart="onPlayerLoadStart"
                    @canplay="onPlayerCanPlay" @stop="onPlayerStop" @destroy="onPlayerDestroy"
                    class="ali-player" /> -->
                    <video  autoplay muted :src="videoUrl" ref="player" playsinline webkit-playsinline></video>
            </div>

            <!-- 加载状态 -->
            <!-- <div v-if="isLoading" class="loading-overlay">
                <div class="loading-spinner"></div>
                <span class="loading-text">Đang tải trực tiếp...</span>
            </div> -->

            <!-- 播放提示 -->
            <!-- <div v-if="showPlayPrompt && !hasError" class="play-prompt-overlay">
                <span class="play-prompt-text">Nhấp để phát trực tiếp</span>
                <button class="play-btn" @click="forceAutoPlay">
                    Phát
                </button>
            </div> -->

            <!-- 错误状态 -->
            <!-- <div v-if="hasError" class="error-overlay">
                <span class="error-text">
                    {{ networkStatus === 'offline' ? 'Kết nối mạng thất bại' : 'Tải video thất bại' }}
                </span>
                <span class="error-subtext">
                    {{ networkStatus === 'offline' ? 'Vui lòng kiểm tra kết nối mạng' : 'Vui lòng thử lại sau' }}
                </span>
                <button class="retry-btn" @click="retryVideo" :disabled="networkStatus === 'offline'">
                    {{ networkStatus === 'offline' ? 'Chờ mạng' : 'Thử lại' }}
                </button>
            </div> -->
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { getGameList } from '@/api/game'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
const videoUrl = ref('https://zf895s.motivations.cc/g3/dc08_720.m3u8')
const player:any = ref(null)
const audioEnabledOnce = ref(false)
const isLoading = ref(false)
onMounted(()=>{
    // initVideoPlayer()
    player.value.play()
})
onUnmounted(()=>{
    //  player.value.pause()
})
const toggleAudio = ()=>{
    if(audioEnabledOnce.value) {
        player.value.muted = true
        audioEnabledOnce.value = false
    }else {
        player.value.muted = false
        audioEnabledOnce.value = true
    }
}
const onVideoClick = (event:any)=>{
    event.stopPropagation();
    if(userStore.isLoggedIn) {
        getGameInfo()
    }else {
        router.push({ path: "/auth"})
    }
}
const getGameInfo=()=> {
    let paramas = {
        group_id: 56,
        game_type: 'Live',
        title: "",
        pageIndex: 1,
        pageSize: 10
    }
    getGameList({ ...paramas }).then(res => {
        const item = res.rows.find(item => item.game_name === 'Cq9');
        router.push({
            name: 'Game',
            query: {
                game_name: item.game_name,
                game_code: item.game_code,
                game_list_id: item.game_list_id,
                title: item.title
            }
        })
    }).catch(error => {
        console.error('获取游戏信息失败:', error);
        
    })
}
</script>
<style lang="less" scoped>
.live-video-container {
    width: 100%;
    margin-bottom: 10px;
    .video-title {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 5px;

        .title-with-icon {
            display: flex;
            align-items: center;
            gap: 6px;

            .hot-icon {
                width: 18px;
                height: 18px;
                animation: live__light 2s linear infinite;
            }
            @keyframes live__light {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                35% {
                    transform: scale(1.2);
                    opacity: 1;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            .title-text {
                font-size: 12px;
                font-weight: 700;
                color: #333333;
                // background: linear-gradient(45deg, #ff6b6b, #ffa500, #ffd700);
                // -webkit-background-clip: text;
                // -webkit-text-fill-color: transparent;
                // background-clip: text;
                // text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                // letter-spacing: 0.5px;
            }
        }

        @keyframes fire-flicker {

            0%,
            100% {
                transform: scale(1) rotate(0deg);
                filter: drop-shadow(0 2px 4px rgba(255, 107, 107, 0.5));
            }

            25% {
                transform: scale(1.05) rotate(2deg);
                filter: drop-shadow(0 3px 6px rgba(255, 107, 107, 0.7));
            }

            50% {
                transform: scale(0.95) rotate(-1deg);
                filter: drop-shadow(0 1px 3px rgba(255, 107, 107, 0.3));
            }

            75% {
                transform: scale(1.02) rotate(1deg);
                filter: drop-shadow(0 2px 5px rgba(255, 107, 107, 0.6));
            }
        }

        .enter-btn {
            // width: 74px;
            padding: 0 4px;
            height: 28px;
            border-radius: 20px;
            background:  #3B7FF8;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            .word {
                line-height: 28px;
                font-size: 12px;
            }
        }
    }

    .video-wrapper {
        position: relative;
        width: 100%;
        height: 120px;
        /* 降低视频高度 */
        border-radius: 8px;
        overflow: hidden;
        background: #000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    /* 音频控制按钮 */
    .audio-control-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 36px;
        height: 36px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 15;
        transition: all 0.3s ease;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        img {
            width: 20px;
            height: 20px;
        }
        &:hover {
            background: rgba(0, 0, 0, 0.8);
            transform: scale(1.1);
        }

        &:active {
            transform: scale(0.95);
        }
    }

    .video-click-wrapper {
        width: 100%;
        height: 100%;
        cursor: pointer;
        position: relative;
        pointer-events: auto; // 允许点击事件

        &:hover {
            opacity: 0.9;
        }

        &:active {
            opacity: 0.8;
        }

        // 禁用播放器内部的点击事件
        ::v-deep .prism-player {
            pointer-events: none !important;
        }

        ::v-deep video {
            pointer-events: none !important;
        }
    }

    /* 阿里云播放器样式 */
    .ali-player {
        width: 100% !important;
        height: 100% !important;
        border-radius: 8px;
        overflow: hidden;


        ::v-deep .prism-player {
            border-radius: 8px;
        }

        ::v-deep .prism-big-play-btn {
            display: none !important;
            /* 隐藏播放按钮 */
        }

        ::v-deep .prism-controlbar {
            display: none !important;
            /* 隐藏控制栏 */
        }

        ::v-deep .prism-loading {
            display: none !important;
            /* 隐藏加载动画 */
        }

        ::v-deep .prism-logo {
            display: none !important;
            /* 隐藏logo */
        }

        ::v-deep .prism-error {
            display: none !important;
            /* 隐藏错误提示 */
        }
    }

    .loading-overlay,
    .error-overlay,
    .play-prompt-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        z-index: 10;
    }

    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-top: 3px solid #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
    }

    .loading-text,
    .error-text {
        font-size: 14px;
        text-align: center;
        margin-bottom: 10px;
    }

    .error-subtext {
        font-size: 12px;
        text-align: center;
        margin-bottom: 15px;
        opacity: 0.8;
    }

    .retry-btn,
    .fallback-btn,
    .play-btn {
        background: #007aff;
        color: #fff;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin: 0 5px;

        &:hover:not(:disabled) {
            background: #0056cc;
        }

        &:disabled {
            background: #666;
            cursor: not-allowed;
            opacity: 0.6;
        }
    }

    .fallback-btn {
        background: #28a745;

        &:hover:not(:disabled) {
            background: #1e7e34;
        }
    }

    .play-btn {
        background: #28a745;
        font-size: 16px;
        padding: 12px 24px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 80px;

        &:hover:not(:disabled) {
            background: #1e7e34;
            transform: scale(1.05);
        }

        &:active {
            transform: scale(0.95);
        }
    }

    .play-prompt-text {
        font-size: 16px;
        text-align: center;
        margin-bottom: 15px;
        font-weight: 500;
        color: #fff;
    }

    .play-prompt-overlay {
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        text-align: center !important;
    }
}
</style>