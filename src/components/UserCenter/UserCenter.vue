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
              <div
                class="operate-item flex flex-align-center"
                @click="openRecordModal"
                v-if="store.state.userInfo && store.state.userInfo.metaId === user.metaId"
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
            <router-link :to="{ path: tab.path }" :key="index">{{ tab.name }}</router-link>
          </template>
        </template>
      </div>
    </div>
    <slot></slot>
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
const tabValue = ref(1)
const nfts: NftItem[] = reactive([])
const isShowNftListSkeleton = ref(true)

function openUrl(type: string) {
  let url =
    type === 'showBuzz'
      ? `https://www.showbuzz.app/user_index/user_buzz/${props.user.metaId}`
      : `https://metacenter.top/#/pages/index/indexCenter?metaId=${props.user.metaId}`
  window.open(url)
}

function openRecordModal() {
  emit('openRecordModal')
}
</script>

<style lang="scss" scoped src="./UserCenter.scss"></style>
