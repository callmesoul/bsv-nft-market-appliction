import { setDataStrclassify } from './util'

export default function SetHomeDatas(list: GetNftIssueyTxIdResItem[]) {
  return new Promise<NftItem[]>((resolve) => {
    const results: NftItem[] = []
    list.map((item) => {
      if (item.nftIssueMetaId.slice(0, 6) !== '0064d4') {
        if (item.nftIssuer.toLowerCase().indexOf('showpayteam') === -1) {
          const data = item.nftDataStr ? JSON.parse(item.nftDataStr) : null
          const classify = setDataStrclassify(data)
          results.push({
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
          })
        } else {
          if (
            item.nftIssueMetaId ===
            '974e2977d5c9446f7f48fd82c9ea51f82749b9ef7c00d26b73bc450d167d5f31'
          ) {
            const data = item.nftDataStr ? JSON.parse(item.nftDataStr) : null
            const classify = setDataStrclassify(data)
            results.push({
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
            })
          }
        }
      }
    })
    resolve(results)
  })
}
