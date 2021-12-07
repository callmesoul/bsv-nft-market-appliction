<template>
  <InnerPageHeader :title="topic.val?.name" :isShowSearch="false" />

  <div
    class="series-intro container flex flex-align-center"
    v-if="route.params.key === 'WebotRightCard'"
  >
    <div class="series-author flex1">
      <UserMsg
        :width="48"
        name="aaron67"
        metaId="b89840e798b334e4f2d5279b6a325b411125e927f2dba16af4208d827ede8e11"
      />
      <div class="author-intro">
        {{ $t('webotAuthor') }}
      </div>
    </div>
    <div class="series-msg flex2">
      <div class="series-base flex">
        <img
          class="cover"
          src="https://showman.showpay.io/metafile/a3f7a2ac4b0341276087aba3bcdbc511358023768d09c96b494abe044d8caaba?x-oss-process=image/auto-orient,1/resize,m_lfit,w_235/quality,q_80"
        />
        <div class="cont flex1">
          <div class="name">Webot2022</div>
          <div class="drsc">
            {{ $t('webotIntro') }}
            <a href="https://webot.sv/" target="_blank">{{ $t('website') }}</a>
          </div>
        </div>
      </div>
      <div class="series-data flex flex-align-center">
        <div class="series-data-item flex1 flex flex-align-center flex-pack-center">
          <div>
            <div class="value">{{ genesisVolumeInfo.val?.totalSupply }}</div>
            <div class="key">NFT {{ $t('issueNumber') }}</div>
          </div>
        </div>
        <div class="series-data-item flex1 flex flex-align-center flex-pack-center">
          <div>
            <div class="value">{{ $filters.bsv(genesisVolumeInfo.val?.minPrice) }} BSV</div>
            <div class="key">{{ $t('floorPrice') }}</div>
          </div>
        </div>
        <div class="series-data-item flex1 flex flex-align-center flex-pack-center">
          <div>
            <div class="value">{{ $filters.bsv(genesisVolumeInfo.val?.maxPrice) }} BSV</div>
            <div class="key">{{ $t('highestTransactionPrice') }}</div>
          </div>
        </div>
        <div class="series-data-item flex1 flex flex-align-center flex-pack-center">
          <div>
            <ElPopover
              :width="documentWdith > 750 ? '100vh' : '90%'"
              trigger="click"
              :placement="'bottom-end'"
              class="chart-warp"
            >
              <template #reference>
                <div>
                  <div class="value green">{{ genesisVolumeInfo.val?.percentageIncrease }}</div>
                  <div class="key flex flex-align-center">
                    {{ $t('increase') }} <SvgIcon name="trend" />
                  </div>
                </div>
              </template>
              <Vue3ChartJs v-bind="{ ...lineChart }" />
            </ElPopover>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- banner -->
  <div class="banner container" v-else>
    <a>
      <img
        v-if="topic.val"
        :src="
          topic.val[
            'coverPicUrl' +
              i18n.locale.value.slice(0, 1).toLocaleUpperCase() +
              i18n.locale.value.slice(1, i18n.locale.value.length)
          ]
        "
        alt="Metabot"
      />
    </a>
  </div>

  <div class="metabot-tags container">
    <a
      class="metabot-tag"
      :class="{ active: pagination.page === index + 1 }"
      v-for="(section, index) in Array.from({ length: sectionLength })"
      :key="index"
      @click="getMore(index + 1)"
    >
      {{
        !isOnlyShowPutAway && sortValue === 2
          ? `${index * 100 + 1} - ${index * 100 + 100}`
          : index + 1
      }}
    </a>
  </div>

  <div class="container sortWarp flex flex flex-align-center flex-pack-end">
    <div class="switch-warp flex flex-align-center">
      <span class="lable">{{ $t('isOnlyShowPutAway') }}</span>
      <ElSwitch
        v-model="isOnlyShowPutAway"
        active-color="#feb338"
        @change="onChangeIsOnlyShowPutAway"
      />
    </div>
    <Sort :sorts="sorts" :sortValue="sortValue" @changeSort="changeSort" />
  </div>

  <ElSkeleton
    class="meta-bot-list container"
    :loading="isShowSkeleton"
    animated
    :count="pagination.pageSize"
  >
    <template #template>
      <div class="meta-bot-item">
        <div class="cover">
          <ElSkeletonItem variant="image" class="el-skeleton-item-image" />
        </div>
        <div class="cont">
          <div class="name"><el-skeleton-item variant="text" style="width: 30%" /></div>
          <div class="user-list">
            <div class="user-item flex flex-align-center">
              <ElSkeletonItem variant="text" style="width: 60%" />
            </div>
            <div class="user-item flex flex-align-center">
              <ElSkeletonItem variant="text" style="width: 60%" />
            </div>
          </div>
          <ElSkeletonItem
            class="btn btn-block btn-gray"
            variant="button"
            style="width: 100%; box-sizing: border-box; border: none"
          />
        </div>
      </div>
    </template>
    <template #default>
      <!-- MetaBot list -->
      <div class="meta-bot-list container">
        <a
          @click="toDetail(metabot)"
          class="meta-bot-item"
          v-for="(metabot, index) in metaBots"
          :key="metabot.nftGenesis + metabot.nftCodehash + metabot.nftTokenIndex"
        >
          <!-- <div class="cover">
            <img :src="metafileUrl(metabot.nftIcon)" :alt="metabot.nftName" />
          </div> -->
          <div class="cover">
            <ElImage :lazy="true" :src="metafileUrl(metabot.nftIcon)" fit="contain"></ElImage>
            <VueCountdown
              class="countdown"
              :time="metabot.auctionDeadTime ? metabot.auctionDeadTime - new Date().getTime() : 0"
              :transform="transformSlotProps"
              v-slot="{ days, hours, minutes, seconds }"
              @end="onCountdownEnd"
              v-if="
                metabot.isAuction &&
                  metabot.auctionStatus === 1 &&
                  metabot.auctionDeadTime &&
                  metabot.auctionDeadTime > now
              "
            >
              <span class="dot"></span
              ><span>{{ parseInt(hours) + parseInt(days) * 24 }}:{{ minutes }}:{{ seconds }}</span>
            </VueCountdown>
          </div>
          <div class="cont">
            <div class="name" :title="metabot.nftName">{{ metabot.nftName }}</div>
            <div class="user-list">
              <div class="user-item flex flex-align-center">
                <UserAvatar
                  class="avatar"
                  :metaId="metabot.nftIssueMetaId"
                  :hasmask="metabot.nftIssueAvatarType === 'nft-metabot'"
                />
                <span class="name">{{ metabot.nftIssuer }}</span>
                <span class="type">({{ $t('creater') }})</span>
              </div>
              <div class="user-item flex flex-align-center">
                <UserAvatar
                  class="avatar"
                  :metaId="metabot.nftOwnerMetaId"
                  :hasmask="metabot.nftOwnerAvatarType === 'nft-metabot'"
                />
                <span class="name">{{ metabot.nftOwnerName }}</span>
                <span class="type">({{ $t('owner') }})</span>
              </div>
            </div>
            <!-- 可购买 和 抢购状态-->
            <div class="btn btn-block" :class="itemBuyBtnClass(metabot)" @click.stop="buy(metabot)">
              {{ itemBuyBtnText(metabot) }}
            </div>
            <!-- 下架 和 已被购买 -->
            <!-- <template
              v-else-if="metabot.nftSellState === 1 || metabot.nftSellState === 2"
            >
              <div
                class="btn btn-block btn-gray line-through"
                @click.stop="buy(metabot)"
              >
                {{ new Decimal(metabot.nftPrice).div(Math.pow(10, 8)).toString() }} BSV
              </div>
            </template> -->

            <!-- nftSellState !== 3 上架出售/ 已被下架/已被购买 -->
            <!-- <template v-if="metabot.nftSellState !== 3 && metabot.nftIsReady">
              <div
                class="btn btn-block "
                :class="{
                  'btn-gray': metabot.nftSellState !== 0 || !metabot.nftIsReady,
                  'line-through': metabot.nftSellState !== 0 || !metabot.nftIsReady,
                  'btn-change':
                    metabot.nftSellState === 0 &&
                    metabot.nftIssueMetaId === metabot.nftOwnerMetaId &&
                    metabot.nftIsReady,
                }"
                @click.stop="buy(metabot)"
              >
                {{ new Decimal(metabot.nftPrice).div(Math.pow(10, 8)).toString() }} BSV
              </div>
            </template>
            <template
              v-else-if="
                metabot.nftSellState === 2 ||
                  metabot.nftSellState === 1 ||
                  metabot.nftSellState === 0 ||
                  metabot.nftSellState === 4
              "
            >
              <div
                class="btn btn-block"
                :class="{
                  'btn-gray': metabot.nftSellState !== 0 || !metabot.nftIsReady,
                  'line-through': metabot.nftSellState !== 0 || !metabot.nftIsReady,
                  'btn-change':
                    metabot.nftSellState === 0 &&
                    metabot.nftIssueMetaId === metabot.nftOwnerMetaId &&
                    metabot.nftIsReady,
                }"
                @click.stop="buy(metabot)"
              >
                {{ new Decimal(metabot.nftPrice).div(Math.pow(10, 8)).toString() }} BSV
              </div>
            </template>
            <template v-else-if="metabot.nftSellState === 3">
              <div class="btn btn-block btn-gray" @click.stop="buy(metabot)">
                {{ $t('comingSoon ') }}
              </div>
            </template> -->
          </div>
        </a>
      </div>
    </template>
  </ElSkeleton>

  <div class="page-footer">
    <IsNull v-if="metaBots.length <= 0 && !isShowSkeleton" />
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, computed, h } from 'vue'
import { useStore } from '@/store'
import IsNull from '@/components/IsNull/IsNull.vue'
import { useRoute, useRouter } from 'vue-router'
import { GetGenesisVolumeInfo, GetMetaBotListBySearch, GetTopicNftList } from '@/api'
import {
  ElLoading,
  ElMessage,
  ElSkeleton,
  ElSkeletonItem,
  ElPopover,
  ElMessageBox,
  ElSwitch,
} from 'element-plus'
import { metafileUrl } from '@/utils/util'
import { useI18n } from 'vue-i18n'
import Decimal from 'decimal.js-light'
import Buy from '@/utils/buy'
import NFTDetail from '@/utils/nftDetail'
import VueCountdown from '@chenfengyuan/vue-countdown'
import { ElImage } from 'element-plus'
import InnerPageHeader from '@/components/InnerPageHeader/InnerPageHeader.vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import Sort from '@/components/Sort/Sort.vue'
import { OrderType, SortType } from '@/enum'
import UserMsg from '@/components/UserMsg/UserMsg.vue'
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
// @ts-ignore
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import zoomPlugin from 'chartjs-plugin-zoom'
import dataLabels from 'chartjs-plugin-datalabels'
import dayjs from 'dayjs'

Vue3ChartJs.registerGlobalPlugins([zoomPlugin])

const store = useStore()
const router = useRouter()
const route = useRoute()
const i18n = useI18n()
const isShowSkeleton = ref(true)
const keyword = ref('')
const metaBots: GetMetaBotListResItem[] = reactive([])
const pagination = reactive({
  ...store.state.pagination,
  pageSize: 100,
})
const isOnlyShowPutAway = ref(false)
const documentWdith = window.outerWidth

const isShowCountdown = ref(true)
const now = new Date().getTime()
const sectionIndex = ref(0)
const topic: { val: null | Topic } = reactive({ val: null })

const sorts: NFTListSortItem[] = reactive([
  {
    name: i18n.t('price'),
    nameKey: 'price',
    value: SortType.Price,
    orderType: OrderType.DESC,
  },
  {
    name: i18n.t('tokenIndx'),
    nameKey: 'tokenIndx',
    value: SortType.Index,
    orderType: OrderType.ASC,
  },
])
const sortValue = ref(SortType.Index)

const sectionLength = ref(0)

const lineChart = reactive({
  type: 'line',
  // locally registered and available for this chart
  plugins: [dataLabels],
  data: {
    labels: [],
    datasets: [
      {
        label: i18n.t('averageTransactionPrice'),
        data: [],
        fill: false,
        borderColor: '#feb338',
        backgroundColor: '#feb338',
      },
    ],
  },
  options: {
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
      datalabels: {
        backgroundColor: function(context: any) {
          return context.dataset.backgroundColor
        },
        borderRadius: 4,
        color: 'white',
        font: {
          weight: 'bold',
        },
        // formatter: Math.round,
        padding: 6,
      },
    },
  },
})

lineChart.data.datasets
  .push

  // {
  //   label: i18n.t('totalTurnover'),
  //   data: [65, 59, 20, 90, 66, 15, 40],
  //   fill: false,
  //   borderColor: '#feb338',
  //   backgroundColor: '#feb338',
  // },
  // {
  //   label: i18n.t('numberOfTransactions'),
  //   data: [65, 59, 80, 81, 56, 55, 90],
  //   fill: false,
  //   borderColor: 'blue',
  //   backgroundColor: 'blue',
  // }
  ()

const genesisVolumeInfo: { val: null | GenesisVolumeInfo } = reactive({ val: null })

// nftSellState  0: 可购买 1: 下架 2：已购买 3：敬请期待 4：抢购状态 5： 非销售
function itemBuyBtnClass(metabot: GetMetaBotListResItem) {
  // 可购买 和 抢购状态
  if (metabot.nftSellState === 0 || metabot.nftSellState === 4) {
    if (metabot.nftIsReady) {
      if (metabot.nftSellState === 4) {
        return 'btn-change'
      }
    } else {
      return 'btn-gray line-through'
    }
  } else if (metabot.nftSellState === 1 || metabot.nftSellState === 2) {
    // 1: 下架 2：已购买
    return 'btn-gray line-through'
  } else {
    return 'btn-gray'
  }
}

function itemBuyBtnText(metabot: GetMetaBotListResItem) {
  // 3：敬请期待
  if (metabot.nftSellState === 3) {
    return i18n.t('comingSoon')
  } else if (metabot.nftSellState === 5) {
    // 5： 非销售
    return i18n.t('notSale')
  } else {
    return new Decimal(metabot.nftPrice).div(Math.pow(10, 8)).toString() + ' BSV'
  }
}

function changeSort(value: SortType) {
  isShowSkeleton.value = true
  if (sortValue.value === value) {
    const index = sorts.findIndex(item => item.value === value)
    sorts[index].orderType =
      sorts[index].orderType === OrderType.ASC ? OrderType.DESC : OrderType.ASC
  } else {
    sortValue.value = value
  }
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  getDatas()
}

function onCountdownEnd() {
  setTimeout(() => {
    pagination.page = 1
    pagination.loading = false
    pagination.nothing = false
    keyword.value = ''
    sectionIndex.value = 0
    isShowCountdown.value = false
    getDatas()
  }, 3000)
}

function transformSlotProps(props: any) {
  const formattedProps = {}
  Object.entries(props).forEach(([key, value]) => {
    // @ts-ignore
    formattedProps[key] = value < 10 ? `0${value}` : String(value)
  })
  return formattedProps
}

function toDetail(metabot: GetMetaBotListResItem) {
  router.push({
    name: 'detail',
    params: {
      genesisId: metabot.nftGenesis,
      codehash: metabot.nftCodehash,
      tokenIndex: metabot.nftTokenIndex,
    },
  })
}

function onChangeIsOnlyShowPutAway() {
  pagination.page = 1
  getDatas()
}

function getDatas() {
  return new Promise<void>(async resolve => {
    isShowSkeleton.value = true
    const res = await GetTopicNftList({
      Page: pagination.page.toString(),
      PageSize: pagination.pageSize.toString(),
      TopicType: typeof route.params.key === 'string' ? route.params.key : '',
      orderType: sorts.find(item => item.value === sortValue.value)?.orderType,
      sortType: sortValue.value,
      sellType: isOnlyShowPutAway.value ? '1' : undefined,
    })
    if (res.code === 0) {
      metaBots.length = 0
      metaBots.push(...res.data.results.items)

      if (res.data.total.toString().length >= 3) {
        const count = parseInt(res.data.total.toString().slice(0, 1))
        sectionLength.value = res.data.total === count * 100 ? count : count + 1
      } else {
        sectionLength.value = 1
      }

      getSeriesInfo(metaBots[0].nftGenesis)
      // const totalPages = Math.ceil(res.data.total / pagination.pageSize)
      // if (totalPages <= pagination.page) {
      //   pagination.nothing = true
      // }
    }
    isShowSkeleton.value = false
    resolve()
  })
}

function getSearchDatas(isCover = false) {
  return new Promise<void>(async resolve => {
    const res = await GetMetaBotListBySearch({
      Page: pagination.page.toString(),
      PageSize: pagination.pageSize.toString(),
      SearchWord: keyword.value,
    })
    if (res.code === 0) {
      if (isCover) {
        metaBots.length = 0
      }
      if (res.data.results.items.length > 0) {
        metaBots.push(...res.data.results.items)
      } else {
        pagination.nothing = true
      }
      isShowSkeleton.value = false
    }
    resolve()
  })
}

function getMore(page: number) {
  pagination.page = page
  pagination.loading = true
  document.scrollingElement.scrollTop = 0
  getDatas().then(() => {
    pagination.loading = false
  })
}

function changeSectionIndex(index: number) {
  if (sectionIndex.value === index) return
  sectionIndex.value = index
  isShowSkeleton.value = true
  pagination.page = 1
  pagination.loading = false
  pagination.nothing = false
  keyword.value = ''
  getDatas()
}

// 购买
async function buy(metabot: GetMetaBotListResItem) {
  if (metabot.nftSellState === 1) {
    ElMessage.warning(i18n.t('isBeCancelSelled'))
    return
  } else if (metabot.nftSellState === 2) {
    ElMessage.warning(i18n.t('isBeBuyed'))
    return
  } else if (metabot.nftSellState === 3) {
    ElMessage.warning(i18n.t('comingSoon'))
    return
  } else {
    if (!metabot.nftIsReady) return
  }

  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'full-loading',
  })
  // 获取详情
  const nftDetail = await NFTDetail(
    metabot.nftGenesis,
    metabot.nftCodehash,
    metabot.nftTokenIndex
  ).catch(() => loading.close())
  if (nftDetail) {
    Buy(nftDetail)
      .then(() => {
        metabot.nftSellState = 1
        metabot.nftOwnerMetaId = store.state.userInfo!.metaId
        metabot.nftOwnerName = store.state.userInfo!.name
        ElMessage.success(i18n.t('buySuccess'))
        loading.close()
        router.push({
          name: 'nftSuccess',
          params: {
            genesisId: metabot.nftGenesis,
            tokenIndex: metabot.nftTokenIndex,
            codehash: metabot.nftCodehash,
          },
          query: {
            type: 'buyed',
          },
        })
      })
      .catch(res => {
        ElMessageBox.alert(i18n.t('nftNotCanBuy'), i18n.t('fail'), {
          confirmButtonText: i18n.t('confirm'),
          callback: () => {
            loading.close()
            getDatas()
          },
        })
      })
  }
}

function getSeriesInfo(genesus: string) {
  return new Promise<void>(async resolve => {
    const res = await GetGenesisVolumeInfo(genesus)
    if (res.code === 0) {
      const { dateCountList, ...data } = res.data
      genesisVolumeInfo.val = data
      if (dateCountList && dateCountList.length > 0) {
        const labels: string[] = []
        const values: string[] = []
        // dateCountList.splice(0, dateCountList.length - 7)
        dateCountList.map((item, index) => {
          if (index % 2 === 0) {
            labels.push(dayjs(item.date).format('MM-DD'))
            if (item.averagePrice === 0) return values.push('0')
            else values.push(new Decimal(item.averagePrice).div(Math.pow(10, 8)).toFixed(2))
          }
        })
        lineChart.data.labels = labels
        lineChart.data.datasets[0].data = values
      }
    }
    resolve()
  })
}

onMounted(() => {
  if (isShowSkeleton.value) {
    if (route.params.key) {
      const topicItem = store.state.topics.find(item => item.key === route.params.key)
      if (topicItem) {
        topic.val = topicItem
      }
    }
    pagination.page = 1
    pagination.loading = false
    pagination.nothing = false
    getDatas()
  }
})
</script>

<style lang="scss" scoped src="./Detail.scss"></style>
