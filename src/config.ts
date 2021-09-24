import i18n from '@/utils/i18n'

export const nftTypes = [
  { name: i18n.global.t('image'), value: '1', disabled: false, key: 'image' },
  { name: i18n.global.t('copyright'), value: '3', disabled: true, key: 'copyright' },
  { name: i18n.global.t('inkind'), value: '2', disabled: true, key: 'inkind' },
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
    sats: Math.pow(10, 8),
  },
  {
    unit: UnitName.SATS,
    sats: Math.pow(10, 0),
  },
]

export const classifyList = [
  { classify: 'art' },
  { classify: 'card', disabled: true },
  { classify: 'alias', disabled: true },
  { classify: 'avatar', disabled: true },
  { classify: 'rights', disabled: true },
  { classify: 'game' },
]

export const pagination: Pagination = {
  page: 1,
  pageSize: 16,
  loading: false,
  nothing: false,
}

export const certedMetaIds = [
  '3c03f6b8783fa672bb34953519110944dab1d8a23711c7df4f1dd9e16e5b823c',
  '974e2977d5c9446f7f48fd82c9ea51f82749b9ef7c00d26b73bc450d167d5f31',
  'fc0a92af9977f4b3bf82492508c18ab28f666922eb8ee52dcefd5b7f2a690f83',
  '69f5a1cfa00ae301cc911978861b0e8c0dadf42486f64aabe3ffef7c94cf9490',
  '446988fc6cc0240c0a81c9e95e41183aa162a8a1aafef89dc30ef6c310ca4362',
]
