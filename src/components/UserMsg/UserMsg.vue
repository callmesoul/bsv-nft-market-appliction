<template>
  <div class="user-msg flex flex-align-center">
    <img
      class="avatar"
      :src="$filters.avatar(metaId)"
      :alt="name"
      :style="{
        width: width ? width + 'px' : '40px',
        height: width ? width + 'px' : '40px',
        borderRadius: '50%',
        marginRight: '15px',
      }"
    />
    <div class="cont">
      <div class="username">
        {{ name }}<img class="cert-icon" src="@/assets/images/icon_cer.svg" v-if="isCerted" />
      </div>
      <div class="metaId">{{ metaId.slice(0, 6) }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStore } from '@/store'
import { computed } from 'vue-demi'

const props = defineProps<{
  metaId: string
  name: string
  avatarType?: string
  loading?: boolean
  width?: number
}>()

const store = useStore()
const isCerted = computed(() => {
  return props.metaId && store.state.isCertedMetaIds.find(item => item === props.metaId)
})
</script>
<style lang="scss" scoped scr="./UserMsg.scss"></style>
