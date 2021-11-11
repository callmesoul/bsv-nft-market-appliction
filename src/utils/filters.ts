// @ts-ignore
import dayjs from 'dayjs'
import Decimal from 'decimal.js-light'

export function avatar(showId: string) {
  return `${import.meta.env.VITE_AppImgApi}/metafile/avatar/${showId}?time=${new Date().getTime()}`
}

export function dateTimeFormat(timestamp: Date, format: string = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(timestamp).format(format)
}

export function bsv(stas: number | string) {
  return new Decimal(stas).div(Math.pow(10, 8)).toString()
}
