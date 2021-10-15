<template>
  <Header />
  <div class="main">
    <!-- <router-view /> -->
    <router-view> </router-view>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { KeepAlive, Transition, TransitionGroup } from 'vue'
import Header from './components/Header/Header.vue'
import Footer from './components/Footer/Footer.vue'

const keeeAliveRouterNames = ['Home']
</script>
<style>
.main {
  padding-top: 60px;
  padding-bottom: 100px;
  flex: 1;
  min-height: 0;
}
</style>
