<template>
  <div class="cert flex flex-pack-end">
    <a class="flex flex-align-center flex-pack-end">
      <img v-if="props.metaId && isCert" class="icon-cert" src="@/assets/images/icon_cer.svg" />
      <span>{{ props.metaId && isCert ? $t('isCert') : $t('unCert') }}</span>
      <i class="el-icon-arrow-right icon-right"></i>
    </a>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, ref, computed } from "@vue/runtime-core";
import { certedMetaIds } from '@/config'
const props = defineProps<{
  metaId?: string
}>()
const isCert = computed(() => props.metaId && certedMetaIds.find(item => item === props.metaId))
</script>
<style lang="scss" scoped src="./Cert.scss">
</style>
