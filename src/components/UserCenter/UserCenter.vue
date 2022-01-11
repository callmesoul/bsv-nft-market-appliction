<template>
  <div class="user-msg">
    <div class="container">
      <ElSkeleton :loading="userInfoLoading" animated>
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
                <UserAvatar :metaId="user.metaId" :hasmask="false" />
              </div>
              <div class="name">{{ user.name }}</div>
              <div class="metaid flex flex-align-center">
                MetaID: {{ user.metaId.slice(0, 6) }}
                <a @click="store.state.sdk?.toTxLink(user.metaId)">{{ $t('txDetail') }}</a>
              </div>
              <CertTemp :metaId="user.metaId" />
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
  </div>

  <div class="section container">
    <div class="section-header flex flex-align-center">
      <div class="tab flex flex-align-center">
        <template v-for="(tab, index) in tabs" :key="index">
          <template
            v-if="
              index !== 0 ||
                (index === 0 && store.state.userInfo && store.state.userInfo.metaId === user.metaId)
            "
          >
            <router-link :to="{ path: tab.path }" :key="index">{{ tab.name }}</router-link>
          </template>
        </template>
      </div>
    </div>
    <slot></slot>
  </div>

  <!-- record -->
  <div class="record-modal">
    <ElDialog v-model="isShowRecordModal" custom-class="" top="0">
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
                  <a>
                    <ElSkeletonItem variant="text" style="width:10%" />
                  </a>
                </div>
              </div>
            </div>
          </template>
          <template #default>
            <div
              class="record-item flex"
              v-for="record in records"
              :key="record.nftSellTxId"
              @click="toDetail(record)"
            >
              <ElImage
                class="cover"
                :src="metafileUrl(record.nftIcon)"
                :lazy="true"
                :preview-src-list="[metafileUrl(record.nftIcon, 800)]"
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
                    <template v-if="recordTabIndex === 1">
                      {{ $t('buyer') }}:
                      <img :src="$filters.avatar(record.nftBuyerMetaId)" />
                      {{ record.nftBuyerName }}
                    </template>
                    <template v-else>
                      {{ $t('seller') }}:
                      <img :src="$filters.avatar(record.nftOwnerMetaId)" />
                      {{ record.nftOwnerName }}
                    </template>
                  </div>
                  <a @click.stop="store.state.sdk?.toTxLink(record.nftSellTxId)"
                    >{{ $t('look') }}TX</a
                  >
                </div>
              </div>
            </div>
            <!-- 加载更多 -->
            <LoadMore
              :pagination="recordPagination"
              @getMore="getMoreRecords"
              v-if="records.length > 0 && !isShowRcordSkeleton"
            />
            <!-- 内容为空 -->
            <IsNull v-else-if="records.length <= 0 && !isShowRcordSkeleton" />
          </template>
        </ElSkeleton>
      </div>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { GetMyNftOnShowBuySuccessList, GetMyNftOnShowSellSuccessList } from '@/api'
import { useStore } from '@/store'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import {
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElSkeleton,
  ElSkeletonItem,
  ElImage,
} from 'element-plus'
import { metafileUrl } from '@/utils/util'
import CertTemp from '@/components/Cert/Cert.vue'
import Decimal from 'decimal.js-light'
import dayjs from 'dayjs'
import { router } from '@/router'
const props = defineProps({
  userInfoLoading: {
    type: Boolean,
    default: true,
  },
  user: {
    type: Object,
    default: () => {
      return {
        metaId: '',
        name: '',
        address: '',
      }
    },
  },
  isHideAuthor: {
    type: Boolean,
    default: false,
  },
})

const i18n = useI18n()
const store = useStore()
const route = useRoute()
const recordPagination = reactive({
  ...store.state.pagination,
})
const recordTabs = [
  { name: i18n.t('purchaseHistory'), key: 'purchaseHistory' },
  { name: i18n.t('saleRecord'), key: 'saleRecord' },
]
const tabs = computed(() => {
  const metaId = route.params.metaId
  const key = store.state.userInfo && store.state.userInfo.metaId === metaId ? 'self' : 'user'

  return [
    { name: i18n.t('mynft'), val: 1, path: `/${key}/${metaId}/offsale` },
    {
      name:
        store.state.userInfo && store.state.userInfo.metaId === props.user.metaId
          ? i18n.t('mySellNft')
          : i18n.t('SellNft'),
      val: 2,
      path: `/${key}/${metaId}/sale`,
    },
    {
      name:
        store.state.userInfo && store.state.userInfo.metaId === props.user.metaId
          ? i18n.t('myAuctionNFT')
          : i18n.t('AuctionNFT'),
      val: 3,
      path: `/${key}/${metaId}/auction`,
    },
  ]
})
const isShowRcordSkeleton = ref(true)
const records: GetMyNftOnShowSellSuccessListResItem[] = reactive([])
const recordTabIndex = ref(0)
const isShowRecordModal = ref(false)

function openUrl(type: string) {
  let url =
    type === 'showBuzz'
      ? `https://www.showbuzz.app/user_index/user_buzz/${props.user.metaId}`
      : `https://metacenter.top/#/pages/index/indexCenter?metaId=${props.user.metaId}`
  window.open(url)
}

function getMoreRecords() {
  recordPagination.loading = true
  recordPagination.page++
  getRecordList().then(() => {
    recordPagination.loading = false
  })
}

async function getRecordList(isCover: boolean = false) {
  return new Promise<void>(async resolve => {
    let res
    const params = {
      MetaId: typeof route.params.metaId === 'string' ? route.params.metaId : '',
      Page: recordPagination.page.toString(),
      PageSize: recordPagination.pageSize.toString(),
    }
    if (recordTabIndex.value === 1) {
      res = await GetMyNftOnShowSellSuccessList(params)
    } else {
      res = await GetMyNftOnShowBuySuccessList(params)
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

function changeRecordTab(index: number) {
  if (recordTabIndex.value === index) return
  recordPagination.page = 1
  recordPagination.loading = false
  recordPagination.nothing = false
  recordTabIndex.value = index
  getRecordList(true)
}

function openRecordModal() {
  getRecordList(true)
  isShowRecordModal.value = true
}

function toDetail(record: GetMyNftOnShowSellSuccessListResItem) {
  router.push({
    name: 'detail',
    params: {
      genesisId: record.nftGenesis,
      codehash: record.nftCodehash,
      tokenIndex: record.nftTokenIndex,
    },
  })
}
</script>

<style lang="scss" scoped src="./UserCenter.scss"></style>
