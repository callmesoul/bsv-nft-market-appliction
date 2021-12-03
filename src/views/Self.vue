<template>
  <UserCenter
    ref="root"
    :user-info-loading="store.state.userInfoLoading"
    :user="user"
    :isHideAuthor="true"
    @openRecordModal="openRecordModal"
  />
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
            <div class="record-item flex" v-for="record in records" :key="record.nftSellTxId">
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
                  <a @click="store.state.sdk?.toTxLink(record.nftSellTxId)">{{ $t('look') }}TX</a>
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
import { onMounted, reactive, ref } from 'vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '../components/IsNull/IsNull.vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElDialog, ElImage, ElSkeleton, ElSkeletonItem } from 'element-plus'
import { metafileUrl } from '@/utils/util'
import Decimal from 'decimal.js-light'
import dayjs from 'dayjs'
import { router } from '@/router'
import UserCenter from '@/components/UserCenter/UserCenter.vue'

const root = ref()
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

const user = reactive({
  name: store.state.userInfo?.name,
  metaId: store.state.userInfo?.metaId,
  address: store.state.userInfo?.address,
})

function getMoreRecords() {
  recordPagination.loading = true
  recordPagination.page++
  getRecordList().then(() => {
    recordPagination.loading = false
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
  isShowRecordModal.value = true
  getRecordList(true)
}

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

onMounted(() => {
  if (store.state.token) {
    // 还没拿到用户信息的时候要等待拿用户信息完再调接口
    if (store.state.userInfo) {
      root.value.getMyNfts()
    } else {
      store.watch(
        state => state.userInfo,
        userInfo => {
          if (userInfo) {
            ;(user.name = store.state.userInfo?.name),
              (user.metaId = store.state.userInfo?.metaId),
              (user.address = store.state.userInfo?.address),
              root.value.getMyNfts()
          }
        }
      )
    }
  } else {
    ElMessage.warning(i18n.t('toLoginTip'))
    router.replace('/')
  }
})
</script>
<style lang="scss" scoped src="./Self.scss"></style>
