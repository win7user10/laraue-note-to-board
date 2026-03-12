<script setup lang="ts">

import {useAppState} from "~/composables/appState";
import {onMounted, ref} from "vue";
import WebApp from "@twa-dev/sdk";

const { setDragStateCardId, setDragStateOverStatus } = useAppState()

document.addEventListener('dragend', () => {
  setDragStateCardId(null);
  setDragStateOverStatus(null);
});

let initError = ref<any>(null)
const configuration = useRuntimeConfig();
const testUserToken = configuration.public.testUserToken;
const { validate } = useTelegramUserApi();

onMounted(async () => {
  try {
    let token = testUserToken;
    if (!token) {
      token = WebApp.initData;
      if (!token) {
        initError.value("The app should be run as Mini App");
        return;
      }
    }

    const bearer = await validate(token)
    localStorage.setItem('bearer', bearer)

    if (!testUserToken){
      WebApp.ready();
      WebApp.expand();

      if (!WebApp.isFullscreen)
        return;

      // Telegram provides its own inset for the header bar
      const applyInsets = () => {
        const finalTop = WebApp.contentSafeAreaInset?.top ?? 0;
        const finalBottom = WebApp.safeAreaInset?.bottom ?? 0;

        document.documentElement.style.setProperty('--safe-top', finalTop + 'px');
        document.documentElement.style.setProperty('--safe-bottom', finalBottom + 'px');
      };

      applyInsets();
      WebApp.onEvent('safeAreaChanged', applyInsets);
      WebApp.onEvent('contentSafeAreaChanged', applyInsets);
    }

  } catch (err) {
    initError.value = err;
  }
});

</script>

<template>
  <div id="app">
    <span v-if="initError">{{initError}}</span>
    <NuxtPage v-else />
  </div>
</template>

<style scoped>
</style>