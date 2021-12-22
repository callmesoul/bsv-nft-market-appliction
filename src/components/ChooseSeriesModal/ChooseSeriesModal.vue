<template>
  <PickerModel
    name="name"
    listKey="name"
    :title="$t('chooseserices')"
    :visible="isShowSeriesModal"
    @confirm="emit('confirm')"
    :list="series"
    :selecteds="selectedSeries"
    :disabled="disabledFunction"
    @change="selecteds => emit('change', selecteds)"
  >
    <template v-slot:item="{ item }">
      <span
        >{{ item.currentNumber }}/{{ item.maxNumber }}
        <a class="delete" @click.stop="removeSeries(item)">{{ $t('delete') }}</a></span
      >
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
import PickerModel from '@/components/PickerModal/PickerModel.vue'
import { useStore } from '@/store'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['confirm', 'change'])
const props = defineProps<{
  isShowSeriesModal: boolean
  selectedSeries: string[]
}>()

const store = useStore()
const series: SeriesItem[] = reactive([])
const i18n = useI18n()
const serie = reactive({
  name: '',
  number: '',
})
const isShowCreateSeriesModal = ref(false)
const disabledFunction = (item: SeriesItem) => item.maxNumber <= item.currentNumber
let key = ''

function getSeries() {
  return new Promise<void>(async resolve => {
    series.length = 0
    const string = localStorage.getItem(key)
    if (string) {
      const list = JSON.parse(string)
      series.push(...list.filter((item: any) => item.metaId === store.state.userInfo?.metaId))
    }
    // const res = await GetSeries({ page: 1, pageSize: 99 })
    // if (res.code === NftApiCode.success) {
    //   series.length = 0
    //   series.push(...res.data)
    // }
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
    series.unshift({
      name: serie.name,
      maxNumber: parseInt(serie.number),
      codeHash: response.data.codehash,
      genesis: response.data.genesisId,
      genesisTxId: response.data.genesisTxid,
      sensibleId: response.data.sensibleId,
      metaId: store.state.userInfo.metaId,
      currentNumber: 0,
    })
    localStorage.setItem(key, JSON.stringify(series))
    ElMessage.success(i18n.t('createdSuccess'))
    serie.name = ''
    serie.number = ''
    isShowCreateSeriesModal.value = false

    /* const res = await CreateSerice({
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
    } else {
      if (res.msg) ElMessage.error(res.msg)
    } */
  }
  loading.close()
}

// 更新当前选择系列数量
async function upgradeCurrentSeriesNumber() {
  if (props.selectedSeries && props.selectedSeries[0]) {
    const index = series.findIndex(item => item.name === props.selectedSeries[0])
    if (index !== -1) {
      series[index].currentNumber = series[index].currentNumber + 1
      localStorage.setItem(key, JSON.stringify(series))
    }
  }
}

async function removeSeries(seriesItem: SeriesItem) {
  ElMessageBox.confirm(`${i18n.t('deleteMessage')} ${seriesItem.name} ?`, i18n.t('niceWarning'), {
    confirmButtonText: i18n.t('confirm'),
    cancelButtonText: i18n.t('cancel'),
  }).then(() => {
    // 需删除的已选择， 先去掉已选择
    if (props.selectedSeries && props.selectedSeries.indexOf(seriesItem.name) !== -1) {
      props.selectedSeries.splice(props.selectedSeries.indexOf(seriesItem.name), 1)
    }
    // 删除
    const index = series.findIndex(item => item.name === seriesItem.name)
    series.splice(index, 1)
    localStorage.setItem(key, JSON.stringify(series))
  })
}

if (store.state.nftToken) {
  key = `nftGenesis${store.state.userInfo.metaId}`
  getSeries()
} else {
  const watchNFTToken = store.watch(
    state => state.nftToken,
    nftToken => {
      if (nftToken) {
        watchNFTToken()
        key = `nftGenesis${store.state.userInfo.metaId}`
        getSeries()
      }
    }
  )
}

defineExpose({
  series,
  getSeries,
  upgradeCurrentSeriesNumber,
})
</script>

<style lang="scss" scoped src="./ChooseSeriesModal.scss"></style>
