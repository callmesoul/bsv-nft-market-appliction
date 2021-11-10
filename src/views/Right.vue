<template>
  <InnerPageHeader :title="$t('rightsList')" :intro="$t('rightsListTips')" :isShowSearch="false" />

  <div class="right-list">
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
              <span class="value">大头鸟娱乐</span>
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
      <div class="right-item-data">
        <div class="data-item">
          <div class="name">历史总分红</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InnerPageHeader from '@/components/InnerPageHeader/InnerPageHeader.vue'
</script>

<style lang="scss" scoped src="./Right.scss"></style>
