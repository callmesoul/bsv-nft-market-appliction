<template>
  <InnerPageHeader :title="$t('rightsList')" :intro="$t('rightsListTips')" :isShowSearch="false" />

  <div class="right-list container">
    <div class="right-item">
      <div class="right-item-msg flex">
        <div class="cover">
          <img />
        </div>
        <div class="cont flex1">
          <div class="name">像素鸟游戏 股权卡</div>
          <div class="cont-list">
            <div class="cont-item">
              <span class="key">项目方：</span>
              <span class="value">
                <NftUserAvatar bg="gray" class="avatar" metaId="" hasmask="" :disabled="true" />
                大头鸟娱乐
                <img class="cert-icon" src="@/assets/images/icon_cer_nft.png" />
              </span>
            </div>
            <div class="cont-item">
              <span class="key">NFT数量：</span>
              <span class="value">100乐</span>
            </div>
            <div class="status">
              <span class="key">状态</span>
              <span class="value"><span class="dot"></span>正常</span>
            </div>
          </div>
        </div>
      </div>
      <div class="right-item-data flex flex-align-center">
        <div class="data-item">
          <div class="name">{{ $t('historicalTotalDividend') }}</div>
          <div class="value">4,125.88 BSV</div>
        </div>
        <div class="data-item">
          <div class="name">{{ $t('lastDividend') }}</div>
          <div class="value">4,125.88 BSV</div>
        </div>
        <div class="data-item">
          <div class="name">{{ $t('lastDividendTime') }}</div>
          <div class="value">11-05 14:34</div>
        </div>
        <div class="data-item">
          <div class="name">{{ $t('dividendCycle') }}</div>
          <div class="value">2次/月</div>
        </div>
        <div class="data-item">
          <div class="name">{{ $t('estimatedDividendIncome') }}</div>
          <div class="value">4,125.88 BSV</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InnerPageHeader from '@/components/InnerPageHeader/InnerPageHeader.vue'
import NftUserAvatar from '@/components/NftUserAvatar/NftUserAvatar.vue'
</script>

<style lang="scss" scoped src="./Right.scss"></style>
