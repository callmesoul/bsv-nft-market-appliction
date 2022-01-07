<template>
  <div class="nft-detail">
    <ElSkeleton :loading="isShowSkeleton" animated>
      <!-- 骨架屏 -->
      <template #template>
        <div class="top flex container">
          <!-- {{ nft.val.coverUrl }} -->
          <ElSkeletonItem class="cover" variant="image" />
          <div class="cont flex1 flex flex-v">
            <div class="name flex flex-align-center">
              <ElSkeletonItem class="text" variant="text" style="width: 80%" />
            </div>
            <div class="creater-msg">
              <div class="author flex flex-align-center">
                <ElSkeletonItem variant="image" class="avatar" />
                <div class="author-msg flex1">
                  <ElSkeletonItem class="creater" variant="text" />
                  <ElSkeletonItem class="metaid" variant="text" />
                </div>
              </div>
              <div class="cert">
                <ElSkeletonItem class="text " variant="text" style="width: 20%" />
              </div>
            </div>
            <div class="drsc flex1 flex flex-v">
              <ElSkeletonItem class="title" variant="h1" />
              <div class="cont flex1">
                <ElSkeletonItem variant="text" style="width: 80%" />
                <ElSkeletonItem variant="text" style="width: 60%; margin-top: 15px;" />
                <ElSkeletonItem variant="text" style="width: 40%; margin-top: 15px;" />
              </div>
            </div>

            <div class="timeleft">
              <ElSkeletonItem variant="text" />
            </div>
            <div class="operate-warp">
              <ElSkeletonItem class="btn btn-block" variant="button" />
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="bottom-warp">
            <div class="tab">
              <ElSkeletonItem variant="text" />
              <ElSkeletonItem variant="text" />
            </div>
            <div class="tab-cont">
              <!-- 作品细节 -->
              <div class="work-deail" v-if="tabIndex === 0">
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                  <div class="work-detail-item flex flex-align-baseline">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                </div>
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                  <div class="work-detail-item flex flex flex-align-baseline">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                </div>
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                  <div class="work-detail-item flex flex-align-center">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                </div>
                <div class="work-deail-section">
                  <div class="work-detail-item flex flex-align-center">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                  <div class="work-detail-item flex flex-align-center" v-if="nft.val.type === '3'">
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                  <div class="work-detail-item flex flex-align-center" v-else>
                    <ElSkeletonItem class="key" variant="text" />
                    <ElSkeletonItem class="value flex1" variant="text" />
                  </div>
                </div>

                <div class="remark">
                  <div class="remark-item">
                    <ElSkeletonItem variant="text" />
                  </div>
                  <div class="remark-item">
                    <ElSkeletonItem variant="text" />
                  </div>
                  <div class="remark-item">
                    <ElSkeletonItem variant="text" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 默认内容 -->
      <template #default>
        <div class="top flex container">
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
              <ElPopover
                placement="bottom"
                :width="400"
                trigger="hover"
                popper-class="common-popover"
              >
                <template #reference>
                  <span class="text flex1">{{ nft.val.nftName }}</span>
                </template>
                {{ nft.val.nftName }}
              </ElPopover>
              <img src="@/assets/images/icon_share.svg" :alt="$t('share')" @click="share" />
            </div>
            <div
              class="series-cert flex flex-align-center"
              v-if="nft.val.nftGenesisCertificationType"
            >
              <img src="@/assets/images/icon_cer_nft.png" />
              {{ $t('beCertedSeries') }}：{{ $t(nft.val.nftGenesisCertificationName) }}
            </div>
            <div class="creater-msg">
              <!-- 铸造者 -->
              <div class="author flex flex-align-center">
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
              <div class="title flex flex-align-center">
                <template v-if="nft.val.putAway">
                  {{ $t('seller') }}
                  <UserAvatar
                    :metaId="nft.val.ownerMetaId"
                    :hasmask="nft.val.ownerAvatarType === 'nft-metabot'"
                  />
                  <span>{{ nft.val.ownerName }}</span>
                  {{ $t('theIntro') }}：
                </template>
                <template v-else>{{ $t('drsc') }}:</template>
              </div>
              <div class="cont">
                {{ NFTMainMsgDesc.length > 60 ? NFTMainMsgDesc.slice(0, 60) : NFTMainMsgDesc }}
                <a v-if="NFTMainMsgDesc.length > 60">
                  ...
                  <span @click="isShowDrscDetail = true">{{ $t('getmore') }}</span>
                </a>
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
              <div class="auction-msg-item" v-if="nft.val.isAuction && nft.val.auctionStatus === 2">
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
              <template
                v-if="
                  nft.val.isAuction && nft.val.auctionStatus !== 0 && nft.val.auctionStatus !== 4
                "
              >
                <!-- 拍卖 -->
                <div class="flex1">
                  <div
                    class="btn btn-block flex1 flex flex-align-center flex-pack-center"
                    :class="{
                      'btn-gray': auctionBtnClassGray,
                    }"
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
                <!-- 一口价购买 -->
                <!-- <div
                        class="btn btn-block btn-black flex1 flex-align-center flex-pack-center"
                        @click="buy"
                      >
                        <div>
                          <div class="title">一口价</div>
                          <div class="cont">4.55 BSV</div>
                        </div>
                </div>-->
              </template>
              <template v-else-if="nft.val.sellState === 3">
                <div class="btn btn-block btn-gray flex1 flex flex-align-center flex-pack-center">
                  {{ $t('comingSoon ') }}
                </div>
              </template>
              <template v-else>
                <!-- 非自己的 -->
                <template
                  v-if="
                    !store.state.userInfo ||
                      (store.state.userInfo && store.state.userInfo.metaId !== nft.val.ownerMetaId)
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
                          : `Buy Now At ${new Decimal(nft.val.amount).div(10 ** 8).toString()} BSV`
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
                      <div class="creater">{{ nft.val.foundryName }}</div>
                      <div class="metaid" v-if="nft.val.foundryMetaId">
                        MetaID:{{ nft.val.foundryMetaId.slice(0, 6) }}
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
        <span>竞拍</span>
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
      <!-- buy-fee-tips -->
      <!-- <div class="buy-fee-tips">
        {{ $t('buyFeeTips') }}:
        {{
          new Decimal(auctionPrice)
            .mul(0.05)
            .div(10 ** 8)
            .mul(store.state.userDiscount)
            .toString()
        }}
        BSV
      </div> -->
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
        v-if="auctionPrice <= balance"
        @click="bid"
      >
        {{ $t('bid') }}
      </div>
      <div class="btn btn-block btn-gray" v-loading="getBalanceLoading" v-else @click="toWallet">
        {{ $t('insufficientBalanceToWallet') }}
        <img src="@/assets/images/card_icon_ins.svg" />
      </div>
    </div>
  </ElDialog>
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
import { checkSdkStatus, confirmToSendMetaData, ToUser } from '@/utils/util'
import Decimal from 'decimal.js-light'
import { router } from '@/router'
import NftOffSale from '@/utils/offSale'
import NFTDetail from '@/utils/nftDetail'
import { metafileUrl } from '@/utils/util'
import Buy from '@/utils/buy'
import VueCountdown from '@chenfengyuan/vue-countdown'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import CertTemp from '@/components/Cert/Cert.vue'
import MoreContentModal from '@/components/Modal/MoreContentModal/MoreContentModal.vue'
import { bsv, bsvStr, satoshis } from '@/utils/filters'
import { ToBsvType } from '@/enum'
import { auctionConfirmSend } from '@/utils/auction'

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

onMounted(() => {
  if (route.params.genesisId && route.params.codehash && route.params.tokenIndex) {
    getDetail()
    // getRecord()
  }
})

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

getNftHolderList()
</script>
<style lang="scss" scoped src="./Detail.scss"></style>
