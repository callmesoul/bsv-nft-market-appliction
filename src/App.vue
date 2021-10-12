<template>
  <Header />
  <div class="main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade">
        <component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
        <!-- <keep-alive :include="keeeAliveRouterNames">
          <component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
        </keep-alive> -->
        <!-- <template v-if="route.meta.keeeAlive">
          <keep-alive>
            <component :is="Component" :key="route.meta.usePathKey ? route.path : undefined" />
          </keep-alive>
        </template>
        <template v-else
          ><component :is="Component" :key="route.meta.usePathKey ? route.path : undefined"
        /></template> -->
      </transition>
    </router-view>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import Header from './components/Header/Header.vue'
import Footer from './components/Footer/Footer.vue'

const keeeAliveRouterNames = ['home']
</script>
<style>
.main {
  padding-top: 60px;
  padding-bottom: 100px;
  flex: 1;
}
</style>
