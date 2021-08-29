import { GetDeadlineTime, NFTApiGetNFTDetail } from "@/api"

export default function NFTDetail (genesis: string, codehash: string, tokenIndex: string) {
    return new Promise<NftItemDetail>(async (resolve, reject) => {
        const res = await NFTApiGetNFTDetail({
            genesis,
            codehash,
            tokenIndex
          }).catch(() => reject())
          if (res?.code === 0) {
            if (res.data.results.items.length > 0) {
              const item = res.data.results.items[0]
              const data = item.nftDataStr ? JSON.parse(item.nftDataStr) : ''
              const deadlineTimeRes = await GetDeadlineTime({
                codeHash: item.nftCodehash,
                genesis: item.nftGenesis,
                tokenIndex: item.nftTokenIndex
              })
              const nft: NftItemDetail = {
                foundryName: item.nftIssuer,
                foundryMetaId: item.nftIssueMetaId,
                foundryHead: '',
                amount: item.nftPrice,
                remainingTime: deadlineTimeRes && deadlineTimeRes.data && deadlineTimeRes.data.deadlineTime ? deadlineTimeRes.data.deadlineTime : null,
                nftName: item.nftName ? item.nftName : '--',
                classify: data && data.classifyList  ? JSON.parse(data.classifyList): [],
                describe: item.nftDesc,
                forgeTime: item.nftTimestamp,
                contractAddress: '',
                tokenId: item.nftGenesis + item.nftTokenIndex,
                ownerName: item.nftOwnerName,
                ownerMetaId: item.nftOwnerMetaId,
                ownerHead: '',
                ownerAddress: item.nftOwnerAddress,
                type: data ? data.nftType : '',
                revenue: '',
                coverUrl: item.nftIcon,
                tx: data ? data.contentTxId : '',
                putAway: item.nftIsReady,
                codeHash: item.nftCodehash,
                genesis: item.nftGenesis,
                tokenIndex: item.nftTokenIndex,
                genesisTxId: item.nftGenesisTxId,
                sellTxId: item.nftSellTxId,
                sensibleId: item.nftSensibleId
              }
              debugger
              resolve(nft)
            } else {
                reject()
            }
        }
    })
}