<template>
  <header class="flex flex-align-center">
    <div class="header-left flex1 flex flex-align-center">
      <a class="menu" @click="isShowDrawer = true">
        <SvgIcon name="menu" />
      </a>
      <!-- 分割线 -->
      <span class="line"></span>
      <router-link to="/" class="logo flex flex-align-center">
        <img src="@/assets/images/logo.png" alt="NFTSKY" />
      </router-link>
    </div>
    <nav class="flex flex-align-center flex-pack-center">
      <router-link to="/">{{ $t('home') }}</router-link>
      <router-link to="/auction">{{ $t('auction') }}</router-link>
      <router-link to="/collection" class="flex flex-align-center">
        {{ $t('topic') }}
      </router-link>
      <router-link to="/market">{{ $t('countryFair') }}</router-link>
      <router-link
        to="/create"
        v-if="!store.state.isApp || (store.state.isApp && mode !== 'prod')"
        >{{ $t('createnft') }}</router-link
      >
      <!-- 工具集 -->
      <ElDropdown trigger="click" @visible-change="onToolsVisibleChange">
        <a class="tools flex flex-align-center"
          >{{ $t('nftTools') }}
          <svg
            :class="{ active: isShowToolsDropdown }"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 10 6"
          >
            <path
              class="a"
              d="M4.078,1.106a1.2,1.2,0,0,1,1.844,0L8.36,4.032A1.2,1.2,0,0,1,7.438,6H2.562A1.2,1.2,0,0,1,1.64,4.032Z"
            /></svg
        ></a>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item @click="toPage('create')">{{ $t('createnft') }}</el-dropdown-item> -->
            <el-dropdown-item @click="toPage('right')">{{ $t('rightsList') }}</el-dropdown-item>
            <el-dropdown-item @click="toPage('batchCreate')">{{
              $t('batchCreate')
            }}</el-dropdown-item>
            <el-dropdown-item @click="toPage('batchSale')">{{ $t('batchSale') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </ElDropdown>
    </nav>
    <div class="operate flex flex-align-center">
      <!-- 登录按钮 -->
      <a
        v-if="!store.state.userInfo"
        class="btn"
        @click="auth"
        v-loading="store.state.userInfoLoading"
        element-loading-background="rgba(255, 255, 255, 0.7)"
        >{{ $t('signinandout') }}</a
      >

      <!-- 登录用户 -->
      <ElDropdown class="user-menu" trigger="click" v-else>
        <div class="user-info flex flex-align-center">
          <UserAvatar
            bg="gray"
            class="avatar"
            :metaId="store.state.userInfo?.showId"
            :hasmask="store.state.userInfo.avatarType === 'nft-metabot'"
            :disabled="true"
          />
          <div class="username">{{ store.state.userInfo?.name }}</div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toSelf">{{ $t('mynft') }}</el-dropdown-item>
            <el-dropdown-item @click="toWallet">{{ $t('mywallet') }}</el-dropdown-item>
            <el-dropdown-item @click="isShowApps = true">{{ $t('appsTitle') }}</el-dropdown-item>
            <el-dropdown-item @click="toPage('fees')">
              {{ $t('tariffDescription ') }}
            </el-dropdown-item>
            <el-dropdown-item @click="toPage('termsOfUse')">
              {{ $t('termsOfUse') }}
            </el-dropdown-item>
            <el-dropdown-item @click="toPage('certification')">
              {{ $t('certSystemIntro') }}
            </el-dropdown-item>
            <el-dropdown-item @click="logout">{{ $t('logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </ElDropdown>

      <!-- 分割线 -->
      <span class="line"></span>

      <ElDropdown trigger="click" class="lang-drop-down">
        <!-- 语言 -->
        <a class="lang flex flex-align-center">
          <img src="@/assets/images/i18n.png" />{{ $t(i18n.locale.value) }}</a
        >
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="lang in i18n.availableLocales"
              :key="lang"
              :disabled="lang === i18n.locale.value"
              @click="setLang(lang)"
              >{{ $t(lang) }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </ElDropdown>
    </div>
  </header>

  <!-- ElDrawer -->
  <el-drawer modal-class="menu-drawer" v-model="isShowDrawer" direction="ttb">
    <nav class="mobile-nav-modal">
      <router-link to="/" @click.stop="isShowDrawer = false">{{ $t('home') }}</router-link>
      <router-link to="/collection" @click.stop="isShowDrawer = false">
        {{ $t('topic') }}
      </router-link>
      <router-link to="/market" @click.stop="isShowDrawer = false">{{
        $t('countryFair')
      }}</router-link>
      <router-link to="/create" @click.stop="isShowDrawer = false">{{
        $t('createnft')
      }}</router-link>
      <router-link :to="{ name: 'right' }" @click.stop="isShowDrawer = false">{{
        $t('rightsList')
      }}</router-link>
      <router-link :to="{ name: 'batchCreate' }" @click.stop="isShowDrawer = false">{{
        $t('batchCreate')
      }}</router-link>
      <router-link :to="{ name: 'batchSale' }" @click.stop="isShowDrawer = false">{{
        $t('batchSale')
      }}</router-link>
    </nav>
  </el-drawer>

  <!-- 应用广场 -->
  <ElDialog v-model="isShowApps" custom-class="app-modal">
    <iframe :src="`/app/index?lang=${i18n.locale.value}`" frameborder="0" />
  </ElDialog>
</template>

<script setup lang="ts">
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElDialog, ElDrawer } from 'element-plus'
import { ref } from 'vue'
import { useStore, Mutation } from '@/store/index'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import SvgIcon from '../SvgIcon/SvgIcon.vue'

const i18n = useI18n()
const env = import.meta.env
const store = useStore()
const route = useRoute()
const router = useRouter()
const isShowDrawer = ref(false)
const mode = import.meta.env.MODE
const isShowToolsDropdown = ref(false)
const isShowApps = ref(false)

// 跳转授权
function auth() {
  if (store.state.userInfoLoading) return
  // 清楚缓存的信息，避免意外
  store.commit(Mutation.LOGOUT, undefined)
  let url = `${env.VITE_AuthUrl}/userLogin?response_type=code&client_id=${env.VITE_AppId}&redirect_uri=${env.VITE_Hosts}${env.VITE_RedirectPath}&scope=app&from=${env.VITE_Hosts}`
  // 添加邀请码
  const refCode = localStorage.getItem('refCode')
  if (refCode) url += `&refCode=${refCode}`
  window.location.href = url
}

// 退出登录
function logout() {
  store.commit(Mutation.LOGOUT, undefined)
  if (route.meta && route.meta.isAuth) {
    router.replace('/')
  }
}

// 设置语言
function setLang(lang: string) {
  // const lang = i18n.locale.value === 'en' ? 'zh' : 'en'
  i18n.locale.value = lang
  window.localStorage.setItem('lang', lang)
}
function toSelf() {
  router.push(`/self/${store.state.userInfo.metaId}`)
}
function toWallet() {
  window.open(import.meta.env.VITE_AuthUrl)
}

function toPage(name: string) {
  router.push({ name })
}

function onToolsVisibleChange(value: boolean) {
  isShowToolsDropdown.value = value
}
</script>

<style lang="scss" scoped src="./Header.scss"></style>
