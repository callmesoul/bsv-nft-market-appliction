<template>
  <div class="create">
    <ElSkeleton :loading="isShowSkeleton" animated>
      <template #template>
        <div class="create-header flex flex-align-center">
          <ElSkeletonItem class="icon" variant="h1" />
          <div class="title flex1 flex flex-align-center">
            <span class="flex1"
              ><ElSkeletonItem class="title" variant="h1" style="width: 30%"
            /></span>
            <!-- <router-link :to="{ name: 'saleLegend' }"
          >{{ $t('saledrsc') }}<i class="el-icon-arrow-right"
        /></router-link> -->
          </div>
        </div>

        <div class="tab flex flex-align-center flex-pack-center">
          <ElSkeletonItem variant="h1" style="width: 20%; margin-right: 40px" />
          <ElSkeletonItem variant="h1" style="width: 20%" />
        </div>

        <div class="cont-warp">
          <div class="nft-sale-set">
            <!-- NFT 信息 卡片 -->
            <NftMsgCard
              :skeleton="isShowSkeleton"
              :user-name="nft.val.foundryName"
              :cover-url="nft.val.coverUrl"
              :is-show-cert="true"
              :name="nft.val.nftName"
              :created-at="nft.val.forgeTime"
              :meta-id="nft.val.foundryMetaId"
            />

            <div class="form">
              <div class="form-title">
                <ElSkeletonItem variant="h1" style="width: 20%" />
              </div>
              <div class="form-item">
                <ElSkeletonItem class="textarea-skeleton" variant="h1" />
              </div>
              <div class="form-item">
                <!-- <div class="title">时间</div> -->
                <ElSkeletonItem class="item-skeleton" variant="h1" />
              </div>
              <div class="form-item">
                <!-- <div class="title">价格</div> -->
                <ElSkeletonItem class="item-skeleton" variant="h1" />
              </div>
              <!-- <div class="to-histiry">
            <a>{{ $t('seehistoryprice') }}</a>
          </div> -->
            </div>
            <ElSkeletonItem class="button-skeleton" variant="button" />
          </div>
        </div>
      </template>
      <template #default>
        <div class="create-header flex flex-align-center">
          <img class="icon" src="@/assets/images/bannet_icon_ins.svg" @click="$router.back()" />
          <div class="title flex1 flex flex-align-center">
            <span class="flex1">{{ $t('salenft') }}</span>
            <!-- <router-link :to="{ name: 'saleLegend' }"
          >{{ $t('saledrsc') }}<i class="el-icon-arrow-right"
        /></router-link> -->
          </div>
        </div>

        <div class="tab flex flex-align-center flex-pack-center">
          <a :class="{ active: tabIndex === 0 }" @click="changeTabIndex(0)">{{
            $t('priceSale')
          }}</a>
          <!-- <a :class="{ active: tabIndex === 1 }" @click="changeTabIndex(1)">{{
            $t('auctionSale')
          }}</a> -->
        </div>

        <div class="cont-warp">
          <div class="nft-sale-set">
            <!-- NFT 信息 卡片 -->
            <NftMsgCard
              :user-name="nft.val.foundryName"
              :cover-url="nft.val.coverUrl"
              :is-show-cert="true"
              :name="nft.val.nftName"
              :created-at="nft.val.forgeTime"
              :meta-id="nft.val.foundryMetaId"
            />
            <!-- 上架信息 -->
            <div class="form">
              <div class="form-title">
                {{ tabIndex === 0 ? $t('listedInformation') : $t('auctionMSg') }}
              </div>

              <!-- 上架介绍 -->
              <div class="form-item" v-if="tabIndex === 0">
                <div class="cont flex flex-align-center">
                  <textarea v-model="saleIntro" :placeholder="$t('offSaleIntro')"></textarea>
                </div>
              </div>

              <!-- 时间 -->
              <!-- 上架时间 -->
              <div class="form-item" v-if="tabIndex === 0">
                <div class="cont flex flex-align-center">
                  <ElDatePicker
                    class="el-datetime flex1"
                    v-model="saleTime"
                    :editable="false"
                    :clearable="false"
                    :disabledDate="setDisabledDate"
                    type="datetime"
                    :placeholder="$t('timeplac')"
                  >
                  </ElDatePicker>
                  <img class="icon" src="@/assets/images/list_icon_calendar.svg" />
                </div>
              </div>

              <!-- 竞拍时间 -->
              <div class="form-item" v-else>
                <div class="cont flex flex-align-center">
                  <ElDatePicker
                    class="el-datetime flex1"
                    v-model="auctionTime"
                    :editable="false"
                    :clearable="false"
                    :disabledDate="setAuctionDisabledDate"
                    type="datetime"
                    :placeholder="$t('auctiontimeplac')"
                  >
                  </ElDatePicker>
                  <img class="icon" src="@/assets/images/list_icon_calendar.svg" />
                </div>
              </div>

              <!-- 价格 -->
              <!-- 定价出售 -->
              <div class="form-item" v-if="tabIndex === 0">
                <div class="cont flex flex-align-center">
                  <input
                    v-model="saleAmount"
                    :placeholder="
                      tabIndex === 0 ? $t('priceplac') + minPrice : $t('setABuyItPrice')
                    "
                    @change="saleAmountChange"
                    type="number"
                    class="flex1"
                  />
                  <div class="type">
                    <ElDropdown trigger="click">
                      <span class="flex flex-align-center">
                        {{ units[unitIndex].unit }} <span class="arrow"></span>
                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item
                            v-for="(unit, index) in units"
                            :key="index"
                            @click="changeUnitIndex(index)"
                            >{{ unit.unit }}</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </template>
                    </ElDropdown>
                  </div>
                </div>
              </div>
              <!-- 设置起拍价 -->
              <div class="form-item" v-else>
                <div class="cont flex flex-align-center">
                  <input
                    v-model="auctionPrice"
                    :placeholder="$t('auctionPriceplac') + minAuctionPrice"
                    @change="auctionAmountChange"
                    type="number"
                    class="flex1"
                  />
                  <div class="type">
                    <ElDropdown trigger="click">
                      <span class="flex flex-align-center">
                        {{ units[unitIndex].unit }} <span class="arrow"></span>
                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item
                            v-for="(unit, index) in units"
                            :key="index"
                            @click="changeUnitIndex(index)"
                            >{{ unit.unit }}</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </template>
                    </ElDropdown>
                  </div>
                </div>
              </div>

              <!-- 设置最少加价 -->
              <!-- <div class="form-item" v-if="tabIndex === 1">
                <div class="cont flex flex-align-center">
                  <input
                    v-model="minGapPrice"
                    :placeholder="$t('minGapPriceplac')"
                    type="number"
                    class="flex1"
                  />
                  <div class="type">
                    <ElDropdown trigger="click">
                      <span class="flex flex-align-center">
                        {{ units[unitIndex].unit }} <span class="arrow"></span>
                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item
                            v-for="(unit, index) in units"
                            :key="index"
                            @click="changeUnitIndex(index)"
                            >{{ unit.unit }}</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </template>
                    </ElDropdown>
                  </div>
                </div>
              </div> -->

              <!-- <div class="to-histiry">
            <a>{{ $t('seehistoryprice') }}</a>
          </div> -->
            </div>
            <div
              class="btn btn-block"
              :class="{
                'btn-gray':
                  tabIndex === 0
                    ? saleIntro === '' || saleAmount === '' || saleTime === ''
                    : auctionTime === '' || auctionPrice === '',
              }"
              @click="confirmSale"
            >
              {{ $t('confirmsale') }}
            </div>
          </div>
        </div>
      </template>
    </ElSkeleton>
  </div>
</template>
<script lang="ts" setup>
import { CreateNftAuction, SetDeadlineTime } from '@/api'
import { reactive, ref } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import {
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElMessage,
  ElDatePicker,
  ElLoading,
  ElSkeleton,
  ElSkeletonItem,
} from 'element-plus'
import { useI18n } from 'vue-i18n'
import { store } from '@/store'
import Decimal from 'decimal.js-light'
import NftMsgCard from '@/components/NftMsgCard/NftMsgCard.vue'
import { UnitName, units } from '@/config'
import NFTDetail from '@/utils/nftDetail'
// @ts-ignore
import { confirmToSendMetaData, getMyNftEligibility } from '@/utils/util'
import { computed } from 'vue'

const i18n = useI18n()
const route = useRoute()
const router = useRouter()
const unitIndex = ref(0)
const isShowSkeleton = ref(true)
const tabIndex = ref(0)
const auctionPrice = ref('')
const minGapPrice = ref('') // 最少加价
const auctionTime = ref('') // 拍卖时间
const mode = import.meta.env.MODE

const minPrice = computed(() => {
  let min = 0.0001
  if (units[unitIndex.value].unit === UnitName.BSV) {
    min = 0.000001
  } else {
    min = 10000
  }
  return min
})

const minAuctionPrice = computed(() => {
  let min = 0.01
  if (units[unitIndex.value].unit === UnitName.BSV) {
    min = 0.01
  } else {
    min = 1000000
  }
  return min
})

// @ts-ignore
const nft: { val: NftItemDetail } = reactive({
  val: {},
})

const saleTime = ref('')
const saleAmount = ref('')
const saleIntro = ref('')

function getDetail() {
  return new Promise<void>(async resolve => {
    const _nft = await NFTDetail(
      typeof route.params.genesisId === 'string' ? route.params.genesisId : '',
      typeof route.params.codehash === 'string' ? route.params.codehash : '',
      typeof route.params.tokenIndex === 'string' ? route.params.tokenIndex : ''
    ).catch(() => {})
    if (_nft && typeof _nft !== 'boolean') {
      nft.val = _nft
      isShowSkeleton.value = false
    }
    resolve()
  })
}

if (route.params.genesisId && route.params.codehash && route.params.tokenIndex) {
  getDetail()
}

function saleAmountChange() {
  if (new Decimal(saleAmount.value).toNumber() < minPrice.value) {
    saleAmount.value = minPrice.value.toString()
  }
}

async function confirmSale() {
  if (tabIndex.value === 0) {
    if (saleTime.value === '' || saleAmount.value === '' || saleIntro.value === '') return
    // 檢查是否有權限
    const result = await getMyNftEligibility(nft.val.foundryMetaId)
    if (!result) return

    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      customClass: 'full-loading',
    })

    try {
      const stasPrice =
        units[unitIndex.value].unit === 'BSV'
          ? new Decimal(saleAmount.value).mul(Math.pow(10, 8)).toNumber()
          : new Decimal(saleAmount.value).toNumber()
      const params = {
        codehash: nft.val!.codeHash,
        genesis: nft.val!.genesis,
        tokenIndex: nft.val!.tokenIndex,
        satoshisPrice: stasPrice,
        genesisTxid: nft.val!.genesisTxId,
        sensibleId: nft.val.sensibleId,
        sellDesc: saleIntro.value,
      }
      const useAmountRes = await store.state.sdk?.nftSell({ checkOnly: true, ...params })
      if (useAmountRes && useAmountRes.code === 200) {
        const useAmount = useAmountRes.data.amount!
        const result = await confirmToSendMetaData(useAmount)
        if (result) {
          const res = await store.state.sdk?.nftSell(params)
          if (res?.code === 200) {
            // 上报时间
            await SetDeadlineTime({
              genesis: nft.val.genesis,
              codeHash: nft.val.codeHash,
              tokenIndex: nft.val.tokenIndex,
              deadlineTime: new Date(saleTime.value).getTime(),
            }).catch(() => {
              console.log('上报时间错误')
            })
            // 检查txId状态，确认上链后再跳转，防止上链延迟，跳转后拿不到数据
            await store.state.sdk?.checkNftTxIdStatus(res.data.sellTxId)
            await store.state.sdk?.checkNftTxIdStatus(res.data.txid)
            loading.close()
            ElMessage.success(i18n.t('saleSuccess'))
            router.replace({
              name: 'selfSale',
              params: {
                metaId: store.state.userInfo.metaId,
              },
            })
          }
        }
      }
    } catch (error) {
      new Error(JSON.stringify(error))
      if (loading) loading.close()
    }
  } else if (tabIndex.value === 1) {
    if (store.state.sdk.isApp) {
      ElMessage.warning(i18n.t('appNotBid'))
      return
    }
    // 拍卖
    if (auctionTime.value === '' || auctionPrice.value === '') return
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      customClass: 'full-loading',
    })
    try {
      let _auctionPrice
      if (units[unitIndex.value].unit === UnitName.SATS) {
        _auctionPrice = auctionPrice.value
      } else {
        _auctionPrice = new Decimal(auctionPrice.value).mul(Math.pow(10, 8)).toString()
      }
      const params = {
        nft: {
          codehash: nft.val.codeHash,
          genesis: nft.val.genesis,
          tokenIndex: nft.val.tokenIndex,
          genesisTxid: nft.val.genesisTxId,
          sensibleId: nft.val.sensibleId,
        },
        startBsvPrice: new Decimal(_auctionPrice).toNumber(),
        endTimeStamp: new Date(auctionTime.value).getTime(),
        feeAddress: '19NeJJM6eEa3bruYnqkTA4Cp6VvdFGSepd',
        feeAmount: 1000,
        useFeeb: 0.5,
        // sensibleInfo: {
        //   codehash: nft.val.codeHash,
        //   genesis: nft.val.genesis,
        //   tokenIndex: nft.val.tokenIndex,
        // },
        // auctionDesc: saleIntro.value,
        // auctionContractTxId: nft.val.sellContractTxId ? nft.val.sellContractTxId : '',
        // basePrice: new Decimal(_auctionPrice).toNumber(),
        // minPrceGap: new Decimal(_minPrceGap).toNumber(),
        // sellPrice: new Decimal(fixed_value).toNumber(),
        // availabeTime: new Date(auctionTime.value).getTime(),
      }
      const res = await store.state.sdk?.nftStartAuction({
        ...params,
        checkOnly: true,
      })
      if (res.code === 200) {
        const result = await confirmToSendMetaData(res.data.amount)
        if (result) {
          const response = await store.state.sdk?.nftStartAuction(params)
          if (response && response?.code === 200) {
            setTimeout(() => {
              ElMessage.success(i18n.t('createAuctionSuccess'))
              loading.close()
              router.replace({
                name: 'selfAuction',
                params: {
                  metaId: store.state.userInfo.metaId,
                },
              })
            }, 2000)
            // 拍卖
            /* const res = await CreateNftAuction({
              codehash: nft.val.codeHash,
              genesis: nft.val.genesis,
              token_index: parseInt(nft.val.tokenIndex),
              value: new Decimal(_auctionPrice).div(Math.pow(10, 8)).toString(),
              fixed_value: new Decimal(fixed_value).div(Math.pow(10, 8)).toString(),
              begin_value: new Decimal(_minPrceGap).div(Math.pow(10, 8)).toString(),
              one_value: new Decimal(_minPrceGap).div(Math.pow(10, 8)).toString(),
              icon: `metafile://${store.state.userInfo!.avatarTxId}`,
              memo: saleIntro.value,
              dead_time: new Date(auctionTime.value).getTime(),
              auction_tx: response.data.txId,
            })
            if (res.code === 0) {
              
            } */
          }
        }
      }
    } catch (error) {
      if (error) ElMessage.error(JSON.stringify(error))
      if (loading) loading.close()
    }
  }

  // const lineRes = await store.state.sdk?.nftSell(params)
  // if (lineRes && lineRes.code === 200) {
  //   // 上架完 要上链 sell 协议
  //   const sellProtocolRes = await store.state.sdk?.createNftSellProtocol({
  //     txid: lineRes.data.txId, // sell txId string
  //     sellTxId: lineRes.data.sellTxId, // sellUtxoTxId
  //     sellTxHex: lineRes.data.sellTxHex,  // sell的utxo
  //     createdAt: new Date().getTime(), // 创建时间
  //     ...params
  //   })
  //   if (sellProtocolRes && sellProtocolRes.code === 200) {
  //     // sell协议上完 要上报服务器
  //     const res = await SaleNft({
  //       sellValidTime: new Date(saleTime.value).getTime(),
  //       amount: saleAmount.value,
  //       tokenId: nft.val!.tokenId,
  //       sellTxId: lineRes.data.sellTxId
  //     })
  //     if (res.code === NftApiCode.success) {
  //       ElMessage.success(i18n.t('saleSuccess'))
  //       router.back()
  //     }
  //   }
  // }
}

const setDisabledDate = (time: string) => {
  const now = new Date().getTime() + 1000 * 60 * 30
  const max = now + 30 * 24 * 60 * 60 * 1000
  return new Date(time).getTime() < now || new Date(time).getTime() > max
}
const setAuctionDisabledDate = (time: string) => {
  const now = new Date().getTime()
  const max = now + 1000 * 60 * 60 * 24 * 7
  return new Date(time).getTime() < now || new Date(time).getTime() > max
}

// 更改单位
function changeUnitIndex(index: number) {
  if (unitIndex.value === index) return
  unitIndex.value = index
  if (saleAmount.value !== '') {
    saleAmount.value = new Decimal(units[index].sats).mul(saleAmount.value).toString()
  } else if (auctionPrice.value !== '') {
    auctionPrice.value = new Decimal(units[index].sats).mul(auctionPrice.value).toString()
  }
}

// 更改tab
function changeTabIndex(index: number) {
  if (tabIndex.value === index) return
  tabIndex.value = index
}

// 起拍价格更改
function auctionAmountChange() {
  if (parseFloat(auctionPrice.value) < minAuctionPrice.value) {
    auctionPrice.value = minAuctionPrice.value.toString()
  }
}
</script>
<style lang="scss" scoped src="./Sale.scss"></style>
