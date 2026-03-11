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

      WebApp.ready(); // init telegram mini app
    }

    const bearer = await validate(token)
    localStorage.setItem('bearer', bearer)

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

#app { height: 100%; display: flex; flex-direction: column; overflow: hidden; }
</style>