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
            <div class="key flex1">{{ $t('chooseserices') }}</div>
            <div
              class="value"
              @click="isCreated ? (isShowSeriesModal = false) : (isShowSeriesModal = true)"
            >
              <span v-if="selectedSeries.length > 0">{{ selectedSeries[0] }}</span>
              <span v-else class="placeholder">{{ $t('choose') }}</span>
              <i class="el-icon-arrow-right"></i>
            </div>
            <ChooseSeriesModal
              :isShowSeriesModal="isShowSeriesModal"
              :selectedSeries="selectedSeries"
              @change="onSeriesConfirm"
              @confirm="isShowSeriesModal = false"
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
              <ElSwitch :disabled="isCreated" v-model="isSameClassify" />
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

    <div class="section-header flex">
      <!-- 是否源文件和封面图一样 -->
      <div class="screen-item flex1">
        <div class="input-item flex ">
          <div class="select-warp flex ">
            <div class="key flex1">
              <span class="title">{{ $t('isCoverAndoriginalSame') }}:</span>
              <ElSwitch :disabled="isCreated" v-model="sameInfo.isCoverAndoriginalSame" />
            </div>
          </div>
        </div>
      </div>

      <!-- 是否相同源文件 -->
      <div class="screen-item flex1">
        <div class="input-item flex flex-align-center" v-if="!sameInfo.isCoverAndoriginalSame">
          <div class="select-warp flex flex-align-center">
            <div class="key flex1 flex flex-align-center">
              <span class="title">{{ $t('isSameOriginalFile') }}:</span>
              <ElSwitch :disabled="isCreated" v-model="sameInfo.isSameOriginalFile" />
            </div>
            <div class="value flex1 flex flex-pack-end">
              <InputFile
                class="flex1"
                :disabled="isCreated"
                :placeholder="$t('nftoriginal')"
                :original-file="sameInfo.originalFile"
                @change="files => (sameInfo.originalFile = files[0])"
              />
            </div>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="section-header flex">
      <!-- 是否相同NFT封面图片 -->
      <div class="screen-item flex1">
        <div class="input-item flex ">
          <div class="select-warp flex ">
            <div class="key flex1">
              <span class="title">{{ $t('isSameNFTCover') }}:</span>
              <ElSwitch :disabled="isCreated" v-model="sameInfo.isSameCover" />
            </div>
            <div class="value flex1">
              <InputImage
                v-if="sameInfo.isSameCover"
                :disabled="isCreated"
                :cover="sameInfo.cover"
                @change="file => (sameInfo.cover = file)"
                :placeholder="$t('uploadcover')"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 是否相同NFT封面图片 -->
      <div class="screen-item flex1">
        <div class="input-item flex ">
          <div class="select-warp flex ">
            <div class="key flex1">
              <span class="title">{{ $t('isSameNFTDrsc') }}:</span>
              <ElSwitch :disabled="isCreated" v-model="sameInfo.isSameDrsc" />
            </div>
            <div class="value flex1" v-if="sameInfo.isSameDrsc">
              <textarea
                v-model="sameInfo.drsc"
                :placeholder="$t('drscplac')"
                :readonly="isCreated || !sameInfo.isSameDrsc"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-header flex">
      <!-- 是否相同的NFT作品名称？ -->
      <div class="screen-item flex1">
        <div class="input-item flex ">
          <div class="select-warp">
            <div class="key flex1">
              <span class="title">{{ $t('isSameNFTName') }}:</span>
              <ElSwitch :disabled="isCreated" v-model="sameInfo.isSameName" />
            </div>
            <div class="value flex1" v-if="sameInfo.isSameName">
              <div class="preview" v-if="sameInfo.name !== ''">
                {{ $t('preview') }}:
                {{ sameInfo.name.replace(/\$index/g, '1').replace(/\$total/g, '999') }}
              </div>
              <div class="flex flex-align-center">
                <input
                  v-model="sameInfo.name"
                  :readOnly="isCreated || !sameInfo.isSameName"
                  type="text"
                  :placeholder="$t('nameplac')"
                  class="flex1"
                />
              </div>
              <div class="preview">
                {{ $t('sameNameTips') }} <br />
                例如： {{ $t('sameNameTips2') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="screen-item flex1">
        <div class="input-item flex ">
          <div class="select-warp">
            <div class="key flex1">
              <span class="title">{{ $t('batchAddMany') }}:</span>
              <ElSwitch :disabled="isCreated" v-model="sameInfo.isBatchAdd" />
            </div>
            <div class="value flex1" v-if="sameInfo.isBatchAdd">
              <div class="flex flex-align-center mt10">
                <input
                  v-model="sameInfo.totalNum"
                  :readOnly="isCreated"
                  type="number"
                  class="flex1"
                />
                {{ $t('piece') }}
                <button class="btn ml10" @click="addTo">{{ $t('confirm') }}</button>
              </div>
            </div>
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
        <div class="cover upload-warp" v-if="!sameInfo.isSameCover">
          <InputImage
            :cover="item.cover"
            :disabled="isCreated"
            :is-preview="true"
            @change="file => (item.cover = file)"
            :placeholder="$t('uploadcover')"
          />
        </div>
        <InputFile
          :placeholder="$t('nftoriginal')"
          :original-file="item.originalFile"
          :disabled="isCreated"
          :align="TextAlign.Start"
          v-if="!sameInfo.isSameOriginalFile && !sameInfo.isCoverAndoriginalSame"
          @change="files => (item.originalFile = files[0])"
        />
        <div class="name input-item" v-if="!sameInfo.isSameName">
          <input
            type="text"
            :readOnly="isCreated || sameInfo.isSameName"
            v-model="item.name"
            :placeholder="$t('nameplac')"
          />
        </div>
        <div class="intro input-item" v-if="!sameInfo.isSameDrsc">
          <textarea
            v-model="item.intro"
            :readOnly="item.genesis"
            :placeholder="$t('drscplac')"
          ></textarea>
        </div>
        <div
          v-if="!isSameClassify"
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
      <!-- 添加 -->
      <div class="batch-create-item" v-if="!isCreated">
        <div class="cover upload-warp" v-if="!sameInfo.isSameCover">
          <div class="upload">
            <InputImage :placeholder="$t('uploadcover')" />
          </div>
        </div>
        <InputFile
          :placeholder="$t('nftoriginal')"
          v-if="!sameInfo.isSameOriginalFile && !sameInfo.isCoverAndoriginalSame"
        />
        <div class="name input-item" v-if="!sameInfo.isSameName">
          <input
            type="text"
            :readOnly="isCreated || sameInfo.isSameName"
            :placeholder="$t('nameplac')"
          />
        </div>
        <div class="intro input-item" v-if="!sameInfo.isSameDrsc">
          <textarea :placeholder="$t('drscplac')"></textarea>
        </div>
        <div class="orginFile input-item" v-if="!isSameClassify">
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

    <template v-if="isCreated">
      <div class="flex flex-align-center btn-group">
        <div class="btn btn-block flex1" @click="resetBacth">
          {{ $t('resetBatchCreate') }}
        </div>
        <div class="btn btn-block flex1" v-if="successNum < list.length" @click="startBacth">
          {{ $t('continueBatchCreate') }}
        </div>
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
import { useStore } from '@/store'
import { ElLoading, ElMessage, ElSwitch, ElDialog, ElProgress } from 'element-plus'
import { computed, reactive, ref } from 'vue-demi'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ChooseSeriesModal from '@/components/ChooseSeriesModal/ChooseSeriesModal.vue'
import {
  checkSdkStatus,
  checkUserCanIssueNft,
  confirmToSendMetaData,
  tranfromImgFile,
} from '@/utils/util'
import { classifyList, canCreateCardClassifyListMetaids } from '@/config'
import PickerModel from '@/components/PickerModal/PickerModel.vue'
import InnerPageHeader from '@/components/InnerPageHeader/InnerPageHeader.vue'
import InputFile from '@/components/InputFile/InputFile.vue'
import InputImage from '@/components/InputImage/InputImage.vue'
import { NFTApiGetNFTDetail } from '@/api'
import { TextAlign } from '@/enum'
import { v1 as uuid } from 'uuid'

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
    id: uuid(),
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
const selectedSeries: string[] = reactive([])
const i18n = useI18n()
const root = ref()
const isShowResult = ref(false)
const isBreak = ref(false)
const isCreated = ref(false)
const currentIndex = ref(null)
const sameInfo: {
  isSameOriginalFile: boolean
  originalFile: null | MetaFile
  isSameCover: boolean
  cover: null | MetaFile
  isCoverAndoriginalSame: boolean
  isSameDrsc: boolean
  drsc: string
  isSameName: boolean
  name: string
  isBatchAdd: boolean
  totalNum: number
} = reactive({
  isSameOriginalFile: false,
  originalFile: null,
  isSameCover: false,
  cover: null,
  isCoverAndoriginalSame: false,
  isSameDrsc: false,
  drsc: '',
  isSameName: false,
  name: '',
  isBatchAdd: false,
  totalNum: 0,
})

const paramsList: any[] = [] // 任务参数列表

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

// 设置用户可选的分类
function setUserCreatCard() {
  if (store.state.userInfo) {
    const index = canCreateCardClassifyListMetaids.findIndex(
      item => item === store.state.userInfo?.metaId
    )
    if (index !== -1) {
      const cardIndex = classList.findIndex(item => item.classify === 'card')
      classList[cardIndex].disabled = false
    }

    const rightsIndex = classList.findIndex(item => item.classify === 'rights')
    classList[rightsIndex].disabled = false
    // const _index = canCreateRightsClassifyListMetaids.findIndex(
    //   item => item === store.state.userInfo?.metaId
    // )
    // if (_index !== -1) {
    //   const rightsIndex = classList.findIndex(item => item.classify === 'rights')
    //   classList[rightsIndex].disabled = false
    // }
  }
}

// 添加项
function addItem() {
  let index = 1
  if (selectedSeries.length > 0) {
    if (list.length > 0) {
      index = list[list.length - 1].index + 1
    } else {
      const seriesIndex = root.value.series.findIndex(
        (item: any) => item.series === selectedSeries[0]
      )
      if (seriesIndex !== -1) {
        index = root.value.series[seriesIndex].currentNumber + 1
      }
    }
  }
  list.push({
    id: uuid(),
    cover: null,
    originalFile: null,
    name: '',
    intro: '',
    isCreated: false,
    classify: isSameClassify.value ? JSON.parse(JSON.stringify(classify)) : [],
    isShowClassifyModal: false,
    index,
  })
}

// 删除项
function removeItem(index: number) {
  if (index === list.length - 1 || selectedSeries.length <= 0) list.splice(index, 1)
  else {
    list.splice(index, 1)
    if (selectedSeries.length > 0) {
      const startNum =
        root.value.series.find((item: any) => item.series === selectedSeries[0]).currentNumber + 1
      for (let i = 0; i < list.length; i++) {
        list[i].index = startNum + i
      }
    }
  }
}

// 更改统一的分类
function onChangeSameClassify() {
  if (isSameClassify.value) {
    list.map(item => {
      item.classify = JSON.parse(JSON.stringify(classify))
      item.isShowClassifyModal = false
    })
  }
}

async function onSetAllClassify() {
  // 檢查sdk狀態
  await checkSdkStatus()
  isShowClassifyModal.value = false
  list.map(item => {
    item.classify = JSON.parse(JSON.stringify(classify))
    item.isShowClassifyModal = false
  })
}

// 确认选择系列
async function onSeriesConfirm() {
  // 檢查sdk狀態
  await checkSdkStatus()
  isShowSeriesModal.value = false
  if (selectedSeries.length > 0) {
    const item: SeriesItem = root.value.series.find((item: any) => item.name === selectedSeries[0])
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

function sleepTime() {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, 5000)
  })
}

// 开始批量铸造
async function startBacth() {
  if (list.length <= 0) return

  paramsList.length = 0
  isBreak.value = false
  // 檢查sdk狀態
  await checkSdkStatus()

  // 检查是否开放铸造
  const result = await checkUserCanIssueNft()
  if (!result) return

  if (sameInfo.isSameName && sameInfo.name === '') {
    ElMessage.error(i18n.t('nameplac'))
    return
  }

  if (sameInfo.isSameDrsc && sameInfo.drsc === '') {
    ElMessage.error(i18n.t('drscplac'))
    return
  }

  if (sameInfo.isSameCover && !sameInfo.cover) {
    ElMessage.error(i18n.t('uploadcover'))
    return
  }

  if (!sameInfo.isCoverAndoriginalSame) {
    if (sameInfo.isSameOriginalFile && !sameInfo.originalFile) {
      ElMessage.error(i18n.t('nftoriginal'))
      return
    }
  }

  // if (isSameClassify.value && classify.length <= 0) {
  //   ElMessage.error(i18n.t('choosetype'))
  //   return
  // }

  const loading = ElLoading.service()

  try {
    let currentSeriesItem: SeriesItem | undefined = undefined
    if (selectedSeries.length > 0) {
      currentSeriesItem = root.value.series.find((item: any) => item.name === selectedSeries[0])
      if (currentSeriesItem && currentSeriesItem.maxNumber < list[list.length - 1].index) {
        ElMessage.error(i18n.t('overSeriesNum'))
        loading.close()
        return
      }
    }
    let amount = 0
    let isReady = true

    for (let i = 0; i < list.length; i++) {
      if (!list[i].cover && !sameInfo.isSameCover) {
        ElMessage.error(`${i + 1}: ${i18n.t('uploadcover')}`)
        isReady = false
        loading.close()
        break
      }

      if (!sameInfo.isCoverAndoriginalSame) {
        if (!list[i].originalFile && !sameInfo.isSameOriginalFile) {
          ElMessage.error(`${i + 1}: ${i18n.t('uploadTips')}`)
          isReady = false
          loading.close()
          break
        }
      }

      if (list[i].name === '' && !sameInfo.isSameName) {
        ElMessage.error(`${i + 1}: ${i18n.t('nameplac')}`)
        isReady = false
        loading.close()
        break
      }
      if (list[i].intro === '' && !sameInfo.isSameDrsc) {
        ElMessage.error(`${i + 1}: ${i18n.t('drscplac')}`)
        isReady = false
        loading.close()
        break
      }

      if (list[i].classify.length <= 0) {
        ElMessage.error(i18n.t('choosetype'))
        isReady = false
        loading.close()
        break
      }

      if (!list[i].genesis && !list[i].codehash && !list[i].tokenIndex) {
        // 设置当前源文件
        let originalFile: MetaFile
        // 源文件和封面图相同
        if (sameInfo.isCoverAndoriginalSame) {
          // 全部封面图相同
          if (sameInfo.isSameCover) {
            // 源文件 = 统一的封面图
            originalFile = sameInfo.cover
          } else {
            // 源文件 = 当前项的封面图
            originalFile = list[i].cover
          }
        } else {
          // 源文件和封面图不同

          // 是否统一源文件？
          if (sameInfo.isSameOriginalFile) {
            // 源文件 =  统一的源文件
            originalFile = sameInfo.originalFile
          } else {
            // 源文件 =  当前项的源文件
            originalFile = list[i].originalFile
          }
        }

        // 设置nft名称
        let nftname: string
        if (sameInfo.isSameName) {
          nftname = sameInfo.name
            .replace(/\$index/g, list[i].index.toString())
            .replace(/\$total/g, currentSeriesItem ? currentSeriesItem.maxNumber.toString() : '1')
        } else {
          nftname = list[i].name
        }
        const params = {
          receiverAddress: store.state.userInfo!.address, //  创建者接收地址
          nftname,
          nftdesc: sameInfo.drsc ? sameInfo.drsc : list[i].intro,
          nfticon: {
            fileType: sameInfo.isSameCover ? sameInfo.cover.data_type : list[i].cover!.data_type,
            fileName: sameInfo.isSameCover ? sameInfo.cover.name : list[i].cover!.name,
            data: sameInfo.isSameCover ? sameInfo.cover.hexData : list[i].cover!.hexData,
          },
          nftwebsite: '',
          nftissuerName: store.state.userInfo!.name,
          content: {
            nftType: '1',
            classifyList: JSON.stringify(list[i].classify),
            originalFileTxid: {
              fileType: originalFile.data_type,
              fileName: originalFile.name,
              data: originalFile.hexData,
            },
            contentTxId: '',
          },
          codeHash: currentSeriesItem ? currentSeriesItem.codeHash : undefined,
          genesis: currentSeriesItem ? currentSeriesItem.genesis : undefined,
          genesisTxId: currentSeriesItem ? currentSeriesItem.genesisTxId : undefined,
          sensibleId: currentSeriesItem ? currentSeriesItem.sensibleId : undefined,
        }

        paramsList.push({
          id: list[i].id,
          ...params,
        })
        //   checkOnly
        const res = await store.state.sdk?.createNFT({
          checkOnly: true,
          ...params,
        })
        if (typeof res === 'number') {
          amount += res
        }
      }
    }
    if (!isReady) return

    const isConfirm = await confirmToSendMetaData(amount)
    if (isConfirm) {
      isCreated.value = true
      loading.close()
      isShowResult.value = true

      for (let i = 0; i < paramsList.length; i++) {
        let isCreatedSuccess = false
        try {
          const { id, ...currentParams } = paramsList[i]
          const res = await store.state.sdk?.createNFT({
            ...currentParams,
          })
          if (res && typeof res !== 'number') {
            if (currentSeriesItem) root.value.upgradeCurrentSeriesNumber()
            isCreatedSuccess = true
            const index = list.findIndex(item => item.id === id)
            list[index].codehash = res.codehash
            list[index].genesis = res.genesisId
            list[index].tokenIndex = res.tokenIndex
            if (parseInt(res.tokenIndex) === list[index].index - 1) {
              ElMessage.success(`${i18n.t('castingsuccess')}`)
              await store.state.sdk
                ?.checkNftTxIdStatus(res.sendMoneyTx)
                .catch(() => ElMessage.error(i18n.t('networkTimeout')))
              /* 间隔一段时间 提高批量铸造稳定性 */
              await sleepTime()
            } else {
              isBreak.value = true
              isShowResult.value = false
              ElMessage.error(i18n.t('tokenIndexNotMatch'))
              return
            }
          }
        } catch {
          isShowResult.value = false
          return
        }
        // 判断没有成功就 及时break 以防继续执行
        if (!isCreatedSuccess) {
          break
        }
      }
      isShowResult.value = false
      loading.close()
    }
  } catch (error) {
    loading.close()
  }
}

// 初始化
async function resetBacth() {
  list.length = 0
  isCreated.value = false
}

const loading = ElLoading.service()
function getDatas() {
  if (store.getters.isCerted) {
    setUserCreatCard()
    loading.close()
  } else {
    ElMessage.error(i18n.t('unAuth'))
    loading.close()
    router.push({ name: 'home' })
  }
}

function addTo() {
  if (list.length >= sameInfo.totalNum) {
    ElMessage.error(i18n.t('mustLargeCurrentNum'))
    return false
  }
  const loading = ElLoading.service()
  const addNum = sameInfo.totalNum - list.length
  for (let i = 0; i < addNum; i++) {
    addItem()
  }
  loading.close()
}

if (store.state.userInfo) {
  getDatas()
} else {
  store.watch(
    state => state.userInfo,
    () => {
      if (store.state.userInfo) getDatas()
    }
  )
}
</script>

<style lang="scss" scoped src="./Create.scss"></style>
