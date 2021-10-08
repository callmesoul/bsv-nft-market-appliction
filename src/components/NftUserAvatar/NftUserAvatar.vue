<template>
  <div class="avatar" @click="toUser">
    <img src="@/assets/images/ava_mask_2.png" class="mask" v-if="hasmask && bg === 'gray'" />
    <img src="@/assets/images/ava_mask.png" class="mask" v-if="hasmask && bg !== 'gray'" />
    <img
      class="avatar-img"
      :src="$filters.avatar(metaId)"
      :class="{
        hasmask,
      }"
      onerror="javascript:this.src='https://testshowman.showpay.top/metafile/avatar/a9…1f918ca4342d2b018c641bbb4c293e'"
    />
  </div>
</template>
<script lang="ts" setup>
import { useStore } from '@/store'
import {} from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps<{
  hasmask: boolean
  metaId: string
  bg?: string
  alt?: string
}>()
const store = useStore()
const router = useRouter()

function toUser() {
  if (store.state.userInfo && store.state.userInfo.metaId === props.metaId) {
    router.push({ name: 'self' })
  } else {
    router.push({
      name: 'user',
      params: {
        metaId: props.metaId,
      },
    })
  }
}
</script>
<style lang="scss" scoped src="./NftUserAvatar.scss"></style>
