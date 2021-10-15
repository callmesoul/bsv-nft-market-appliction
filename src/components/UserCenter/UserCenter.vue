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
                <NftUserAvatar :metaId="user.metaId" :hasmask="false" />
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
              <div
                class="operate-item flex flex-align-center"
                @click="openRecordModal"
                v-if="route.name === 'self'"
              >
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
            <a
              :class="{ active: index === tabIndex }"
              :key="index"
              @click="changeTabIndex(index)"
              >{{ tab.name }}</a
            >
          </template>
        </template>
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
            <NftItem :item="nft" :isSelf="true" :isHideAuthor="isHideAuthor && tabIndex === 1" />
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
        <template v-if="store.state.userInfo && store.state.userInfo.metaId === user.metaId">
          {{ $t('nftNullTips') }}
          <router-link :to="{ name: 'create' }">{{ $t('Casting') }}</router-link>
        </template>
        <template v-else>{{ $t('isNull') }}</template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GetDeadlineTime, GetMyNftSummaryList, GetMyOnSellNftList } from '@/api'
import { useStore } from '@/store'
import { setDataStrclassify } from '@/utils/util'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import NftItem from '@/components/Nft-item/Nft-item.vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import NftSkeleton from '@/components/NftSkeleton/NftSkeleton.vue'
import {
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElMessage,
  ElSkeleton,
  ElSkeletonItem,
} from 'element-plus'
import { metafileUrl } from '@/utils/util'
import NftUserAvatar from '@/components/NftUserAvatar/NftUserAvatar.vue'
import CertTemp from '@/components/Cert/Cert.vue'
import Decimal from 'decimal.js-light'
import dayjs from 'dayjs'
import { router } from '@/router'

const emit = defineEmits(['openRecordModal'])
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
const pagination = reactive({
  ...store.state.pagination,
  pageSize: 12,
})
const tabs = computed(() => {
  return [
    { name: i18n.t('mynft') },
    {
      name:
        store.state.userInfo && store.state.userInfo.metaId === props.user.metaId
          ? i18n.t('mySellNft')
          : i18n.t('SellNft'),
    },
  ]
})
const tabIndex = ref(0)
const nfts: NftItem[] = reactive([])
const isShowNftListSkeleton = ref(true)

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
      Address: props.user.address,
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

function getMySelledNfts(isCover: boolean = false) {
  return new Promise<void>(async resolve => {
    const res = await GetMyOnSellNftList({
      Page: pagination.page.toString(),
      PageSize: pagination.pageSize.toString(),
      MetaId: props.user.metaId,
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
            metaId: item.nftIssueMetaId,
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

function openUrl(type: string) {
  let url =
    type === 'showBuzz'
      ? `https://www.showbuzz.app/user_index/user_buzz/${props.user.metaId}`
      : `https://metacenter.top/#/pages/index/indexCenter?metaId=${props.user.metaId}`
  window.open(url)
}

function getMore() {
  pagination.loading = true
  pagination.page++
  if (tabIndex.value === 0) {
    getMyNfts().then(() => {
      pagination.loading = false
    })
  } else {
    getMySelledNfts().then(() => {
      pagination.loading = false
    })
  }
}

function openRecordModal() {
  emit('openRecordModal')
}

defineExpose({
  getMyNfts,
  getMySelledNfts,
  changeTabIndex,
})
</script>

<style lang="scss" scoped src="./UserCenter.scss"></style>
