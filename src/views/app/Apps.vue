<template>
  <div class="apps">
    <div class="top">
      <div class="header flex flex-align-center flex-pack-center">{{ $t('appsTitle') }}</div>
      <div class="tabs flex flex-align-center flex-pack-center">
        <div class="flex1 tabs-item-warp">
          <a :class="{ active: certificationStage === '0' }" @click="changeCert('0')">{{
            $t('iscertBlock')
          }}</a>
        </div>
        <div class="flex1 tabs-item-warp">
          <a :class="{ active: certificationStage === '1' }" @click="changeCert('1')">{{
            $t('uncertBlock')
          }}</a>
        </div>
      </div>
    </div>
    <div class="app-list">
      <a
        @click="toAppDetail(app.appTag)"
        class="app-item flex flex-align-center"
        v-for="app in apps"
        :key="app.appTag"
      >
        <img class="icon" :src="app.avatarUrl" />
        <div class="right flex1 flex flex-align-center">
          <div class="cont flex1">
            <div class="title">{{ app[`name${i18n.locale.value === 'zh' ? 'ZH' : 'EN'}`] }}</div>
            <div class="drsc">{{ app[`content${i18n.locale.value === 'zh' ? 'ZH' : 'EN'}`] }}</div>
          </div>
          <img
            class="info"
            src="@/assets/images/list_icon_info.png"
            @click.stop="open(app.url, $options)"
          />
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { GetApps } from '../../api'

const i18n = useI18n()
const certificationStage = ref('0')
const apps: AppItem[] = reactive([])
const route = useRoute()
const router = useRouter()

function getApps() {
  return new Promise(async resolve => {
    const res = await GetApps({ certificationStage: certificationStage.value })
    if (res.code === 200) {
      apps.length = 0
      apps.push(...res.result.apps)
    }
  })
}

function changeCert(type: string) {
  if (certificationStage.value === type) return
  certificationStage.value = type
  getApps()
}

function open(url: string, e) {
  window.open(url, 'blank')
  e.preventDefault()
}

function toAppDetail(tag: string) {
  router.push({
    name: 'appDetail',
    params: {
      isCert: certificationStage.value,
      tag,
    },
  })
}

if (route.query.lang && typeof route.query.lang === 'string') {
  i18n.locale.value = route.query.lang
}

getApps()
</script>

<style lang="scss" scoped src="./Apps.scss"></style>
