<template>
  <div class="auction-list container">
    <template v-for="auction in auctions">
      <AuctionItemVue :auction="auction"></AuctionItemVue>
    </template>

    <LoadMore :pagination="pagination" @getMore="getMore" v-if="auctions.length > 0" />
    <IsNull v-else />
  </div>
</template>

<script setup lang="ts">
import { GetAuctionList, GetUserAuctionList } from '@/api'
import { pagination as initPagination } from '@/config'
import { useStore } from '@/store'
import { reactive } from 'vue'
import AuctionItemVue from './AuctionItem.vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '@/components/IsNull/IsNull.vue'

interface Props {
  isUser: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isUser: false,
})

const pagination = reactive({ ...initPagination })
const auctions: GetAuctionListResItem[] = reactive([])
const store = useStore()

function getAuctionList(isCover = false) {
  return new Promise<void>(async resolve => {
    let res
    if (props.isUser) {
      res = await GetUserAuctionList({
        ...pagination,
        metaId: store.state.userInfo?.metaId,
      })
    } else {
      res = await GetAuctionList({
        ...pagination,
        nowTimestamp: new Date().getTime(),
      })
    }
    if (res.code === 0) {
      if (isCover) auctions.length = 0
      auctions.push(...res.data.results.items)
      const totalPage = Math.ceil(res.data.total / pagination.pageSize)
      if (totalPage <= pagination.page) {
        pagination.nothing = true
      }
    }
    resolve()
  })
}

function getMore() {
  pagination.page++
  getAuctionList()
}

getAuctionList()
</script>

<style lang="scss" scoped src="./AuctionList.scss"></style>
