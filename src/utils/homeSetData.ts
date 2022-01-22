import { setDataStrclassify } from './util'

export default function SetHomeDatas(list: GetNftIssueyTxIdResItem[]) {
  return new Promise<NftItem[]>(resolve => {
    const results: NftItem[] = []
    list.forEach(item => {
      if (item.nftIssueMetaId.slice(0, 6) !== '0064d4') {
        if (item.nftIssuer.toLowerCase().indexOf('showpayteam') === -1) {
          const data = item.nftDataStr ? JSON.parse(item.nftDataStr) : null
          const classify = setDataStrclassify(data)
          results.push({
            ownerAvatarType: item.nftOwnerAvatarType,
            issueUserAvatarType: item.nftIssueAvatarType,
            name: item.nftName ? item.nftName : '--',
            amount: item.nftPrice,
            foundryName: item.nftIssuer,
            classify: classify,
            head: '',
            tokenId: item.nftGenesis + item.nftTokenIndex,
            coverUrl: item.nftIcon,
            putAway: item.nftIsReady,
            metaId: item.nftIssueMetaId,
            productName: item.nftName,
            deadlineTime: 0,
            genesis: item.nftGenesis,
            tokenIndex: item.nftTokenIndex,
            codehash: item.nftCodehash,
            nftCertificationType: item.nftCertificationType,
            nftGenesisCertificationType: item.nftGenesisCertificationType,
            ...item,
          })
        }
      }
    })
    resolve(results)
  })
}
