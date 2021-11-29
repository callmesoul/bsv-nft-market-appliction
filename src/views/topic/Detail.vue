<template>
  <InnerPageHeader :title="topic.val.name" :isShowSearch="false" />

  <!-- banner -->
  <div class="banner container">
    <a><img :src="topic.val.cover" alt="Metabot"/></a>
    <!-- <a @click="toMetabot" v-if="i18n.locale.value === 'zh'"
      ><img src="@/assets/images/cn-banner-metabot.png" alt="Metabot"
    /></a>
    <a @click="toMetabot" v-else
      ><img src="@/assets/images/cn-banner-metabot.png" alt="Metabot"
    /></a> -->
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
          <el-skeleton-item variant="image" class="el-skeleton-item-image" />
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
            variant="button"
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
          v-for="(metabot, index) in metaBots"
          :key="metabot.nftGenesis + metabot.nftCodehash + metabot.nftTokenIndex"
        >
          <!-- <div class="cover">
            <img :src="metafileUrl(metabot.nftIcon)" :alt="metabot.nftName" />
          </div> -->
          <div class="cover">
            <ElImage :lazy="true" :src="metafileUrl(metabot.nftIcon)" fit="contain"></ElImage>
            <VueCountdown
              class="countdown"
              :time="metabot.auctionDeadTime ? metabot.auctionDeadTime - new Date().getTime() : 0"
              :transform="transformSlotProps"
              v-slot="{ days, hours, minutes, seconds }"
              @end="onCountdownEnd"
              v-if="
                metabot.isAuction &&
                  metabot.auctionStatus === 1 &&
                  metabot.auctionDeadTime &&
                  metabot.auctionDeadTime > now
              "
            >
              <span class="dot"></span
              ><span>{{ parseInt(hours) + parseInt(days) * 24 }}:{{ minutes }}:{{ seconds }}</span>
            </VueCountdown>
          </div>
          <div class="cont">
            <div class="name">{{ metabot.nftName }}</div>
            <div class="user-list">
              <div class="user-item flex flex-align-center">
                <UserAvatar
                  class="avatar"
                  :metaId="metabot.nftIssueMetaId"
                  :hasmask="metabot.nftIssueAvatarType === 'nft-metabot'"
                />
                <span class="name">{{ metabot.nftIssuer }}</span>
                <span class="type">({{ $t('creater') }})</span>
              </div>
              <div class="user-item flex flex-align-center">
                <UserAvatar
                  class="avatar"
                  :metaId="metabot.nftOwnerMetaId"
                  :hasmask="metabot.nftOwnerAvatarType === 'nft-metabot'"
                />
                <span class="name">{{ metabot.nftOwnerName }}</span>
                <span class="type">({{ $t('owner') }})</span>
              </div>
            </div>
            <!-- nftSellState !== 3 上架出售/ 已被下架/已被购买 -->
            <template v-if="metabot.nftSellState !== 3 && metabot.nftIsReady">
              <div
                class="btn btn-block"
                :class="{
                  'btn-gray': metabot.nftSellState !== 0 || !metabot.nftIsReady,
                  'line-through': metabot.nftSellState !== 0 || !metabot.nftIsReady,
                }"
                @click.stop="buy(metabot)"
              >
                {{ new Decimal(metabot.nftPrice).div(Math.pow(10, 8)).toString() }} BSV
              </div>
            </template>
            <template
              v-else-if="
                metabot.nftSellState === 2 ||
                  metabot.nftSellState === 1 ||
                  metabot.nftSellState === 0
              "
            >
              <div
                class="btn btn-block "
                :class="{
                  'btn-gray': metabot.nftSellState !== 0 || !metabot.nftIsReady,
                  'line-through': metabot.nftSellState !== 0 || !metabot.nftIsReady,
                }"
                @click.stop="buy(metabot)"
              >
                {{ new Decimal(metabot.nftPrice).div(Math.pow(10, 8)).toString() }} BSV
              </div>
            </template>
            <template v-else-if="metabot.nftSellState === 3">
              <div class="btn btn-block btn-gray" @click.stop="buy(metabot)">
                {{ $t('comingSoon ') }}
              </div>
            </template>
          </div>
        </a>
      </div>
    </template>
  </el-skeleton>

  <div class="page-footer">
    <LoadMore
      :pagination="pagination"
      @getMore="getMore"
      v-if="metaBots.length > 0 && !isShowSkeleton"
    />
    <IsNull v-if="metaBots.length <= 0 && !isShowSkeleton" />
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useStore } from '@/store'
import IsNull from '@/components/IsNull/IsNull.vue'
import { useRoute, useRouter } from 'vue-router'
import {
  GetMetaBotList,
  GetMetaBotListBySearch,
  GetNftAuctions,
  GetTopicNftList,
  NFTApiGetNFTDetail,
} from '@/api'
import { ElLoading, ElMessage, ElMessageBox, ElSkeleton, ElSkeletonItem } from 'element-plus'
import { checkSdkStatus, metafileUrl } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import Decimal from 'decimal.js-light'
import Buy from '@/utils/buy'
import NFTDetail from '@/utils/nftDetail'
import VueCountdown from '@chenfengyuan/vue-countdown'
import { ElImage } from 'element-plus'
import InnerPageHeader from '@/components/InnerPageHeader/InnerPageHeader.vue'

import LoadMore from '@/components/LoadMore/LoadMore.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()
const i18n = useI18n()
const isShowSkeleton = ref(true)
const keyword = ref('')
const metaBots: GetMetaBotListResItem[] = reactive([])
const pagination = reactive({
  ...store.state.pagination,
  pageSize: 100,
})
const topic: { val: Topic } = reactive({
  val: {
    cover: '',
    name: '',
    createrMetaId: '',
    createrName: '',
    time: '',
    key: '',
  },
})

const countdown = ref(0)
const isShowCountdown = ref(true)
const isAuction = computed(() => sections[sectionIndex.value].name === '#001-015')
const now = new Date().getTime()
const sectionIndex = ref(0)

function onCountdownEnd() {
  setTimeout(() => {
    pagination.page = 1
    pagination.loading = false
    pagination.nothing = false
    keyword.value = ''
    sectionIndex.value = 0
    isShowCountdown.value = false
    getDatas(true)
  }, 3000)
}

function transformSlotProps(props: any) {
  const formattedProps = {}
  Object.entries(props).forEach(([key, value]) => {
    // @ts-ignore
    formattedProps[key] = value < 10 ? `0${value}` : String(value)
  })
  return formattedProps
}

function search(_keyword: string) {
  keyword.value = _keyword
  isShowSkeleton.value = true
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  debugger
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
  return new Promise<void>(async resolve => {
    const res = await GetTopicNftList({
      Page: pagination.page.toString(),
      PageSize: pagination.pageSize.toString(),
      TopicType: typeof route.params.key === 'string' ? route.params.key : '',
    })
    if (res.code === 0) {
      if (isCover) {
        metaBots.length = 0
      }
      metaBots.push(...res.data.results.items)
      isShowSkeleton.value = false
      const totalPages = Math.ceil(res.data.total / pagination.pageSize)
      if (totalPages <= pagination.page) {
        pagination.nothing = true
      }
    }
    resolve()
  })
}

function getSearchDatas(isCover = false) {
  return new Promise<void>(async resolve => {
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
      .catch(res => {
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
  if (route.params.key) {
    const topicItem = topics.find(item => item.key === route.params.key)
    if (topicItem) {
      topic.val = topicItem
    }
  }
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  getDatas(true)
})

// setInterval(() => {
//   countdown.value = 10 * 1000
// }, 2000)

// isShowSkeleton.value = false
</script>

<style lang="scss" scoped src="./Detail.scss"></style>
