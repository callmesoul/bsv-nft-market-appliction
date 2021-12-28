declare interface apiResponse {
  code: number
  msg: string
  count: number
  data: any
}

declare interface TransactionRecordItem {
  headUrl: string
  username: string
  ownerTime: number
  amount: string
  metaId: string
}

declare interface Classify {
  classify: string
  disabled?: boolean
}

declare interface SaleNftResponstData extends apiResponse {
  data: {
    tokenId: string
  }
}

declare interface SeriesItem {
  currentNumber: number
  maxNumber: number
  series: string
  codeHash: string
  genesis: string
  genesisTxId: string
  sensibleId: string
}
declare interface GetSeriestData extends apiResponse {
  data: SeriesItem[]
}
declare interface GetClassiesData extends apiResponse {
  data: Classify[]
}
declare interface GetTxStatusData extends apiResponse {
  data: {
    found: boolean
  }
}

declare interface GetProductListResponstData extends apiResponse {
  data: NftItem[]
}

declare interface GetProductDetailResponstData extends apiResponse {
  data: NftItemDetail
}

declare interface TransactionRecordResponstData extends apiResponse {
  data: TransactionRecordItem[]
}

declare interface CreateNftResponstData extends apiResponse {
  data: {
    tokenId: string
  }
}

declare interface CreateNftParams {
  nftName: string
  type: string
  fileUrl: string
  coverUrl: string
  intro: string
  seriesName: string
  tx: string
  classify: string
  codeHash: string
  genesis: string
  nftId: string
  tokenId: string
  tokenIndex: string
  genesisTxId: string
}

declare interface MyNftsResponstData extends apiResponse {
  data: NftItem[]
}

declare interface GetNftIssueRes extends apiResponse {
  data: {
    txId: string
    type: string
    genesisId: string
    genesisTxId: string
    receiverAddress: string
    name: string
    desc: string
    icon: string
    website: string
    issuerName: string
    tokenId: string
    dataStr: string
    timestamp: number
  }
}

declare interface GetMyNftSummaryListParams {
  Address: string
  Page: string
  PageSize: string
}

declare interface GetMyOnSellNftListParams {
  Page: string
  PageSize: string
  MetaId: string
}

declare interface GetMyNftSummaryListRes extends apiResponse {
  data: {
    total: number
    results: {
      items: MyNftSummaryItem[]
    }
  }
}

declare interface MyNftSummaryItem {
  nftCodehash: string
  nftGenesis: string
  nftSensibleId: string
  nftSymbol: Symbol
  nftMyCount: number
  nftMyPendingCount: number
  nftTotalSupply: number
  nftName: string
  nftDesc: string
  nftIcon: string
  nftWebsite: string
  nftIssuer: string
  nftTimestamp: number
  nftIssueVersion: string
  nftDataStr: string
  nftSeriesName: string
  genesisTxId: string
  nftOwnerName: string
  nftTokenIndex: string
  nftIsReady: boolean
  nftOwnerMetaId: string
  nftIssueMetaId: string
  nftOwnerAvatarType: string
  nftIssueAvatarType: string
  nftGenesisCertificationType: number
  nftCertificationType: number
  nftDetailItemList?: {
    nftBalance: number
    nftCodehash: string
    nftDataStr: string
    nftDesc: string
    nftGenesis: string
    nftGenesisTxId: string
    nftIcon: string
    nftIsReady: boolean
    nftIssueAvatarTxId: string
    nftIssueMetaId: string
    nftIssueVersion: string
    nftIssuer: string
    nftName: string
    nftOwnerAddress: string
    nftOwnerAvatarTxId: string
    nftOwnerMetaId: string
    nftOwnerName: string
    nftPrice: number
    nftSatoshi: number
    nftSellTxId: string
    nftSensibleId: string
    nftSeriesName: string
    nftSymbol: string
    nftTimestamp: number
    nftTokenId: string
    nftTokenIndex: string
    nftTotalSupply: number
    nftWebsite: string
  }[]
}

declare interface NFTSeriesItem {
  cover: string
  name: string
  nftDesc: string
  total: number
  hasCount: number
  genesis: string
  codehash: string
}

declare interface NFTSeriesItemData {
  cover: string
  name: string
  nftDesc: string
  total: number
  hasCount: number
}

declare interface GetSeriesNftListResItem {
  nftCodehash: string
  nftGenesis: string
  nftGenesisTxid: string
  nftSymbol: string
  nftBalance: string
  nftName: string
  nftDesc: string
  nftIcon: string
  nftWebsite: string
  nftIssuer: string
  nftTimestamp: number
  nftTotalSupply: string
  nftTokenIndex: string
  nftIssueVersion: string
  nftDataStr: string
  nftIsReady: boolean
  nftOwnerMetaId: string
  nftSensibleId: string
}

declare interface GetSeriesNftListRes extends apiResponse {
  data: {
    total: number
    results: {
      items: GetSeriesNftListResItem[]
    }
  }
}

declare interface GetMyOnSellNftListRes extends apiResponse {
  data: {
    total: number
    results: {
      items: GetNftIssueyTxIdResItem[]
    }
  }
}

declare interface GetNftAuctionsRes extends apiResponse {
  data: GetNftAuctionsResItem[]
}
declare interface GetNftAuctionRes extends apiResponse {
  data: GetNftAuctionResItem
}

declare interface GetNftAuctionResItem {
  bidPrice: string // 竞价价格
  bidPriceInt: number // 竞价价格
  chargeUnit: string // 竞价单位
  codehash: string
  genesis: string
  genesisTxId: string
  issuerMetaId: string
  issuerMetaTxId: string
  metaId: string
  metanetId: string
  nftAuctionId: string // nft拍卖创建txId
  nftHash: string
  tokenIndex: string
  txId: string
  currentAuctionState: number
  currentBidPrice: string
  currentBidPriceInt: number
  endTimeStamp: number
  userName: string
  startingPrice: string
  startingPriceInt: number
  timestamp: number
}

declare interface GetNftAuctionsResItem {
  begin_value: string
  buyer_address: string
  buyer_metaId: string
  buyer_value: string
  codehash: string
  dead_time: number
  final_value: string
  fixed_value: string
  genesis: string
  icon: string
  memo: string
  one_value: string
  status: number
  token_index: number
  update_time: number
  value: string
}
declare interface GetNftAuctionHistorysRes extends apiResponse {
  data: GetNftAuctionHistorysResItem[]
}

declare interface GetNftAuctionHistorysResItem {
  buyer_address: string
  buyer_metaId: string
  buyer_value: string
  codehash: string
  genesis: string
  icon: string
  id: string
  status: number
  token_index: number
  update_time: number
  value: string
}

declare interface GetNftAuctionHistoryRes extends apiResponse {
  data: {
    results: {
      info: {
        responseTime: string
        version: string
      }
      items: GetNftAuctionHistoryResItem[]
    }
  }
}

declare interface GetNftAuctionHistoryResItem {
  bidPrice: string
  bidPriceInt: number
  chargeUnit: string
  codehash: string
  genesis: string
  genesisTxId: string
  issuerMetaId: string
  issuerMetaTxId: string
  metaId: string
  metanetId: string
  nftAuctionId: string
  nftHash: string
  tokenIndex: string
  txId: string
  zeroAddress: string
  timestamp: number
  userName: string
}
declare interface GetMetaBotListRes extends apiResponse {
  data: {
    total: number
    results: {
      items: GetMetaBotListResItem[]
    }
  }
}
declare interface GetCertMetaIdListRes extends apiResponse {
  data: string[]
}
declare interface GetNftHolderListRes extends apiResponse {
  data: {
    total: number
    results: {
      items: {
        holderList: GetNftHolderListResItem[]
        issuer: GetNftHolderListResItem
        owner: GetNftHolderListResItem
      }
    }
  }
}
declare interface GetNftHolderListResItem extends apiResponse {
  avatarTxId: string
  avatarType: string
  codehash: string
  genesis: string
  issuerMetaId: string
  issuerMetaTxId: string
  memo: string
  metaId: string
  name: string
  nftHash: string
  protocol: string
  satoshisPrice: string
  timestamp: 1634203995079
  tokenIndex: string
  txId: string
}
declare interface GetMyNftOnShowSellSuccessListRes extends apiResponse {
  data: {
    total: number
    results: {
      items: GetMyNftOnShowSellSuccessListResItem[]
    }
  }
}
declare interface GetUserDiscountRes extends apiResponse {
  data: {
    nosRate: string
  }
}

declare interface GetRightDetailRes extends apiResponse {
  data: RightItem
}

declare interface GetRightListRes extends apiResponse {
  data: RightItem[]
}
declare interface RightItem {
  metaid: string
  address: string
  genesis: string
  codehash: string
  projectName: string
  prject_team: string
  nftQuantity: number
  cover: string
  dividendCycle: string
  totalDividend: string
  lastDividend: number
  lastDividendDate: number
  nftCertificationType: number
  nftGenesisCertificationType: number
  status: number
}

declare interface GetMyNftOnShowSellSuccessListResItem {
  nftBalance: number
  nftBuyerAvatarTxId: string
  nftBuyerAvatarType: string
  nftBuyerMetaId: string
  nftBuyerName: string
  nftBuyerTimestamp: number
  nftBuyerTimestampStr: string
  nftBuyerTxId: string
  nftCodehash: string
  nftDataStr: string
  nftDesc: string
  nftGenesis: string
  nftGenesisTxId: string
  nftIcon: string
  nftIssueAvatarTxId: string
  nftIssueAvatarType: string
  nftIssueMetaId: string
  nftIssueTimestamp: number
  nftIssueVersion: string
  nftIssuer: string
  nftName: string
  nftOwnerAddress: string
  nftOwnerAvatarTxId: string
  nftOwnerAvatarType: string
  nftOwnerMetaId: string
  nftOwnerName: string
  nftPrice: number
  nftPriceStr: string
  nftSellContractTxId: string
  nftSellDesc: string
  nftSellTxId: string
  nftSensibleId: string
  nftSymbol: string
  nftTimestamp: number
  nftTokenIndex: string
  nftWebsite: string
}
declare interface GetMetaBotListResItem {
  nftSellState: number
  nftBalance: number
  nftBuyTimestamp: number
  nftBuyTxId: string
  nftCancelTimestamp: number
  nftCancelTxId: string
  nftCodehash: string
  nftDataStr: string
  nftDesc: string
  nftGenesis: string
  nftGenesisTxId: string
  nftIcon: string
  nftIssueAvatarTxId: string
  nftIssueMetaId: string
  nftIssueTimestamp: number
  nftIssueVersion: string
  nftIssuer: string
  nftName: string
  nftOwnerAvatarTxId: string
  nftOwnerMetaId: string
  nftOwnerName: string
  nftPrice: number
  nftSellContractTxId: string
  nftSellDesc: string
  nftSellTimestamp: number
  nftSellTxId: string
  nftSensibleId: string
  nftSeriesName: string
  nftSymbol: string
  nftTimestamp: number
  nftTokenIndex: string
  nftWebsite: string
  nftIsReady: boolean
  isAuction?: boolean
  auctionStatus?: number
  currentPrice?: string
  isOnlyDisplay?: boolean
  auctionDeadTime?: number
  nftOwnerAvatarType?: string
  nftIssueAvatarType?: string
  nftCurrentBidPrice: string
  nftCurrentBidPriceInt: number
  nftCurrentAuctionState: number
  nftStartingPrice: string
  nftStartingPriceInt: number
  nftChargeUnit: string
  nftEndTimeStamp: number
}

declare interface GetNftIssueyTxIdResItem {
  nftBalance: number
  nftCodehash: string
  nftDataStr: string
  nftDesc: string
  nftGenesis: string
  nftGenesisTxId: string
  nftIcon: string
  nftIsReady: boolean
  nftIssueAvatarTxId: string
  nftIssueMetaId: string
  nftIssueVersion: string
  nftIssuer: string
  nftName: string
  nftOwnerAddress: string
  nftOwnerAvatarTxId: string
  nftOwnerMetaId: string
  nftOwnerName: string
  nftPrice: number
  nftSatoshi: number
  nftSellContractTxId: string
  nftSellDesc: string
  nftSellTxId: string
  nftSensibleId: string
  nftSymbol: string
  nftTokenIndex: string
  nftTotalSupply: number
  nftWebsite: string
  nftOwnerAvatarType: string
  nftIssueAvatarType: string
  nftCertificationType: number
  nftGenesisCertificationType: number
}
declare interface GetNftIssueyTxIdRes extends apiResponse {
  data: {
    dataStr: string
    desc: string
    genesisId: string
    genesisTxId: string
    icon: string
    issuerName: string
    metaId: string
    metaIdName: string
    metanetId: string
    name: string
    receiverAddress: string
    timestamp: number
    tokenId: string
    txId: string
    type: string
    version: string
    website: string
  }
}

declare interface NFTApiGetNFTDetailRes extends apiResponse {
  data: {
    total: number
    results: {
      info: {
        version: string
        responseTime: string
      }
      items: NFTApiGetNFTDetailResDataItem[]
    }
  }
}

declare interface NFTApiGetNFTDetailResDataItem {
  nftPrice: number
  nftCodehash: string
  nftGenesis: string
  nftGenesisTxId: string
  nftSensibleId: string
  nftSymbol: symbol
  nftBalance: number
  nftName: string
  nftDesc: string
  nftIcon: string
  nftWebsite: string
  nftIssuer: string
  nftTimestamp: number
  nftTotalSupply: number
  nftTokenIndex: string
  nftIssueVersion: string
  nftIssueMetaId: string
  nftDataStr: string
  nftOwnerAddress: string
  nftOwnerAvatarTxId: string
  nftOwnerMetaId: string
  nftOwnerName: string
  nftSellTxId: string
  nftIsReady: boolean
  nftSellContractTxId: string
  nftSellDesc: string
  nftTokenId: string
  nftIssueMetaTxId: string
  nftSellState: number
  nftOwnerAvatarType: string
  nftIssueAvatarType: string
  nftGenesisCertificationType: number
  nftCertificationType: number
  nftGenesisCertificationName: string
  nftCurrentAuctionCreateTxId: string
}

declare interface BroadApiRes {
  code: number
  data: {
    total: number
    result: any
  }
}

declare interface GetBannersRes {
  code: number
  data: {
    total: number
    result: Banner[]
  }
}

declare interface Banner {
  picUrlEn: string
  picUrlJp: string
  picUrlZh: string
  sort: number
  tag: string
  url: string
}
declare interface getTopicsRes {
  code: number
  data: {
    total: number
    result: Topic[]
  }
}

declare interface Topic {
  CreateAvatarTxId: string
  CreateAvatarType: string
  coverPicUrlEn: string
  coverPicUrlJp: string
  coverPicUrlZh: string
  createMetaId: string
  createName: string
  key: string
  name: string
  sort: number
  tag: string
  timestamp: number
  url: number
}

declare interface NFTListSortItem {
  name: string
  nameKey: string
  value: number
  orderType: number
}
declare interface GetGenesisVolumeInfoRes extends apiResponse {
  data: GenesisVolumeInfo
}

declare interface GenesisVolumeInfo {
  averagePricePercentageIncrease: string
  latestPercentageIncrease: string
  maxPrice: number
  maxPriceStr: string
  minPrice: number
  minPriceOnSell: number
  minPriceOnSellStr: string
  minPriceOnSellTxId: string
  minPriceStr: string
  totalSupply: 400
  dateCountList?: {
    date: string
    percentageIncrease: string
    totalTxPrice: number
    totalTxPriceStr: string
    volume: number
    averagePrice: number
    averagePricePercentageIncrease: string
  }[]
}

declare interface GetCertUserInfoRes extends apiResponse {
  data: CertUserInfo
}

declare interface CertUserInfo {
  idNumber: string
  information: string
  metaId: string
  metaIdName: string
  organizationName: string
  realName: string
  userCertificationType: number
}

declare interface GetAppsRes {
  code: number
  result: {
    apps: AppItem[]
  }
}

declare interface AppItem {
  appAddress: string
  appCallbackUrl: string
  appTag: string
  appTimestamp: string
  appType: number
  avatar: string
  avatarUrl: string
  certificationStage: number
  contentEN: string
  contentZH: string
  developerAvatarTxId: string
  developerAvatarType: string
  developerMetaId: string
  developerName: string
  nameEN: string
  nameZH: string
  tokenState: number
  url: string
}

declare interface GetNFTGenesisInfoRes extends apiResponse {
  data: NFTGenesisInfo
}

declare interface NFTGenesisInfo {
  codehash: string
  genesis: string
  sensibleId: string
  metaTxId: string
  metaOutputIndex: number
  name: string
  symbol: string
  desc: string
  icon: string
  website: string
  supply: number
  count: number
  inTimes: number
  outTimes: number
  inSatoshi: number
  outSatoshi: number
}

declare interface GetAuctionListRes extends apiResponse {
  data: {
    total: number
    results: {
      items: GetAuctionListResItem[]
    }
  }
}

declare interface GetAuctionListResItem {
  avatarTxId: string
  avatarType: string
  certificationType: number
  chargeUnit: string
  classifyList: string[]
  classifyListStr: string
  codehash: string
  currentAuctionState: number
  currentBidPrice: string
  currentBidPriceInt: number
  dataStr: string
  desc: string
  endTimeStamp: string
  endTimeStampInt: number
  genesis: string
  genesisCertificationName: string
  genesisCertificationType: number
  genesisTxId: string
  icon: string
  issueTimestamp: number
  issueVersion: string
  issuerMetaId: string
  issuerMetaTxId: string
  metaId: string
  metanetId: string
  name: string
  nftHash: string
  number: number
  part: string
  seriesName: string
  sig: string
  startingPrice: string
  startingPriceInt: number
  timestamp: number
  tokenIndex: string
  txId: string
  userName: string
  website: string
  zeroAddress: string
}
