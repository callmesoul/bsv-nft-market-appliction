<template>
  <Header v-if="!route.meta?.isHideHeaderAndFooter" />
  <div class="main flex fle-v" :class="{ noPadding: route.meta?.isHideHeaderAndFooter }">
    <router-view v-slot="{ Component, route }">
      <Transition name="fade">
        <div class="transition-warp flex1" :class="{ setFull: route.meta?.isHideHeaderAndFooter }">
          <KeepAlive>
            <component
              :is="Component"
              :key="route.fullPath"
              v-if="route.meta && route.meta.keepAlive"
            />
          </KeepAlive>
          <component
            :is="Component"
            :key="route.fullPath"
            v-if="!route.meta || (route.meta && !route.meta.keepAlive)"
          />
        </div>
      </Transition>
    </router-view>
  </div>
  <Footer v-if="!route.meta?.isHideHeaderAndFooter" />
</template>

<script setup lang="ts">
import { KeepAlive, Transition } from 'vue'
import Header from './components/Header/Header.vue'
import Footer from './components/Footer/Footer.vue'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<style lang="scss" scoped>
.main {
  padding-top: 60px;
  padding-bottom: 100px;
  flex: 1;
  min-height: 0;
  height: 100%;
  position: relative;
  &.noPadding {
    padding-top: 0;
    padding-bottom: 0;
  }
  .transition-warp {
    height: 100%;
    &.setFull {
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      top: 0;
    }
  }
}
</style>
