<template>
  <div class="auction-item" :key="auction.txId" @click="toDetail(auction)">
    <div class="cover">
      <ElImage
        class="cover-image"
        :lazy="true"
        :src="metafileUrl(auction.icon)"
        fit="contain"
      ></ElImage>
      <!-- <img
        class="cover-image"
        :src="metafileUrl(item?.coverUrl)"
        :alt="item?.name"
        :onerror="coverDefaultImg"
      /> -->
      <span class="classify" v-if="auction.classifyList && auction.classifyList.length > 0">{{
        $t(auction.classifyList[0])
      }}</span>

      <VueCountdown
        class="countdown"
        :time="auction.endTimeStampInt ? auction.endTimeStampInt - new Date().getTime() : 0"
        :transform="transformSlotProps"
        v-slot="{ days, hours, minutes, seconds }"
        @end="onCountdownEnd"
        v-if="auction.currentAuctionState === 2"
      >
        <span class="dot"></span
        ><span>{{ parseInt(hours) + parseInt(days) * 24 }}:{{ minutes }}:{{ seconds }}</span>
      </VueCountdown>
    </div>
    <div class="cont">
      <div class="name" :title="auction.name">
        {{ auction.name }}
      </div>
      <div class="user-list">
        <div class="user-item flex flex-align-center">
          <UserAvatar
            class="avatar"
            :metaId="auction.issuerMetaId"
            :hasmask="auction.avatarType === 'nft-metabot'"
          />
          <span class="name">{{ auction.userName }}</span>
          <span class="type">({{ $t('creater') }})</span>
        </div>
        <div class="user-item flex flex-align-center">
          <UserAvatar
            class="avatar"
            :metaId="auction.ownerMetaId"
            :hasmask="auction.ownerAvatarType === 'nft-metabot'"
          />
          <span class="name">{{ auction.ownerName }}</span>
          <span class="type">({{ $t('owner') }})</span>
        </div>
      </div>
      <div
        class="btn btn-block"
        :class="{
          'btn-gray': auction.currentAuctionState !== 2 && auction.currentAuctionState !== 4,
        }"
        v-if="auction.currentAuctionState <= 3"
      >
        {{
          auction.currentBidPrice === '' || auction.currentBidPrice === '0'
            ? $filters.bsvStr(auction.startingPriceInt)
            : $filters.bsvStr(auction.currentBidPrice)
        }}
        BSV
      </div>
      <!-- 提取 -->
      <div class="btn btn-block" v-else @click.stop="confirmSend(auction)">
        <div class="mb5">{{ $t('confirmAuctionSend') }}</div>
        {{
          auction.currentBidPrice === '' || auction.currentBidPrice === '0'
            ? $filters.bsvStr(auction.startingPriceInt)
            : $filters.bsvStr(auction.currentBidPrice)
        }}
        BSV
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { checkSdkStatus, confirmToSendMetaData, metafileUrl } from '@/utils/util'
import VueCountdown from '@chenfengyuan/vue-countdown'
import { useStore } from '@/store'
import { ElLoading, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

interface Props {
  auction: GetAuctionListResItem
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['remove'])
const store = useStore()
const router = useRouter()
const i18n = useI18n()

function toDetail(auction: GetAuctionListResItem) {
  router.push({
    name: 'detail',
    params: {
      genesisId: auction.genesis,
      codehash: auction.codehash,
      tokenIndex: auction.tokenIndex,
    },
  })
}

function transformSlotProps(props: any) {
  const formattedProps = {}
  Object.entries(props).forEach(([key, value]) => {
    // @ts-ignore
    formattedProps[key] = value < 10 ? `0${value}` : String(value)
  })
  return formattedProps
}

async function confirmSend(auction: GetAuctionListResItem) {
  checkSdkStatus()

  // if (store.state.userInfo.metaId !== auction.ownerMetaId) return
  if (auction.currentAuctionState !== 4) return
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'full-loading',
  })
  try {
    const params = {
      nft: {
        codehash: auction.codehash,
        genesis: auction.genesis,
        genesisTxid: auction.genesisTxId,
        tokenIndex: auction.tokenIndex,
        sensibleId: auction.sensibleId,
      },
      nftAuctionId: auction.txId,
      useFeeb: 0.5,
    }
    const res = await store.state.sdk.nftAuctionWithdraw({
      ...params,
      checkOnly: true,
    })
    debugger
    if (res.code === 200) {
      const result = await confirmToSendMetaData(res.data.amount)
      if (result) {
        const response = await store.state.sdk.nftAuctionWithdraw(params)
        if (response.code === 200) {
          emit('remove', auction)
          loading.close()
          ElMessage.success(i18n.t('success'))
        }
      }
    }
  } catch (error) {}
}
</script>

<style lang="scss" scoped src="./AuctionItem.scss"></style>
