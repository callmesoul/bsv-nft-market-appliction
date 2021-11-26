<template>
  <!-- banner -->
  <div class="banner container">
    <!-- <a @click="toPage('/collection/detail/DatoBird')"
      ><img src="@/assets/images/bigbird.jpg" alt="雅典娜"
    /></a> -->
    <a href="/collection/detail/MetaElfLandRightCard" v-if="i18n.locale.value === 'zh'"
      ><img src="@/assets/images/metaelf_cn.png" alt="metaelf"
    /></a>
    <a v-else href="/collection/detail/MetaElfLandRightCard"
      ><img src="@/assets/images/metaelf_en.png" alt="metaelf"
    /></a>
  </div>

  <div class="home">
    <!-- 推荐作品 -->
    <div class="section container recommend-section">
      <NftSkeleton
        :loading="isShowRecommendSkeleton"
        :count="8"
        :isReCommend="true"
        class="section-cont nft-list"
      >
        <template #default>
          <div class="section-cont nft-list">
            <!-- @ts-ignore -->
            <NftItem
              :isRecommendCard="true"
              :item="{
                name: 'recommend',
                amount: 0,
                foundryName: '',
                classify: [],
                tokenId: '',
                coverUrl: '',
                metaId: '',
                genesis: '',
                tokenIndex: '',
                codehash: '',
              }"
            />
            <template v-for="item in recommendNfts">
              <NftItem :item="item" />
            </template>
          </div>
        </template>
      </NftSkeleton>
    </div>

    <!-- nft 模块 -->
    <div class="nft-muodle">
      <div class="container">
        <div class="title">{{ $t('nftModuleTitle') }}</div>
        <div class="nft-module-list flex ">
          <!-- 海量应用场景 -->
          <div class="nft-module-item flex1">
            <div class="nft-module-item-warp">
              <div class="icon">
                <img src="@/assets/images/img_2.svg" />
              </div>
              <div class="name">{{ $t('nftModuleName1') }}</div>
              <div class="drsc">
                <div>
                  {{ $t('nftModuleDrsc1') }}
                </div>
              </div>
            </div>
          </div>

          <!-- 极低的铸造费用 -->
          <div class="nft-module-item flex1">
            <div class="nft-module-item-warp">
              <div class="icon">
                <img src="@/assets/images/img_1.svg" />
              </div>
              <div class="name">{{ $t('nftModuleName2') }}</div>
              <div class="drsc">
                <div>
                  {{ $t('nftModuleDrsc2') }}
                </div>
              </div>
            </div>
          </div>

          <!-- 覆盖全网用户 -->
          <div class="nft-module-item flex1">
            <div class="nft-module-item-warp">
              <div class="icon">
                <img src="@/assets/images/img_4.svg" />
              </div>
              <div class="name">{{ $t('nftModuleName3') }}</div>
              <div class="drsc">
                <div>
                  {{ $t('nftModuleDrsc3') }}
                </div>
              </div>
            </div>
          </div>

          <!-- 创作者认证 -->
          <div class="nft-module-item flex1">
            <div class="nft-module-item-warp">
              <div class="icon">
                <img src="@/assets/images/img_3.svg" />
              </div>
              <div class="name">{{ $t('nftModuleName4') }}</div>
              <div class="drsc">
                <div>
                  {{ $t('nftModuleDrsc4') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 所有类别 -->
    <div class="section container">
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
        @search="search"
        @changeClassify="changeClassify"
        @getMore="getMore"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  CertificationType,
  GetAllOnSellNftList,
  GetNftOnShowListByClassify,
  GetNftOnShowListBySearch,
  GetRecommendOnSellNftList,
  NftApiCode,
} from '@/api'
import NftItem from '@/components/Nft-item/Nft-item.vue'
import NftSkeleton from '@/components/NftSkeleton/NftSkeleton.vue'
import { useStore } from '@/store'
import { reactive, ref } from 'vue'
import SetHomeDatas from '@/utils/homeSetData'
import NftList from '@/components/NftList/NftList.vue'
import { classifyList } from '@/config'
import { router } from '@/router'
import { ElPopover } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

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

getRecommendNftList()
getNftList()
</script>
<style lang="scss" scoped src="./Home.scss"></style>
