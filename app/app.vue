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
const { setUser } = useAppState();
const { t, setLocale, locales } = useI18n();

onMounted(async () => {
  try {
    let token = testUserToken;
    if (!testUserToken) {
      // set launch language based on TG settings
      const language = WebApp.initDataUnsafe.user?.language_code;
      if (locales.value.find(l => l.code == language))
        // @ts-ignore
        await setLocale(language);

      // Resize windows
      setupTelegram()

      // Get token to validate from the passed by TG
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

    // @ts-ignore
    await setLocale(user.languageCode);

  } catch (err) {
    initError.value = err;
  } finally {
    initialized.value = true;
  }
});

const setupTelegram = () => {
  WebApp.ready();
  WebApp.expand();
  WebApp.requestFullscreen();

  if (WebApp.isFullscreen) {

    // Telegram provides its own inset for the header bar
    const applyInsets = () => {
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;
      const platform = WebApp.platform;

      let safeTop = WebApp.safeAreaInset?.top ?? 0;
      let safeBottom = WebApp.safeAreaInset?.bottom ?? 0;
      let safeLeft = WebApp.safeAreaInset?.left ?? 0;
      let safeRight = WebApp.safeAreaInset?.right ?? 0;

      if (platform === "ios") {
        if (!isLandscape){
        }
      }

      // On mobile: use the larger of both (Telegram chrome overlaps)
      // On desktop: looks like calculates wrong. The hardcoded value.
      // Logged values:
      // [tdesktop][0][56] - too big offset
      // [ios][54][46] - looks great

      // contentSafeAreaInset accounts for Telegram's own header chrome
      document.documentElement.style.setProperty('--safe-top', safeTop + 'px');
      document.documentElement.style.setProperty('--safe-bottom', safeBottom + 'px');
      document.documentElement.style.setProperty('--safe-left', safeLeft + 'px');
      document.documentElement.style.setProperty('--safe-right', safeRight + 'px');
    };

    applyInsets();
    WebApp.onEvent('safeAreaChanged', applyInsets);
    WebApp.onEvent('contentSafeAreaChanged', applyInsets);
  }
}

</script>

<template>
  <div id="app">
    <div class="loader-overlay" :class="{hidden: initialized}">
      <div class="loader-logo">Msg<span>board</span></div>
      <div class="loader-bar"><div class="loader-bar-fill"></div></div>
      <div class="loader-text">{{ t('appInitializing') }}</div>
    </div>
    <span v-if="!initialized">App is initializing...</span>
    <span v-else-if="initError">{{initError}}</span>
    <NuxtPage v-else />
  </div>
</template>

<style scoped>
/* LOADER */
.loader-overlay{position:fixed;inset:0;background:var(--bg);z-index:999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;transition:opacity 0.35s,visibility 0.35s}
.loader-overlay.hidden{opacity:0;visibility:hidden;pointer-events:none}
.loader-logo{font-size:24px;font-weight:800;letter-spacing:-0.5px;color:var(--accent)}
.loader-logo span{color:var(--text2);font-weight:400}
.loader-bar{width:160px;height:3px;background:var(--surface3);border-radius:2px;overflow:hidden}
.loader-bar-fill{height:100%;border-radius:2px;background:var(--accent);animation:loader-progress 1.4s cubic-bezier(0.4,0,0.2,1) forwards}
@keyframes loader-progress{0%{width:0%;opacity:1}70%{width:85%;opacity:1}100%{width:100%;opacity:0}}
.loader-text{font-size:12px;color:var(--text3);font-family:'JetBrains Mono',monospace;animation:loader-blink 1.2s ease-in-out infinite}
@keyframes loader-blink{0%,100%{opacity:0.4}50%{opacity:1}}
</style>