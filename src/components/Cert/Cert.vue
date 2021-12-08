<template>
  <div class="cert flex flex-pack-end">
    <ElPopover placement="right" :width="400" trigger="click">
      <template #reference>
        <a class="flex flex-align-center flex-pack-end">
          <img v-if="props.metaId && isCert" class="icon-cert" src="@/assets/images/icon_cer.svg" />
          <span>{{ (props.metaId && isCert) || certed ? $t('isCert') : $t('unCert') }}</span>
          <i class="el-icon-arrow-right icon-right"></i>
        </a>
      </template>
      <div class="certed-user-info">
        <div class="certed-user-item flex flex-align-center">
          <span class="label">{{ $t('realName') }}:</span><span class="value flex1"></span>
          <span class="label">{{ $t('idNumber') }}:</span><span class="value flex1"></span>
          <span class="label">{{ $t('certBody') }}:</span><span class="value flex1"></span>
        </div>
      </div>
    </ElPopover>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from '@vue/runtime-core'
import { certedMetaIds } from '@/config'
import { ElMessage, ElPopover } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/store'
const store = useStore()
const props = defineProps<{
  metaId?: string
  certed?: boolean
}>()
const isCert = computed(() => {
  return props.metaId && store.state.isCertedMetaIds.find(item => item === props.metaId)
})
const i18n = useI18n()

function toCert() {
  ElMessage.info(i18n.t('stayTuned'))
}
</script>
<style lang="scss" scoped src="./Cert.scss"></style>
