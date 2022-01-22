<template>
  <!-- 推荐作品 -->
  <div class="section recommend-section" v-if="recommendNfts.length > 0">
    <NftSkeleton
      :loading="isShowRecommendSkeleton"
      :count="8"
      :isReCommend="true"
      class="section-cont nft-list"
    >
      <template #default>
        <div class="section-cont nft-list">
          <template v-if="!isHideTitle">
            <div class="title">{{ $t('recommentprod') }}</div>
            <div class="drsc">{{ $t('recommenttext') }}</div>
          </template>
          <Swiper
            :modules="[Scrollbar, A11y, Autoplay]"
            :slidesPerView="'auto'"
            :spaceBetween="10"
            :autoHeight="true"
            :autoplay="true"
            :loop="true"
            :scrollbar="{ draggable: true }"
          >
            <SwiperSlide v-for="item in recommendNfts">
              <NftItem :item="item" :isHideAuthor="true" />
            </SwiperSlide>
          </Swiper>
        </div>
      </template>
    </NftSkeleton>
  </div>
</template>

<script setup lang="ts">
import { Scrollbar, A11y, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { reactive, ref } from 'vue'
import { GetRecommendOnSellNftList } from '@/api'
import SetHomeDatas from '@/utils/homeSetData'
import NftSkeleton from '@/components/NftSkeleton/NftSkeleton.vue'
import NftItem from '@/components/Nft-item/Nft-item.vue'
import { checkUserInfoFinish } from '@/utils/util'

let recommendNfts = reactive<NftItem[]>([])
// 骨架屏
const isShowRecommendSkeleton = ref(true)

const props = defineProps<{
  isHideTitle?: boolean
}>()

// 获取推荐列表
function getRecommendNftList() {
  return new Promise<void>(async resolve => {
    const res = await GetRecommendOnSellNftList({
      Page: '1',
      PageSize: '7',
    })
    if (res.code === 0) {
      if (res.data.results.items.length > 0) {
        const results = await SetHomeDatas(res.data.results.items)
        recommendNfts.push(...results)
      }
      isShowRecommendSkeleton.value = false
    }
    resolve()
  })
}

checkUserInfoFinish().then(() => {
  getRecommendNftList()
})
</script>

<style lang="scss" scoped src="./RecommentSwiper.scss"></style>
