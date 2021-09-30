<template>
  <div class="user-msg">
    <div class="container">
      <ElSkeleton :loading="store.state.userInfoLoading" animated>
        <template #template>
          <div class="user-msg-warp flex flex-align-center flex-pack-center">
            <div class="flex-box">
              <div class="avatar">
                <ElSkeletonItem variant="image" />
              </div>
              <div class="name"><ElSkeletonItem variant="text" /></div>
              <div class="metaid flex flex-align-center">
                <ElSkeletonItem variant="text" />
              </div>
              <ElSkeletonItem variant="text" />
            </div>
            <!-- operate -->
            <div class="operate flex flex-align-center">
              <ElSkeletonItem variant="text" />
            </div>
          </div>
        </template>
        <template #default>
          <div class="user-msg-warp flex flex-align-center flex-pack-center">
            <div class="flex-box">
              <div class="avatar">
                <NftUserAvatar
                  :metaId="store.state.userInfo ? store.state.userInfo.metaId : ''"
                  :hasmask="false"
                />
              </div>
              <div class="name">{{ store.state.userInfo?.name }}</div>
              <div class="metaid flex flex-align-center">
                MetaID: {{ store.state.userInfo?.metaId.slice(0, 6) }}
                <a @click="toTxLink">{{ $t('txDetail') }}</a>
              </div>
              <CertTemp />
            </div>
            <!-- operate -->
            <div class="operate flex flex-align-center">
              <div class="operate-item flex flex-align-center" @click="openRecordModal">
                <img src="@/assets/images/me_icon_record.svg" />
                {{ $t('ransactionRecord') }}
              </div>
              <div class="operate-item flex flex-align-center">
                <img src="@/assets/images/me_icon_more.svg" />
                {{ $t('more') }}
                <ElDropdown class="operate-item" trigger="click" placement="bottom-end">
                  <span class="el-dropdown-link">Dropdown List</span>
                  <template #dropdown>
                    <ElDropdownMenu class="more-list">
                      <ElDropdownItem
                        class="more-item flex flex-align-center"
                        @click="openUrl('showBuzz')"
                      >
                        <img src="@/assets/images/logo_showbuzz@2x.png" />
                        {{ $t('look') }}ShowBuzz
                      </ElDropdownItem>
                      <ElDropdownItem
                        class="more-item flex flex-align-center"
                        @click="openUrl('metaCenter')"
                      >
                        <img src="@/assets/images/logo_metacenter@2x.png" />
                        {{ $t('look') }}MetaCenter
                      </ElDropdownItem>
                    </ElDropdownMenu>
                  </template>
                </ElDropdown>
              </div>
            </div>
          </div>
        </template>
      </ElSkeleton>
    </div>

    <!-- record -->
    <ElDialog v-model="isShowRecordModal" custom-class="record-modal">
      <template #title>
        <div class="tab record-tab">
          <a
            v-for="(tab, index) in recordTabs"
            :class="{ active: index === recordTabIndex }"
            @click="changeRecordTab(index)"
            >{{ $t(tab.key) }}</a
          >
        </div>
      </template>
      <div class="record-list">
        <ElSkeleton :loading="isShowRcordSkeleton" animated :count="recordPagination.pageSize">
          <template #template>
            <div class="record-item flex">
              <ElSkeletonItem variant="image" class="cover" />
              <div class="cont flex1 flex flex-v flex-pack-justify">
                <div class="top flex flex flex-align-center">
                  <div class="title flex1">
                    <ElSkeletonItem variant="text" style="width:40%" />
                  </div>
                  <div class="price" :class="{ active: recordTabIndex === 1 }">
                    <ElSkeletonItem variant="text" style="width:20%" />
                  </div>
                </div>
                <div class="time">
                  <ElSkeletonItem variant="text" style="width:20%" />
                </div>
                <div class="bottom flex flex-align-center">
                  <div class="seller flex1 flex flex-align-center">
                    <ElSkeletonItem variant="text" style="width:30%" />
                  </div>
                  <a @click="store.state.sdk?.toTxLink('')">
                    <ElSkeletonItem variant="text" style="width:10%" />
                  </a>
                </div>
              </div>
            </div>
          </template>
          <template #default>
            <div class="record-item flex" v-for="record in records" :key="record.nftSellTxId">
              <ElImage
                class="cover"
                :src="metafileUrl(record.nftIcon)"
                :lazy="true"
                :preview-src-list="[]"
                fit="contain"
              />
              <div class="cont flex1 flex flex-v flex-pack-justify">
                <div class="top flex flex flex-align-center">
                  <div class="title flex1">
                    {{ recordTabIndex === 0 ? $t('buy') : $t('sell') }} {{ record.nftName }}
                  </div>
                  <div
                    class="price flex flex-align-center"
                    :class="{ active: recordTabIndex === 1 }"
                  >
                    {{ recordTabIndex === 0 ? '-' : '+'
                    }}{{ new Decimal(record.nftPrice).div(Math.pow(10, 8)).toString() }} BSV
                  </div>
                </div>
                <div class="time">
                  {{ dayjs(record.nftBuyerTimestamp).format('YYYY-MM-DD HH:mm') }}
                </div>
                <div class="bottom flex flex-align-center">
                  <div class="seller flex1 flex flex-align-center">
                    <template v-if="recordTabIndex === 0">
                      {{ recordTabIndex === 0 ? $t('seller') : $t('buyer') }}:
                      <img :src="$filters.avatar(record.nftBuyerMetaId)" />
                      {{ record.nftBuyerName }}
                    </template>
                    <template v-else>
                      {{ $t('buyer') }}:
                      <img :src="$filters.avatar(record.nftOwnerMetaId)" />
                      {{ record.nftOwnerName }}
                    </template>
                  </div>
                  <a @click="store.state.sdk?.toTxLink('')">{{ $t('look') }}TX</a>
                </div>
              </div>
            </div>
            <div class="record-item flex" v-for="record in records" :key="record.nftSellTxId">
              <ElImage
                class="cover"
                :src="metafileUrl(record.nftIcon)"
                :lazy="true"
                :preview-src-list="[]"
                fit="contain"
              />
              <div class="cont flex1 flex flex-v flex-pack-justify">
                <div class="top flex flex flex-align-center">
                  <div class="title flex1">
                    {{ recordTabIndex === 0 ? $t('buy') : $t('sell') }} {{ record.nftName }}
                  </div>
                  <div
                    class="price flex flex-align-center"
                    :class="{ active: recordTabIndex === 1 }"
                  >
                    {{ recordTabIndex === 0 ? '-' : '+'
                    }}{{ new Decimal(record.nftPrice).div(Math.pow(10, 8)).toString() }} BSV
                  </div>
                </div>
                <div class="time">
                  {{ dayjs(record.nftBuyerTimestamp).format('YYYY-MM-DD HH:mm') }}
                </div>
                <div class="bottom flex flex-align-center">
                  <div class="seller flex1 flex flex-align-center">
                    <template v-if="recordTabIndex === 0">
                      {{ recordTabIndex === 0 ? $t('seller') : $t('buyer') }}:
                      <img :src="$filters.avatar(record.nftBuyerMetaId)" />
                      {{ record.nftBuyerName }}
                    </template>
                    <template v-else>
                      {{ $t('buyer') }}:
                      <img :src="$filters.avatar(record.nftOwnerMetaId)" />
                      {{ record.nftOwnerName }}
                    </template>
                  </div>
                  <a @click="store.state.sdk?.toTxLink('')">{{ $t('look') }}TX</a>
                </div>
              </div>
            </div>
            <!-- 加载更多 -->
            <LoadMore
              :pagination="recordPagination"
              @getMore="getMoreRecords"
              v-if="records.length > 0 && !isShowNftListSkeleton"
            />
            <!-- 内容为空 -->
            <IsNull v-else-if="records.length <= 0 && !isShowNftListSkeleton" />
          </template>
        </ElSkeleton>
      </div>
    </ElDialog>
  </div>

  <!--
    <div class="banner container">
      <a class="banner-item">
        <img class="cover" src="@/assets/images/banner_bg.svg" />
        <div class="cont">
          <div class="cont-warp">
            <div>
              <div class="title">{{ $t('selfTitle') }}</div>
              <div class="drsc">{{ $t('selfDrsc') }}</div>
            </div>
            <router-link :to="{ name: 'create' }" class="btn" v-if="!store.state.isApp"
              >{{ $t('start') }}<img class="icon-right" src="@/assets/images/btn_ins.svg"
            /></router-link>
          </div>
        </div>
      </a>
  </div>-->

  <div class="section container">
    <div class="section-header flex flex-align-center">
      <div class="tab flex flex-align-center">
        <a
          :class="{ active: index === tabIndex }"
          v-for="(tab, index) in tabs"
          :key="index"
          @click="changeTabIndex(index)"
          >{{ tab.name }}</a
        >
      </div>
    </div>
    <NftSkeleton
      :loading="isShowNftListSkeleton"
      :count="pagination.pageSize"
      class="section-cont nft-list"
    >
      <template #default>
        <div class="section-cont nft-list">
          <template v-for="nft in nfts">
            <NftItem :item="nft" :isSelf="true" />
          </template>
        </div>
      </template>
    </NftSkeleton>
  </div>

  <LoadMore :pagination="pagination" @getMore="getMore" v-if="nfts.length > 0" />

  <div class="nft-null flex flex-align-center flex-pack-center" v-if="nfts.length <= 0">
    <div>
      <img src="@/assets/images/default_icon_casting.svg" />
      <div class="tips">
        {{ $t('nftNullTips') }}
        <router-link :to="{ name: 'create' }">{{ $t('Casting') }}</router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  GetDeadlineTime,
  GetMyNftOnShowBuySuccessList,
  GetMyNftOnShowSellSuccessList,
  GetMyNftSummaryList,
  GetMyOnSellNftList,
} from '@/api'
import NftItem from '@/components/Nft-item/Nft-item.vue'
import { useStore } from '@/store'
import { reactive, ref } from 'vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '../components/IsNull/IsNull.vue'
import NftSkeleton from '@/components/NftSkeleton/NftSkeleton.vue'
import { useI18n } from 'vue-i18n'
import {
  ElMessage,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElDialog,
  ElImage,
  ElSkeleton,
  ElSkeletonItem,
} from 'element-plus'
import { router } from '@/router'
import { setDataStrclassify, metafileUrl } from '@/utils/util'
import NftUserAvatar from '@/components/NftUserAvatar/NftUserAvatar.vue'
import CertTemp from '@/components/Cert/Cert.vue'
import Decimal from 'decimal.js-light'
import dayjs from 'dayjs'

const i18n = useI18n()
const store = useStore()
const pagination = reactive({
  ...store.state.pagination,
  pageSize: 12,
})
const selledPagination = reactive({
  ...store.state.pagination,
  pageSize: 12,
})
const recordPagination = reactive({
  ...store.state.pagination,
})
const tabs = [{ name: i18n.t('mynft') }, { name: i18n.t('mySellNft') }]
const recordTabs = [
  { name: i18n.t('purchaseHistory'), key: 'purchaseHistory' },
  { name: i18n.t('saleRecord'), key: 'saleRecord' },
]
const tabIndex = ref(0)
const nfts: NftItem[] = reactive([])
const selledNfts: NftItem[] = reactive([])
const isShowNftListSkeleton = ref(true)
const isShowSelledNftListSkeleton = ref(true)
const seriesList: NFTSeriesItem[] = reactive([])
const isShowRecordModal = ref(false)
const recordTabIndex = ref(0)
const isShowRcordSkeleton = ref(true)
const records: GetMyNftOnShowSellSuccessListResItem[] = reactive([])

function changeTabIndex(index: number) {
  isShowNftListSkeleton.value = true
  tabIndex.value = index
  pagination.loading = false
  pagination.nothing = false
  pagination.page = 1
  if (tabIndex.value === 0) {
    getMyNfts(true)
  } else {
    getMySelledNfts(true)
  }
}

function getMyNfts(isCover: boolean = false) {
  return new Promise<void>(async resolve => {
    const res = await GetMyNftSummaryList({
      Address: store.state.userInfo!.address,
      Page: pagination.page.toString(),
      PageSize: pagination.pageSize.toString(),
    })
    if (res && res.code === 0) {
      if (isCover) {
        nfts.length = 0
      }
      if (res.data.results.items.length > 0) {
        res.data.results.items.map(item => {
          const nft =
            item.nftDetailItemList && item.nftDetailItemList[0]
              ? item.nftDetailItemList[0]
              : undefined
          const count = item.nftMyCount + item.nftMyPendingCount
          const name =
            count > 1 && item.nftSeriesName && item.nftSeriesName !== ''
              ? item.nftSeriesName
              : item.nftName
              ? item.nftName
              : '--'
          const data:
            | {
                nftname: string
                nftdesc: string
                nfticon: string
                nftwebsite: string
                nftissuerName: string
                nftType: string
                classifyList: string
                originalFileTxid: string
                contentTxId: string
              }
            | undefined = nft && nft.nftDataStr !== '' ? JSON.parse(nft.nftDataStr) : undefined
          const classify = setDataStrclassify(data)
          nfts.push({
            name: name,
            amount: 0,
            foundryName: item.nftIssuer,
            classify: classify,
            head: '',
            tokenId: item.nftGenesis + item.nftCodehash + item.nftTokenIndex,
            coverUrl: item.nftIcon,
            putAway: item.nftIsReady,
            metaId: item.nftIssueMetaId,
            productName: name,
            deadlineTime: 0,
            genesis: item.nftGenesis,
            tokenIndex: nft?.nftTokenIndex ? nft?.nftTokenIndex : '',
            codehash: item.nftCodehash,
            total: item.nftTotalSupply,
            hasCount: count,
            ownerAvatarType: item.nftOwnerAvatarType,
            issueUserAvatarType: item.nftIssueAvatarType,
          })
        })
      } else {
        pagination.nothing = true
      }
    }
    isShowNftListSkeleton.value = false
    resolve()
  })
}

function getMore() {
  pagination.loading = true
  pagination.page++
  getMyNfts().then(() => {
    pagination.loading = false
  })
}

function getMoreRecords() {
  recordPagination.loading = true
  recordPagination.page++
  getRecordList().then(() => {
    recordPagination.loading = false
  })
}

function getMySelledNfts(isCover: boolean = false) {
  return new Promise<void>(async resolve => {
    const res = await GetMyOnSellNftList({
      Page: selledPagination.page.toString(),
      PageSize: selledPagination.pageSize.toString(),
      Address: store.state.userInfo!.address,
      metaId: store.state.userInfo!.metaId,
    })
    if (res && res.code === 0) {
      if (isCover) {
        nfts.length = 0
      }
      if (res.data.results.items.length > 0) {
        for (let i = 0; i < res.data.results.items.length; i++) {
          const item = res.data.results.items[i]
          const data = item.nftDataStr ? JSON.parse(item.nftDataStr) : null
          const deadlineTimeRes = await GetDeadlineTime({
            codeHash: item.nftCodehash,
            genesis: item.nftGenesis,
            tokenIndex: item.nftTokenIndex,
          })
          const classify = setDataStrclassify(data)
          nfts.push({
            name: item.nftName ? item.nftName : '--',
            amount: item.nftPrice,
            foundryName: item.nftIssuer,
            classify: classify,
            head: '',
            tokenId: item.nftGenesis + item.nftTokenIndex,
            coverUrl: item.nftIcon,
            putAway: item.nftIsReady,
            metaId: item.nftOwnerMetaId,
            productName: item.nftName,
            deadlineTime:
              deadlineTimeRes && deadlineTimeRes.data && deadlineTimeRes.data.deadlineTime
                ? deadlineTimeRes.data.deadlineTime
                : null,
            genesis: item.nftGenesis,
            tokenIndex: item.nftTokenIndex,
            codehash: item.nftCodehash,
          })
        }
      } else {
        pagination.nothing = true
      }
    }
    isShowNftListSkeleton.value = false
    resolve()
  })
}

function toTxLink() {
  if (store.state.userInfo) {
    store.state.sdk?.toTxLink(store.state.userInfo.metaId)
  }
}

function openUrl(type: string) {
  let url =
    type === 'showBuzz'
      ? `https://www.showbuzz.app/user_index/user_buzz/${store.state.userInfo?.metaId}`
      : `https://metacenter.top/#/pages/index/indexCenter?metaId=${store.state.userInfo?.metaId}`
  window.open(url)
}

function changeRecordTab(index: number) {
  if (recordTabIndex.value === index) return
  recordPagination.page = 1
  recordPagination.loading = false
  recordPagination.nothing = false
  recordTabIndex.value = index
  getRecordList(true)
}

function openRecordModal() {
  isShowRecordModal.value = true
  getRecordList(true)
}

async function getRecordList(isCover: boolean = false) {
  return new Promise<void>(async resolve => {
    let res
    if (recordTabIndex.value === 0) {
      res = await GetMyNftOnShowSellSuccessList({
        MetaId: store.state.userInfo!.metaId,
        Page: recordPagination.page.toString(),
        PageSize: recordPagination.pageSize.toString(),
      })
    } else {
      res = await GetMyNftOnShowBuySuccessList({
        MetaId: store.state.userInfo!.metaId,
        Page: recordPagination.page.toString(),
        PageSize: recordPagination.pageSize.toString(),
      })
    }
    if (res.code === 0) {
      if (isCover) records.length = 0
      records.push(...res.data.results.items)
      isShowRcordSkeleton.value = false
      const totalPages = Math.ceil(res.data.total / recordPagination.pageSize)
      if (recordPagination.page >= totalPages) {
        recordPagination.nothing = true
      }
    }
    resolve()
  })
}

if (store.state.token) {
  // 还没拿到用户信息的时候要等待拿用户信息完再调接口
  if (store.state.userInfo) {
    getMyNfts()
  } else {
    store.watch(
      state => state.userInfo,
      () => {
        getMyNfts()
      }
    )
  }
} else {
  ElMessage.warning(i18n.t('toLoginTip'))
  router.replace('/')
}
</script>
<style lang="scss" scoped src="./Self.scss"></style>
