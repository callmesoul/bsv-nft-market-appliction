import HttpRequest from '@/utils/request'
// @ts-ignore
import qs from 'qs'
import { OrderType, SortType } from './enum'
import { Platform } from './utils/sdk'

const env = import.meta.env

export enum NftApiCode {
  success = 0,
}
const apiHttp = new HttpRequest(env.VITE_WalletApi).request
const rightHttp = new HttpRequest(env.VITE_ToolApi).request
const nftHttp = new HttpRequest(env.VITE_NftApi).request
// const nftHttp = new HttpRequest('').request
const auctionHttp = new HttpRequest(env.VITE_ShowBotApi).request
// const auctionHttp = new HttpRequest('http://192.168.168.118').request
const aggregation = new HttpRequest(env.VITE_AggregationBaseUrl).request
const Sensible = new HttpRequest('https://api.sensiblequery.com').request
export const GetToken = (params: object) => {
  return apiHttp.post('/showmoney/oauth2/oauth/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    transformRequest: [
      function(data: object) {
        return qs.stringify(data)
      },
    ],
  })
}

export const QueryFindMetaData = (params: string) => {
  return apiHttp.get(`/v2showMANDB/api/v1/query/queryFindMetaData/${params}`)
}

export const QueryFindMetaDataForPost = (params: any) => {
  return apiHttp.post(`/v2showMANDB/api/v1/query/queryFindMetaDataForPost`, {
    data: {
      query: btoa(JSON.stringify(params)),
    },
  })
}

export const GetTxData = (txId: string) => {
  return QueryFindMetaDataForPost({
    find: {
      txId,
    },
    skip: 0,
  })
}

export const GetMetaIdInfo = (metaId: string) => {
  return apiHttp.get(`/v2showMANDB/api/v1/query/getMetaIDInfo/${metaId}`)
}

export const GetProductList = (params: {
  pageSize: number
  page: number
  classifyName?: string
}): Promise<GetProductListResponstData> => {
  return nftHttp.post(`/api/v2/product/productList`, params)
}

export const GetProductClassifyList = (params: {
  pageSize: number
  page: number
  classifyName?: string
}): Promise<GetProductListResponstData> => {
  return nftHttp.post(`/api/v2/product/classify`, params)
}

export const GetNftDetail = (params: {
  tokenId: string
}): Promise<GetProductDetailResponstData> => {
  return nftHttp.post(`/api/v2/product/productDetails`, params)
}

export const TransactionRecord = (params: {
  tokenId: string
}): Promise<TransactionRecordResponstData> => {
  return nftHttp.post(`/api/v2/productTransaction/transactionRecord`, params)
}

export const CreateNft = (params: CreateNftParams): Promise<CreateNftResponstData> => {
  return nftHttp.post(`/api/v2/found/foundNft`, params)
}

export const MyNfts = (params: Pagination): Promise<MyNftsResponstData> => {
  return nftHttp.post(`/api/v2/product/myProduct`, params)
}

export const SaleNft = (params: {
  sellValidTime: number
  amount: number | string
  tokenId: string
  sellTxId: string
}): Promise<SaleNftResponstData> => {
  return nftHttp.post(`/api/v2/productTransaction/sell`, params)
}

export const Upload = (params: FormData): Promise<string> => {
  return nftHttp.post(`/api/v2/oss/upload`, params)
}

export const GetSeries = (params: { pageSize: number; page: number }): Promise<GetSeriestData> => {
  return nftHttp.post(`/api/v2/series/getSeries`, params)
}

export const Search = (params: { likeName: string }): Promise<GetProductListResponstData> => {
  return nftHttp.post(`/api/v2/product/productLike`, params)
}

export const GetClassies = (): Promise<GetClassiesData> => {
  return nftHttp.post(`/api/v2/classify/classifyList`)
}

export const OffSale = (params: { tokenId: string }): Promise<apiResponse> => {
  return nftHttp.post(`/api/v2/productTransaction/unshelve`, params)
}

export const BuyNft = (params: {
  tokenId: string
  payMentAddress: string
  collectionAddress: string
  payTxId: string
  amount: number
}): Promise<apiResponse> => {
  return nftHttp.post(`/api/v2/productTransaction/transactionProduct`, params)
}

export const GetTxStatus = (params: { txId: string }): Promise<GetTxStatusData> => {
  return nftHttp.post(`/api/v2/found/getNftStatus`, params)
}

export const CreateSerice = (params: {
  name: string
  count: number
  codeHash: string
  genesis: string
  genesisTxId: string
  sensibleId: string
}): Promise<GetTxStatusData> => {
  return nftHttp.post(`/api/v2/series/foundSeries`, params)
}

export const GetNFTOwnerAddress = (params: { tokenId: string }): Promise<apiResponse> => {
  return nftHttp.post(`/api/v2/productTransaction/ownerAddress`, params)
}

export const GetDeadlineTime = (params: {
  genesis: string
  codeHash: string
  tokenIndex: string
}): Promise<apiResponse> => {
  return nftHttp.post(`/api/v2/productTransaction/getShelvesTime`, params)
}

export const SetDeadlineTime = (params: {
  genesis: string
  codeHash: string
  tokenIndex: string
  deadlineTime: number
}): Promise<apiResponse> => {
  return nftHttp.post(`/api/v2/productTransaction/setShelvesTime`, params)
}

export const RemoveDeadlineTime = (params: {
  genesis: string
  codeHash: string
  tokenIndex: string
  deadlineTime: number
}): Promise<apiResponse> => {
  return nftHttp.post(`/api/v2/productTransaction/removeShelvesTime`, params)
}

export const Login = (params: {
  metaId: string
  xpub: string
  msg: string
  timestamp: number
  type: string
}): Promise<apiResponse> => {
  return nftHttp.post(`/api/v2/user/login`, params)
}

export const GetNftIssue = (params: {
  genesisId: string
  tokenId: string
}): Promise<GetNftIssueRes> => {
  return aggregation.post(`/v2/app/sensible/getNftIssue`, params)
}
export const GetNftIssueyTxId = (params: { txId: string }): Promise<GetNftIssueyTxIdRes> => {
  return aggregation.post(`/v2/app/sensible/getNftIssueByTxId`, params)
}

export const GetMySelledNfts = (params: Pagination): Promise<MyNftsResponstData> => {
  return nftHttp.post(`/api/v2/product/myShelvesProduct`, params)
}

export const GetMyNftSummaryList = (
  params: GetMyNftSummaryListParams
): Promise<GetMyNftSummaryListRes> => {
  return aggregation.post(`/v2/app/sensible/getMyNftSummaryListV2`, params)
}

export const GetMyOnSellNftList = (
  params: GetMyOnSellNftListParams
): Promise<GetMyOnSellNftListRes> => {
  return aggregation.post(`/v2/app/nftOnShow/getMyNftOnShowList`, params)
}

export enum CertificationType {
  isCert = 1,
  unCert = 2,
}
export const GetAllOnSellNftList = (params: {
  PageSize: string
  Page: string
  CertificationType: CertificationType
}): Promise<GetMyOnSellNftListRes> => {
  return aggregation.post(`/v2/app/nftOnShow/getAllNftOnShowList`, params)
}

export const GetNftOnShowListByClassify = (params: {
  PageSize: string
  Page: string
  orderType: OrderType
  sortType: SortType
  classify: string
  CertificationType: CertificationType
}): Promise<GetMyOnSellNftListRes> => {
  return aggregation.post(`/v2/app/nftOnShow/getNftOnShowListByClassify`, params)
}

export const GetNftOnShowListBySearch = (params: {
  PageSize: string
  Page: string
  orderType: OrderType
  sortType: SortType
  SearchWord: string
  CertificationType: CertificationType
}): Promise<GetMyOnSellNftListRes> => {
  return aggregation.post(`/v2/app/nftOnShow/getNftOnShowListBySearch`, params)
}

export const GetSeriesNftList = (params: {
  Page: string
  PageSize: string
  Address: string
  codehash: string
  genesis: string
}): Promise<GetSeriesNftListRes> => {
  return aggregation.post(`/v2/app/sensible/getMyNftSummaryDetailList`, params)
}

export const NFTApiGetNFTDetail = (params: {
  tokenIndex: string
  codehash: string
  genesis: string
}): Promise<NFTApiGetNFTDetailRes> => {
  return aggregation.post(`/v2/app/sensible/getOneNftSummaryDetail`, params)
}

export const GetRecommendOnSellNftList = (params: {
  PageSize: string
  Page: string
}): Promise<GetMyOnSellNftListRes> => {
  return aggregation.post(`/v2/app/nftOnShow/getRecommendNftOnShowList`, params)
}

export enum Langs {
  CN = 'cn',
  EN = 'en',
}
export const GetMyNftEligibility = (params: {
  MetaId: string
  IssueMetaId: string
  lang: Langs
}): Promise<apiResponse> => {
  return aggregation.get(
    `/v2/app/nftOnShow/getMyNftEligibility/${params.MetaId}//${params.IssueMetaId}/${params.lang}`
  )
}

export const GetMetaBotList = (params: {
  PageSize: string
  Page: string
  Start: number
  End: number
}): Promise<GetMetaBotListRes> => {
  return aggregation.post(`/v2/app/metaBot/getMetaBotListByBetweenNumber`, params)
}

export const GetMetaBotListByBetweenNumber = (params: {
  PageSize: string
  Page: string
  Start: number
  End: number
}): Promise<GetMetaBotListRes> => {
  return aggregation.post(`/v2/app/metaBot/getMetaBotListByBetweenNumber`, params)
}

export const GetMetaBotListBySearch = (params: {
  PageSize: string
  Page: string
  SearchWord: string
}): Promise<GetMetaBotListRes> => {
  return aggregation.post(`/v2/app/metaBot/getMetaBotListBySearch`, params)
}
export const GetMyNftOnShowSellSuccessList = (params: {
  MetaId: string
  Page: string
  PageSize: string
}): Promise<GetMyNftOnShowSellSuccessListRes> => {
  return aggregation.post(`/v2/app/nftOnShow/getMyNftOnShowSellSuccessList`, params)
}

export const GetTopicNftList = (params: {
  TopicType: string
  Page: string
  PageSize: string
  orderType: OrderType
  sortType: SortType
  sellType?: string
}): Promise<GetMetaBotListRes> => {
  return aggregation.post(`/v2/app/nftOnShow/getTopicNftList`, params)
}

export const GetCertMetaIdList = (): Promise<GetCertMetaIdListRes> => {
  return aggregation.get(`/v2/app/nftOnShow/getNosCertificationMetaIdList`)
}

export const GetMyNftOnShowBuySuccessList = (params: {
  MetaId: string
  Page: string
  PageSize: string
}): Promise<GetMyNftOnShowSellSuccessListRes> => {
  return aggregation.post(`/v2/app/nftOnShow/getMyNftOnShowBuySuccessList`, params)
}

export const GetNftHolderList = (params: {
  codehash: string
  genesis: string
  tokenIndex: string
  page: string
  pageSize: string
}): Promise<GetNftHolderListRes> => {
  const { codehash, genesis, tokenIndex, ..._params } = params
  return aggregation.get(
    `/v2/app/nftOnShow/getNftHolderList/${codehash}/${genesis}/${tokenIndex}`,
    {
      params: _params,
    }
  )
}

export const CreateNftAuction = (params: {
  codehash: string
  genesis: string
  token_index: number
  value: string
  fixed_value: string
  begin_value: string
  icon: string
  memo: string
  one_value: string
  dead_time: number
  auction_tx: string
}): Promise<GetMetaBotListRes> => {
  return auctionHttp.post(`/v1/app/admin/addMetaBot`, params)
}

export const GetNftAuctions = (params: {
  page: number
  page_size: number
}): Promise<GetNftAuctionsRes> => {
  return auctionHttp.post(`/v1/app/metabot/all`, params)
}

export const CheckUserCanAuction = (params: {
  codehash: string
  genesis: string
  token_index: number
  value: string
}): Promise<GetMetaBotListRes> => {
  return auctionHttp.post(`/v1/app/metabot/offerCheck`, params)
}

export const SubmitBid = (params: {
  codehash: string
  genesis: string
  token_index: number
  value: string
  tx: string
  raw_tx: string
  buyer_meta_id: string
  buyer_address: string
}): Promise<GetMetaBotListRes> => {
  return auctionHttp.post(`/v1/app/metabot/offer`, params)
}

export const GetNftAuctionHistorys = (params: {
  codehash: string
  genesis: string
  token_index: number
  page: number
  page_size: number
}): Promise<GetNftAuctionHistorysRes> => {
  return auctionHttp.post(`/v1/app/metabot/itemHistory`, params)
}

export const GetUserAuctionHistorys = (params: {
  meta_id: string
  page: number
  page_size: number
}): Promise<GetMetaBotListRes> => {
  return auctionHttp.post(`/v1/app/metabot/metaId`, params)
}

export const GetTxRaw = (txid: string): Promise<GetMetaBotListRes> => {
  return new Promise((resolve, reject) => {
    fetch(`https://apiv2.metasv.com/tx/${txid}/raw`, {
      headers: {},
    })
      .then(function(response) {
        return response.json()
      })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export const GetUserDiscount = (params: {
  metaId: string
  zeroAddress: string
}): Promise<GetUserDiscountRes> => {
  return aggregation.get(
    `/v2/app/nftOnShow/getMyNosCommissionRate/${params.metaId}/${params.zeroAddress}/1`
  )
}

/* 权益 api */
export const CreateRight = (params: {
  projectName: string
  teamSide: string
  nftQuantity: number
  dividendCycle: string
  genesis: string
  codehash: string
}) => {
  return rightHttp.post('/api/v1/equity/dividend/project/address', params)
}

export const GetRightDetail = (params: {
  genesis: string
  codehash: string
}): Promise<GetRightDetailRes> => {
  return rightHttp.get(`/api/v1/equity/dividend/project/${params.genesis}/${params.codehash}`)
}

export const GetRightList = (): Promise<GetRightListRes> => {
  return rightHttp.get(`/api/v1/equity/dividend/project`)
}

export const GetBanners = (): Promise<GetBannersRes> => {
  return apiHttp.get(`/broad/v1/nos/topic/getNosBannerList`)
}

export const getTopics = (): Promise<getTopicsRes> => {
  return apiHttp.get(`/broad/v1/nos/topic/getNosTopicInfoList`)
}

export const GetGenesisVolumeInfo = (
  genesis: string,
  day: number = 7
): Promise<GetGenesisVolumeInfoRes> => {
  return apiHttp.get(`/broad/v1/nos/count/getGenesisVolumeInfo/${genesis}`, { params: { day } })
}

export const GetCertUserInfo = (metaId: string): Promise<GetCertUserInfoRes> => {
  return apiHttp.get(`/broad/v1/nos/certification/getNosCertificationUserInfo/${metaId}`)
}

export const GetNosGenesisInfo = (params: {
  key: string
  lang: string
}): Promise<GetNosGenesisInfoRes> => {
  return apiHttp.get(
    `/broad/v1/nos/certification/getNosGenesisInfo/${params.key}?lang=${params.lang}`
  )
}

// 获取appWeb列表
export const GetApps = (params?: {
  // metaId: string
  certificationStage: string
}): Promise<GetAppsRes> => {
  return apiHttp.post(`/serviceapi/api/v1/showService/getAppWebviewList`, {
    data: JSON.stringify(params),
  })
}

export const GetNFTGenesisInfo = (params: {
  codehash: string
  genesis: string
}): Promise<GetNFTGenesisInfoRes> => {
  return Sensible.get(`/nft/genesis-info/${params.codehash}/${params.genesis}`)
}
