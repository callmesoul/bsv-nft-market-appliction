<template>
  <!-- banner -->
  <div class="banner" v-if="store.state.banners.length > 0">
    <Swiper
      :autoHeight="true"
      :modules="[Navigation, Pagination, Scrollbar, A11y, Autoplay]"
      :pagination="{ clickable: true }"
      :autoplay="true"
      :loop="true"
    >
      <SwiperSlide v-for="banner in store.state.banners">
        <a
          :href="banner.url"
          :target="
            banner.url.indexOf('http://') !== -1 || banner.url.indexOf('https://') !== -1
              ? '_blank'
              : '_self'
          "
        >
          <!-- @ts-ignore -->
          <img :src="$filters.getI18nContent(banner, 'picUrl')" alt="metaelf"
        /></a>
      </SwiperSlide>
    </Swiper>
  </div>

  <div class="home">
    <!-- 推荐作品 -->
    <RecommentSwiper />

    <!-- 所有类别 -->
    <div class="section  all">
      <div class="container">
        <div class="section-header">
          <div class="title">{{ $t('allmenu') }}</div>
          <div class="intro">{{ $t('allmenuIntro') }}</div>
        </div>
        <NftList
          :nfts="Nfts"
          :pagination="pagination"
          :keyword="keyword"
          :isShowSkeleton="isShowNftListSkeleton"
          :classify="classify"
          :classifyList="classifyList"
          :sorts="sorts"
          :sortValue="sortValue"
          @changeSort="changeSort"
          @search="search"
          @changeClassify="changeClassify"
          @getMore="getMore"
        />
      </div>
    </div>

    <!-- 排行榜 -->
    <div class="rank">
      <div class="container">
        <div class="title">{{ $t('FoundryRanking') }}</div>
        <div class="drsc">{{ $t('AllPersonnelRanking') }}</div>
        <div class="rank-section flex">
          <div class="rank-section-item flex1">
            <div class="name">{{ $t('NumberOfastings') }}</div>
            <div class="rank-list">
              <div
                class="rank-item flex flex-align-center"
                v-for="(item, index) in ranks.issue"
                v-if="ranks.issue.length > 0"
              >
                <div class="index">{{ index + 1 }}</div>
                <UserAvatar :metaId="item.metaId" :hasmask="item.avatarType === 'nft-metabot'" />
                <div class="cont flex1">
                  <div class="username">{{ item.name }}</div>
                  <div class="id">ID:{{ item.metaId.slice(0, 6) }}</div>
                </div>
                <div class="num">{{ item.total }}</div>
              </div>
            </div>
          </div>
          <div class="rank-section-item flex1">
            <div class="name">{{ $t('Likes') }}</div>
            <div class="rank-list">
              <div
                class="rank-item flex flex-align-center"
                v-for="(item, index) in ranks.like"
                v-if="ranks.like.length > 0"
              >
                <div class="index">{{ index + 1 }}</div>
                <UserAvatar :metaId="item.metaId" :hasmask="item.avatarType === 'nft-metabot'" />
                <div class="cont flex1">
                  <div class="username">{{ item.name }}</div>
                  <div class="id">ID:{{ item.metaId.slice(0, 6) }}</div>
                </div>
                <div class="num">{{ item.total }}</div>
              </div>
            </div>
          </div>
          <div class="rank-section-item flex1">
            <div class="name">{{ $t('RewardAmount') }}</div>
            <div class="rank-list">
              <div
                class="rank-item flex flex-align-center"
                v-for="(item, index) in ranks.adonate"
                v-if="ranks.adonate.length > 0"
              >
                <div class="index">{{ index + 1 }}</div>
                <UserAvatar :metaId="item.metaId" :hasmask="item.avatarType === 'nft-metabot'" />
                <div class="cont flex1">
                  <div class="username">{{ item.name }}</div>
                  <div class="id">ID:{{ item.metaId.slice(0, 6) }}</div>
                </div>
                <div class="num">{{ item.total }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- nft 介绍模块 -->
    <HomeNFTIntro />
  </div>
</template>
<script setup lang="ts">
import {
  CertificationType,
  GetAllOnSellNftList,
  GetNftOnShowListByClassify,
  GetNftOnShowListBySearch,
  GetNFTRanks,
  GetRecommendOnSellNftList,
  NftApiCode,
} from '@/api'
import NftItem from '@/components/Nft-item/Nft-item.vue'
import HomeNFTIntro from '@/template/HomeNFTIntro/HomeNFTIntro.vue'
import NftSkeleton from '@/components/NftSkeleton/NftSkeleton.vue'
import { useStore } from '@/store'
import { reactive, ref } from 'vue'
import SetHomeDatas from '@/utils/homeSetData'
import NftList from '@/components/NftList/NftList.vue'
import { classifyList } from '@/config'
import { router } from '@/router'
import { ElPopover } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElCarousel, ElCarouselItem } from 'element-plus'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { OrderType, SortType } from '@/enum'
import RecommentSwiper from '@/components/RecommentSwiper/RecommentSwiper.vue'
import { checkUserInfoFinish } from '@/utils/util'

const store = useStore()
let recommendNfts = reactive<NftItem[]>([])
let Nfts = reactive<NftItem[]>([])
const pagination = reactive({
  ...store.state.pagination,
  pageSize: 24,
})
const keyword = ref('')
const classify = ref('all')
const i18n = useI18n()
let apiType = 'GetAllOnSellNftList'

const sorts: NFTListSortItem[] = reactive([
  {
    name: i18n.t('time'),
    nameKey: 'time',
    value: SortType.Time,
    orderType: OrderType.DESC,
  },
  {
    name: i18n.t('price'),
    nameKey: 'price',
    value: SortType.Price,
    orderType: OrderType.DESC,
  },
])
const sortValue = ref(SortType.Time)

const ranks: {
  issue: GetNFTRanksResDataItem[]
  like: GetNFTRanksResDataItem[]
  adonate: GetNFTRanksResDataItem[]
} = {
  issue: [],
  like: [],
  adonate: [],
}

function changeSort(value: SortType) {
  if (sortValue.value === value) {
    const index = sorts.findIndex(item => item.value === value)
    sorts[index].orderType =
      sorts[index].orderType === OrderType.ASC ? OrderType.DESC : OrderType.ASC
  } else {
    sortValue.value = value
  }
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  getNftList(true)
}

// 骨架屏
const isShowRecommendSkeleton = ref(true)
const isShowNftListSkeleton = ref(true)

async function getNftList(isCover: boolean = false) {
  const apiName = {
    GetAllOnSellNftList: GetAllOnSellNftList,
    GetNftOnShowListByClassify: GetNftOnShowListByClassify,
    GetNftOnShowListBySearch: GetNftOnShowListBySearch,
  }
  // @ts-ignore
  const res = await apiName[apiType]({
    PageSize: pagination.pageSize.toString(),
    Page: pagination.page.toString(),
    classify: apiType === 'GetNftOnShowListByClassify' ? classify.value : undefined,
    SearchWord: apiType === 'GetNftOnShowListBySearch' ? keyword.value : undefined,
    CertificationType: CertificationType.isCert,
    orderType: sorts.find(item => item.value === sortValue.value)?.orderType,
    sortType: sortValue.value,
    metaId: store.state.userInfo ? store.state.userInfo.metaId : undefined,
  })
  if (res.code === NftApiCode.success) {
    if (isCover) Nfts.length = 0
    if (res.data.results.items.length > 0) {
      const results = await SetHomeDatas(res.data.results.items)
      Nfts.push(...results)
    } else {
      pagination.nothing = true
    }
    isShowNftListSkeleton.value = false
  }
}

// 获取推荐列表
function getRecommendNftList() {
  return new Promise<void>(async resolve => {
    const res = await GetRecommendOnSellNftList({
      Page: '1',
      PageSize: '7',
      metaId: store.state.userInfo ? store.state.userInfo.metaId : undefined,
    })
    if (res.code === 0) {
      if (res.data.results.items.length > 0) {
        const results = await SetHomeDatas(res.data.results.items)
        recommendNfts.push(...results)
      }
      isShowRecommendSkeleton.value = false
    }
    resolve()
  })
}

//  加载更多
function getMore() {
  pagination.loading = true
  pagination.page++
  getNftList().then(() => {
    pagination.loading = false
  })
}

// 更改分类
function changeClassify(classifyName: string) {
  if (classify.value === classifyName) return
  isShowNftListSkeleton.value = true
  classify.value = classifyName
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  if (classifyName === 'all') {
    apiType = 'GetAllOnSellNftList'
  } else {
    apiType = 'GetNftOnShowListByClassify'
  }
  getNftList(true)
  keyword.value = ''
}

// 搜索
async function search(_keyword: string) {
  debugger
  keyword.value = _keyword
  isShowNftListSkeleton.value = true
  pagination.loading = false
  pagination.nothing = false
  pagination.page = 1
  if (keyword.value === '') {
    classify.value = 'all'
    apiType = 'GetAllOnSellNftList'
  } else {
    classify.value = ''
    apiType = 'GetNftOnShowListBySearch'
  }
  getNftList(true)
}

function getRanks() {
  return new Promise<void>(async resolve => {
    const params = { page: 1, pageSize: 12 }
    const results = await Promise.all([
      GetNFTRanks({ ...params, key: 'Issue' }),
      GetNFTRanks({ ...params, key: 'PayLike' }),
      GetNFTRanks({ ...params, key: 'SimpleArticleDonate' }),
    ])
    if (results) {
      if (results[0].code === 0) {
        ranks.issue = results[0].data.results.items
      }
      if (results[1].code === 0) {
        ranks.like = results[0].data.results.items
      }
      if (results[2].code === 0) {
        ranks.adonate = results[0].data.results.items
      }
    }
    resolve()
  })
}

function toPage(link: string) {
  if (link.indexOf('https://') !== -1 || link.indexOf('http://') !== -1) {
    window.open(link)
  } else {
    router.push(link)
  }
}

function toWallet() {
  window.open(import.meta.env.VITE_AuthUrl)
}

function comeSoon() {
  ElMessage.info(i18n.t('stayTuned'))
}

checkUserInfoFinish().then(() => {
  // getRecommendNftList()
  getNftList()
  getRanks()
})
</script>
<style lang="scss" scoped src="./Home.scss"></style>
