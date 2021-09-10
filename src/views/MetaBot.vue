<template>
  <div class="inner-page-header container flex flex-align-center">
    <div class="inner-page-header-left flex1">
      <div class="title flex flex-align-center">
        <img @click="router.back()" src="@/assets/images/bannet_icon_ins.svg" />MetaBot
      </div>
      <div class="drsc">{{ $t('metaBotDrsc') }}</div>
    </div>
    <div class="search-warp flex flex-align-center">
      <input
        class="flex1"
        v-model="keyword"
        :placeholder="$t('search')"
        @keyup.enter="search"
        type="text"
      />
      <img src="@/assets/images/icon_search.svg" @click="search" />
    </div>
  </div>

  <!-- banner -->
  <div class="banner container">
    <a @click="toMetabot" v-if="i18n.locale.value === 'zh'"
      ><img src="@/assets/images/cn-banner-metabot.png" alt="Metabot"
    /></a>
    <a @click="toMetabot" v-else
      ><img src="@/assets/images/en-banner-metabot.png" alt="Metabot"
    /></a>
  </div>

  <VueCountdown
    :time="countdown"
    :transform="transformSlotProps"
    v-slot="{ days, hours, minutes, seconds }"
    @end="onCountdownEnd"
    v-if="countdown > 0 && isShowCountdown"
  >
    <div class="countdown">
      <div class="title">#501 - #800 {{ $t('sellCountDown') }}:</div>
      <div class="cont">
        {{ parseInt(hours) + parseInt(days) * 24 }} : {{ minutes }} : {{ seconds }}
      </div>
    </div>
  </VueCountdown>

  <div class="metabot-tags container">
    <a
      class="metabot-tag"
      :class="{ active: sectionIndex === index }"
      v-for="(section, index) in sections"
      :key="index"
      @click="changeSectionIndex(index)"
      >{{ section.name }}</a
    >
  </div>

  <el-skeleton
    class="meta-bot-list container"
    :loading="isShowSkeleton"
    animated
    :count="pagination.pageSize"
  >
    <template #template>
      <div class="meta-bot-item">
        <div class="cover">
          <el-skeleton-item
            variant="image"
            style="
              width: 100%;
              height: 100%;
              display: block;
              position: absolute;
              border-radius: 8px 8px 0 0;
            "
          />
        </div>
        <div class="cont">
          <div class="name"><el-skeleton-item variant="text" style="width: 30%" /></div>
          <div class="user-list">
            <div class="user-item flex flex-align-center">
              <el-skeleton-item variant="text" style="width: 60%" />
            </div>
            <div class="user-item flex flex-align-center">
              <el-skeleton-item variant="text" style="width: 60%" />
            </div>
          </div>
          <el-skeleton-item
            class="btn btn-block btn-gray"
            variant="button "
            style="width: 100%; box-sizing: border-box; border: none"
          />
        </div>
      </div>
    </template>
    <template #default>
      <!-- MetaBot list -->
      <div class="meta-bot-list container">
        <a
          @click="toDetail(metabot)"
          class="meta-bot-item"
          v-for="metabot in metaBots"
          :key="metabot.nftGenesis + metabot.nftCodehash + metabot.nftTokenIndex"
        >
          <div class="cover">
            <img :src="metafileUrl(metabot.nftIcon)" :alt="metabot.nftName" />
          </div>
          <div class="cont">
            <div class="name">{{ metabot.nftName }}</div>
            <div class="user-list">
              <div class="user-item flex flex-align-center">
                <img class="avatar" :src="$filters.avatar(metabot.nftIssueMetaId)" />
                <span class="name">{{ metabot.nftIssuer }}</span>
                <span class="type">({{ $t('creater') }})</span>
              </div>
              <div class="user-item flex flex-align-center">
                <img class="avatar" :src="$filters.avatar(metabot.nftOwnerMetaId)" />
                <span class="name">{{ metabot.nftOwnerName }}</span>
                <span class="type">({{ $t('owner') }})</span>
              </div>
            </div>

            <template v-if="metabot.nftSellState === 3">
              <div class="btn btn-block btn-gray" @click.stop="buy(metabot)">
                {{ $t('comingSoon ') }}
              </div>
            </template>
            <template v-else>
              <div
                class="btn btn-block"
                :class="{
                  'btn-gray':
                    metabot.nftSellState !== 0 ||
                    !metabot.nftIsReady ||
                    (store.state.userInfo &&
                      store.state.userInfo.metaId === metabot.nftOwnerMetaId),
                  'line-through':
                    metabot.nftSellState !== 0 ||
                    !metabot.nftIsReady ||
                    (store.state.userInfo &&
                      store.state.userInfo.metaId === metabot.nftOwnerMetaId),
                }"
                @click.stop="buy(metabot)"
              >
                {{ new Decimal(metabot.nftPrice).div(Math.pow(10, 8)).toString() }} BSV
              </div>
            </template>
          </div>
        </a>
      </div>
    </template>
  </el-skeleton>

  <div class="page-footer">
    <!-- <LoadMore
        :pagination="pagination"
        @getMore="getMore"
        v-if="metaBots.length > 0 && !isShowSkeleton"
      /> -->
    <IsNull v-if="metaBots.length <= 0" />
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from '@/store'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '../components/IsNull/IsNull.vue'
import { useRouter } from 'vue-router'
import { GetMetaBotList, GetMetaBotListBySearch } from '@/api'
import { ElLoading, ElMessage, ElMessageBox, ElSkeleton, ElSkeletonItem } from 'element-plus'
import { checkSdkStatus, metafileUrl } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import Decimal from 'decimal.js-light'
import Buy from '@/utils/buy'
import NFTDetail from '@/utils/nftDetail'
import VueCountdown from '@chenfengyuan/vue-countdown'

const store = useStore()
const router = useRouter()
const i18n = useI18n()
const isShowSkeleton = ref(true)
const keyword = ref('')
const metaBots: GetMetaBotListResItem[] = reactive([])
const pagination = reactive({
  ...store.state.pagination,
  pageSize: 100,
})

const countdown = ref(0)
const isShowCountdown = ref(true)

const sections = [
  { name: '#201-300', start: 201, end: 300 },
  { name: '#301-400', start: 301, end: 400 },
  { name: '#401-500', start: 401, end: 500 },
  { name: '#501-600', start: 501, end: 600 },
  { name: '#601-700', start: 601, end: 700 },
  { name: '#701-800', start: 701, end: 800 },
  { name: '#801-900', start: 801, end: 900 },
  { name: '#901-999', start: 901, end: 999 },
]
const sectionIndex = ref(0)

function onCountdownEnd() {
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  keyword.value = ''
  sectionIndex.value = 0
  isShowCountdown.value = false
  getDatas(true)
}

function transformSlotProps(props: any) {
  const formattedProps = {}
  Object.entries(props).forEach(([key, value]) => {
    // @ts-ignore
    formattedProps[key] = value < 10 ? `0${value}` : String(value)
  })
  return formattedProps
}

function search() {
  isShowSkeleton.value = true
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  if (keyword.value === '') {
    sectionIndex.value = 0
    getDatas(true)
  } else {
    sectionIndex.value = -1
    getSearchDatas(true)
  }
}

function toMetabot() {
  window.open('https://www.metabot.world')
}

function toDetail(metabot: GetMetaBotListResItem) {
  router.push({
    name: 'detail',
    params: {
      genesisId: metabot.nftGenesis,
      codehash: metabot.nftCodehash,
      tokenIndex: metabot.nftTokenIndex,
    },
  })
}

function getDatas(isCover = false) {
  return new Promise<void>(async (resolve) => {
    const res = await GetMetaBotList({
      Page: pagination.page.toString(),
      PageSize: pagination.pageSize.toString(),
      Start: sections[sectionIndex.value].start,
      End: sections[sectionIndex.value].end,
    })
    if (res.code === 0) {
      if (isCover) {
        metaBots.length = 0
      }
      if (res.data.results.items.length > 0) {
        metaBots.push(...res.data.results.items)
      } else {
        pagination.nothing = true
      }
      // @ts-ignore
      if (res.data.countdown > 0) {
        // @ts-ignore
        countdown.value = res.data.countdown + 1000
      } else {
        // @ts-ignore
        countdown.value = res.data.countdown
      }
      isShowSkeleton.value = false
    }
    resolve()
  })
}

function getSearchDatas(isCover = false) {
  return new Promise<void>(async (resolve) => {
    const res = await GetMetaBotListBySearch({
      Page: pagination.page.toString(),
      PageSize: pagination.pageSize.toString(),
      SearchWord: keyword.value,
    })
    if (res.code === 0) {
      if (isCover) {
        metaBots.length = 0
      }
      if (res.data.results.items.length > 0) {
        metaBots.push(...res.data.results.items)
      } else {
        pagination.nothing = true
      }
      isShowSkeleton.value = false
    }
    resolve()
  })
}

function getMore() {
  if (pagination.loading || pagination.nothing) return
  pagination.page++
  pagination.loading = true
  if (keyword.value === '') {
    getDatas().then(() => {
      pagination.loading = false
    })
  } else {
    getSearchDatas().then(() => {
      pagination.loading = false
    })
  }
}

function changeSectionIndex(index: number) {
  if (sectionIndex.value === index) return
  sectionIndex.value = index
  isShowSkeleton.value = true
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  keyword.value = ''
  getDatas(true)
}

// 购买
async function buy(metabot: GetMetaBotListResItem) {
  if (metabot.nftSellState === 1) {
    ElMessage.warning(i18n.t('isBeCancelSelled'))
    return
  } else if (metabot.nftSellState === 2) {
    ElMessage.warning(i18n.t('isBeBuyed'))
    return
  } else if (metabot.nftSellState === 3) {
    ElMessage.warning(i18n.t('comingSoon '))
    return
  } else {
    if (!metabot.nftIsReady) return
  }

  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'full-loading',
  })
  // 获取详情
  const nftDetail = await NFTDetail(
    metabot.nftGenesis,
    metabot.nftCodehash,
    metabot.nftTokenIndex
  ).catch(() => loading.close())
  if (nftDetail) {
    Buy(nftDetail)
      .then(() => {
        metabot.nftSellState = 1
        metabot.nftOwnerMetaId = store.state.userInfo!.metaId
        metabot.nftOwnerName = store.state.userInfo!.name
        ElMessage.success(i18n.t('buySuccess'))
        loading.close()
        router.push({
          name: 'nftSuccess',
          params: {
            genesisId: metabot.nftGenesis,
            tokenIndex: metabot.nftTokenIndex,
            codehash: metabot.nftCodehash,
          },
          query: {
            type: 'buyed',
          },
        })
      })
      .catch((res) => {
        loading.close()
        if (res) nftNotCanBuy(res)
      })
  }
}

function nftNotCanBuy(res: any) {
  debugger
  if (
    (res.code === 204 &&
      res.data &&
      res.data.message ===
        'The NFT is not for sale because  the corresponding SellUtxo cannot be found.') ||
    res.data.message === '258: txn-mempool-conflict'
  ) {
    ElMessage.error(i18n.t('nftNotCanBuy'))
    pagination.page = 1
    pagination.loading = false
    pagination.nothing = false
    isShowSkeleton.value = true
    getDatas(true)
  }
}

onMounted(() => {
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  getDatas(true)
})

// isShowSkeleton.value = false
</script>
<style lang="scss" scoped src="./MetaBot.scss"></style>
