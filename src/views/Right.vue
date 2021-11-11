<template>
  <InnerPageHeader :title="$t('rightsList')" :intro="$t('rightsListTips')" :isShowSearch="false" />

  <div class="right-list container">
    <div class="right-item" v-for="(right, index) in rights" :key="index">
      <div class="right-item-msg flex">
        <div class="cover">
          <img />
        </div>
        <div class="cont flex1">
          <div class="name">{{ right.projectName }}</div>
          <div class="cont-list">
            <div class="cont-item flex flex-align-center">
              <span class="key">{{ $t('projecter') }}：</span>
              <span class="value flex flex-align-center">
                <div class="avatar-warp">
                  <NftUserAvatar bg="gray" class="avatar" metaId="" hasmask="" :disabled="true" />
                </div>
                {{ right.teamSide }}
                <img class="cert-icon" src="@/assets/images/icon_cer_nft.png" />
              </span>
            </div>
            <div class="cont-item">
              <span class="key">{{ $t('nftCount') }}：</span>
              <span class="value">{{ right.nftQuantity }}</span>
            </div>
          </div>
        </div>
        <div class="status flex flex-align-center">
          <span class="key">{{ $t('status') }}:</span>
          <span class="value flex flex-align-center"
            ><span class="dot"></span>{{ $t('normoal') }}</span
          >
        </div>
      </div>
      <div class="right-item-data flex flex-align-center">
        <div class="data-item flex1">
          <div class="name">{{ $t('historicalTotalDividend') }}</div>
          <div class="value">4,125.88 BSV</div>
        </div>
        <div class="data-item flex1">
          <div class="name">{{ $t('lastDividend') }}</div>
          <div class="value">4,125.88 BSV</div>
        </div>
        <div class="data-item flex1">
          <div class="name">{{ $t('lastDividendTime') }}</div>
          <div class="value">11-05 14:34</div>
        </div>
        <div class="data-item flex1">
          <div class="name">{{ $t('dividendCycle') }}</div>
          <div class="value">{{ right.dividendCycle }}</div>
        </div>
        <!-- <div class="data-item flex1">
          <div class="name">{{ $t('estimatedDividendIncome') }}</div>
          <div class="value">4,125.88 BSV</div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GetRightDetail } from '@/api'
import InnerPageHeader from '@/components/InnerPageHeader/InnerPageHeader.vue'
import NftUserAvatar from '@/components/NftUserAvatar/NftUserAvatar.vue'
import { reactive } from 'vue-demi'
const rights: RightItem[] = reactive([])
function getRightDetail(params: { genesis: string; codehash: string }) {
  return new Promise(async resolve => {
    const res = await GetRightDetail(params)
    if (res.code === 0) {
      rights[0] = res.data
    }
  })
}

getRightDetail({
  genesis: 'c5e90fab956d4698bf0703a1be69dfba6fbe6934',
  codehash: '0d0fc08db6e27dc0263b594d6b203f55fb5282e2',
})
</script>

<style lang="scss" scoped src="./Right.scss"></style>
