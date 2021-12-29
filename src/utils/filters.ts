// @ts-ignore
import dayjs from 'dayjs'
import Decimal from 'decimal.js-light'
import i18n from './i18n'

export function avatar(showId: string) {
  return `${import.meta.env.VITE_AppImgApi}/metafile/avatar/${showId}?time=${new Date().getTime()}`
}

export function dateTimeFormat(timestamp: Date, format: string = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(timestamp).format(format)
}

export function bsv(stas: number | string) {
  if (typeof stas === 'undefined') return '--'
  return new Decimal(stas).div(Math.pow(10, 8)).toString()
}

export function assetsUrl(metafile: string) {
  if (typeof metafile !== 'string') return ''
  metafile = metafile.replace('metafile://', '')
  if (metafile === '') return ''
  return `${import.meta.env.VITE_ShowMan}/metafile/${metafile}`
}

/**
 * @function 获取对象对应i18n内容
 * @description 获取对象对应i18n内容
 * @param object 获取对应字段所在的对象
 * @param key 对应字段前缀，例如 introJp = intro
 * @param option 需要替换的配置，因为后端返回的翻译字段不一定对应前端字段，后端中文标识是cn 而前端是zh 则可以传 {'zh': 'cn'} 解决
 * _________________ _________________
 * | 年龄 | 姓名 | | 年龄 | 姓名 |
 * ----------------- mergeCells(grid,[0]) -----------------
 * | 18 | 张三 | => | | 张三 |
 * ----------------- - 18 ---------
 * | 18 | 王五 | | | 王五 |
 * ----------------- -----------------
 */
export function getI18nContent(object: any, key: string, option?: any) {
  let localeValue = i18n.global.locale.value
  if (option) {
    for (let i in option) {
      if (localeValue === i) {
        localeValue = option[i]
        break
      }
    }
  }
  const i18nKey = `${key}${localeValue.slice(0, 1).toLocaleUpperCase()}${localeValue.slice(
    1,
    i18n.global.locale.value.length
  )}`
  if (object && object[i18nKey]) {
    return object[i18nKey]
  } else {
    return ''
  }
}
