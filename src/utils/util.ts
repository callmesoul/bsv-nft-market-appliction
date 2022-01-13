import { Buffer } from 'buffer'
import { Action, store } from '@/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import i18n from '@/utils/i18n'
import { router } from '@/router'
import {
  GetMyNftEligibility,
  GetNFTGenesisInfo,
  GetSeries,
  Langs,
  NftApiCode,
  QueryFindMetaDataForPost,
} from '@/api'
import { rejects } from 'assert'

export function tranfromImgFile(file: File) {
  return new Promise<MetaFile>((resolve, reject) => {
    const fileType = file.type
    const reader = new FileReader()
    let fileBinary: string
    reader.onload = () => {
      const arrayBuffer = reader.result
      let buffer: string = ''
      let hex: string = ''
      if (arrayBuffer) {
        // @ts-ignore
        buffer = Buffer.from(arrayBuffer)
        // @ts-ignore
        hex = buffer.toString('hex')
        fileBinary = buffer
      }
      const fileData = 'data:' + fileType + ';base64,' + hexToBase64(hex)
      const imgData: MetaFile = {
        base64Data: fileData,
        BufferData: fileBinary,
        hexData: hex,
        name: file.name,
        raw: file,
        data_type: fileType,
      }
      /*
            fileBinary二进制流
            fileData 图片base64编码
            fileType 文件名
            */
      resolve(imgData)
    }
    reader.onerror = error => {
      new Error(`handleFileChange error /n ${error}`)
      reject(reject)
    }
    reader.readAsArrayBuffer(file)
  })
}

// 转换为图片
export function hexToBase64(str: string) {
  if (!str) {
    return 'https://showjob.oss-cn-hangzhou.aliyuncs.com/index/img_photo_default.png'
  }
  var a = []
  for (let i = 0, len = str.length; i < len; i += 2) {
    a.push(parseInt(str.substr(i, 2), 16))
  }
  var binary = ''
  var bytes = new Uint8Array(a)
  var len = bytes.byteLength
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const sty = window.btoa(binary)
  return sty
}

export function checkSdkStatus() {
  return new Promise<void>((resolve, reject) => {
    const token = store.state.token
    if (!token) {
      ElMessage.warning(i18n.global.t('toLoginTip'))
      reject()
    } else {
      if (store.state.sdkInitIng) {
        ElMessage.warning(i18n.global.t('loginingTip'))
        reject()
      } else {
        if (!store.state.sdk) {
          ElMessage.warning(i18n.global.t('toLoginTip'))
          reject()
        }
      }
    }
    resolve()
  })
}

export function metafileUrl(metafile: string, width: number = 235) {
  if (typeof metafile !== 'string') return ''
  metafile = metafile.replace('metafile://', '')
  if (metafile === '') return ''
  return `${
    import.meta.env.VITE_AppImgApi
  }/metafile/${metafile}?x-oss-process=image/auto-orient,1/resize,m_lfit,w_${width}/quality,q_80`
}

export function checkTxIdStatus(txId: string) {
  return new Promise(resolve => {})
}

export function setDataStrclassify(data: any) {
  const classify =
    data && data.classifyList instanceof Array
      ? data.classifyList
      : data && typeof data.classifyList === 'string' && data.classifyList !== ''
      ? JSON.parse(data.classifyList)
      : []
  return classify
}

// 去用户中心
export function ToUser(metaId: string) {
  if (store.state.userInfo && store.state.userInfo.metaId === metaId) {
    router.push({ name: 'self' })
  } else {
    router.push({
      name: 'user',
      params: {
        metaId,
      },
    })
  }
}

// 检查是否可以铸造的逻辑
export function checkUserCanIssueNft() {
  return new Promise<boolean>(async resolve => {
    if (import.meta.env.MODE === 'prod' || import.meta.env.MODE === 'gray') {
      const result = await store.state.sdk
        ?.checkUserCanIssueNft({
          metaId: store.state.userInfo!.metaId,
          address: store.state.userInfo!.address,
          language: i18n.global.locale.value === 'en' ? Langs.EN : Langs.CN,
        })
        .catch(() => {
          resolve(false)
        })
      if (result) {
        resolve(true)
      } else {
        resolve(false)
      }
    } else {
      resolve(true)
    }
  })
}

export function getMyNftEligibility(IssueMetaId: string) {
  return new Promise(async resolve => {
    if (import.meta.env.MODE === 'prod' || import.meta.env.MODE === 'gray') {
      const res = await GetMyNftEligibility({
        MetaId: store.state.userInfo!.metaId,
        lang: i18n.global.locale.value === 'en' ? Langs.EN : Langs.CN,
        IssueMetaId,
      }).catch(() => {
        resolve(false)
      })
      // @ts-ignore
      if (res?.code === 0) {
        resolve(true)
      } else {
        // @ts-ignore
        ElMessage.error(res?.data)
        resolve(false)
      }
    } else {
      resolve(true)
    }
  })
}

export function confirmToSendMetaData(amount: number) {
  return new Promise<boolean>(async (resolve, reject) => {
    const userBalanceRes = await store.state.sdk?.getBalance().catch(() => {
      ElMessage.error(i18n.global.t('getBalanceFail'))
      reject()
    })
    if (userBalanceRes && userBalanceRes.code === 200 && userBalanceRes.data.satoshis > amount) {
      ElMessageBox.confirm(
        `${i18n.global.t('useAmountTips')}: ${amount} SATS`,
        i18n.global.t('niceWarning'),
        {
          confirmButtonText: i18n.global.t('confirm'),
          cancelButtonText: i18n.global.t('cancel'),
          closeOnClickModal: false,
        }
      )
        .then(async () => {
          resolve(true)
        })
        .catch(() => {
          reject()
        })
    } else {
      ElMessageBox.alert(
        `
          <p>${i18n.global.t('useAmountTips')}: ${amount} SATS</p>
          <p>${i18n.global.t('insufficientBalance')}</p>
        `,
        {
          confirmButtonText: i18n.global.t('confirm'),
          dangerouslyUseHTMLString: true,
        }
      )
      reject()
    }
  })
}

// export function getUserSeries() {
//   return new Promise<any[]>(async (resolve, reject) => {
//     try {
//       const res = await GetSeries({ page: 1, pageSize: 99 })
//       if (res.code === NftApiCode.success) {
//         for (let i = 0; i < res.data.length; i++) {
//           const getSeriesInfoRes = await GetNFTGenesisInfo({
//             codehash: res.data[i].codeHash,
//             genesis: res.data[i].genesis,
//           })
//           if (getSeriesInfoRes.code === 0) {
//             res.data[i].currentNumber = getSeriesInfoRes.data.count
//           }
//         }
//         resolve(res.data)
//       } else {
//         reject()
//       }
//     } catch (error) {
//       ElMessage.error(i18n.global.t('getSeriesFail'))
//       reject(error)
//     }
//   })
// }

export function getUserSeries() {
  return new Promise(async resolve => {
    const res = await QueryFindMetaDataForPost({
      find: {
        parentNodeName: 'nftGenesis',
        'data.totalSupply': { $gt: 1 },
        'data.seriesName': { $exists: true },
        rootTxId: store.state.userInfo.metaId,
      },
      skip: 0,
      limit: 999,
      sort: { timestamp: -1 },
    })
    if (res.code === 200) {
      res.result.data
    }
  })
}

export function sleep(timer: number = 1000) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, timer)
  })
}

/**
 * @function 处理完用户信息的回调。已处理完reslov,未登陆返回reject
 * 用户处理需要获取用户信息后再可进行的操作
 */
export function checkUserInfoFinish() {
  return new Promise<void>((resolve, reject) => {
    if (store.state.token) {
      if (store.state.userInfo) {
        resolve()
      } else {
        if (store.state.sdkInitIng) {
          let watchUserInfo: any
          let setTimeOutUserInfo: any
          // 设置定时，处理异常
          setTimeOutUserInfo = setTimeout(() => {
            watchUserInfo() // 移除监听
            ElMessage.warning(i18n.global.t('toLoginTip'))
            router.push('/')
            reject()
          }, 50000)
          watchUserInfo = store.watch(
            state => state.userInfo,
            newVal => {
              if (newVal) {
                watchUserInfo() // 移除监听
                clearTimeout(setTimeOutUserInfo) // 定时器
                resolve()
              }
            }
          )
        } else {
          ElMessage.warning(i18n.global.t('toLoginTip'))
          router.push('/')
          reject()
        }
      }
    } else {
      ElMessage.warning(i18n.global.t('toLoginTip'))
      router.push('/')
      reject()
    }
  })
}
