import {
  BuyNFTParams,
  CancelSellNFTParams,
  ConstructorOptionsTypes,
  CreateMetaFileFunParams,
  CreateNFTParams,
  CreateNFTRes,
  CreateNftSellProtocolParams,
  GetBalanceRes,
  GetMcRes,
  IssueNFTResData,
  MetaIdJsRes,
  NftBuyParams,
  NftBuyResData,
  NftCancelParams,
  NFTCancelResData,
  NftDataProtocolParams,
  NFTGenesisParams,
  NFTIssueParams,
  NFTLIstRes,
  NftSellParams,
  NftSellResData,
  ProtocolParamsTypes,
  SdkCallBack,
  SdkGenesisNFTRes,
  SellNFTParams,
  SendMetaDataTxRes,
  SignMessageRes,
} from '@/typings/sdk'
import { rejects } from 'assert/strict'
import MetaIdJs, { ProtocolOptions } from 'metaidjs'
// @ts-ignore
import { v4 as uuid } from 'uuid'

import { ElMessage } from 'element-plus'

import { store } from '@/store'
import { Decimal } from 'decimal.js-light'
import { Langs } from '@/api'
import { fail } from 'assert'
import axios from 'axios'

const metaIdTag = import.meta.env.VITE_MetaIdTag

const doubleTimeOut = 4000 // 防止双花 定时器时间

const enum Platform {
  'Web' = 0,
  'Android' = 1,
  'Ios' = 2,
}
export default class Sdk {
  metaidjs: null | MetaIdJs = null
  appMetaidjs: null | {
    sendMetaDataTx: (accessToken: string, data: string, functionName: string) => Function
    decryptData: (accessToken: string, data: string, functionName: string) => Function
    getUserInfo: (appId: string, appScrect: string, functionName: string) => Function
    genesisNFT: (accessToken: string, params: string, functionName: string) => Function
    issueNFT: (accessToken: string, params: string, functionName: string) => Function
  } = null
  isApp: boolean = false
  appId: string = ''
  appScrect: string = ''
  isProduction =
    import.meta.env.MODE === 'gray' ||
    import.meta.env.MODE === 'prod' ||
    import.meta.env.MODE === 'production'
  constructor(options?: ConstructorOptionsTypes) {
    this.appId = import.meta.env.VITE_AppId
    this.appScrect = import.meta.env.VITE_AppSecret
    // @ts-ignore
    const appMetaIdJs = window?.appMetaIdJsV2
      ? window?.appMetaIdJsV2
      : window?.appMetaIdJs
      ? window?.appMetaIdJs
      : null
    if (appMetaIdJs) {
      this.appMetaidjs = appMetaIdJs
      this.isApp = true
    } else {
      if (options) {
        this.metaidjs = new MetaIdJs(options)
      }
    }
  }

  getUserInfo() {
    return new Promise<MetaIdJsRes>(resolve => {
      const params = {
        accessToken: store.state.token ? store.state.token?.access_token : '',
        callback: (res: MetaIdJsRes) => {
          alert('getUserInfo callback')
          alert(res)
          this.callback(res, resolve)
        },
      }
      if (this.isApp) {
        const functionName: string = `getUserInfoCallBack`
        const that = this
        // @ts-ignore
        window[functionName] = function(res) {
          alert('getUserInfo callback')
          alert(res)
          that.callback(res, resolve)
        }
        if (window.appMetaIdJsV2) {
          window.appMetaIdJsV2?.getUserInfo(this.appId, this.appScrect, functionName)
        } else {
          window.appMetaIdJs?.getUserInfo(this.appId, this.appScrect, functionName)
        }
      } else {
        this.metaidjs?.getUserInfo(params)
      }
    })
  }
  sendMetaDataTx(params: {
    data: string
    nodeName: string
    brfcId: string
    attachments?: string[]
    path: string
    payCurrency?: string
    payTo?: { amount: number; address: string }[]
    needConfirm?: boolean
    encrypt?: string
    dataType?: string
    checkOnly?: boolean
  }) {
    return new Promise<SendMetaDataTxRes>((resolve, reject) => {
      if (!params.payCurrency) params.payCurrency = 'BSV'
      if (typeof params.needConfirm === 'undefined') params.needConfirm = true
      if (!params.encrypt) params.encrypt = '0'
      if (!params.dataType) params.dataType = 'application/json'
      const accessToken = store.state.token ? store.state.token?.access_token : ''
      const callback = (res: MetaIdJsRes) => {
        this.callback(res, resolve)
      }
      const onCancel = (res: MetaIdJsRes) => {
        reject(res)
      }
      if (this.isApp) {
        const functionName: string = `sendMetaDataTxCallBack`
        // @ts-ignore
        window[functionName] = callback
        if (window.appMetaIdJsV2) {
          window.appMetaIdJsV2?.sendMetaDataTx(accessToken, JSON.stringify(params), functionName)
        } else {
          window.appMetaIdJs?.sendMetaDataTx(accessToken, JSON.stringify(params), functionName)
        }
      } else {
        const _params = {
            callback,
            onCancel,
            metaIdTag,
            accessToken,
            ...params,
          }

          // 处理余额不足回调
        ;(window as any).handleNotEnoughMoney = (res: MetaIdJsRes) => {
          reject()
        }
        this.metaidjs?.sendMetaDataTx(_params)
      }
    })
  }

  eciesDecryptData(params: { accessToken: string; callback?: Function; data: string }) {
    if (this.isApp) {
      const functionName: string = `eciesDecryptDataCallBack`
      // @ts-ignore
      window[functionName] = params.callback
      if (window.appMetaIdJsV2) {
        window.appMetaIdJsV2?.decryptData(params.accessToken, params.data, functionName)
      } else {
        window.appMetaIdJs?.decryptData(params.accessToken, params.data, functionName)
      }
    } else {
      this.metaidjs?.eciesDecryptData(params)
    }
  }

  createMetaFile(params: CreateMetaFileFunParams) {
    const { name, ...data } = params.data
    const nameArry = name.split('.')
    let node_name: string = ''
    nameArry.map((item, index) => {
      node_name += item
      if (index === nameArry.length - 2) {
        node_name += uuid()
      }
    })
    return this.sendMetaDataTx({
      nodeName: 'NftIssue-6d3eaf759bbc',
      brfcId: '6d3eaf759bbc',
      path: '/Protocols/MetaFile',
      payCurrency: 'bsv',
      // payTo: [
      //     { address: 'XXXXXXXXXX', amount: 1000 }
      // ],
      data: JSON.stringify({
        ...data,
        encoding: 'binary',
        node_name,
      }),
      needConfirm: false,
    })
  }

  // 检查NFT操作txid状态，成功后才可继续其他上链操作，否则容易双花
  checkNftTxIdStatus(
    txId: string,
    timer?: number,
    parentResolve?: (value: void | PromiseLike<void>) => void,
    parentReject?: any
  ) {
    return new Promise<void>(async (resolve, reject) => {
      axios
        .get(`https://api.sensiblequery.com/tx/${txId}`)
        .then(res => {
          if (res.data.code === 0) {
            if (parentResolve) parentResolve()
            else resolve()
          } else {
            if (timer && timer > 30) {
              if (parentReject) parentReject()
              else reject()
            } else {
              setTimeout(() => {
                this.checkNftTxIdStatus(
                  txId,
                  timer ? timer + 1 : 1,
                  parentResolve ? parentResolve : resolve,
                  parentReject ? parentReject : reject
                )
              }, 1000)
            }
          }
        })
        .catch(err => {
          setTimeout(() => {
            this.checkNftTxIdStatus(
              txId,
              timer ? timer + 1 : 1,
              parentResolve ? parentResolve : resolve,
              parentReject ? parentReject : reject
            )
          }, 1000)
        })
    })
  }

  // 检查txid状态，成功后才可继续其他上链操作，否则容易双花
  checkTxIdStatus(
    txId: string,
    timer?: number,
    parentResolve?: (value: void | PromiseLike<void>) => void,
    parentReject?: any
  ) {
    return new Promise<void>((resolve, reject) => {
      fetch(`${import.meta.env.VITE_WalletApi}/showMANDB/api/v1/metanet/getNode/${txId}`)
        .then(function(response) {
          return response.json()
        })
        .then(response => {
          if (response) {
            if (response.code === 200) {
              if (parentResolve) parentResolve()
              else resolve()
            } else {
              // 超过30次还不成功就 回调失败
              if (timer && timer > 30) {
                if (parentReject) parentReject()
                else reject()
              } else {
                setTimeout(() => {
                  this.checkNftTxIdStatus(
                    txId,
                    timer ? timer + 1 : 1,
                    parentResolve ? parentResolve : resolve,
                    parentReject ? parentReject : reject
                  )
                }, 1000)
              }
            }
          } else {
            this.checkNftTxIdStatus(
              txId,
              timer ? timer + 1 : 1,
              parentResolve ? parentResolve : resolve,
              parentReject ? parentReject : reject
            )
          }
        })
        .catch(() => {
          if (parentReject) parentReject()
          else reject()
        })
    })
  }

  // 铸造 nft 1. genesisNFT  2.createNftDataProtocol 3.issueNFT
  createNFT(params: CreateNFTParams) {
    return new Promise<
      | {
          // genesisNFT response data
          codehash: string
          genesisId: string
          genesisTxid: string
          sensibleId: string
          // issueNFT response data
          metaTdid: string
          nftId: string
          tokenId: string
          txId: string
          tokenIndex: string
          sendMoneyTx: string
        }
      | number
    >(async (resolve, reject) => {
      let { nftTotal, codeHash, genesis, genesisTxId, sensibleId, ..._params } = params
      let amount = 0
      const issueOperate = async () => {
        if (!params.checkOnly) {
          await this.checkNftTxIdStatus(genesisTxId!).catch(() => reject('createNFT error'))
        }
        const issueRes = await this.issueNFT({
          genesisId: genesis!,
          genesisTxid: genesisTxId!,
          codehash: codeHash!,
          sensibleId: sensibleId,
          ..._params,
        })
        if (issueRes.code === 200) {
          if (issueRes.data.amount) {
            amount += issueRes.data.amount
          }
          if (params.checkOnly) {
            resolve(Math.ceil(amount))
          } else {
            resolve({
              ...issueRes.data,
              codehash: codeHash!,
              sensibleId: sensibleId!,
              genesisId: genesis!,
              genesisTxid: genesisTxId!,
            })
          }
        } else {
          reject('createNFT error')
        }
      }
      if (!codeHash || !genesis || !genesisTxId || !sensibleId) {
        // genesisNFT
        const res = await this.genesisNFT({
          nftTotal: nftTotal ? nftTotal : '1',
          checkOnly: params.checkOnly ? true : false,
        })
        if (res.code === 200) {
          if (res.data.amount) {
            amount += res.data.amount
            codeHash = ''
            genesis = ''
            genesisTxId = ''
            sensibleId = ''
          } else {
            codeHash = res.data.codehash
            genesis = res.data.genesisId
            genesisTxId = res.data.genesisTxid
            sensibleId = res.data.sensibleId
          }
          await issueOperate()
        } else {
          reject('createNFT error')
        }
      } else {
        await issueOperate()
      }
    })
  }

  // setIssuePrams (params: NFTIssueParams) {
  //   return new Promise((resolve) => {
  //     let nfticon
  //     if (params.content.nfticon) {
  //       nfticon =  params.content.nfticon
  //       params.content.nfticon = `![metafile](0)`
  //     }
  //     if (params.content.originalFileTxid) {
  //       nfticon =  params.content.originalFileTxid
  //       params.content.originalFileTxid = `![metafile](1)`
  //     }
  //   })
  // }

  genesisNFT(params: NFTGenesisParams): Promise<SdkGenesisNFTRes> {
    return new Promise<SdkGenesisNFTRes>((resolve, reject) => {
      const _params = {
        data: {
          nftTotal: params.nftTotal,
          signersRaw: [
            {
              satotxApiPrefix: 'https://satotx.showpay.top,https://cnsatotx.showpay.top',
              satotxPubKey:
                '5b94858991d384c61ffd97174e895fcd4f62e4fea618916dc095fe4c149bbdf1188c9b33bc15cbe963a63b2522e70b80a5b722ac0e6180407917403755df4de27d69cc115c683a99face8c823cbccf73c7f0d546f1300b9ee2e96aea85542527f33b649f1885caebe19cf75d9a645807f03565c65bd4c99c8f6bb000644cfb56969eac3e9331c254b08aa279ceb64c47ef66be3f071e28b3a5a21e48cdfc3335d8b52e80a09a104a791ace6a2c1b4da88c52f9cc28c54a324e126ec91a988c1fe4e21afc8a84d0e876e01502386f74e7fc24fc32aa249075dd222361aea119d4824db2a797d58886e93bdd60556e504bb190b76a451a4e7b0431973c0410e71e808d0962415503931bbde3dfce5186b371c5bf729861f239ef626b7217d071dfd62bac877a847f2ac2dca07597a0bb9dc1969bed40606c025c4ff7b53a4a6bd921642199c16ede8165ed28da161739fa8d33f9f483212759498c1219d246092d14c9ae63808f58f03c8ca746904ba51fa326d793cea80cda411c85d35894bdb5',
            },
            {
              satotxApiPrefix: 'https://satotx2.showpay.top,https://cnsatotx2.showpay.top',
              satotxPubKey:
                '09539fcf01e83c7c649164ddd0dd42463ef10a98c665cd0d9f791446a3c4c2dd3916f6e76075b36a06f40731821f6b7dbb8bea8effa4ea461fecce4b6b2d45ca4dd923028fd6dc6ce49512616ca55f01162e5d2f85faa22ec40bc35d4978204a9b07a53f04297b886fa4abb095034f106f8ff0fd172e1e96bf7198cd5b9944ec1af32328a156877769ecabd41489a7ac858fd35cd8d93e68f33053077cf50bb397b66d160598963d1b663b3bce6371877df0e33866e4d9557b0bde7a2a930c274fa9e697d9f17ad88528ecab1be32a9d518bb950fc8264f2056d4f395fcdc12dd59cb8945013105ed52433326e3fa067237f17ab62e65557c7538e634daf11288b7eaab537abf2cc2a90159632fb9bb8fac01085b70024e01e42cd431db70d004963e46da8733c18fd5ffaaecfd67c860ae37441271ba545f86cae72690a5a3261e0125a2bf069fe28a1e1431b4cac29f8a43cbefbe22d5ae4b92441f8915881560271ee31379d365da38f1a5fa1414d6ad71943a083cce0ee45d47f81ff3c9d',
            },
            {
              satotxApiPrefix: 'https://satotx3.showpay.top,https://cnsatotx3.showpay.top',
              satotxPubKey:
                '8e37df222f9af47980ad72d31b2619b49460c7be3a4c1034c0e7f43146d80058e52bfc53b0608db5a9ec5cb832c326f785f5c4e4349cc9fd647839738f465573d1707ef84d14c41ad857a1a8e5a075ae953be4c52481ee3b8e85891613dcf99c1f7bf3a51cd67ed92f9b71d77b8517a57af5fb4e2bad7197031e00c1d8b85d0abc62fb98952d9ddfb43b47c01590ef0a365aed89b179505ccfd1d70effe4d375d5e774578434f8f9bb2281100b6e1daf8df4a40af35853c91aee2dc7f578034fa534586985e4df30b7a85efab943f68f01b46f72ced16655ac4f7e7f0439e0e6b43803dc7e262512c57ef862d41b98344ea6e725683846d91209ad87097cb4ae7092cc2c4ebd39383905e61eeaae495d8b3a57f9da8cca760b9546635cef2a8728c4209891ad1e5cbeb75d2b798f0dabd1eceaf4b297186fd2a45ed58fbaed886a4dc2f8690c9070061b9481e446319b7f0a54f9d94e7505e87e3d81bcd664ecc29acc2942361e60b30fa965cdc88185163c2857644d837c9d839bb9f6b8e6dd',
            },
            {
              satotxApiPrefix: 'https://s1.satoplay.cn,https://s1.satoplay.com',
              satotxPubKey:
                '2c8c0117aa5edba9a4539e783b6a1bdbc1ad88ad5b57f3d9c5cba55001c45e1fedb877ebc7d49d1cfa8aa938ccb303c3a37732eb0296fee4a6642b0ff1976817b603404f64c41ec098f8cd908caf64b4a3aada220ff61e252ef6d775079b69451367eda8fdb37bc55c8bfd69610e1f31b9d421ff44e3a0cfa7b11f334374827256a0b91ce80c45ffb798798e7bd6b110134e1a3c3fa89855a19829aab3922f55da92000495737e99e0094e6c4dbcc4e8d8de5459355c21ff055d039a202076e4ca263b745a885ef292eec0b5a5255e6ecc45534897d9572c3ebe97d36626c7b1e775159e00b17d03bc6d127260e13a252afd89bab72e8daf893075f18c1840cb394f18a9817913a9462c6ffc8951bee50a05f38da4c9090a4d6868cb8c955e5efb4f3be4e7cf0be1c399d78a6f6dd26a0af8492dca67843c6da9915bae571aa9f4696418ab1520dd50dd05f5c0c7a51d2843bd4d9b6b3b79910e98f3d98099fd86d71b2fac290e32bdacb31943a8384a7668c32a66be127b74390b4b0dec6455',
            },
            {
              satotxApiPrefix: 'https://satotx.metasv.com',
              satotxPubKey:
                '19d9193ee2e95d09445d28408e8a3da730b2d557cd8d39a7ae4ebbfbceb17ed5d745623529ad33d043511f3e205c1f92b6322833424d19823c3b611b3adabb74e1006e0e93a8f1e0b97ab801c6060a4c060f775998d9f003568ab4ea7633a0395eb761c36106e229394f2c271b8522a44a5ae759254f5d22927923ba85b3729460ecccca07a5556299aa7f2518814c74a2a4d48b48013d609002631f2d93c906d07077ef58d473e3d971362d1129c1ab9b8f9b1365519f0c023c1cadad5ab57240d19e256e08022fd0708951ff90a8af0655aff806c6382d0a72c13f1e52b88222d7dfc6357179b06ffcf937f9da3b0419908aa589a731e26bbaba2fa0b754bf722e338c5627b11dc24aadc4d83c35851c034936cf0df18167e856a5f0a7121d23cd48b3f8a420869a37bd1362905d7f76ff18a991f75a0f9d1bcfc18416d76691cc357cbdcc8cc0df9dbd9318a40e08adb2fb4e78b3c47bdf07eeed4f3f4e0f7e81e37460a09b857e0194c72ec03bb564b5b409d8a1b84c153186ecbb4cfdfd',
            },
          ],
          checkOnly: params.checkOnly,
          seriesName: params.seriesName,
        },
        callback: (res: SdkGenesisNFTRes) => {
          this.callback(res, resolve)
        },
      }
      if (this.isApp) {
        const functionName: string = `genesisNFTCallBack`
        // @ts-ignore
        window[functionName] = _params.callback
        if (window.appMetaIdJsV2) {
          window.appMetaIdJsV2?.genesisNFT(
            store.state.token!.access_token,
            JSON.stringify(_params.data),
            functionName
          )
        } else {
          window.appMetaIdJs?.genesisNFT(
            store.state.token!.access_token,
            JSON.stringify(_params.data),
            functionName
          )
        }
      } else {
        // @ts-ignore
        this.metaidjs?.genesisNFT(_params)
      }
    })
  }

  checkUserCanIssueNft(params: { metaId: string; address: string; language: Langs }) {
    return new Promise<boolean>((resolve, reject) => {
      fetch(
        `${import.meta.env.VITE_WalletApi}/aggregation/v2/app/nftOnShow/getMyNftIssueEligibility/${
          params.metaId
        }/${params.address}/0/${params.language}`
      )
        .then(function(response) {
          return response.json()
        })
        .then(response => {
          if (response.code === 0) {
            resolve(true)
          } else {
            ElMessage.error(response.data)
            resolve(false)
          }
        })
        .catch(() => {
          resolve(false)
        })
    })
  }

  // nft 铸造
  issueNFT(
    params: NFTIssueParams,
    parentResolve?: ((value: IssueNFTResData | PromiseLike<IssueNFTResData>) => void) | undefined
  ) {
    return new Promise<IssueNFTResData>((resolve, reject) => {
      const _params = {
        data: {
          iconType: 'pic',
          payTo: [{ address: import.meta.env.VITE_AppAddress, amount: 10000 }],
          ...params,
        },
        callback: (res: MetaIdJsRes) => {
          console.log('issueNFT res')
          console.log(res)
          // 当报错是token supply is fixed 时， 一直轮询，直到成功或其他报错
          this.callback(res, resolve)
        },
      }
      if (this.isApp) {
        const functionName: string = `issueNFTCallBack`
        // @ts-ignore
        window[functionName] = _params.callback
        try {
          if (typeof _params.data.content.classifyList === 'string') {
            _params.data.content.classifyList = JSON.parse(_params.data.content.classifyList)
          }
        } catch (error) {
          alert(JSON.stringify(error))
        }
        if (window.appMetaIdJsV2) {
          window.appMetaIdJsV2?.issueNFT(
            store.state.token!.access_token,
            JSON.stringify(_params.data),
            functionName
          )
        } else {
          window.appMetaIdJs?.issueNFT(
            store.state.token!.access_token,
            JSON.stringify(_params.data),
            functionName
          )
        }
      } else {
        // @ts-ignore
        this.metaidjs?.issueNFT(_params)
      }
    })
  }

  // metaidjs nft 购买
  nftBuy(params: NftBuyParams) {
    return new Promise<NftBuyResData>((resolve, reject) => {
      const { amount, ...data } = params
      const _params = {
        data: {
          ...data,
          payTo: [
            {
              address: import.meta.env.VITE_AppAddress,
              amount: Math.ceil(new Decimal(amount * 0.05).toNumber()),
            },
          ],
        },
        callback: (res: MetaIdJsRes) => {
          this.callback(res, resolve)
        },
      }
      if (this.isApp) {
        const functionName: string = `nftBuyCallBack`
        // @ts-ignore
        window[functionName] = _params.callback
        // @ts-ignore
        if (window.appMetaIdJsV2) {
          window.appMetaIdJsV2?.nftBuy(
            store.state.token!.access_token,
            JSON.stringify(_params.data),
            functionName
          )
        } else {
          window.appMetaIdJs?.nftBuy(
            store.state.token!.access_token,
            JSON.stringify(_params.data),
            functionName
          )
        }
      } else {
        // @ts-ignore
        this.metaidjs?.nftBuy(_params)
      }
    })
  }

  // nft 上架/销售
  nftSell(params: NftSellParams) {
    return new Promise<NftSellResData>((resolve, reject) => {
      const _params = {
        data: {
          ...params,
          payTo: [{ address: import.meta.env.VITE_AppAddress, amount: 10000 }],
        },
        callback: (res: MetaIdJsRes) => {
          this.callback(res, resolve)
        },
      }
      if (this.isApp) {
        const functionName: string = `nftSellCallBack`
        // @ts-ignore
        window[functionName] = _params.callback
        // @ts-ignore
        if (window.appMetaIdJsV2) {
          window.appMetaIdJsV2?.nftSell(
            store.state.token!.access_token,
            JSON.stringify(_params.data),
            functionName
          )
        } else {
          window.appMetaIdJs?.nftSell(
            store.state.token!.access_token,
            JSON.stringify(_params.data),
            functionName
          )
        }
      } else {
        // @ts-ignore
        this.metaidjs?.nftSell(_params)
      }
    })
  }

  // nft 下架/取消销售
  nftCancel(params: NftCancelParams) {
    return new Promise<NFTCancelResData>((resolve, reject) => {
      const _params = {
        data: {
          outputIndex: 0,
          payTo: [{ address: import.meta.env.VITE_AppAddress, amount: 10000 }],
          ...params,
        },
        callback: (res: MetaIdJsRes) => {
          this.callback(res, resolve)
        },
        // onCancel: (msg: any) => {
        //   debugger
        // }
      }
      if (this.isApp) {
        const functionName: string = `nftCancelCallBack`
        // @ts-ignore
        window[functionName] = _params.callback
        // @ts-ignore
        if (window.appMetaIdJsV2) {
          window.appMetaIdJsV2?.nftCancel(
            store.state.token!.access_token,
            JSON.stringify(_params.data),
            functionName
          )
        } else {
          window.appMetaIdJs?.nftCancel(
            store.state.token!.access_token,
            JSON.stringify(_params.data),
            functionName
          )
        }
      } else {
        // @ts-ignore
        this.metaidjs?.nftCancel(_params)
      }
    })
  }

  // nft 列表查询
  nftList(address: string) {
    return new Promise<NFTLIstRes>(resolve => {
      const params = {
        callback: (res: MetaIdJsRes) => {
          this.callback(res, resolve)
        },
        address,
      }
      if (this.isApp) {
        const functionName: string = `nftList`
        // @ts-ignore
        window[functionName] = params.callback
        // @ts-ignore
        this.appMetaidjs?.nftSell(functionName)
      } else {
        // @ts-ignore
        this.metaidjs?.nftList(params)
      }
    })
  }

  // 获取用户MC余额
  getMc(address: string) {
    return new Promise<number>((resolve, reject) => {
      fetch(`https://api.sensiblequery.com/ft/summary/${address}`)
        .then(function(response) {
          return response.json()
        })
        .then((response: GetMcRes) => {
          if (response.code === 0) {
            if (response.data) {
              const mc = response.data.find(item => {
                return (
                  item.sensibleId ===
                    '3e04f81d7fa7d4d606c3c4c8e8d3a8dcf58b5808740d40a445f3884e126bc7fd00000000' &&
                  item.codehash === '777e4dd291059c9f7a0fd563f7204576dcceb791' &&
                  item.genesis === '54256eb1b9c815a37c4af1b82791ec6bdf5b3fa3'
                )
              })
              if (mc) {
                resolve(
                  new Decimal(mc.balance + mc.pendingBalance)
                    .div(Math.pow(10, mc.decimal))
                    .toNumber()
                )
              } else {
                resolve(0)
              }
            } else {
              resolve(0)
            }
          } else {
            reject('getMc')
          }
        })
        .catch(() => {
          reject('getMc')
        })
    })
  }

  // 获取用户余额
  ftList(address: string) {
    return axios.get(`https://api.sensiblequery.com/ft/summary/${address}`)
  }

  // 获取用户余额
  getBalance() {
    return new Promise<GetBalanceRes>(resolve => {
      if (this.isApp) {
        //@ts-ignore
        window['getBalanceCallBack'] = res => {
          res = JSON.parse(res)
          const bsv = res.data
          this.callback(
            {
              code: res.code,
              data: {
                bsv: bsv,
                satoshis: new Decimal(bsv).mul(Math.pow(10, 8)),
              },
            },
            resolve
          )
        }
        if (window.appMetaIdJsV2) {
          window.appMetaIdJsV2?.getBalance(store.state.token!.access_token, 'getBalanceCallBack')
        } else {
          window.appMetaIdJs?.getBalance(store.state.token!.access_token, 'getBalanceCallBack')
        }
      } else {
        //@ts-ignore
        this.metaidjs.getBalance({
          callback: (res: GetBalanceRes) => {
            this.callback(res, resolve)
          },
        })
      }
    })
  }

  // 统一回调处理
  callback(
    res: MetaIdJsRes,
    resolve: { (value: MetaIdJsRes | PromiseLike<MetaIdJsRes>): void; (arg0: MetaIdJsRes): void }
  ) {
    if (this.isApp && typeof res === 'string') {
      try {
        res = JSON.parse(res)
      } catch (error) {
        res = {
          code: 400,
          data: {
            message: res,
          },
          status: 'fail',
          handlerId: '',
        }
      }
    }
    if (res.code !== 200 && res.code !== 205) {
      if (
        res.data.message !==
        'The NFT is not for sale because  the corresponding SellUtxo cannot be found.'
      ) {
        ElMessage.error(res.data.message)
      }
    }
    resolve(res)
  }

  // 处理附件
  setAttachments(_data: any, fileAttrs: { name: string; encrypt: string }[]) {
    return new Promise<{ data: any; attachments: any }>(resolve => {
      const attachments: {
        fileName: string
        fileType: string
        data: string
        encrypt: string
      }[] = []
      const data = { ..._data }
      fileAttrs.map((item, index) => {
        for (let i in data) {
          if (i === item.name) {
            if (typeof data[i] !== 'string') {
              attachments.push({
                fileName: data[i].name,
                fileType: data[i].data_type,
                data: data[i].hexData,
                encrypt: item.encrypt,
              })
              data[i] = `![metafile](${index})`
            }
          }
        }
      })
      resolve({ data, attachments })
    })
  }

  createNFTAuctionProtocol(params: {
    sensibleInfo: //如果type是sensible，则读取这信息
    {
      codehash: string //必须 // nft的codehash
      genesis: string //必须 // nft的genesisId
      tokenIndex: string //必须 // nft的tokenIndex
    }
    auctionDesc: string // 拍卖描述信息
    auctionContractTxId: string //nft拍卖合约txid（如果没有则为空）
    basePrice: number // 必填 // nft的起拍价 单位聪
    minPrceGap: number // 必填项，最少加价项目，单位聪
    sellPrice: number // 必须 // nft的一口价 单位聪
    availabeTime: number // 必须 //有效时间
  }) {
    return this.sendMetaDataTx({
      data: JSON.stringify({
        type: 'sensible', //token类型,如果不使用合约则为空
        ...params,
      }),
      brfcId: '123456789987654',
      path: '/Protocols/NFTAuction',
      nodeName: 'NFTAuction',
    })
  }

  createNFTAuctionBidProtocol(params: {
    sensibleInfo: //如果type是sensible，则读取这信息
    {
      codehash: string // 必须 // nft的codehash
      genesis: string // 必须 // nft的genesisId
      tokenIndex: string // 必须 // nft的tokenIndex
    }
    bidDesc: string //出价留言
    bidPrice: number //必填项 竞拍的出价
    bidTo: string //出价的拍卖 createNFTAuctionProtocol txid
    bidType: string //"bid"/"buy" “bid”为普通竞拍出价，“buy”为一口价购买
  }) {
    const mode = import.meta.env.MODE
    const address =
      mode === 'prod' ? '14VW3cDiMimxFYELo88kUbM5JtcCyP5n4c' : '13JYVkJHCpaUsMgb9eRR4qSWF5KaoHtb31'
    return this.sendMetaDataTx({
      data: JSON.stringify({
        type: 'sensible', //token类型,如果不使用合约则为空
        ...params,
      }),
      brfcId: '546dasddsd',
      path: '/Protocols/NFTAuctionBid',
      nodeName: 'NFTAuctionBid',
      payTo: [{ address, amount: params.bidPrice }],
    })
  }

  // 跳转tx详情
  toTxLink(txId: string) {
    window.open(`https://whatsonchain.com/tx/${txId}`)
  }

  // 签名
  signMessage(params: { message: string; path?: string }) {
    return new Promise<SignMessageRes>(resolve => {
      if (!params.path) params.path = '0/0'
      const callback = (res: MetaIdJsRes) => {
        if (typeof res === 'string') {
          res = JSON.parse(res)
        }
        if (res.code === 200) {
          res.data.publicKey = res.data.pubkey ? res.data.pubkey : res.data.publicKey
          res.data.result = res.data.result ? res.data.result : res.data.signMsg
        }
        this.callback(res, resolve)
      }
      if (this.isApp) {
        // @ts-ignore
        const functionName = 'signMessageCallBack'
        // @ts-ignore
        window[functionName] = callback
        if (window.appMetaIdJsV2) {
          window.appMetaIdJsV2?.signMessage(
            store.state.token!.access_token,
            JSON.stringify(params),
            functionName
          )
        } else {
          window.appMetaIdJs?.signMessage(
            store.state.token!.access_token,
            JSON.stringify(params),
            functionName
          )
        }
      } else {
        //@ts-ignore
        this.metaidjs.signMessage({
          data: params,
          callback,
        })
      }
    })
  }
}
