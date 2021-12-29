<template>
  <div class="bid-list container">
    <div class="bid-item" v-for="auction in auctions" :key="auction.tx">
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
      </div>
      <div class="cont">
        <div class="name" :title="auction.nftName">
          {{ auction.nftName }}
        </div>
        <div class="content flex">
          <div class="user-list">
            <div class="user-item flex flex-align-center">
              <UserAvatar
                class="avatar"
                :metaId="auction.foundryMetaId"
                :hasmask="auction.issueUserAvatarType === 'nft-metabot'"
              />
              <span class="name">{{ auction.foundryName }}</span>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GetNftAuctions } from '@/api'
import NFTDetail from '@/utils/nftDetail'
import { metafileUrl } from '@/utils/util'

const auctions: BidItem[] = []
function getDatas() {
  return new Promise(async resolve => {
    const res = await GetNftAuctions({
      page: 1,
      page_size: 999,
    })
    if (res.code === 0) {
      res.data.map(async item => {
        const nft = await NFTDetail(item.genesis, item.codehash, item.token_index.toString())
        if (nft) {
          auctions.push({ ...nft, ...item })
        }
      })
    }
  })
}

getDatas()
</script>

<style lang="scss" scoped src="./Bid.scss"></style>
