<template>
  <div class="section-screen flex flex-align-center" v-if="classifyList && classifyList.length > 0">
    <div class="tags flex1 flex flex-align-center flex-wrap-wrap">
      <a :class="{ active: classify === 'all' }" @click="emit('changeClassify', 'all')">
        {{ $t('all') }}
      </a>
      <a
        :class="{ active: classify === item.classify }"
        v-for="item in classifyList"
        :key="item.classify"
        @click="emit('changeClassify', item.classify)"
        >{{ $t(item.classify) }}</a
      >
    </div>
    <div class="search-warp flex flex-align-center">
      <input
        class="flex1"
        v-model="key"
        :placeholder="$t('search')"
        @keyup.enter="emit('search', key)"
        type="text"
      />
      <img src="@/assets/images/icon_search.svg" @click="emit('search', key)" />
    </div>
  </div>

  <NftSkeleton :loading="isShowSkeleton" :count="pagination.pageSize" class="section-cont nft-list">
    <template #default>
      <div class="section-cont nft-list">
        <template v-for="item in nfts">
          <NftItem :item="item" :isHideAuthor="isHideAuthor" />
        </template>
      </div>
    </template>
  </NftSkeleton>

  <template v-if="!isShowSkeleton">
    <LoadMore :pagination="pagination" @getMore="emit('getMore')" v-if="nfts.length > 0" />
    <IsNull v-else />
  </template>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '@/components/IsNull/IsNull.vue'
import NftItem from '@/components/Nft-item/Nft-item.vue'
import NftSkeleton from '@/components/NftSkeleton/NftSkeleton.vue'

interface Props {
  pagination: Pagination
  isShowSkeleton: boolean
  keyword?: string
  nfts: NftItem[]
  classify?: string
  classifyList?: Classify[]
  isHideAuthor?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  keyword: '',
  classify: 'all',
  isHideAuthor: false,
})
const emit = defineEmits(['search', 'changeClassify', 'getMore'])

const key = ref(props.keyword)

watch(
  () => props.keyword,
  () => {
    key.value = props.keyword
  }
)
</script>

<style lang="scss" scoped src="./NftList.scss"></style>
