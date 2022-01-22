<template>
  <ElDialog v-model="visible" :title="$t('donate')" custom-class="" :before-close="beforeClose">
    <template v-if="isInputAmount">
      <div class="input-amount-warp flex flex-align-center">
        <ElButton>Satoshis</ElButton>
        <ElInputNumber
          v-model="amount"
          type="number"
          :min="1000"
          :placeholder="$t('donateInputAmountPlac')"
          class="flex1"
        >
        </ElInputNumber>
        <ElButton type="primary" @click="confirm">{{ $t('confirm') }}</ElButton>
      </div>
    </template>
    <template v-else>
      <div class="reward-list">
        <a
          class="reward-item"
          v-for="item in rewardAmounts"
          :key="item.satoshis"
          @click="donate(item.satoshis)"
        >
          <div class="name">{{ item.name }}</div>
          <div class="unit">{{ item.unit }}</div>
        </a>
      </div>
    </template>
    <div class="toogle">
      <a @click="isInputAmount = !isInputAmount">{{
        isInputAmount ? $t('returnChooseAmount') : $t('otherAmount')
      }}</a>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { store } from '@/store'
import { ElDialog, ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { checkSdkStatus } from '@/utils/util'

const emit = defineEmits(['success', 'change'])

interface Props {
  visible: boolean
  targetId: string
  address: string
  metaId: string
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
})

interface rewardAmountItem {
  satoshis: number
}
const rewardAmounts = [
  { satoshis: 10000, name: '10K', unit: 'Satoshis' },
  { satoshis: 50000, name: '50K', unit: 'Satoshis' },
  { satoshis: 200000, name: '200K', unit: 'Satoshis' },
  { satoshis: 1000000, name: '0.01', unit: 'BSV' },
  { satoshis: 5000000, name: '0.05', unit: 'BSV' },
  { satoshis: 20000000, name: '0.2', unit: 'BSV' },
]
const i18n = useI18n()

const isInputAmount = ref(false)
const amount = ref()

function confirm() {
  if (amount.value === '') {
    ElMessage.error(i18n.t('donateInputAmountPlac'))
    return
  }
  donate(amount.value)
}

async function donate(satoshis: number) {
  await checkSdkStatus()
  try {
    if (!props.address || !props.targetId) return
    const params = {
      receiveAddress: props.address,
      receiveMetaId: props.metaId,
      targetId: props.targetId,
      amount: satoshis,
    }
    const res = await store.state.sdk.addDonateProtocol(params)
    if (res.code === 200) {
      emit('success', {
        ...params,
        txId: res.data.txId,
      })
    }
  } catch (error) {
    if (error) ElMessage.error(JSON.stringify(error))
  }
}

function beforeClose(done: Function) {
  emit('change', false)
  done()
}
</script>

<style lang="scss" scoped src="./DonateModal.scss"></style>
