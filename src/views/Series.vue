<template>
  <div class="self">
    <!-- <div class="banner container">
            <a class="banner-item">
                <img class="cover" src="@/assets/images/banner_bg.svg" />
                <div class="cont">
                    <div class="cont-warp">
                        <div>
                            <div class="title">{{$t('selfTitle')}}</div>
                            <div class="drsc">{{$t('selfDrsc')}}</div>
                        </div>
                        <router-link :to="{ name: 'create' }" class="btn">{{$t('start')}}<img class="icon-right" src="@/assets/images/btn_ins.svg" /></router-link>
                    </div>
                </div>
            </a>
        </div> -->

    <div class="section container">
      <div class="section-header flex flex-align-center">
        <div class="title flex1">
          <img src="@/assets/images/bannet_icon_ins.svg" @click="router.back()" />{{
            route.query.name
          }}
        </div>
      </div>
      <NftSkeleton
        :loading="isShowNftListSkeleton"
        :count="pagination.pageSize"
        class="section-cont nft-list"
      >
        <template #default>
          <div class="section-cont nft-list">
            <template v-for="nft in nfts" :key="nft.tokenId">
              <NftItem :item="nft" :isSelf="true" />
            </template>
          </div>
        </template>
      </NftSkeleton>
    </div>
    <LoadMore :pagination="pagination" @getMore="getMore" />
  </div>
</template>
<script setup lang="ts">
import { GetMySelledNfts, GetNftIssue, GetSeriesNftList, MyNfts, NftApiCode } from '@/api'
import NftItem from '@/components/Nft-item/Nft-item.vue'
import { useStore } from '@/store'
import { reactive, ref, onMounted } from 'vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import NftSkeleton from '@/components/NftSkeleton/NftSkeleton.vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { setDataStrclassify } from '@/utils/util'

const store = useStore()
const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const pagination = reactive({
  ...store.state.pagination,
  pageSize: 12,
})
const nfts: NftItem[] = reactive([])
const isShowNftListSkeleton = ref(true)

function getMyNfts(isCover: boolean = false) {
  return new Promise<void>(async resolve => {
    const res = await GetSeriesNftList({
      Page: pagination.page.toString(),
      PageSize: pagination.pageSize.toString(),
      Address: store.state.userInfo!.address,
      // Address: store.state.userInfo!.address,
      codehash: typeof route.params.codehash === 'string' ? route.params.codehash : '',
      genesis: typeof route.params.genesisId === 'string' ? route.params.genesisId : '',
    })
    if (res && res.code === 0) {
      if (isCover) {
        nfts.length = 0
      }
      if (res.data.results.items.length > 0) {
        res.data.results.items.map(item => {
          const data = item.nftDataStr ? JSON.parse(item.nftDataStr) : undefined
          const classify = setDataStrclassify(data)
          nfts.push({
            name: item.nftName ? item.nftName : '--',
            amount: 0,
            foundryName: store.state.userInfo!.name,
            classify: classify,
            tokenId: item.nftGenesis + item.nftTokenIndex,
            coverUrl: item.nftIcon,
            putAway: item.nftIsReady,
            metaId: item.nftOwnerMetaId,
            productName: item.nftName,
            genesis: item.nftGenesis,
            codehash: item.nftCodehash,
            tokenIndex: item.nftTokenIndex,
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

onMounted(() => {
  pagination.page = 1
  if (store.state.token) {
    // 还没拿到用户信息的时候要等待拿用户信息完再调接口
    if (store.state.userInfo) {
      getMyNfts(true)
    } else {
      store.watch(
        state => state.userInfo,
        () => {
          getMyNfts(true)
        }
      )
    }
  } else {
    ElMessage.warning(i18n.t('toLoginTip'))
    router.replace('/')
  }
})
</script>
<style lang="scss" scoped src="./Series.scss"></style>
