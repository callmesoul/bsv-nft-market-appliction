import { Buffer } from 'buffer'
import { Action, store } from '@/store'
import { ElMessage } from 'element-plus'
import i18n from '@/utils/i18n'
import { GetMyNftEligibility, Langs } from '@/api'

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

export function metafileUrl(metafile: string) {
  if (typeof metafile !== 'string') return ''
  metafile = metafile.replace('metafile://', '')
  if (metafile === '') return ''
  return `${import.meta.env.VITE_ShowMan}/metafile/${metafile}`
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
      if (res?.code === 0) {
        resolve(true)
      } else {
        ElMessage.error(res?.data)
        resolve(false)
      }
    } else {
      resolve(true)
    }
  })
}
