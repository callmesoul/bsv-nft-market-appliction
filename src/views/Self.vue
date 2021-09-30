<template>
  <UserCenter
    ref="root"
    :user-info-loading="store.state.userInfoLoading"
    :user="{ metaId: store.state.userInfo?.metaId, name: store.state.userInfo?.name }"
    @openRecordModal="openRecordModal"
  />
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
                <a>
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
                <div class="price flex flex-align-center" :class="{ active: recordTabIndex === 1 }">
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
                <a @click="store.state.sdk?.toTxLink(record.nftSellTxId)">{{ $t('look') }}TX</a>
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
</template>
<script setup lang="ts">
import {
  GetDeadlineTime,
  GetMetaIdInfo,
  GetMyNftOnShowBuySuccessList,
  GetMyNftOnShowSellSuccessList,
  GetMyNftSummaryList,
  GetMyOnSellNftList,
} from '@/api'
import NftItem from '@/components/Nft-item/Nft-item.vue'
import { useStore } from '@/store'
import { onMounted, reactive, ref } from 'vue'
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
import { setDataStrclassify, metafileUrl } from '@/utils/util'
import NftUserAvatar from '@/components/NftUserAvatar/NftUserAvatar.vue'
import CertTemp from '@/components/Cert/Cert.vue'
import Decimal from 'decimal.js-light'
import dayjs from 'dayjs'
import { useRoute, useRouter } from 'vue-router'
import { router } from '@/router'
import UserCenter from '@/components/UserCenter/UserCenter.vue'

const root = ref(null)
const i18n = useI18n()
const store = useStore()
const recordPagination = reactive({
  ...store.state.pagination,
})
const recordTabs = [
  { name: i18n.t('purchaseHistory'), key: 'purchaseHistory' },
  { name: i18n.t('saleRecord'), key: 'saleRecord' },
]

const isShowRecordModal = ref(false)
const recordTabIndex = ref(0)
const isShowRcordSkeleton = ref(true)
const records: GetMyNftOnShowSellSuccessListResItem[] = reactive([])
const currentUser: { metaId: string; name: string; address?: string } = reactive({
  metaId: '',
  name: '',
})
const metaId = ref('')
const address = ref('')

function getMoreRecords() {
  recordPagination.loading = true
  recordPagination.page++
  getRecordList().then(() => {
    recordPagination.loading = false
  })
}

function toTxLink() {
  if (store.state.userInfo) {
    store.state.sdk?.toTxLink(store.state.userInfo.metaId)
  }
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

onMounted(() => {
  console.log('===========a========')
  console.log(root.value)
  console.log(UserCenter)
})

async function getRecordList(isCover: boolean = false) {
  return new Promise<void>(async resolve => {
    let res
    if (recordTabIndex.value === 1) {
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
onMounted(() => {})
</script>
<style lang="scss" scoped src="./Self.scss"></style>
