<template>
  <NftListVue
    :nfts="nfts"
    :pagination="pagination"
    :isShowSkeleton="isShowNftListSkeleton"
    :isSelf="store.state.userInfo && store.state.userInfo.metaId === route.params.metaId"
    @get-more="getMore"
  />
</template>

<script setup lang="ts">
import { GetDeadlineTime, GetMyOnSellNftList } from '@/api'
import { useStore } from '@/store'
import { useRoute } from 'vue-router'
import { pagination as initPagination } from '@/config'
import { reactive, ref } from 'vue'
import { setDataStrclassify } from '@/utils/util'
import NftListVue from '@/components/NftList/NftList.vue'
import { router } from '@/router'

const pagination = reactive({
  ...initPagination,
  pageSize: 12,
})
const store = useStore()
const route = useRoute()
const nfts: NftItem[] = reactive([])
const isShowNftListSkeleton = ref(true)

function getMyNfts(isCover: boolean = false) {
  return new Promise<void>(async resolve => {
    debugger
    const res = await GetMyOnSellNftList({
      MetaId: typeof route.params.metaId === 'string' ? route.params.metaId : '',
      Page: pagination.page.toString(),
      PageSize: pagination.pageSize.toString(),
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
          // @ts-ignore
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

function getMore() {
  pagination.page++
  getMyNfts()
}

getMyNfts()
</script>

<style lang="scss" scoped src="./Offsale.scss"></style>
