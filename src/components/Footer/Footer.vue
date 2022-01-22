<template>
  <footer>
    <div class="partner-company">
      <div class="container flex flex-align-center flex-pack-center">
        <a target="_blank"><img src="@/assets/images/logo/ath.png"/></a>
        <a href="https://www.metaid.io/" target="_blank"
          ><img src="@/assets/images/logo/meta.png"
        /></a>
        <a href="https://www.nftonshow.com/" target="_blank"
          ><img src="@/assets/images/logo/nos.png"
        /></a>
        <a target="_blank"><img src="@/assets/images/logo/sen.png"/></a>
        <a target="_blank"><img src="@/assets/images/logo/sensile.png"/></a>
        <a href="https://www.show.sv/" target="_blank"
          ><img src="@/assets/images/logo/show.png"
        /></a>
        <a href="http://tswap.io/" target="_blank"><img src="@/assets/images/logo/ts.png"/></a>
        <a href="https://volt.id/" target="_blank"><img src="@/assets/images/logo/volt.png"/></a>
        <a href="https://webot.sv/" target="_blank"><img src="@/assets/images/logo/webot.png"/></a>
      </div>
    </div>
    <div class="footer-top">
      <div class="container flex">
        <div class="logo-warp footer-secion">
          <a class="logo flex flex-align-center">
            <img src="@/assets/images/logo.png" alt="NFTOnShow" />
          </a>
          <div class="social flex flex-align-center">
            <a class="flex1"><SvgIcon name="facebook"/></a>
            <a class="flex1"><SvgIcon name="twitter"/></a>
            <a class="flex1"><SvgIcon name="instagram-fill"/></a>
            <a class="flex1"><SvgIcon name="reddit"/></a>
            <a class="flex1"><SvgIcon name="email"/></a>
            <a class="flex1"><SvgIcon name="telegram"/></a>
          </div>
          <div class="slogan">©2021 by NFTXSKY</div>
        </div>

        <!-- NOS市场 -->
        <div class="footer-secion flex1">
          <div class="title">{{ $t('siteMap') }}</div>
          <div class="footer-secion-list">
            <div class="footer-secion-item">
              <router-link :to="{ name: 'home' }">{{ $t('home') }}</router-link>
            </div>
            <div class="footer-secion-item">
              <router-link :to="{ name: 'topic' }">{{ $t('topic') }}</router-link>
            </div>
            <div class="footer-secion-item">
              <router-link :to="{ name: 'market' }">{{ $t('countryFair') }}</router-link>
            </div>
            <div class="footer-secion-item">
              <router-link :to="{ name: 'create' }" v-if="!isApp">{{
                $t('createnft')
              }}</router-link>
            </div>
          </div>
        </div>

        <!-- 关于NOS -->
        <div class="footer-secion flex1">
          <div class="title"></div>
          <div class="footer-secion-list">
            <div class="footer-secion-item">
              <router-link :to="{}">{{ $t('gongyi') }}</router-link>
            </div>
            <div class="footer-secion-item">
              <router-link :to="{}">{{ $t('entertainment') }}</router-link>
            </div>
            <div class="footer-secion-item">
              <router-link :to="{}">{{ $t('ticket') }}</router-link>
            </div>
            <div class="footer-secion-item">
              <router-link :to="{}">{{ $t('inquiry') }}</router-link>
            </div>
          </div>
        </div>

        <!-- 联系我们 -->
        <div class="footer-secion flex1">
          <div class="title">{{ $t('others') }}</div>
          <div class="footer-secion-list">
            <div class="footer-secion-item">
              <a>{{ $t('tariffDescription ') }}</a>
            </div>
            <div class="footer-secion-item">
              <a>{{ $t('termsOfUse') }}</a>
            </div>
            <div class="footer-secion-item">
              <a>{{ $t('certSystemIntro') }}</a>
            </div>
          </div>
        </div>
        <!-- <div class="cro">{{ $t('contactus') }}</div>
        <div class="bottom flex">
          <div class="email flex1">{{ $t('email') }}：showpay@showpay.io</div>
          <div class="copyright">ShowNFT © 2021</div>
        </div> -->
      </div>
    </div>
  </footer>
</template>
<script lang="ts" setup>
const isApp = window.appMetaIdJsV2 || window.appMetaIdJs ? true : false
</script>
<style lang="scss" scoped src="./Footer.scss"></style>
