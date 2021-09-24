<template>
  <div class="avatar">
    <img src="@/assets/images/ava_mask_2.png" class="mask" v-if="hasmask && bg === 'gray'" />
    <img src="@/assets/images/ava_mask.png" class="mask" v-if="hasmask && bg !== 'gray'" />
    <img
      class="avatar"
      :src="$filters.avatar(metaId)"
      :class="{
        hasmask,
      }"
      onerror="javascript:this.src='https://testshowman.showpay.top/metafile/avatar/a9…1f918ca4342d2b018c641bbb4c293e'"
    />
  </div>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue'
const props = defineProps<{
  hasmask: boolean
  metaId: string
  bg?: string
  alt?: string
}>()
</script>

<style lang="scss" scoped src="./NftUserAvatar.scss">
</style>
