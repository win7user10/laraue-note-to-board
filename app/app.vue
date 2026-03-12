<script setup lang="ts">

import {useAppState} from "~/composables/appState";
import {onMounted, ref} from "vue";
import WebApp from "@twa-dev/sdk";
import {useUserApi} from "~/composables/userApi";

const { setDragStateCardId, setDragStateOverStatus } = useAppState()

document.addEventListener('dragend', () => {
  setDragStateCardId(null);
  setDragStateOverStatus(null);
});

let initError = ref<any>(null)
const initialized = ref<boolean>(false);
const configuration = useRuntimeConfig();
const testUserToken = configuration.public.testUserToken;
const { validate } = useTelegramUserApi();
const { setUser } = useAppState();
const { loadUser } = useUserApi();

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

      const mobilePlatforms = ['android', 'android_x', 'ios'];
      const isMobile = mobilePlatforms.includes(WebApp.platform);

      // Telegram provides its own inset for the header bar
      const applyInsets = () => {
        const safeTop = WebApp.safeAreaInset?.top ?? 0;
        const contentTop = WebApp.contentSafeAreaInset?.top ?? 0;

        // On mobile: use the larger of both (Telegram chrome overlaps)
        // On desktop: looks like calculates wrong. The hardcoded value.
        // Logged values:
        // [tdesktop][0][56] - too big offset
        // [ios][54][46] - looks great
        const finalTop = isMobile ? Math.max(safeTop, contentTop) : 30;

        // contentSafeAreaInset accounts for Telegram's own header chrome
        document.documentElement.style.setProperty('--safe-top', finalTop + 'px');
        document.documentElement.style.setProperty('--safe-bottom',
            (WebApp.safeAreaInset?.bottom ?? 0) + 'px');
      };

      applyInsets();
      WebApp.onEvent('safeAreaChanged', applyInsets);
      WebApp.onEvent('contentSafeAreaChanged', applyInsets);
    }

    const user = await loadUser();
    setUser(user);

  } catch (err) {
    initError.value = err;
  } finally {
    initialized.value = true;
  }
});

</script>

<template>
  <div id="app">
    <span v-if="!initialized">App is initializing...</span>
    <span v-else-if="initError">{{initError}}</span>
    <NuxtPage v-else />
  </div>
</template>

<style scoped>
</style>