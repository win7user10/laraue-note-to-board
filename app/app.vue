<script setup lang="ts">

import {useAppState} from "~/composables/appState";
import {onMounted, ref} from "vue";
import WebApp from "@twa-dev/sdk";
import {useUserApi} from "~/composables/userApi";

let initError = ref<any>(null)
const initialized = ref<boolean>(false);
const configuration = useRuntimeConfig();
const testUserToken = configuration.public.testUserToken;
const { validate } = useTelegramUserApi();
const { setUser, appState } = useAppState();

onMounted(async () => {
  try {
    let token = testUserToken;
    if (!testUserToken) {
      setupTelegram()
      token = WebApp.initData;
      if (!token) {
        initError.value("The app should be run as Mini App");
        return;
      }
    }

    const bearer = await validate(token)
    localStorage.setItem('bearer', bearer)

    const { loadUser } = useUserApi();
    const user = await loadUser();
    setUser(user);

  } catch (err) {
    initError.value = err;
  } finally {
    initialized.value = true;
  }
});

const setupTelegram = () => {
  WebApp.ready();
  WebApp.expand();

  if (WebApp.isFullscreen) {
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
}

</script>

<template>
  <div id="app">
    <div class="nav-loader" :class="{active: appState.isLoading}">
      <div class="nav-loader-fill"></div>
    </div>
    <span v-if="!initialized">App is initializing...</span>
    <span v-else-if="initError">{{initError}}</span>
    <NuxtPage v-else />
  </div>
</template>

<style scoped>
/* NAV LOADER — slim progress bar at top, doesn't cover UI */
.nav-loader{position:fixed;top:0;left:0;right:0;height:2px;z-index:998;pointer-events:none;opacity:0;transition:opacity 0.15s}
.nav-loader.active{opacity:1}
.nav-loader-fill{height:100%;background:var(--accent);border-radius:0 2px 2px 0;animation:nav-progress 0.5s cubic-bezier(0.4,0,0.2,1) forwards}
@keyframes nav-progress{0%{width:0%}60%{width:75%}100%{width:100%}}
</style>