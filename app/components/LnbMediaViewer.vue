<script setup lang="ts">
import {MediaType} from "~/composables/messagesApi";
import {useUtils} from "~/composables/utils";

const { getImageUrl } = useUtils()
const { state, closeMedia, changeOpenedMediaIndex } = useBoard()
const currentMediaElement = computed(() => state.value.openedMedia[state.value.openedMediaIndex])
const currentMediaElementFile = computed(() => currentMediaElement.value?.originalFileId ?? currentMediaElement.value?.previewFileId)

</script>

<template>
  <!-- MEDIA VIEWER -->
  <transition name="fade">
    <div class="media-viewer" v-if="state.openedMedia.length > 0" @click.self="closeMedia">
      <div>
        <div class="media-viewer-counter">{{state.openedMediaIndex + 1}} / {{state.openedMedia.length}}</div>
        <div class="media-viewer-close" @click="closeMedia">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l10 10M13 3L3 13"/></svg>
        </div>
      </div>
      <div class="media-viewer-content">
        <template v-if="currentMediaElementFile">
          <img
            v-if="currentMediaElement!.type === MediaType.Image"
            :src="getImageUrl(currentMediaElementFile)"/>
          <video
            v-else
            :src="getImageUrl(currentMediaElementFile)"
            controls
            autoplay
            playsinline>
          </video>
        </template>
      </div>
      <div class="media-viewer-prev"
           v-if="state.openedMediaIndex > 0"
           @click="changeOpenedMediaIndex(state.openedMediaIndex - 1)">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 3L5 8l5 5"/></svg>
      </div>
      <div class="media-viewer-next"
           v-if="state.openedMediaIndex < state.openedMedia.length - 1"
           @click="changeOpenedMediaIndex(state.openedMediaIndex + 1)">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3l5 5-5 5"/></svg>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* MEDIA VIEWER */
.media-viewer{position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:200;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left)}
.media-viewer-close{position:absolute;top:calc(40px + var(--safe-top));right:calc(10px + var(--safe-right));width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff}
.media-viewer-close svg{width:16px;height:16px}
.media-viewer-counter{position:absolute;top:calc(50px + var(--safe-top));left:50%;transform:translateX(-50%);font-size:12px;color:rgba(255,255,255,0.7);font-family:'JetBrains Mono',monospace}
.media-viewer-content{max-width:100%;max-height:100%;display:flex;align-items:center;justify-content:center}
.media-viewer-content img{max-width:100vw;max-height:85dvh;object-fit:contain;border-radius:4px}
.media-viewer-content video{max-width:100vw;max-height:85dvh;border-radius:4px}
.media-viewer-prev,.media-viewer-next{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff}
.media-viewer-prev{left:calc(12px + var(--safe-left))}
.media-viewer-next{right:calc(12px + var(--safe-right))}
.media-viewer-prev svg,.media-viewer-next svg{width:16px;height:16px}
</style>