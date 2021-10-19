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
    <div class="section-header flex flex-align-center">
      <div class="select-series flex1 screen-item">
        <div class="input-item flex flex-align-center">
          <div class="select-warp flex flex-align-center">
            <div class="key flex1">{{ $t('chooseserices') }}</div>
            <div class="value" @click="isShowSeriesModal = true">
              <span v-if="selectedSeries.length > 0">{{ selectedSeries[0] }}</span>
              <span v-else class="placeholder">{{ $t('choose') }}</span>
              <i class="el-icon-arrow-right"></i>
            </div>
            <ChooseSeriesModal
              :isShowSeriesModal="isShowSeriesModal"
              :selectedSeries="selectedSeries"
              @confirm="onSeriesConfirm"
              ref="root"
            />
          </div>
        </div>
      </div>
      <div class="screen-item flex1">
        <div
          class="input-item flex flex-align-center"
          @click="isSameClassify ? (isShowClassifyModal = true) : (isShowClassifyModal = false)"
        >
          <div class="select-warp flex flex-align-center">
            <div class="key flex1 flex flex-align-center" @click.stop="onChangeSameClassify">
              <span class="title">{{ $t('sameClassify') }}:</span>
              <ElSwitch v-model="isSameClassify" />
            </div>
            <div class="value">
              <span v-if="classify.length > 0">
                <template v-for="(_item, index) in classify" :key="_item">
                  {{ $t(_item) }}<template v-if="index !== classify.length - 1">,</template>
                </template>
              </span>
              <span v-else class="placeholder">{{ $t('choose') }}</span>
              <i class="el-icon-arrow-right"></i>
            </div>
            <PickerModel
              name="classify"
              listKey="classify"
              :title="$t('choosetype')"
              :multiple="true"
              disabled="disabled"
              :visible="isShowClassifyModal"
              @confirm="onSetAllClassify"
              :list="classList"
              :selecteds="classify"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 批量铸造列表 -->
    <div class="batch-create-list">
      <div
        class="batch-create-item"
        v-for="(item, index) in list"
        :key="index"
        :id="'batchItem' + index"
      >
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
                <a class="close" @click="removeCover(index)" v-if="!item.genesis">{{
                  $t('delete')
                }}</a>
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
        <div class="orginFile input-item">
          <input
            type="file"
            :placeholder="$t('nftoriginal')"
            :data-index="index"
            @change="originalFileInputChage"
            v-if="!item.genesis"
          />
          <div class="val" v-if="item.originalFile">{{ item.originalFile.raw?.name }}</div>
          <div class="placeholder" v-else>{{ $t('nftoriginal') }}</div>
        </div>
        <div class="name input-item">
          <input
            type="text"
            :readOnly="item.genesis"
            v-model="item.name"
            :placeholder="$t('nameplac')"
          />
        </div>
        <div class="intro input-item">
          <textarea
            v-model="item.intro"
            :readOnly="item.genesis"
            :placeholder="$t('drscplac')"
          ></textarea>
        </div>
        <div
          class="orginFile input-item"
          @click="
            isSameClassify || item.genesis
              ? (item.isShowClassifyModal = false)
              : (item.isShowClassifyModal = true)
          "
        >
          <div class="val" v-if="item.classify.length > 0">
            <template v-for="(_item, index) in item.classify" :key="_item">
              {{ $t(_item) }}<template v-if="index !== item.classify.length - 1">,</template>
            </template>
          </div>
          <div class="placeholder" v-else>{{ $t('choosetype') }}</div>
          <PickerModel
            name="classify"
            listKey="classify"
            :title="$t('choosetype')"
            :multiple="true"
            disabled="disabled"
            :visible="item.isShowClassifyModal"
            @confirm="item.isShowClassifyModal = false"
            :list="classList"
            :selecteds="item.classify"
          />
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
        <div class="btn btn-block btn-default" @click="removeItem(index)" v-if="!item.genesis">
          {{ $t('delete') }}
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
          v-else
        >
          {{ $t('lookDetail') }}
        </router-link>
      </div>
      <div class="batch-create-item">
        <div class="cover upload-warp">
          <div class="upload">
            <div class="add flex flex-align-center flex-pack-center">
              <template>
                <div>
                  <img class="icon" src="@/assets/images/img_upload.svg" />
                  <div class="label">{{ $t('uploadcover') }}</div>
                </div>
                <input type="file" accept="image/*" />
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
        <div class="index input-item">
          <input type="number" :readOnly="true" :disabled="true" />
        </div>
        <div class="btn btn-block btn-default">
          {{ $t('delete') }}
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
import { CreateNft, GetSeries, NftApiCode } from '@/api'
import { useStore } from '@/store'
import { ElLoading, ElMessage, ElIcon, ElMessageBox, ElSwitch } from 'element-plus'
import { reactive, ref } from 'vue-demi'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ChooseSeriesModal from '@/components/ChooseSeriesModal/ChooseSeriesModal.vue'
import { tranfromImgFile } from '@/utils/util'
import { nftTypes, classifyList, canCreateCardClassifyListMetaids } from '@/config'
import PickerModel from '@/components/PickerModal/PickerModel.vue'

const list: {
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
const classList = reactive(classifyList)
const classify: string[] = reactive([])
const isSameClassify = ref(false)
const isShowClassifyModal = ref(false)
const router = useRouter()
const store = useStore()
const isShowSeriesModal = ref(false)
const series: any[] = reactive([])
const selectedSeries: string[] = reactive([])
const i18n = useI18n()
const root = ref()

function setUserCreatCard() {
  if (store.state.userInfo) {
    const index = canCreateCardClassifyListMetaids.findIndex(
      item => item === store.state.userInfo?.metaId
    )
    if (index !== -1) {
      const cardIndex = classList.findIndex(item => item.classify === 'card')
      classList[cardIndex].disabled = false
    }
  }
}

async function getSeries() {
  const res = await GetSeries({ page: 1, pageSize: 99 })
  if (res.code === NftApiCode.success) {
    series.length = 0
    series.push(...res.data)
  }
}

function addItem() {
  list.push({
    cover: null,
    originalFile: null,
    name: '',
    intro: '',
    index: selectedSeries.length > 0 ? list[list.length - 1].index + 1 : 1,
    isCreated: false,
    classify: isSameClassify.value ? JSON.parse(JSON.stringify(classify)) : [],
    isShowClassifyModal: false,
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

function onChangeSameClassify() {
  if (isSameClassify.value) {
    list.map(item => {
      item.classify = JSON.parse(JSON.stringify(classify))
      item.isShowClassifyModal = false
    })
  }
}

function onSetAllClassify() {
  isShowClassifyModal.value = false
  list.map(item => {
    item.classify = JSON.parse(JSON.stringify(classify))
    item.isShowClassifyModal = false
  })
}

function onSeriesConfirm() {
  isShowSeriesModal.value = false
  if (selectedSeries.length > 0) {
    const item: SeriesItem = root.value.series.find(
      (item: any) => item.series === selectedSeries[0]
    )
    if (item) {
      for (let i = 0; i < list.length; i++) {
        list[i].index = item.currentNumber + 1 + i
      }
    }
  } else {
    for (let i = 0; i < list.length; i++) {
      list[i].index = 1
    }
  }
}

async function startBacth() {
  if (list.length <= 0) return
  const loading = ElLoading.service()

  let currentSeriesItem: SeriesItem | undefined = undefined
  // 检查是否超出 系列数量
  if (selectedSeries.length > 0) {
    const currentSeriesItem: SeriesItem = root.value.series.find(
      (item: any) => item.series === selectedSeries[0]
    )
    if (currentSeriesItem && currentSeriesItem.maxNumber <= list[list.length - 1].index) {
      ElMessage.error(i18n.t('overSeriesNum'))
      loading.close()
      return
    }
  }

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
        const res = await store.state.sdk
          ?.createNFT({
            ...paramsList[i],
          })
          .catch(() => {
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
            if (parseInt(res.tokenIndex) === list[i].index - 1) {
              ElMessage.success(`${list[i].index}: ${i18n.t('castingsuccess')}`)
            }
          } else {
            list[i].codehash = res.codehash
            list[i].genesis = res.genesisId
            list[i].tokenIndex = res.tokenIndex
            ElMessage.error(i18n.t('reportFail'))
            break
          }
        } else {
          ElMessage.error(i18n.t('onLineFail'))
          break
        }
      }
      loading.close()
    })
  }
}

if (store.state.userInfo) {
  setUserCreatCard()
} else {
  store.watch(
    state => state.userInfo,
    () => {
      setUserCreatCard()
    }
  )
}
</script>

<style lang="scss" scoped src="./Batch.scss"></style>
