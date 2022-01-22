<template>
  <div class="nft-detail">
    <ElSkeleton :loading="isShowSkeleton" animated>
      <!-- 骨架屏 -->
      <template #template>
        <DetailSkeletonVue />
      </template>

      <!-- 默认内容 -->
      <template #default>
        <div class="top">
          <div class="flex container">
            <!-- 封面图 -->
            <ElImage
              class="cover flex flex-align-center flex-pack-center"
              fit="contain"
              :alt="nft.val.nftName"
              :src="metafileUrl(nft.val.coverUrl, 470)"
              :preview-src-list="[metafileUrl(nft.val.coverUrl, 800)]"
            ></ElImage>

            <div class="cont flex1 flex flex-v">
              <div class="name flex flex-align-center">
                <span class="text flex1">{{ nft.val.nftName }}</span>
                <!-- <img src="@/assets/images/icon_share.svg" :alt="$t('share')" @click="share" /> -->
              </div>
              <div
                class="series-cert flex flex-align-center"
                v-if="nft.val.nftGenesisCertificationType"
              >
                <img src="@/assets/images/icon_cer_nft.png" />
                {{ $t('beCertedSeries') }}：{{ $t(nft.val.nftGenesisCertificationName) }}
              </div>
              <div class="other-msg">
                <a
                  class="other-msg-item"
                  @click.stop="payLike"
                  :class="{ active: nft.val.nftHasLike }"
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
                  <span class="num">{{ nft.val.nftLikeCount }}</span>
                </a>
                <a
                  class="other-msg-item"
                  @click.stop="isShowDonateModal = true"
                  :class="{ active: nft.val.nftHasDonate }"
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
                  <span class="num">{{ nft.val.nftDonateValue }}</span>
                </a>
              </div>
              <div class="creater-msg flex flex-align-center">
                <!-- 铸造者 -->
                <div class="author flex1 flex flex-align-center">
                  <UserAvatar
                    class="avatar"
                    :metaId="nft.val.foundryMetaId"
                    :hasmask="nft.val.issueUserAvatarType === 'nft-metabot'"
                  />
                  <div class="author-msg flex1">
                    <div class="creater">{{ $t('creater') }}: {{ nft.val.foundryName }}</div>
                    <div class="metaid" v-if="nft.val.foundryMetaId">
                      MetaID:{{ nft.val.foundryMetaId.slice(0, 6) }}
                    </div>
                  </div>
                </div>

                <!-- 认证信息 -->
                <CertTemp
                  :metaId="nft.val.foundryMetaId"
                  :certed="nft.val.nftCertificationType === 1"
                />
              </div>

              <!-- 描述 -->
              <div class="drsc flex1 flex flex-v">
                <div class="drsc-item flex">
                  <span class="name">{{ nft.val.putAway ? $t('seller') : $t('creater') }}</span>
                  <span class="value username flex1">{{ nft.val.ownerName }} </span>
                </div>
                <div class="drsc-item flex">
                  <span class="name"
                    >{{ nft.val.putAway ? $t('seller') : $t('creater') }}{{ $t('theIntro') }}</span
                  >
                  <span class="value flex1"
                    >{{
                      nft.val.isAuction
                        ? nft.val.auctionDrsc
                        : nft.val.putAway
                        ? nft.val.sellDesc
                        : nft.val.describe
                    }}
                  </span>
                </div>
              </div>

              <div class="putAway-msg flex flex-align-center">
                <div class="timeleft flex1">
                  <!-- {{ $t('timeleft') }}：<span>{{ day }}</span
                >{{ $t('day') }}<span>{{ hour }}</span
                >{{ $t('hour') }}<span>{{ minute }}</span
                >{{ $t('minu') }}<span>{{ second }}</span
                >{{ $t('second') }} -->
                </div>

                <!-- 当自己的NFT上架时也要显示价格 -->
                <div
                  class="my-sell-price"
                  v-if="
                    nft.val.putAway &&
                      store.state.userInfo &&
                      store.state.userInfo.metaId === nft.val.ownerMetaId
                  "
                >
                  {{ $t('sellingPrice') }}:
                  {{ new Decimal(nft.val.amount).div(Math.pow(10, 8)).toString() }} BSV
                </div>
              </div>

              <!-- 拍卖信息 -->
              <div class="auction-msg flex flex-align-center" v-if="nft.val.isAuction">
                <div class="auction-msg-item flex1">
                  <div class="title">{{ $t('currentBid') }}：</div>
                  <div class="cont" v-if="nft.val.currentPrice">{{ nft.val.currentPrice }} BSV</div>
                </div>
                <div
                  class="auction-msg-item"
                  v-if="nft.val.isAuction && nft.val.auctionStatus === 2"
                >
                  <div class="title">{{ $t('auctionEndTime') }}：</div>
                  <div class="cont">
                    <VueCountdown
                      :time="nft.val.auctionTime"
                      :transform="transformSlotProps"
                      v-slot="{ days, hours, minutes, seconds }"
                      @end="auctionCountDownFinish"
                      class="count-down-warp"
                    >
                      <div class="count-down">
                        {{ days }}
                        <span>{{ $t('day') }}</span>
                        {{ hours }}
                        <span>{{ $t('hour') }}</span>
                        {{ minutes }}
                        <span>{{ $t('minu') }}</span>
                        {{ seconds }}
                        <span>{{ $t('second') }}</span>
                      </div>
                    </VueCountdown>
                  </div>
                </div>
              </div>

              <!-- 操作 -->
              <div class="operate-warp flex flex-align-center">
                <template v-if="nft.val.isAuction">
                  <!-- 拍卖 -->
                  <div class="flex1">
                    <div
                      class="btn btn-block flex1 flex flex-align-center flex-pack-center"
                      :class="{ 'btn-gray': auctionBtnClassGray }"
                      @click="openAuctionModal"
                    >
                      {{
                        nft.val.auctionStatus === 1
                          ? $t('unStart')
                          : nft.val.auctionStatus === 2
                          ? $t('iWanToBid')
                          : nft.val.auctionStatus === 3 &&
                            store.state.userInfo &&
                            store.state.userInfo.metaId === nft.val.ownerMetaId
                          ? $t('confirmAuctionSend')
                          : $t('isBeBuyed')
                      }}
                    </div>
                    <div class="auctionFailTips">*{{ $t('auctionFailTips') }}</div>
                  </div>
                </template>
                <template v-else-if="nft.val.sellState === 3">
                  <div class="btn btn-block btn-gray flex1 flex flex-align-center flex-pack-center">
                    {{ $t('comingSoon ') }}
                  </div>
                </template>

                <template v-else>
                  <template v-if="isCanBuy">
                    <!-- 非自己的 -->
                    <template
                      v-if="
                        !store.state.userInfo ||
                          (store.state.userInfo &&
                            store.state.userInfo.metaId !== nft.val.ownerMetaId)
                      "
                    >
                      <!-- 购买 -->
                      <div
                        class="btn btn-block flex1 flex flex-align-center flex-pack-center"
                        :class="{ 'btn-gray': !nft.val.putAway }"
                        @click="buy"
                      >
                        <template v-if="nft.val.putAway">
                          {{
                            i18n.locale.value === 'zh'
                              ? `以 ${new Decimal(nft.val.amount)
                                  .div(Math.pow(10, 8))
                                  .toString()} BSV 购买`
                              : `Buy Now At ${new Decimal(nft.val.amount)
                                  .div(10 ** 8)
                                  .toString()} BSV`
                          }}
                        </template>
                        <template v-else>{{ $t('isBeBuyedOrCanceled') }}</template>
                      </div>
                    </template>
                    <!-- 自己的 -->
                    <template
                      v-else-if="
                        store.state.userInfo && store.state.userInfo.metaId === nft.val.ownerMetaId
                      "
                    >
                      <div class="flex flex-align-center putAway-warp flex1" v-if="nft.val.putAway">
                        <div
                          class="btn btn-block btn-plain flex1 flex flex-align-center flex-pack-center"
                          @click="offSale"
                        >
                          {{ $t('offsale') }}
                        </div>
                        <!-- <template v-if="now > nft.val.remainingTime">
                      <div class="btn btn-block flex1" @click="toSale">{{$t('saleAgain')}}</div>
                        </template>-->
                      </div>
                      <div
                        class="btn btn-block flex1 flex flex-align-center flex-pack-center"
                        v-else
                        @click="toSale"
                      >
                        {{ $t('sale') }}
                      </div>
                    </template>
                  </template>
                </template>
              </div>

              <!-- buy-fee-tips 拍卖的时候不显示 -->
              <div
                class="buy-fee-tips"
                v-if="
                  nft.val.putAway &&
                    !nft.val.isAuction &&
                    (!store.state.userInfo ||
                      (store.state.userInfo && store.state.userInfo.metaId !== nft.val.ownerMetaId))
                "
              >
                {{ $t('buyFeeTips') }}:
                {{
                  new Decimal(nft.val.amount)
                    .mul(0.05)
                    .div(10 ** 8)
                    .mul(store.state.userDiscount)
                    .toString()
                }}
                BSV
              </div>
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="bottom-warp">
            <div class="tab">
              <a
                :class="{ active: index === tabIndex }"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="changeTabIndex(index)"
                >{{ $t(tab.key) }}</a
              >
            </div>
            <div class="tab-cont">
              <!-- 作品细节 -->
              <div class="work-deail" v-if="tabIndex === 0">
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('workname') }}：</div>
                    <div class="value flex1">{{ nft.val.nftName }}</div>
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('workclass') }}：</div>
                    <div class="value flex1">
                      <template v-if="nft.val.classify && nft.val.classify.length > 0">
                        <span v-for="item in nft.val.classify" :key="item">{{ $t(item) }}</span>
                      </template>
                      <template v-else>--</template>
                    </div>
                  </div>
                  <!-- 作品链接 -->
                  <div
                    class="work-detail-item flex flex-align-center"
                    v-if="
                      nft.val.classify.find(item => item === 'article') &&
                        nft.val.classify.find(item => item === 'rights')
                    "
                  >
                    <div class="key">{{ $t('worklink') }}：</div>
                    <div class="value flex1">
                      <a class="link" :href="nft.val.nftWebsite" target="_blank">{{
                        $t('workdetaillink')
                      }}</a>
                    </div>
                  </div>
                  <div class="work-detail-item flex flex-align-baseline">
                    <div class="key">{{ $t('workdrsc') }}：</div>
                    <div class="value flex1">
                      <pre>{{ nft.val.describe }}</pre>
                    </div>
                  </div>
                </div>
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('createtime') }}：</div>
                    <div class="value flex1">{{ $filters.dateTimeFormat(nft.val.forgeTime) }}</div>
                  </div>
                  <div
                    class="work-detail-item flex flex flex-align-baseline"
                    v-if="nft.val.sellTxId !== ''"
                  >
                    <div class="key">{{ $t('contractaddr') }}：</div>
                    <div class="value flex1 nowrap">
                      {{ nft.val.sellTxId }}
                      <a class="copy" @click="copy(nft.val.sellTxId)">{{ $t('copy') }}</a>
                      <a class="copy" @click="toWhatsonchain(nft.val.sellTxId)">{{ $t('look') }}</a>
                    </div>
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">TokenID：</div>
                    <div class="value flex1 nowrap">
                      {{ nft.val.tokenId }}
                      <a class="copy" @click="copy(nft.val.tokenId)">{{ $t('copy') }}</a>
                      <!-- <a class="copy" @click="toWhatsonchain(nft.val.tokenId)">{{ $t('look') }}</a> -->
                    </div>
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('issueMetaTxId') }}：</div>
                    <div class="value flex1 nowrap">
                      {{ nft.val.issueMetaTxId }}
                      <a class="copy" @click="copy(nft.val.issueMetaTxId)">{{ $t('copy') }}</a>
                      <a class="copy" @click="toWhatsonchain(nft.val.issueMetaTxId)">
                        {{ $t('look') }}
                      </a>
                    </div>
                  </div>
                </div>
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('creater') }}：</div>
                    <div class="value flex1">
                      <div class="author flex flex-align-center">
                        <UserAvatar
                          class="avatar"
                          :metaId="nft.val.foundryMetaId"
                          :hasmask="nft.val.issueUserAvatarType === 'nft-metabot'"
                        />
                        <div class="author-msg flex1">
                          <div class="creater">{{ nft.val.foundryName }}</div>
                          <div class="metaid" v-if="nft.val.foundryMetaId">
                            MetaID: {{ nft.val.foundryMetaId.slice(0, 6) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <div class="key">{{ $t('haveder') }}：</div>
                    <div class="value flex1">
                      <div class="author flex flex-align-center">
                        <UserAvatar
                          class="avatar"
                          :metaId="nft.val.ownerMetaId"
                          :hasmask="nft.val.ownerAvatarType === 'nft-metabot'"
                        />
                        <div class="author-msg flex1">
                          <div class="creater">{{ nft.val.ownerName }}</div>
                          <div class="metaid" v-if="nft.val.ownerMetaId">
                            MetaID:{{ nft.val.ownerMetaId.slice(0, 6) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="remark">
                  <div class="remark-item">
                    {{ $t('remark1') }}
                    <!-- <a @click="more">{{ $t('knowmore') }}</a> -->
                  </div>
                  <div class="remark-item">{{ $t('remark2') }}</div>
                  <div class="remark-item">{{ $t('remark3') }}</div>
                </div>
              </div>

              <!-- 拥有记录 -->
              <div class="haved-record" v-else-if="tabIndex === 1">
                <div class="tr th flex flex-align-center">
                  <span class="td flex1">{{ $t('owner') }}</span>
                  <span class="td flex1">{{ $t('role') }}</span>
                  <span class="td flex1">{{ $t('time') }}</span>
                  <span class="td  price flex1">{{ $t('price') }}</span>
                </div>

                <!-- 铸造者 -->
                <!-- <div class="tr flex flex-align-center" v-if="ownerRecord.val && records.length > 1">
                  <span class="td flex1 user flex flex-align-center">
                    <img
                      :src="$filters.avatar(ownerRecord.val.metaId)"
                      :alt="ownerRecord.val.name"
                    />
                    <span class="name">{{ ownerRecord.val.name }}</span>
                  </span>
                  <span class="td role flex1 flex flex-align-center">
                    <img src="@/assets/images/icon_casting.svg" />
                    {{ $t('owner') }}
                  </span>
                  <span class="td time flex1">{{
                    $filters.dateTimeFormat(ownerRecord.val.timestamp, 'YYYY-MM-DD HH:mm')
                  }}</span>
                  <span class="td price flex1"
                    >{{
                      ownerRecord.val.satoshisPrice
                        ? new Decimal(ownerRecord.val.satoshisPrice).div(10 ** 8).toString()
                        : '--'
                    }}
                    BSV</span
                  >
                </div> -->

                <!-- 历史拥有者 -->
                <div
                  class="tr flex flex-align-center"
                  v-for="(record, index) in records"
                  :key="record.timestamp"
                >
                  <img class="tobe" src="@/assets/images/list_icon_ins.svg" v-if="index !== 0" />
                  <span class="td flex1 user flex flex-align-center" @click="ToUser(record.metaId)">
                    <img :src="$filters.avatar(record.metaId)" :alt="record.name" />
                    <span class="name">{{ record.name }}</span>
                  </span>
                  <span class="td role flex1 flex flex-align-center">
                    {{ index === 0 ? $t('haveder') : $t('histsoryowner') }}
                  </span>
                  <span class="td time flex1">{{
                    $filters.dateTimeFormat(record.timestamp, 'YYYY-MM-DD HH:mm')
                  }}</span>
                  <span class="td price flex1"
                    >{{
                      record.satoshisPrice
                        ? $filters.bsv(record.satoshisPrice) + 'BSV'
                        : $t('noPaid')
                    }}
                  </span>
                  <a class="link" @click="store.state.sdk?.toTxLink(record.txId)"
                    ><img src="@/assets/images/list_icon_link.svg "
                  /></a>
                </div>

                <LoadMore
                  :pagination="ownerHistoryPagination"
                  @getMore="getMoreRecords"
                  v-if="records.length > ownerHistoryPagination.pageSize"
                />

                <!-- 铸造者 -->
                <div class="tr flex flex-align-center" v-if="issueRecord.val">
                  <img
                    class="tobe"
                    src="@/assets/images/list_icon_ins.svg"
                    v-if="records.length > 0"
                  />
                  <span
                    class="td flex1 user flex flex-align-center"
                    @click="ToUser(issueRecord.val ? issueRecord.val.metaId : '')"
                  >
                    <img
                      :src="$filters.avatar(issueRecord.val.metaId)"
                      :alt="issueRecord.val.name"
                    />
                    <span class="name">{{ issueRecord.val.name }}</span>
                  </span>
                  <span class="td role flex1 flex flex-align-center">
                    <img src="@/assets/images/icon_casting.svg" />
                    {{ $t('creater') }}
                  </span>
                  <span class="td time flex1">{{
                    $filters.dateTimeFormat(issueRecord.val.timestamp, 'YYYY-MM-DD HH:mm')
                  }}</span>
                  <span class="td price flex1">{{ $t('noPaid') }}</span>
                  <a class="link" @click="store.state.sdk?.toTxLink(issueRecord.val.txId)"
                    ><img src="@/assets/images/list_icon_link.svg "
                  /></a>
                </div>
              </div>

              <!-- 历史出价 -->
              <div class="historical-bid" v-if="tabIndex === 2">
                <div
                  class="historical-bid-item flex flex-align-center"
                  v-for="(item, index) in auctionRecords"
                  :key="item.txId"
                >
                  <!-- 用户信息 -->
                  <div class="author flex1 flex flex-align-center">
                    <UserAvatar class="avatar" :metaId="item.metaId" />
                    <div class="author-msg flex1">
                      <div class="creater">{{ item.userName }}</div>
                      <div class="metaid" v-if="item.metaId">
                        MetaID:{{ item.metaId.slice(0, 6) }}
                      </div>
                    </div>
                  </div>
                  <!-- 出价信息 -->
                  <div class="auction-price">
                    <div class="price flex flex-align-center">
                      <a class="btn btn-min" v-if="index === 0 || auctionRecords.length === 1">
                        <!-- <template v-if="item.status === 2">{{ $t('sealTheDeal') }}</template>
                        <template v-else>{{ $t('latestBid') }}</template> -->
                        {{ $t('latestBid') }}
                      </a>
                      <span class="title">{{ $t('auctionBid') }}</span>
                      <span class="amount">{{ $filters.bsv(item.bidPrice) }} BSV</span>
                    </div>
                    <div class="time">
                      {{ $filters.dateTimeFormat(item.timestamp, 'MM月DD日 HH:mm:ss') }}
                    </div>
                  </div>
                </div>

                <div class="historical-bid-item flex flex-align-center">
                  <!-- 用户信息 -->
                  <div class="author flex1 flex flex-align-center">
                    <UserAvatar
                      class="avatar"
                      :metaId="nft.val.foundryMetaId"
                      :hasmask="nft.val.issueUserAvatarType === 'nft-metabot'"
                    />
                    <div class="author-msg flex1">
                      <div class="creater">{{ nft.val.ownerName }}</div>
                      <div class="metaid" v-if="nft.val.ownerMetaId">
                        MetaID:{{ nft.val.ownerMetaId.slice(0, 6) }}
                      </div>
                    </div>
                  </div>
                  <!-- 出价信息 -->
                  <div class="auction-price">
                    <div class="price flex flex-align-center">
                      <span class="title">{{ $t('auctionBid') }}</span>
                      <span class="amount">{{ nft.val.startPrice }} BSV</span>
                    </div>
                    <!-- <div class="time">
                      {{ $filters.dateTimeFormat(nft.val.update_time, 'MM月DD日 HH:mm:ss') }}
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <RecommentSwiper :is-hide-title="true" />
      </template>
    </ElSkeleton>
  </div>

  <!-- drsc detail -->
  <MoreContentModal
    :visible="isShowDrscDetail"
    :title="$t('seller') + $t('drsc')"
    @change="value => (isShowDrscDetail = value)"
  >
    {{ NFTMainMsgDesc }}
  </MoreContentModal>

  <!-- auction price -->
  <ElDialog v-model="isShowAuctionModal">
    <div class="auction-modal">
      <div class="title">{{ $t('iWanToBid') }}</div>
      <div class="msg-list">
        <div class="msg-item flex flex-align-center">
          <div class="key flex1">{{ $t('currentBid') }}</div>
          <div class="value" v-if="nft.val.currentPrice">{{ nft.val.currentPrice }} BSV</div>
        </div>
        <div class="msg-item flex flex-align-center">
          <div class="key flex1">{{ $t('minimumMarkup') }}(10%)</div>
          <div class="value" v-if="nft.val.minGapPrice">{{ nft.val.minGapPrice }} BSV</div>
        </div>
      </div>
      <div class="cont flex flex-align-center">
        <span>{{ $t('myBid') }}</span>
        <input
          type="number"
          v-model="auctionPrice"
          :min="new Decimal(minActionPrice).toNumber()"
          :setp="nft.val.minGapPrice ? new Decimal(nft.val.minGapPrice).toNumber() : 0.1"
          class="warp flex1"
          @change="onAuctionPriceChange"
        />
        <span>BSV</span>
      </div>
      <!-- <div class="equal">≈1036 CNY</div> -->
      <div class="msg-list haved-bsv">
        <div class="msg-item flex flex-align-center">
          <div class="key flex1">{{ $t('availableAssets') }}</div>
          <div class="value">{{ balance }} BSV</div>
        </div>
      </div>

      <div
        class="btn btn-block"
        v-loading="getBalanceLoading"
        v-if="
          new Decimal(auctionPrice)
            .mul(0.05)
            .plus(auctionPrice)
            .toNumber() <= balance
        "
        @click="bid"
      >
        {{ $t('bid') }}
      </div>
      <div class="btn btn-block btn-gray" v-loading="getBalanceLoading" v-else @click="toWallet">
        {{ $t('insufficientBalanceToWallet') }}
        <img src="@/assets/images/card_icon_ins.svg" />
      </div>
      <div class="auctionFailTips">
        *{{ $t('auctionFeeTips') }} {{ new Decimal(auctionPrice).mul(0.05).toString() }} BSV
      </div>
    </div>
  </ElDialog>

  <!-- 打赏 -->
  <DonateModalVue
    :visible="isShowDonateModal"
    :meta-id="nft.val.ownerMetaId"
    :address="nft.val.ownerAddress"
    :target-id="nft.val.issueMetaTxId"
    @change="val => (isShowDonateModal = val)"
    @success="donateSuccess"
  />
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import {
  ElLoading,
  ElMessage,
  ElSkeleton,
  ElSkeletonItem,
  ElMessageBox,
  ElDialog,
  ElImage,
  ElPopover,
} from 'element-plus'
import { useRoute } from 'vue-router'
// @ts-ignore
import {
  CheckUserCanAuction,
  GetMetaSvSign,
  GetMyNftEligibility,
  GetNftAuction,
  GetNftAuctionDetail,
  GetNftAuctionHistory,
  GetNftAuctionHistorys,
  GetNftAuctions,
  GetNftHolderList,
  GetTxRaw,
  Langs,
  NftApiCode,
  SubmitBid,
  TransactionRecord,
} from '@/api'
// @ts-ignore
import dayjs from 'dayjs'
import { useStore } from '@/store'
import { nftTypes, pagination } from '@/config'
import { checkSdkStatus, confirmToSendMetaData, ToUser, sleep } from '@/utils/util'
import Decimal from 'decimal.js-light'
import { router } from '@/router'
import NftOffSale from '@/utils/offSale'
import NFTDetail from '@/utils/nftDetail'
import { metafileUrl } from '@/utils/util'
import Buy from '@/utils/buy'
import VueCountdown from '@chenfengyuan/vue-countdown'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import CertTemp from '@/components/Cert/Cert.vue'
import RecommentSwiper from '@/components/RecommentSwiper/RecommentSwiper.vue'
import MoreContentModal from '@/components/Modal/MoreContentModal/MoreContentModal.vue'
import { bsv, bsvStr, satoshis } from '@/utils/filters'
import { ToBsvType } from '@/enum'
import { auctionConfirmSend } from '@/utils/auction'
import DonateModalVue from '@/components/DonateModal/DonateModal.vue'
import DetailSkeletonVue from './DetailSkeleton.vue'

const i18n = useI18n()
const route = useRoute()
const store = useStore()
const now = new Date().getTime()
const tabs = [
  { name: i18n.t('workdetail'), key: 'workdetail' },
  { name: i18n.t('possessionrecord'), key: 'possessionrecord' },
]
let tabIndex = ref(0)
let isShowSkeleton = ref(true)
let isShowDrscDetail = ref(false)
let isShowAuctionModal = ref(false)

const auctionBtnClassGray = computed(() => {
  if (nft.val.auctionStatus === 2) {
    return false
  } else if (nft.val.auctionStatus === 3) {
    if (store.state.userInfo && store.state.userInfo.metaId === nft.val.ownerMetaId) {
      return false
    } else {
      return true
    }
  } else {
    return true
  }
})

const balance = ref(0) // 用户余额
const getBalanceLoading = ref(true)

const auctionRecords = reactive<GetNftAuctionHistoryResItem[]>([]) // 最小叫价

const ownerHistoryPagination = reactive({
  ...pagination,
})

// @ts-ignore
const nft: { val: NftItemDetail } = reactive({
  val: {},
})

//拍卖价
const auctionPrice = ref(0)
// 最小叫价
const minActionPrice = ref(0)
const isShowDonateModal = ref(false)

// function getDetail() {
//   return new Promise<void>(async (resolve) => {
//     if (typeof route.params.tokenId === 'string') {
//       const res = await GetNftDetail({
//         tokenId: route.params.tokenId,
//       })
//       if (res.code === NftApiCode.success) {
//         nft.val = res.data
//         countDownTimeLeft()
//         isShowSkeleton.value = false
//       }
//     }
//     resolve()
//   })
// }
let isCanBuy = ref(true)

function getDetail() {
  return new Promise<void>(async resolve => {
    const _nft = await NFTDetail(
      typeof route.params.genesisId === 'string' ? route.params.genesisId : '',
      typeof route.params.codehash === 'string' ? route.params.codehash : '',
      typeof route.params.tokenIndex === 'string' ? route.params.tokenIndex : ''
    ).catch(() => (isShowSkeleton.value = false))
    if (_nft && typeof _nft !== 'boolean') {
      nft.val = _nft

      // 拍卖
      if (nft.val.nftCurrentAuctionCreateTxId && nft.val.nftCurrentAuctionCreateTxId !== '') {
        nft.val.isAuction = true
        const _tabIndex = tabs.findIndex(item => item.key === 'historicalBid')
        if (_tabIndex === -1) {
          tabs.push({ name: i18n.t('historicalBid'), key: 'historicalBid' })
        }
        tabIndex.value = 2
        const res = await GetNftAuctionDetail(nft.val.nftCurrentAuctionCreateTxId)
        if (res.code === 0) {
          /* if (!res.data) {
            res.data = {
              bidPrice: '100000', // 竞价价格
              bidPriceInt: 100000, // 竞价价格
              chargeUnit: 'STAS', // 竞价单位
              codehash: 'string',
              genesis: 'string',
              genesisTxId: 'string',
              issuerMetaId: 'string',
              issuerMetaTxId: 'string',
              metaId: 'string',
              metanetId: 'string',
              nftAuctionId: 'string', // nft拍卖创建txId
              nftHash: 'string',
              tokenIndex: 'string',
              txId: 'string',
              currentAuctionState: 2,
              currentBidPrice: '1000',
              currentBidPriceInt: 1000,
              endTimeStamp: 1640673817000,
              userName: 'string',
              startingPrice: '1000',
              startingPriceInt: 1000,
              timestamp: 1640673817000,
            }
          } */
          nft.val.auctionId = res.data.nftAuctionId
          nft.val.startPrice = bsvStr(res.data.startingPrice)
          nft.val.amount = bsv(res.data.startingPriceInt)
          // 当前价
          nft.val.currentPrice =
            res.data.currentBidPrice === '' || res.data.currentBidPrice === '0'
              ? bsvStr(res.data.startingPrice)
              : bsvStr(res.data.currentBidPrice)
          // 最小出价
          nft.val.minGapPrice = new Decimal(nft.val.currentPrice)
            .mul(0.1)
            .toFixed(8)
            .toString()
          if (new Decimal(nft.val.minGapPrice).toNumber() < 0.00001) {
            nft.val.minGapPrice = '0.00001'
          }
          // nft.val.auctionDrsc = item.memo
          nft.val.auctionTime = res.data.endTimeStamp - new Date().getTime()
          nft.val.auctionStatus = res.data.currentAuctionState
          nft.val.update_time = res.data.timestamp
          auctionPrice.value = new Decimal(nft.val.currentPrice)
            .plus(nft.val.minGapPrice)
            .toNumber()
          minActionPrice.value = auctionPrice.value
          // 获取拍卖记录
          getNftAuctionHistorys()
        }
      }
      // countDownTimeLeft()
      isShowSkeleton.value = false
    }
    resolve()
  })
}

// NFT价格 stas 转 bsv
// const price = computed(() => {
//   if (nft.val.amount) {
//     return new Decimal(nft.val.amount).div(10 ** 8).toString()
//   } else {
//     return '--'
//   }
// })

const records: GetNftHolderListResItem[] = reactive([])
const ownerRecord: { val: GetNftHolderListResItem | null } = reactive({
  val: null,
})
const issueRecord: { val: GetNftHolderListResItem | null } = reactive({
  val: null,
})

function getRecord() {
  return new Promise<void>(async resolve => {
    if (typeof route.params.tokenId === 'string') {
      const res = await TransactionRecord({
        tokenId: route.params.tokenId,
      })
      if (res.code === NftApiCode.success) {
        records.length = 0
        // @ts-ignore
        records.push(...res.data)
      }
    }
    resolve()
  })
}

function auctionCountDownFinish() {
  if (nft.val.auctionStatus === 2) {
    nft.val.auctionStatus = 3
  }
}

function transformSlotProps(props: any) {
  const formattedProps = {}
  Object.entries(props).forEach(([key, value]) => {
    // @ts-ignore
    formattedProps[key] = value < 10 ? `0${value}` : String(value)
  })
  return formattedProps
}

function changeTabIndex(index: number) {
  if (tabIndex.value === index) {
    return
  }
  tabIndex.value = index
}

function copy(value: string) {
  toClipboard(value)
    .then(() => {
      ElMessage.success(i18n.t('copysuccess'))
    })
    .catch(() => {
      ElMessage.success(i18n.t('copyerror'))
    })
}

let interval: NodeJS.Timeout
let day = ref(0)
let hour = ref(0)
let minute = ref(0)
let second = ref(0)

// 详细页头部描述我位置的内容
const NFTMainMsgDesc = computed(() => {
  // 1. 是否拍卖 显示拍卖描述 2. 是否上架 显示上架描述 3.下架状态 显示nft的描述
  return nft.val.isAuction
    ? nft.val.describe
    : nft.val.putAway
    ? nft.val.sellDesc
    : nft.val.describe
})

function countDownTimeLeft() {
  interval = setInterval(() => {
    if (nft.val.remainingTime >= now) {
      nft.val.remainingTime = nft.val.remainingTime - 1000
      day.value = Math.abs(dayjs(now).diff(nft.val.remainingTime, 'day'))
      hour.value = Math.abs(dayjs(now).diff(nft.val.remainingTime, 'hour')) - day.value * 24
      minute.value =
        Math.abs(dayjs(now).diff(nft.val.remainingTime, 'minute')) -
        day.value * 24 * 60 -
        hour.value * 60
      second.value =
        Math.abs(dayjs(now).diff(nft.val.remainingTime, 's')) -
        day.value * 24 * 60 * 60 -
        hour.value * 60 * 60 -
        minute.value * 60
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

function toLink() {
  const url = `${import.meta.env.VITE_WhatsonChain}/tx/${nft.val.tx}`
  window.open(url)
}

function offSale() {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'full-loading',
  })
  ElMessageBox.confirm(`${i18n.t('offsaleConfirm')} ${nft.val.nftName} ?`, i18n.t('niceWarning'), {
    confirmButtonText: i18n.t('confirm'),
    cancelButtonText: i18n.t('cancel'),
    closeOnClickModal: false,
  })
    .then(async () => {
      NftOffSale(nft.val, loading)
        .then(() => {
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    })
    .catch(() => loading.close())
}

async function buy() {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'full-loading',
  })
  Buy(nft.val)
    .then(() => {
      nft.val.ownerMetaId = store.state.userInfo!.metaId
      nft.val.ownerName = store.state.userInfo!.name
      nft.val.putAway = false
      ElMessage.success(i18n.t('buySuccess'))
      loading.close()
      router.replace({
        name: 'nftSuccess',
        params: {
          genesisId: nft.val.genesis,
          tokenIndex: nft.val.tokenIndex,
          codehash: nft.val.codeHash,
        },
        query: {
          type: 'buyed',
        },
      })
    })
    .catch(res => {
      loading.close()
      if (res) nftNotCanBuy(res)
    })
}

function toWhatsonchain(txId: string) {
  window.open(`https://whatsonchain.com/tx/${txId}`)
}

// 分享
function share() {
  const value = `${i18n.t('shareText1')}\r\n ${nft.val.nftName}：${window.location.href}`
  toClipboard(value)
    .then(() => {
      ElMessage.success(i18n.t('copyShareSuccess'))
    })
    .catch(() => {
      ElMessage.success(i18n.t('copyerror'))
    })
}

// async function getNft () {
//   const res = await GetNftIssue({
//     tokenId: typeof route.params.tokenId === 'string' ? route.params.tokenId: '',
//     genesisId: typeof route.params.genesisId === 'string' ? route.params.genesisId: '',
//   })
//   debugger
// }

// getNft()

function nftNotCanBuy(res: any) {
  if (
    (res.code === 204 &&
      res.data &&
      res.data.message ===
        'The NFT is not for sale because  the corresponding SellUtxo cannot be found.') ||
    res.data.message === '258: txn-mempool-conflict'
  ) {
    ElMessage.error(i18n.t('nftNotCanBuy'))
    router.back()
  }
}

async function toSale() {
  // 檢查是否有權限
  const res = await GetMyNftEligibility({
    MetaId: store.state.userInfo!.metaId,
    IssueMetaId: nft.val.foundryMetaId,
    lang: i18n.locale.value === 'en' ? Langs.EN : Langs.CN,
  })
  if (res.code !== 0) {
    ElMessage.error(res.data)
    return
  }
  router.push({
    name: 'sale',
    params: {
      genesisId: nft.val.genesis,
      codehash: nft.val.codeHash,
      tokenIndex: nft.val.tokenIndex,
    },
  })
}

async function getBalance() {
  const res = await store.state.sdk?.getBalance()
  if (res?.code === 200) {
    balance.value = res.data.bsv
    getBalanceLoading.value = false
  }
}

function donateSuccess(params: {
  receiveAddress: string
  receiveMetaId: string
  targetId: string
  amount: number
  txId: string
}) {
  ElMessage.success(i18n.t('donateSuccess'))
  nft.val.nftHasDonate = true
  nft.val.nftDonateValue += 1000
  isShowDonateModal.value = false
}

// if (route.params.genesisId && route.params.codehash && route.params.tokenIndex) {
//   getDetail()
// getRecord()
// }

// 更改竞拍价格
function onAuctionPriceChange() {
  if (new Decimal(auctionPrice.value).toNumber() < new Decimal(minActionPrice.value).toNumber()) {
    auctionPrice.value = minActionPrice.value
  }
}

function toWallet() {
  window.open(import.meta.env.VITE_AuthUrl)
}

async function openAuctionModal() {
  // 待发送
  if (
    nft.val.auctionStatus === 3 &&
    store.state.userInfo &&
    store.state.userInfo.metaId === nft.val.ownerMetaId
  ) {
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      customClass: 'full-loading',
    })
    const params = {
      nft: {
        codehash: nft.val.codeHash,
        genesis: nft.val.genesis,
        genesisTxid: nft.val.genesisTxId,
        tokenIndex: nft.val.tokenIndex,
        sensibleId: nft.val.sensibleId,
      },
      nftAuctionId: nft.val.nftCurrentAuctionCreateTxId,
      useFeeb: 0.5,
    }
    const result = await await auctionConfirmSend(params).catch(error => {
      if (error) ElMessage.error(JSON.stringify(error))
      loading.close()
    })
    if (result) {
      setTimeout(() => {
        loading.close()
        getDetail()
      }, 2000)
    }
  }

  if (nft.val.auctionStatus !== 2) return
  await checkSdkStatus()
  isShowAuctionModal.value = true
  getBalance()
}

// 出价
async function bid() {
  if (store.state.sdk.isApp) {
    ElMessage.warning(i18n.t('appNotBid'))
    return
  }
  if (new Decimal(balance.value).toNumber() < new Decimal(auctionPrice.value).toNumber()) return
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
        codehash: nft.val.codeHash,
        genesis: nft.val.genesis,
        genesisTxid: nft.val.genesisTxId,
        tokenIndex: nft.val.tokenIndex,
        sensibleId: nft.val.sensibleId,
      },
      bsvBidPrice: satoshis(auctionPrice.value),
      nftAuctionId: nft.val.nftCurrentAuctionCreateTxId,
      useFeeb: 0.5,
      lastBidPrice: nft.val.currentPrice,
    }
    const res = await store.state.sdk?.nftAuctionBid({
      ...params,
      checkOnly: true,
    })
    if (res?.code === 200) {
      const usedAmount = new Decimal(Math.abs(res.data.amount)).toNumber()
      const result = await confirmToSendMetaData(usedAmount)
      if (result) {
        // 确认支付
        const response = await store.state.sdk?.nftAuctionBid(params)
        if (response && response?.code === 200) {
          ElMessage.success(i18n.t('bidSuccess'))
          nft.val.currentPrice = new Decimal(auctionPrice.value).toString()
          const min = new Decimal(auctionPrice.value).mul(0.1).toFixed(8)
          nft.val.minGapPrice = min.toString()
          if (new Decimal(nft.val.minGapPrice).toNumber() < 0.00001) {
            nft.val.minGapPrice = '0.00001'
          }
          minActionPrice.value = new Decimal(nft.val.currentPrice)
            .plus(nft.val.minGapPrice)
            .toNumber()
          auctionPrice.value = minActionPrice.value
          isShowAuctionModal.value = false
          // 插入拍卖记录
          auctionRecords.unshift({
            bidPrice: satoshis(nft.val.currentPrice).toString(),
            bidPriceInt: satoshis(nft.val.currentPrice),
            chargeUnit: 'bsv',
            codehash: nft.val.codeHash,
            genesis: nft.val.genesis,
            genesisTxId: nft.val.genesisTxId,
            issuerMetaId: nft.val.foundryMetaId,
            issuerMetaTxId: nft.val.issueMetaTxId,
            metaId: store.state.userInfo.metaId,
            metanetId: '',
            nftAuctionId: response.data.txId,
            nftHash: '',
            tokenIndex: nft.val.tokenIndex,
            txId: response.data.txId,
            zeroAddress: store.state.userInfo.address,
            timestamp: new Date().getTime(),
            userName: store.state.userInfo.name,
          })
          loading.close()
        }
      }
    }
  } catch (error) {
    getDetail()
    ElMessage.error(i18n.t('bidFail'))
    if (loading) loading.close()
  }

  /* const res = await CheckUserCanAuction({
    codehash: nft.val.codeHash,
    genesis: nft.val.genesis,
    token_index: parseInt(nft.val.tokenIndex),
    value: new Decimal(auctionPrice.value).toString(),
  }).catch(error => {
    ElMessage.error(error.response.data.data)
    getBalanceLoading.value = true
    isShowSkeleton.value = true
    isShowAuctionModal.value = false
    getDetail()
    loading.close()
  })
  if (res?.code === 0) {

  } */
}

async function getNftAuctionHistorys() {
  const res = await GetNftAuctionHistory({
    auctionTxId: nft.val.nftCurrentAuctionCreateTxId,
    page: 1,
    pageSize: 99,
  })
  if (res.code === 0) {
    auctionRecords.length = 0
    auctionRecords.push(...res.data.results.items)
  }
}

//  获取拥有记录
async function getNftHolderList(isCover = false) {
  return new Promise(async resolve => {
    const res = await GetNftHolderList({
      genesis: typeof route.params.genesisId === 'string' ? route.params.genesisId : '',
      codehash: typeof route.params.codehash === 'string' ? route.params.codehash : '',
      tokenIndex: typeof route.params.tokenIndex === 'string' ? route.params.tokenIndex : '',
      page: ownerHistoryPagination.page.toString(),
      pageSize: ownerHistoryPagination.pageSize.toString(),
    })
    if (res && res.code === NftApiCode.success) {
      if (isCover) {
        records.length = 0
      }
      records.push(...res.data.results.items.holderList)
      ownerRecord.val = res.data.results.items.owner
      issueRecord.val = res.data.results.items.issuer
      const totalPages = Math.ceil(res.data.total / ownerHistoryPagination.pageSize)
      if (totalPages <= ownerHistoryPagination.page) {
        ownerHistoryPagination.nothing = true
      }
    }
  })
}

function getMoreRecords() {
  ownerHistoryPagination.loading = true
  ownerHistoryPagination.page++
  getNftHolderList().then(() => {
    ownerHistoryPagination.loading = false
  })
}

async function payLike() {
  const res = await store.state.sdk.addPayLikeProtocol({
    receiveAddress: nft.val.ownerAddress,
    txId: nft.val.issueMetaTxId,
  })
  if (res.code === 200) {
    nft.val.nftLikeCount++
    nft.val.nftHasLike = true
    ElMessage.success(i18n.t('payLikeSuccess'))
  }
}

onMounted(() => {
  if (route.params.genesisId && route.params.codehash && route.params.tokenIndex) {
    getDetail()
    getNftHolderList()
    // getRecord()
  }
})
</script>
<style lang="scss" scoped src="./Detail.scss"></style>
