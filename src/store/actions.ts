import { ActionTree, ActionContext } from 'vuex'

import { State } from './state'
import { Mutations, Mutation } from './mutations'
import { GetBanners, GetCertMetaIdList, GetToken, getTopics, GetUserDiscount } from '@/api'
import Sdk from '@/utils/sdk'
import { store } from '.'

export enum Action {
  initApp = 'initApp',
  initSdk = 'initSdk',
  getUserInfo = 'getUserInfo',
  refreshToken = 'refreshToken',
  checkToken = 'checkToken',
  setUserDiscount = 'setUserDiscount',
  setSystemConfig = 'setSystemConfig',
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload?: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, State>, 'commit'>

export interface Actions {
  [Action.initApp]({ state, commit, dispatch }: AugmentedActionContext): void
  [Action.initSdk]({ state, commit, dispatch }: AugmentedActionContext): void
  [Action.getUserInfo]({ state, commit, dispatch }: AugmentedActionContext): void
  [Action.refreshToken]({ state, commit, dispatch }: AugmentedActionContext): void
  [Action.checkToken]({ state, commit, dispatch }: AugmentedActionContext): void
  [Action.setUserDiscount]({ state, commit, dispatch }: AugmentedActionContext): void
  [Action.setUserDiscount]({ state, commit, dispatch }: AugmentedActionContext): void
  [Action.setSystemConfig]({ state, commit, dispatch }: AugmentedActionContext): void
}

export const actions: ActionTree<State, State> & Actions = {
  [Action.initApp]({ state, commit, dispatch }) {
    console.log('app inited!')
  },
  [Action.initSdk]({ state, commit, dispatch }) {
    state.sdkInitIng = true
    state.userInfoLoading = true
    state.sdk = new Sdk({
      baseUri: import.meta.env.VITE_AuthUrl,
      oauthSettings: {
        clientId: import.meta.env.VITE_AppId,
        redirectUri: import.meta.env.VITE_Hosts + import.meta.env.VITE_RedirectPath,
        clientSecret: import.meta.env.VITE_AppSecret,
      },
      onLoaded: () => {
        state.sdkInitIng = false
        dispatch(Action.getUserInfo)
      },
      onError: () => {
        commit(Mutation.LOGOUT)
        state.sdkInitIng = false
        state.userInfoLoading = false
        state.sdk = null
      },
    })
  },
  async [Action.getUserInfo]({ state, commit, dispatch }) {
    const res = await state.sdk?.getUserInfo()
    if (res && res.code === 200) {
      commit(Mutation.SETUSERINFO, res.data)
      if (state.isApp && res.appAccessToken) {
        commit(Mutation.SETTOKEN, {
          access_token: res.appAccessToken,
        })
      }
      // 中心化登陆
      commit(Mutation.NFTLOGIN)
      dispatch(Action.setUserDiscount)
    } else {
      state.sdkInitIng = false
      state.userInfoLoading = false
      commit(Mutation.LOGOUT)
    }
    // state.sdk?.getUserInfo({
    //   accessToken: state.token ? state.token?.access_token : '',
    //   callback: (res: { data: UserInfo }) => {
    //     commit(Mutation.SETUSERINFO, res.data)
    //   }
    // })
  },
  [Action.refreshToken]({ state, commit, dispatch }) {
    return new Promise<void>(async (resolve, reject) => {
      if (state.token) {
        const res = await refreshToken(state.token!.refresh_token!).catch(() => {
          reject('refresh_token fail')
        })
        if (res) {
          commit(Mutation.SETTOKEN, res)
          resolve()
        } else {
          new Error('refresh_token fail')
          reject('refresh_token fail')
        }
      } else {
        new Error('refresh_token fail')
        reject('refresh_token fail')
      }
    })
  },
  [Action.checkToken]({ state, commit, dispatch }) {
    return new Promise<string | null>(async resolve => {
      if (state.token) {
        const now = new Date().getTime()
        if (now < state.token.expires_time!) {
          const res = await refreshToken(state.token?.refresh_token!).catch(() => {
            commit(Mutation.SETTOKEN, undefined)
            resolve(null)
          })
          if (res) {
            commit(Mutation.SETTOKEN, res)
            resolve(res.access_token)
          } else {
            new Error('refresh_token fail')
            resolve(null)
          }
        } else {
          resolve(state.token.access_token)
        }
      } else {
        resolve(null)
      }
    })
  },
  [Action.setUserDiscount]({ state, commit, dispatch }) {
    return new Promise<string | null>(async resolve => {
      const res = await GetUserDiscount({
        metaId: state.userInfo?.metaId,
        zeroAddress: state.userInfo?.address,
      })
      if (res.code === 0) {
        state.userDiscount = parseFloat(res.data.nosRate)
      }
    })
  },
  [Action.setSystemConfig]({ state, commit, dispatch }) {
    return new Promise<void>(async resolve => {
      state.isSetedSystemConfig = true
      const result = await Promise.all([GetCertMetaIdList(), GetBanners(), getTopics()]).catch(
        () => {
          state.isSetedSystemConfig = false
        }
      )
      if (result) {
        if (result[0].code === 0) {
          state.isCertedMetaIds = result[0].data
        }
        if (result[1].code === 0) {
          state.banners = result[1].data.result
        }
        if (result[2].code === 0) {
          state.topics = result[2].data.result
        }
      }
      resolve()
    })
  },
}

function refreshToken(refresh_token: string) {
  return new Promise<Token>(async (resolve, reject) => {
    const res = await GetToken({
      grant_type: 'refresh_token',
      client_id: import.meta.env.VITE_AppId,
      client_secret: import.meta.env.VITE_AppSecret,
      refresh_token: refresh_token,
    }).catch(() => {
      store.commit(Mutation.LOGOUT)
    })
    if (res) {
      resolve(res)
    } else {
      new Error('refresh_token fail')
      reject('refresh_token fail')
    }
  })
}
