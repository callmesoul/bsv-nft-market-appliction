<template>
  <footer>
    <div class="footer-top">
      <div class="container flex">
        <div class="flex1">
          <a class="logo flex flex-align-center">
            <img src="@/assets/images/logo_nos_w.svg" alt="NFTOnShow" />
          </a>
          <div class="slogan">{{ $t('nosSlogan') }}</div>
        </div>
        <div class="flex1">
          <div class="footer-secion">
            <div class="title">{{ $t('nosMarket') }}</div>
            <div class="footer-secion-list">
              <div class="footer-secion-item">
                <a>{{ $t('home') }}</a>
              </div>
              <div class="footer-secion-item">
                <a>{{ $t('topic') }}</a>
              </div>
              <div class="footer-secion-item">
                <a>{{ $t('countryFair') }}</a>
              </div>
              <div class="footer-secion-item">
                <a>{{ $t('createnft') }}</a>
              </div>
            </div>
          </div>
        </div>
        <div class="flex1">
          <div class="footer-secion">
            <div class="title">{{ $t('aboutNOS') }}</div>
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
        </div>
        <div class="cro">{{ $t('contactus') }}</div>
        <div class="bottom flex">
          <div class="email flex1">{{ $t('email') }}：showpay@showpay.io</div>
          <div class="copyright">ShowNFT © 2021</div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      ShowNFT © 2021
    </div>
  </footer>
</template>

<style lang="scss" scoped src="./Footer.scss"></style>
