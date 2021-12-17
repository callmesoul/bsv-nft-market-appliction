<template>
  <PickerModel
    name="series"
    listKey="series"
    :title="$t('chooseserices')"
    :visible="isShowSeriesModal"
    @confirm="emit('confirm')"
    :list="series"
    :selecteds="selectedSeries"
  >
    <template v-slot:item="{ item }">
      <span>{{ item.currentNumber }}/{{ item.maxNumber }}</span>
    </template>
    <template v-slot:topRight>
      <a class="create-series-btn" @click="isShowCreateSeriesModal = true">
        {{ $t('createSerie') }}
      </a>
    </template>
  </PickerModel>

  <!-- 创建系列 -->
  <ElDialog v-model="isShowCreateSeriesModal">
    <div class="create-series">
      <div class="title">{{ $t('createSerieProd') }}</div>
      <div class="drsc">{{ $t('createSerieTips') }}</div>
      <input type="text" v-model="serie.name" :placeholder="$t('createSeriesNamePlar')" />
      <input
        type="number"
        v-model="serie.number"
        min="0"
        :placeholder="$t('createSeriesNumberPlar')"
      />
      <div class="btn btn-block" @click="createSerie">{{ $t('create') }}</div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { CreateSerice, GetSeries, NftApiCode } from '@/api'
import PickerModel from '@/components/PickerModal/PickerModel.vue'
import { useStore } from '@/store'
import { ElLoading, ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['confirm'])
const props = defineProps<{
  isShowSeriesModal: boolean
  selectedSeries: string[]
}>()

const store = useStore()
const series: any[] = reactive([])
const i18n = useI18n()
const serie = reactive({
  name: '',
  number: '',
})
const isShowCreateSeriesModal = ref(false)

function getSeries() {
  return new Promise<void>(async resolve => {
    const res = await GetSeries({ page: 1, pageSize: 99 })
    if (res.code === NftApiCode.success) {
      series.length = 0
      series.push(...res.data)
    }
    resolve()
  })
}

//  创建系列
async function createSerie() {
  if (serie.name === '') {
    ElMessage.error(i18n.t('createSeriesNamePlar'))
    return
  }
  if (!serie.number) {
    ElMessage.error(i18n.t('createSeriesNumberPlar'))
    return
  }
  const index = series.findIndex(item => item.name === serie.name)
  if (index !== -1) {
    ElMessage.error(i18n.t('havedSameNameSeries'))
    return
  }
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'full-loading',
  })

  const response = await store.state.sdk?.genesisNFT({
    seriesName: serie.name,
    nftTotal: serie.number,
  })
  if (response && response.code === 200) {
    const res = await CreateSerice({
      name: serie.name,
      count: parseInt(serie.number),
      codeHash: response.data.codehash,
      genesis: response.data.genesisId,
      genesisTxId: response.data.genesisTxid,
      sensibleId: response.data.sensibleId,
    })
    if (res.code === NftApiCode.success) {
      ElMessage.success(i18n.t('createdSuccess'))
      series.push({
        series: serie.name,
        maxNumber: serie.number,
        currentNumber: 0,
        codeHash: response.data.codehash,
        genesis: response.data.genesisId,
        genesisTxId: response.data.genesisTxid,
        sensibleId: response.data.sensibleId,
      })
      serie.name = ''
      serie.number = ''
      isShowCreateSeriesModal.value = false
    }
  }
  loading.close()
}

if (store.state.nftToken) {
  getSeries()
} else {
  const watchNFTToken = store.watch(
    state => state.nftToken,
    nftToken => {
      if (nftToken) {
        watchNFTToken()
        getSeries()
      }
    }
  )
}

defineExpose({
  series,
  getSeries,
})
</script>

<style lang="scss" scoped src="./ChooseSeriesModal.scss"></style>
