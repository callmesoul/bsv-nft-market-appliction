<template>
  <div class="cert flex flex-pack-end">
    <ElPopover placement="bottom" trigger="hover" :width="'auto'">
      <template #reference>
        <a class="flex flex-align-center flex-pack-end">
          <img v-if="props.metaId && isCert" class="icon-cert" src="@/assets/images/icon_cer.svg" />
          <span>{{ (props.metaId && isCert) || certed ? $t('isCert') : $t('unCert') }}</span>
          <i class="el-icon-arrow-right icon-right"></i>
        </a>
      </template>
      <div class="certed-user-info">
        <template v-if="isCert">
          <div class="certed-user-item flex flex-align-center">
            <span class="label">{{ $t('realName') }}:</span
            ><span class="value flex1">{{
              userInfo.val?.realName ? userInfo.val?.realName : $t('noMsg')
            }}</span>
          </div>
          <div class="certed-user-item flex flex-align-center">
            <span class="label">{{ $t('idNumber') }}:</span
            ><span class="value flex1">{{
              userInfo.val?.idNumber ? userInfo.val?.idNumber : $t('noMsg')
            }}</span>
          </div>
          <div class="certed-user-item flex flex-align-center">
            <span class="label">{{ $t('certBody') }}:</span
            ><span class="value flex1">{{
              userInfo.val?.userCertificationType === 1
                ? $t('personCert')
                : userInfo.val?.organizationName
                ? userInfo.val?.organizationName
                : $t('noMsg')
            }}</span>
          </div>
        </template>
        <template v-else>
          <div class="no-cert">{{ $t('userNotCerted') }}</div>
        </template>
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
import { GetCertUserInfo } from '@/api'

const store = useStore()
const i18n = useI18n()
const userInfo: { val: CertUserInfo | null } = { val: null }
const isGetUserInfoed = ref(false)

const props = defineProps<{
  metaId?: string
  certed?: boolean
}>()
const isCert = computed(() => {
  const result = props.metaId && store.state.isCertedMetaIds.find(item => item === props.metaId)
  if (result && !isGetUserInfoed.value) {
    isGetUserInfoed.value = true
    getCertUserInfo()
  }
  return result
})

async function getCertUserInfo() {
  try {
    const res = await GetCertUserInfo(props.metaId)
    if (res.code === 0) {
      userInfo.val = res.data
    }
  } catch (error) {}
}

function toCert() {
  ElMessage.info(i18n.t('stayTuned'))
}
</script>
<style lang="scss" scoped src="./Cert.scss"></style>
