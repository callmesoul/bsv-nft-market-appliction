<template>
  <div class="sort-warp flex flex-align-center">
    <div
      class="sort-item flex flex-align-center"
      v-for="sort in sorts"
      :class="{ active: sort.value === sortValue }"
      @click="emit('changeSort', sort.value)"
    >
      <div class="sort-name">{{ $t(sort.nameKey) }}</div>
      <div class="sort-type">
        <SvgIcon name="sort-asc" v-if="sort.orderType === OrderType.ASC" />
        <SvgIcon name="sort-desc" v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SortType, OrderType } from '@/enum'

const emit = defineEmits(['changeSort'])

interface Props {
  sorts: NFTListSortItem[]
  sortValue: SortType
}
const props = withDefaults(defineProps<Props>(), {})
</script>

<style lang="scss" scoped src="./Sort.scss"></style>
