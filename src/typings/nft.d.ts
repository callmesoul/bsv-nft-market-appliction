declare interface NftItem {
  name: string
  amount: number
  foundryName: string
  classify: string[]
  tokenId: string
  coverUrl: string
  metaId: string
  genesis: string
  tokenIndex: string
  codehash: string
  total?: number
  hasCount?: number
  putAway?: boolean
  productName?: string
  deadlineTime?: number
  head?: string
  ownerAvatarType?: string
  avatarType?: string
  issueUserAvatarType?: string
  nftCertificationType: number
  nftGenesisCertificationType: number
}
declare interface NftItemDetail {
  ownerAvatarType: string
  issueUserAvatarType: string
  foundryName: string
  foundryMetaId: string
  foundryHead: string
  amount: number
  remainingTime: number
  nftName: string
  classify: string[]
  describe: string
  forgeTime: number
  contractAddress: string
  tokenId: string
  ownerName: string
  ownerMetaId: string
  ownerHead: string
  type: string
  revenue: string
  coverUrl: string
  tx: string
  putAway: boolean
  codeHash: string
  genesis: string
  tokenIndex: string
  genesisTxId: string
  sellTxId: string
  ownerAddress: string
  sensibleId: string
  sellContractTxId: string
  sellDesc: string
  issueMetaTxId: string
  auctionDrsc?: string
  sellState: number
  isAuction?: boolean
  startPrice?: string
  currentPrice?: string
  minGapPrice?: string
  auctionTime?: number
  auctionStatus?: number
  update_time?: number
  nftCertificationType: number
  nftGenesisCertificationType: number
  nftGenesisCertificationName: string
  nftWebsite: string
}

declare interface Topic {
  cover: string
  name: string
  createrMetaId: string
  createrName: string
  time: string
  key: string
  coverEn?: string
}
