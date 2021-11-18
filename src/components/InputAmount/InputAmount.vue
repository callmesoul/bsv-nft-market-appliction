<template>
  <div class="input-amount flex flex-align-center">
    <div class="flex1">
      <input v-model="currentAmount" type="number" @keyup="change" />
    </div>
    <ElSelect v-model="unitName" @change="changeUnit">
      <ElOption v-for="unit in units" :key="unit.unit" :label="unit.unit" :value="unit.unit">
      </ElOption>
    </ElSelect>
  </div>
</template>

<script setup lang="ts">
import Decimal from 'decimal.js-light'
import { ref } from 'vue-demi'
import { UnitName, units } from '@/config'
import { ElSelect, ElOption } from 'element-plus'

const emit = defineEmits(['change'])
const currentAmount = ref('')
const unitName = ref(UnitName.BSV)

function change() {
  emit('change', {
    bsv: currentAmount.value === '' ? 0 : new Decimal(currentAmount.value).toString(),
  })
}

function changeUnit(value: string) {
  if (value === unitName.value) return
  const unit = units.find(item => item.unit === value)
  if (currentAmount.value !== '') {
    currentAmount.value = new Decimal(currentAmount.value)
      .mul(new Decimal(unit.sats).toNumber())
      .toString()
  }
}
</script>

<style lang="scss" scoped src="./InputAmount.scss"></style>
