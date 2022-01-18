import i18n from '@/utils/i18n'

export const nftTypes = [
  { name: i18n.global.t('image'), value: '1', disabled: false, key: 'image' },
  { name: i18n.global.t('inkind'), value: '2', disabled: true, key: 'inkind' },
  { name: i18n.global.t('copyright'), value: '3', disabled: true, key: 'copyright' },
]
export enum UnitName {
  SATS = 'SATS',
  BSV = 'BSV',
}
export interface Unit {
  unit: string
  sats: number
}
export const units: Unit[] = [
  {
    unit: UnitName.BSV,
    sats: 0.00000001,
  },
  {
    unit: UnitName.SATS,
    sats: Math.pow(10, 8),
  },
]

export const pagination: Pagination = {
  page: 1,
  pageSize: 16,
  loading: false,
  nothing: false,
}
