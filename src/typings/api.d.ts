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
declare interface GetMetaBotListRes extends apiResponse {
  data: {
    total: number
    results: {
      items: GetMetaBotListResItem[]
    }
  }
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
}
