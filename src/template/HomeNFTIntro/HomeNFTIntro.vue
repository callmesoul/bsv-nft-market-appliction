<template>
  <div class="nft-muodle">
    <div class="container">
      <div class="title">{{ $t('nftModuleTitle') }}</div>
      <div class="nft-module-list flex ">
        <!-- 海量应用场景 -->
        <div class="nft-module-item flex1">
          <div class="nft-module-item-warp">
            <div class="icon">
              <img src="@/assets/images/img_2.svg" />
            </div>
            <div class="name">{{ $t('nftModuleName1') }}</div>
            <div class="drsc">
              <div>
                {{ $t('nftModuleDrsc1') }}
              </div>
            </div>
          </div>
        </div>

        <!-- 极低的铸造费用 -->
        <div class="nft-module-item flex1">
          <div class="nft-module-item-warp">
            <div class="icon">
              <img src="@/assets/images/img_1.svg" />
            </div>
            <div class="name">{{ $t('nftModuleName2') }}</div>
            <div class="drsc">
              <div>
                {{ $t('nftModuleDrsc2') }}
              </div>
            </div>
          </div>
        </div>

        <!-- 覆盖全网用户 -->
        <div class="nft-module-item flex1">
          <div class="nft-module-item-warp">
            <div class="icon">
              <img src="@/assets/images/img_4.svg" />
            </div>
            <div class="name">{{ $t('nftModuleName3') }}</div>
            <div class="drsc">
              <div>
                {{ $t('nftModuleDrsc3') }}
              </div>
            </div>
          </div>
        </div>

        <!-- 创作者认证 -->
        <div class="nft-module-item flex1">
          <div class="nft-module-item-warp">
            <div class="icon">
              <img src="@/assets/images/img_3.svg" />
            </div>
            <div class="name">{{ $t('nftModuleName4') }}</div>
            <div class="drsc">
              <div>
                {{ $t('nftModuleDrsc4') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss" src="./HomeNFTIntro.scss"></style>
