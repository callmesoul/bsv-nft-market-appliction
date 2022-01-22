<template>
  <a @click="toDetail()" class="nft-item" :key="item?.tokenId">
    <div class="cover">
      <ElImage
        class="cover-image"
        :lazy="true"
        :src="metafileUrl(item.coverUrl)"
        fit="contain"
      ></ElImage>
      <span v-if="item.classify && item.classify.length > 0">{{ $t(item.classify[0]) }}</span>
    </div>
    <div class="cont">
      <div class="name" :title="item.name">
        {{ item?.name }}
      </div>
      <div class="content">
        <div class="top-msg flex  flex-align-end">
          <span class="flex1">{{
            item.classify && item.classify.length > 0 ? $t(item.classify[0]) : ''
          }}</span>
          <div class="price flex flex-align-end" v-if="item.amount || props.isRecommendCard">
            <div class="label">{{ $t('price') }}</div>
            <div class="aount" :title="new Decimal(item?.amount).div(10 ** 8).toString() + ' BSV'">
              <span>{{ new Decimal(item?.amount).div(10 ** 8).toString() }}</span> BSV
            </div>
          </div>
        </div>
        <div class="msg flex1" v-if="!isHideAuthor">
          <div class="author flex flex-align-center">
            <img
              src="@/assets/images/ava_mask.png"
              class="mask"
              v-if="item.issueUserAvatarType === 'nft-metabot'"
            />
            <img
              class="avatar"
              :src="$filters.avatar(item?.metaId)"
              :alt="item?.foundryName"
              :class="{
                hasmask: item.avatarType === 'nft-metabot',
              }"
            />
            <span class="username">{{ item?.foundryName }}</span>
            <img
              class="cert-icon"
              src="@/assets/images/icon_cer.svg"
              v-if="item.nftCertificationType"
            />
            <img
              class="cert-icon"
              src="@/assets/images/icon_cer_nft.png"
              v-if="item.nftGenesisCertificationType"
            />
          </div>
          <div class="operate-list flex flex-align-center">
            <div
              class="item flex1 flex flex-align-center flex-pack-center"
              :class="{ active: item.nftHasLike }"
              @click.stop="payLike"
            >
              <svg
                t="1641956579473"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2145"
                width="200"
                height="200"
              >
                <path
                  d="M933.43288889 350.09422222H657.18044445c14.10844445-41.07377778 19.11466667-83.85422222 21.9591111-125.15555555l0.11377778-1.70666667c3.41333333-49.26577778 8.192-116.84977778-33.67822222-164.97777778-19.22844445-22.07288889-52.33777778-38.00177778-84.42311111-40.61866667-27.87555555-2.27555555-53.93066667 7.96444445-73.61422222 28.78577778-30.37866667 32.19911111-36.97777778 73.84177778-42.78044445 110.47822222-2.16177778 13.42577778-4.20977778 26.16888889-7.168 37.20533334-12.288 45.056-31.40266667 81.00977778-56.77511111 106.95111111-29.12711111 29.696-68.94933333 48.35555555-104.67555555 49.152h-183.18222222c-38.79822222 0-70.31466667 31.51644445-70.31466667 70.31466667v472.51911111c0 38.79822222 31.51644445 70.31466667 70.31466667 70.31466667H835.12888889c37.31911111 0 67.92533333-29.12711111 70.20088889-65.87733334l98.304-473.20177778v-3.75466666c0.11377778-38.912-31.40266667-70.42844445-70.20088889-70.42844445z m-837.85955556 72.81777778h95.80088889v467.51288889H95.57333333V422.912z m737.16622222 466.26133333v1.25155556H263.05422222V422.912h21.16266667c2.84444445 0 5.46133333-0.34133333 8.07822222-0.91022222 50.40355555-5.12 101.83111111-30.49244445 140.62933334-70.20088889 34.13333333-34.816 59.27822222-81.46488889 74.97955555-138.69511111 4.096-14.90488889 6.48533333-30.15111111 8.87466667-45.056 4.55111111-28.78577778 8.87466667-56.09244445 23.89333333-71.90755556 5.68888889-6.03022222 11.15022222-6.37155555 14.67733333-6.144 13.08444445 1.024 28.55822222 7.96444445 35.38488889 15.81511111 22.07288889 25.37244445 18.65955555 73.50044445 16.04266667 112.18488889l-0.11377778 1.70666667c-3.52711111 51.08622222-10.58133333 104.33422222-37.31911111 147.456l0.11377778 0.11377778c-3.41333333 5.57511111-5.46133333 12.06044445-5.46133333 19.11466666 0 20.13866667 16.27022222 36.40888889 36.40888888 36.40888889h329.38666667l-97.05244445 466.37511111z"
                  p-id="2146"
                ></path>
              </svg>
              <span class="num">{{ item.nftLikeCount }}</span>
            </div>
            <div
              class="item flex1 flex flex-align-center flex-pack-center"
              :class="{ active: item.nftHasDonate }"
              @click.stop="isShowDonateModal = true"
            >
              <svg
                t="1641956804197"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4896"
                width="200"
                height="200"
              >
                <path
                  d="M512 128c212.064 0 384 171.936 384 384s-171.936 384-384 384S128 724.064 128 512 299.936 128 512 128z m0 64C335.264 192 192 335.264 192 512s143.264 320 320 320 320-143.264 320-320S688.736 192 512 192z m38.88 120c43.072 0 77.056 8.448 101.792 25.568 25.44 17.6 38.336 42.496 38.336 73.888 0 36.128-19.104 63.296-56.128 80.992 8.64 3.2 16.256 6.624 22.88 10.24 35.904 19.136 54.24 48.512 54.24 87.136 0 37.44-15.904 67.616-47.232 89.76-30.688 21.664-71.36 32.416-121.92 32.416-15.328 0-34.144-0.704-56.416-2.112l-28.352-1.856a746.496 746.496 0 0 0-42.4-1.728c-10.816 0-20.992 0.576-30.528 1.664l-38.784 4.032c-21.632-0.48-34.368-10.272-34.368-28.48 0-16.608 10.048-26.144 27.136-26.144 17.856 1.92 27.712 2.848 29.632 2.848 16 0 23.488-10.016 23.488-34.048v-228.352c0-24.416-7.52-34.592-23.488-34.592-2.176 0-27.104 2.816-29.632 2.816-17.088 0-27.136-9.536-27.136-26.176 0-18.4 13.536-27.872 36.384-27.872l39.36 4.032c4.544 0.64 15.936 1.152 34.112 1.664 15.392 0 37.44-1.152 66.048-3.392a809.024 809.024 0 0 1 62.976-2.304z m-12.32 211.424h-51.264c-19.168 0-28.992 3.488-30.72 8.32-1.28 3.52-2.016 10.08-2.016 19.456v63.04c0 22.08 3.84 34.88 9.824 38.688 7.264 4.544 31.168 7.296 69.856 7.296 73.024 0 107.424-23.68 107.424-71.552 0-43.52-32.928-65.28-103.104-65.28z m0-160.192l-15.424 0.128c-31.552 0.544-51.456 2.816-58.432 6.4-6.368 3.2-10.144 13.12-10.144 30.912v35.2c0 18.144 1.76 29.376 4.032 32.128 1.824 2.208 10.88 4.16 26.24 4.16h34.56c69.024 0 101.28-19.264 101.28-57.28 0-34.496-25.92-51.648-82.112-51.648z"
                  p-id="4897"
                ></path>
              </svg>
              <span class="num">{{ item.nftDonateValue }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="operate flex flex-align-center" v-if="isSelf">
        <div class="timeleft flex1">
          <!-- 系列 且拥有数量 > 1 -->
          <template v-if="item.hasCount && item.hasCount > 1"
            >{{ $t('series') }} {{ item.hasCount }}/{{ item.total }}</template
          >
          <template v-else-if="item.putAway">
            <template v-if="overTime">{{ $t('overTime') }}</template>
            <div v-else class="flex flex-align-center">
              <img src="@/assets/images/icon_time.svg" />
              <span>{{ day }}{{ $t('day') }}{{ hour }}{{ $t('hour') }}</span>
            </div>
          </template>
        </div>
        <!-- 系列 -->
        <a class="btn btn-min btn-plain" v-if="item.hasCount && item.hasCount > 1">
          {{ $t('seeAll') }}
        </a>
        <template v-else>
          <!-- 非系列 -->
          <a class="btn btn-min btn-plain" v-if="item?.putAway" @click.stop="offSale">
            {{ $t('offsale') }}
          </a>
          <a class="btn btn-min" v-else @click.stop="toSale">{{ $t('sale') }}</a>
        </template>
      </div>
    </div>
    <!-- 推荐卡片 -->
    <div class="recommend-card flex flex-v" v-if="props.isRecommendCard">
      <div class="icon">
        <img src="@/assets/images/card_icon_fire.svg" />
      </div>
      <div class="title">{{ $t('recommentprod') }}</div>
      <div class="drsc flex1">{{ $t('recommenttext') }}</div>
      <div class="more">
        <router-link :to="{ name: 'recommned' }">
          {{ $t('getmore') }}
          <img src="@/assets/images/card_icon_ins.svg" />
        </router-link>
      </div>
    </div>

    <!-- 打赏 -->
    <DonateModalVue
      :visible="isShowDonateModal"
      :meta-id="item.nftOwnerMetaId"
      :address="item.nftOwnerAddress"
      :target-id="item.nftIssueMetaTxId"
      @change="val => (isShowDonateModal = val)"
      @success="donateSuccess"
    />
  </a>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore, Mutation } from '@/store/index'
import { useRoute, useRouter } from 'vue-router'
import { GetMyNftEligibility, GetNftDetail, Langs, NftApiCode, OffSale } from '@/api'
import { ElDialog, ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Decimal } from 'decimal.js-light'
import NftOffSale from '@/utils/offSale'
// @ts-ignore
import dayjs from 'dayjs'
import { getMyNftEligibility, metafileUrl, checkSdkStatus } from '@/utils/util'
import NFTDetail from '@/utils/nftDetail'
import DonateModalVue from '@/components/DonateModal/DonateModal.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()
const i18n = useI18n()
const now = new Date().getTime()
const day = computed(() => {
  if (now > props.item.deadlineTime!) return 0
  console.log(dayjs(now).diff(dayjs(props.item.deadlineTime!), 'day'))
  return Math.abs(dayjs(now).diff(dayjs(props.item.deadlineTime!), 'day'))
}) // 剩余天数
const hour = computed(() => {
  if (now > props.item.deadlineTime!) return 0
  const day = dayjs(now).diff(dayjs(props.item.deadlineTime!), 'day')
  return Math.abs(dayjs(now).diff(dayjs(props.item.deadlineTime!), 'hour') - day * 24)
}) // 剩余小时
const overTime = computed(() => props.item.deadlineTime && props.item.deadlineTime <= now) // 是否超过时间
const props = defineProps<{
  item: NftItem
  isRecommendCard?: boolean
  isHideAuthor?: boolean
  isSelf?: boolean
}>()

const isShowDonateModal = ref(false)

function toDetail() {
  if (props.item.genesis) {
    if (props.item.hasCount && props.item.hasCount > 1) {
      router.push({
        name: 'series',
        params: { genesisId: props.item.genesis, codehash: props.item.codehash },
        query: { name: props.item.name },
      })
    } else {
      router.push({
        name: 'detail',
        params: {
          tokenIndex: props.item.tokenIndex,
          genesisId: props.item.genesis,
          codehash: props.item.codehash,
        },
      })
    }
  }
}

async function toSale() {
  const result = await getMyNftEligibility(props.item.metaId)
  if (!result) return
  if (props.item?.tokenId) {
    router.push({
      name: 'sale',
      params: {
        tokenIndex: props.item.tokenIndex,
        genesisId: props.item.genesis,
        codehash: props.item.codehash,
      },
    })
  }
}

function offSale() {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'full-loading',
  })
  ElMessageBox.confirm(
    `${i18n.t('offsaleConfirm')} ${props.item.productName} ?`,
    i18n.t('niceWarning'),
    {
      confirmButtonText: i18n.t('confirm'),
      cancelButtonText: i18n.t('cancel'),
      closeOnClickModal: false,
    }
  )
    .then(async () => {
      // 先获取详情
      // const detailRes = await GetNftDetail({
      //   tokenId: props.item.tokenId
      // }).catch(() => {
      //     loading.close()
      // })
      const nft = await NFTDetail(
        props.item.genesis,
        props.item.codehash,
        props.item.tokenIndex
      ).catch(() => loading.close())
      if (nft) {
        NftOffSale(nft, loading)
          .then(() => {
            props.item.putAway = false
            loading.close()
          })
          .catch(() => {
            loading.close()
          })
      }
    })
    .catch(() => loading.close())
}

function donateSuccess(params: {
  receiveAddress: string
  receiveMetaId: string
  targetId: string
  amount: number
  txId: string
}) {
  ElMessage.success(i18n.t('donateSuccess'))
  props.item.nftHasDonate = true
  props.item.nftDonateCount += 1000
  isShowDonateModal.value = false
}

async function payLike() {
  await checkSdkStatus()
  const res = await store.state.sdk.addPayLikeProtocol({
    receiveAddress: props.item.nftOwnerAddress,
    txId: props.item.nftIssueMetaTxId,
  })
  if (res.code === 200) {
    ElMessage.success(i18n.t('payLikeSuccess'))
    props.item.nftLikeCount++
    props.item.nftHasLike = true
  }
}
</script>

<style lang="scss" scoped src="./Nft-item.scss"></style>
