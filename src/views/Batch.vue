<template>
  <div class="inner-page-header container flex flex-align-center">
    <div class="inner-page-header-left flex1">
      <div class="title flex flex-align-center">
        <img @click="router.back()" src="@/assets/images/bannet_icon_ins.svg" />
        {{ $t('batchCreate') }}
      </div>
      <div class="drsc">{{ $t('batchCreateDrsc') }}</div>
    </div>
  </div>

  <div class="batch-create container">
    <!-- 选择系列 -->
    <div class="select-series">
      <div class="input-item flex flex-align-center" @click="isShowSeriesModal = true">
        <div class="select-warp flex flex-align-center">
          <div class="key flex1">{{ $t('chooseserices') }}</div>
          <div class="value">
            <span v-if="selectedSeries.length > 0">{{ selectedSeries[0] }}</span>
            <span v-else class="placeholder">{{ $t('choose') }}</span>
            <i class="el-icon-arrow-right"></i>
          </div>
          <ChooseSeriesModal :isShowSeriesModal.sync="isShowSeriesModal" />
        </div>
      </div>
    </div>
    <!-- 批量铸造列表 -->
    <div class="batch-create-list">
      <div class="batch-create-item" v-for="(item, index) in list" :key="index">
        <div class="close" @click="removeItem(index)"><img src="@/assets/images/close.svg" /></div>
        <div class="cover upload-warp">
          <div class="upload">
            <div class="add flex flex-align-center flex-pack-center">
              <template v-if="item.cover">
                <ElImage
                  class="cover"
                  fit="cover"
                  :src="item.cover.base64Data"
                  :preview-src-list="[item.cover.base64Data]"
                />
                <!-- <img class="cover" :src="coverFile.base64Data"  /> -->
                <a class="close" @click="removeCover(index)">{{ $t('delete') }}</a>
              </template>
              <template v-else>
                <div>
                  <img class="icon" src="@/assets/images/img_upload.svg" />
                  <div class="label">{{ $t('uploadcover') }}</div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  :data-index="index"
                  @change="coverFileInputChage"
                />
              </template>
            </div>
          </div>
        </div>
        <div class="orginFile">
          <input
            type="file"
            :placeholder="$t('nftoriginal')"
            :data-index="index"
            @change="originalFileInputChage"
          />
        </div>
        <div class="name">
          <input type="text" v-model="item.name" />
        </div>
        <div class="intro">
          <textarea v-model="item.intro"></textarea>
        </div>
        <div class="index">
          <input type="number" v-model="item.index" :placeholder="$t('indexNumber')" />
        </div>
      </div>
      <div class="batch-create-item">
        <div class="close"><img src="@/assets/images/close.svg" /></div>
        <div class="cover upload-warp">
          <div class="upload">
            <div class="add flex flex-align-center flex-pack-center">
              <template>
                <div>
                  <img class="icon" src="@/assets/images/img_upload.svg" />
                  <div class="label">{{ $t('uploadcover') }}</div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="orginFile">
          <input type="file" :placeholder="$t('nftoriginal')" />
        </div>
        <div class="name">
          <input type="text" />
        </div>
        <div class="intro">
          <textarea></textarea>
        </div>
        <div class="index">
          <input type="number" :placeholder="$t('indexNumber')" />
        </div>
        <div class="add flex flex-align-center flex-pack-center" @click="addItem">
          +
        </div>
      </div>
    </div>

    <div class="btn btn-block" @click="startBacth">{{ $t('startBatchCreate') }}</div>
  </div>
</template>

<script setup lang="ts">
import { CreateSerice, GetSeries, NftApiCode } from '@/api'
import { useStore } from '@/store'
import { ElLoading, ElMessage, ElIcon, ElMessageBox } from 'element-plus'
import { reactive, ref } from 'vue-demi'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ChooseSeriesModal from '@/components/ChooseSeriesModal/ChooseSeriesModal.vue'
import { tranfromImgFile } from '@/utils/util'
const list: {
  cover: null | MetaFile
  originalFile: null | MetaFile
  name: string
  intro: string
  index: number
  isCreated: boolean
}[] = reactive([
  {
    cover: null,
    originalFile: null,
    index: 0,
    name: '',
    intro: '',
    isCreated: false,
  },
])

const router = useRouter()
const store = useStore()
const isShowSeriesModal = ref(false)
const series: any[] = reactive([])
const selectedSeries: string[] = reactive([])
const i18n = useI18n()
const serie = reactive({
  name: '',
  number: '',
})

const isShowCreateSeriesModal = ref(false)

async function getSeries() {
  const res = await GetSeries({ page: 1, pageSize: 99 })
  if (res.code === NftApiCode.success) {
    series.length = 0
    series.push(...res.data)
  }
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
getSeries()

function addItem() {
  list.push({
    cover: null,
    originalFile: null,
    name: '',
    intro: '',
    index: 0,
    isCreated: false,
  })
}

async function coverFileInputChage(e: any) {
  const index = parseInt(e.currentTarget.dataset.index)
  const input = e.target as HTMLInputElement
  let files = input.files
  if (files) {
    const res = await tranfromImgFile(files[0])
    if (res) {
      list[index].cover = res
    }
  }
}

async function originalFileInputChage(e: any) {
  debugger
  const index = parseInt(e.currentTarget.dataset.index)
  const input = e.target as HTMLInputElement
  let files = input.files
  if (files) {
    const res = await tranfromImgFile(files[0])
    if (res) {
      list[index].originalFile = res
    }
  }
}

function removeCover(index: number) {
  list[index].cover = null
}

function removeItem(index: number) {
  list.splice(index, 1)
}

async function startBacth() {
  if (list.length <= 0) return
  const loading = ElLoading.service()
  const checkOnlyTasks = []
  const tasks = []
  const tasksParams: any[] = []
  let isReady = true
  const paramsList: any[] = []
  for (let i = 0; i < list.length; i++) {
    if (!list[i].cover) {
      ElMessage.error(`${i + 1}: ${i18n.t('uploadcover')}`)
      isReady = false
      break
    }
    if (!list[i].originalFile) {
      ElMessage.error(`${i + 1}: ${i18n.t('uploadTips')}`)
      isReady = false
      break
    }
    if (list[i].name === '') {
      ElMessage.error(`${i + 1}: ${i18n.t('nameplac')}`)
      isReady = false
      break
    }
    if (list[i].intro === '') {
      ElMessage.error(`${i + 1}: ${i18n.t('drscplac')}`)
      isReady = false
      break
    }

    paramsList.push({
      receiverAddress: store.state.userInfo!.address, //  创建者接收地址
      nftname: list[i].name,
      nftdesc: list[i].intro,
      nfticon: {
        fileType: list[i].cover!.data_type,
        fileName: list[i].cover!.name,
        data: list[i].cover!.hexData,
      },
      nftwebsite: '',
      nftissuerName: store.state.userInfo!.name,
      content: {
        nftType: '1',
        classifyList: JSON.stringify(['art']),
        originalFileTxid: {
          fileType: list[i].originalFile!.data_type,
          fileName: list[i].originalFile!.name,
          data: list[i].originalFile!.hexData,
        },
        contentTxId: '',
      },
      //   codeHash: seriesIndex !== -1 ? series[seriesIndex].codeHash : undefined,
      //   genesis: seriesIndex !== -1 ? series[seriesIndex].genesis : undefined,
      //   genesisTxId: seriesIndex !== -1 ? series[seriesIndex].genesisTxId : undefined,
      //   sensibleId: seriesIndex !== -1 ? series[seriesIndex].sensibleId : undefined,
    })

    // checkOnlyTasks.push(
    //   store.state.sdk?.createNFT({
    //     checkOnly: true,
    //     ...params,
    //   })
    // )

    // tasks.push(store.state.sdk?.createNFT(params))
  }
  if (!isReady) return
  //   checkOnly
  let amount = 0
  for (let i = 0; i < paramsList.length; i++) {
    const res = await store.state.sdk?.createNFT({
      checkOnly: true,
      ...paramsList[i],
    })
    if (typeof res === 'number') {
      amount += res
    }
  }

  const userBalanceRes = await store.state.sdk?.getBalance()
  if (userBalanceRes && userBalanceRes.code === 200 && userBalanceRes.data.satoshis > amount) {
    ElMessageBox.confirm(`${i18n.t('useAmountTips')}: ${amount} SATS`, i18n.t('niceWarning'), {
      confirmButtonText: i18n.t('confirm'),
      cancelButtonText: i18n.t('cancel'),
      closeOnClickModal: false,
    }).then(async () => {
      for (let i = 0; i < paramsList.length; i++) {
        const res = await store.state.sdk?.createNFT({
          ...paramsList[i],
        })
      }
      loading.close()
    })
  }
}
</script>

<style lang="scss" scoped src="./Batch.scss"></style>
