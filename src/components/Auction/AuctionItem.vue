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
        <!-- <div class="user-item flex flex-align-center">
            <UserAvatar
              class="avatar"
              :metaId="auction."
              :hasmask="metabot.nftOwnerAvatarType === 'nft-metabot'"
            />
            <span class="name">{{ metabot.nftOwnerName }}</span>
            <span class="type">({{ $t('owner') }})</span>
          </div> -->
      </div>
      <div
        class="btn btn-block"
        :class="{
          'btn-gray': auction.currentAuctionState !== 2,
          'line-through': auction.currentAuctionState !== 2,
        }"
      >
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
import { metafileUrl } from '@/utils/util'
import VueCountdown from '@chenfengyuan/vue-countdown'

interface Props {
  auction: GetAuctionListResItem
}
const props = withDefaults(defineProps<Props>(), {})

const router = useRouter()

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
</script>

<style lang="scss" scoped src="./AuctionItem.scss"></style>
