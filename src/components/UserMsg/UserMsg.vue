<template>
  <div class="user-msg flex flex-align-center">
    <div class="avatar-warp" :style="{ marginRight: marginRight ? `${marginRight}px` : '20px' }">
      <UserAvatar :metaId="metaId" :disabled="avatarDisabled" />
    </div>
    <!-- <img
      class="avatar"
      :src="$filters.avatar(metaId)"
      :alt="name"
      :style="{
        width: width ? width + 'px' : '40px',
        height: width ? width + 'px' : '40px',
        borderRadius: '50%',
        marginRight: '15px',
      }"
    /> -->
    <div class="cont flex1">
      <div class="username">
        {{ name }}<img class="cert-icon" src="@/assets/images/icon_cer.svg" v-if="isCerted" />
      </div>
      <div class="metaId"><span>MetaID:</span>{{ metaId ? metaId.slice(0, 6) : '' }}</div>
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
  marginRight?: number
  nameSize?: number
  avatarDisabled?: boolean
}>()

const store = useStore()
const isCerted = computed(() => {
  return props.metaId && store.state.isCertedMetaIds.find(item => item === props.metaId)
})
</script>
<style lang="scss" scoped>
.user-msg {
  .avatar-warp {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 20px;
  }

  .cont {
    .username {
      font-size: 16px;
      font-weight: 500;
      color: #120725;
      img {
        margin-left: 8px;
        width: 18px;
        height: 18px;
      }
    }

    .metaId {
      font-size: 13px;
      color: #909399;
      margin-top: 4px;
      span {
        margin-right: 5px;
      }
    }
  }
}
</style>
