<template>
  <InnerPageHeader
    :title="$t('batchCreate')"
    :intro="$t('batchCreateDrsc')"
    :is-show-search="false"
  />

  <div class="batch-create container">
    <!-- 选择系列 -->
    <div class="section-header flex flex-align-center">
      <div class="select-series flex1 screen-item">
        <div class="input-item flex flex-align-center">
          <div class="select-warp flex flex-align-center">
            <div class="key flex1 flex flex-align-center" @click.stop="onChangeSameClassify">
              <span class="title">{{ $t('series') }}:</span>
            </div>
            <div class="value">
              <ElSelect v-model="currentSeries">
                <ElOption
                  key="all"
                  :label="$t('all') + $t('series') + ' ' + nfts.length + '/' + nfts.length"
                  value="all"
                >
                </ElOption>
                <ElOption
                  v-for="item in seriesList"
                  :key="item.name"
                  :label="item.name + ' ' + item.hasCount + '/' + item.total"
                  :value="item.name"
                >
                </ElOption>
              </ElSelect>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 相同内容选择 -->
    <!-- <div class="batch-same-warp batch-create-list">
      <div class="batch-create-item">
        <div class="cover upload-warp">
          <div class="upload">
            <div class="add flex flex-align-center flex-pack-center">
              <template>
                <div>
                  <img class="icon" src="@/assets/images/img_upload.svg" />
                  <div class="label">{{ $t('uploadcover') }}</div>
                </div>
                <input type="file" accept="image/*" @change="changeAllCover" />
              </template>
            </div>
          </div>
        </div>
        <div class="orginFile input-item">
          <div class="placeholder">{{ $t('nftoriginal') }}</div>
        </div>
        <div class="name input-item">
          <input type="text" :placeholder="$t('nameplac')" />
        </div>
        <div class="intro input-item">
          <textarea :placeholder="$t('drscplac')"></textarea>
        </div>
        <div class="orginFile input-item">
          <div class="placeholder">{{ $t('choosetype') }}</div>
        </div>
        <div class="index input-item" v-if="selectedSeries.length > 0">
          <input type="number" :readOnly="true" :disabled="true" />
        </div>
        <div class="btn btn-block btn-default">
          {{ $t('delete') }}
        </div>
        <div class="add flex flex-align-center flex-pack-center" @click="addItem">
          +
        </div>
      </div>
    </div> -->

    <!-- 批量铸造列表 -->
    <div class="batch-create-list">
      <div
        class="batch-create-item"
        v-for="(item, index) in currentNfts"
        :key="item.genesis + item.codehash + item.tokenIndex"
        :class="{ disabled: item.amount === '' || item.amount === '0' }"
      >
        <div class="cover upload-warp">
          <div class="upload">
            <div class="add flex flex-align-center flex-pack-center">
              <ElImage
                class="cover"
                fit="cover"
                :src="$filters.assetsUrl(item.cover)"
                :preview-src-list="[$filters.assetsUrl(item.cover)]"
                :append-to-body="true"
              />
            </div>
          </div>
        </div>
        <div class="name input-item">
          <input type="text" :readOnly="true" v-model="item.name" :placeholder="$t('nameplac')" />
        </div>
        <div class="name input-item">
          <InputAmount />
          <!-- <input
            type="text"
            class="price"
            v-model="item.amount"
            :placeholder="$t('priceplac') + '0.00001'"
          /> -->
        </div>
        <div class="intro input-item">
          <textarea v-model="item.sellDesc" :placeholder="$t('offSaleIntro')"></textarea>
        </div>
        <div class="index input-item">
          <input
            type="number"
            :readOnly="true"
            :disabled="true"
            v-model="item.index"
            :placeholder="$t('indexNumber')"
          />
        </div>
        <router-link
          :to="{
            name: 'detail',
            params: {
              genesisId: item.genesis,
              codehash: item.codehash,
              tokenIndex: item.tokenIndex,
            },
          }"
          class="btn btn-block"
          v-if="item.isSaled"
        >
          {{ $t('lookDetail') }}
        </router-link>
      </div>
    </div>
    <template v-if="isCreated">
      <div class="flex flex-align-center">
        <div class="btn btn-block flex1" @click="resetBacth">
          {{ $t('resetBatchCreate') }}
        </div>
        <!-- <div class="btn btn-block flex1" @click="resetBacth">
          {{ $t('continueBatchCreate') }}
        </div> -->
      </div>
    </template>
    <div class="btn btn-block" @click="startBacth" v-else>
      {{ isBreak ? $t('continue') : $t('startBatchCreate') }}
    </div>
  </div>

  <ElDialog
    v-model="isShowResult"
    :title="$t('batchCreateIniting')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <div class="result">
      <div class="batch-create-tips">{{ $t('batchCreateTips') }}</div>
      <div class="result-msg">
        <div class="result-num">
          {{ $t('batchCreatNum') }}:<span>{{ list.length }}</span> {{ $t('indivual') }},
          {{ $t('beSuccess') }}:<span>{{ successNum }}</span>
          {{ $t('indivual') }}
        </div>
        <ElProgress
          :percentage="Math.ceil((successNum / list.length) * 100)"
          :stroke-width="30"
        ></ElProgress>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { CreateNft, GetMyNftSummaryList, GetSeriesNftList, NftApiCode } from '@/api'
import { useStore } from '@/store'
import {
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElSwitch,
  ElDialog,
  ElProgress,
  ElImage,
  ElSelect,
  ElOption,
} from 'element-plus'
import { computed, reactive, ref } from 'vue-demi'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ChooseSeriesModal from '@/components/ChooseSeriesModal/ChooseSeriesModal.vue'
import { checkSdkStatus, setDataStrclassify, tranfromImgFile } from '@/utils/util'
import {
  classifyList,
  canCreateCardClassifyListMetaids,
  canCreateRightsClassifyListMetaids,
} from '@/config'
import PickerModel from '@/components/PickerModal/PickerModel.vue'
import InnerPageHeader from '@/components/InnerPageHeader/InnerPageHeader.vue'
import InputAmount from '@/components/InputAmount/InputAmount.vue'

const list: {
  id: string
  cover: null | MetaFile
  originalFile: null | MetaFile
  name: string
  intro: string
  index: number
  isCreated: boolean
  classify: string[]
  isShowClassifyModal: boolean
  codehash?: string
  genesis?: string
  tokenIndex?: string
}[] = reactive([
  {
    id: new Date().getTime().toString(),
    cover: null,
    originalFile: null,
    index: 1,
    name: '',
    intro: '',
    isCreated: false,
    classify: [],
    isShowClassifyModal: false,
  },
])
const router = useRouter()
const store = useStore()
const i18n = useI18n()
const root = ref()
const isShowResult = ref(false)
const isBreak = ref(false)
const isCreated = ref(false)
const currentIndex = ref(null)
const paramsList: any[] = []
const nfts: {
  codehash: string
  genesis: string
  name: string
  cover: string
  tokenIndex: string
  amount: string
  isSaled: boolean
  sellDesc: string
}[] = reactive([])
const seriesList: {
  name: string
  hasCount: number
  total: number
  genesis: string
  codehash: string
}[] = reactive([])

const currentSeries = ref('all')
// 成功的数量
const successNum = computed(() => {
  let num = 0
  for (let i = 0; i < list.length; i++) {
    if (list[i].genesis && list[i].codehash && list[i].tokenIndex) {
      num = num + 1
    } else {
      break
    }
  }
  return num
})

const currentNfts = computed(() => {
  let list = nfts
  if (currentSeries.value !== 'all') {
    const series = seriesList.find(item => item.name === currentSeries.value)
    list = list.filter(item => item.codehash === series.codehash && item.genesis === series.genesis)
  }
  return list
})

function sleepTime() {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, 3000)
  })
}

// 开始批量铸造
async function startBacth() {
  isBreak.value = false
  // 檢查sdk狀態
  await checkSdkStatus()
  if (list.length <= 0) return
  const loading = ElLoading.service()

  let currentSeriesItem: SeriesItem | undefined = undefined
  // 检查是否超出 系列数量
  if (selectedSeries.length > 0) {
    currentSeriesItem = root.value.series.find((item: any) => item.series === selectedSeries[0])
    if (currentSeriesItem && currentSeriesItem.maxNumber < list[list.length - 1].index) {
      ElMessage.error(i18n.t('overSeriesNum'))
      loading.close()
      return
    }
  }

  let isReady = true
  let i = 0
  if (currentIndex.value) {
    i = currentIndex.value
  }
  if (!isBreak.value) {
    for (; i < list.length; i++) {
      if (!list[i].cover) {
        ElMessage.error(`${i + 1}: ${i18n.t('uploadcover')}`)
        isReady = false
        loading.close()
        break
      }
      if (!list[i].originalFile) {
        ElMessage.error(`${i + 1}: ${i18n.t('uploadTips')}`)
        isReady = false
        loading.close()
        break
      }
      if (list[i].name === '') {
        ElMessage.error(`${i + 1}: ${i18n.t('nameplac')}`)
        isReady = false
        loading.close()
        break
      }
      if (list[i].intro === '') {
        ElMessage.error(`${i + 1}: ${i18n.t('drscplac')}`)
        isReady = false
        loading.close()
        break
      }

      if (!list[i].genesis && !list[i].codehash && !list[i].tokenIndex) {
        paramsList.push({
          id: list[i].id,
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
            classifyList: JSON.stringify(list[i].classify),
            originalFileTxid: {
              fileType: list[i].originalFile!.data_type,
              fileName: list[i].originalFile!.name,
              data: list[i].originalFile!.hexData,
            },
            contentTxId: '',
          },
          codeHash: currentSeriesItem ? currentSeriesItem.codeHash : undefined,
          genesis: currentSeriesItem ? currentSeriesItem.genesis : undefined,
          genesisTxId: currentSeriesItem ? currentSeriesItem.genesisTxId : undefined,
          sensibleId: currentSeriesItem ? currentSeriesItem.sensibleId : undefined,
        })

        // checkOnlyTasks.push(
        //   store.state.sdk?.createNFT({
        //     checkOnly: true,
        //     ...params,
        //   })
        // )
      }
      // tasks.push(store.state.sdk?.createNFT(params))
    }
  }
  if (!isReady) return
  //   checkOnly
  let amount = 0
  if (currentIndex.value !== null) {
    i = currentIndex.value
  } else {
    i = 0
  }
  try {
    const res = await store.state.sdk?.createNFT({
      checkOnly: true,
      ...paramsList[i],
    })
    if (typeof res === 'number') {
      amount += res
    }
  } catch (err) {
    loading.close()
    return
  }
  amount *= paramsList.length - i
  const userBalanceRes = await store.state.sdk?.getBalance()
  if (userBalanceRes && userBalanceRes.code === 200 && userBalanceRes.data.satoshis > amount) {
    ElMessageBox.confirm(`${i18n.t('useAmountTips')}: ${amount} SATS`, i18n.t('niceWarning'), {
      confirmButtonText: i18n.t('confirm'),
      cancelButtonText: i18n.t('cancel'),
      closeOnClickModal: false,
    }).then(
      async () => {
        isCreated.value = true
        loading.close()
        isShowResult.value = true
        if (currentIndex.value !== null) {
          i = currentIndex.value
        } else {
          i = 0
        }
        for (; i < paramsList.length; i++) {
          try {
            const { id, ...currentParams } = paramsList[i]
            const res = await store.state.sdk
              ?.createNFT({
                ...currentParams,
              })
              .catch(() => {
                isBreak.value = true
                ElMessage.error(i18n.t('onLineFail'))
                return
              })
            if (res && typeof res !== 'number') {
              // 上报 更新 系列信息
              const response = await CreateNft({
                nftName: paramsList[i].nftname,
                intro: paramsList[i].nftdesc,
                type: paramsList[i].content.nftType,
                seriesName: selectedSeries[0],
                tx: res.txId,
                classify: paramsList[i].content.classifyList,
                fileUrl: 'test',
                coverUrl: 'test',
                tokenId: res.codehash + res.genesisId + res.tokenIndex,
                nftId: res.txId,
                codeHash: res.codehash,
                genesis: res.genesisId,
                genesisTxId: res.genesisTxid,
                tokenIndex: res.tokenIndex,
              })
              if (response.code === NftApiCode.success) {
                const index = list.findIndex(item => item.id === id)
                list[index].codehash = res.codehash
                list[index].genesis = res.genesisId
                list[index].tokenIndex = res.tokenIndex
                if (parseInt(res.tokenIndex) === list[index].index - 1) {
                  ElMessage.success(
                    `${selectedSeries.length > 0 ? list[i].index : list[i].name}: ${i18n.t(
                      'castingsuccess'
                    )}`
                  )
                  await store.state.sdk
                    ?.checkNftTxIdStatus(res.sendMoneyTx)
                    .catch(() => ElMessage.error(i18n.t('networkTimeout')))
                  /* 间隔一段时间 提高批量铸造稳定性 */
                  // await sleepTime()
                } else {
                  isBreak.value = true
                  isShowResult.value = false
                  ElMessage.error(i18n.t('tokenIndexNotMatch'))
                  return
                }
              } else {
                isBreak.value = true
                isShowResult.value = false
                ElMessage.error(i18n.t('reportFail'))
                return
              }
            } else {
              isBreak.value = true
              isShowResult.value = false
              ElMessage.error(i18n.t('onLineFail'))
              return
            }
          } catch {
            isBreak.value = true
            isShowResult.value = false
            return
          }
          currentIndex.value = i + 1
        }
        paramsList.length = 0
        isBreak.value = false
        currentIndex.value = null
        isShowResult.value = false
      },
      () => {
        isShowResult.value = false
        loading.close()
      }
    )
  } else {
    loading.close()
    ElMessageBox.alert(
      `
        <p>${i18n.t('useAmountTips')}: ${amount} SATS</p>
        <p>${i18n.t('insufficientBalance')}</p>
      `,
      {
        confirmButtonText: i18n.t('confirm'),
        dangerouslyUseHTMLString: true,
      }
    )
    return
  }
}

function getMyNfts(isCover: boolean = false) {
  return new Promise<void>(async resolve => {
    const res = await GetMyNftSummaryList({
      Address: store.state.userInfo.address,
      Page: '1',
      PageSize: '999',
    })
    if (res && res.code === 0) {
      if (isCover) {
        nfts.length = 0
      }
      if (res.data.results.items.length > 0) {
        res.data.results.items.map(async item => {
          if (item.nftMyCount === 1) {
            const nft = item.nftDetailItemList[0]
            nfts.push({
              name: nft.nftName,
              amount: '',
              codehash: nft.nftCodehash,
              genesis: nft.nftGenesis,
              tokenIndex: nft.nftTokenIndex,
              cover: nft.nftIcon,
              isSaled: false,
              sellDesc: '',
            })
          } else if (item.nftMyCount > 1) {
            seriesList.push({
              codehash: item.nftCodehash,
              genesis: item.nftGenesis,
              name: item.nftSeriesName ? item.nftSeriesName : '--',
              hasCount: item.nftMyCount,
              total: item.nftTotalSupply,
            })
            const response = await GetSeriesNftList({
              Page: '1',
              PageSize: '999',
              Address: store.state.userInfo!.address,
              codehash: item.nftCodehash,
              genesis: item.nftGenesis,
            })
            if (response.code === 0) {
              response.data.results.items.map(_item => {
                nfts.push({
                  name: _item.nftName,
                  amount: '',
                  codehash: _item.nftCodehash,
                  genesis: _item.nftGenesis,
                  tokenIndex: _item.nftTokenIndex,
                  cover: _item.nftIcon,
                  isSaled: false,
                  sellDesc: '',
                })
              })
            }
          }
        })
      }
    }
    resolve()
  })
}

// 初始化
async function resetBacth() {
  await root.value.getSeries()
  list.length = 0
  isCreated.value = false
}

if (store.state.userInfo) {
  getMyNfts()
} else {
  store.watch(
    state => state.userInfo,
    () => {
      if (store.state.userInfo) getMyNfts()
    }
  )
}
</script>

<style lang="scss" scoped src="./Sale.scss"></style>
