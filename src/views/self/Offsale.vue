<template>
  <NftListVue
    :nfts="nfts"
    :pagination="pagination"
    :isShowSkeleton="isShowNftListSkeleton"
    :isSelf="true"
    @get-more="getMore"
  />
</template>

<script setup lang="ts">
import { GetMyNftSummaryList } from '@/api'
import { useStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { pagination as initPagination } from '@/config'
import { reactive, ref } from 'vue'
import { checkUserInfoFinish, setDataStrclassify } from '@/utils/util'
import NftListVue from '@/components/NftList/NftList.vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const pagination = reactive({
  ...initPagination,
  pageSize: 12,
})
const store = useStore()
const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const nfts: NftItem[] = reactive([])
const isShowNftListSkeleton = ref(true)

function getMyNfts(isCover: boolean = false) {
  return new Promise<void>(async resolve => {
    const res = await GetMyNftSummaryList({
      Address: store.state.userInfo?.address,
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
          // @-ts-ignore
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
  pagination.page++
  getMyNfts()
}

checkUserInfoFinish().then(result => {
  if (result) {
    getMyNfts()
  } else {
    ElMessage.warning(i18n.t('toLoginTip'))
    router.push('/')
  }
})
</script>

<style lang="scss" scoped src="./Offsale.scss"></style>
