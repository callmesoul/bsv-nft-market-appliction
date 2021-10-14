import i18n from '@/utils/i18n'
import yadiannaBanner from '@/assets/images/banner_yadianna.jpg'
import metabotBanner from '@/assets/images/banner_metabot.jpg'

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

export const canCreateCardClassifyListMetaids = [
  'aaf66589caf185d6840a51cd47a91cb2fbf831c0eb6a4c32ab31f3e3b3fa5bc2',
  'baac7625edf7a3dcc28385917a6fc9a72798ffd3657da8bc22ce59fdeb3b35e0',
]
export const classifyList: Classify[] = [
  { classify: 'art' },
  {
    classify: 'card',
    disabled: true,
  },
  { classify: 'alias', disabled: true },
  { classify: 'avatar', disabled: true },
  { classify: 'rights', disabled: true },
  { classify: 'game' },
]

// 市集分类
export const countryFairClassifyList: Classify[] = [
  { classify: 'art' },
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
  'aaf66589caf185d6840a51cd47a91cb2fbf831c0eb6a4c32ab31f3e3b3fa5bc2',
  'baac7625edf7a3dcc28385917a6fc9a72798ffd3657da8bc22ce59fdeb3b35e0',
]

export const topics: Topic[] = [
  {
    cover: yadiannaBanner,
    name: 'Bitcoin SV Athena Astronaut 雅典娜',
    createrMetaId: '',
    createrName: '₿itcoin A Studio',
    time: '2021-10-08',
    key: 'Athena',
  },
  {
    cover: metabotBanner,
    name: 'MetaID首个头像NFT-MetaBot',
    createrMetaId: '974e2977d5c9446f7f48fd82c9ea51f82749b9ef7c00d26b73bc450d167d5f31',
    createrName: 'ShowPayTeam',
    time: '2021-09-08',
    key: 'MetaBot',
  },
]
